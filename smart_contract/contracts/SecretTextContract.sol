// SPDX-License-Identifier: MIT

// to deploy: npx hardhat run scripts/deploy.js
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

abstract contract SecretTextContract is ChainlinkClient, ConfirmedOwner {

    using Chainlink for Chainlink.Request;
    //address public owner;
    mapping(address => bool) public allowedAddresses;
    mapping(address => uint256) public stakes;
    uint256 public price;
    string private secretText;
    bool public confirmSecretStatus;
    address public sellerAddress;
    address public buyerAddress;
    uint256 public volume;
    bytes32 private jobId;
    uint256 private fee;

    event RequestVolume(bytes32 indexed requestId, uint256 volume);

    event SecretTextChanged(string newSecretText, address setter);
    event StakeAdded(address indexed staker, uint256 amount);
    event StakeReturned(address indexed staker, uint256 amount);
    event StakePaidToSeller(address indexed owner, uint256 amount);
    event ConfirmSecretStatusSet(bool newStatus);
    event SellerAddressSet(address indexed newSellerAddress);
    event BuyerAddressSet(address indexed newBuyerAddress);
    event PriceSet(uint256 newPrice);

    /*constructor() {
        owner = msg.sender;
    }*/

    /*modifier onlyOwner() override {
        require(msg.sender == owner, "Not the owner");
        _;
    }*/

    modifier onlyAllowed() {
        require(allowedAddresses[msg.sender] || msg.sender == sellerAddress || msg.sender == buyerAddress /*|| msg.sender == owner*/, "Not an allowed address");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == sellerAddress, "Not the seller");
        _;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyerAddress, "Not the buyer");
        _;
    }

    modifier onlySellerAndBuyer() {
        require(msg.sender == sellerAddress || msg.sender == buyerAddress, "Only seller or buyer can call this");
        _;
    }

    // New function to set the seller address
    function setSellerAddress(address _sellerAddress) public onlyOwner {
        sellerAddress = _sellerAddress;
        emit SellerAddressSet(_sellerAddress);
    }

    // New function to set the buyer address
    function setBuyerAddress(address _buyerAddress) public onlyOwner {
        buyerAddress = _buyerAddress;
        emit BuyerAddressSet(_buyerAddress);
    }

    function addAllowedAddress(address _address) public onlyOwner {
        allowedAddresses[_address] = true;
    }

    function removeAllowedAddress(address _address) public onlyOwner {
        allowedAddresses[_address] = false;
    }

    function setSecretText(string memory _secretText) public onlySeller {
        secretText = _secretText;
        emit SecretTextChanged(_secretText, msg.sender);
    }

    function getSecretText() public view onlyAllowed returns (string memory) {
        return secretText;
    }

    // Function to add a stake, ensuring it matches the set price
    function addStake() public onlyBuyer payable {
        // Require that the sent value is equal to the price
        require(msg.value == price, "Stake amount must be equal to the price");

        stakes[msg.sender] += msg.value;
        emit StakeAdded(msg.sender, msg.value);
    }

    function returnStake() public onlyOwner{
        uint256 stakeAmount = stakes[sellerAddress];
        require(stakeAmount > 0, "No stake to return");
        stakes[msg.sender] = 0;
        payable(msg.sender).transfer(stakeAmount);
        emit StakeReturned(msg.sender, stakeAmount);
    }

    function payStakeToSeller() public onlyOwner {
        uint256 stakeAmount = stakes[buyerAddress];
        require(stakeAmount > 0, "No stake to pay");
        stakes[buyerAddress] = 0;
        payable(sellerAddress).transfer(stakeAmount);
        emit StakePaidToSeller(sellerAddress, stakeAmount);
    }

    function setConfirmSecretStatus(bool _status) public onlyBuyer {
        confirmSecretStatus = _status;
        emit ConfirmSecretStatusSet(_status);
    }

    function setPrice(uint256 _price) public onlySeller {
        // Convert the price from Ether to Wei
        price = _price;
        emit PriceSet(price);
    }

    function requestVolumeData() public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // Set the URL to perform the GET request on
        req.add(
            "get",
            "http://54.166.55.127:8989/checkLogin/jakeaccount11/password3333"
        );

        req.add("path", "RAW,ETH,USD,VOLUME24HOUR"); // Chainlink nodes 1.0.0 and later support this format

        // Multiply the result by 1000000000000000000 to remove decimals
        int256 timesAmount = 10 ** 18;
        req.addInt("times", timesAmount);

        // Sends the request
        return sendChainlinkRequest(req, fee);
    }

     /**
     * Receive the response in the form of uint256
     */
    function fulfill(
        bytes32 _requestId,
        uint256 _volume
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestVolume(_requestId, _volume);
        volume = _volume;
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
