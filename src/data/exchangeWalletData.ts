export interface ExchangeWalletGuide {
  id: string;
  type: "exchange" | "wallet";
  name: string;
  logo: string;
  description: { en: string; fr: string };
  pros: { en: string[]; fr: string[] };
  cons: { en: string[]; fr: string[] };
  halalNotes: { en: string; fr: string };
  steps: { en: string[]; fr: string[] };
  website: string;
  category: string;
}

export const exchangeWalletGuides: ExchangeWalletGuide[] = [
  {
    id: "binance",
    type: "exchange",
    name: "Binance",
    logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=040",
    description: {
      en: "The world's largest crypto exchange by volume. Great for beginners and advanced traders alike.",
      fr: "Le plus grand exchange crypto au monde par volume. Idéal pour les débutants comme les traders avancés.",
    },
    pros: {
      en: ["Huge selection of coins", "Low trading fees", "User-friendly mobile app", "Earn features available"],
      fr: ["Large sélection de cryptos", "Frais de trading bas", "Application mobile intuitive", "Fonctionnalités de gains disponibles"],
    },
    cons: {
      en: ["Can be overwhelming for beginners", "Some features restricted by region", "Customer support can be slow"],
      fr: ["Peut être complexe pour les débutants", "Certaines fonctions restreintes par région", "Support client parfois lent"],
    },
    halalNotes: {
      en: "⚠️ Avoid margin trading, futures, and lending features — these involve interest (riba). Spot trading is generally considered permissible.",
      fr: "⚠️ Évitez le trading sur marge, les futures et le lending — ils impliquent des intérêts (riba). Le trading spot est généralement considéré comme permis.",
    },
    steps: {
      en: [
        "Download the Binance app or go to binance.com",
        "Create an account with your email",
        "Complete identity verification (KYC)",
        "Add a payment method (bank transfer or card)",
        "Buy your first crypto on the spot market",
      ],
      fr: [
        "Téléchargez l'app Binance ou allez sur binance.com",
        "Créez un compte avec votre email",
        "Complétez la vérification d'identité (KYC)",
        "Ajoutez un moyen de paiement (virement ou carte)",
        "Achetez votre première crypto sur le marché spot",
      ],
    },
    website: "https://binance.com",
    category: "CEX",
  },
  {
    id: "coinbase",
    type: "exchange",
    name: "Coinbase",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040",
    description: {
      en: "A beginner-friendly US-based exchange. Simple interface, great for first-time buyers.",
      fr: "Un exchange américain facile pour les débutants. Interface simple, parfait pour un premier achat.",
    },
    pros: {
      en: ["Very easy to use", "Strong security and insurance", "Educational rewards program", "Regulated and transparent"],
      fr: ["Très facile à utiliser", "Sécurité solide et assurance", "Programme de récompenses éducatives", "Régulé et transparent"],
    },
    cons: {
      en: ["Higher fees than competitors", "Limited coin selection vs Binance", "Some features US-only"],
      fr: ["Frais plus élevés que les concurrents", "Moins de cryptos que Binance", "Certaines fonctions réservées aux US"],
    },
    halalNotes: {
      en: "⚠️ Avoid staking rewards and lending products. Stick to simple buy/sell on spot market.",
      fr: "⚠️ Évitez les récompenses de staking et les produits de lending. Restez sur l'achat/vente spot.",
    },
    steps: {
      en: [
        "Go to coinbase.com or download the app",
        "Sign up with your email and verify your identity",
        "Link your bank account or debit card",
        "Search for the crypto you want to buy",
        "Enter the amount and confirm your purchase",
      ],
      fr: [
        "Allez sur coinbase.com ou téléchargez l'app",
        "Inscrivez-vous et vérifiez votre identité",
        "Liez votre compte bancaire ou carte",
        "Recherchez la crypto que vous voulez acheter",
        "Entrez le montant et confirmez l'achat",
      ],
    },
    website: "https://coinbase.com",
    category: "CEX",
  },
  {
    id: "kraken",
    type: "exchange",
    name: "Kraken",
    logo: "https://cryptologos.cc/logos/kraken-kra-logo.png?v=040",
    description: {
      en: "A secure and reputable exchange known for strong security practices and a wide range of features.",
      fr: "Un exchange sécurisé et réputé, connu pour ses pratiques de sécurité solides.",
    },
    pros: {
      en: ["Excellent security track record", "Competitive fees", "Good customer support", "Available in many countries"],
      fr: ["Excellent historique de sécurité", "Frais compétitifs", "Bon support client", "Disponible dans plusieurs pays"],
    },
    cons: {
      en: ["Interface less intuitive than Coinbase", "Verification can take time", "Mobile app less polished"],
      fr: ["Interface moins intuitive que Coinbase", "La vérification peut prendre du temps", "App mobile moins aboutie"],
    },
    halalNotes: {
      en: "⚠️ Avoid margin and futures trading. Kraken offers staking — consult a scholar on permissibility.",
      fr: "⚠️ Évitez le trading sur marge et les futures. Kraken offre du staking — consultez un savant sur sa permissibilité.",
    },
    steps: {
      en: [
        "Visit kraken.com and create an account",
        "Complete identity verification",
        "Deposit funds via bank transfer",
        "Navigate to the trading section",
        "Place a buy order for your chosen crypto",
      ],
      fr: [
        "Visitez kraken.com et créez un compte",
        "Complétez la vérification d'identité",
        "Déposez des fonds par virement bancaire",
        "Naviguez vers la section trading",
        "Passez un ordre d'achat pour la crypto choisie",
      ],
    },
    website: "https://kraken.com",
    category: "CEX",
  },
  {
    id: "metamask",
    type: "wallet",
    name: "MetaMask",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/120px-MetaMask_Fox.svg.png",
    description: {
      en: "The most popular Ethereum wallet. A browser extension and mobile app to store and manage your crypto.",
      fr: "Le portefeuille Ethereum le plus populaire. Extension navigateur et app mobile pour stocker vos cryptos.",
    },
    pros: {
      en: ["Free to use", "Works with thousands of DApps", "You control your private keys", "Available on mobile and browser"],
      fr: ["Gratuit", "Compatible avec des milliers de DApps", "Vous contrôlez vos clés privées", "Disponible sur mobile et navigateur"],
    },
    cons: {
      en: ["Only supports EVM chains", "Can be confusing for beginners", "You must keep your seed phrase safe"],
      fr: ["Supporte uniquement les chaînes EVM", "Peut être déroutant pour les débutants", "Vous devez sécuriser votre phrase de récupération"],
    },
    halalNotes: {
      en: "✅ MetaMask itself is just a wallet — it's halal. Be careful what DApps you interact with (avoid lending/interest protocols).",
      fr: "✅ MetaMask est juste un portefeuille — c'est halal. Faites attention aux DApps utilisées (évitez les protocoles de prêt/intérêt).",
    },
    steps: {
      en: [
        "Install MetaMask from metamask.io (browser extension or mobile app)",
        "Create a new wallet and set a strong password",
        "WRITE DOWN your 12-word seed phrase and store it safely (NEVER share it!)",
        "Your wallet is ready — copy your address to receive crypto",
        "To send crypto, paste the recipient's address and confirm",
      ],
      fr: [
        "Installez MetaMask depuis metamask.io (extension ou app mobile)",
        "Créez un nouveau portefeuille avec un mot de passe fort",
        "NOTEZ votre phrase de 12 mots et gardez-la en sécurité (NE LA PARTAGEZ JAMAIS !)",
        "Votre portefeuille est prêt — copiez votre adresse pour recevoir des cryptos",
        "Pour envoyer, collez l'adresse du destinataire et confirmez",
      ],
    },
    website: "https://metamask.io",
    category: "Hot Wallet",
  },
  {
    id: "trust-wallet",
    type: "wallet",
    name: "Trust Wallet",
    logo: "https://cryptologos.cc/logos/trust-wallet-token-twt-logo.png?v=040",
    description: {
      en: "A multi-chain mobile wallet by Binance. Supports many blockchains and tokens in one app.",
      fr: "Un portefeuille mobile multi-chaînes par Binance. Supporte de nombreuses blockchains en une seule app.",
    },
    pros: {
      en: ["Supports 100+ blockchains", "Built-in DApp browser", "Easy to use mobile interface", "Free and open source"],
      fr: ["Supporte 100+ blockchains", "Navigateur DApp intégré", "Interface mobile facile", "Gratuit et open source"],
    },
    cons: {
      en: ["No desktop version", "Less customizable than MetaMask", "Some scam tokens can appear in wallet"],
      fr: ["Pas de version desktop", "Moins personnalisable que MetaMask", "Des tokens frauduleux peuvent apparaître"],
    },
    halalNotes: {
      en: "✅ Trust Wallet is a storage tool — halal by nature. Avoid built-in staking/earn features that may involve interest.",
      fr: "✅ Trust Wallet est un outil de stockage — halal par nature. Évitez les fonctions de staking/gains intégrées qui impliquent des intérêts.",
    },
    steps: {
      en: [
        "Download Trust Wallet from your app store",
        "Create a new wallet",
        "Securely back up your 12-word recovery phrase",
        "Add the tokens you want to track",
        "Use the receive button to get your wallet address",
      ],
      fr: [
        "Téléchargez Trust Wallet depuis votre store",
        "Créez un nouveau portefeuille",
        "Sauvegardez votre phrase de récupération de 12 mots",
        "Ajoutez les tokens que vous voulez suivre",
        "Utilisez le bouton recevoir pour obtenir votre adresse",
      ],
    },
    website: "https://trustwallet.com",
    category: "Hot Wallet",
  },
  {
    id: "ledger",
    type: "wallet",
    name: "Ledger",
    logo: "https://cryptologos.cc/logos/ledger-logo.png?v=040",
    description: {
      en: "The most trusted hardware wallet. Stores your crypto offline for maximum security.",
      fr: "Le portefeuille matériel le plus fiable. Stocke vos cryptos hors ligne pour une sécurité maximale.",
    },
    pros: {
      en: ["Highest level of security", "Supports 5500+ coins", "Works with many software wallets", "Physical device you control"],
      fr: ["Plus haut niveau de sécurité", "Supporte 5500+ cryptos", "Compatible avec plusieurs wallets logiciels", "Appareil physique que vous contrôlez"],
    },
    cons: {
      en: ["Costs money ($79-$149)", "Less convenient for frequent trading", "Must not lose the device or seed phrase"],
      fr: ["Payant (79$-149$)", "Moins pratique pour le trading fréquent", "Ne pas perdre l'appareil ou la phrase de récupération"],
    },
    halalNotes: {
      en: "✅ Ledger is a physical storage device — perfectly halal. The safest way to hold crypto long term.",
      fr: "✅ Ledger est un appareil de stockage physique — parfaitement halal. La façon la plus sûre de conserver ses cryptos.",
    },
    steps: {
      en: [
        "Buy a Ledger from the official website (ledger.com) — NEVER buy second-hand!",
        "Install Ledger Live on your computer or phone",
        "Set up your device and create a PIN",
        "Write down your 24-word recovery phrase — store it offline",
        "Install apps for each crypto you want to store",
      ],
      fr: [
        "Achetez un Ledger sur le site officiel (ledger.com) — N'ACHETEZ JAMAIS d'occasion !",
        "Installez Ledger Live sur votre ordinateur ou téléphone",
        "Configurez votre appareil et créez un PIN",
        "Notez votre phrase de récupération de 24 mots — gardez-la hors ligne",
        "Installez les apps pour chaque crypto à stocker",
      ],
    },
    website: "https://ledger.com",
    category: "Hardware Wallet",
  },
];
