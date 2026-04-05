import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { History, Coins } from "lucide-react";

interface Deposit {
  id: string;
  user_id: string;
  amount: number;
  deposited_at: string;
  username?: string;
  avatar_emoji?: string;
}

export default function ClanDepositHistory({ clanId }: { clanId: string }) {
  const { language } = useLanguage();
  const en = language === "en";
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeposits = async () => {
      const { data } = await supabase
        .from("clan_deposits")
        .select("*")
        .eq("clan_id", clanId)
        .order("deposited_at", { ascending: false })
        .limit(50);

      if (!data) { setLoading(false); return; }

      const userIds = [...new Set(data.map((d) => d.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, avatar_emoji")
        .in("user_id", userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      setDeposits(
        data.map((d) => ({
          ...d,
          username: profileMap.get(d.user_id)?.username || "User",
          avatar_emoji: profileMap.get(d.user_id)?.avatar_emoji || "👤",
        }))
      );
      setLoading(false);
    };
    fetchDeposits();
  }, [clanId]);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return en ? "Just now" : "À l'instant";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <History className="w-3.5 h-3.5 text-primary" />
        {en ? "Deposit History" : "Historique des Dépôts"}
      </h3>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-secondary animate-pulse" />
          ))}
        </div>
      ) : deposits.length === 0 ? (
        <p className="text-[10px] text-muted-foreground text-center py-4">
          {en ? "No deposits yet" : "Aucun dépôt encore"}
        </p>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {deposits.map((d) => (
            <div key={d.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
              <span className="text-sm">{d.avatar_emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-foreground truncate">{d.username}</p>
              </div>
              <div className="flex items-center gap-1 text-warning">
                <Coins className="w-3 h-3" />
                <span className="text-xs font-bold">+{d.amount}</span>
              </div>
              <span className="text-[9px] text-muted-foreground">{timeAgo(d.deposited_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
