# OctoCam Ultra-Lite v2.0

**Ultra-lightweight Camera NFT minting platform built with vanilla HTML/CSS/JavaScript. No frameworks. ~20KB total.**

## What's Different (Optimization #5)

This is the ultra-optimized version of OctoCam, removing all heavy dependencies:

### ✅ Optimization Summary

| Optimization | Before | After | Savings |
|---|---|---|---|
| **1. Remove Next.js** | React + Next.js 14 (~150KB) | Vanilla HTML | ~150KB |
| **2. Remove Tailwind** | Tailwind CSS (~50KB) | Inline CSS | ~50KB |
| **3. Remove IPFS Client** | ipfs-http-client (~200KB) | Fetch API | ~200KB |
| **4. Remove ethers.js** | ethers.js 6.13 (~150KB) | window.ethereum | ~150KB |
| **5. CSS Rain Animation** | JavaScript rain (~3KB) | Pure CSS | ~3KB |
| **Total Reduction** | ~550KB dependencies | ~20KB bundle | **96% smaller** |

## Files

- **index.html** - Single HTML file with all 3 screens (home, camera, form)
- **styles.css** - Complete styling (retro cyberpunk theme, no Tailwind)
- **script.js** - All vanilla JavaScript logic (~450 lines, no React/Next.js)
- **package.json** - Minimal config (optional, for serving)

## Features

✅ Camera capture (getUserMedia API)  
✅ Photo preview  
✅ Dynamic attributes (add/remove trait pairs)  
✅ Download image (PNG blob)  
✅ Download metadata (JSON ERC-721 format)  
✅ IPFS upload (Fetch API to Infura)  
✅ MetaMask wallet connection (window.ethereum)  
✅ Retro cyberpunk UI (CRT scanlines, neon colors, digital rain)  
✅ Mobile responsive  
✅ Pure CSS animations (no JavaScript overhead)  

## Quick Start

### Option 1: Python HTTP Server (No dependencies)
```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Option 2: Node HTTP Server
```bash
npx http-server -p 8000
# Visit http://localhost:8000
```

### Option 3: npm scripts
```bash
npm install
npm run start
```

## How to Use

1. **Connect Wallet** - Click "CONNECT WALLET" button
   - Requires MetaMask browser extension
   - Requires HTTPS (or localhost)

2. **Capture Photo** - Click "START CAPTURE"
   - Grants camera permission
   - Preview in video feed
   - Click "CAPTURE" to take photo

3. **Enter NFT Details** - Fill form:
   - Title: NFT name
   - Description: NFT details
   - Price: ETH value (e.g., 0.01)
   - Attributes: Add trait-value pairs

4. **Download or Upload**
   - Download image as PNG
   - Download metadata as JSON
   - Upload both to IPFS
   - Mint to blockchain (user's own contract)

## Technical Details

### API Endpoints Used

- **Camera**: `navigator.mediaDevices.getUserMedia()`
- **Canvas**: `canvas.toDataURL('image/png')`
- **Wallet**: `window.ethereum.request()`
- **IPFS**: `https://ipfs.infura.io:5001/api/v0/add` (POST)

### File Sizes

- `index.html` - ~3.5 KB
- `styles.css` - ~8 KB
- `script.js` - ~12 KB
- **Total** - ~23.5 KB

### No Dependencies

This version requires **ZERO npm packages**. It works with:
- Native browser APIs (no polyfills needed)
- Google Fonts (CDN)
- MetaMask (user-provided)

## Deployment

### Static Hosting (Recommended)
- Netlify, Vercel, GitHub Pages
- No build step required
- Serve as static files

### Self-Hosted
- Any HTTP server (Python, Node, nginx, Apache)
- Example: `python3 -m http.server`

### HTTPS Requirement
- Camera API requires HTTPS or localhost
- MetaMask requires HTTPS or localhost

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ⚠️ Limited (camera may vary)
- Mobile: ✅ Android Chrome, ⚠️ iOS Safari

## Security Notes

⚠️ **Important**: This is a demo application
- No server-side validation
- No authentication
- Images stored in browser memory (not persisted)
- IPFS Infura endpoint is public
- Always verify contracts before minting

## Configuration

To use a different IPFS gateway, edit `script.js`:
```javascript
const CONFIG = {
  infuraProjectId: 'YOUR_PROJECT_ID',
  ipfsGateway: 'https://gateway.pinata.cloud/ipfs/',
};
```

## Smart Contract

For minting, deploy your own ERC-721 contract. Example:

```solidity
pragma solidity ^0.8.0;

contract CameraNFT is ERC721 {
  uint256 tokenId = 0;
  
  function mint(string memory metadataURI) public {
    _mint(msg.sender, tokenId);
    _setTokenURI(tokenId, metadataURI);
    tokenId++;
  }
}
```

## Roadmap

Potential enhancements (keeping it light):
- [ ] Multiple image filters
- [ ] Custom metadata fields
- [ ] Contract interaction via web3.js-minimal
- [ ] Transaction confirmation UI
- [ ] Error recovery

## License

MIT - Free to use, modify, deploy

## Author

OctoCam Dev Team - Building lightweight Web3 tools

---

**Size comparison**: OctoCam Full (208KB) vs OctoCam Ultra-Lite (23KB) = **89% smaller** ✨
- **Platform Fee**: A 5% fee is applied to all mints.
- **IPFS Storage**: Images are stored on IPFS with on-chain metadata.
- **Physical Verification**: Optional NFC/QR code verification for physical items.

## Getting Started

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/mashmalol/octocam.git
   cd octocam
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Copy the `.env.example` to `.env` and configure your environment variables.

4. **Run the Development Server**:

   ```bash
   npm run dev
   ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.

## Development Progress

- [x] Created copilot-instructions.md
- [ ] Scaffold Next.js project
- [ ] Create smart contracts
- [ ] Build AI agent system
- [ ] Implement retro UI components
- [ ] Create camera capture
- [ ] Install dependencies
- [ ] Test and launch

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
