import { useState, useEffect } from "react";
import { ethers } from "ethers";
import assessmentABI from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [assessment, setAssessment] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [transactions, setTransactions] = useState([]);
  const [parcelId, setParcelId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [checkParcelId, setCheckParcelId] = useState("");
  const [parcelStatus, setParcelStatus] = useState({ sent: false, received: false });

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const assessmentABIJson = assessmentABI.abi;

  // Initialize Wallet
  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    } else {
      console.log("MetaMask not detected");
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  // Handle Account
  const handleAccount = (account) => {
    if (account.length > 0) {
      console.log("Account connected: ", account[0]);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  // Connect Account
  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);

      // Once wallet is set, get a reference to our deployed contract
      getAssessmentContract();
    } catch (error) {
      console.error("Error connecting account:", error);
    }
  };

  // Get Contract Instance
  const getAssessmentContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const assessmentContract = new ethers.Contract(contractAddress, assessmentABIJson, signer);

    setAssessment(assessmentContract);
  };

  // Get Balance
  const getBalance = async () => {
    if (assessment) {
      try {
        const balance = await assessment.getBalance();
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  // Add Transaction to State
  const addTransaction = (type, amount) => {
    setTransactions((prev) => [
      ...prev,
      { type, amount, timestamp: new Date().toLocaleString() },
    ]);
  };

  // Deposit Function
  const deposit = async (amount) => {
    if (assessment) {
      try {
        const tx = await assessment.deposit(ethers.utils.parseEther(amount));
        await tx.wait();
        getBalance();
        addTransaction("Deposit", amount);
        alert(`Successfully deposited ${amount} ETH`);
      } catch (error) {
        console.error("Deposit failed:", error);
        alert("Deposit failed. Please try again.");
      }
    }
  };

  // Withdraw Function
  const withdraw = async (amount) => {
    if (assessment) {
      try {
        const tx = await assessment.withdraw(ethers.utils.parseEther(amount));
        await tx.wait();
        getBalance();
        addTransaction("Withdraw", amount);
        alert(`Successfully withdrew ${amount} ETH`);
      } catch (error) {
        console.error("Withdraw failed:", error);
        alert("Withdraw failed. Please try again.");
      }
    }
  };

  // Send Parcel Function
  const sendParcel = async () => {
    if (assessment) {
      if (!parcelId || !recipient) {
        alert("Please enter both Parcel ID and Recipient Address.");
        return;
      }

      try {
        const tx = await assessment.sendParcel(parcelId, recipient);
        await tx.wait();
        addTransaction("Send Parcel", `ID: ${parcelId}, Recipient: ${recipient}`);
        alert(`Parcel ${parcelId} sent to ${recipient}`);
        // Reset form fields
        setParcelId("");
        setRecipient("");
      } catch (error) {
        console.error("Send Parcel failed:", error);
        alert("Send Parcel failed. Please ensure the Parcel ID is unique and try again.");
      }
    }
  };

  // Receive Parcel Function
  const receiveParcel = async () => {
    if (assessment) {
      if (!parcelId) {
        alert("Please enter a Parcel ID to receive.");
        return;
      }

      try {
        const tx = await assessment.receiveParcel(parcelId);
        await tx.wait();
        addTransaction("Receive Parcel", `ID: ${parcelId}`);
        alert(`Parcel ${parcelId} marked as received`);
        // Reset form field
        setParcelId("");
      } catch (error) {
        console.error("Receive Parcel failed:", error);
        alert("Receive Parcel failed. Please ensure the Parcel ID is valid and try again.");
      }
    }
  };

  // Check Parcel Status Function
  const checkParcelStatus = async () => {
    if (assessment) {
      if (!checkParcelId) {
        alert("Please enter a Parcel ID to check status.");
        return;
      }

      try {
        const sent = await assessment.sentOrNot(checkParcelId);
        const received = await assessment.receivedOrNot(checkParcelId);
        setParcelStatus({ sent, received });
      } catch (error) {
        console.error("Check Parcel Status failed:", error);
        alert("Check Parcel Status failed. Please ensure the Parcel ID is valid and try again.");
      }
    }
  };

  // Initialize User on Component Mount
  useEffect(() => {
    getWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch Balance whenever the contract or account changes
  useEffect(() => {
    if (assessment && account) {
      getBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment, account]);

  // UI Initialization Function
  const initUser = () => {
    // Check to see if user has MetaMask
    if (!ethWallet) {
      return <p>Please install MetaMask to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount} style={buttonStyle}>
          Connect Your MetaMask Wallet
        </button>
      );
    }

    return (
      <div>
        <div style={sectionStyle}>
          <button style={buttonStyle}>Account ID: {account}</button>
          <p></p>
          <button style={buttonStyle}>Remaining Balance: {balance} ETH</button>
          <p></p>
          <div style={actionContainerStyle}>
            <button onClick={() => deposit("1")} style={buttonStyle}>
              Deposit 1 ETH
            </button>
            <button onClick={() => withdraw("1")} style={buttonStyle}>
              Withdraw 1 ETH
            </button>
          </div>
          <div style={actionContainerStyle}>
            <button onClick={() => deposit("2")} style={buttonStyle}>
              Deposit 2 ETH
            </button>
            <button onClick={() => withdraw("2")} style={buttonStyle}>
              Withdraw 2 ETH
            </button>
          </div>
          <div style={actionContainerStyle}>
            <button onClick={() => deposit("5")} style={buttonStyle}>
              Deposit 5 ETH
            </button>
            <button onClick={() => withdraw("5")} style={buttonStyle}>
              Withdraw 5 ETH
            </button>
          </div>
        </div>

        {/* ==================== Parcel Management Section ==================== */}
        <div style={sectionStyle}>
          <h2>Parcel Management</h2>

          {/* Send Parcel Form */}
          <div style={formContainerStyle}>
            <h3>Send Parcel</h3>
            <input
              type="number"
              placeholder="Parcel ID"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={inputStyle}
            />
            <button onClick={sendParcel} style={buttonStyle}>
              Send Parcel
            </button>
          </div>

          {/* Receive Parcel Form */}
          <div style={formContainerStyle}>
            <h3>Receive Parcel</h3>
            <input
              type="number"
              placeholder="Parcel ID"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
              style={inputStyle}
            />
            <button onClick={receiveParcel} style={buttonStyle}>
              Receive Parcel
            </button>
          </div>

          {/* Check Parcel Status Form */}
          <div style={formContainerStyle}>
            <h3>Check Parcel Status</h3>
            <input
              type="number"
              placeholder="Parcel ID"
              value={checkParcelId}
              onChange={(e) => setCheckParcelId(e.target.value)}
              style={inputStyle}
            />
            <button onClick={checkParcelStatus} style={buttonStyle}>
              Check Status
            </button>
            {parcelStatus.sent !== undefined && (
              <div style={{ marginTop: "10px" }}>
                <p>Sent: {parcelStatus.sent ? "Yes" : "No"}</p>
                <p>Received: {parcelStatus.received ? "Yes" : "No"}</p>
              </div>
            )}
          </div>
        </div>

        {/* ==================== Transactions List ==================== */}
        <div style={sectionStyle}>
          <h2>Transaction History</h2>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount / Details</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.type}</td>
                    <td>{tx.amount}</td>
                    <td>{tx.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="container">
      <header>
        <h1>WELCOME METACRAFTERS!!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          font-family: "Lucida Handwriting", cursive;
          background-color: #357fb2;
          padding: 50px;
          min-height: 100vh;
        }
        header {
          border: 2px solid #ffffff;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          background-color: #ffffff;
          display: inline-block;
        }
      `}</style>
    </main>
  );
}

// ==================== Styles ====================
const buttonStyle = {
  fontFamily: "Courier New, Courier, monospace",
  backgroundColor: "white",
  color: "#357FB2",
  border: "none",
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: "16px",
  borderRadius: "8px",
  fontWeight: "bold",
  margin: "5px",
};

const sectionStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "10px",
  margin: "20px auto",
  maxWidth: "600px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const formContainerStyle = {
  margin: "20px 0",
};

const inputStyle = {
  padding: "10px",
  margin: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "80%",
  fontSize: "16px",
};

const actionContainerStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  margin: "10px 0",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

