#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_balance_retrieval() {
        let wallet = TokenWallet {
            tokens: vec![
                Token {
                    account_id: "alice".to_string(),
                    balance: 100,
                },
                Token {
                    account_id: "bob".to_string(),
                    balance: 50,
                },
            ],
        };

        assert_eq!(wallet.get_balance("alice"), Some(100));
        assert_eq!(wallet.get_balance("bob"), Some(50));
        assert_eq!(wallet.get_balance("nonexistent"), None);
    }

    #[test]
    fn test_token_transfer() {
        let mut wallet = TokenWallet {
            tokens: vec![
                Token {
                    account_id: "alice".to_string(),
                    balance: 100,
                },
                Token {
                    account_id: "bob".to_string(),
                    balance: 50,
                },
            ],
        };

        let result = wallet.transfer("alice", "bob", 30);
        assert!(result.is_ok());
        assert_eq!(wallet.get_balance("alice"), Some(70));
        assert_eq!(wallet.get_balance("bob"), Some(80));

        let result = wallet.transfer("alice", "bob", 100); // Should fail
        assert!(result.is_err());
    }

    #[test]
    fn test_receive_tokens() {
        let mut wallet = TokenWallet {
            tokens: vec![
                Token {
                    account_id: "alice".to_string(),
                    balance: 100,
                },
            ],
        };

        wallet.receive_tokens("alice", 50); // Add 50 to alice's balance
        assert_eq!(wallet.get_balance("alice"), Some(150));

        wallet.receive_tokens("bob", 30); // New account "bob"
        assert_eq!(wallet.get_balance("bob"), Some(30));
    }
}
