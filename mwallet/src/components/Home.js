import React, { useEffect, useState } from "react";
import mwallet from "../walletimg.webp";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
// const API = "http://localhost:3001/api";
const API = "https://walletapi.votingdapp.online/api";
function Home() {
  const navigate = useNavigate();
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [status, setStatus] = useState("");
  useEffect(() => {
    const fetchdata = async () => {
      if (isAuthenticated) {
        const response = await axios.post(`${API}/auth/user`, {
          user: user.sub,
        });
        setStatus(response.data.msg);
      }
    };
    fetchdata();
  }, [isAuthenticated]);

  return (
    <>
      <div className="content">
        <img src={mwallet} alt="logo" className="frontPageLogo" />
        <h2> Hey There 👋 </h2>
        <h3 className="h4"> Welcome to Voting Web3 Wallet</h3>
        {/* {isAuthenticated && (
          <Button
            onClick={() => navigate("/yourwallet")}
            className="frontPageButton"
            type="primary"
          >
            Create A Wallet
          </Button>
        )} */}
        {isAuthenticated &&
          (status == "user registered" ? (
            <Button
              onClick={() => navigate("/recover")}
              className="frontPageButton"
              type="primary"
            >
              Sign In With Seed Phrase
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/yourwallet")}
              className="frontPageButton"
              type="primary"
            >
              Create A Wallet
            </Button>
          ))}
        {!isAuthenticated && (
          <Button
            onClick={() => loginWithRedirect()}
            className="frontPageButton"
            type="primary"
          >
            Log In
          </Button>
        )}
        {isAuthenticated && (
          <Button
            onClick={() => logout({ returnTo: window.location.origin })}
            className="frontPageButton"
            type="default"
          >
            Log Out
          </Button>
        )}
      </div>
    </>
  );
}

export default Home;
