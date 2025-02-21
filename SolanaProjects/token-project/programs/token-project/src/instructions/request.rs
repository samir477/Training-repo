use anchor_lang::prelude::*;
use crate::errors::ErrorCode;

#[account]
pub struct TokenRequest {
    pub user: Pubkey,   // User requesting tokens
    pub amount: u64,    // Amount requested
    pub approved: bool, // Default: false (pending)
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct RequestTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>, // User submitting the request

    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 1,
        seeds = [b"request", user.key().as_ref()], // Unique request address
        bump
    )]
    pub request: Account<'info, TokenRequest>, // Stores request details

    pub system_program: Program<'info, System>,
}

pub fn request_tokens(ctx: Context<RequestTokens>, amount: u64) -> Result<()> {
    let request = &mut ctx.accounts.request;
    request.user = ctx.accounts.user.key();
    request.amount = amount;
    request.approved = false;

    msg!("✅ {} requested {} tokens", ctx.accounts.user.key(), amount);

    emit!(RequestCreated {
        user: ctx.accounts.user.key(),
        amount,
    });

    Ok(())
}

#[event]
pub struct RequestCreated {
    pub user: Pubkey,
    pub amount: u64,
}

#[derive(Accounts)]
pub struct ApproveRequest<'info> {
    #[account(mut)]
    pub admin: Signer<'info>, // Admin approving the request

    #[account(mut, has_one = user, close = user)] // Closes account after approval
    pub request: Account<'info, TokenRequest>, // Request to be approved

    #[account(mut)]
    pub user: SystemAccount<'info>, // User who made the request
}

pub fn approve_request(ctx: Context<ApproveRequest>) -> Result<()> {
    let request = &mut ctx.accounts.request;
    request.approved = true;

    msg!("✅ Admin approved {} tokens for {}", request.amount, request.user);

    Ok(())
}

// 🔹 Fetch all requests from the frontend (No on-chain iteration)
#[derive(Accounts)]
pub struct ListRequests<'info> {
    pub admin: Signer<'info>, // Admin fetching the requests
}

