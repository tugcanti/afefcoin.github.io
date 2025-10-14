// Menu toggle
document.getElementById('menuToggle').addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('navMenu').classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('header')) {
    document.getElementById('navMenu').classList.remove('open');
  }
});

// Go Home
document.getElementById('siteLogo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// MetaMask connection
document.getElementById('connectWallet').addEventListener('click', async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      alert('Wallet Connected!');
    } catch (err) {
      alert('Connection rejected.');
    }
  } else {
    alert('MetaMask not found!');
  }
});

// Airdrop validation
document.getElementById('airdropForm').addEventListener('submit', (e) => {
  const wallet = document.getElementById('airdropWallet').value.trim();
  if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    alert('Please enter a valid Ethereum wallet address!');
    e.preventDefault();
  }
});