const Key = require("../models/key-model");
const fs = require("fs");
const secrets = require("secrets.js-grempe");
// *-------------------
// Home Logic
// *-------------------

const home = async (req, res) => {
  try {
    res.status(200).send("Welcome to Wallet using router ");
  } catch (error) {
    console.log(error);
  }
};

// *-------------------
// Registration Logic
// *-------------------
// *-------------------------------
//* User Registration Logic 📝
// *-------------------------------
// 1. Get Registration Data: 📤 Retrieve user data (username, email, password).
// 2. Check Email Existence: 📋 Check if the email is already registered.
// 3. Hash Password: 🔒 Securely hash the password.
// 4. Create User: 📝 Create a new user with hashed password.
// 5. Save to DB: 💾 Save user data to the database.
// 6. Respond: ✅ Respond with "Registration Successful" or handle errors.

const key = async (req, res) => {
  try {
    console.log(req.body);
    const { key, user } = req.body;

    const userExist = await Key.findOne({ user });

    if (!userExist) {
      const hexEncryptedMnemonic = secrets.str2hex(key);

      // Split the encrypted mnemonic into 3 parts, where any 2 parts can reconstruct the secret
      const shares = secrets.share(hexEncryptedMnemonic, 3, 2);

      // Convert shares to strings for storage
      const part1 = shares[0];
      const part2 = shares[1];
      const part3 = shares[2];

      console.log("Part 1:", part1);
      console.log("Part 2:", part2);
      console.log("Part 3:", part3);
      const userCreated = await Key.create({
        user,
        keypart: part1,
      });

      str = user.toString();
      fname = str.replace("google-oauth2|", "");
      fs.writeFileSync(`${fname}.txt`, part2, "utf8");

      return res.status(201).json({
        keypart: part3,
      });
    }
  } catch (error) {
    // res.status(500).json("internal server error");
    console.log(error);
    // next(error);
  }
};

const readkey = async (req, res) => {
  try {
    console.log(req.body);
    const { user } = req.body;

    const userExist = await Key.findOne({ user });

    if (userExist) {
      str = user.toString();
      fname = str.replace("google-oauth2|", "");
      const part2FromFile = fs.readFileSync(`${fname}.txt`, "utf8");
      const part1FromDatabase = userExist.keypart;

      console.log("Part 1:", part1FromDatabase);
      console.log("Part 2:", part2FromFile);

      // Combine any two parts
      const sharesToCombine = [part2FromFile, part1FromDatabase]; // Or [part1FromFile, part3FromLocalStorage], etc.
      const combinedHex = secrets.combine(sharesToCombine);
      const combinedEncryptedMnemonic = secrets.hex2str(combinedHex);
      console.log(combinedEncryptedMnemonic);

      return res.status(200).json({
        key: combinedEncryptedMnemonic,
      });
    }
  } catch (error) {
    // res.status(500).json("internal server error");
    console.log(error);
    // next(error);
  }
};

const user = async (req, res) => {
  try {
    console.log(req.body);
    const { user } = req.body;
    const userExist = await Key.findOne({ user });
    if (!userExist) {
      return res.status(200).json({
        msg: "user not registered",
      });
    }

    res.status(200).json({
      msg: "user registered",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { home, key, readkey, user };
