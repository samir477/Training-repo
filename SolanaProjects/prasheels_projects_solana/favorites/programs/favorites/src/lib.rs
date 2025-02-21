use anchor_lang::prelude::*;

// Our program's address!
// This matches the key in the target/deploy directory
declare_id!("ww9C83noARSQVBnqmCUmaVdbJjmiwcV9j2LkXYMoUCV");

// Anchor programs always use 8 bits for the discriminator
pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

// Our Solana program!
#[program]
pub mod favorites {
    use super::*;

    // Set the user's favorite number, color, and hobbies
    pub fn set_favorites(
        context: Context<SetFavorites>,
        number: u64,
        color: String,
        hobbies: Vec<String>,
    ) -> Result<()> {
        let user_public_key = context.accounts.user.key();

        // Validate inputs
        require!(number >= 1 && number <= 100, CustomError::InvalidNumber);
        require!(hobbies.len() <= 5, CustomError::TooManyHobbies);

        msg!("Setting favorites for user {}", user_public_key);
        msg!(
            "Favorite number: {}, Favorite color: {}, Hobbies: {:?}",
            number, color, hobbies
        );

        context.accounts.favorites.set_inner(Favorites {
            number,
            color,
            hobbies,
        });

        Ok(())
    }

    // Update an existing user's favorite data
    pub fn update_favorites(
        context: Context<UpdateFavorites>,
        number: u64,
        color: String,
        hobbies: Vec<String>,
    ) -> Result<()> {
        let user_public_key = context.accounts.user.key();

        // Validate inputs
        require!(number >= 1 && number <= 100, CustomError::InvalidNumber);
        require!(hobbies.len() <= 5, CustomError::TooManyHobbies);

        let favorites = &mut context.accounts.favorites;
        favorites.number = number;
        favorites.color = color;
        favorites.hobbies = hobbies;

        msg!("Updated favorites for user {}", user_public_key);
        msg!(
            "New Favorite number: {}, New Favorite color: {}, New Hobbies: {:?}",
            number, color, favorites.hobbies
        );

        Ok(())
    }

    // Retrieve a user's favorite details
    pub fn get_favorites(context: Context<GetFavorites>) -> Result<Favorites> {
        let user_public_key = context.accounts.user.key();
        let favorites = &context.accounts.favorites;

        msg!("Fetching favorites for user {}", user_public_key);
        msg!(
            "Favorite number: {}, Favorite color: {}, Hobbies: {:?}",
            favorites.number, favorites.color, favorites.hobbies
        );

        Ok(favorites.clone()) // Returning a copy of the Favorites data
    }
}

// Data structure to store user's favorite information
#[account]
#[derive(InitSpace)]
pub struct Favorites {
    pub number: u64,

    #[max_len(50)]
    pub color: String,

    #[max_len(5, 50)]
    pub hobbies: Vec<String>,
}

// Context for setting favorites
#[derive(Accounts)]
pub struct SetFavorites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Favorites::INIT_SPACE,
        seeds = [b"favorites", user.key().as_ref()],
        bump
    )]
    pub favorites: Account<'info, Favorites>,

    pub system_program: Program<'info, System>,
}

// Context for updating favorites
#[derive(Accounts)]
pub struct UpdateFavorites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        has_one = user,
        seeds = [b"favorites", user.key().as_ref()],
        bump
    )]
    pub favorites: Account<'info, Favorites>,

    pub system_program: Program<'info, System>,
}

// Context for fetching favorites
#[derive(Accounts)]
pub struct GetFavorites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        seeds = [b"favorites", user.key().as_ref()],
        bump
    )]
    pub favorites: Account<'info, Favorites>,
}

// Custom Errors
#[error_code]
pub enum CustomError {
    #[msg("Invalid favorite number. Please choose a number between 1 and 100.")]
    InvalidNumber,

    #[msg("Too many hobbies. Maximum allowed is 5.")]
    TooManyHobbies,
}
