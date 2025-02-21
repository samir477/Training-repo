// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StorageVsMemory {
    // State variable stored permanently on blockchain
    string private storedText;
    
    // Event to track updates
    event TextUpdated(string oldText, string newText);
    
    // Constructor to initialize the stored text
    constructor() {
        storedText = "Initial Note";
    }
    
    // Memory function - temporary modification
    function updateWithMemory(string memory newText) public pure returns (string memory) {
        string memory temporaryText = newText;
        return temporaryText;
    }
    
    // Storage function - permanent modification
    function updateWithStorage(string memory newText) public returns (string memory) {
        string memory oldText = storedText;  // Store the old value
        storedText = newText;               // Update the storage
        emit TextUpdated(oldText, newText); // Emit event for tracking
        return storedText;
    }
    
    // Getter function to read the stored text
    function getStoredText() public view returns (string memory) {
        return storedText;
    }
}