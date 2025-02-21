use anchor_lang::prelude::*;


#[error_code]
pub enum ErrorCode {
    #[msg("Invalid mint authority.")]
    InvalidMintAuthority,

    #[msg("Invalid mint account.")]
    InvalidMintAccount,

    #[msg("Invalid recipient token account.")]
    InvalidRecipientAccount,

    #[msg("Invalid owner of the token account.")]
    InvalidOwner,

    #[msg("Unauthorized user trying to burn tokens.")]
    UnauthorizedBurner, // ✅ Added for burn function

    #[msg("Token request has not been approved.")]
    RequestNotApproved,
}
