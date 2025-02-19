use candid::{CandidType, Deserialize};
use ic_cdk_macros::{query, update};
use serde::{Serialize as SerdeSerialize};

#[derive(CandidType, Deserialize, SerdeSerialize, Clone, Debug)]
pub struct Token {
    account_id: String,
    balance: u64,
}

#[derive(CandidType, Deserialize, SerdeSerialize)]
pub struct TokenWallet {
    tokens: Vec<Token>,
}

impl TokenWallet {
    pub fn new() -> TokenWallet {
        TokenWallet {
            tokens: Vec::new(),
        }
    }

    pub fn get_balance(&self, account_id: &str) -> Option<u64> {
        self.tokens.iter().find(|token| token.account_id == account_id).map(|token| token.balance)
    }

    pub fn transfer(&mut self, from_account: &str, to_account: &str, amount: u64) -> Result<(), String> {
        if let (Some(from_index), Some(to_index)) = (
            self.tokens.iter().position(|x| x.account_id == from_account),
            self.tokens.iter().position(|x| x.account_id == to_account),
        ) {
            if self.tokens[from_index].balance >= amount {
                self.tokens[from_index].balance -= amount;
                self.tokens[to_index].balance += amount;
                Ok(())
            } else {
                Err("Insufficient funds".to_string())
            }
        } else {
            Err("Account(s) not found".to_string())
        }
    }

    pub fn receive_tokens(&mut self, to_account: &str, amount: u64) {
        if let Some(index) = self.tokens.iter().position(|x| x.account_id == to_account) {
            self.tokens[index].balance += amount;
        } else {
            self.tokens.push(Token {
                account_id: to_account.to_string(),
                balance: amount,
            });
        }
    }
}

#[derive(Debug)]
enum WalletError {
    InsufficientFunds,
    AccountNotFound,
}

// Greet function
#[query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

// Create Wallet function (this is the update function)
#[update]
fn create_wallet() -> TokenWallet {
    TokenWallet::new() // Create and return a new wallet instance
}

// Get Balance function
#[query]
fn get_balance(account_id: String) -> Option<u64> {
    let wallet = TokenWallet::new(); // Example, replace with actual instance
    wallet.get_balance(&account_id)
}

// Transfer Tokens function
#[update]
fn transfer_tokens(from_account: String, to_account: String, amount: u64) -> Result<(), String> {
    let mut wallet = TokenWallet::new(); // Example, replace with actual instance
    wallet.transfer(&from_account, &to_account, amount)
}
