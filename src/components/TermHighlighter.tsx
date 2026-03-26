import { useState, Fragment } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { dictionaryTerms } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";

interface TermHighlighterProps {
  text: string;
  className?: string;
}

export default function TermHighlighter({ text, className = "" }: TermHighlighterProps) {
  const { language } = useLanguage();
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  // Build a list of terms to match (case-insensitive)
  const terms = dictionaryTerms.map((t) => ({
    id: t.id,
    word: t.term[language],
    definition: t.definition[language],
  }));

  // Sort by length desc so longer terms match first
  const sorted = [...terms].sort((a, b) => b.word.length - a.word.length);

  // Split text into segments: matched terms and plain text
  type Segment = { type: "text"; value: string } | { type: "term"; value: string; id: string; definition: string };
  const segments: Segment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliestIndex = remaining.length;
    let matchedTerm: (typeof sorted)[0] | null = null;

    for (const term of sorted) {
      const idx = remaining.toLowerCase().indexOf(term.word.toLowerCase());
      if (idx !== -1 && idx < earliestIndex) {
        earliestIndex = idx;
        matchedTerm = term;
      }
    }

    if (matchedTerm && earliestIndex < remaining.length) {
      if (earliestIndex > 0) {
        segments.push({ type: "text", value: remaining.slice(0, earliestIndex) });
      }
      segments.push({
        type: "term",
        value: remaining.slice(earliestIndex, earliestIndex + matchedTerm.word.length),
        id: matchedTerm.id,
        definition: matchedTerm.definition,
      });
      remaining = remaining.slice(earliestIndex + matchedTerm.word.length);
    } else {
      segments.push({ type: "text", value: remaining });
      remaining = "";
    }
  }

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === "text") return <Fragment key={i}>{seg.value}</Fragment>;
        return (
          <span key={i} className="relative inline">
            <span
              className="underline decoration-dotted decoration-primary/50 text-primary/80 cursor-help"
              onMouseEnter={() => setActiveTerm(seg.id)}
              onMouseLeave={() => setActiveTerm(null)}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTerm(activeTerm === seg.id ? null : seg.id);
              }}
            >
              {seg.value}
            </span>
            <AnimatePresence>
              {activeTerm === seg.id && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute left-0 bottom-full mb-1 z-50 w-56 p-2.5 rounded-lg bg-popover border border-border shadow-lg block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[11px] font-semibold text-foreground block mb-1">{seg.value}</span>
                  <span className="text-[10px] text-muted-foreground leading-relaxed block">{seg.definition}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}
