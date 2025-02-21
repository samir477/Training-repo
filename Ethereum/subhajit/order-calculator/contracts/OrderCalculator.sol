// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrderCalculator {
    uint256 public orderAmount;
    uint256 public taxAmount;
    uint256 public couponValue;

    /**
     * @dev Sets the order details
     * @param _orderAmount Total order amount before tax and coupon
     * @param _taxAmount Tax amount (not affected by coupon)
     * @param _couponValue Coupon value to apply
     */
    function setOrderDetails(
        uint256 _orderAmount,
        uint256 _taxAmount,
        uint256 _couponValue
    ) external {
        orderAmount = _orderAmount;
        taxAmount = _taxAmount;
        couponValue = _couponValue;
    }

    /**
     * @dev Calculates the discounted amount after applying coupon
     * @return Discounted amount (never goes below 0)
     */
    function calculateDiscountedAmount() public view returns (uint256) {
        if (orderAmount > couponValue) {
            return orderAmount - couponValue;
        } else {
            return 0;
        }
    }

    /**
     * @dev Calculates the final total after adding tax
     * @return Final payable amount
     */
    function calculateTotalAmount() external view returns (uint256) {
        uint256 discountedAmount = calculateDiscountedAmount();
        return discountedAmount + taxAmount;
    }
}