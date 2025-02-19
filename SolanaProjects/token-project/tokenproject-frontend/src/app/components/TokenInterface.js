'use client';
import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../idl/tokenproject.json';

const TokenInterface = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState('');
  const [recipient, setRecipient] = useState('');

  // Your program ID from declare_id!()
  const PROGRAM_ID = new PublicKey('7GdAN4958LVHbDi3sCGSaSkAiN6HcjDW8txVwPaX4NLd');

  const getProvider = () => {
    if (!publicKey) return null;
    const provider = new AnchorProvider(
      connection,
      {
        publicKey,
        signTransaction,
        sendTransaction,
      },
      { commitment: 'processed' }
    );
    return provider;
  };

  const getProgram = () => {
    const provider = getProvider();
    if (!provider) return null;
    return new Program(idl, PROGRAM_ID, provider);
  };

  const checkBalance = async () => {
    try {
      const program = getProgram();
      if (!program) return;

      const balance = await program.methods
        .checkBalance()
        .accounts({
          user: publicKey,
        })
        .view();

      setBalance(balance.toString());
      setStatus('Balance checked successfully');
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error checking balance: ${error.message}`);
    }
  };

  const mintTokens = async () => {
    try {
      const program = getProgram();
      if (!program) return;

      await program.methods
        .mintTokens(new web3.BN(amount), true)
        .accounts({
          user: publicKey,
        })
        .rpc();

      setStatus('Tokens minted successfully');
      checkBalance();
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error minting tokens: ${error.message}`);
    }
  };

  const transferTokens = async () => {
    if (!recipient) {
      setStatus('Please enter a recipient address');
      return;
    }

    try {
      const program = getProgram();
      if (!program) return;

      const recipientPubkey = new PublicKey(recipient);

      await program.methods
        .transferTokens(new web3.BN(amount))
        .accounts({
          from: publicKey,
          to: recipientPubkey,
        })
        .rpc();

      setStatus('Tokens transferred successfully');
      checkBalance();
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error transferring tokens: ${error.message}`);
    }
  };

  const burnTokens = async () => {
    try {
      const program = getProgram();
      if (!program) return;

      await program.methods
        .burnTokens(new web3.BN(amount))
        .accounts({
          user: publicKey,
        })
        .rpc();

      setStatus('Tokens burned successfully');
      checkBalance();
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error burning tokens: ${error.message}`);
    }
  };

  const requestTokens = async () => {
    try {
      const program = getProgram();
      if (!program) return;

      await program.methods
        .requestTokens(new web3.BN(amount))
        .accounts({
          user: publicKey,
        })
        .rpc();

      setStatus('Token request submitted successfully');
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error requesting tokens: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">Token Program Interface</h1>
      
      <div className="flex justify-center mb-6">
        <WalletMultiButton />
      </div>

      {publicKey && (
        <div className="space-y-4">
          <div className="space-y-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-2 border rounded"
            />
            
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient address (for transfers)"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={mintTokens}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Mint Tokens
            </button>
            <button
              onClick={transferTokens}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Transfer Tokens
            </button>
            <button
              onClick={burnTokens}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Burn Tokens
            </button>
            <button
              onClick={requestTokens}
              className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Request Tokens
            </button>
            <button
              onClick={checkBalance}
              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 col-span-2"
            >
              Check Balance
            </button>
          </div>

          {balance !== null && (
            <div className="p-4 bg-gray-100 rounded">
              <p className="text-lg">Current Balance: {balance}</p>
            </div>
          )}

          {status && (
            <div className="p-4 bg-blue-100 rounded">
              <p>{status}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenInterface;