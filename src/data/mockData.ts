export interface CryptoProject {
  id: string;
  name: string;
  symbol: string;
  category: string;
  price: number;
  change24h: number;
  marketCap: string;
  ath: number;
  atl: number;
  yearCreated: number;
  halalStatus: "halal" | "notHalal" | "uncertain";
  safetyStatus: "safe" | "risky" | "scam";
  score: number; // 0-10 quality score
  description: { en: string; fr: string };
  descriptionPro: { en: string; fr: string };
  descriptionBro: { en: string; fr: string };
  purpose: { en: string; fr: string };
  howItWorks: { en: string; fr: string };
  useCases: { en: string; fr: string };
  icon: string;
}

export interface DictionaryTerm {
  id: string;
  term: { en: string; fr: string };
  definition: { en: string; fr: string };
  category: string;
}

export interface TrainingLesson {
  id: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  content: { en: string; fr: string };
  expReward: number;
  order: number;
}

export const cryptoProjects: CryptoProject[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    category: "Layer 1",
    price: 67542.30,
    change24h: 2.4,
    marketCap: "$1.3T",
    ath: 73750,
    atl: 0.05,
    yearCreated: 2009,
    halalStatus: "halal",
    safetyStatus: "safe",
    score: 9,
    description: {
      en: "Bitcoin is the first and most well-known cryptocurrency. It's digital money that works without any bank or government.",
      fr: "Bitcoin est la première et la plus connue des cryptomonnaies. C'est de l'argent numérique qui fonctionne sans banque ni gouvernement.",
    },
    purpose: {
      en: "To allow people to send money to each other directly, without needing a bank.",
      fr: "Permettre aux gens de s'envoyer de l'argent directement, sans avoir besoin d'une banque.",
    },
    howItWorks: {
      en: "Bitcoin uses a technology called blockchain — a public record of all transactions that anyone can verify.",
      fr: "Bitcoin utilise une technologie appelée blockchain — un registre public de toutes les transactions que tout le monde peut vérifier.",
    },
    useCases: {
      en: "Store of value, peer-to-peer payments, protection against inflation.",
      fr: "Réserve de valeur, paiements pair-à-pair, protection contre l'inflation.",
    },
    icon: "₿",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    category: "Layer 1",
    price: 3456.78,
    change24h: -1.2,
    marketCap: "$415B",
    ath: 4878,
    atl: 0.42,
    yearCreated: 2015,
    halalStatus: "uncertain",
    safetyStatus: "safe",
    score: 8,
    description: {
      en: "Ethereum is a platform that lets developers build apps (dApps) on the blockchain. It introduced smart contracts.",
      fr: "Ethereum est une plateforme qui permet aux développeurs de créer des applications (dApps) sur la blockchain. Elle a introduit les contrats intelligents.",
    },
    purpose: {
      en: "To create a world computer where anyone can build decentralized applications.",
      fr: "Créer un ordinateur mondial où chacun peut construire des applications décentralisées.",
    },
    howItWorks: {
      en: "Ethereum uses smart contracts — programs that run automatically when conditions are met.",
      fr: "Ethereum utilise des contrats intelligents — des programmes qui s'exécutent automatiquement quand les conditions sont remplies.",
    },
    useCases: {
      en: "DeFi, NFTs, DAOs, decentralized applications.",
      fr: "DeFi, NFTs, DAOs, applications décentralisées.",
    },
    icon: "Ξ",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    category: "Layer 1",
    price: 178.45,
    change24h: 5.8,
    marketCap: "$82B",
    ath: 260,
    atl: 0.50,
    yearCreated: 2020,
    halalStatus: "uncertain",
    safetyStatus: "safe",
    score: 7,
    description: {
      en: "Solana is a fast blockchain that can handle thousands of transactions per second at very low cost.",
      fr: "Solana est une blockchain rapide capable de traiter des milliers de transactions par seconde à très faible coût.",
    },
    purpose: {
      en: "To provide a fast and cheap alternative for building decentralized apps.",
      fr: "Fournir une alternative rapide et peu coûteuse pour construire des applications décentralisées.",
    },
    howItWorks: {
      en: "Solana uses a unique system called Proof of History to process transactions very quickly.",
      fr: "Solana utilise un système unique appelé Proof of History pour traiter les transactions très rapidement.",
    },
    useCases: {
      en: "DeFi, NFTs, gaming, payments.",
      fr: "DeFi, NFTs, jeux, paiements.",
    },
    icon: "◎",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    category: "Layer 1",
    price: 0.62,
    change24h: -0.5,
    marketCap: "$22B",
    ath: 3.09,
    atl: 0.017,
    yearCreated: 2017,
    halalStatus: "halal",
    safetyStatus: "safe",
    score: 7,
    description: {
      en: "Cardano is a blockchain built on scientific research. It focuses on security and sustainability.",
      fr: "Cardano est une blockchain construite sur la recherche scientifique. Elle se concentre sur la sécurité et la durabilité.",
    },
    purpose: {
      en: "To build a more secure and sustainable blockchain using academic research.",
      fr: "Construire une blockchain plus sûre et durable en utilisant la recherche académique.",
    },
    howItWorks: {
      en: "Cardano uses Proof of Stake and is developed through peer-reviewed research papers.",
      fr: "Cardano utilise le Proof of Stake et est développé à travers des articles de recherche évalués par des pairs.",
    },
    useCases: {
      en: "Identity verification, supply chain, education, DeFi.",
      fr: "Vérification d'identité, chaîne d'approvisionnement, éducation, DeFi.",
    },
    icon: "₳",
  },
  {
    id: "bnb",
    name: "BNB",
    symbol: "BNB",
    category: "Exchange",
    price: 612.34,
    change24h: 1.1,
    marketCap: "$94B",
    ath: 690,
    atl: 0.10,
    yearCreated: 2017,
    halalStatus: "uncertain",
    safetyStatus: "safe",
    score: 6,
    description: {
      en: "BNB is the native token of the Binance ecosystem, one of the largest crypto exchanges in the world.",
      fr: "BNB est le jeton natif de l'écosystème Binance, l'une des plus grandes plateformes d'échange de crypto au monde.",
    },
    purpose: {
      en: "To power the Binance ecosystem and provide discounts on trading fees.",
      fr: "Alimenter l'écosystème Binance et offrir des réductions sur les frais de trading.",
    },
    howItWorks: {
      en: "BNB is used to pay fees on Binance and its blockchain (BNB Chain).",
      fr: "BNB est utilisé pour payer les frais sur Binance et sa blockchain (BNB Chain).",
    },
    useCases: {
      en: "Trading fee discounts, DeFi on BNB Chain, token launches.",
      fr: "Réductions sur les frais, DeFi sur BNB Chain, lancements de tokens.",
    },
    icon: "◆",
  },
];

export const dictionaryTerms: DictionaryTerm[] = [
  {
    id: "blockchain",
    term: { en: "Blockchain", fr: "Blockchain" },
    definition: {
      en: "A digital record book that stores information in blocks linked together. Once data is added, it can't be changed. Think of it like a chain of pages in a notebook that everyone can read but nobody can erase.",
      fr: "Un registre numérique qui stocke les informations dans des blocs liés entre eux. Une fois les données ajoutées, elles ne peuvent pas être modifiées. Pensez-y comme une chaîne de pages dans un cahier que tout le monde peut lire mais que personne ne peut effacer.",
    },
    category: "Technology",
  },
  {
    id: "wallet",
    term: { en: "Wallet", fr: "Portefeuille" },
    definition: {
      en: "A digital tool (app or device) that lets you store, send, and receive cryptocurrency. Like a bank account, but you control it yourself.",
      fr: "Un outil numérique (application ou appareil) qui vous permet de stocker, envoyer et recevoir des cryptomonnaies. Comme un compte bancaire, mais que vous contrôlez vous-même.",
    },
    category: "Basics",
  },
  {
    id: "staking",
    term: { en: "Staking", fr: "Staking" },
    definition: {
      en: "Locking your crypto to help secure a blockchain network. In return, you earn rewards — similar to earning interest in a savings account.",
      fr: "Verrouiller vos cryptos pour aider à sécuriser un réseau blockchain. En retour, vous gagnez des récompenses — similaire aux intérêts d'un compte d'épargne.",
    },
    category: "DeFi",
  },
  {
    id: "defi",
    term: { en: "DeFi", fr: "DeFi" },
    definition: {
      en: "Short for Decentralized Finance. Financial services (lending, borrowing, trading) that work without banks, using smart contracts on a blockchain.",
      fr: "Abréviation de Finance Décentralisée. Des services financiers (prêt, emprunt, trading) qui fonctionnent sans banques, en utilisant des contrats intelligents sur une blockchain.",
    },
    category: "DeFi",
  },
  {
    id: "nft",
    term: { en: "NFT", fr: "NFT" },
    definition: {
      en: "Non-Fungible Token. A unique digital item (like art, music, or collectibles) stored on the blockchain. Each NFT is one-of-a-kind.",
      fr: "Token Non Fongible. Un objet numérique unique (comme de l'art, de la musique ou des objets de collection) stocké sur la blockchain. Chaque NFT est unique en son genre.",
    },
    category: "Digital Assets",
  },
  {
    id: "mining",
    term: { en: "Mining", fr: "Minage" },
    definition: {
      en: "Using computers to solve complex math problems to verify transactions and add them to the blockchain. Miners earn crypto as a reward.",
      fr: "Utiliser des ordinateurs pour résoudre des problèmes mathématiques complexes afin de vérifier les transactions et les ajouter à la blockchain. Les mineurs gagnent des cryptos en récompense.",
    },
    category: "Technology",
  },
  {
    id: "token",
    term: { en: "Token", fr: "Jeton" },
    definition: {
      en: "A digital asset created on an existing blockchain. Tokens can represent money, access rights, or ownership of something.",
      fr: "Un actif numérique créé sur une blockchain existante. Les jetons peuvent représenter de l'argent, des droits d'accès ou la propriété de quelque chose.",
    },
    category: "Basics",
  },
  {
    id: "gas",
    term: { en: "Gas Fee", fr: "Frais de Gas" },
    definition: {
      en: "A small fee you pay to make a transaction on a blockchain. It's like a processing fee that goes to the people who run the network.",
      fr: "Un petit frais que vous payez pour effectuer une transaction sur une blockchain. C'est comme des frais de traitement qui vont aux personnes qui font fonctionner le réseau.",
    },
    category: "Technology",
  },
  {
    id: "liquidity",
    term: { en: "Liquidity", fr: "Liquidité" },
    definition: {
      en: "How easily you can buy or sell a crypto without affecting its price. High liquidity = easy to trade. Low liquidity = harder to trade.",
      fr: "La facilité avec laquelle vous pouvez acheter ou vendre une crypto sans affecter son prix. Haute liquidité = facile à échanger. Faible liquidité = plus difficile à échanger.",
    },
    category: "DeFi",
  },
  {
    id: "altcoin",
    term: { en: "Altcoin", fr: "Altcoin" },
    definition: {
      en: "Any cryptocurrency that isn't Bitcoin. 'Alt' stands for 'alternative'. Examples: Ethereum, Solana, Cardano.",
      fr: "Toute cryptomonnaie qui n'est pas Bitcoin. 'Alt' signifie 'alternative'. Exemples : Ethereum, Solana, Cardano.",
    },
    category: "Basics",
  },
];

export const trainingLessons: TrainingLesson[] = [
  {
    id: "what-is-market",
    title: { en: "What is a Market?", fr: "Qu'est-ce qu'un marché ?" },
    description: {
      en: "Learn the basics of how markets work",
      fr: "Apprenez les bases du fonctionnement des marchés",
    },
    content: {
      en: "A market is a place where people buy and sell things. In the crypto world, the market is where people trade cryptocurrencies. Just like a farmers market where you buy vegetables, the crypto market is where you buy and sell digital currencies like Bitcoin.\n\nThe price of crypto goes up and down based on how many people want to buy it (demand) and how much is available (supply). When more people want to buy, the price goes up. When more people want to sell, the price goes down.",
      fr: "Un marché est un endroit où les gens achètent et vendent des choses. Dans le monde de la crypto, le marché est l'endroit où les gens échangent des cryptomonnaies. Tout comme un marché fermier où vous achetez des légumes, le marché crypto est l'endroit où vous achetez et vendez des monnaies numériques comme le Bitcoin.\n\nLe prix de la crypto monte et descend en fonction du nombre de personnes qui veulent l'acheter (demande) et de la quantité disponible (offre).",
    },
    expReward: 20,
    order: 1,
  },
  {
    id: "what-is-crypto",
    title: { en: "What is Cryptocurrency?", fr: "Qu'est-ce que la cryptomonnaie ?" },
    description: {
      en: "Understand digital currencies",
      fr: "Comprendre les monnaies numériques",
    },
    content: {
      en: "Cryptocurrency is digital money. Unlike regular money (dollars, euros), crypto exists only on computers and the internet. You can't hold it in your hand, but you can use it to buy things, send money to friends, or save it as an investment.\n\nThe most famous cryptocurrency is Bitcoin, created in 2009. Since then, thousands of other cryptocurrencies have been created, each with different purposes.",
      fr: "La cryptomonnaie est de l'argent numérique. Contrairement à l'argent classique (dollars, euros), la crypto n'existe que sur les ordinateurs et internet. Vous ne pouvez pas la tenir dans votre main, mais vous pouvez l'utiliser pour acheter des choses, envoyer de l'argent à des amis, ou l'épargner comme investissement.",
    },
    expReward: 20,
    order: 2,
  },
  {
    id: "what-is-blockchain",
    title: { en: "What is Blockchain?", fr: "Qu'est-ce que la blockchain ?" },
    description: {
      en: "The technology behind crypto",
      fr: "La technologie derrière la crypto",
    },
    content: {
      en: "Blockchain is the technology that makes cryptocurrency possible. Think of it as a giant notebook that records every transaction. This notebook is shared with everyone, so nobody can cheat.\n\nEvery time someone sends crypto, it gets written in a 'block'. When a block is full, a new one is created and linked to the previous one — forming a 'chain'. That's why it's called blockchain!",
      fr: "La blockchain est la technologie qui rend la cryptomonnaie possible. Pensez-y comme un cahier géant qui enregistre chaque transaction. Ce cahier est partagé avec tout le monde, donc personne ne peut tricher.\n\nChaque fois que quelqu'un envoie de la crypto, cela est écrit dans un 'bloc'. Quand un bloc est plein, un nouveau est créé et lié au précédent — formant une 'chaîne'. C'est pourquoi on appelle ça la blockchain !",
    },
    expReward: 25,
    order: 3,
  },
  {
    id: "create-wallet",
    title: { en: "How to Create a Wallet", fr: "Comment créer un portefeuille" },
    description: {
      en: "Set up your first crypto wallet",
      fr: "Configurez votre premier portefeuille crypto",
    },
    content: {
      en: "A crypto wallet is like a digital bank account that you control. Here's how to create one:\n\n1. Choose a wallet app (e.g., MetaMask, Trust Wallet)\n2. Download it on your phone or browser\n3. Create a new wallet\n4. Write down your recovery phrase (12 or 24 words) on paper\n5. Never share your recovery phrase with anyone!\n\nYour wallet has two important things: a public address (like your email — share it to receive money) and a private key (like your password — never share it).",
      fr: "Un portefeuille crypto est comme un compte bancaire numérique que vous contrôlez. Voici comment en créer un :\n\n1. Choisissez une application de portefeuille (ex: MetaMask, Trust Wallet)\n2. Téléchargez-la sur votre téléphone ou navigateur\n3. Créez un nouveau portefeuille\n4. Notez votre phrase de récupération (12 ou 24 mots) sur papier\n5. Ne partagez jamais votre phrase de récupération !",
    },
    expReward: 30,
    order: 4,
  },
  {
    id: "secure-wallet",
    title: { en: "How to Secure Your Wallet", fr: "Comment sécuriser votre portefeuille" },
    description: {
      en: "Keep your crypto safe",
      fr: "Gardez vos cryptos en sécurité",
    },
    content: {
      en: "Security is extremely important in crypto. Here are the key rules:\n\n• Never share your recovery phrase or private key\n• Write your recovery phrase on paper, not on your phone\n• Use a strong password\n• Enable two-factor authentication (2FA)\n• Be careful of scams — nobody legitimate will ask for your private key\n• Consider using a hardware wallet for large amounts",
      fr: "La sécurité est extrêmement importante en crypto. Voici les règles clés :\n\n• Ne partagez jamais votre phrase de récupération ou clé privée\n• Écrivez votre phrase de récupération sur papier, pas sur votre téléphone\n• Utilisez un mot de passe fort\n• Activez l'authentification à deux facteurs (2FA)\n• Méfiez-vous des arnaques — personne de légitime ne vous demandera votre clé privée",
    },
    expReward: 25,
    order: 5,
  },
];

// Quiz questions moved to src/data/quizQuestions.ts
export { allQuizQuestions as quizQuestions } from "./quizQuestions";

export const marketData = [
  { rank: 1, name: "Bitcoin", symbol: "BTC", price: 67542.30, change24h: 2.4, marketCap: "$1.3T", icon: "₿" },
  { rank: 2, name: "Ethereum", symbol: "ETH", price: 3456.78, change24h: -1.2, marketCap: "$415B", icon: "Ξ" },
  { rank: 3, name: "Tether", symbol: "USDT", price: 1.00, change24h: 0.01, marketCap: "$112B", icon: "₮" },
  { rank: 4, name: "BNB", symbol: "BNB", price: 612.34, change24h: 1.1, marketCap: "$94B", icon: "◆" },
  { rank: 5, name: "Solana", symbol: "SOL", price: 178.45, change24h: 5.8, marketCap: "$82B", icon: "◎" },
  { rank: 6, name: "XRP", symbol: "XRP", price: 0.54, change24h: -0.3, marketCap: "$29B", icon: "✕" },
  { rank: 7, name: "Cardano", symbol: "ADA", price: 0.62, change24h: -0.5, marketCap: "$22B", icon: "₳" },
  { rank: 8, name: "Avalanche", symbol: "AVAX", price: 38.90, change24h: 3.2, marketCap: "$14B", icon: "▲" },
  { rank: 9, name: "Polkadot", symbol: "DOT", price: 7.45, change24h: -1.8, marketCap: "$10B", icon: "●" },
  { rank: 10, name: "Chainlink", symbol: "LINK", price: 15.23, change24h: 4.1, marketCap: "$9B", icon: "⬡" },
];
