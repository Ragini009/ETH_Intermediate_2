import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [transactions, setTransactions] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account.length > 0) {
      console.log("Account connected: ", account[0]);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  const addTransaction = (type, amount) => {
    setTransactions(prev => [
      ...prev,
      { type, amount, timestamp: new Date().toLocaleString() },
    ]);
  };

  const deposit = async (amount) => {
    if (atm) {
      const tx = await atm.deposit(ethers.utils.parseEther(amount));
      await tx.wait();
      getBalance();
      addTransaction('Deposit', amount);
    }
  };

  const withdraw = async (amount) => {
    if (atm) {
      const tx = await atm.withdraw(ethers.utils.parseEther(amount));
      await tx.wait();
      getBalance();
      addTransaction('Withdraw', amount);
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount} style={buttonStyle}>Connect Your Metamask Wallet to Metacrafters</button>;
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <button style={buttonStyle}>Account I'D: {account}</button>
        <p></p>
        <button style={buttonStyle}>Remaining Balance : {balance} ETH</button>
        <p></p>
        <button onClick={() => deposit("1")} style={buttonStyle}>Deposit 1 ETH</button>
        <button onClick={() => withdraw("1")} style={buttonStyle}>Withdraw 1 ETH</button>
        <button onClick={() => deposit("2")} style={buttonStyle}>Deposit 2 ETH</button>
        <button onClick={() => withdraw("2")} style={buttonStyle}>Withdraw 2 ETH</button>
        <button onClick={() => deposit("5")} style={buttonStyle}>Deposit 5 ETH</button>
        <button onClick={() => withdraw("5")} style={buttonStyle}>Withdraw 5 ETH</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>WELCOME METACRAFTERS!!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          font-family: "Lucida Handwriting";
          background-color: #357FB2;
          padding: 200px;
        }
        header {
          border: 2px solid #ffffff;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
      `}</style>
    </main>
  );
}

const buttonStyle = {
  fontFamily: 'Courier New',
  backgroundColor: 'white',
  color: '#357FB2',
  border: '10px',
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: '20px',
  borderRadius: '40px',
  fontWeight: 'bolder',
};
