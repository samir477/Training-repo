'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { NodeWallet } from '@project-serum/anchor';
import { useEffect, useMemo, useState } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const endpoint = clusterApiUrl('devnet');

export default function RootLayout({ children }) {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    // Load keypair from environment or file
    const loadWallet = async () => {
      try {
        // You'll need to implement this function to load your keypair
        const keypairFile = process.env.NEXT_PUBLIC_KEYPAIR_PATH;
        const secretKey = new Uint8Array(JSON.parse(keypairFile));
        const nodeWallet = new NodeWallet(Keypair.fromSecretKey(secretKey));
        setWallet(nodeWallet);
      } catch (error) {
        console.error('Error loading wallet:', error);
      }
    };

    loadWallet();
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {wallet && (
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallet={wallet}>
              {children}
            </WalletProvider>
          </ConnectionProvider>
        )}
      </body>
    </html>
  );
}