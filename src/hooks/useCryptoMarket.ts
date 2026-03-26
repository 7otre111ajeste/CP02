import { useQuery } from "@tanstack/react-query";

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
}

async function fetchMarketData(): Promise<MarketCoin[]> {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h"
  );
  if (!res.ok) throw new Error("Failed to fetch market data");
  return res.json();
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
