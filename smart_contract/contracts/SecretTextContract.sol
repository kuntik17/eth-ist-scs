// SPDX-License-Identifier: MIT

// to deploy: npx hardhat run scripts/deploy.js
pragma solidity ^0.8.0;

contract SecretTextContract {
    address public owner;
    mapping(address => bool) public allowedAddresses;
    mapping(address => uint256) public stakes;
    string[] private secretTexts;
    bool public confirmSecretStatus;

    event SecretTextChanged(string newSecretText, address setter);
    event StakeAdded(address indexed staker, uint256 amount);
    event StakeReturned(address indexed staker, uint256 amount);
    event StakePaidToOwner(address indexed owner, uint256 amount);
    event ConfirmSecretStatusSet(bool newStatus);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyAllowed() {
        require(allowedAddresses[msg.sender], "Not an allowed address");
        _;
    }

    function setSecretText(string memory _secretText) public onlyAllowed {
        secretTexts.push(_secretText);
        emit SecretTextChanged(_secretText, msg.sender);
    }

    function getSecretText(uint256 index) public view onlyAllowed returns (string memory) {
        require(index < secretTexts.length, "Index out of bounds");
        return secretTexts[index];
    }

    function addAllowedAddress(address _address) public onlyOwner {
        allowedAddresses[_address] = true;
    }

    function removeAllowedAddress(address _address) public onlyOwner {
        allowedAddresses[_address] = false;
    }

    function getSecretTextsCount() public view returns (uint256) {
        return secretTexts.length;
    }

    function addStake() public payable {
        require(msg.value > 0, "Stake amount must be greater than 0");
        stakes[msg.sender] += msg.value;
        emit StakeAdded(msg.sender, msg.value);
    }

    function returnStake() public {
        uint256 stakeAmount = stakes[msg.sender];
        require(stakeAmount > 0, "No stake to return");
        stakes[msg.sender] = 0;
        payable(msg.sender).transfer(stakeAmount);
        emit StakeReturned(msg.sender, stakeAmount);
    }

    function payStakeToOwner() public {
        uint256 stakeAmount = stakes[msg.sender];
        require(stakeAmount > 0, "No stake to pay");
        stakes[msg.sender] = 0;
        payable(owner).transfer(stakeAmount);
        emit StakePaidToOwner(owner, stakeAmount);
    }

    function setConfirmSecretStatus(bool _status) public onlyOwner {
        confirmSecretStatus = _status;
        emit ConfirmSecretStatusSet(_status);
    }

}
