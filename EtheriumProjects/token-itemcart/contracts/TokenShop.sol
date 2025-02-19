// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RupeeTokenShop {
    mapping(address => uint256) private tokenBalance;

    event TokensSet(address indexed user, uint256 amount);
    event ItemPurchased(
        address indexed user,
        uint256 itemPrice,
        uint256 tokensUsed,
        uint256 extraPaymentRequired,
        uint256 tax,
        uint256 totalPayable
    );

    // Set initial token balance (in rupees)
    function setTokens(uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        tokenBalance[msg.sender] = amount;
        emit TokensSet(msg.sender, amount);
    }

    // Buy an item
    function buyItem(uint256 itemPrice) public payable {
        require(itemPrice > 0, "Item price must be greater than zero");

        uint256 tax = (itemPrice * 10) / 100; // 10% tax
        uint256 userTokens = tokenBalance[msg.sender];
        uint256 tokensUsed = 0;
        uint256 extraPaymentRequired = tax; // Tax must always be paid separately

        if (userTokens >= itemPrice) {
            // Tokens are enough to cover item price
            tokensUsed = itemPrice;
            extraPaymentRequired += 0; // No extra payment needed for item
        } else {
            // Tokens are not enough, use all tokens and calculate extra payment
            tokensUsed = userTokens;
            extraPaymentRequired += (itemPrice - userTokens); // Extra payment includes the shortfall
        }

        // Tokens are now used up, set balance to zero
        tokenBalance[msg.sender] = 0;

        // If extra payment is negative, set it to zero (meaning nothing extra is required)
        if (extraPaymentRequired < tax) {
            extraPaymentRequired = tax; // At minimum, user must always pay tax
        }

        // The user must send at least (extraPaymentRequired) in rupees
        require(msg.value >= extraPaymentRequired, "Insufficient rupees sent");

        emit ItemPurchased(
            msg.sender,
            itemPrice,
            tokensUsed,
            extraPaymentRequired,
            tax,
            itemPrice + tax
        );
    }

    // Get user's rupee balance
    function getTokenBalance(address user) public view returns (uint256) {
        return tokenBalance[user];
    }
}
