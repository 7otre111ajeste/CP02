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

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

export { formatMarketCap };
