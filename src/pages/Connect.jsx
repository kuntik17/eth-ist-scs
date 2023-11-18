import { useEffect } from "react";
import "../App.css";
import { useSDK } from "@metamask/sdk-react";

export default function Connect() {
  const { sdk, connected } = useSDK();

  useEffect(() => {
    if (connected) {
      window.location.href = "/dashboard";
    }
  }, [connected]);

  const connect = async () => {
    try {
      const account = await sdk?.connect();

      if (account && account[0]) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

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

  return (
    <>
      <div className="card-track">
        <div className="card-wrapper">
          <div className="card" onMouseMove={handleOnMove}>
            <div className="card-image">{!connected && <button onClick={connect}>Connect with Metamask</button>}</div>
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
