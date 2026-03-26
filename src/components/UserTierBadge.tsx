import { Crown, Shield, User } from "lucide-react";

type UserTier = "free" | "premium" | "vip";

interface UserTierBadgeProps {
  tier: UserTier;
  size?: "sm" | "md";
}

const TIER_CONFIG = {
  free: {
    label: "Free",
    icon: User,
    classes: "bg-secondary text-muted-foreground border-border",
  },
  premium: {
    label: "Premium",
    icon: Shield,
    classes: "bg-primary/15 text-primary border-primary/30",
  },
  vip: {
    label: "VIP",
    icon: Crown,
    classes: "bg-warning/15 text-warning border-warning/30",
  },
};

export default function UserTierBadge({ tier, size = "sm" }: UserTierBadgeProps) {
  const config = TIER_CONFIG[tier];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.classes} ${
      size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
    }`}>
      <Icon className={size === "sm" ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} />
      {config.label}
    </span>
  );
}
