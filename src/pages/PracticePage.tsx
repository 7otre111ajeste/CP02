import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCryptoMarket, MarketCoin } from "@/hooks/useCryptoMarket";
import { useUserProgress } from "@/hooks/useUserProgress";
import { ArrowLeft, TrendingUp, TrendingDown, Search, X, RefreshCw, History, DollarSign, ShoppingCart, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface PracticeTrade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  type: "buy" | "sell";
  amount: number; // token amount
  pricePerToken: number;
  totalCost: number;
  date: string;
}

interface PracticePosition {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  totalTokens: number;
  totalInvested: number;
}

interface PracticeData {
  balance: number;
  rechargesUsed: number;
  trades: PracticeTrade[];
}

const INITIAL_BALANCE = 10000;
const MAX_FREE_RECHARGES = 2;

const SHOP_RECHARGES = [
  { id: "recharge-1k", amount: 1000, cost: 50, label: "$1,000" },
  { id: "recharge-3k", amount: 3000, cost: 120, label: "$3,000" },
  { id: "recharge-5k", amount: 5000, cost: 180, label: "$5,000" },
  { id: "recharge-10k", amount: 10000, cost: 300, label: "$10,000" },
];

function loadPractice(): PracticeData {
  try {
    const saved = localStorage.getItem("cryptopedia-practice");
    if (saved) return JSON.parse(saved);
  } catch {}
  return { balance: INITIAL_BALANCE, rechargesUsed: 1, trades: [] };
}

function savePractice(data: PracticeData) {
  localStorage.setItem("cryptopedia-practice", JSON.stringify(data));
}

function formatUsd(n: number): string {
  if (Math.abs(n) >= 1000) return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return "$" + n.toFixed(2);
}

export default function PracticePage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { data: marketCoins } = useCryptoMarket();
  const { points, spendPoints } = useUserProgress();
  const [practice, setPractice] = useState<PracticeData>(loadPractice);
  const [showBuy, setShowBuy] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<MarketCoin | null>(null);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tradeAmount, setTradeAmount] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [tab, setTab] = useState<"positions" | "trade">("positions");

  const en = language === "en";

  useEffect(() => {
    savePractice(practice);
  }, [practice]);

  const priceMap = useMemo(() => {
    const m: Record<string, MarketCoin> = {};
    marketCoins?.forEach((c) => { m[c.id] = c; });
    return m;
  }, [marketCoins]);

  // Calculate positions from trades
  const positions = useMemo(() => {
    const posMap: Record<string, PracticePosition> = {};
    practice.trades.forEach((t) => {
      if (!posMap[t.coinId]) {
        posMap[t.coinId] = {
          coinId: t.coinId,
          coinName: t.coinName,
          coinSymbol: t.coinSymbol,
          coinImage: t.coinImage,
          totalTokens: 0,
          totalInvested: 0,
        };
      }
      if (t.type === "buy") {
        posMap[t.coinId].totalTokens += t.amount;
        posMap[t.coinId].totalInvested += t.totalCost;
      } else {
        posMap[t.coinId].totalTokens -= t.amount;
        posMap[t.coinId].totalInvested -= t.totalCost;
      }
    });
    return Object.values(posMap).filter((p) => p.totalTokens > 0.0001);
  }, [practice.trades]);

  const totalPortfolioValue = useMemo(() => {
    return positions.reduce((sum, pos) => {
      const price = priceMap[pos.coinId]?.current_price ?? 0;
      return sum + pos.totalTokens * price;
    }, 0);
  }, [positions, priceMap]);

  const totalPnl = totalPortfolioValue + practice.balance - INITIAL_BALANCE * practice.rechargesUsed;

  const executeTrade = () => {
    if (!selectedCoin) return;
    const amountUsd = parseFloat(tradeAmount);
    if (!amountUsd || amountUsd <= 0) return;

    const livePrice = selectedCoin.current_price;
    const tokenAmount = amountUsd / livePrice;

    if (tradeType === "buy") {
      if (amountUsd > practice.balance) {
        toast.error(en ? "Insufficient balance" : "Solde insuffisant");
        return;
      }
      const trade: PracticeTrade = {
        id: `pt-${Date.now()}`,
        coinId: selectedCoin.id,
        coinName: selectedCoin.name,
        coinSymbol: selectedCoin.symbol.toUpperCase(),
        coinImage: selectedCoin.image,
        type: "buy",
        amount: tokenAmount,
        pricePerToken: livePrice,
        totalCost: amountUsd,
        date: new Date().toISOString(),
      };
      setPractice((prev) => ({
        ...prev,
        balance: prev.balance - amountUsd,
        trades: [...prev.trades, trade],
      }));
      toast.success(en ? `Bought ${tokenAmount.toFixed(4)} ${selectedCoin.symbol.toUpperCase()}` : `Acheté ${tokenAmount.toFixed(4)} ${selectedCoin.symbol.toUpperCase()}`);
    } else {
      const pos = positions.find((p) => p.coinId === selectedCoin.id);
      if (!pos || tokenAmount > pos.totalTokens) {
        toast.error(en ? "Not enough tokens" : "Pas assez de tokens");
        return;
      }
      const trade: PracticeTrade = {
        id: `pt-${Date.now()}`,
        coinId: selectedCoin.id,
        coinName: selectedCoin.name,
        coinSymbol: selectedCoin.symbol.toUpperCase(),
        coinImage: selectedCoin.image,
        type: "sell",
        amount: tokenAmount,
        pricePerToken: livePrice,
        totalCost: amountUsd,
        date: new Date().toISOString(),
      };
      setPractice((prev) => ({
        ...prev,
        balance: prev.balance + amountUsd,
        trades: [...prev.trades, trade],
      }));
      toast.success(en ? `Sold ${tokenAmount.toFixed(4)} ${selectedCoin.symbol.toUpperCase()}` : `Vendu ${tokenAmount.toFixed(4)} ${selectedCoin.symbol.toUpperCase()}`);
    }
    setTradeAmount("");
    setSelectedCoin(null);
    setShowBuy(false);
  };

  const handleRecharge = () => {
    if (practice.rechargesUsed >= MAX_FREE_RECHARGES) {
      toast.error(en ? "No free recharges left. Buy more in the shop!" : "Plus de recharges gratuites. Achetez-en dans la boutique !");
      return;
    }
    setPractice((prev) => ({
      ...prev,
      balance: prev.balance + INITIAL_BALANCE,
      rechargesUsed: prev.rechargesUsed + 1,
    }));
    toast.success(en ? `+$10,000 recharged!` : `+10 000$ rechargé !`);
  };

  const handleShopRecharge = (recharge: typeof SHOP_RECHARGES[0]) => {
    const success = spendPoints(recharge.cost);
    if (!success) {
      toast.error(en ? `Not enough points (need ${recharge.cost})` : `Pas assez de points (besoin de ${recharge.cost})`);
      return;
    }
    setPractice((prev) => ({
      ...prev,
      balance: prev.balance + recharge.amount,
    }));
    toast.success(en ? `+${recharge.label} recharged!` : `+${recharge.label} rechargé !`);
    setShowShop(false);
  };

  const filteredCoins = (marketCoins ?? []).filter((c) =>
    c.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    c.symbol.toLowerCase().includes(searchQ.toLowerCase())
  ).slice(0, 20);

  const freeRechargesLeft = MAX_FREE_RECHARGES - practice.rechargesUsed;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "Retour"}
      </button>

      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-foreground">
          {en ? "Practice Trading" : "Trading Pratique"}
        </h1>
        <div className="flex gap-2">
          <button onClick={() => setShowHistory(!showHistory)} className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground">
            <History className="w-4 h-4" />
          </button>
          <button onClick={() => setShowShop(!showShop)} className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        {en ? "Trade with virtual money at real prices" : "Tradez avec de l'argent virtuel aux prix réels"}
      </p>

      {/* Balance Card */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{en ? "Available Balance" : "Solde Disponible"}</p>
            <p className="text-2xl font-bold text-foreground">{formatUsd(practice.balance)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">{en ? "Portfolio Value" : "Valeur Portfolio"}</p>
            <p className="text-lg font-bold text-foreground">{formatUsd(totalPortfolioValue)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold flex items-center gap-1 ${totalPnl >= 0 ? "text-success" : "text-danger"}`}>
            {totalPnl >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {formatUsd(totalPnl)} PnL
          </span>
          <div className="flex items-center gap-2">
            {freeRechargesLeft > 0 && (
              <button onClick={handleRecharge} className="text-[10px] px-3 py-1.5 rounded-lg bg-primary/15 text-primary font-semibold flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                {en ? `Recharge (${freeRechargesLeft} left)` : `Recharger (${freeRechargesLeft} restantes)`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("positions")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors ${tab === "positions" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}
        >
          <Wallet className="w-3.5 h-3.5 inline mr-1" />
          {en ? "Positions" : "Positions"}
        </button>
        <button
          onClick={() => { setTab("trade"); setShowBuy(true); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors ${tab === "trade" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}
        >
          <DollarSign className="w-3.5 h-3.5 inline mr-1" />
          {en ? "Trade" : "Trader"}
        </button>
      </div>

      {/* Positions */}
      {tab === "positions" && (
        <div className="space-y-2 mb-4">
          {positions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">{en ? "No positions yet" : "Aucune position"}</p>
              <button onClick={() => { setTab("trade"); setShowBuy(true); setTradeType("buy"); }} className="mt-3 text-xs text-primary font-semibold">
                {en ? "Make your first trade →" : "Faites votre premier trade →"}
              </button>
            </div>
          ) : (
            positions.map((pos) => {
              const livePrice = priceMap[pos.coinId]?.current_price ?? 0;
              const currentValue = pos.totalTokens * livePrice;
              const pnl = currentValue - pos.totalInvested;
              const pnlPct = pos.totalInvested > 0 ? (pnl / pos.totalInvested) * 100 : 0;
              return (
                <div key={pos.coinId} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <img src={pos.coinImage} alt={pos.coinName} className="w-9 h-9 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{pos.coinName} <span className="text-[10px] text-muted-foreground">{pos.coinSymbol}</span></p>
                      <p className="text-[10px] text-muted-foreground">{pos.totalTokens.toFixed(4)} tokens</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{formatUsd(currentValue)}</p>
                      <p className={`text-[10px] font-semibold ${pnl >= 0 ? "text-success" : "text-danger"}`}>
                        {pnl >= 0 ? "+" : ""}{formatUsd(pnl)} ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => { setSelectedCoin(priceMap[pos.coinId] || null); setTradeType("buy"); setShowBuy(true); setTab("trade"); }}
                      className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-success/15 text-success border border-success/20"
                    >
                      {en ? "Buy More" : "Acheter Plus"}
                    </button>
                    <button
                      onClick={() => { setSelectedCoin(priceMap[pos.coinId] || null); setTradeType("sell"); setShowBuy(true); setTab("trade"); }}
                      className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-danger/15 text-danger border border-danger/20"
                    >
                      {en ? "Sell" : "Vendre"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Trade Panel */}
      {tab === "trade" && (
        <div className="space-y-3 mb-4">
          {/* Coin selector */}
          {!selectedCoin ? (
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-semibold text-foreground mb-3">{en ? "Select a crypto" : "Choisir une crypto"}</p>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder={en ? "Search..." : "Rechercher..."}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground"
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredCoins.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => { setSelectedCoin(coin); setSearchQ(""); }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/80 transition-colors text-left"
                  >
                    <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{coin.name}</p>
                      <p className="text-[10px] text-muted-foreground">{coin.symbol.toUpperCase()}</p>
                    </div>
                    <p className="text-xs text-foreground">{formatUsd(coin.current_price)}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              {/* Selected coin header */}
              <div className="flex items-center gap-3">
                <img src={selectedCoin.image} alt={selectedCoin.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{selectedCoin.name}</p>
                  <p className="text-xs text-muted-foreground">{formatUsd(selectedCoin.current_price)}</p>
                </div>
                <button onClick={() => setSelectedCoin(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Buy/Sell toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setTradeType("buy")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold ${tradeType === "buy" ? "bg-success text-success-foreground" : "bg-card border border-border text-muted-foreground"}`}
                  style={tradeType === "buy" ? { backgroundColor: "hsl(var(--success))", color: "hsl(var(--background))" } : {}}
                >
                  {en ? "Buy" : "Acheter"}
                </button>
                <button
                  onClick={() => setTradeType("sell")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold ${tradeType === "sell" ? "bg-danger text-white" : "bg-card border border-border text-muted-foreground"}`}
                  style={tradeType === "sell" ? { backgroundColor: "hsl(var(--danger))", color: "white" } : {}}
                >
                  {en ? "Sell" : "Vendre"}
                </button>
              </div>

              {/* Amount input */}
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">{en ? "Amount (USD)" : "Montant (USD)"}</label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full py-3 px-4 rounded-xl bg-secondary border border-border text-lg font-semibold text-foreground"
                />
                {tradeAmount && parseFloat(tradeAmount) > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    ≈ {(parseFloat(tradeAmount) / selectedCoin.current_price).toFixed(6)} {selectedCoin.symbol.toUpperCase()}
                  </p>
                )}
              </div>

              {/* Quick amount buttons */}
              <div className="flex gap-2">
                {[100, 500, 1000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTradeAmount(amt.toString())}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-secondary text-muted-foreground hover:text-foreground border border-border"
                  >
                    ${amt >= 1000 ? `${amt / 1000}k` : amt}
                  </button>
                ))}
              </div>

              {/* Execute */}
              <button
                onClick={executeTrade}
                disabled={!tradeAmount || parseFloat(tradeAmount) <= 0}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-40 ${
                  tradeType === "buy"
                    ? "bg-success/90 hover:bg-success text-background"
                    : "bg-danger/90 hover:bg-danger text-white"
                }`}
                style={tradeType === "buy" ? { backgroundColor: "hsl(var(--success))", color: "hsl(var(--background))" } : { backgroundColor: "hsl(var(--danger))" }}
              >
                {tradeType === "buy" ? (en ? "Buy Now" : "Acheter Maintenant") : (en ? "Sell Now" : "Vendre Maintenant")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trade History Modal */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHistory(false)} className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-24 max-w-lg mx-auto">
              <div className="bg-card border border-border rounded-2xl p-4 shadow-xl max-h-[60vh] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{en ? "Trade History" : "Historique des Trades"}</h3>
                  <button onClick={() => setShowHistory(false)} className="text-muted-foreground"><X className="w-4 h-4" /></button>
                </div>
                <div className="overflow-y-auto flex-1 space-y-2">
                  {practice.trades.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-8">{en ? "No trades yet" : "Aucun trade"}</p>
                  ) : (
                    [...practice.trades].reverse().map((t) => (
                      <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50 border border-border/50">
                        <img src={t.coinImage} alt={t.coinName} className="w-7 h-7 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${t.type === "buy" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                              {t.type === "buy" ? (en ? "BUY" : "ACHAT") : (en ? "SELL" : "VENTE")}
                            </span>
                            <span className="text-xs font-semibold text-foreground">{t.coinSymbol}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{t.amount.toFixed(4)} @ {formatUsd(t.pricePerToken)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-foreground">{formatUsd(t.totalCost)}</p>
                          <p className="text-[9px] text-muted-foreground">{new Date(t.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Shop Modal */}
      <AnimatePresence>
        {showShop && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowShop(false)} className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-24 max-w-lg mx-auto">
              <div className="bg-card border border-border rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{en ? "Recharge Shop" : "Boutique Recharges"}</h3>
                  <button onClick={() => setShowShop(false)} className="text-muted-foreground"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-[10px] text-muted-foreground mb-3">
                  {en ? `Your points: ${points}` : `Vos points: ${points}`}
                </p>
                <div className="space-y-2">
                  {SHOP_RECHARGES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleShopRecharge(r)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">{r.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-primary">{r.cost} pts</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
