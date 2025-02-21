// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureVotingSystem is ReentrancyGuard {
    // Admin of the voting system
    address public admin;

    // Voting phases
    enum VotingPhase { Registration, Voting, Ended }
    VotingPhase public currentPhase;

    struct Candidate {
        string name;
        uint256 voteCount;
        bool exists;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        address votedCandidate;
    }

    // Mapping of candidate addresses to their details
    mapping(address => Candidate) public candidates;
    // Mapping of voter addresses
    mapping(address => Voter) public voters;
    // List of all candidate addresses
    address[] public candidateList;
    // Total votes cast
    uint256 public totalVotes;

    // Events
    event CandidateRegistered(address indexed candidate, string name);
    event VoterRegistered(address indexed voter);
    event VoteCast(address indexed voter, address indexed candidate);
    event PhaseChanged(VotingPhase newPhase);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier inPhase(VotingPhase phase) {
        require(currentPhase == phase, "Action not allowed in this phase");
        _;
    }

    constructor() {
        admin = msg.sender;
        currentPhase = VotingPhase.Registration;
    }

    // Admin registers candidates
    function registerCandidate(address _candidate, string memory _name) external onlyAdmin inPhase(VotingPhase.Registration) {
        require(!candidates[_candidate].exists, "Candidate already registered");
        candidates[_candidate] = Candidate(_name, 0, true);
        candidateList.push(_candidate);

        emit CandidateRegistered(_candidate, _name);
    }

    // Admin registers voters
    function registerVoter(address _voter) external onlyAdmin inPhase(VotingPhase.Registration) {
        require(!voters[_voter].isRegistered, "Voter already registered");
        voters[_voter] = Voter(true, false, address(0));

        emit VoterRegistered(_voter);
    }

    // Admin starts voting phase
    function startVoting() external onlyAdmin inPhase(VotingPhase.Registration) {
        require(candidateList.length > 0, "At least one candidate required");
        currentPhase = VotingPhase.Voting;
        emit PhaseChanged(VotingPhase.Voting);
    }

    // Voter casts their vote (with reentrancy protection)
    function vote(address _candidate) external nonReentrant inPhase(VotingPhase.Voting) {
        require(voters[msg.sender].isRegistered, "You are not registered to vote");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(candidates[_candidate].exists, "Invalid candidate");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidate = _candidate;
        candidates[_candidate].voteCount++;
        totalVotes++;

        emit VoteCast(msg.sender, _candidate);
    }

    // Admin ends voting and locks the contract
    function endVoting() external onlyAdmin inPhase(VotingPhase.Voting) {
        currentPhase = VotingPhase.Ended;
        emit PhaseChanged(VotingPhase.Ended);
    }

    // Get the winner (public view function)
    function getWinner() external view inPhase(VotingPhase.Ended) returns (address winner, string memory name, uint256 votes) {
        require(totalVotes > 0, "No votes cast");

        uint256 maxVotes = 0;
        for (uint256 i = 0; i < candidateList.length; i++) {
            if (candidates[candidateList[i]].voteCount > maxVotes) {
                maxVotes = candidates[candidateList[i]].voteCount;
                winner = candidateList[i];
            }
        }

        return (winner, candidates[winner].name, maxVotes);
    }
}
