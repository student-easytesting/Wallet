import React, { useEffect } from "react";
import { BulbOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
const API = "http://localhost:3001/api";

const { TextArea } = Input;

function RecoverAccount({ setWallet, setSeedPhrase }) {
  const navigate = useNavigate();
  const [typedSeed, setTypedSeed] = useState("");
  const [nonValid, setNonValid] = useState(false);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchdata = async () => {
      if (isAuthenticated) {
        const response = await axios.post(`${API}/auth/readkey`, {
          user: user.sub,
        });
        console.log(response.data.key);
        // setTypedSeed(response.data.ke)
        // Decrypt the mnemonic
        const encryptionKey = "your-encryption-key";
        const decryptedMnemonic = CryptoJS.AES.decrypt(
          response.data.key,
          encryptionKey
        ).toString(CryptoJS.enc.Utf8);
        setTypedSeed(decryptedMnemonic);
        console.log("Decrypted Mnemonic:", decryptedMnemonic);
      }
    };
    fetchdata();
  }, []);

  function seedAdjust(e) {
    setNonValid(false);
    setTypedSeed(e.target.value);
  }

  function recoverWallet() {
    let recoveredWallet;
    try {
      recoveredWallet = ethers.Wallet.fromPhrase(typedSeed);
    } catch (err) {
      setNonValid(true);
      return;
    }

    setSeedPhrase(typedSeed);
    setWallet(recoveredWallet.address);
    navigate("/yourwallet");
    return;
  }

  return (
    <>
      <div className="content">
        <div className="mnemonic">
          <BulbOutlined style={{ fontSize: "20px" }} />
          <div>
            Type your seed phrase in the field below to recover your wallet (it
            should include 12 words seperated with spaces)
          </div>
        </div>
        <TextArea
          value={typedSeed}
          onChange={seedAdjust}
          rows={4}
          className="seedPhraseContainer"
          placeholder="Type your seed phrase here..."
        />
        <Button
          disabled={
            typedSeed.split(" ").length !== 12 || typedSeed.slice(-1) === " "
          }
          className="frontPageButton"
          type="primary"
          onClick={() => recoverWallet()}
        >
          Recover Wallet
        </Button>
        {nonValid && <p style={{ color: "red" }}> Invalid Seed Phrase</p>}
        <p className="frontPageBottom" onClick={() => navigate("/")}>
          <span>Back Home</span>
        </p>
      </div>
    </>
  );
}

export default RecoverAccount;
