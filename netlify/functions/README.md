AFEF Airdrop Site & Admin Tools

1) Deploy site via GitHub + Netlify:
 - Create repo (this repo) and commit these files.
 - Go to netlify.com, "New site from Git", connect your GitHub repo, and Deploy.
 - After deploy, Netlify gives you a site URL: https://<your-site-name>.netlify.app

2) Update index.html CONFIG:
 - Replace API_CLAIM_ENDPOINT with https://<your-site-name>.netlify.app/.netlify/functions/claim
 - Commit and push.

3) Collect Claims:
 - Visitors hitting Claim will append their address to claims.txt (visible in repo deploy logs/Netlify functions).

4) Run admin airdrop locally:
 - On your machine: `npm install`
 - Create `.env` with RPC + PRIVATE_KEY (secure)
 - Prepare `airdrop.csv` or use `claims.txt`
 - Run: `npm run airdrop`

Security: Do NOT commit PRIVATE_KEY to GitHub.
## 🪙 AFEF Token Info
- **Symbol:** AFEF  
- **Network:** Ethereum  
- **Decimals:** 18  
- **Contract:** [0x367a584a928b641330E8B20e7C4739675741f40d](https://etherscan.io/token/0xYourTokenAddressHere)  
- **Official Website:** [afefcoin.github.io](https://afefcoin.github.io)