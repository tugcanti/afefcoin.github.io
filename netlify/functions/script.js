// Mobile menu toggle
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('navMenu').classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('header')) {
    document.getElementById('navMenu').classList.remove('active');
  }
});

// Go Home
function goHome() {
  window.location.href = '#';
}

// Connect MetaMask
document.getElementById('connectWallet').addEventListener('click', async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      alert('Wallet Connected!');
    } catch (err) {
      console.error(err);
      alert('Connection rejected.');
    }
  } else {
    alert('MetaMask not found!');
  }
});

// Airdrop form
document.getElementById('airdropForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Your address has been submitted for the airdrop!');
});