import { useState, useEffect } from "react";
import "./App.css";
import { useSDK } from "@metamask/sdk-react";
import SendPassword from "./components/SendForm";
import List from "./components/ListSecrets";
import { ethers } from "ethers";
import Landing from "./components/Landing";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

function App() {
  const [account, setAccount] = useState();
  const { sdk, connected } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        console.log(account);
        console.log(window.ethereum);
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log(provider);
        const network = await provider.getNetwork();
        console.log(network.name);
      }
    };
    initializeProvider();
  }, []);

  const handleOnMove = (e) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-0x";

    const randomChar = () => chars[Math.floor(Math.random() * (chars.length - 1))],
      randomString = (length) => Array.from(Array(length)).map(randomChar).join("");

    const card = document.querySelector(".card"),
      letters = card.querySelector(".card-letters");
    const rect = card.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    letters.style.setProperty("--x", `${x}px`);
    letters.style.setProperty("--y", `${y}px`);

    letters.innerText = randomString(1500);
  };

  const [see, setSee] = useState(true);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

function Dashboard() {
  const [account, setAccount] = useState();
  const { sdk, connected } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        console.log(account);
        console.log(window.ethereum);
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log(provider);
        const network = await provider.getNetwork();
        console.log(network.name);
      }
    };
    initializeProvider();
  }, []);

  const handleOnMove = (e) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-0x";

    const randomChar = () => chars[Math.floor(Math.random() * (chars.length - 1))],
      randomString = (length) => Array.from(Array(length)).map(randomChar).join("");

    const card = document.querySelector(".card"),
      letters = card.querySelector(".card-letters");
    const rect = card.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    letters.style.setProperty("--x", `${x}px`);
    letters.style.setProperty("--y", `${y}px`);

    letters.innerText = randomString(1500);
  };

  const [see, setSee] = useState(true);

  return (
    <>
      <div className="card-track">
        <div className="card-wrapper">
          <div className="card" onMouseMove={handleOnMove}>
            <div className="card-image">
              {!connected ? (
                <button onClick={connect}>Connect</button>
              ) : see ? (
                <div id="list-secrets" className="password list-secrets w-full overflow-scroll">
                  <List openForm={() => setSee(false)} />
                </div>
              ) : (
                <div className="password w-full">
                  <SendPassword />
                </div>
              )}
            </div>
            <div className="card-gradient"></div>
            <div className="card-letters"></div>
          </div>
          <div className="card-corners">
            <span className="card-corner"></span>
            <span className="card-corner"></span>
            <span className="card-corner"></span>
            <span className="card-corner"></span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
