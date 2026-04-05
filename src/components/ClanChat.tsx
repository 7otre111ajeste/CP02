import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  sent_at: string;
  username?: string;
  avatar_emoji?: string;
}

export default function ClanChat({ clanId }: { clanId: string }) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const en = language === "en";
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [profileMap, setProfileMap] = useState<Map<string, { username: string; avatar_emoji: string }>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);

  const enrichMessages = (msgs: any[], map: Map<string, any>) => {
    return msgs.map((m) => ({
      ...m,
      username: map.get(m.user_id)?.username || "User",
      avatar_emoji: map.get(m.user_id)?.avatar_emoji || "👤",
    }));
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("clan_messages")
        .select("*")
        .eq("clan_id", clanId)
        .order("sent_at", { ascending: true })
        .limit(100);

      if (!data) return;

      const userIds = [...new Set(data.map((m) => m.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, avatar_emoji")
        .in("user_id", userIds);

      const map = new Map((profiles || []).map((p) => [p.user_id, p]));
      setProfileMap(map);
      setMessages(enrichMessages(data, map));
    };
    fetchMessages();
  }, [clanId]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`clan-chat-${clanId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "clan_messages", filter: `clan_id=eq.${clanId}` },
        async (payload) => {
          const newMessage = payload.new as any;
          // Fetch profile if not in map
          let map = profileMap;
          if (!map.has(newMessage.user_id)) {
            const { data: profiles } = await supabase
              .from("profiles")
              .select("user_id, username, avatar_emoji")
              .eq("user_id", newMessage.user_id)
              .single();
            if (profiles) {
              const newMap = new Map(map);
              newMap.set(profiles.user_id, profiles);
              setProfileMap(newMap);
              map = newMap;
            }
          }
          setMessages((prev) => [
            ...prev,
            {
              ...newMessage,
              username: map.get(newMessage.user_id)?.username || "User",
              avatar_emoji: map.get(newMessage.user_id)?.avatar_emoji || "👤",
            },
          ]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [clanId, profileMap]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!user || !newMsg.trim() || sending) return;
    setSending(true);
    const { error } = await supabase.from("clan_messages").insert({
      clan_id: clanId,
      user_id: user.id,
      message: newMsg.trim(),
    });
    if (error) {
      toast.error(en ? "Failed to send" : "Échec de l'envoi");
    }
    setNewMsg("");
    setSending(false);
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <MessageCircle className="w-3.5 h-3.5 text-primary" />
        {en ? "Clan Chat" : "Chat du Clan"}
      </h3>

      <div ref={scrollRef} className="h-56 overflow-y-auto space-y-2 mb-3 scrollbar-thin">
        {messages.length === 0 ? (
          <p className="text-[10px] text-muted-foreground text-center py-10">
            {en ? "No messages yet. Say hello! 👋" : "Aucun message. Dites bonjour ! 👋"}
          </p>
        ) : (
          messages.map((m) => {
            const isMe = m.user_id === user?.id;
            return (
              <div key={m.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                {!isMe && <span className="text-sm mt-1">{m.avatar_emoji}</span>}
                <div className={`max-w-[75%] ${isMe ? "ml-auto" : ""}`}>
                  {!isMe && <p className="text-[9px] text-muted-foreground mb-0.5">{m.username}</p>}
                  <div className={`px-3 py-1.5 rounded-2xl text-xs ${isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                    {m.message}
                  </div>
                  <p className={`text-[8px] text-muted-foreground mt-0.5 ${isMe ? "text-right" : ""}`}>
                    {formatTime(m.sent_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={en ? "Message..." : "Message..."}
          className="flex-1 px-3 py-2 rounded-xl bg-secondary border border-border text-xs text-foreground"
          maxLength={500}
        />
        <button
          onClick={handleSend}
          disabled={sending || !newMsg.trim()}
          className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
