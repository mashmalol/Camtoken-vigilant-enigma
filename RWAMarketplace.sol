// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RWAMarketplace
 * @dev Real World Asset minting and marketplace contract
 * @notice Allows users to mint RWAs with metadata and trade them in a decentralized marketplace
 */
contract RWAMarketplace is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    // State variables
    Counters.Counter private _tokenIdCounter;
    uint256 public platformFeePercentage = 5; // 5% platform fee
    uint256 public minimumPrice = 0.001 ether; // Minimum listing price

    // Constructor
    constructor() ERC721("RWAMarketplace", "RWA") Ownable(msg.sender) {
        // Contract initialized
    }
    
    // Asset listing structure
    struct AssetListing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
        uint256 listedAt;
    }

    // Asset metadata structure
    struct AssetMetadata {
        string title;
        string description;
        string category; // e.g., "camera", "photo", "document"
        uint256 mintedAt;
        address originalMinter;
    }

    // Mappings
    mapping(uint256 => AssetListing) public listings;
    mapping(uint256 => AssetMetadata) public assetMetadata;
    mapping(address => uint256) public sellerBalance;
    mapping(address => bool) public approvedMinters;

    // Events
    event AssetMinted(
        uint256 indexed tokenId,
        address indexed minter,
        string title,
        string metadataURI
    );

    event AssetListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );

    event AssetSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        uint256 platformFee
    );

    event ListingCancelled(
        uint256 indexed tokenId,
        address indexed seller
    );

    event PriceUpdated(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 newPrice
    );

    event MinterApproved(address indexed minter);
    event MinterRevoked(address indexed minter);

    // ============================================
    // MINTING FUNCTIONS
    // ============================================

    /**
     * @dev Mint a new RWA token with metadata
     * @param to Address receiving the RWA
     * @param metadataURI URI pointing to asset metadata (IPFS recommended)
     * @param title Title of the asset
     * @param description Description of the asset
     * @param category Category/type of asset
     * @return tokenId ID of newly minted RWA
     */
    function mintRWA(
        address to,
        string memory metadataURI,
        string memory title,
        string memory description,
        string memory category
    ) public returns (uint256) {
        // Only owner or approved minters can mint
        require(
            msg.sender == owner() || approvedMinters[msg.sender],
            "Not authorized to mint"
        );

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        // Store metadata
        assetMetadata[tokenId] = AssetMetadata({
            title: title,
            description: description,
            category: category,
            mintedAt: block.timestamp,
            originalMinter: msg.sender
        });

        emit AssetMinted(tokenId, msg.sender, title, metadataURI);

        return tokenId;
    }

    /**
     * @dev Approve a minter address to mint RWAs
     * @param minter Address to approve
     */
    function approveMinter(address minter) public onlyOwner {
        approvedMinters[minter] = true;
        emit MinterApproved(minter);
    }

    /**
     * @dev Revoke minting permissions from an address
     * @param minter Address to revoke
     */
    function revokeMinter(address minter) public onlyOwner {
        approvedMinters[minter] = false;
        emit MinterRevoked(minter);
    }

    // ============================================
    // MARKETPLACE FUNCTIONS
    // ============================================

    /**
     * @dev List an RWA for sale
     * @param tokenId ID of RWA to list
     * @param price Price in wei (e.g., 1 ether = 1e18 wei)
     */
    function listAsset(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not asset owner");
        require(price >= minimumPrice, "Price below minimum");
        require(!listings[tokenId].isActive, "Already listed");

        listings[tokenId] = AssetListing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true,
            listedAt: block.timestamp
        });

        emit AssetListed(tokenId, msg.sender, price);
    }

    /**
     * @dev Update price of a listed RWA
     * @param tokenId ID of RWA
     * @param newPrice New price in wei
     */
    function updatePrice(uint256 tokenId, uint256 newPrice) public {
        require(listings[tokenId].seller == msg.sender, "Not asset seller");
        require(listings[tokenId].isActive, "Asset not listed");
        require(newPrice >= minimumPrice, "Price below minimum");

        listings[tokenId].price = newPrice;
        emit PriceUpdated(tokenId, msg.sender, newPrice);
    }

    /**
     * @dev Cancel an active listing
     * @param tokenId ID of RWA
     */
    function cancelListing(uint256 tokenId) public {
        require(listings[tokenId].seller == msg.sender, "Not asset seller");
        require(listings[tokenId].isActive, "Asset not listed");

        listings[tokenId].isActive = false;
        emit ListingCancelled(tokenId, msg.sender);
    }

    /**
     * @dev Purchase a listed RWA
     * @param tokenId ID of RWA to purchase
     */
    function buyAsset(uint256 tokenId) public payable {
        AssetListing memory listing = listings[tokenId];

        require(listing.isActive, "Asset not for sale");
        require(msg.value >= listing.price, "Insufficient payment");

        address seller = listing.seller;
        uint256 price = listing.price;

        // Calculate fees
        uint256 platformFee = (price * platformFeePercentage) / 100;
        uint256 sellerAmount = price - platformFee;

        // Transfer asset to buyer
        _transfer(seller, msg.sender, tokenId);

        // Mark listing as inactive
        listings[tokenId].isActive = false;

        // Distribute funds
        sellerBalance[seller] += sellerAmount;

        // Handle excess payment (refund if overpaid)
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        emit AssetSold(tokenId, seller, msg.sender, price, platformFee);
    }

    // ============================================
    // PAYMENT & WITHDRAWAL FUNCTIONS
    // ============================================

    /**
     * @dev Withdraw seller earnings
     */
    function withdrawEarnings() public {
        uint256 amount = sellerBalance[msg.sender];
        require(amount > 0, "No balance to withdraw");

        sellerBalance[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    /**
     * @dev Withdraw platform fees (owner only)
     */
    function withdrawPlatformFees() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================

    /**
     * @dev Set platform fee percentage
     * @param newFeePercentage New fee as percentage (e.g., 5 for 5%)
     */
    function setPlatformFee(uint256 newFeePercentage) public onlyOwner {
        require(newFeePercentage <= 50, "Fee too high"); // Max 50%
        platformFeePercentage = newFeePercentage;
    }

    /**
     * @dev Set minimum listing price
     * @param newMinimumPrice New minimum price in wei
     */
    function setMinimumPrice(uint256 newMinimumPrice) public onlyOwner {
        minimumPrice = newMinimumPrice;
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    /**
     * @dev Get total number of RWAs minted
     */
    function getTotalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Get listing details
     * @param tokenId ID of RWA
     */
    function getListing(uint256 tokenId)
        public
        view
        returns (AssetListing memory)
    {
        return listings[tokenId];
    }

    /**
     * @dev Get asset metadata
     * @param tokenId ID of RWA
     */
    function getAssetMetadata(uint256 tokenId)
        public
        view
        returns (AssetMetadata memory)
    {
        return assetMetadata[tokenId];
    }

    /**
     * @dev Check if asset is listed for sale
     * @param tokenId ID of RWA
     */
    function isListed(uint256 tokenId) public view returns (bool) {
        return listings[tokenId].isActive;
    }

    /**
     * @dev Get seller's withdrawable balance
     * @param seller Address of seller
     */
    function getSellerBalance(address seller)
        public
        view
        returns (uint256)
    {
        return sellerBalance[seller];
    }

    /**
     * @dev Calculate final price including platform fee
     * @param basePrice Base price in wei
     */
    function calculateFinalPrice(uint256 basePrice)
        public
        view
        returns (uint256 sellerAmount, uint256 platformFee)
    {
        platformFee = (basePrice * platformFeePercentage) / 100;
        sellerAmount = basePrice - platformFee;
        return (sellerAmount, platformFee);
    }

    // ============================================
    // REQUIRED OVERRIDES
    // ============================================

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // Allow contract to receive ETH for platform fees
    receive() external payable {}
}
