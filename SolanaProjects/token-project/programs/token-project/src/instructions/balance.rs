use anchor_lang::prelude::*;
use anchor_spl::token_interface::TokenAccount;
use crate::errors::ErrorCode; 


#[derive(Accounts)]
pub struct CheckBalance<'info> {
    #[account(mut)]
    pub user: Signer<'info>, // User checking balance

    #[account(
        constraint = token_account.owner == user.key() @ ErrorCode::InvalidOwner
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>, // The user's token account
}

pub fn check_balance(ctx: Context<CheckBalance>) -> Result<u64> {
    Ok(ctx.accounts.token_account.amount) // Return token balance
}
