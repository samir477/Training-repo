use anchor_lang::prelude::*;
use anchor_spl::token_interface::{burn, Burn, TokenAccount, TokenInterface};
use crate::errors::ErrorCode; // ✅ Import errors

#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>, // ✅ User who owns the tokens

    #[account(
        mut,
        constraint = token_account.owner == user.key() @ ErrorCode::UnauthorizedBurner, // Ensure user owns the tokens
        constraint = token_account.mint == mint_account.key() @ ErrorCode::InvalidMintAccount // Ensure correct mint
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>, // ✅ User's token account

    #[account(mut)]
    pub mint_account: InterfaceAccount<'info, TokenAccount>, // ✅ Mint account (same mint as token account)

    pub token_program: Interface<'info, TokenInterface>, // ✅ SPL Token program
}

pub fn burn_tokens(ctx: Context<BurnTokens>, amount: u64) -> Result<()> {
    let burn_accounts = Burn {
        mint: ctx.accounts.mint_account.to_account_info(),
        from: ctx.accounts.token_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(), // ✅ User must be the authority
    };

    let cpi_context = CpiContext::new(ctx.accounts.token_program.to_account_info(), burn_accounts);
    burn(cpi_context, amount)?; // ✅ Burn tokens

    Ok(())
}
