// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrderCalculator {
    uint256 public orderAmount;
    uint256 public taxAmount;
    uint256 public couponValue;

    
    function setOrderDetails(
        uint256 _orderAmount,
        uint256 _taxAmount,
        uint256 _couponValue
    ) external {
        orderAmount = _orderAmount;
        taxAmount = _taxAmount;
        couponValue = _couponValue;
    }

   
    function calculateDiscountedAmount() public view returns (uint256) {
        if (orderAmount > couponValue) {
            return orderAmount - couponValue;
        } else {
            return 0;
        }
    }

                           
    function calculateTotalAmount() external view returns (uint256) {
        uint256 discountedAmount = calculateDiscountedAmount();
        return discountedAmount + taxAmount;
    }
}