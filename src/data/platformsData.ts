export interface TrustedPlatform {
  id: string;
  name: string;
  type: "exchange" | "wallet" | "both";
  logo: string;
  score: number;
  url: string;
  description: { en: string; fr: string };
  gasFees: { score: number; note: { en: string; fr: string } };
  userFriendly: { score: number; note: { en: string; fr: string } };
  liquidity: { score: number; note: { en: string; fr: string } };
  insurance: { score: number; note: { en: string; fr: string } };
  transactionSpeed: { score: number; note: { en: string; fr: string } };
  security: { score: number; note: { en: string; fr: string } };
  unavailableCountries: string[];
  referralBonus: { en: string; fr: string };
  supportedCoins: string[];
}

export const trustedPlatforms: TrustedPlatform[] = [
  {
    id: "coinbase",
    name: "Coinbase",
    type: "both",
    logo: "🟦",
    score: 8.5,
    url: "https://www.coinbase.com",
    description: {
      en: "One of the most popular and beginner-friendly crypto exchanges in the world. Publicly traded on NASDAQ.",
      fr: "L'une des plateformes d'échange les plus populaires et conviviales au monde. Cotée au NASDAQ.",
    },
    gasFees: { score: 6, note: { en: "Moderate fees, higher for instant buys", fr: "Frais modérés, plus élevés pour achats instantanés" } },
    userFriendly: { score: 9, note: { en: "Very easy to use, great for beginners", fr: "Très facile à utiliser, idéal pour débutants" } },
    liquidity: { score: 9, note: { en: "Very high liquidity on major pairs", fr: "Très haute liquidité sur les paires majeures" } },
    insurance: { score: 8, note: { en: "FDIC insured USD deposits, crypto insurance fund", fr: "Dépôts USD assurés FDIC, fonds d'assurance crypto" } },
    transactionSpeed: { score: 7, note: { en: "Standard speeds, ACH transfers can be slow", fr: "Vitesse standard, les transferts ACH peuvent être lents" } },
    security: { score: 9, note: { en: "98% cold storage, 2FA, biometric login", fr: "98% stockage à froid, 2FA, connexion biométrique" } },
    unavailableCountries: ["China", "Bangladesh", "Bolivia", "Ecuador", "Nepal"],
    referralBonus: { en: "$10 in BTC for each friend who buys $100+", fr: "10$ en BTC pour chaque ami qui achète 100$+" },
    supportedCoins: ["bitcoin", "ethereum", "solana", "cardano"],
  },
  {
    id: "binance",
    name: "Binance",
    type: "exchange",
    logo: "🟨",
    score: 8,
    url: "https://www.binance.com",
    description: {
      en: "The world's largest crypto exchange by trading volume. Offers a wide range of coins and advanced trading features.",
      fr: "La plus grande plateforme d'échange crypto au monde par volume. Offre une large gamme de coins et des fonctionnalités avancées.",
    },
    gasFees: { score: 9, note: { en: "Very low trading fees, 0.1% spot", fr: "Frais de trading très bas, 0.1% spot" } },
    userFriendly: { score: 7, note: { en: "Feature-rich but can be overwhelming for beginners", fr: "Riche en fonctionnalités mais peut être complexe pour les débutants" } },
    liquidity: { score: 10, note: { en: "Highest liquidity in the market", fr: "La plus haute liquidité du marché" } },
    insurance: { score: 7, note: { en: "SAFU fund for emergencies", fr: "Fonds SAFU pour les urgences" } },
    transactionSpeed: { score: 8, note: { en: "Fast order execution", fr: "Exécution rapide des ordres" } },
    security: { score: 8, note: { en: "Advanced security features, proof of reserves", fr: "Fonctionnalités de sécurité avancées, preuve de réserves" } },
    unavailableCountries: ["USA (limited)", "UK (limited)", "Canada (limited)", "Japan", "Germany"],
    referralBonus: { en: "Up to 40% commission on referral trades", fr: "Jusqu'à 40% de commission sur les trades de parrainage" },
    supportedCoins: ["bitcoin", "ethereum", "solana", "cardano", "bnb"],
  },
  {
    id: "shakepay",
    name: "Shakepay",
    type: "exchange",
    logo: "🟢",
    score: 7.5,
    url: "https://shakepay.com",
    description: {
      en: "A Canadian crypto platform focused on Bitcoin and Ethereum. Known for its simplicity and #ShakingSats feature.",
      fr: "Une plateforme crypto canadienne axée sur Bitcoin et Ethereum. Connue pour sa simplicité et la fonctionnalité #ShakingSats.",
    },
    gasFees: { score: 7, note: { en: "No trading fees but spread included in price", fr: "Pas de frais de trading mais spread inclus dans le prix" } },
    userFriendly: { score: 10, note: { en: "Extremely simple, designed for beginners", fr: "Extrêmement simple, conçu pour les débutants" } },
    liquidity: { score: 6, note: { en: "Limited to BTC and ETH", fr: "Limité à BTC et ETH" } },
    insurance: { score: 7, note: { en: "Regulated in Canada, insured deposits", fr: "Régulé au Canada, dépôts assurés" } },
    transactionSpeed: { score: 8, note: { en: "Fast e-transfers and deposits", fr: "Virements et dépôts rapides" } },
    security: { score: 8, note: { en: "Cold storage, regulated by Canadian authorities", fr: "Stockage à froid, régulé par les autorités canadiennes" } },
    unavailableCountries: ["All countries except Canada"],
    referralBonus: { en: "$30 when friend shakes their phone after buying $100", fr: "30$ quand un ami secoue son téléphone après avoir acheté 100$" },
    supportedCoins: ["bitcoin", "ethereum"],
  },
  {
    id: "kraken",
    name: "Kraken",
    type: "exchange",
    logo: "🟪",
    score: 8,
    url: "https://www.kraken.com",
    description: {
      en: "A well-established US-based exchange known for security and a wide range of trading options.",
      fr: "Une plateforme américaine bien établie, connue pour sa sécurité et sa large gamme d'options de trading.",
    },
    gasFees: { score: 8, note: { en: "Low maker/taker fees starting at 0.16%", fr: "Frais maker/taker bas à partir de 0.16%" } },
    userFriendly: { score: 7, note: { en: "Clean interface, good for intermediates", fr: "Interface propre, bon pour les intermédiaires" } },
    liquidity: { score: 8, note: { en: "High liquidity on major pairs", fr: "Haute liquidité sur les paires majeures" } },
    insurance: { score: 7, note: { en: "Proof of reserves, regulated", fr: "Preuve de réserves, régulé" } },
    transactionSpeed: { score: 7, note: { en: "Standard processing times", fr: "Temps de traitement standard" } },
    security: { score: 9, note: { en: "Never been hacked, top-tier security", fr: "Jamais piraté, sécurité de premier niveau" } },
    unavailableCountries: ["North Korea", "Iran", "Cuba", "Syria"],
    referralBonus: { en: "$10 for both referrer and friend", fr: "10$ pour le parrain et l'ami" },
    supportedCoins: ["bitcoin", "ethereum", "solana", "cardano"],
  },
  {
    id: "ledger",
    name: "Ledger",
    type: "wallet",
    logo: "⬛",
    score: 9,
    url: "https://www.ledger.com",
    description: {
      en: "The world's most popular hardware wallet. Keeps your crypto offline and ultra-secure.",
      fr: "Le portefeuille matériel le plus populaire au monde. Garde vos cryptos hors ligne et ultra-sécurisées.",
    },
    gasFees: { score: 8, note: { en: "No extra fees beyond network fees", fr: "Pas de frais supplémentaires au-delà des frais réseau" } },
    userFriendly: { score: 7, note: { en: "Requires some setup, Ledger Live app helps", fr: "Nécessite une configuration, l'app Ledger Live aide" } },
    liquidity: { score: 7, note: { en: "Swap feature via partners", fr: "Fonction d'échange via des partenaires" } },
    insurance: { score: 9, note: { en: "Hardware isolation, your keys never leave device", fr: "Isolation matérielle, vos clés ne quittent jamais l'appareil" } },
    transactionSpeed: { score: 7, note: { en: "Depends on network, manual confirmation needed", fr: "Dépend du réseau, confirmation manuelle nécessaire" } },
    security: { score: 10, note: { en: "Gold standard in crypto security, certified chip", fr: "Référence en sécurité crypto, puce certifiée" } },
    unavailableCountries: [],
    referralBonus: { en: "$10 in BTC for each referral purchase", fr: "10$ en BTC pour chaque achat de parrainage" },
    supportedCoins: ["bitcoin", "ethereum", "solana", "cardano", "bnb"],
  },
  {
    id: "metamask",
    name: "MetaMask",
    type: "wallet",
    logo: "🦊",
    score: 7.5,
    url: "https://metamask.io",
    description: {
      en: "The most popular software wallet for Ethereum and EVM-compatible chains. Browser extension and mobile app.",
      fr: "Le portefeuille logiciel le plus populaire pour Ethereum et les chaînes compatibles EVM. Extension navigateur et app mobile.",
    },
    gasFees: { score: 7, note: { en: "Network gas fees apply, swap has service fee", fr: "Frais de gas réseau, swap avec frais de service" } },
    userFriendly: { score: 8, note: { en: "Easy setup, widely supported", fr: "Installation facile, largement supporté" } },
    liquidity: { score: 7, note: { en: "Built-in swap aggregator", fr: "Agrégateur de swap intégré" } },
    insurance: { score: 5, note: { en: "Self-custody, no insurance — you are responsible", fr: "Auto-garde, pas d'assurance — vous êtes responsable" } },
    transactionSpeed: { score: 8, note: { en: "Fast, depends on network congestion", fr: "Rapide, dépend de la congestion du réseau" } },
    security: { score: 7, note: { en: "Hot wallet — less secure than hardware but convenient", fr: "Hot wallet — moins sécurisé que le matériel mais pratique" } },
    unavailableCountries: [],
    referralBonus: { en: "No referral program", fr: "Pas de programme de parrainage" },
    supportedCoins: ["ethereum", "bnb"],
  },
];

// Map project IDs to exchange IDs where they can be bought
export const projectExchanges: Record<string, { exchangeId: string; name: string; url: string }[]> = {
  bitcoin: [
    { exchangeId: "coinbase", name: "Coinbase", url: "https://www.coinbase.com/price/bitcoin" },
    { exchangeId: "binance", name: "Binance", url: "https://www.binance.com/trade/BTC_USDT" },
    { exchangeId: "kraken", name: "Kraken", url: "https://www.kraken.com/prices/bitcoin" },
  ],
  ethereum: [
    { exchangeId: "coinbase", name: "Coinbase", url: "https://www.coinbase.com/price/ethereum" },
    { exchangeId: "binance", name: "Binance", url: "https://www.binance.com/trade/ETH_USDT" },
    { exchangeId: "kraken", name: "Kraken", url: "https://www.kraken.com/prices/ethereum" },
  ],
  solana: [
    { exchangeId: "coinbase", name: "Coinbase", url: "https://www.coinbase.com/price/solana" },
    { exchangeId: "binance", name: "Binance", url: "https://www.binance.com/trade/SOL_USDT" },
    { exchangeId: "kraken", name: "Kraken", url: "https://www.kraken.com/prices/solana" },
  ],
  cardano: [
    { exchangeId: "coinbase", name: "Coinbase", url: "https://www.coinbase.com/price/cardano" },
    { exchangeId: "binance", name: "Binance", url: "https://www.binance.com/trade/ADA_USDT" },
    { exchangeId: "kraken", name: "Kraken", url: "https://www.kraken.com/prices/cardano" },
  ],
  bnb: [
    { exchangeId: "binance", name: "Binance", url: "https://www.binance.com/trade/BNB_USDT" },
    { exchangeId: "kraken", name: "Kraken", url: "https://www.kraken.com/prices/bnb" },
    { exchangeId: "coinbase", name: "Coinbase", url: "https://www.coinbase.com/price/bnb" },
  ],
};
