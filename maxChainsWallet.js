const fs = require('fs');

// Read the JSON file
fs.readFile('wallets_evm_chain.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  let wallets = JSON.parse(data);

  // Find the wallet with the maximum number of chains
  let maxChainsWallet = wallets.reduce((maxWallet, currentWallet) => {
    return currentWallet.chains.length > maxWallet.chains.length ? currentWallet : maxWallet;
  }, wallets[0]);

  // Write the result to a new JSON file
  fs.writeFile('max_chains_wallet.json', JSON.stringify(maxChainsWallet, null, 2), 'utf8', err => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('Max chains wallet has been saved to max_chains_wallet.json');
  });
});
