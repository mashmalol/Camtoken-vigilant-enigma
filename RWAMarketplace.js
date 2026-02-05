// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RWAMarketplaceInterface
 * @dev JavaScript interface for interacting with RWAMarketplace contract
 * @notice Use this ABI with web3.js or ethers.js
 */

// ABI for use with web3.js or ethers.js
const RWA_MARKETPLACE_ABI = [
    {
        "inputs": [],
        "name": "platformFeePercentage",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minimumPrice",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "string", "name": "metadataURI", "type": "string"},
            {"internalType": "string", "name": "title", "type": "string"},
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "string", "name": "category", "type": "string"}
        ],
        "name": "mintRWA",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
            {"internalType": "uint256", "name": "price", "type": "uint256"}
        ],
        "name": "listAsset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
            {"internalType": "uint256", "name": "newPrice", "type": "uint256"}
        ],
        "name": "updatePrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "cancelListing",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "buyAsset",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawEarnings",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "getListing",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
                    {"internalType": "address", "name": "seller", "type": "address"},
                    {"internalType": "uint256", "name": "price", "type": "uint256"},
                    {"internalType": "bool", "name": "isActive", "type": "bool"},
                    {"internalType": "uint256", "name": "listedAt", "type": "uint256"}
                ],
                "internalType": "struct RWAMarketplace.AssetListing",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "getAssetMetadata",
        "outputs": [
            {
                "components": [
                    {"internalType": "string", "name": "title", "type": "string"},
                    {"internalType": "string", "name": "description", "type": "string"},
                    {"internalType": "string", "name": "category", "type": "string"},
                    {"internalType": "uint256", "name": "mintedAt", "type": "uint256"},
                    {"internalType": "address", "name": "originalMinter", "type": "address"}
                ],
                "internalType": "struct RWAMarketplace.AssetMetadata",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "isListed",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "seller", "type": "address"}],
        "name": "getSellerBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "basePrice", "type": "uint256"}],
        "name": "calculateFinalPrice",
        "outputs": [
            {"internalType": "uint256", "name": "sellerAmount", "type": "uint256"},
            {"internalType": "uint256", "name": "platformFee", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalSupply",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
            {"indexed": true, "internalType": "address", "name": "minter", "type": "address"},
            {"indexed": false, "internalType": "string", "name": "title", "type": "string"},
            {"indexed": false, "internalType": "string", "name": "metadataURI", "type": "string"}
        ],
        "name": "AssetMinted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
            {"indexed": true, "internalType": "address", "name": "seller", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"}
        ],
        "name": "AssetListed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
            {"indexed": true, "internalType": "address", "name": "seller", "type": "address"},
            {"indexed": true, "internalType": "address", "name": "buyer", "type": "address"},
            {"indexed": false, "internalType": "uint256", "name": "price", "type": "uint256"},
            {"indexed": false, "internalType": "uint256", "name": "platformFee", "type": "uint256"}
        ],
        "name": "AssetSold",
        "type": "event"
    }
];

// Deployment Instructions
const DEPLOYMENT_GUIDE = `
╔════════════════════════════════════════════════════════════════════════╗
║             RWA MARKETPLACE SMART CONTRACT DEPLOYMENT GUIDE            ║
╚════════════════════════════════════════════════════════════════════════╝

1. DEPLOY USING REMIX IDE (Easiest)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   a) Go to https://remix.ethereum.org
   b) Create new file: RWAMarketplace.sol
   c) Copy entire contract code
   d) Compiler: Select 0.8.20
   e) Deploy to your testnet (Sepolia, Mumbai, etc)
   f) Copy contract address

2. DEPLOY USING HARDHAT (Recommended for Production)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   npm install -D hardhat @openzeppelin/contracts
   npx hardhat init
   
   // Copy to hardhat.config.js:
   module.exports = {
     solidity: "0.8.20",
     networks: {
       sepolia: {
         url: \`https://sepolia.infura.io/v3/YOUR_KEY\`,
         accounts: [YOUR_PRIVATE_KEY]
       }
     }
   };
   
   // Create deploy script
   npx hardhat run scripts/deploy.js --network sepolia

3. AFTER DEPLOYMENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   a) Save contract address
   b) Update in OctoCam script.js:
      const RWA_CONTRACT_ADDRESS = "0x...your_address...";
   c) Use the ABI above for web3 calls
   d) Users can now mint and sell RWAs

4. KEY FUNCTIONS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   Minting RWA:
   mintRWA(address, ipfsURI, title, description, category)
   
   List for Sale:
   listAsset(tokenId, priceInWei)
   
   Buy RWA:
   buyAsset(tokenId) { value: priceInWei }
   
   Withdraw Earnings:
   withdrawEarnings()

5. TESTNET FAUCETS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Sepolia ETH: https://sepoliafaucet.com
   Mumbai MATIC: https://faucet.polygon.technology
`;

console.log(DEPLOYMENT_GUIDE);
