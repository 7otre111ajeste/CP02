import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { ArrowLeft, Calculator, TrendingUp, Percent, Hash, Delete } from "lucide-react";
import { motion } from "framer-motion";

type CalcMode = "standard" | "profit" | "percentage";

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

  // Profit calculator
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Percentage calculator
  const [initialValue, setInitialValue] = useState("");
  const [finalValue, setFinalValue] = useState("");

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

  const profitResult = () => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const qty = parseFloat(quantity);
    if (isNaN(buy) || isNaN(sell) || isNaN(qty) || buy === 0) return null;
    const invested = buy * qty;
    const current = sell * qty;
    const profit = current - invested;
    const percent = ((sell - buy) / buy) * 100;
    if (!calcUsed) { setCalcUsed(true); incrementQuest("calculator"); }
    return { invested, current, profit, percent };
  };

  const percentResult = () => {
    const init = parseFloat(initialValue);
    const final_ = parseFloat(finalValue);
    if (isNaN(init) || isNaN(final_) || init === 0) return null;
    const change = final_ - init;
    const percent = (change / init) * 100;
    if (!calcUsed) { setCalcUsed(true); incrementQuest("calculator"); }
    return { change, percent };
  };

  const pr = mode === "profit" ? profitResult() : null;
  const pcr = mode === "percentage" ? percentResult() : null;

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
        <ArrowLeft className="w-4 h-4" /> {language === "en" ? "Back" : "Retour"}
      </button>

      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-primary" />
        {language === "en" ? "Calculator" : "Calculatrice"}
      </h1>

      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-card rounded-xl border border-border mb-6">
        <button
          onClick={() => setMode("standard")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${mode === "standard" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          <Hash className="w-3.5 h-3.5" />
          Standard
        </button>
        <button
          onClick={() => setMode("profit")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${mode === "profit" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          {language === "en" ? "Profit" : "Gain"}
        </button>
        <button
          onClick={() => setMode("percentage")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${mode === "percentage" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          <Percent className="w-3.5 h-3.5" />
          %
        </button>
      </div>

      {mode === "standard" && (
        <motion.div key="standard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {/* Display */}
          <div className="bg-card rounded-2xl border border-border p-5 text-right">
            {operator && prevValue !== null && (
              <p className="text-xs text-muted-foreground mb-1">{prevValue} {operator}</p>
            )}
            <p className="text-3xl font-bold text-foreground truncate">{display}</p>
          </div>

          {/* Keypad */}
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

      {mode === "profit" && (
        <motion.div key="profit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === "en" ? "Buy Price ($)" : "Prix d'achat ($)"}</label>
            <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder="0.00" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === "en" ? "Sell Price ($)" : "Prix de vente ($)"}</label>
            <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="0.00" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === "en" ? "Quantity" : "Quantité"}</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className={inputClass} />
          </div>

          {pr && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{language === "en" ? "Invested" : "Investi"}</span>
                <span className="text-foreground font-medium">${pr.invested.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{language === "en" ? "Current Value" : "Valeur actuelle"}</span>
                <span className="text-foreground font-medium">${pr.current.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-sm font-semibold text-foreground">{language === "en" ? "Profit / Loss" : "Gain / Perte"}</span>
                <div className="text-right">
                  <p className={`font-bold ${pr.profit >= 0 ? "text-success" : "text-danger"}`}>
                    {pr.profit >= 0 ? "+" : ""}${pr.profit.toFixed(2)}
                  </p>
                  <p className={`text-xs font-medium ${pr.percent >= 0 ? "text-success" : "text-danger"}`}>
                    {pr.percent >= 0 ? "+" : ""}{pr.percent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {mode === "percentage" && (
        <motion.div key="percent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === "en" ? "Initial Value ($)" : "Valeur initiale ($)"}</label>
            <input type="number" value={initialValue} onChange={(e) => setInitialValue(e.target.value)} placeholder="0.00" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{language === "en" ? "Final Value ($)" : "Valeur finale ($)"}</label>
            <input type="number" value={finalValue} onChange={(e) => setFinalValue(e.target.value)} placeholder="0.00" className={inputClass} />
          </div>

          {pcr && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{language === "en" ? "Change" : "Variation"}</span>
                <span className={`font-bold ${pcr.change >= 0 ? "text-success" : "text-danger"}`}>
                  {pcr.change >= 0 ? "+" : ""}${pcr.change.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-foreground">{language === "en" ? "Percentage" : "Pourcentage"}</span>
                <span className={`text-2xl font-bold ${pcr.percent >= 0 ? "text-success" : "text-danger"}`}>
                  {pcr.percent >= 0 ? "+" : ""}{pcr.percent.toFixed(2)}%
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
