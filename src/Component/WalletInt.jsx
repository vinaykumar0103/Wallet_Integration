import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);

  // Connect Web3Modal
  useEffect(() => {
    const modal = new Web3Modal({
      cacheProvider: true, 
      providerOptions: {
        injected: {
          display: {
            name: "MetaMask",
            description: "Connect with MetaMask",
          },
          package: null, 
        },
        phantom: {
          display: {
            name: "Phantom",
            description: "Connect with Phantom",
          },
          package: "@solana/web3.js", // Phantom integration
          connector: async () => {
            const solana = window.solana;
            if (!solana || !solana.isPhantom) {
              throw new Error("Phantom wallet not found");
            }
            await solana.connect();
            return solana;
          },
        },
      },
    });
    setWeb3Modal(modal);
  }, []);

  // Connect Wallet
  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      const currentProvider = new ethers.providers.Web3Provider(instance);

      if (instance.isMetaMask) {
        const signer = currentProvider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        console.log("Connected to MetaMask:", address);
      }

      if (window.solana && window.solana.isPhantom) {
        const address = window.solana.publicKey.toString();
        setWalletAddress(address);
        console.log("Connected to Phantom:", address);
      }
    } catch (error) {
      console.error("Connection Error:", error);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
    }
    setWalletAddress(null);
    console.log("Disconnected from wallet");
  };

  return (
    <div>
      <h1>Web3Modal Wallet Connection</h1>
      <p>Connected Wallet: {walletAddress || "None"}</p>
      <button onClick={connectWallet}>
        {walletAddress ? "Reconnect Wallet" : "Connect Wallet"}
      </button>
      {walletAddress && (
        <button onClick={disconnectWallet}>Disconnect Wallet</button>
      )}
    </div>
  );
};

export default App;
