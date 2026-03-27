import FloatingLanguageToggle from "./FloatingLanguageToggle";
import FloatingNotes from "./FloatingNotes";

export default function PageToolbar() {
  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5">
      <FloatingNotes />
      <FloatingLanguageToggle />
    </div>
  );
}
