import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCryptoMarket, MarketCoin } from "@/hooks/useCryptoMarket";
import { ArrowLeft, Plus, Trash2, Target, TrendingUp, TrendingDown, ChevronDown, Search, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ScoreBadge from "@/components/ScoreBadge";
import StatusTag from "@/components/StatusTag";
import { cryptoProjects } from "@/data/mockData";

interface Transaction {
  id: string;
  type: "buy" | "sell";
  amount: number; // token amount
  pricePerToken: number;
  totalCost: number;
  date: string; // ISO
}

interface PortfolioEntry {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  transactions: Transaction[];
  goalAmount?: number; // target token count
  goalType?: "tokens" | "usd";
}

interface PortfolioData {
  entries: PortfolioEntry[];
}

function loadPortfolio(): PortfolioData {
  try {
    const saved = localStorage.getItem("cryptopedia-portfolio");
    if (saved) return JSON.parse(saved);
  } catch {}
  return { entries: [] };
}

function savePortfolio(data: PortfolioData) {
  localStorage.setItem("cryptopedia-portfolio", JSON.stringify(data));
}

function formatUsd(n: number): string {
  if (Math.abs(n) >= 1000) return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return "$" + n.toFixed(2);
}

function formatPct(n: number): string {
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}

export default function PortfolioPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { data: marketCoins } = useCryptoMarket();
  const [portfolio, setPortfolio] = useState<PortfolioData>(loadPortfolio);
  const [showAddCoin, setShowAddCoin] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [showAddTx, setShowAddTx] = useState(false);
  const [txType, setTxType] = useState<"buy" | "sell">("buy");
  const [txInputMode, setTxInputMode] = useState<"tokens" | "usd">("usd");
  const [txAmount, setTxAmount] = useState("");
  const [txPrice, setTxPrice] = useState("");
  const [showGoal, setShowGoal] = useState<string | null>(null);
  const [goalInput, setGoalInput] = useState("");
  const [goalType, setGoalType] = useState<"tokens" | "usd">("tokens");
  const [pnlPeriod, setPnlPeriod] = useState<"all" | "daily" | "weekly" | "monthly">("all");
  const [showPnlChart, setShowPnlChart] = useState<string | null>(null);

  // Match coin IDs to mockData projects for badges
  const getProjectData = (coinId: string) => {
    const nameMap: Record<string, string> = {
      bitcoin: "Bitcoin", ethereum: "Ethereum", solana: "Solana", cardano: "Cardano",
      "binancecoin": "BNB", ripple: "XRP", dogecoin: "Dogecoin", polkadot: "Polkadot",
      avalanche: "Avalanche", chainlink: "Chainlink", tron: "TRON", litecoin: "Litecoin",
    };
    const name = nameMap[coinId];
    return cryptoProjects.find(p => p.name === name || p.id === coinId || p.symbol.toLowerCase() === coinId);
  };

  useEffect(() => {
    savePortfolio(portfolio);
  }, [portfolio]);

  const priceMap = useMemo(() => {
    const m: Record<string, MarketCoin> = {};
    marketCoins?.forEach((c) => { m[c.id] = c; });
    return m;
  }, [marketCoins]);

  const addCoin = (coin: MarketCoin) => {
    if (portfolio.entries.find((e) => e.coinId === coin.id)) {
      toast.error(language === "en" ? "Already in portfolio" : "Déjà dans le portfolio");
      return;
    }
    setPortfolio((prev) => ({
      entries: [...prev.entries, {
        coinId: coin.id,
        coinName: coin.name,
        coinSymbol: coin.symbol.toUpperCase(),
        coinImage: coin.image,
        transactions: [],
      }],
    }));
    setShowAddCoin(false);
    setSearchQ("");
    toast.success(language === "en" ? `${coin.name} added!` : `${coin.name} ajouté !`);
  };

  const removeCoin = (coinId: string) => {
    setPortfolio((prev) => ({ entries: prev.entries.filter((e) => e.coinId !== coinId) }));
    if (selectedEntry === coinId) setSelectedEntry(null);
  };

  const addTransaction = (coinId: string) => {
    const amountNum = parseFloat(txAmount);
    const priceNum = parseFloat(txPrice);
    if (!amountNum || amountNum <= 0 || !priceNum || priceNum <= 0) return;

    const tokenAmount = txInputMode === "usd" ? amountNum / priceNum : amountNum;
    const totalCost = txInputMode === "usd" ? amountNum : amountNum * priceNum;

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: txType,
      amount: tokenAmount,
      pricePerToken: priceNum,
      totalCost,
      date: new Date().toISOString(),
    };

    setPortfolio((prev) => ({
      entries: prev.entries.map((e) =>
        e.coinId === coinId ? { ...e, transactions: [...e.transactions, tx] } : e
      ),
    }));
    setTxAmount("");
    setTxPrice("");
    setShowAddTx(false);
    toast.success(language === "en"
      ? `${txType === "buy" ? "Buy" : "Sell"} recorded!`
      : `${txType === "buy" ? "Achat" : "Vente"} enregistré !`);
  };

  const removeTransaction = (coinId: string, txId: string) => {
    setPortfolio((prev) => ({
      entries: prev.entries.map((e) =>
        e.coinId === coinId ? { ...e, transactions: e.transactions.filter((t) => t.id !== txId) } : e
      ),
    }));
  };

  const setGoal = (coinId: string) => {
    const val = parseFloat(goalInput);
    if (!val || val <= 0) return;
    setPortfolio((prev) => ({
      entries: prev.entries.map((e) =>
        e.coinId === coinId ? { ...e, goalAmount: val, goalType } : e
      ),
    }));
    setShowGoal(null);
    setGoalInput("");
  };

  const calcEntryPnl = (entry: PortfolioEntry) => {
    const livePrice = priceMap[entry.coinId]?.current_price ?? 0;
    let totalTokens = 0;
    let totalInvested = 0;
    let totalSold = 0;

    entry.transactions.forEach((tx) => {
      if (tx.type === "buy") {
        totalTokens += tx.amount;
        totalInvested += tx.totalCost;
      } else {
        totalTokens -= tx.amount;
        totalSold += tx.totalCost;
      }
    });

    const currentValue = totalTokens * livePrice;
    const pnl = currentValue + totalSold - totalInvested;
    const pnlPct = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;
    const avgBuyPrice = entry.transactions.filter((t) => t.type === "buy").reduce((s, t) => s + t.totalCost, 0) /
      Math.max(entry.transactions.filter((t) => t.type === "buy").reduce((s, t) => s + t.amount, 0), 0.0001);

    return { totalTokens, totalInvested, totalSold, currentValue, pnl, pnlPct, avgBuyPrice, livePrice };
  };

  const totalPortfolioPnl = useMemo(() => {
    let totalInv = 0, totalVal = 0, totalSold = 0;
    portfolio.entries.forEach((e) => {
      const p = calcEntryPnl(e);
      totalInv += p.totalInvested;
      totalVal += p.currentValue;
      totalSold += p.totalSold;
    });
    const pnl = totalVal + totalSold - totalInv;
    const pct = totalInv > 0 ? (pnl / totalInv) * 100 : 0;
    return { totalInv, totalVal, pnl, pct };
  }, [portfolio, priceMap]);

  const filteredCoins = (marketCoins ?? []).filter((c) =>
    c.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    c.symbol.toLowerCase().includes(searchQ.toLowerCase())
  ).slice(0, 20);

  const entry = portfolio.entries.find((e) => e.coinId === selectedEntry);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {language === "en" ? "Back" : "Retour"}
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-1">
        {language === "en" ? "Portfolio Calculator" : "Calculateur Portfolio"}
      </h1>
      <p className="text-xs text-muted-foreground mb-5">
        {language === "en" ? "Track your crypto investments & PnL" : "Suivez vos investissements crypto & PnL"}
      </p>

      {/* Total PnL Summary */}
      {portfolio.entries.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-4 mb-5">
          <p className="text-xs text-muted-foreground mb-1">{language === "en" ? "Total Portfolio" : "Portfolio Total"}</p>
          <p className="text-2xl font-bold text-foreground">{formatUsd(totalPortfolioPnl.totalVal)}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm font-semibold ${totalPortfolioPnl.pnl >= 0 ? "text-success" : "text-danger"}`}>
              {totalPortfolioPnl.pnl >= 0 ? <TrendingUp className="w-3.5 h-3.5 inline mr-1" /> : <TrendingDown className="w-3.5 h-3.5 inline mr-1" />}
              {formatUsd(totalPortfolioPnl.pnl)} ({formatPct(totalPortfolioPnl.pct)})
            </span>
            <span className="text-[10px] text-muted-foreground">
              {language === "en" ? `Invested: ${formatUsd(totalPortfolioPnl.totalInv)}` : `Investi: ${formatUsd(totalPortfolioPnl.totalInv)}`}
            </span>
          </div>
        </div>
      )}

      {/* Entries list */}
      <div className="space-y-3 mb-4">
        {portfolio.entries.map((e) => {
          const pnl = calcEntryPnl(e);
          const liveCoin = priceMap[e.coinId];
          const goalProgress = e.goalAmount
            ? e.goalType === "tokens"
              ? (pnl.totalTokens / e.goalAmount) * 100
              : (pnl.currentValue / e.goalAmount) * 100
            : null;

          return (
            <motion.div key={e.coinId} layout className="bg-card border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setSelectedEntry(selectedEntry === e.coinId ? null : e.coinId)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <img src={e.coinImage} alt={e.coinName} className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm text-foreground">{e.coinName}</p>
                    <span className="text-[10px] text-muted-foreground">{e.coinSymbol}</span>
                    {(() => {
                      const proj = getProjectData(e.coinId);
                      return proj ? <ScoreBadge score={proj.score} /> : null;
                    })()}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {pnl.totalTokens.toFixed(4)} {e.coinSymbol} • {language === "en" ? "Avg" : "Moy"}: {formatUsd(pnl.avgBuyPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{formatUsd(pnl.currentValue)}</p>
                  <button
                    onClick={(ev) => { ev.stopPropagation(); setShowPnlChart(showPnlChart === e.coinId ? null : e.coinId); }}
                    className={`text-[10px] font-medium ${pnl.pnl >= 0 ? "text-success" : "text-danger"} hover:underline`}
                  >
                    {formatPct(pnl.pnlPct)}
                  </button>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${selectedEntry === e.coinId ? "rotate-180" : ""}`} />
              </button>

              {/* Goal progress bar */}
              {goalProgress !== null && (
                <div className="px-4 pb-2">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {language === "en" ? "Goal" : "Objectif"}</span>
                    <span>{Math.min(goalProgress, 100).toFixed(0)}% — {e.goalType === "tokens" ? `${pnl.totalTokens.toFixed(2)}/${e.goalAmount}` : `${formatUsd(pnl.currentValue)}/${formatUsd(e.goalAmount!)}`}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(goalProgress, 100)}%` }} />
                  </div>
                </div>
              )}

              {/* Expanded detail */}
              <AnimatePresence>
                {selectedEntry === e.coinId && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                      {/* Project badges & link */}
                      {(() => {
                        const proj = getProjectData(e.coinId);
                        if (!proj) return null;
                        return (
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusTag type="halal" status={proj.halalStatus} />
                            <StatusTag type="safety" status={proj.safetyStatus} />
                            <button
                              onClick={() => navigate(`/project/${proj.id}`)}
                              className="text-[10px] text-primary flex items-center gap-1 hover:underline ml-auto"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {language === "en" ? "Details" : "Détails"}
                            </button>
                          </div>
                        );
                      })()}

                      {/* Mini PnL Sparkline Chart */}
                      <AnimatePresence>
                        {showPnlChart === e.coinId && liveCoin?.sparkline_in_7d?.price && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="bg-secondary/50 rounded-xl p-3">
                              <p className="text-[10px] text-muted-foreground mb-2">{language === "en" ? "7-Day Price Chart" : "Graphique 7 jours"}</p>
                              <div className="h-20 flex items-end gap-[1px]">
                                {(() => {
                                  const prices = liveCoin.sparkline_in_7d.price;
                                  const sampled = prices.filter((_, i) => i % Math.max(1, Math.floor(prices.length / 60)) === 0);
                                  const min = Math.min(...sampled);
                                  const max = Math.max(...sampled);
                                  const range = max - min || 1;
                                  const isUp = sampled[sampled.length - 1] >= sampled[0];
                                  return sampled.map((p, i) => (
                                    <div
                                      key={i}
                                      className={`flex-1 rounded-t-sm ${isUp ? "bg-success/60" : "bg-danger/60"}`}
                                      style={{ height: `${((p - min) / range) * 100}%`, minHeight: "2px" }}
                                      title={`$${p.toFixed(2)}`}
                                    />
                                  ));
                                })()}
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-[9px] text-muted-foreground">{language === "en" ? "7 days ago" : "Il y a 7 jours"}</span>
                                <span className="text-[9px] text-muted-foreground">{language === "en" ? "Now" : "Maintenant"}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* PnL details */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-secondary/50 rounded-xl p-2.5">
                          <p className="text-[10px] text-muted-foreground">{language === "en" ? "Invested" : "Investi"}</p>
                          <p className="text-xs font-semibold text-foreground">{formatUsd(pnl.totalInvested)}</p>
                        </div>
                        <div className="bg-secondary/50 rounded-xl p-2.5">
                          <p className="text-[10px] text-muted-foreground">{language === "en" ? "Current Value" : "Valeur actuelle"}</p>
                          <p className="text-xs font-semibold text-foreground">{formatUsd(pnl.currentValue)}</p>
                        </div>
                        <button
                          onClick={() => setShowPnlChart(showPnlChart === e.coinId ? null : e.coinId)}
                          className="bg-secondary/50 rounded-xl p-2.5 text-left hover:bg-secondary/70 transition-colors cursor-pointer ring-1 ring-primary/20"
                        >
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            PnL <TrendingUp className="w-2.5 h-2.5 text-primary" />
                            <span className="text-[8px] text-primary">{language === "en" ? "tap for chart" : "voir graphique"}</span>
                          </p>
                          <p className={`text-xs font-semibold ${pnl.pnl >= 0 ? "text-success" : "text-danger"}`}>{formatUsd(pnl.pnl)}</p>
                        </button>
                        <div className="bg-secondary/50 rounded-xl p-2.5">
                          <p className="text-[10px] text-muted-foreground">{language === "en" ? "Live Price" : "Prix actuel"}</p>
                          <p className="text-xs font-semibold text-foreground">{formatUsd(pnl.livePrice)}</p>
                        </div>
                      </div>

                      {/* Transactions */}
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-2 font-medium uppercase">{language === "en" ? "Transactions" : "Transactions"}</p>
                        {e.transactions.length === 0 && (
                          <p className="text-xs text-muted-foreground italic">{language === "en" ? "No transactions yet" : "Aucune transaction"}</p>
                        )}
                        {e.transactions.map((tx) => (
                          <div key={tx.id} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${tx.type === "buy" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                              {tx.type === "buy" ? (language === "en" ? "BUY" : "ACHAT") : (language === "en" ? "SELL" : "VENTE")}
                            </span>
                            <span className="text-xs text-foreground flex-1">
                              {tx.amount.toFixed(4)} @ {formatUsd(tx.pricePerToken)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</span>
                            <button onClick={() => removeTransaction(e.coinId, tx.id)} className="text-muted-foreground hover:text-danger">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setShowAddTx(true); setTxType("buy"); setTxPrice(pnl.livePrice.toString()); }}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-success/15 text-success border border-success/20"
                        >
                          {language === "en" ? "+ Buy" : "+ Achat"}
                        </button>
                        <button
                          onClick={() => { setShowAddTx(true); setTxType("sell"); setTxPrice(pnl.livePrice.toString()); }}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-danger/15 text-danger border border-danger/20"
                        >
                          {language === "en" ? "+ Sell" : "+ Vente"}
                        </button>
                        <button
                          onClick={() => { setShowGoal(e.coinId); setGoalInput(e.goalAmount?.toString() ?? ""); }}
                          className="py-2 px-3 rounded-xl text-xs font-semibold bg-primary/15 text-primary border border-primary/20"
                          title={language === "en" ? "Set Goal" : "Définir un objectif"}
                        >
                          <Target className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeCoin(e.coinId)}
                          className="py-2 px-3 rounded-xl text-xs font-semibold bg-danger/10 text-danger border border-danger/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Add Transaction Modal */}
                      <AnimatePresence>
                        {showAddTx && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="bg-secondary/60 rounded-xl p-3 space-y-2 border border-border">
                            <p className="text-xs font-semibold text-foreground">
                              {txType === "buy" ? (language === "en" ? "Add Buy" : "Ajouter un achat") : (language === "en" ? "Add Sell" : "Ajouter une vente")}
                            </p>
                            <div className="flex gap-2 mb-2">
                              <button
                                onClick={() => setTxInputMode("usd")}
                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold ${txInputMode === "usd" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
                              >
                                USD ($)
                              </button>
                              <button
                                onClick={() => setTxInputMode("tokens")}
                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold ${txInputMode === "tokens" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
                              >
                                Tokens
                              </button>
                            </div>
                            <input
                              type="number"
                              placeholder={txInputMode === "usd" ? (language === "en" ? "Amount in $" : "Montant en $") : (language === "en" ? "Number of tokens" : "Nombre de tokens")}
                              value={txAmount}
                              onChange={(e) => setTxAmount(e.target.value)}
                              className="w-full py-2 px-3 rounded-lg bg-card border border-border text-xs text-foreground"
                            />
                            <input
                              type="number"
                              placeholder={language === "en" ? "Price per token ($)" : "Prix par token ($)"}
                              value={txPrice}
                              onChange={(e) => setTxPrice(e.target.value)}
                              className="w-full py-2 px-3 rounded-lg bg-card border border-border text-xs text-foreground"
                            />
                            {txAmount && txPrice && parseFloat(txPrice) > 0 && (
                              <p className="text-[10px] text-muted-foreground">
                                = {txInputMode === "usd"
                                  ? `${(parseFloat(txAmount) / parseFloat(txPrice)).toFixed(4)} tokens`
                                  : `${formatUsd(parseFloat(txAmount) * parseFloat(txPrice))}`}
                              </p>
                            )}
                            <div className="flex gap-2">
                              <button onClick={() => addTransaction(e.coinId)} className="flex-1 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground">
                                {language === "en" ? "Confirm" : "Confirmer"}
                              </button>
                              <button onClick={() => setShowAddTx(false)} className="py-2 px-4 rounded-lg text-xs font-semibold bg-card text-muted-foreground border border-border">
                                {language === "en" ? "Cancel" : "Annuler"}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Goal Modal */}
                      <AnimatePresence>
                        {showGoal === e.coinId && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="bg-secondary/60 rounded-xl p-3 space-y-2 border border-border">
                            <p className="text-xs font-semibold text-foreground">
                              {language === "en" ? "Set Goal" : "Définir un objectif"}
                            </p>
                            <div className="flex gap-2 mb-2">
                              <button
                                onClick={() => setGoalType("tokens")}
                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold ${goalType === "tokens" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
                              >
                                Tokens
                              </button>
                              <button
                                onClick={() => setGoalType("usd")}
                                className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold ${goalType === "usd" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
                              >
                                USD ($)
                              </button>
                            </div>
                            <input
                              type="number"
                              placeholder={goalType === "tokens" ? (language === "en" ? "Target tokens" : "Tokens cible") : (language === "en" ? "Target value ($)" : "Valeur cible ($)")}
                              value={goalInput}
                              onChange={(ev) => setGoalInput(ev.target.value)}
                              className="w-full py-2 px-3 rounded-lg bg-card border border-border text-xs text-foreground"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => setGoal(e.coinId)} className="flex-1 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground">
                                {language === "en" ? "Save" : "Enregistrer"}
                              </button>
                              <button onClick={() => setShowGoal(null)} className="py-2 px-4 rounded-lg text-xs font-semibold bg-card text-muted-foreground border border-border">
                                {language === "en" ? "Cancel" : "Annuler"}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Add Coin Button */}
      <button
        onClick={() => setShowAddCoin(true)}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-border text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2 hover:border-primary/30 hover:text-primary transition-colors"
      >
        <Plus className="w-4 h-4" />
        {language === "en" ? "Add a crypto" : "Ajouter une crypto"}
      </button>

      {/* Add Coin Modal */}
      <AnimatePresence>
        {showAddCoin && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowAddCoin(false); setSearchQ(""); }} className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-24 max-w-lg mx-auto">
              <div className="bg-card border border-border rounded-2xl p-4 shadow-xl max-h-[50vh] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{language === "en" ? "Add Crypto" : "Ajouter une crypto"}</h3>
                  <button onClick={() => { setShowAddCoin(false); setSearchQ(""); }} className="text-muted-foreground"><X className="w-4 h-4" /></button>
                </div>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder={language === "en" ? "Search..." : "Rechercher..."}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1 space-y-1">
                  {filteredCoins.map((coin) => (
                    <button
                      key={coin.id}
                      onClick={() => addCoin(coin)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/80 transition-colors text-left"
                    >
                      <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{coin.name}</p>
                        <p className="text-[10px] text-muted-foreground">{coin.symbol.toUpperCase()}</p>
                      </div>
                      <p className="text-xs text-foreground">{formatUsd(coin.current_price)}</p>
                    </button>
                  ))}
                  {filteredCoins.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">{language === "en" ? "No results" : "Aucun résultat"}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
