import { useQuery } from "@tanstack/react-query";

// Category mappings for well-known coins (CoinGecko IDs)
const CATEGORY_MAP: Record<string, string> = {
  bitcoin: "Layer 1", ethereum: "Layer 1", solana: "Layer 1", cardano: "Layer 1",
  "avalanche-2": "Layer 1", polkadot: "Layer 1", near: "Layer 1", sui: "Layer 1",
  aptos: "Layer 1", cosmos: "Layer 1", algorand: "Layer 1", tron: "Layer 1",
  fantom: "Layer 1", "elrond-erd-2": "Layer 1", flow: "Layer 1", "sei-network": "Layer 1",
  kaspa: "Layer 1", eos: "Layer 1", astar: "Layer 1",
  "hedera-hashgraph": "Layer 1", "internet-computer": "Layer 1",
  tether: "Stablecoins", "usd-coin": "Stablecoins", dai: "Stablecoins",
  "first-digital-usd": "Stablecoins", "ethena-usde": "Stablecoins",
  uniswap: "DeFi", aave: "DeFi", "lido-dao": "DeFi", maker: "DeFi",
  chainlink: "DeFi", jupiter: "DeFi", "the-graph": "DeFi", "pancakeswap-token": "DeFi",
  "injective-protocol": "DeFi", thorchain: "DeFi", "ondo-finance": "DeFi",
  dogecoin: "Meme", "shiba-inu": "Meme", pepe: "Meme", floki: "Meme",
  bonk: "Meme", dogwifcoin: "Meme",
  ripple: "Payments", litecoin: "Payments", stellar: "Payments", "bitcoin-cash": "Payments",
  binancecoin: "Exchange", okb: "Exchange", cronos: "Exchange",
  "matic-network": "Layer 2", arbitrum: "Layer 2", optimism: "Layer 2",
  stacks: "Layer 2", mantle: "Layer 2",
  "render-token": "Infrastructure", filecoin: "Infrastructure",
  "quant-network": "Infrastructure", vechain: "Infrastructure", "theta-token": "Infrastructure",
  celestia: "Infrastructure",
  "fetch-ai": "AI", "worldcoin-wld": "AI",
  "immutable-x": "Gaming", "the-sandbox": "Gaming", "axi-infinity": "Gaming", gala: "Gaming",
  monero: "Privacy",
};

export type MarketCategory = "All" | "Layer 1" | "DeFi" | "Stablecoins" | "Meme";
export const MARKET_CATEGORIES: MarketCategory[] = ["All", "Layer 1", "DeFi", "Stablecoins", "Meme"];

export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  sparkline_in_7d?: { price: number[] };
  category?: string;
}

async function fetchMarketData(): Promise<MarketCoin[]> {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h"
  );
  if (!res.ok) throw new Error("Failed to fetch market data");
  const data: MarketCoin[] = await res.json();
  return data.map((coin) => ({
    ...coin,
    category: CATEGORY_MAP[coin.id] ?? "Other",
  }));
}

export function useCryptoMarket() {
  return useQuery({
    queryKey: ["crypto-market"],
    queryFn: fetchMarketData,
    refetchInterval: 60_000, // refresh every 60s
    staleTime: 30_000,
  });
}

export function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string };
  description: { en: string };
  market_cap_rank: number;
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    ath: { usd: number };
    atl: { usd: number };
    circulating_supply: number;
    total_supply: number | null;
  };
}

export interface ChartData {
  prices: [number, number][];
}

async function fetchCoinDetail(id: string): Promise<CoinDetail> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
  );
  if (!res.ok) throw new Error("Failed to fetch coin detail");
  return res.json();
}

async function fetchCoinChart(id: string, days: number): Promise<ChartData> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error("Failed to fetch chart data");
  return res.json();
}

export function useCoinDetail(id: string) {
  return useQuery({
    queryKey: ["coin-detail", id],
    queryFn: () => fetchCoinDetail(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCoinChart(id: string, days: number) {
  return useQuery({
    queryKey: ["coin-chart", id, days],
    queryFn: () => fetchCoinChart(id, days),
    enabled: !!id,
    staleTime: 60_000,
  });
}
