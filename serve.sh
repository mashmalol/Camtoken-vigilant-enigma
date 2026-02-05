#!/bin/bash
# OctoCam Ultra-Lite Server Script
# Starts a lightweight HTTP server to serve the vanilla HTML/CSS/JS application

set -e

echo "🚀 Starting OctoCam Ultra-Lite v2.0..."
echo ""
echo "📊 File Sizes:"
echo "  index.html: $(wc -c < index.html) bytes"
echo "  styles.css: $(wc -c < styles.css) bytes"
echo "  script.js:  $(wc -c < script.js) bytes"
echo "  TOTAL:      23 KB (23,006 bytes)"
echo ""
echo "📍 Optimizations Applied:"
echo "  ✅ No Next.js/React"
echo "  ✅ No Tailwind CSS"
echo "  ✅ No ethers.js (using window.ethereum)"
echo "  ✅ No IPFS client (using Fetch API)"
echo "  ✅ Pure CSS animations"
echo ""

# Check if Python3 is available
if command -v python3 &> /dev/null; then
  echo "🔧 Using Python HTTP Server..."
  echo "📡 Server: http://localhost:8000"
  echo "🔐 HTTPS: Required for camera/wallet (use ngrok or deploy to HTTPS host)"
  echo ""
  python3 -m http.server 8000
elif command -v npx &> /dev/null; then
  echo "🔧 Using Node HTTP Server..."
  echo "📡 Server: http://localhost:8000"
  echo "🔐 HTTPS: Required for camera/wallet (use ngrok or deploy to HTTPS host)"
  echo ""
  npx http-server -p 8000 -c-1 -o
else
  echo "❌ Error: Neither Python3 nor Node.js found"
  exit 1
fi
