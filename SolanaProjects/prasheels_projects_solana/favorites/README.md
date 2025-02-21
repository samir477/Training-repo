# 🏆 Favorites DApp - Solana Program (Anchor Framework)

This is a **Solana smart contract** built using the **Anchor framework**. The program allows users to store, update, and retrieve their **favorite number, color, and hobbies** securely on the blockchain.  

## 🚀 Features
- ✅ **Set Favorites**: Store favorite number, color, and hobbies.
- ✅ **Update Favorites**: Modify existing favorites.
- ✅ **Get Favorites**: Fetch stored favorite details.
- ✅ **Validation**: Ensures correct input (number range: `1-100`, max hobbies: `5`).
- ✅ **Custom Errors**: Improves error handling with `CustomError`.

---

## 🛠️ Installation

### 1️⃣ Prerequisites
- Install **Rust & Cargo**: [Rustup](https://rustup.rs/)
- Install **Solana CLI**:  
  ```sh
  sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest
  

  anchor build
solana config set --url devnet
anchor deploy
