import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { ArrowLeft, Calculator, TrendingUp, Delete } from "lucide-react";
import { motion } from "framer-motion";

type CalcMode = "standard" | "gain";

export default function CalculatorPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { incrementQuest } = useDailyQuests();
  const [mode, setMode] = useState<CalcMode>("standard");

  // Standard calculator
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [calcUsed, setCalcUsed] = useState(false);

  // Gain % calculator
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const en = language === "en";

  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);
    if (prevValue !== null && !waitingForOperand) {
      const result = calculate(prevValue, current, operator!);
      setDisplay(String(result));
      setPrevValue(result);
    } else {
      setPrevValue(current);
    }
    setOperator(op);
    setWaitingForOperand(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prevValue === null || operator === null) return;
    const current = parseFloat(display);
    const result = calculate(prevValue, current, operator);
    setDisplay(String(parseFloat(result.toFixed(10))));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    if (!calcUsed) {
      setCalcUsed(true);
      incrementQuest("calculator");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleToggleSign = () => {
    const val = parseFloat(display);
    setDisplay(String(-val));
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const gainResult = () => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const qty = parseFloat(quantity);
    if (isNaN(buy) || isNaN(sell) || buy === 0) return null;
    const hasQty = !isNaN(qty) && qty > 0;
    const invested = buy * (hasQty ? qty : 1);
    const current = sell * (hasQty ? qty : 1);
    const profit = current - invested;
    const percent = ((sell - buy) / buy) * 100;
    if (!calcUsed) { setCalcUsed(true); incrementQuest("calculator"); }
    return { invested, current, profit, percent, hasQty };
  };

  const gr = mode === "gain" ? gainResult() : null;

  const inputClass = "w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50";

  const calcBtn = (label: string, onClick: () => void, variant: "num" | "op" | "special" = "num") => {
    const base = "flex items-center justify-center rounded-xl text-lg font-semibold transition-all active:scale-95 h-14";
    const styles = {
      num: "bg-card border border-border text-foreground",
      op: "bg-primary/15 text-primary border border-primary/20",
      special: "bg-secondary text-muted-foreground",
    };
    return (
      <button key={label} onClick={onClick} className={`${base} ${styles[variant]}`}>
        {label}
      </button>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "Retour"}
      </button>

      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-primary" />
        {en ? "Calculator" : "Calculatrice"}
      </h1>

      {/* Mode tabs - 2 buttons */}
      <div className="flex gap-1 p-1 bg-card rounded-xl border border-border mb-6">
        <button
          onClick={() => setMode("standard")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${mode === "standard" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          <Calculator className="w-3.5 h-3.5" />
          {en ? "Calculator" : "Calculatrice"}
        </button>
        <button
          onClick={() => setMode("gain")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${mode === "gain" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Gain %
        </button>
      </div>

      {mode === "standard" && (
        <motion.div key="standard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="bg-card rounded-2xl border border-border p-5 text-right">
            {operator && prevValue !== null && (
              <p className="text-xs text-muted-foreground mb-1">{prevValue} {operator}</p>
            )}
            <p className="text-3xl font-bold text-foreground truncate">{display}</p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {calcBtn("C", handleClear, "special")}
            {calcBtn("±", handleToggleSign, "special")}
            {calcBtn("%", handlePercent, "special")}
            {calcBtn("÷", () => handleOperator("÷"), "op")}

            {calcBtn("7", () => handleDigit("7"))}
            {calcBtn("8", () => handleDigit("8"))}
            {calcBtn("9", () => handleDigit("9"))}
            {calcBtn("×", () => handleOperator("×"), "op")}

            {calcBtn("4", () => handleDigit("4"))}
            {calcBtn("5", () => handleDigit("5"))}
            {calcBtn("6", () => handleDigit("6"))}
            {calcBtn("-", () => handleOperator("-"), "op")}

            {calcBtn("1", () => handleDigit("1"))}
            {calcBtn("2", () => handleDigit("2"))}
            {calcBtn("3", () => handleDigit("3"))}
            {calcBtn("+", () => handleOperator("+"), "op")}

            {calcBtn("0", () => handleDigit("0"))}
            {calcBtn(".", handleDecimal)}
            <button onClick={handleBackspace} className="flex items-center justify-center rounded-xl h-14 bg-card border border-border text-foreground">
              <Delete className="w-5 h-5" />
            </button>
            <button onClick={handleEquals} className="flex items-center justify-center rounded-xl h-14 bg-gradient-primary text-primary-foreground text-lg font-bold">
              =
            </button>
          </div>
        </motion.div>
      )}

      {mode === "gain" && (
        <motion.div key="gain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{en ? "Buy Price ($)" : "Prix d'achat ($)"}</label>
            <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder="0.00" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{en ? "Sell Price ($)" : "Prix de vente ($)"}</label>
            <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="0.00" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{en ? "Quantity (optional)" : "Quantité (optionnel)"}</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" className={inputClass} />
          </div>

          {gr && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-5 space-y-3">
              {gr.hasQty && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{en ? "Invested" : "Investi"}</span>
                    <span className="text-foreground font-medium">${gr.invested.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{en ? "Current Value" : "Valeur actuelle"}</span>
                    <span className="text-foreground font-medium">${gr.current.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className={`${gr.hasQty ? "border-t border-border pt-3" : ""} flex justify-between`}>
                <span className="text-sm font-semibold text-foreground">{en ? "Profit / Loss" : "Gain / Perte"}</span>
                <div className="text-right">
                  {gr.hasQty && (
                    <p className={`font-bold ${gr.profit >= 0 ? "text-success" : "text-danger"}`}>
                      {gr.profit >= 0 ? "+" : ""}${gr.profit.toFixed(2)}
                    </p>
                  )}
                  <p className={`text-2xl font-bold ${gr.percent >= 0 ? "text-success" : "text-danger"}`}>
                    {gr.percent >= 0 ? "+" : ""}{gr.percent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
