// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract StorageVsMemory {
    string public storedText; // Permanently stored text (storage variable)

    // Function using memory (temporary modification)
    function updateWithMemory(string memory newText) public pure returns (string memory) {
        string memory tempText = newText; 
        return tempText; 
    }

    // Function using storage (permanent modification)
    function updateWithStorage(string memory newText) public {
        storedText = newText; // Permanently updates the state variable
    }
}
