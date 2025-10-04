// netlify/functions/claim.js
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }
  try {
    const data = JSON.parse(event.body || '{}');
    const address = (data.address || '').toLowerCase();
    if (!address || !/^0x[a-f0-9]{40}$/.test(address)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid address' }) };
    }

    const claimsFile = path.join(__dirname, '../../claims.txt'); // repo root file
    const line = `${address},${Date.now()}\n`;
    fs.appendFileSync(claimsFile, line);

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
