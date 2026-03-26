import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calculator, TrendingUp, Percent } from "lucide-react";
import { motion } from "framer-motion";

type CalcMode = "profit" | "percentage";

export default function CalculatorPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<CalcMode>("profit");

  // Profit calculator
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Percentage calculator
  const [initialValue, setInitialValue] = useState("");
  const [finalValue, setFinalValue] = useState("");

  const profitResult = () => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const qty = parseFloat(quantity);
    if (isNaN(buy) || isNaN(sell) || isNaN(qty) || buy === 0) return null;
    const invested = buy * qty;
    const current = sell * qty;
    const profit = current - invested;
    const percent = ((sell - buy) / buy) * 100;
    return { invested, current, profit, percent };
  };

  const percentResult = () => {
    const init = parseFloat(initialValue);
    const final_ = parseFloat(finalValue);
    if (isNaN(init) || isNaN(final_) || init === 0) return null;
    const change = final_ - init;
    const percent = (change / init) * 100;
    return { change, percent };
  };

  const pr = profitResult();
  const pcr = percentResult();

  const inputClass = "w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50";

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
          onClick={() => setMode("profit")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${mode === "profit" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          {language === "en" ? "Profit / Loss" : "Gain / Perte"}
        </button>
        <button
          onClick={() => setMode("percentage")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${mode === "percentage" ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          <Percent className="w-3.5 h-3.5" />
          {language === "en" ? "% Change" : "% Variation"}
        </button>
      </div>

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
