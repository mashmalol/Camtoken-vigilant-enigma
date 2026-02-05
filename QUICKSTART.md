# Quick Reference: OctoCam Ultra-Lite

## 📊 Key Stats
- **Bundle Size**: 23 KB (23,006 bytes)
- **Load Time**: ~100ms (vs 2.5s for full version)
- **Dependencies**: 0 npm packages
- **Framework**: None (vanilla HTML/CSS/JS)
- **HTTPS**: Required for camera + wallet

## 🚀 Start Server

### Instant (Python only)
```bash
cd /home/mash/programming/CamNTF\ lite\ node/octocam
python3 -m http.server 8000
# → http://localhost:8000
```

### With npm
```bash
npm run start
```

## 📁 Files

| File | Size | Purpose |
|------|------|---------|
| index.html | 4 KB | 3 screens (home, camera, form) |
| styles.css | 8 KB | Retro cyberpunk theme + animations |
| script.js | 11 KB | All logic (camera, wallet, IPFS) |
| **TOTAL** | **23 KB** | ✨ Ultra-lightweight |

## 🎮 3 Screens

### 1. Home Screen
- Connect MetaMask wallet
- Start camera capture
- Instructions

### 2. Camera Screen
- Live video feed
- Capture button
- Cancel button

### 3. Form Screen
- Image preview
- NFT metadata (title, description, price)
- Add attributes (traits)
- Download: Image + JSON
- Upload to IPFS
- Mint NFT

## 🔑 Key APIs Used

### Browser APIs
- `navigator.mediaDevices.getUserMedia()` - Camera
- `HTMLCanvasElement.toDataURL()` - Image capture
- `Fetch API` - Network requests
- `Blob & URL.createObjectURL()` - File downloads

### Wallet
- `window.ethereum.request()` - MetaMask connection

### IPFS
- `https://ipfs.infura.io:5001/api/v0/add` - Upload files

## 🔧 Configuration

### Edit IPFS Gateway (optional)
In `script.js`, line ~25:
```javascript
const CONFIG = {
  infuraProjectId: 'YOUR_ID',
  ipfsGateway: 'https://ipfs.infura.io/ipfs/',
};
```

### Change Wallet Network
In `script.js`, add after wallet connection:
```javascript
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0x1' }], // Ethereum mainnet
});
```

## 🎨 Customization

### Colors
In `styles.css`, edit `:root`:
```css
:root {
  --primary: #0066ff;
  --secondary: #00ccff;
  --accent: #00ff41;
  --dark: #000814;
}
```

### Fonts
In `index.html` `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
```

### Animations
In `styles.css`:
```css
@keyframes custom-animation {
  0% { ... }
  100% { ... }
}
```

## 📱 Mobile Support

✅ Chrome Android - Full support
⚠️ Safari iOS - Limited (camera may have issues)
✅ Firefox - Full support
✅ Edge - Full support

### Test on Mobile
```bash
# Get local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Visit from phone: http://YOUR_IP:8000
# (HTTPS required for camera if on actual network)
```

## 🚢 Deploy

### Netlify (Easiest)
1. Drag & drop files to Netlify
2. Done! Instant HTTPS ✅

### GitHub Pages
```bash
git add index.html styles.css script.js
git commit -m "Deploy OctoCam Ultra-Lite"
git push origin gh-pages
# Visit: https://username.github.io/repo/
```

### Vercel
```bash
git push
# Auto-deploys from GitHub, instant HTTPS ✅
```

## 🐛 Troubleshooting

### Camera not working?
- ✅ Use localhost or HTTPS
- ✅ Check camera permissions (browser settings)
- ✅ Try Chrome/Firefox (Safari has issues)
- ❌ Check browser console (F12 → Console)

### MetaMask not connecting?
- ✅ Install MetaMask extension
- ✅ Use HTTPS or localhost
- ✅ Check CORS (should be fine for localhost)
- ❌ Check browser console errors

### IPFS upload fails?
- ✅ Check network (is internet connected?)
- ✅ Try different IPFS gateway
- ✅ Check file size (should be fine)
- ❌ Check browser console network tab

## 🔐 Security

⚠️ This app is **client-side only**:
- ✅ No backend (nothing to hack)
- ✅ MetaMask handles signing (secure)
- ✅ No private keys stored (safe)
- ❌ No server validation (user responsible)
- ❌ IPFS is public (anyone can see)

## 📈 Performance Tips

### Faster Loads
1. Deploy to CDN (Netlify, Vercel)
2. Enable GZIP compression
3. Use HTTP/2 server

### Better Mobile
1. Test on actual device
2. Check 4G load times
3. Enable browser caching

## 🧪 Testing

### Unit Test Example
```javascript
// In browser console:
navigator.mediaDevices.getUserMedia({video: true})
  .then(stream => console.log('✅ Camera works'))
  .catch(err => console.error('❌ Camera failed:', err));
```

### Wallet Test
```javascript
// In browser console:
window.ethereum.request({method: 'eth_accounts'})
  .then(accounts => console.log('✅ Connected:', accounts))
  .catch(err => console.error('❌ Error:', err));
```

## 📚 Related Files

- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment guide
- `OPTIMIZATIONS.md` - Detailed optimization info
- `CONTRACTS/CameraNFT.sol` - Example smart contract

## 🤝 Contributing

Ideas for improvements:
- Image filters (brightness, contrast, etc.)
- Multiple image sizes
- Batch upload
- Custom contract ABI input
- Transaction confirmation UI
- Error recovery

**Keep it lightweight!** 🎯

---

## Quick Links

| Purpose | URL | Time |
|---------|-----|------|
| Start dev | `python3 -m http.server 8000` | Instant |
| Deploy | Drag to Netlify | 2 minutes |
| Customize | Edit `styles.css` | 5 minutes |
| Test camera | Open console, run getUserMedia | 1 minute |
| Share | Copy HTTPS link | 30 seconds |

---

**That's it! Simplest NFT minting app ever.** 🚀
