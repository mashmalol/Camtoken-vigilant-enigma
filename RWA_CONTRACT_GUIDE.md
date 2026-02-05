# RWA Marketplace Smart Contract Documentation

## Overview

The **RWA Marketplace** (Real World Asset Marketplace) is a decentralized smart contract that enables users to:
- **Mint** Real World Assets as tokenized ERC-721 tokens
- **List** assets for sale at custom prices
- **Trade** assets peer-to-peer in a secure marketplace
- **Withdraw** earnings from sales
- **Manage** platform operations (admin functions)

## Key Features

✅ **Full Asset Lifecycle**
- Mint RWAs with metadata
- List/delist from marketplace
- Update pricing
- Buy/sell in real-time

✅ **Secure Trading**
- Platform fee protection (5% default)
- Seller escrow system
- Automatic fund distribution
- Overpayment refunds

✅ **Complete Metadata**
- Title, description, category
- Original minter tracking
- Mint timestamp
- IPFS metadata URI support

✅ **Easy Administration**
- Approve/revoke minters
- Adjust platform fee
- Set minimum listing price
- Withdraw platform fees

## Contract Architecture

```
RWAMarketplace (Main Contract)
├── ERC721URIStorage (Token Standard)
├── Ownable (Access Control)
└── Counters (ID Management)

Key Structures:
├── AssetListing (Marketplace Data)
├── AssetMetadata (Asset Information)
└── Mappings (State Management)
```

## Installation & Deployment

### Prerequisites

```bash
# Node.js 16+
node --version

# Hardhat framework
npm install -D hardhat @openzeppelin/contracts
```

### Step 1: Initialize Hardhat Project

```bash
npx hardhat init
# Choose: Create a sample project
# Install all suggested dependencies
```

### Step 2: Create Contract File

```bash
# Copy RWAMarketplace.sol to contracts/ directory
cp RWAMarketplace.sol contracts/
```

### Step 3: Configure Hardhat

Create `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

### Step 4: Create Deployment Script

Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying RWA Marketplace...");

  const RWAMarketplace = await hre.ethers.getContractFactory("RWAMarketplace");
  const contract = await RWAMarketplace.deploy();
  await contract.deployed();

  console.log("RWA Marketplace deployed to:", contract.address);
  console.log("\nSave this address for later use:");
  console.log(`CONTRACT_ADDRESS=${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Step 5: Deploy to Testnet

```bash
# Set environment variables
export INFURA_KEY="your_infura_key"
export PRIVATE_KEY="your_private_key"

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Or Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai
```

### Step 6: Verify Deployment

```bash
# Check contract on block explorer
# Sepolia: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
# Mumbai: https://mumbai.polygonscan.com/address/YOUR_CONTRACT_ADDRESS
```

## Smart Contract Functions

### Minting Functions

#### `mintRWA(address, metadataURI, title, description, category)`

Mint a new RWA token.

**Parameters:**
- `to` (address): Recipient wallet address
- `metadataURI` (string): IPFS URI (e.g., "ipfs://QmXxxx...")
- `title` (string): Asset title
- `description` (string): Asset description
- `category` (string): Asset category (e.g., "camera", "photo")

**Returns:** tokenId (uint256)

**Example:**
```javascript
const tx = await contract.mintRWA(
  "0x742d35Cc6634C0532925a3b844Bc9e7595f58e3a",
  "ipfs://QmXxxx...",
  "Camera Shot #1",
  "Professional landscape photography",
  "camera"
);

const receipt = await tx.wait();
const tokenId = receipt.events[1].args.tokenId;
```

#### `approveMinter(address)`

Approve an address to mint RWAs (owner only).

**Example:**
```javascript
await contract.approveMinter("0x123...");
```

#### `revokeMinter(address)`

Revoke minting permissions (owner only).

**Example:**
```javascript
await contract.revokeMinter("0x123...");
```

### Marketplace Functions

#### `listAsset(tokenId, price)`

List an RWA for sale.

**Parameters:**
- `tokenId` (uint256): Token ID
- `price` (uint256): Price in wei (1 ETH = 1e18 wei)

**Example:**
```javascript
const priceInWei = ethers.utils.parseEther("0.5"); // 0.5 ETH
await contract.listAsset(1, priceInWei);
```

#### `updatePrice(tokenId, newPrice)`

Update listing price.

**Parameters:**
- `tokenId` (uint256): Token ID
- `newPrice` (uint256): New price in wei

**Example:**
```javascript
const newPrice = ethers.utils.parseEther("0.75");
await contract.updatePrice(1, newPrice);
```

#### `cancelListing(tokenId)`

Remove asset from marketplace.

**Example:**
```javascript
await contract.cancelListing(1);
```

#### `buyAsset(tokenId)` (payable)

Purchase a listed RWA.

**Parameters:**
- `tokenId` (uint256): Token ID
- `value`: ETH amount (must match or exceed listing price)

**Example:**
```javascript
const listing = await contract.getListing(1);
const tx = await contract.buyAsset(1, {
  value: listing.price
});
```

### Payment Functions

#### `withdrawEarnings()`

Withdraw seller earnings.

**Example:**
```javascript
await contract.withdrawEarnings();
```

#### `withdrawPlatformFees()` (owner only)

Withdraw platform fees.

**Example:**
```javascript
await contract.withdrawPlatformFees();
```

### Admin Functions

#### `setPlatformFee(newFeePercentage)`

Set platform fee (0-50%).

**Example:**
```javascript
await contract.setPlatformFee(7); // 7% fee
```

#### `setMinimumPrice(newMinimumPrice)`

Set minimum listing price.

**Example:**
```javascript
const minPrice = ethers.utils.parseEther("0.001");
await contract.setMinimumPrice(minPrice);
```

### View Functions

#### `getListing(tokenId)`

Get listing details.

**Returns:**
```javascript
{
  tokenId: uint256,
  seller: address,
  price: uint256,
  isActive: bool,
  listedAt: uint256
}
```

**Example:**
```javascript
const listing = await contract.getListing(1);
console.log(`Price: ${listing.price} wei`);
```

#### `getAssetMetadata(tokenId)`

Get asset metadata.

**Returns:**
```javascript
{
  title: string,
  description: string,
  category: string,
  mintedAt: uint256,
  originalMinter: address
}
```

#### `isListed(tokenId)`

Check if asset is listed.

**Example:**
```javascript
const listed = await contract.isListed(1);
```

#### `getSellerBalance(seller)`

Get withdrawable balance for seller.

**Example:**
```javascript
const balance = await contract.getSellerBalance("0x123...");
```

#### `calculateFinalPrice(basePrice)`

Calculate seller amount after fees.

**Returns:** (sellerAmount, platformFee)

**Example:**
```javascript
const price = ethers.utils.parseEther("1.0");
const { sellerAmount, platformFee } = await contract.calculateFinalPrice(price);
console.log(`Seller gets: ${sellerAmount} wei`);
console.log(`Platform fee: ${platformFee} wei`);
```

#### `getTotalSupply()`

Get total number of RWAs minted.

**Example:**
```javascript
const total = await contract.getTotalSupply();
```

## Events

### AssetMinted
```javascript
event AssetMinted(
  uint256 indexed tokenId,
  address indexed minter,
  string title,
  string metadataURI
);
```

### AssetListed
```javascript
event AssetListed(
  uint256 indexed tokenId,
  address indexed seller,
  uint256 price
);
```

### AssetSold
```javascript
event AssetSold(
  uint256 indexed tokenId,
  address indexed seller,
  address indexed buyer,
  uint256 price,
  uint256 platformFee
);
```

## Integration with OctoCam Ultra-Lite

### Step 1: Update Configuration

In `script.js`, set contract address:

```javascript
const CONFIG = {
  rwaContractAddress: "0x..." // Your deployed contract
};
```

### Step 2: Add ethers.js or web3.js

Add to `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/ethers@6/dist/ethers.umd.min.js"></script>
```

### Step 3: Connect to Contract

```javascript
async function initContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(
    CONFIG.rwaContractAddress,
    RWA_MARKETPLACE_ABI,
    signer
  );
  return contract;
}
```

### Step 4: Mint RWA After IPFS Upload

```javascript
async function mintRWA() {
  const contract = await initContract();
  
  const tx = await contract.mintRWA(
    state.walletAddress,
    `ipfs://${state.ipfsHash}`,
    metadata.name,
    metadata.description,
    "camera-asset"
  );
  
  await tx.wait();
  alert("RWA minted successfully!");
}
```

## Security Considerations

### 1. **Reentrancy Protection**
- Uses CEI pattern (Checks-Effects-Interactions)
- No external calls before state updates

### 2. **Access Control**
- Owner-only functions protected by `onlyOwner`
- Minter whitelist for production

### 3. **Input Validation**
- Price minimums enforced
- Fee cap at 50%
- Address format validation

### 4. **Fund Safety**
- Seller escrow instead of direct transfers
- Users must explicitly withdraw earnings
- Overpayment refunds included

## Testing

### Run Local Tests

```bash
# Start local blockchain
npx hardhat node

# In another terminal, run tests
npx hardhat test
```

### Create Test File

Create `test/RWAMarketplace.test.js`:

```javascript
const { expect } = require("chai");

describe("RWAMarketplace", function () {
  let rwa;
  let owner, seller, buyer;

  beforeEach(async () => {
    [owner, seller, buyer] = await ethers.getSigners();
    const RWA = await ethers.getContractFactory("RWAMarketplace");
    rwa = await RWA.deploy();
  });

  it("Should mint RWA", async () => {
    const tx = await rwa.mintRWA(
      seller.address,
      "ipfs://test",
      "Test",
      "Desc",
      "test"
    );
    expect(tx).to.emit(rwa, "AssetMinted");
  });

  it("Should list asset", async () => {
    await rwa.mintRWA(seller.address, "ipfs://test", "Test", "Desc", "test");
    const price = ethers.utils.parseEther("1");
    await expect(rwa.connect(seller).listAsset(0, price))
      .to.emit(rwa, "AssetListed");
  });

  it("Should buy asset", async () => {
    // Mint → List → Buy
    await rwa.mintRWA(seller.address, "ipfs://test", "Test", "Desc", "test");
    const price = ethers.utils.parseEther("1");
    await rwa.connect(seller).listAsset(0, price);
    
    await expect(rwa.connect(buyer).buyAsset(0, { value: price }))
      .to.emit(rwa, "AssetSold");
  });
});
```

## Gas Optimization Tips

1. **Batch Operations**: Mint multiple RWAs in one transaction
2. **List Carefully**: Unnecessary listings waste gas
3. **Use Testnet First**: Test on Sepolia/Mumbai before mainnet
4. **Monitor Gas Prices**: Deploy during low gas periods

## Fee Structure

**Default Platform Fee: 5%**

Example:
- Asset price: 1.0 ETH (1000000000000000000 wei)
- Platform fee: 0.05 ETH (50000000000000000 wei)
- Seller receives: 0.95 ETH (950000000000000000 wei)

## Network Support

| Network | RPC | Explorer | Faucet |
|---------|-----|----------|--------|
| Sepolia | https://sepolia.infura.io | https://sepolia.etherscan.io | https://sepoliafaucet.com |
| Mumbai | https://polygon-mumbai.infura.io | https://mumbai.polygonscan.com | https://faucet.polygon.technology |
| Mainnet | https://mainnet.infura.io | https://etherscan.io | N/A |

## Troubleshooting

### Error: "Address already in use"
- Use different port
- Kill existing process: `lsof -ti:3000 | xargs kill -9`

### Error: "Insufficient funds"
- Request testnet ETH from faucet
- Check account has enough gas

### Error: "Not authorized to mint"
- Must be contract owner or approved minter
- Call `approveMinter()` first

### Error: "Asset not listed"
- Asset must be listed before buying
- Check `isListed(tokenId)` returns true

## Support & Resources

- **Hardhat Docs**: https://hardhat.org
- **OpenZeppelin Docs**: https://docs.openzeppelin.com
- **Ethers.js Docs**: https://docs.ethers.io
- **Solidity Docs**: https://docs.soliditylang.org

---

**Version**: 1.0.0  
**License**: MIT  
**Last Updated**: February 2026
