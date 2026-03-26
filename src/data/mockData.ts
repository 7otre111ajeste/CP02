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
  logo: string;
  website: string;
  whitepaper: string;
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
    descriptionPro: {
      en: "Bitcoin is a decentralized peer-to-peer electronic cash system utilizing a SHA-256 Proof-of-Work consensus mechanism. It operates on a UTXO model with a fixed supply cap of 21 million coins, with block rewards halving approximately every 210,000 blocks.",
      fr: "Bitcoin est un système de paiement électronique pair-à-pair décentralisé utilisant un mécanisme de consensus Proof-of-Work SHA-256. Il fonctionne sur un modèle UTXO avec une offre maximale fixe de 21 millions de coins.",
    },
    descriptionBro: {
      en: "Imagine digital gold that lives on the internet. Nobody controls it — no bank, no government. You can send it to anyone, anywhere, like sending a text message but with money. There will only ever be 21 million Bitcoin, so it's rare like gold!",
      fr: "Imagine de l'or numérique qui vit sur internet. Personne ne le contrôle — ni banque, ni gouvernement. Tu peux l'envoyer à n'importe qui, comme un SMS mais avec de l'argent. Il n'y aura jamais que 21 millions de Bitcoin, c'est rare comme de l'or !",
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
    logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    website: "https://bitcoin.org",
    whitepaper: "https://bitcoin.org/bitcoin.pdf",
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
    descriptionPro: {
      en: "Ethereum is a Turing-complete programmable blockchain utilizing an account-based model with EVM execution. Post-Merge, it operates on Proof-of-Stake (Casper FFG + LMD-GHOST). It supports ERC-20 tokens, ERC-721 NFTs, and complex DeFi protocols via Solidity smart contracts.",
      fr: "Ethereum est une blockchain programmable Turing-complète utilisant un modèle basé sur les comptes avec exécution EVM. Après le Merge, elle fonctionne en Proof-of-Stake. Elle supporte les tokens ERC-20, les NFTs ERC-721 et les protocoles DeFi complexes.",
    },
    descriptionBro: {
      en: "Think of Ethereum like a giant computer that everyone shares. People can build apps on it — games, banks, stores — but without any company owning them. It's like the app store, but nobody can shut it down or change the rules!",
      fr: "Pense à Ethereum comme un ordinateur géant que tout le monde partage. Les gens peuvent y créer des apps — jeux, banques, boutiques — sans qu'aucune entreprise ne les contrôle. C'est comme l'App Store, mais personne ne peut le fermer !",
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
    logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    website: "https://ethereum.org",
    whitepaper: "https://ethereum.org/en/whitepaper/",
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
    descriptionPro: {
      en: "Solana is a high-performance Layer 1 blockchain utilizing Proof of History (PoH) combined with Tower BFT consensus. It achieves ~65,000 TPS with 400ms block times and sub-cent transaction fees via parallel transaction processing (Sealevel runtime).",
      fr: "Solana est une blockchain Layer 1 haute performance utilisant le Proof of History (PoH) combiné au consensus Tower BFT. Elle atteint ~65 000 TPS avec des blocs de 400ms et des frais inférieurs au centime.",
    },
    descriptionBro: {
      en: "Solana is like the fast lane on the crypto highway. While other blockchains are stuck in traffic, Solana zooms past — super fast and super cheap. It's great for games, apps, and sending money in seconds!",
      fr: "Solana c'est comme la voie rapide sur l'autoroute crypto. Pendant que les autres blockchains sont dans les bouchons, Solana fonce — ultra rapide et pas cher. Parfait pour les jeux, les apps et envoyer de l'argent en secondes !",
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
    logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    website: "https://solana.com",
    whitepaper: "https://solana.com/solana-whitepaper.pdf",
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
    descriptionPro: {
      en: "Cardano is a third-generation blockchain using Ouroboros, a provably secure Proof-of-Stake protocol. Built on Haskell with formal verification methods, it features a UTXO-based extended model (eUTXO) and native multi-asset support via Plutus smart contracts.",
      fr: "Cardano est une blockchain de troisième génération utilisant Ouroboros, un protocole Proof-of-Stake prouvablement sûr. Construit en Haskell avec vérification formelle, il utilise un modèle eUTXO et le support natif multi-actifs via les smart contracts Plutus.",
    },
    descriptionBro: {
      en: "Cardano is the 'nerdy' blockchain — built by scientists and professors who wanted to do things properly. It's slower to build new features, but everything is triple-checked. Think of it as the most careful kid in class!",
      fr: "Cardano c'est la blockchain 'intello' — construite par des scientifiques qui voulaient bien faire les choses. C'est plus lent à développer, mais tout est vérifié trois fois. C'est le premier de la classe !",
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
    logo: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    website: "https://cardano.org",
    whitepaper: "https://why.cardano.org/en/introduction/motivation/",
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
    descriptionPro: {
      en: "BNB is the native utility token of the Binance ecosystem, powering BNB Chain (formerly BSC), a Proof-of-Staked-Authority (PoSA) EVM-compatible blockchain. It features quarterly token burns, cross-chain bridges, and supports the BEP-20 token standard.",
      fr: "BNB est le jeton utilitaire natif de l'écosystème Binance, alimentant BNB Chain, une blockchain EVM-compatible en Proof-of-Staked-Authority (PoSA). Il inclut des burns trimestriels de tokens et supporte le standard BEP-20.",
    },
    descriptionBro: {
      en: "BNB is like a VIP card for the biggest crypto store in the world (Binance). If you hold BNB, you get discounts when you trade. It's also used to run apps and games on Binance's own blockchain!",
      fr: "BNB c'est comme une carte VIP pour le plus grand magasin crypto au monde (Binance). Si tu as du BNB, tu as des réductions quand tu trades. C'est aussi utilisé pour faire tourner des apps sur la blockchain de Binance !",
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
    logo: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    website: "https://www.bnbchain.org",
    whitepaper: "https://github.com/bnb-chain/whitepaper",
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
  {
    id: "proof-of-work",
    term: { en: "Proof of Work", fr: "Preuve de travail" },
    definition: {
      en: "A system where computers compete to solve math puzzles to validate transactions. The first to solve it earns crypto. Bitcoin uses this method — it's secure but uses a lot of energy.",
      fr: "Un système où des ordinateurs rivalisent pour résoudre des énigmes mathématiques afin de valider les transactions. Le premier à résoudre gagne des cryptos. Bitcoin utilise cette méthode — c'est sécurisé mais énergivore.",
    },
    category: "Technology",
  },
  {
    id: "proof-of-stake",
    term: { en: "Proof of Stake", fr: "Preuve d'enjeu" },
    definition: {
      en: "A system where you lock (stake) your crypto to help validate transactions. The more you stake, the more chances you have to validate and earn rewards. Uses much less energy than Proof of Work.",
      fr: "Un système où vous verrouillez (stakez) vos cryptos pour aider à valider les transactions. Plus vous stakez, plus vous avez de chances de valider et gagner des récompenses. Utilise beaucoup moins d'énergie que la Preuve de travail.",
    },
    category: "Technology",
  },
  {
    id: "peer-to-peer",
    term: { en: "Peer-to-Peer", fr: "Pair-à-pair" },
    definition: {
      en: "A direct connection between two people without a middleman. In crypto, it means sending money directly to someone without needing a bank or company in between.",
      fr: "Une connexion directe entre deux personnes sans intermédiaire. En crypto, ça veut dire envoyer de l'argent directement à quelqu'un sans besoin d'une banque ou entreprise entre les deux.",
    },
    category: "Technology",
  },
  {
    id: "hodl",
    term: { en: "HODL", fr: "HODL" },
    definition: {
      en: "Crypto slang for 'Hold On for Dear Life'. It means keeping your crypto instead of selling, even when prices drop. It started from a typo of 'hold' that became famous!",
      fr: "Argot crypto pour 'Hold On for Dear Life'. Ça veut dire garder ses cryptos au lieu de vendre, même quand les prix baissent. C'est parti d'une faute de frappe de 'hold' devenue célèbre !",
    },
    category: "Culture",
  },
  {
    id: "fomo",
    term: { en: "FOMO", fr: "FOMO" },
    definition: {
      en: "Fear Of Missing Out. The feeling of panic when you see a crypto going up and you're afraid you'll miss the opportunity. It often leads to buying at the wrong time!",
      fr: "Fear Of Missing Out (peur de rater). Le sentiment de panique quand tu vois une crypto monter et que tu as peur de rater l'opportunité. Ça mène souvent à acheter au mauvais moment !",
    },
    category: "Culture",
  },
  {
    id: "fud",
    term: { en: "FUD", fr: "FUD" },
    definition: {
      en: "Fear, Uncertainty, and Doubt. Negative news or rumors spread to scare people into selling their crypto. Always do your own research before reacting!",
      fr: "Fear, Uncertainty and Doubt (peur, incertitude et doute). Des nouvelles négatives ou rumeurs répandues pour pousser les gens à vendre. Fais toujours tes propres recherches avant de réagir !",
    },
    category: "Culture",
  },
  {
    id: "smart-contract",
    term: { en: "Smart Contract", fr: "Contrat intelligent" },
    definition: {
      en: "A self-executing program on a blockchain that automatically does something when certain conditions are met. Like a vending machine — put in money, get your item, no human needed.",
      fr: "Un programme auto-exécutable sur une blockchain qui fait automatiquement quelque chose quand certaines conditions sont remplies. Comme un distributeur — mets de l'argent, récupère ton article, pas besoin d'humain.",
    },
    category: "Technology",
  },
  {
    id: "dapp",
    term: { en: "dApp", fr: "dApp" },
    definition: {
      en: "Decentralized Application. An app that runs on a blockchain instead of a company's servers. Nobody can shut it down or control it alone.",
      fr: "Application décentralisée. Une appli qui tourne sur une blockchain au lieu des serveurs d'une entreprise. Personne ne peut la fermer ou la contrôler seul.",
    },
    category: "Technology",
  },
  {
    id: "whale",
    term: { en: "Whale", fr: "Baleine" },
    definition: {
      en: "Someone who owns a huge amount of crypto. When a whale buys or sells, it can move the entire market price significantly.",
      fr: "Quelqu'un qui possède une énorme quantité de crypto. Quand une baleine achète ou vend, ça peut faire bouger le prix du marché de manière significative.",
    },
    category: "Culture",
  },
  {
    id: "bull-market",
    term: { en: "Bull Market", fr: "Marché haussier" },
    definition: {
      en: "A period when prices are rising and investors are optimistic. Like a bull charging upward with its horns! People feel confident and buy more.",
      fr: "Une période où les prix montent et les investisseurs sont optimistes. Comme un taureau qui charge vers le haut ! Les gens ont confiance et achètent plus.",
    },
    category: "Market",
  },
  {
    id: "bear-market",
    term: { en: "Bear Market", fr: "Marché baissier" },
    definition: {
      en: "A period when prices are falling and investors are pessimistic. Like a bear swiping downward! People are scared and tend to sell.",
      fr: "Une période où les prix baissent et les investisseurs sont pessimistes. Comme un ours qui frappe vers le bas ! Les gens ont peur et vendent.",
    },
    category: "Market",
  },
  {
    id: "halving",
    term: { en: "Halving", fr: "Halving" },
    definition: {
      en: "An event where the reward for mining Bitcoin is cut in half. It happens roughly every 4 years and usually leads to price increases because less new Bitcoin is created.",
      fr: "Un événement où la récompense pour le minage de Bitcoin est divisée par deux. Ça arrive environ tous les 4 ans et mène souvent à des hausses de prix car moins de nouveaux Bitcoins sont créés.",
    },
    category: "Technology",
  },
  {
    id: "market-cap",
    term: { en: "Market Cap", fr: "Capitalisation boursière" },
    definition: {
      en: "The total value of all coins of a cryptocurrency. Calculated by multiplying the price by the number of coins in circulation. Higher market cap = generally more established project.",
      fr: "La valeur totale de toutes les pièces d'une cryptomonnaie. Calculée en multipliant le prix par le nombre de pièces en circulation. Plus la capitalisation est haute = projet généralement plus établi.",
    },
    category: "Market",
  },
  {
    id: "seed-phrase",
    term: { en: "Seed Phrase", fr: "Phrase de récupération" },
    definition: {
      en: "A list of 12 or 24 words that acts as the master key to your crypto wallet. If you lose access to your wallet, these words let you recover everything. NEVER share them!",
      fr: "Une liste de 12 ou 24 mots qui sert de clé maître pour ton portefeuille crypto. Si tu perds l'accès à ton portefeuille, ces mots te permettent de tout récupérer. Ne les partage JAMAIS !",
    },
    category: "Security",
  },
  {
    id: "dex",
    term: { en: "DEX", fr: "DEX" },
    definition: {
      en: "Decentralized Exchange. A platform to trade crypto directly with other people, without a company in the middle. Examples: Uniswap, PancakeSwap.",
      fr: "Exchange décentralisé. Une plateforme pour échanger des cryptos directement avec d'autres personnes, sans entreprise au milieu. Exemples : Uniswap, PancakeSwap.",
    },
    category: "DeFi",
  },
  {
    id: "cex",
    term: { en: "CEX", fr: "CEX" },
    definition: {
      en: "Centralized Exchange. A company that lets you buy and sell crypto, like Binance or Coinbase. Easy to use but you trust the company with your funds.",
      fr: "Exchange centralisé. Une entreprise qui te permet d'acheter et vendre des cryptos, comme Binance ou Coinbase. Facile à utiliser mais tu confies tes fonds à l'entreprise.",
    },
    category: "DeFi",
  },
  {
    id: "airdrop",
    term: { en: "Airdrop", fr: "Airdrop" },
    definition: {
      en: "Free crypto tokens sent to your wallet, usually as a promotion or reward for using a new project. Like free samples at a store!",
      fr: "Des tokens crypto gratuits envoyés dans ton portefeuille, généralement comme promotion ou récompense pour utiliser un nouveau projet. Comme des échantillons gratuits dans un magasin !",
    },
    category: "Culture",
  },
  {
    id: "rug-pull",
    term: { en: "Rug Pull", fr: "Rug Pull" },
    definition: {
      en: "A scam where developers create a crypto project, attract investors, then suddenly disappear with all the money. Always research a project before investing!",
      fr: "Une arnaque où les développeurs créent un projet crypto, attirent des investisseurs, puis disparaissent soudainement avec tout l'argent. Fais toujours tes recherches avant d'investir !",
    },
    category: "Security",
  },
  {
    id: "yield-farming",
    term: { en: "Yield Farming", fr: "Yield Farming" },
    definition: {
      en: "Lending or staking your crypto on DeFi platforms to earn rewards. Like planting seeds (your crypto) to harvest returns — but with risks!",
      fr: "Prêter ou staker tes cryptos sur des plateformes DeFi pour gagner des récompenses. Comme planter des graines (tes cryptos) pour récolter des rendements — mais avec des risques !",
    },
    category: "DeFi",
  },
  {
    id: "layer-1",
    term: { en: "Layer 1", fr: "Layer 1" },
    definition: {
      en: "The base blockchain network itself, like Bitcoin or Ethereum. It's the foundation on which everything else is built.",
      fr: "Le réseau blockchain de base lui-même, comme Bitcoin ou Ethereum. C'est la fondation sur laquelle tout le reste est construit.",
    },
    category: "Technology",
  },
  {
    id: "layer-2",
    term: { en: "Layer 2", fr: "Layer 2" },
    definition: {
      en: "A secondary network built on top of a Layer 1 to make it faster and cheaper. Like adding express lanes to a highway. Examples: Lightning Network, Polygon.",
      fr: "Un réseau secondaire construit par-dessus un Layer 1 pour le rendre plus rapide et moins cher. Comme ajouter des voies express à une autoroute. Exemples : Lightning Network, Polygon.",
    },
    category: "Technology",
  },
  {
    id: "dao",
    term: { en: "DAO", fr: "DAO" },
    definition: {
      en: "Decentralized Autonomous Organization. A group managed by code and community votes instead of a CEO. Members vote on decisions using tokens.",
      fr: "Organisation Autonome Décentralisée. Un groupe géré par du code et des votes communautaires au lieu d'un PDG. Les membres votent sur les décisions en utilisant des tokens.",
    },
    category: "DeFi",
  },
  {
    id: "private-key",
    term: { en: "Private Key", fr: "Clé privée" },
    definition: {
      en: "A secret code that proves you own your crypto and lets you send it. Like your bank PIN but even more important — if someone gets it, they can steal all your crypto!",
      fr: "Un code secret qui prouve que tu possèdes tes cryptos et te permet de les envoyer. Comme ton code bancaire mais encore plus important — si quelqu'un l'obtient, il peut voler toutes tes cryptos !",
    },
    category: "Security",
  },
  {
    id: "public-key",
    term: { en: "Public Key", fr: "Clé publique" },
    definition: {
      en: "Your crypto address that you can share with others to receive payments. Like your email address — safe to share, but only you can access what's inside.",
      fr: "Ton adresse crypto que tu peux partager avec d'autres pour recevoir des paiements. Comme ton adresse email — sûr à partager, mais toi seul peux accéder à ce qu'il y a dedans.",
    },
    category: "Security",
  },
  {
    id: "stablecoin",
    term: { en: "Stablecoin", fr: "Stablecoin" },
    definition: {
      en: "A cryptocurrency designed to keep a stable price, usually pegged to $1 USD. Examples: USDT, USDC. Useful for avoiding price swings while staying in crypto.",
      fr: "Une cryptomonnaie conçue pour garder un prix stable, généralement indexée à 1$ USD. Exemples : USDT, USDC. Utile pour éviter les variations de prix tout en restant dans la crypto.",
    },
    category: "Basics",
  },
  {
    id: "fear-and-greed",
    term: { en: "Fear & Greed Index", fr: "Indice de Peur et Avidité" },
    definition: {
      en: "A score from 0 to 100 that measures market emotions. 0 = Extreme Fear (people are scared), 100 = Extreme Greed (people are too excited). Helps you understand the mood of the market.",
      fr: "Un score de 0 à 100 qui mesure les émotions du marché. 0 = Peur extrême (les gens ont peur), 100 = Avidité extrême (les gens sont trop excités). Aide à comprendre l'humeur du marché.",
    },
    category: "Market",
  },
  {
    id: "volume",
    term: { en: "Volume", fr: "Volume" },
    definition: {
      en: "The total amount of a crypto traded in a period (usually 24 hours). High volume means lots of activity. Low volume means less interest.",
      fr: "Le montant total d'une crypto échangée sur une période (généralement 24h). Un volume élevé signifie beaucoup d'activité. Un faible volume signifie moins d'intérêt.",
    },
    category: "Market",
  },
  {
    id: "ath",
    term: { en: "ATH", fr: "ATH" },
    definition: {
      en: "All-Time High. The highest price a cryptocurrency has ever reached. When a coin hits a new ATH, it means it's at its most expensive ever!",
      fr: "All-Time High (plus haut historique). Le prix le plus élevé qu'une cryptomonnaie ait jamais atteint. Quand une crypto atteint un nouvel ATH, ça veut dire qu'elle est à son prix le plus cher de tous les temps !",
    },
    category: "Market",
  },
  {
    id: "atl",
    term: { en: "ATL", fr: "ATL" },
    definition: {
      en: "All-Time Low. The lowest price a cryptocurrency has ever reached. Can represent a buying opportunity — or a warning sign.",
      fr: "All-Time Low (plus bas historique). Le prix le plus bas qu'une cryptomonnaie ait jamais atteint. Peut représenter une opportunité d'achat — ou un signal d'alarme.",
    },
    category: "Market",
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
