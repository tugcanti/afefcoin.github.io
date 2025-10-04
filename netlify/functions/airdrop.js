// airdrop.js - run locally to distribute tokens listed in claims.txt or airdrop.csv
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { ethers } = require('ethers');

const RPC = process.env.RPC || 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY';
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''; // load from env
const TOKEN_ADDRESS = '0x367a584a928b641330E8B20e7C4739675741f40d';
const DECIMALS = 18;
const CSV_FILE = 'airdrop.csv'; // preferred; if missing, uses claims.txt

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)"
];

async function main(){
  if (!PRIVATE_KEY) throw new Error('Set PRIVATE_KEY in environment before running.');
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

  let rows = [];
  if (fs.existsSync(CSV_FILE)) {
    const csv = fs.readFileSync(CSV_FILE);
    rows = parse(csv, { columns: true, skip_empty_lines: true });
  } else if (fs.existsSync('claims.txt')) {
    const txt = fs.readFileSync('claims.txt', 'utf8').trim().split(/\r?\n/);
    rows = txt.map(l => {
      const [addr] = l.split(',');
      return { address: addr.trim(), amount: '100' }; // default 100 tokens each; change as needed
    });
  } else {
    console.log('No airdrop.csv or claims.txt found.');
    return;
  }

  console.log(`Found ${rows.length} recipients`);
  for (const r of rows) {
    const to = r.address.trim();
    const amount = ethers.parseUnits((r.amount || '100').toString(), DECIMALS);
    console.log(`Sending ${r.amount} to ${to}`);
    try {
      const tx = await token.transfer(to, amount);
      console.log('tx', tx.hash);
      await tx.wait();
      console.log('sent to', to);
    } catch (e) {
      console.error('error sending to', to, e.message || e);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
