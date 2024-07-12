import React from "react";
import { Button, Card } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
const API = "http://localhost:3001/api";

function CreateAccount({ setWallet, setSeedPhrase }) {
  const [newSeedPhrase, setNewSeedPhrase] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();
  function generateWallet() {
    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    console.log("Mnemonic:", mnemonic);
    setNewSeedPhrase(mnemonic);
  }

  async function setWalletAndMnemonic() {
    // Encrypt the mnemonic
    const encryptionKey = "your-encryption-key"; // Use a strong key and store it securely
    const encryptedMnemonic = CryptoJS.AES.encrypt(
      newSeedPhrase,
      encryptionKey
    ).toString();
    console.log("Encrypted Mnemonic:", encryptedMnemonic);
    if (isAuthenticated) {
      const response = await axios.post(`${API}/auth/key`, {
        key: encryptedMnemonic,
        user: user.sub,
      });

      console.log(response.data.keypart);
    }

    setSeedPhrase(newSeedPhrase);
    setWallet(ethers.Wallet.fromPhrase(newSeedPhrase).address);
  }

  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('part3', part3);
  // }

  return (
    <>
      <div className="content">
        <div className="mnemonic">
          <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
          <div>
            Once you generate the seed phrase, save it securely in order to
            recover your wallet in the future.
          </div>
        </div>
        <Button
          className="frontPageButton"
          type="primary"
          onClick={() => generateWallet()}
        >
          Generate Seed Phrase
        </Button>
        <Card className="seedPhraseContainer">
          {newSeedPhrase && (
            <pre style={{ whiteSpace: "pre-wrap" }}>{newSeedPhrase}</pre>
          )}
        </Card>
        <Button
          className="frontPageButton"
          type="default"
          onClick={() => setWalletAndMnemonic()}
        >
          Open Your New Wallet
        </Button>
        <p className="frontPageBottom" onClick={() => navigate("/")}>
          Back Home
        </p>
      </div>
    </>
  );
}

export default CreateAccount;
