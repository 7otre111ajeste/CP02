import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, Users, Crown, Coins, LogOut, UserPlus, ChevronRight, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Clan {
  id: string;
  name: string;
  description: string;
  emoji: string;
  leader_id: string;
  treasury_points: number;
  max_members: number;
  created_at: string;
  members: ClanMember[];
  leader_username?: string;
}

interface ClanMember {
  id: string;
  clan_id: string;
  user_id: string;
  role: string;
  points_contributed: number;
  joined_at: string;
  username?: string;
  avatar_emoji?: string;
}

const CLAN_COST = 200;
const SLOT_COST = 150;

export default function ClansPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { points, spendPoints, shopPurchases } = useUserProgress();
  const en = language === "en";

  const [clans, setClans] = useState<Clan[]>([]);
  const [myClan, setMyClan] = useState<Clan | null>(null);
  const [myMembership, setMyMembership] = useState<ClanMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newEmoji, setNewEmoji] = useState("⚔️");
  const [depositAmount, setDepositAmount] = useState("");
  const [view, setView] = useState<"browse" | "my-clan">("browse");

  const CLAN_EMOJIS = ["⚔️", "🛡️", "🐉", "🦁", "🔥", "💎", "👑", "🚀", "⭐", "🏴‍☠️"];

  const fetchClans = useCallback(async () => {
    setLoading(true);
    const { data: clansData } = await supabase.from("clans").select("*").order("created_at", { ascending: false });
    if (!clansData) { setLoading(false); return; }

    const { data: allMembers } = await supabase.from("clan_members").select("*");
    const clanIds = clansData.map((c) => c.id);
    const memberUserIds = [...new Set((allMembers || []).map((m) => m.user_id).concat(clansData.map((c) => c.leader_id)))];
    const { data: profiles } = await supabase.from("profiles").select("user_id, username, avatar_emoji").in("user_id", memberUserIds);
    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

    const enriched = clansData.map((clan) => {
      const members = (allMembers || []).filter((m) => m.clan_id === clan.id).map((m) => ({
        ...m,
        username: profileMap.get(m.user_id)?.username || "User",
        avatar_emoji: profileMap.get(m.user_id)?.avatar_emoji || "👤",
      }));
      return {
        ...clan,
        members,
        leader_username: profileMap.get(clan.leader_id)?.username || "User",
      };
    });

    setClans(enriched);

    if (user) {
      const myMemberRow = (allMembers || []).find((m) => m.user_id === user.id);
      if (myMemberRow) {
        setMyMembership(myMemberRow);
        const clan = enriched.find((c) => c.id === myMemberRow.clan_id);
        setMyClan(clan || null);
        setView("my-clan");
      }
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchClans(); }, [fetchClans]);

  const hasClanPass = shopPurchases.includes("create-clan");
  const createCost = hasClanPass ? 0 : CLAN_COST;

  const handleCreateClan = async () => {
    if (!user || creating) return;
    if (!newName.trim()) { toast.error(en ? "Enter a clan name" : "Entrez un nom de clan"); return; }
    if (createCost > 0 && points < createCost) { toast.error(en ? `Need ${createCost} points` : `Il faut ${createCost} points`); return; }

    setCreating(true);
    try {
      if (createCost > 0) {
        const success = spendPoints(createCost);
        if (!success) { setCreating(false); return; }
      }

      const { data: clan, error } = await supabase.from("clans").insert({
        name: newName.trim(),
        description: newDesc.trim(),
        emoji: newEmoji,
        leader_id: user.id,
      }).select().single();

      if (error || !clan) { toast.error(en ? "Failed to create clan" : "Erreur de création"); setCreating(false); return; }

      await supabase.from("clan_members").insert({
        clan_id: clan.id,
        user_id: user.id,
        role: "leader",
      });

      toast.success(en ? "Clan created! 🎉" : "Clan créé ! 🎉");
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
      fetchClans();
    } finally {
      setCreating(false);
    }
  };

  const handleJoinClan = async (clanId: string) => {
    if (!user) return;
    if (myMembership) { toast.error(en ? "Leave your current clan first" : "Quittez d'abord votre clan actuel"); return; }
    
    const clan = clans.find((c) => c.id === clanId);
    if (!clan) return;
    if (clan.members.length >= clan.max_members) { toast.error(en ? "Clan is full" : "Clan complet"); return; }

    const { error } = await supabase.from("clan_members").insert({
      clan_id: clanId,
      user_id: user.id,
      role: "member",
    });
    if (error) { toast.error(en ? "Failed to join" : "Erreur"); return; }
    toast.success(en ? "Joined clan! 🎉" : "Clan rejoint ! 🎉");
    fetchClans();
  };

  const handleLeaveClan = async () => {
    if (!user || !myMembership) return;
    if (myClan?.leader_id === user.id) { toast.error(en ? "Leaders can't leave. Transfer leadership first." : "Le chef ne peut pas quitter. Transférez d'abord."); return; }

    await supabase.from("clan_members").delete().eq("user_id", user.id);
    setMyMembership(null);
    setMyClan(null);
    setView("browse");
    toast.success(en ? "Left clan" : "Clan quitté");
    fetchClans();
  };

  const handleDeposit = async () => {
    if (!user || !myClan) return;
    const amount = parseInt(depositAmount);
    if (!amount || amount <= 0) return;
    if (points < amount) { toast.error(en ? "Not enough points" : "Pas assez de points"); return; }

    const success = spendPoints(amount);
    if (!success) return;

    // Add XP for contributing (1 XP per 2 points deposited)
    try {
      const progress = JSON.parse(localStorage.getItem("cryptopedia-progress") || '{}');
      progress.exp = (progress.exp || 0) + Math.floor(amount / 2);
      progress.level = Math.floor(progress.exp / 200) + 1;
      localStorage.setItem("cryptopedia-progress", JSON.stringify(progress));
    } catch {}

    await supabase.from("clans").update({ treasury_points: myClan.treasury_points + amount }).eq("id", myClan.id);
    await supabase.from("clan_members").update({ points_contributed: (myMembership?.points_contributed || 0) + amount }).eq("user_id", user.id);

    toast.success(en ? `+${amount} points deposited! +${Math.floor(amount / 2)} XP earned` : `+${amount} points déposés ! +${Math.floor(amount / 2)} XP gagné`);
    setDepositAmount("");
    fetchClans();
  };

  const handleBuySlots = async () => {
    if (!user || !myClan || myClan.leader_id !== user.id) return;
    if (myClan.treasury_points < SLOT_COST) { toast.error(en ? `Need ${SLOT_COST} treasury points` : `Il faut ${SLOT_COST} points de trésor`); return; }

    await supabase.from("clans").update({
      treasury_points: myClan.treasury_points - SLOT_COST,
      max_members: myClan.max_members + 5,
    }).eq("id", myClan.id);

    toast.success(en ? "+5 slots added!" : "+5 places ajoutées !");
    fetchClans();
  };

  if (loading) {
    return (
      <div className="px-4 pt-4 pb-28 max-w-lg mx-auto">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-card border border-border animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "Retour"}
      </button>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            {en ? "Clans" : "Clans"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {en ? "Join forces with other players" : "Unissez vos forces avec d'autres joueurs"}
          </p>
        </div>
        {!myMembership && user && (
          <button onClick={() => setShowCreate(!showCreate)} className="p-2.5 rounded-xl bg-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      {myClan && (
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setView("my-clan")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors ${view === "my-clan" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}
          >
            {en ? "My Clan" : "Mon Clan"}
          </button>
          <button
            onClick={() => setView("browse")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors ${view === "browse" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}
          >
            {en ? "Browse" : "Explorer"}
          </button>
        </div>
      )}

      {/* Create Clan Form */}
      {showCreate && (
        <div className="bg-card border border-border rounded-2xl p-4 mb-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{en ? "Create a Clan" : "Créer un Clan"}</h3>
          <p className="text-[10px] text-muted-foreground">
            {hasClanPass ? (en ? "Free (Shop pass owned)" : "Gratuit (Pass boutique)") : (en ? `Cost: ${CLAN_COST} points` : `Coût : ${CLAN_COST} points`)}
          </p>
          <div className="flex gap-2">
            {CLAN_EMOJIS.map((e) => (
              <button key={e} onClick={() => setNewEmoji(e)} className={`text-xl p-1 rounded-lg ${newEmoji === e ? "bg-primary/20 ring-1 ring-primary" : "hover:bg-secondary"}`}>{e}</button>
            ))}
          </div>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={en ? "Clan name" : "Nom du clan"} className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground" maxLength={30} />
          <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder={en ? "Description (optional)" : "Description (optionnel)"} className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground" maxLength={100} />
          <button onClick={handleCreateClan} disabled={creating} className="w-full py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-semibold disabled:opacity-50">
            {creating ? (en ? "Creating..." : "Création...") : hasClanPass ? (en ? "Create (Free)" : "Créer (Gratuit)") : (en ? `Create (${CLAN_COST} pts)` : `Créer (${CLAN_COST} pts)`)}
          </button>
        </div>
      )}

      {/* My Clan View */}
      {view === "my-clan" && myClan && (
        <div className="space-y-4">
          <div className="bg-gradient-card rounded-2xl p-5 border border-border glow-primary text-center">
            <p className="text-4xl mb-2">{myClan.emoji}</p>
            <h2 className="text-xl font-bold text-foreground">{myClan.name}</h2>
            {myClan.description && <p className="text-xs text-muted-foreground mt-1">{myClan.description}</p>}
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="text-center">
                <p className="text-lg font-bold text-warning">{myClan.treasury_points}</p>
                <p className="text-[9px] text-muted-foreground">{en ? "Treasury" : "Trésor"}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{myClan.members.length}/{myClan.max_members}</p>
                <p className="text-[9px] text-muted-foreground">{en ? "Members" : "Membres"}</p>
              </div>
            </div>
          </div>

          {/* Deposit */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-warning" />
              {en ? "Deposit Points" : "Déposer des Points"}
            </h3>
            <p className="text-[10px] text-muted-foreground mb-2">{en ? "Earn 1 XP per 2 points deposited" : "Gagnez 1 XP par 2 points déposés"}</p>
            <div className="flex gap-2">
              <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="0" className="flex-1 px-3 py-2 rounded-xl bg-secondary border border-border text-sm text-foreground" min="1" />
              <button onClick={handleDeposit} className="px-4 py-2 rounded-xl bg-warning/15 text-warning text-xs font-semibold border border-warning/20">
                {en ? "Deposit" : "Déposer"}
              </button>
            </div>
          </div>

          {/* Leader actions */}
          {myClan.leader_id === user?.id && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-warning" />
                {en ? "Leader Actions" : "Actions du Chef"}
              </h3>
              <button onClick={handleBuySlots} className="w-full py-2.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <UserPlus className="w-3.5 h-3.5 inline mr-1" />
                {en ? `+5 Slots (${SLOT_COST} treasury pts)` : `+5 Places (${SLOT_COST} pts trésor)`}
              </button>
            </div>
          )}

          {/* Members */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              {en ? "Members" : "Membres"}
            </h3>
            <div className="space-y-2">
              {myClan.members.map((m) => (
                <button key={m.id} onClick={() => navigate(`/user/${m.user_id}`)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all text-left">
                  <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-lg">{m.avatar_emoji || "👤"}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-foreground">{m.username}</p>
                      {m.role === "leader" && <Crown className="w-3 h-3 text-warning" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{m.points_contributed} pts {en ? "contributed" : "contribués"}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* Leave */}
          {myClan.leader_id !== user?.id && (
            <button onClick={handleLeaveClan} className="w-full py-2.5 rounded-xl bg-danger/10 text-danger border border-danger/20 text-xs font-semibold flex items-center justify-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              {en ? "Leave Clan" : "Quitter le Clan"}
            </button>
          )}
        </div>
      )}

      {/* Browse Clans */}
      {view === "browse" && (
        <div className="space-y-3">
          {clans.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{en ? "No clans yet. Create the first one!" : "Aucun clan. Créez le premier !"}</p>
            </div>
          ) : (
            clans.map((clan) => {
              const isFull = clan.members.length >= clan.max_members;
              const isMember = clan.members.some((m) => m.user_id === user?.id);
              return (
                <div key={clan.id} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl flex-shrink-0">{clan.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm">{clan.name}</h3>
                      {clan.description && <p className="text-[10px] text-muted-foreground truncate">{clan.description}</p>}
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" /> {clan.members.length}/{clan.max_members}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Crown className="w-3 h-3 text-warning" /> {clan.leader_username}
                        </span>
                      </div>
                    </div>
                    {!isMember && user && !myMembership && (
                      <button
                        onClick={() => handleJoinClan(clan.id)}
                        disabled={isFull}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${isFull ? "bg-secondary text-muted-foreground" : "bg-primary/15 text-primary border border-primary/20"}`}
                      >
                        {isFull ? (en ? "Full" : "Complet") : (en ? "Join" : "Rejoindre")}
                      </button>
                    )}
                    {isMember && (
                      <span className="text-xs text-success font-semibold">{en ? "Joined" : "Rejoint"}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {!user && (
        <div className="text-center py-10 bg-card rounded-xl border border-border mt-5">
          <p className="text-sm text-muted-foreground">{en ? "Sign in to join or create clans" : "Connectez-vous pour rejoindre ou créer des clans"}</p>
        </div>
      )}
    </motion.div>
  );
}
