'use client';
import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import idl from '../idl/tokenproject.json';

const TokenInterface = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [status, setStatus] = useState('');
  const [recipient, setRecipient] = useState('');
  const [publicKey, setPublicKey] = useState(null);

  // Your program ID (Update with your deployed program ID)
  const PROGRAM_ID = new PublicKey('7GdAN4958LVHbDi3sCGSaSkAiN6HcjDW8txVwPaX4NLd');

  useEffect(() => {
    if (wallet.publicKey) {
      setPublicKey(wallet.publicKey);
    }
  }, [wallet]);

  const getProvider = () => {
    if (!wallet.publicKey) return null;
    return new AnchorProvider(
      connection,
      wallet,
      { commitment: 'processed' }
    );
  };

  const getProgram = () => {
    const provider = getProvider();
    if (!provider) return null;
    return new Program(idl, PROGRAM_ID, provider);
  };

  const checkBalance = async () => {
    try {
      const program = getProgram();
      if (!program || !publicKey) return;

      const tokenAccount = await getAssociatedTokenAddress(PROGRAM_ID, publicKey);

      const balance = await program.account.tokenAccount.fetch(tokenAccount);
      setBalance(balance.amount.toString());
      setStatus('Balance checked successfully');
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error checking balance: ${error.message}`);
    }
  };

  const mintTokens = async () => {
    try {
      const program = getProgram();
      if (!program || !publicKey) return;

      const mintAccount = new PublicKey('YourMintAccountHere');
      const adminTokenAccount = await getAssociatedTokenAddress(mintAccount, publicKey);

      await program.methods
        .mintTokens(new BN(amount), true)
        .accounts({
          admin: publicKey,
          mintAccount: mintAccount,
          adminTokenAccount: adminTokenAccount,
          recipientTokenAccount: adminTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
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
      if (!program || !publicKey) return;

      const recipientPubkey = new PublicKey(recipient);
      const senderTokenAccount = await getAssociatedTokenAddress(PROGRAM_ID, publicKey);
      const recipientTokenAccount = await getAssociatedTokenAddress(PROGRAM_ID, recipientPubkey);

      await program.methods
        .transferTokens(new BN(amount))
        .accounts({
          from: publicKey,
          fromAccount: senderTokenAccount,
          toAccount: recipientTokenAccount,
          mint: new PublicKey('YourMintAccountHere'),
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      setStatus('Tokens transferred successfully');
      checkBalance();
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error transferring tokens: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">Token Program Interface</h1>
      
      {publicKey ? (
        <div className="text-center mb-4">
          <p>Connected Wallet: {publicKey.toString()}</p>
        </div>
      ) : (
        <div className="text-center mb-4">
          <p>Wallet not connected</p>
        </div>
      )}

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
