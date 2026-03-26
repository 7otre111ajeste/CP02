export interface QuizQuestion {
  id: string;
  question: { en: string; fr: string };
  options: { en: string[]; fr: string[] };
  correctIndex: number;
  difficulty: 1 | 2 | 3;
}

export const allQuizQuestions: QuizQuestion[] = [
  // DIFFICULTY 1 - Beginner (20 questions)
  {
    id: "q1", difficulty: 1,
    question: { en: "What is blockchain?", fr: "Qu'est-ce que la blockchain ?" },
    options: { en: ["A type of cryptocurrency", "A digital record book", "A wallet app", "A trading platform"], fr: ["Un type de cryptomonnaie", "Un registre numérique", "Une application de portefeuille", "Une plateforme de trading"] },
    correctIndex: 1,
  },
  {
    id: "q2", difficulty: 1,
    question: { en: "Who created Bitcoin?", fr: "Qui a créé le Bitcoin ?" },
    options: { en: ["Elon Musk", "Satoshi Nakamoto", "Vitalik Buterin", "Mark Zuckerberg"], fr: ["Elon Musk", "Satoshi Nakamoto", "Vitalik Buterin", "Mark Zuckerberg"] },
    correctIndex: 1,
  },
  {
    id: "q3", difficulty: 1,
    question: { en: "What does DeFi stand for?", fr: "Que signifie DeFi ?" },
    options: { en: ["Digital Finance", "Decentralized Finance", "Default Finance", "Defined Finance"], fr: ["Finance Digitale", "Finance Décentralisée", "Finance par Défaut", "Finance Définie"] },
    correctIndex: 1,
  },
  {
    id: "q4", difficulty: 1,
    question: { en: "What should you NEVER share?", fr: "Que ne devez-vous JAMAIS partager ?" },
    options: { en: ["Your public address", "Your recovery phrase", "Your username", "Your email"], fr: ["Votre adresse publique", "Votre phrase de récupération", "Votre nom d'utilisateur", "Votre email"] },
    correctIndex: 1,
  },
  {
    id: "q5", difficulty: 1,
    question: { en: "What year was Bitcoin created?", fr: "En quelle année Bitcoin a-t-il été créé ?" },
    options: { en: ["2005", "2009", "2012", "2015"], fr: ["2005", "2009", "2012", "2015"] },
    correctIndex: 1,
  },
  {
    id: "q6", difficulty: 1,
    question: { en: "What is a crypto wallet?", fr: "Qu'est-ce qu'un portefeuille crypto ?" },
    options: { en: ["A physical wallet", "A digital tool to store crypto", "A bank account", "A website"], fr: ["Un portefeuille physique", "Un outil numérique pour stocker de la crypto", "Un compte bancaire", "Un site web"] },
    correctIndex: 1,
  },
  {
    id: "q7", difficulty: 1,
    question: { en: "What is cryptocurrency?", fr: "Qu'est-ce que la cryptomonnaie ?" },
    options: { en: ["Physical coins", "Digital money", "Bank notes", "Credit cards"], fr: ["Des pièces physiques", "De l'argent numérique", "Des billets de banque", "Des cartes de crédit"] },
    correctIndex: 1,
  },
  {
    id: "q8", difficulty: 1,
    question: { en: "What is Bitcoin's symbol?", fr: "Quel est le symbole du Bitcoin ?" },
    options: { en: ["ETH", "BTC", "SOL", "ADA"], fr: ["ETH", "BTC", "SOL", "ADA"] },
    correctIndex: 1,
  },
  {
    id: "q9", difficulty: 1,
    question: { en: "What does 'mining' mean in crypto?", fr: "Que signifie 'minage' en crypto ?" },
    options: { en: ["Digging for gold", "Using computers to verify transactions", "Creating a wallet", "Selling coins"], fr: ["Creuser pour de l'or", "Utiliser des ordinateurs pour vérifier des transactions", "Créer un portefeuille", "Vendre des pièces"] },
    correctIndex: 1,
  },
  {
    id: "q10", difficulty: 1,
    question: { en: "What is a public address used for?", fr: "À quoi sert une adresse publique ?" },
    options: { en: ["To send crypto only", "To receive crypto", "To mine crypto", "To create tokens"], fr: ["Pour envoyer de la crypto seulement", "Pour recevoir de la crypto", "Pour miner de la crypto", "Pour créer des jetons"] },
    correctIndex: 1,
  },
  {
    id: "q11", difficulty: 1,
    question: { en: "How many Bitcoin can ever exist?", fr: "Combien de Bitcoin peuvent exister au maximum ?" },
    options: { en: ["1 million", "21 million", "100 million", "Unlimited"], fr: ["1 million", "21 millions", "100 millions", "Illimité"] },
    correctIndex: 1,
  },
  {
    id: "q12", difficulty: 1,
    question: { en: "What is an altcoin?", fr: "Qu'est-ce qu'un altcoin ?" },
    options: { en: ["A fake coin", "Any crypto that isn't Bitcoin", "A special type of Bitcoin", "A stablecoin"], fr: ["Une fausse monnaie", "Toute crypto qui n'est pas Bitcoin", "Un type spécial de Bitcoin", "Un stablecoin"] },
    correctIndex: 1,
  },
  {
    id: "q13", difficulty: 1,
    question: { en: "What makes blockchain secure?", fr: "Qu'est-ce qui rend la blockchain sécurisée ?" },
    options: { en: ["Passwords", "Data is shared and can't be changed", "Government control", "Private servers"], fr: ["Des mots de passe", "Les données sont partagées et ne peuvent pas être modifiées", "Le contrôle gouvernemental", "Des serveurs privés"] },
    correctIndex: 1,
  },
  {
    id: "q14", difficulty: 1,
    question: { en: "What is a token?", fr: "Qu'est-ce qu'un jeton (token) ?" },
    options: { en: ["A physical coin", "A digital asset on a blockchain", "A type of wallet", "A password"], fr: ["Une pièce physique", "Un actif numérique sur une blockchain", "Un type de portefeuille", "Un mot de passe"] },
    correctIndex: 1,
  },
  {
    id: "q15", difficulty: 1,
    question: { en: "What is the main purpose of Bitcoin?", fr: "Quel est le but principal de Bitcoin ?" },
    options: { en: ["Play games", "Send money without a bank", "Store photos", "Send emails"], fr: ["Jouer à des jeux", "Envoyer de l'argent sans banque", "Stocker des photos", "Envoyer des emails"] },
    correctIndex: 1,
  },
  {
    id: "q16", difficulty: 1,
    question: { en: "What is Ethereum?", fr: "Qu'est-ce qu'Ethereum ?" },
    options: { en: ["A type of Bitcoin", "A platform for decentralized apps", "A wallet", "An exchange"], fr: ["Un type de Bitcoin", "Une plateforme pour apps décentralisées", "Un portefeuille", "Un exchange"] },
    correctIndex: 1,
  },
  {
    id: "q17", difficulty: 1,
    question: { en: "What is a recovery phrase?", fr: "Qu'est-ce qu'une phrase de récupération ?" },
    options: { en: ["A password hint", "12 or 24 words to restore your wallet", "Your username", "An email code"], fr: ["Un indice de mot de passe", "12 ou 24 mots pour restaurer votre portefeuille", "Votre nom d'utilisateur", "Un code email"] },
    correctIndex: 1,
  },
  {
    id: "q18", difficulty: 1,
    question: { en: "What happens when demand for a crypto increases?", fr: "Que se passe-t-il quand la demande d'une crypto augmente ?" },
    options: { en: ["Price stays the same", "Price goes up", "Price goes down", "It gets deleted"], fr: ["Le prix reste le même", "Le prix monte", "Le prix baisse", "Elle est supprimée"] },
    correctIndex: 1,
  },
  {
    id: "q19", difficulty: 1,
    question: { en: "What is 2FA?", fr: "Qu'est-ce que le 2FA ?" },
    options: { en: ["A crypto coin", "Two-factor authentication", "A type of wallet", "A blockchain"], fr: ["Une crypto", "L'authentification à deux facteurs", "Un type de portefeuille", "Une blockchain"] },
    correctIndex: 1,
  },
  {
    id: "q20", difficulty: 1,
    question: { en: "Who controls a decentralized network?", fr: "Qui contrôle un réseau décentralisé ?" },
    options: { en: ["A single company", "The government", "No single entity — everyone participates", "A bank"], fr: ["Une seule entreprise", "Le gouvernement", "Aucune entité unique — tout le monde participe", "Une banque"] },
    correctIndex: 2,
  },

  // DIFFICULTY 2 - Intermediate (20 questions)
  {
    id: "q21", difficulty: 2,
    question: { en: "What is an NFT?", fr: "Qu'est-ce qu'un NFT ?" },
    options: { en: ["New Financial Token", "Non-Fungible Token", "Network Fee Token", "No-Fee Transaction"], fr: ["Nouveau Jeton Financier", "Token Non Fongible", "Jeton de Frais Réseau", "Transaction Sans Frais"] },
    correctIndex: 1,
  },
  {
    id: "q22", difficulty: 2,
    question: { en: "What is a gas fee?", fr: "Qu'est-ce qu'un frais de gas ?" },
    options: { en: ["Cost of fuel", "Transaction processing fee", "Wallet creation fee", "Exchange membership fee"], fr: ["Coût du carburant", "Frais de traitement de transaction", "Frais de création de portefeuille", "Frais d'adhésion à un exchange"] },
    correctIndex: 1,
  },
  {
    id: "q23", difficulty: 2,
    question: { en: "What is staking?", fr: "Qu'est-ce que le staking ?" },
    options: { en: ["Buying crypto", "Locking crypto to earn rewards", "Selling at a loss", "Creating a new coin"], fr: ["Acheter de la crypto", "Verrouiller de la crypto pour gagner des récompenses", "Vendre à perte", "Créer une nouvelle monnaie"] },
    correctIndex: 1,
  },
  {
    id: "q24", difficulty: 2,
    question: { en: "What is liquidity?", fr: "Qu'est-ce que la liquidité ?" },
    options: { en: ["A type of crypto", "How easily you can buy/sell without affecting price", "The total supply of a coin", "A wallet feature"], fr: ["Un type de crypto", "La facilité d'achat/vente sans affecter le prix", "L'offre totale d'une monnaie", "Une fonctionnalité de portefeuille"] },
    correctIndex: 1,
  },
  {
    id: "q25", difficulty: 2,
    question: { en: "What is a smart contract?", fr: "Qu'est-ce qu'un contrat intelligent ?" },
    options: { en: ["A legal document", "A self-executing program on blockchain", "A type of wallet", "An exchange feature"], fr: ["Un document légal", "Un programme auto-exécutable sur blockchain", "Un type de portefeuille", "Une fonctionnalité d'exchange"] },
    correctIndex: 1,
  },
  {
    id: "q26", difficulty: 2,
    question: { en: "What is market capitalization?", fr: "Qu'est-ce que la capitalisation boursière ?" },
    options: { en: ["The price of one coin", "Total value of all coins in circulation", "Trading volume", "Number of holders"], fr: ["Le prix d'une monnaie", "La valeur totale de toutes les monnaies en circulation", "Le volume d'échange", "Le nombre de détenteurs"] },
    correctIndex: 1,
  },
  {
    id: "q27", difficulty: 2,
    question: { en: "What is Proof of Stake?", fr: "Qu'est-ce que le Proof of Stake ?" },
    options: { en: ["Mining with computers", "Validating transactions by locking crypto", "A type of wallet", "An exchange method"], fr: ["Minage avec des ordinateurs", "Valider des transactions en verrouillant de la crypto", "Un type de portefeuille", "Une méthode d'échange"] },
    correctIndex: 1,
  },
  {
    id: "q28", difficulty: 2,
    question: { en: "What is a DEX?", fr: "Qu'est-ce qu'un DEX ?" },
    options: { en: ["A centralized exchange", "A decentralized exchange", "A type of token", "A blockchain explorer"], fr: ["Un exchange centralisé", "Un exchange décentralisé", "Un type de jeton", "Un explorateur blockchain"] },
    correctIndex: 1,
  },
  {
    id: "q29", difficulty: 2,
    question: { en: "What is a stablecoin?", fr: "Qu'est-ce qu'un stablecoin ?" },
    options: { en: ["A very old crypto", "A crypto pegged to a stable asset like USD", "A mining reward", "A type of NFT"], fr: ["Une crypto très ancienne", "Une crypto indexée sur un actif stable comme le USD", "Une récompense de minage", "Un type de NFT"] },
    correctIndex: 1,
  },
  {
    id: "q30", difficulty: 2,
    question: { en: "What does HODL mean?", fr: "Que signifie HODL ?" },
    options: { en: ["Sell immediately", "Hold on for dear life — don't sell", "Buy more crypto", "A type of analysis"], fr: ["Vendre immédiatement", "Garder coûte que coûte — ne pas vendre", "Acheter plus de crypto", "Un type d'analyse"] },
    correctIndex: 1,
  },
  {
    id: "q31", difficulty: 2,
    question: { en: "What is a DAO?", fr: "Qu'est-ce qu'un DAO ?" },
    options: { en: ["A crypto coin", "A decentralized autonomous organization", "A digital wallet", "A mining pool"], fr: ["Une crypto", "Une organisation autonome décentralisée", "Un portefeuille numérique", "Un pool de minage"] },
    correctIndex: 1,
  },
  {
    id: "q32", difficulty: 2,
    question: { en: "What is yield farming?", fr: "Qu'est-ce que le yield farming ?" },
    options: { en: ["Growing crops", "Earning rewards by providing liquidity", "Mining Bitcoin", "Creating NFTs"], fr: ["Cultiver des champs", "Gagner des récompenses en fournissant de la liquidité", "Miner du Bitcoin", "Créer des NFTs"] },
    correctIndex: 1,
  },
  {
    id: "q33", difficulty: 2,
    question: { en: "What is a hardware wallet?", fr: "Qu'est-ce qu'un hardware wallet ?" },
    options: { en: ["A phone app", "A physical device to store crypto offline", "A browser extension", "A bank vault"], fr: ["Une application mobile", "Un appareil physique pour stocker la crypto hors ligne", "Une extension de navigateur", "Un coffre-fort bancaire"] },
    correctIndex: 1,
  },
  {
    id: "q34", difficulty: 2,
    question: { en: "What is a bull market?", fr: "Qu'est-ce qu'un marché haussier (bull market) ?" },
    options: { en: ["Prices are falling", "Prices are rising", "Market is closed", "No trading activity"], fr: ["Les prix baissent", "Les prix montent", "Le marché est fermé", "Aucune activité de trading"] },
    correctIndex: 1,
  },
  {
    id: "q35", difficulty: 2,
    question: { en: "What is a bear market?", fr: "Qu'est-ce qu'un marché baissier (bear market) ?" },
    options: { en: ["Prices are rising", "Prices are falling", "Market is stable", "New coins are launched"], fr: ["Les prix montent", "Les prix baissent", "Le marché est stable", "De nouvelles monnaies sont lancées"] },
    correctIndex: 1,
  },
  {
    id: "q36", difficulty: 2,
    question: { en: "What is a whitepaper?", fr: "Qu'est-ce qu'un whitepaper ?" },
    options: { en: ["A blank document", "A technical document explaining a crypto project", "A type of token", "A privacy feature"], fr: ["Un document vierge", "Un document technique expliquant un projet crypto", "Un type de jeton", "Une fonctionnalité de confidentialité"] },
    correctIndex: 1,
  },
  {
    id: "q37", difficulty: 2,
    question: { en: "What is Solana known for?", fr: "Pour quoi Solana est-elle connue ?" },
    options: { en: ["Being the oldest crypto", "Fast transactions and low fees", "Being a stablecoin", "Mining rewards"], fr: ["Être la plus ancienne crypto", "Des transactions rapides et des frais bas", "Être un stablecoin", "Les récompenses de minage"] },
    correctIndex: 1,
  },
  {
    id: "q38", difficulty: 2,
    question: { en: "What is an airdrop in crypto?", fr: "Qu'est-ce qu'un airdrop en crypto ?" },
    options: { en: ["Dropping your phone", "Free tokens distributed to wallet holders", "A type of scam", "A mining technique"], fr: ["Faire tomber son téléphone", "Des jetons gratuits distribués aux détenteurs de portefeuilles", "Un type d'arnaque", "Une technique de minage"] },
    correctIndex: 1,
  },
  {
    id: "q39", difficulty: 2,
    question: { en: "What is a blockchain explorer?", fr: "Qu'est-ce qu'un explorateur blockchain ?" },
    options: { en: ["A game", "A tool to view transactions on a blockchain", "A wallet type", "A mining software"], fr: ["Un jeu", "Un outil pour voir les transactions sur une blockchain", "Un type de portefeuille", "Un logiciel de minage"] },
    correctIndex: 1,
  },
  {
    id: "q40", difficulty: 2,
    question: { en: "What is the purpose of BNB?", fr: "Quel est le but de BNB ?" },
    options: { en: ["Replace Bitcoin", "Power the Binance ecosystem", "Be a stablecoin", "Enable mining"], fr: ["Remplacer Bitcoin", "Alimenter l'écosystème Binance", "Être un stablecoin", "Permettre le minage"] },
    correctIndex: 1,
  },

  // DIFFICULTY 3 - Advanced (10 questions)
  {
    id: "q41", difficulty: 3,
    question: { en: "What is impermanent loss?", fr: "Qu'est-ce que la perte impermanente ?" },
    options: { en: ["Losing your wallet", "Value loss from providing liquidity vs. holding", "A permanent loss", "Losing your password"], fr: ["Perdre son portefeuille", "Perte de valeur en fournissant de la liquidité vs garder", "Une perte permanente", "Perdre son mot de passe"] },
    correctIndex: 1,
  },
  {
    id: "q42", difficulty: 3,
    question: { en: "What is a flash loan?", fr: "Qu'est-ce qu'un flash loan ?" },
    options: { en: ["A small loan", "An uncollateralized loan repaid in one transaction", "A long-term loan", "A government loan"], fr: ["Un petit prêt", "Un prêt sans garantie remboursé en une transaction", "Un prêt long terme", "Un prêt gouvernemental"] },
    correctIndex: 1,
  },
  {
    id: "q43", difficulty: 3,
    question: { en: "What is a rug pull?", fr: "Qu'est-ce qu'un rug pull ?" },
    options: { en: ["A trading strategy", "When developers abandon a project and steal funds", "A mining technique", "A type of staking"], fr: ["Une stratégie de trading", "Quand les développeurs abandonnent un projet et volent les fonds", "Une technique de minage", "Un type de staking"] },
    correctIndex: 1,
  },
  {
    id: "q44", difficulty: 3,
    question: { en: "What is a Layer 2 solution?", fr: "Qu'est-ce qu'une solution Layer 2 ?" },
    options: { en: ["A new blockchain", "A system built on top of a blockchain to improve speed", "A type of wallet", "A consensus mechanism"], fr: ["Une nouvelle blockchain", "Un système construit sur une blockchain pour améliorer la vitesse", "Un type de portefeuille", "Un mécanisme de consensus"] },
    correctIndex: 1,
  },
  {
    id: "q45", difficulty: 3,
    question: { en: "What is tokenomics?", fr: "Qu'est-ce que la tokenomics ?" },
    options: { en: ["Token art", "The economics and design of a token's supply and distribution", "A wallet feature", "A type of NFT"], fr: ["L'art des jetons", "L'économie et le design de l'offre et distribution d'un jeton", "Une fonctionnalité de portefeuille", "Un type de NFT"] },
    correctIndex: 1,
  },
  {
    id: "q46", difficulty: 3,
    question: { en: "What is slippage in trading?", fr: "Qu'est-ce que le slippage en trading ?" },
    options: { en: ["A trading fee", "The difference between expected and actual price of a trade", "A type of order", "A wallet error"], fr: ["Des frais de trading", "La différence entre le prix attendu et le prix réel d'un échange", "Un type d'ordre", "Une erreur de portefeuille"] },
    correctIndex: 1,
  },
  {
    id: "q47", difficulty: 3,
    question: { en: "What is a governance token?", fr: "Qu'est-ce qu'un jeton de gouvernance ?" },
    options: { en: ["A stablecoin", "A token that gives voting rights in a protocol", "A mining reward", "A transaction fee token"], fr: ["Un stablecoin", "Un jeton qui donne des droits de vote dans un protocole", "Une récompense de minage", "Un jeton de frais de transaction"] },
    correctIndex: 1,
  },
  {
    id: "q48", difficulty: 3,
    question: { en: "What is TVL in DeFi?", fr: "Qu'est-ce que le TVL en DeFi ?" },
    options: { en: ["Total Virtual Ledger", "Total Value Locked", "Token Valuation Limit", "Trading Volume Level"], fr: ["Registre Virtuel Total", "Valeur Totale Verrouillée", "Limite de Valorisation de Token", "Niveau de Volume de Trading"] },
    correctIndex: 1,
  },
  {
    id: "q49", difficulty: 3,
    question: { en: "What is a wrapped token?", fr: "Qu'est-ce qu'un wrapped token ?" },
    options: { en: ["A gift card", "A token representing another asset on a different blockchain", "A hidden token", "A burned token"], fr: ["Une carte cadeau", "Un jeton représentant un actif sur une autre blockchain", "Un jeton caché", "Un jeton brûlé"] },
    correctIndex: 1,
  },
  {
    id: "q50", difficulty: 3,
    question: { en: "What is MEV (Maximal Extractable Value)?", fr: "Qu'est-ce que le MEV (Maximal Extractable Value) ?" },
    options: { en: ["Maximum exchange volume", "Profit validators can extract by reordering transactions", "A type of staking reward", "A wallet metric"], fr: ["Volume d'échange maximal", "Profit que les validateurs peuvent extraire en réordonnant les transactions", "Un type de récompense de staking", "Une métrique de portefeuille"] },
    correctIndex: 1,
  },
];

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getQuizQuestions(count: number, maxDifficulty: number = 3): QuizQuestion[] {
  const eligible = allQuizQuestions.filter(q => q.difficulty <= maxDifficulty);
  return shuffleArray(eligible).slice(0, count);
}
