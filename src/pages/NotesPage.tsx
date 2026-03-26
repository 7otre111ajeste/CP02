import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, StickyNote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

function loadNotes(): Note[] {
  try {
    const saved = localStorage.getItem("cryptopedia-notes");
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

export default function NotesPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [editing, setEditing] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    localStorage.setItem("cryptopedia-notes", JSON.stringify(notes));
  }, [notes]);

  const handleNew = () => {
    setEditing(null);
    setTitle("");
    setContent("");
    setEditing({ id: `note-${Date.now()}`, title: "", content: "", createdAt: Date.now() });
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    const note: Note = {
      id: editing?.id || `note-${Date.now()}`,
      title: title.trim() || (language === "en" ? "Untitled" : "Sans titre"),
      content: content.trim(),
      createdAt: editing?.createdAt || Date.now(),
    };
    setNotes((prev) => {
      const exists = prev.find((n) => n.id === note.id);
      if (exists) return prev.map((n) => (n.id === note.id ? note : n));
      return [note, ...prev];
    });
    setEditing(null);
    setTitle("");
    setContent("");
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editing?.id === id) {
      setEditing(null);
      setTitle("");
      setContent("");
    }
  };

  const handleEdit = (note: Note) => {
    setEditing(note);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {language === "en" ? "Back" : "Retour"}
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <StickyNote className="w-6 h-6 text-primary" />
          {language === "en" ? "My Notes" : "Mes Notes"}
        </h1>
        <button onClick={handleNew} className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold">
          <Plus className="w-4 h-4" /> {language === "en" ? "New" : "Nouveau"}
        </button>
      </div>

      {editing && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-4 mb-6 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={language === "en" ? "Note title..." : "Titre de la note..."}
            className="w-full bg-transparent text-foreground font-semibold text-sm placeholder:text-muted-foreground focus:outline-none border-b border-border pb-2"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={language === "en" ? "Write your notes here..." : "Écrivez vos notes ici..."}
            rows={6}
            className="w-full bg-transparent text-foreground text-sm placeholder:text-muted-foreground focus:outline-none resize-none leading-relaxed"
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold">
              {language === "en" ? "Save" : "Sauvegarder"}
            </button>
            <button onClick={() => { setEditing(null); setTitle(""); setContent(""); }} className="px-4 py-2 rounded-xl bg-secondary text-foreground text-sm">
              {language === "en" ? "Cancel" : "Annuler"}
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {notes.length === 0 && !editing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <StickyNote className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{language === "en" ? "No notes yet. Tap + to create one!" : "Pas encore de notes. Appuyez sur + pour en créer !"}</p>
            </motion.div>
          )}
          {notes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-card rounded-xl border border-border p-4 flex gap-3 items-start"
            >
              <button onClick={() => handleEdit(note)} className="flex-1 text-left min-w-0">
                <h3 className="font-semibold text-sm text-foreground truncate">{note.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{note.content}</p>
                <p className="text-[10px] text-muted-foreground/50 mt-2">{new Date(note.createdAt).toLocaleDateString()}</p>
              </button>
              <button onClick={() => handleDelete(note.id)} className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
