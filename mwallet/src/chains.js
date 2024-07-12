// const Ethereum = {
//     hex: '0x1',
//     name: 'Ethereum',
//     rpcUrl: '',
//     ticker: "ETH"
// };

// const MumbaiTestnet = {
//     hex: '0x13881',
//     name: 'Mumbai Testnet',
//     rpcUrl: '',
//     ticker: "MATIC"
// };

// export const CHAINS_CONFIG = {
//     "0x1": Ethereum,
//     "0x13881": MumbaiTestnet,
// };

const Ethereum = {
  hex: "0x1",
  name: "Ethereum",
  rpcUrl: "https://mainnet.infura.io/v3/a37f748d3a204f3fa3209806d560cc54",
  ticker: "ETH",
};

const SepoliaTestnet = {
  hex: "0xaa36a7",
  name: "Sepolia Testnet",
  rpcUrl: "https://sepolia.infura.io/v3/a37f748d3a204f3fa3209806d560cc54",
  ticker: "ETH",
};

const PolygonTestnet = {
  hex: "0x89",
  name: "Polygon Testnet",
  rpcUrl:
    "https://polygon-mainnet.infura.io/v3/a37f748d3a204f3fa3209806d560cc54",
  ticker: "MATIC",
};

export const CHAINS_CONFIG = {
  "0x1": Ethereum,
  "0xaa36a7": SepoliaTestnet,
  "0x89": PolygonTestnet,
};
