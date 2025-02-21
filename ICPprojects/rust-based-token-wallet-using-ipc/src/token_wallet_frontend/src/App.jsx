import React, { useState } from 'react';
import { token_wallet_backend } from 'declarations/token_wallet_backend';
import './index.scss'; // Import custom styling
import  { ActorSubclass, HttpAgentOptions, ActorConfig, Agent } from "@dfinity/agent";
import  { Principal } from "@dfinity/principal";
import  { IDL } from "@dfinity/candid";


function App() {
  // States to manage form inputs and results
  const [greeting, setGreeting] = useState('');
  const [balance, setBalance] = useState(null);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionResult, setTransactionResult] = useState('');
  const [wallet, setWallet] = useState(null);

  // Handle greeting submit
  function handleGreetingSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    token_wallet_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
  }

  // Handle create wallet
  function handleCreateWallet() {
    token_wallet_backend.create_wallet().then((newWallet) => {
      setWallet(newWallet); // Update the wallet state with the created wallet
      alert('Wallet created successfully!'); // Notify the user
    }).catch((error) => {
      alert('Error creating wallet: ' + error); // Handle any errors
    });
  }

  // Handle balance fetch
  function handleGetBalance(event) {
    event.preventDefault();
    if (wallet) {
      token_wallet_backend.get_balance(fromAccount).then((balance) => {
        setBalance(balance);
      });
    } else {
      alert('Please create a wallet first!');
    }
  }

  // Handle transfer
  function handleTransfer(event) {
    event.preventDefault();
    if (wallet) {
      const transferAmount = parseInt(amount);
      token_wallet_backend
        .transfer_tokens(fromAccount, toAccount, transferAmount)
        .then(() => {
          setTransactionResult('Transaction Successful!');
        })
        .catch((error) => {
          setTransactionResult(`Error: ${error}`);
        });
    } else {
      alert('Please create a wallet first!');
    }
  }

  return (
    <main className="app-container">
      <h1>Token Wallet DApp</h1>
      <img src="/logo2.svg" alt="DFINITY logo" className="logo" />

      {/* Greeting Section */}
      <section className="form-section">
        <form onSubmit={handleGreetingSubmit}>
          <label htmlFor="name">Enter your name: </label>
          <input id="name" type="text" placeholder="Your Name" required />
          <button type="submit">Greet Me!</button>
        </form>
        {greeting && <section className="result">{greeting}</section>}
      </section>

      {/* Create Wallet Section */}
      <section className="form-section">
        <button className="btn-create-wallet" onClick={handleCreateWallet}>
          Create Wallet
        </button>
      </section>

      {/* Balance Section */}
      <section className="form-section">
        <form onSubmit={handleGetBalance}>
          <label htmlFor="fromAccount">Enter Account ID for Balance: </label>
          <input
            id="fromAccount"
            type="text"
            placeholder="Account ID"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            required
          />
          <button type="submit">Get Balance</button>
        </form>
        {balance !== null ? (
          <section className="result">Balance: {balance}</section>
        ) : (
          <section className="result">Enter account ID to view balance.</section>
        )}
      </section>

      {/* Transfer Section */}
      <section className="form-section">
        <form onSubmit={handleTransfer}>
          <label htmlFor="fromAccount">From Account: </label>
          <input
            id="fromAccount"
            type="text"
            placeholder="From Account"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            required
          />

          <label htmlFor="toAccount">To Account: </label>
          <input
            id="toAccount"
            type="text"
            placeholder="To Account"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            required
          />

          <label htmlFor="amount">Amount: </label>
          <input
            id="amount"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          
          <button type="submit">Transfer Tokens</button>
        </form>
        {transactionResult && <section className="result">{transactionResult}</section>}
      </section>
    </main>
  );
}

export default App;
