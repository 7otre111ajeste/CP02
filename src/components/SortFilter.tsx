import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type SortField = "name" | "price" | "change" | "marketCap" | "volume" | "year" | "rank";
export type SortDirection = "asc" | "desc";

interface SortFilterProps {
  fields: { value: SortField; label: string }[];
  current: SortField;
  direction: SortDirection;
  onChange: (field: SortField, dir: SortDirection) => void;
}

export default function SortFilter({ fields, current, direction, onChange }: SortFilterProps) {
  const [open, setOpen] = useState(false);

  const currentLabel = fields.find((f) => f.value === current)?.label ?? current;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border text-xs font-medium text-foreground hover:border-primary/30 transition-colors"
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        {currentLabel}
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute right-0 top-full mt-1 z-50 w-44 bg-popover border border-border rounded-xl shadow-lg overflow-hidden"
            >
              {fields.map((field) => {
                const isActive = current === field.value;
                return (
                  <button
                    key={field.value}
                    onClick={() => {
                      if (isActive) {
                        onChange(field.value, direction === "asc" ? "desc" : "asc");
                      } else {
                        onChange(field.value, "desc");
                      }
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {field.label}
                    {isActive && (
                      <span className="text-[10px] text-muted-foreground">
                        {direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
