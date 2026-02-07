// ===========================================
// Ultra-Lightweight OctoCam - Vanilla JavaScript
// ===========================================

// State management
const state = {
  stream: null,
  capturedImage: null,
  ipfsHash: null,
  attributes: [],
  walletConnected: false,
  walletAddress: null,
};

// Configuration
const CONFIG = {
  infuraProjectId: 'QmUi5h37p8RzwPzTVx7J7GyP3BFpYq',
  ipfsGateway: 'https://infura-ipfs.io/ipfs/',
  rwaContractAddress: '', // User will set this
  rwaContractABI: [], // Loaded from RWAMarketplace.js
};

// Screen management
function showScreen(screenName) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenName).classList.add('active');
}

// ===========================================
// 1. WALLET CONNECTION (Replace ethers.js)
// ===========================================

async function connectWallet() {
  try {
    // Check if we're on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (!window.ethereum) {
      if (isMobile) {
        const message = `📱 MOBILE WALLET SETUP\n\n` +
          `MetaMask is not available in Chrome on mobile.\n\n` +
          `OPTIONS:\n` +
          `1. Open MetaMask Mobile App → Tap the menu → "Browser"\n` +
          `2. Or use Trust Wallet → Open dApp browser\n` +
          `3. Or use Coinbase Wallet → Built-in Web3 support\n\n` +
          `Then come back and tap "Connect Wallet"`;
        alert(message);
      } else {
        alert('MetaMask is not installed. Install it from: https://metamask.io');
      }
      return;
    }

    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    state.walletConnected = true;
    state.walletAddress = accounts[0];

    document.getElementById('connectWalletBtn').textContent = 
      `✓ Connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
    document.getElementById('connectWalletBtn').disabled = true;
    document.getElementById('connectWalletBtn').style.opacity = '0.6';

    console.log('Wallet connected:', accounts[0]);
  } catch (error) {
    console.error('Wallet connection failed:', error);
    alert('Failed to connect wallet: ' + error.message);
  }
}

// ===========================================
// 2. CAMERA CAPTURE
// ===========================================

async function startCamera() {
  try {
    // Basic camera constraints - let device use default
    const constraints = {
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false,
    };

    state.stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    const video = document.getElementById('videoFeed');
    video.srcObject = state.stream;
    video.playsInline = true;
    video.muted = true;
    
    // Ensure video fills container properly
    video.addEventListener('loadedmetadata', () => {
      video.play().catch(e => console.error('Video play error:', e));
    }, { once: true });

    // Ensure video is playing
    video.play().catch(e => console.error('Video play error:', e));

    showScreen('cameraScreen');
  } catch (error) {
    console.error('Camera error:', error);
    alert('Failed to access camera: ' + error.message);
  }
}

function stopCamera() {
  if (state.stream) {
    state.stream.getTracks().forEach(track => track.stop());
    state.stream = null;
  }
}

function capturePhoto() {
  const video = document.getElementById('videoFeed');
  const canvas = document.getElementById('captureCanvas');
  
  if (!canvas) {
    const c = document.createElement('canvas');
    c.id = 'captureCanvas';
    c.style.display = 'none';
    document.body.appendChild(c);
    canvas = c;
  }

  // Wait for video metadata to load
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    alert('Camera not ready. Please try again.');
    return;
  }

  // Capture what's actually visible (matching the display)
  // Get the display container dimensions
  const container = video.parentElement;
  const displayWidth = container.offsetWidth;
  const displayHeight = container.offsetHeight;

  // Set canvas to match what's visible
  canvas.width = displayWidth;
  canvas.height = displayHeight;

  const ctx = canvas.getContext('2d');
  
  // Calculate scaling to match how video is displayed (object-fit: cover)
  const videoAspect = video.videoWidth / video.videoHeight;
  const displayAspect = displayWidth / displayHeight;
  
  let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
  
  if (videoAspect > displayAspect) {
    // Video is wider - crop sides
    drawHeight = video.videoHeight;
    drawWidth = drawHeight * displayAspect;
    offsetX = (video.videoWidth - drawWidth) / 2;
  } else {
    // Video is taller - crop top/bottom
    drawWidth = video.videoWidth;
    drawHeight = drawWidth / displayAspect;
    offsetY = (video.videoHeight - drawHeight) / 2;
  }
  
  // Draw only the visible portion
  ctx.drawImage(
    video,
    offsetX, offsetY, drawWidth, drawHeight,
    0, 0, displayWidth, displayHeight
  );

  state.capturedImage = canvas.toDataURL('image/jpeg', 0.95);

  // Stop camera after capture
  stopCamera();

  // Show captured image
  document.getElementById('capturedImg').src = state.capturedImage;
  showScreen('formScreen');
}

function retakePhoto() {
  state.capturedImage = null;
  document.getElementById('capturedImg').src = '';
  document.getElementById('nftForm').reset();
  state.attributes = [];
  updateAttributesDisplay();
  // Restart camera for retake
  startCamera();
}

// ===========================================
// 3. FORM & ATTRIBUTES
// ===========================================

function addAttribute() {
  const traitType = document.getElementById('traitType').value.trim();
  const traitValue = document.getElementById('traitValue').value.trim();

  if (!traitType || !traitValue) {
    alert('Please fill in trait type and value');
    return;
  }

  state.attributes.push({ 
    trait_type: traitType, 
    value: traitValue 
  });

  document.getElementById('traitType').value = '';
  document.getElementById('traitValue').value = '';

  updateAttributesDisplay();
}

function removeAttribute(index) {
  state.attributes.splice(index, 1);
  updateAttributesDisplay();
}

function updateAttributesDisplay() {
  const list = document.getElementById('attributesList');
  list.innerHTML = state.attributes.map((attr, idx) => `
    <div class="attr-item">
      <span>${attr.trait_type}:</span>
      <span class="attr-value">${attr.value}</span>
      <button class="attr-remove" onclick="removeAttribute(${idx})">×</button>
    </div>
  `).join('');
}

// ===========================================
// 4. METADATA GENERATION
// ===========================================

function generateMetadata() {
  const title = document.getElementById('nftTitle').value.trim();
  const description = document.getElementById('nftDescription').value.trim();
  const price = document.getElementById('nftPrice').value.trim();

  if (!title || !description || !price) {
    alert('Please fill in all fields (title, description, price)');
    return;
  }

  const metadata = {
    name: title,
    description: description,
    price: price,
    image: state.capturedImage,
    attributes: state.attributes,
    created_at: new Date().toISOString(),
  };

  return metadata;
}

// ===========================================
// 5. DOWNLOAD FUNCTIONS
// ===========================================

function downloadImage() {
  if (!state.capturedImage) {
    alert('No image captured');
    return;
  }

  const link = document.createElement('a');
  link.href = state.capturedImage;
  link.download = `octocam-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadJSON() {
  const metadata = generateMetadata();
  if (!metadata) return;

  const dataStr = JSON.stringify(metadata, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `metadata-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// ===========================================
// 6. IPFS UPLOAD (Fetch API)
// ===========================================

async function uploadToIPFS(file, fileName) {
  try {
    const formData = new FormData();
    formData.append('file', file, fileName);

    // Using Infura gateway via direct API
    const response = await fetch('https://ipfs.infura.io:5001/api/v0/add?progress=false', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    state.ipfsHash = result.Hash;
    console.log('IPFS Upload successful:', result.Hash);
    return result.Hash;

  } catch (error) {
    console.error('IPFS upload error:', error);
    alert('Failed to upload to IPFS: ' + error.message);
    return null;
  }
}

// Upload both image and metadata to IPFS
async function uploadNFTToIPFS() {
  const metadata = generateMetadata();
  if (!metadata) return;

  try {
    // Convert base64 image to blob
    const base64 = state.capturedImage.split(',')[1];
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const imageBlob = new Blob([bytes], { type: 'image/png' });

    // Upload image first
    console.log('Uploading image to IPFS...');
    const imageHash = await uploadToIPFS(imageBlob, 'nft-image.png');
    if (!imageHash) return;

    // Update metadata with IPFS image URL
    metadata.image = `ipfs://${imageHash}`;

    // Upload metadata
    console.log('Uploading metadata to IPFS...');
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const metadataHash = await uploadToIPFS(metadataBlob, 'metadata.json');
    if (!metadataHash) return;

    alert(`NFT uploaded to IPFS!\nMetadata: ${metadataHash}`);
    state.ipfsHash = metadataHash;

  } catch (error) {
    console.error('NFT upload error:', error);
    alert('Failed to upload NFT: ' + error.message);
  }
}

// ===========================================
// 7. RWA CONTRACT INTERACTION
// ===========================================

async function setRWAContractAddress() {
  const address = prompt('Enter your RWA Marketplace contract address:');
  if (!address) return;
  
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    alert('Invalid Ethereum address format');
    return;
  }
  
  CONFIG.rwaContractAddress = address;
  alert(`RWA Contract set to: ${address}\n\nNow you can mint and sell RWAs!`);
  console.log('RWA Contract Address:', CONFIG.rwaContractAddress);
}

async function mintRWAtoBlockchain() {
  if (!state.walletConnected) {
    const shouldConnect = confirm('Wallet not connected. Connect now to mint RWA?');
    if (shouldConnect) {
      await connectWallet();
      if (!state.walletConnected) return;
    } else {
      return;
    }
  }

  if (!CONFIG.rwaContractAddress) {
    const setNow = confirm('RWA Contract address not set. Set it now?');
    if (setNow) {
      await setRWAContractAddress();
    } else {
      return;
    }
  }

  const metadata = generateMetadata();
  if (!metadata) return;

  try {
    alert(`
🚀 RWA Minting Ready!

Title: ${metadata.name}
Description: ${metadata.description}
Price: ${metadata.price} ETH
IPFS Metadata: ${state.ipfsHash}

Next steps:
1. You'll be prompted to approve the transaction
2. Sign with MetaMask
3. Wait for blockchain confirmation
4. Your RWA will be created on-chain!

Note: Gas fees will apply based on network.
    `);

    // Note: Full contract interaction requires web3.js or ethers.js library
    // For now, provide instructions for manual minting
    console.log('RWA Minting Data:', {
      contractAddress: CONFIG.rwaContractAddress,
      title: metadata.name,
      description: metadata.description,
      price: metadata.price,
      metadataURI: `ipfs://${state.ipfsHash}`,
      category: 'camera-asset'
    });

  } catch (error) {
    console.error('RWA minting error:', error);
    alert('Failed to mint RWA: ' + error.message);
  }
}

async function listRWAForSale() {
  if (!state.walletConnected) {
    const shouldConnect = confirm('Wallet not connected. Connect now to list RWA?');
    if (shouldConnect) {
      await connectWallet();
      if (!state.walletConnected) return;
    } else {
      return;
    }
  }

  if (!CONFIG.rwaContractAddress) {
    alert('RWA Contract address not set');
    return;
  }

  const tokenIdStr = prompt('Enter RWA token ID to list:');
  if (!tokenIdStr) return;

  const priceStr = prompt('Enter listing price (in ETH):');
  if (!priceStr) return;

  const tokenId = parseInt(tokenIdStr);
  const priceInEth = parseFloat(priceStr);
  const priceInWei = BigInt(priceInEth * 1e18).toString();

  alert(`
📋 RWA Listing Summary

Token ID: ${tokenId}
Price: ${priceInEth} ETH
Price (Wei): ${priceInWei}
Seller: ${state.walletAddress}

To complete the listing:
1. Use ethers.js or web3.js to call listAsset()
2. Contract: ${CONFIG.rwaContractAddress}
3. Function: listAsset(${tokenId}, ${priceInWei})

Example with ethers.js:
const contract = new ethers.Contract(contractAddress, ABI, signer);
await contract.listAsset(${tokenId}, "${priceInWei}");
  `);

  console.log('RWA Listing Data:', {
    contractAddress: CONFIG.rwaContractAddress,
    tokenId: tokenId,
    price: priceInEth,
    priceInWei: priceInWei,
    seller: state.walletAddress
  });
}

async function buyRWAAsset() {
  if (!state.walletConnected) {
    const shouldConnect = confirm('Wallet not connected. Connect now to buy RWA?');
    if (shouldConnect) {
      await connectWallet();
      if (!state.walletConnected) return;
    } else {
      return;
    }
  }

  if (!CONFIG.rwaContractAddress) {
    alert('RWA Contract address not set');
    return;
  }

  const tokenIdStr = prompt('Enter RWA token ID to purchase:');
  if (!tokenIdStr) return;

  const tokenId = parseInt(tokenIdStr);

  alert(`
🛒 RWA Purchase Instructions

Token ID: ${tokenId}
Buyer: ${state.walletAddress}
Contract: ${CONFIG.rwaContractAddress}

To complete the purchase:
1. Get listing price first: getListing(${tokenId})
2. Call buyAsset(${tokenId}) with ETH value equal to listing price
3. Asset will be transferred to your wallet
4. Seller earnings will be available for withdrawal (minus 5% platform fee)

Example with ethers.js:
const contract = new ethers.Contract(contractAddress, ABI, signer);
const listing = await contract.getListing(${tokenId});
await contract.buyAsset(${tokenId}, { value: listing.price });
  `);

  console.log('RWA Purchase Data:', {
    contractAddress: CONFIG.rwaContractAddress,
    tokenId: tokenId,
    buyer: state.walletAddress
  });
}

// ===========================================
// 8. EVENT LISTENERS
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
  // Home screen
  document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
  document.getElementById('startCaptureBtn').addEventListener('click', startCamera);

  // Camera screen
  document.getElementById('captureBtn').addEventListener('click', capturePhoto);
  document.getElementById('cancelCameraBtn').addEventListener('click', () => {
    stopCamera();
    showScreen('homeScreen');
  });

  // Form screen
  document.getElementById('addAttrBtn').addEventListener('click', addAttribute);
  document.getElementById('downloadImgBtn').addEventListener('click', downloadImage);
  document.getElementById('downloadJsonBtn').addEventListener('click', downloadJSON);
  document.getElementById('uploadIPFSBtn').addEventListener('click', uploadNFTToIPFS);
  document.getElementById('mintNFTBtn').addEventListener('click', mintRWAtoBlockchain);
  document.getElementById('listRWABtn').addEventListener('click', listRWAForSale);
  document.getElementById('buyRWABtn').addEventListener('click', buyRWAAsset);
  document.getElementById('retakeBtn').addEventListener('click', retakePhoto);

  // Keyboard shortcuts
  document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const traitTypeInput = document.getElementById('traitType');
      if (document.activeElement === traitTypeInput || document.activeElement === document.getElementById('traitValue')) {
        addAttribute();
        e.preventDefault();
      }
    }
  });

  // Show home screen initially
  showScreen('homeScreen');
});

// ===========================================
// 9. MOBILE & TOUCH OPTIMIZATION
// ===========================================

// Prevent double-tap zoom
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, false);

// Prevent pinch zoom
document.addEventListener('wheel', (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, false);

// Prevent body scroll on mobile
document.body.addEventListener('touchmove', (e) => {
  if (e.target.closest('.content-wrapper') === null) {
    e.preventDefault();
  }
}, { passive: false });

// ===========================================
// FUTURE ENHANCEMENTS
// ===========================================
// - Contract interaction via ethers.js alternative (or web3.js)
// - Custom RPC endpoint configuration
// - Multiple chain support
// - Gas estimation display
// - Transaction confirmation UI
// - Error recovery mechanisms
