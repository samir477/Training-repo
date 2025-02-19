use anchor_lang::prelude::*;
use errors::*;
use instructions::*;
use instructions::transfer::*;
use instructions::mint::*;
use instructions::burn::*; // Import burn module
use instructions::balance::*;
use instructions::request::*;


pub mod instructions;
pub mod errors;

declare_id!("7GdAN4958LVHbDi3sCGSaSkAiN6HcjDW8txVwPaX4NLd");

#[program]
pub mod tokenproject {
    use super::*;

    pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        transfer::transfer_tokens(ctx, amount)
    }

    pub fn mint_tokens(ctx: Context<MintTokens>, amount: u64, send_to_player: bool) -> Result<()> {
        mint::mint_tokens(ctx, amount, send_to_player)
    }

    pub fn burn_tokens(ctx: Context<BurnTokens>, amount: u64) -> Result<()> {
        burn::burn_tokens(ctx, amount)
    }

    pub fn check_balance(ctx: Context<CheckBalance>) -> Result<u64> {
        balance::check_balance(ctx)
    }
    pub fn request_tokens(ctx: Context<RequestTokens>, amount: u64) -> Result<()> {
        request::request_tokens(ctx, amount)
    }

    pub fn approve_request(ctx: Context<ApproveRequest>) -> Result<()> {
        request::approve_request(ctx)
    }
    
}
