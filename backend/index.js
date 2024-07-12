const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const authRoute = require("./router/auth-router");
const connectDb = require("./utils/db");

const port = 3001;

const corsOptions = {
  // origin: "http://localhost:5173",
  origin: (origin, callback) => {
    // Check if the origin is allowed
    const allowedOrigins = [
      "http://localhost:3000",
      "https://wallet.votingdapp.online",
    ];
    const isAllowed = allowedOrigins.includes(origin);
    callback(null, isAllowed ? origin : false);
  },
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoute);

app.get("/getTokens", async (req, res) => {
  const { userAddress, chain } = req.query;

  const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
    chain: chain,
    address: userAddress,
  });

  const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
    chain: chain,
    address: userAddress,
    mediaItems: true,
  });

  const myNfts = nfts.raw.result.map((e, i) => {
    if (
      e?.media?.media_collection?.high?.url &&
      !e.possible_spam &&
      e?.media?.category !== "video"
    ) {
      return e["media"]["media_collection"]["high"]["url"];
    }
  });

  const balance = await Moralis.EvmApi.balance.getNativeBalance({
    chain: chain,
    address: userAddress,
  });

  const jsonResponse = {
    tokens: tokens.raw,
    nfts: myNfts,
    balance: balance.raw.balance / 10 ** 18,
  };

  return res.status(200).json(jsonResponse);
});

connectDb().then(() => {
  Moralis.start({
    apiKey: process.env.MORALIS_KEY,
  }).then(() => {
    app.listen(port, () => {
      console.log(`Listening for API Calls on port ${port}`);
    });
  });
});
