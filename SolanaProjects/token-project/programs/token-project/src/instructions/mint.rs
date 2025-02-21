use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    mint_to, transfer_checked, Mint, TokenAccount, TokenInterface, MintTo, TransferChecked,
};

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    pub admin: Signer<'info>, // The admin (mint authority)

    #[account(
        mut,
        constraint = mint_account.mint_authority.unwrap() == admin.key() @ ErrorCode::InvalidMintAuthority // ✅ Fixed
    )]
    pub mint_account: InterfaceAccount<'info, Mint>, // The token mint account

    #[account(
        mut,
        constraint = admin_token_account.mint == mint_account.key() @ ErrorCode::InvalidMintAccount
    )]
    pub admin_token_account: InterfaceAccount<'info, TokenAccount>, // Admin’s token account

    #[account(
        mut,
        constraint = recipient_token_account.mint == mint_account.key() @ ErrorCode::InvalidRecipientAccount
    )]
    pub recipient_token_account: InterfaceAccount<'info, TokenAccount>, // The recipient’s token account

    pub token_program: Interface<'info, TokenInterface>, // The SPL token program
}

pub fn mint_tokens(ctx: Context<MintTokens>, amount: u64, send_to_player: bool) -> Result<()> {
    let mint_accounts = MintTo {
        mint: ctx.accounts.mint_account.to_account_info(),
        to: ctx.accounts.admin_token_account.to_account_info(),
        authority: ctx.accounts.admin.to_account_info(),
    };

    let cpi_context = CpiContext::new(ctx.accounts.token_program.to_account_info(), mint_accounts);

    mint_to(cpi_context, amount)?;

    if send_to_player {
        let transfer_accounts = TransferChecked {
            from: ctx.accounts.admin_token_account.to_account_info(),
            mint: ctx.accounts.mint_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.admin.to_account_info(),
        };

        let cpi_transfer = CpiContext::new(ctx.accounts.token_program.to_account_info(), transfer_accounts);

        transfer_checked(cpi_transfer, amount, ctx.accounts.mint_account.decimals)?;
    }

    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid mint authority (admin) account.")]
    InvalidMintAuthority,

    #[msg("Invalid mint account.")]
    InvalidMintAccount,

    #[msg("Invalid recipient token account.")]
    InvalidRecipientAccount,
}
