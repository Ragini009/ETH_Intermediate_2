## MetaCrafters ATM DApp

This project is a simple decentralized application (DApp) that allows users to interact with a smart contract to deposit and withdraw Ether. It uses the Ethereum blockchain and MetaMask for managing accounts and transactions.

### Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [User Interface](#user-interface)
- [Features](#features)
- [Components](#components)
- [Smart Contract](#smart-contract)
- [License](#license)

### Installation

1. **Clone the Repository:**
    ```sh
    git clone https://github.com/yourusername/metacrafters-atm-dapp.git
    cd metacrafters-atm-dapp
    ```

2. **Install Dependencies:**
    ```sh
    npm install
    ```

3. **Start the Application:**
    ```sh
    npm run dev
    ```

### Usage

1. **Ensure MetaMask is Installed:**
   - Install the MetaMask extension in your browser if you haven't already.

2. **Connect MetaMask:**
   - Open the application in your browser.
   - Click the "Connect Your Metamask Wallet to Metacrafters" button to connect your MetaMask account.

3. **Interact with the ATM:**
   - Once connected, you can deposit or withdraw Ether using the provided buttons.

### Dependencies

- **React:** For building the user interface.
- **Ethers.js:** For interacting with the Ethereum blockchain.
- **MetaMask:** For managing user accounts and transactions.

Install these dependencies via `npm`:
```sh
npm install react ethers
```

### User Interface

The UI is designed with simplicity and user-friendliness in mind. Below is a brief description of the UI components:

- **Header:** Welcomes users to the MetaCrafters ATM.
- **Connect Wallet Button:** Prompts users to connect their MetaMask wallet.
- **Account Display:** Shows the connected MetaMask account ID.
- **Balance Display:** Shows the user's remaining balance in Ether.
- **Transaction Buttons:** Allows users to deposit or withdraw specified amounts of Ether.
- **Transaction History:** Displays a list of past transactions (this feature is implemented but not rendered in the UI as per the provided code).

### Features

- **Connect to MetaMask:** Easily connect your MetaMask wallet to the DApp.
- **Check Balance:** View your current Ether balance in the smart contract.
- **Deposit Ether:** Deposit Ether into the smart contract.
- **Withdraw Ether:** Withdraw Ether from the smart contract.
- **Transaction History:** (Implemented in state management but not yet displayed in the UI) Track deposits and withdrawals with timestamps.

### Components

- **HomePage Component:**
  - Handles the connection to MetaMask.
  - Manages the state of the application including the user's account, balance, and transaction history.
  - Provides UI for interacting with the smart contract (depositing and withdrawing Ether).

### Smart Contract

- **Contract Address:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **ABI:** Located in `../artifacts/contracts/Assessment.sol/Assessment.json`

### License

This project is licensed under the MIT License. See the LICENSE file for details.
