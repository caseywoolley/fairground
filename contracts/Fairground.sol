// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Fairground {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    address public admin;
    uint8 public priceToRentRatio = 20;
    uint48 public LeaseDuration = 10 minutes;
    uint48 public auctionDuration = 3 minutes;

    uint256 private _totalBidValue = 0;
    mapping(address => mapping(uint256 => uint256)) private _userBids;
    mapping(uint256 => address) private _topBidders;
    mapping(uint256 => uint256) private _bidDeadlines;
    mapping(uint256 => uint256) private _leaseEndDate;
    mapping(uint256 => uint256) private _reservePrices;
    mapping(uint256 => address) private _owners;

    event ReserveIncreased(
        uint256 indexed _id,
        address indexed _from,
        uint256 _value
    );
    event BidPlaced(uint256 indexed _id, address indexed _from, uint256 _value);

    struct PropertyDetails {
        uint256 id;
        uint256 currentBid;
        uint256 auctionEnd;
        uint256 leaseEnd;
        address owner;
        address recordedOwner;
        address topBidder;
        uint256 timestamp;
    }

    modifier biddingOpen(uint256 tokenId) {
        require(
            block.timestamp + auctionDuration < _leaseEndDate[tokenId],
            "Bidding is closed"
        );
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Must be the admin");
        _;
    }

    modifier onlyOwner(uint256 tokenId) {
        require(isOwner(tokenId), "Must be the owner");
        _;
    }

    modifier notOwner(uint256 tokenId) {
        require(!isOwner(tokenId), "Must not be the owner");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function setPriceToRentRatio(uint8 ratio) external onlyAdmin {
        priceToRentRatio = ratio;
    }

    function setLeaseDuration(uint48 duration) external onlyAdmin {
        LeaseDuration = duration;
    }

    function setAuctionDuration(uint48 duration) external onlyAdmin {
        LeaseDuration = duration;
    }

    function distributeFunds() external payable onlyAdmin {
        require(communityFunds() > 0, "No community funds to distribute");
        payable(admin).transfer(communityFunds());
    }

    function mint(address to) external {
        _tokenIdCounter.increment();
        _owners[_tokenIdCounter.current()] = to;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function isAuctionExpired(uint256 tokenId) public view returns (bool) {
        return block.timestamp > auctionEndDate(tokenId);
    }

    function isLeaseExpired(uint256 tokenId) public view returns (bool) {
        return block.timestamp > _leaseEndDate[tokenId];
    }

    function activeReserve(uint256 tokenId) public view returns (uint256) {
        bool hasNewOwner = ownerOf(tokenId) != _owners[tokenId];
        uint256 expiredReserve = hasNewOwner ? topBid(tokenId) : 0;

        return
            isLeaseExpired(tokenId)
                ? expiredReserve
                : _max(expiredReserve, _reservePrices[tokenId]);
    }

    function topBid(uint256 tokenId) public view returns (uint256) {
        return _userBids[_topBidders[tokenId]][tokenId];
    }

    function activeBid(uint256 tokenId) public view returns (uint256) {
        return isAuctionExpired(tokenId) ? 0 : topBid(tokenId);
    }

    function currentBid(uint256 tokenId) public view returns (uint256) {
        return _max(activeBid(tokenId), activeReserve(tokenId));
    }

    function topBidder(uint256 tokenId) public view returns (address) {
        return isAuctionExpired(tokenId) ? address(0) : _topBidders[tokenId];
    }

    function isOwner(uint256 tokenId) public view returns (bool) {
        return msg.sender == ownerOf(tokenId);
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return
            isAuctionExpired(tokenId) && _topBidders[tokenId] != address(0)
                ? _topBidders[tokenId]
                : _owners[tokenId];
    }

    function auctionEndDate(uint256 tokenId) public view returns (uint256) {
        return _bidDeadlines[tokenId];
    }

    function leaseEndDate(uint256 tokenId) public view returns (uint256) {
        return _leaseEndDate[tokenId];
    }

    function targetBid(
        uint256 tokenId,
        uint256 target
    ) public view returns (uint256) {
        uint256 previous = isOwner(tokenId) ? activeReserve(tokenId) : 0;

        if (target <= previous) {
            return 0;
        }

        uint256 rentPortion = (target - previous) / priceToRentRatio;
        return
            isOwner(tokenId)
                ? (target - previous - rentPortion) / priceToRentRatio
                : target - previous;
    }

    function propertyDetail(
        uint256 tokenId
    ) public view returns (PropertyDetails memory) {
        return
            PropertyDetails({
                id: tokenId,
                currentBid: currentBid(tokenId),
                auctionEnd: auctionEndDate(tokenId),
                leaseEnd: leaseEndDate(tokenId),
                owner: ownerOf(tokenId),
                recordedOwner: _owners[tokenId],
                topBidder: topBidder(tokenId),
                timestamp: block.timestamp
            });
    }

    function propertyList(
        uint256 pageNumber,
        uint256 pageSize
    ) external view returns (PropertyDetails[] memory) {
        require(_tokenIdCounter.current() > 0, "No properties found");
        uint256 start = (pageNumber - 1) * pageSize;
        require(start <= _tokenIdCounter.current() - 1, "Out of range");
        uint256 count = (start + pageSize) <= _tokenIdCounter.current()
            ? pageSize
            : _tokenIdCounter.current() - start;

        PropertyDetails[] memory listings = new PropertyDetails[](count);

        for (uint256 i = 0; i < count; i++) {
            listings[i] = propertyDetail(start + i + 1);
        }

        return listings;
    }

    function communityFunds() public view returns (uint256) {
        return address(this).balance - _totalBidValue;
    }

    function _newReserve(uint256 tokenId) private view returns (uint256) {
        return _rentToValue(msg.value) + activeReserve(tokenId);
    }

    function updateClaim(uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        address previousOwner = _owners[tokenId];

        if (owner != previousOwner) {
            _purchase(tokenId, owner, previousOwner);
        }
    }

    function increaseReserve(
        uint256 tokenId
    ) public payable onlyOwner(tokenId) {
        require(msg.value > 0, "Must be greater than 0");
        require(_newReserve(tokenId) >= currentBid(tokenId), "Reserve too low");
        updateClaim(tokenId);

        _updateReserve(tokenId, _newReserve(tokenId));

        emit ReserveIncreased(tokenId, msg.sender, _newReserve(tokenId));
    }

    function placeBid(uint256 tokenId) public payable notOwner(tokenId) {
        require(msg.value > 0, "Must be greater than 0");
        require(msg.value > currentBid(tokenId), "Bid too low");
        updateClaim(tokenId);

        _updateBid(tokenId);

        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    function _launchAuction(uint256 tokenId) private {
        _bidDeadlines[tokenId] = block.timestamp + auctionDuration;
    }

    function _launchLease(uint256 tokenId) private {
        _leaseEndDate[tokenId] = block.timestamp + LeaseDuration;
    }

    function _updateBid(uint256 tokenId) private {
        _removeBid(tokenId);
        _addBid(tokenId);
        _launchAuction(tokenId);
    }

    function _removeBid(uint256 tokenId) private {
        address leader = _topBidders[tokenId];
        _withdrawBid(tokenId, leader, leader);
    }

    function _addBid(uint256 tokenId) private {
        _totalBidValue += msg.value;
        _userBids[msg.sender][tokenId] = msg.value;
        _topBidders[tokenId] = msg.sender;
    }

    function _updateReserve(uint256 tokenId, uint256 value) private {
        _reservePrices[tokenId] = value;
        delete _topBidders[tokenId];
        if (isLeaseExpired(tokenId)) {
            _launchLease(tokenId);
        }
    }

    function _purchase(uint256 tokenId, address buyer, address seller) private {
        uint256 reserve = topBid(tokenId);
        _withdrawBid(tokenId, buyer, seller);
        _owners[tokenId] = buyer;
        _updateReserve(tokenId, reserve);
        _launchLease(tokenId);
    }

    function _withdrawBid(uint256 tokenId, address from, address to) private {
        require(from == _topBidders[tokenId], "Must withdraw from top bidder");
        uint256 amount = _userBids[from][tokenId];
        if (amount == 0) return;

        _totalBidValue -= amount;
        delete _userBids[from][tokenId];
        delete _topBidders[tokenId];

        uint256 payment = (from == to)
            ? amount
            : _getSellerComp(tokenId, amount);
        payable(to).transfer(payment);
    }

    function _getSellerComp(
        uint256 tokenId,
        uint256 amount
    ) private view returns (uint256) {
        uint256 groundRent = amount / priceToRentRatio;
        return amount - groundRent + _unusedRent(tokenId);
    }

    function _secondsLeftInLease(
        uint256 tokenId
    ) private view returns (uint256) {
        return
            isLeaseExpired(tokenId)
                ? 0
                : _leaseEndDate[tokenId] - block.timestamp;
    }

    function _unusedRent(uint256 tokenId) private view returns (uint256) {
        uint256 secondsLeft = _secondsLeftInLease(tokenId);
        return
            secondsLeft == 0 || _reservePrices[tokenId] == 0
                ? 0
                : _fractionMultiply(
                    secondsLeft,
                    LeaseDuration,
                    _reservePrices[tokenId] / priceToRentRatio
                );
    }

    function _rentToValue(uint256 value) private view returns (uint256) {
        uint256 divisor = 100 - 100 / priceToRentRatio;
        return (value / divisor) * 100 * priceToRentRatio;
    }

    function _fractionMultiply(
        uint256 a,
        uint256 b,
        uint256 value
    ) private pure returns (uint256) {
        return (a * value) / b;
    }

    function _max(uint256 a, uint256 b) private pure returns (uint256) {
        return a >= b ? a : b;
    }

    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a <= b ? a : b;
    }

    fallback() external {
        console.log("Fairground fallback called with");
        console.logBytes(msg.data);
    }
}
