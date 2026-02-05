# OctoCam Ultra-Lite Deployment Guide

## Quick Summary

✨ **Ultra-lightweight NFT minting app** - Only 23 KB!
- Pure vanilla HTML/CSS/JavaScript
- Zero npm dependencies
- No build step required
- Works anywhere (static hosting)

## Size Comparison

```
OctoCam Full (AI)      : 208 KB
OctoCam Lite v1        : ~50 KB  
OctoCam Ultra-Lite v2  : 23 KB  ✨
----
Reduction from Full    : 89% smaller
Reduction from Lite    : 54% smaller
```

## Local Development

### Option A: Python (Recommended - Zero setup)
```bash
cd octocam
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Option B: Node.js
```bash
cd octocam
npx http-server -p 8000
# Visit http://localhost:8000
```

### Option C: npm script
```bash
cd octocam
npm install
npm run start
```

## Production Deployment

### ✅ Static Hosting (Recommended)

#### GitHub Pages (Free)
```bash
# Copy files to gh-pages branch
git add index.html styles.css script.js
git commit -m "Deploy OctoCam Ultra-Lite"
git push origin gh-pages
# Visit https://username.github.io/repo/
```

#### Netlify (Free + Easy)
1. Drag & drop `index.html`, `styles.css`, `script.js` to Netlify
2. Deploy instantly
3. Custom domain: Point CNAME to your Netlify site
4. Automatic HTTPS: Included ✅

#### Vercel (Free + Fast)
1. Create `vercel.json`:
```json
{
  "version": 2,
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```
2. Push to GitHub
3. Connect to Vercel
4. Deploy with HTTPS ✅

#### AWS S3 + CloudFront
1. Create S3 bucket
2. Upload files
3. Create CloudFront distribution
4. Configure ACM certificate for HTTPS ✅

### Self-Hosted

#### Nginx
```nginx
server {
  listen 443 ssl http2;
  server_name yourdomain.com;
  
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;
  
  root /var/www/octocam;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

#### Docker (Single container)
```dockerfile
FROM nginx:alpine
COPY index.html styles.css script.js /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/
EXPOSE 80
```

Run:
```bash
docker run -p 80:80 octocam-lite
```

#### Apache
```apache
<VirtualHost *:443>
  ServerName yourdomain.com
  DocumentRoot /var/www/octocam
  
  <Directory /var/www/octocam>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
    
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>
  </Directory>
  
  SSLEngine on
  SSLCertificateFile /path/to/cert.pem
  SSLCertificateKeyFile /path/to/key.pem
</VirtualHost>
```

### Serverless (Cloudflare Workers)
```javascript
export default {
  fetch(request) {
    const url = new URL(request.url);
    
    // Map routes
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return fetch('/index.html');
    }
    
    return fetch(url);
  }
};
```

## HTTPS Configuration

⚠️ **Required for:** Camera API + MetaMask

### Let's Encrypt (Free)
```bash
certbot certonly --standalone -d yourdomain.com
# Valid for 90 days, auto-renew available
```

### Local HTTPS Testing
```bash
# Using mkcert (local CA)
mkcert localhost
# Creates localhost+1-key.pem and localhost+1.pem

# Start server with HTTPS
npx http-server --tls --cert localhost+1.pem --key localhost+1-key.pem
```

### ngrok (Tunnel HTTPS → localhost)
```bash
# Free tier: publishes HTTP only
ngrok http 8000

# Pro tier: custom domains + TLS
ngrok start --config=ngrok.yml web
```

## Environment Configuration

### IPFS Gateway (Optional)
Edit `script.js`:
```javascript
const CONFIG = {
  infuraProjectId: 'YOUR_PROJECT_ID',
  ipfsGateway: 'https://gateway.pinata.cloud/ipfs/',
  // or
  ipfsGateway: 'https://ipfs.io/ipfs/',
};
```

### Contract Address
Users enter contract address when minting (stored in form).

## Performance Optimization

### Pre-compression (optional)
```bash
# Gzip files for faster delivery
gzip -k index.html
gzip -k styles.css
gzip -k script.js

# Configure server to serve .gz files
```

### HTTP/2 Server Push
```nginx
http2_push /styles.css;
http2_push /script.js;
```

### Cache Headers (Static)
```nginx
location ~* \.(html|css|js)$ {
  expires 7d;
  add_header Cache-Control "public, immutable";
}
```

## Monitoring & Analytics

### Google Analytics
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Sentry Error Tracking
Add to `script.js`:
```javascript
<script src="https://browser.sentry-cdn.com/6.0.0/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
</script>
```

## Troubleshooting

### Camera Not Working
❌ Not HTTPS (test locally: http://localhost is OK)
❌ Browser doesn't support getUserMedia
✅ Use Chrome/Firefox/Edge on desktop
✅ Use Chrome on Android

### MetaMask Not Detected
❌ MetaMask extension not installed
❌ Not on HTTPS (required for security)
✅ Install MetaMask
✅ Use HTTPS or localhost

### IPFS Upload Fails
❌ Network issue
❌ Infura rate limited
✅ Check browser console
✅ Use different IPFS gateway
✅ Set up personal IPFS node

## Production Checklist

- [ ] HTTPS configured
- [ ] Custom domain set up
- [ ] DNS records verified
- [ ] SSL certificate valid
- [ ] Camera tested on mobile
- [ ] MetaMask connection tested
- [ ] IPFS uploads tested
- [ ] Contract address verified
- [ ] Error monitoring enabled
- [ ] Analytics tracking added
- [ ] CDN caching configured
- [ ] Backup/recovery plan

## Rollback

If deployment fails:
```bash
git revert <commit-hash>
git push origin main
# Platform will auto-redeploy previous version
```

## Support

For issues:
1. Check browser console (F12)
2. Verify HTTPS connection
3. Try different browser
4. Test camera permissions
5. Check IPFS gateway status

## Security Best Practices

⚠️ This is a **client-side only** application

- ✅ All computation in browser
- ✅ No private keys stored
- ✅ MetaMask handles signing
- ❌ No server validation (users responsible)
- ❌ No backend authentication
- ❌ IPFS is public (encryption optional)

---

**Questions?** Check [README.md](README.md) for more details.
