const fs = require('fs');

// Read JSON files
const walletsEvmChain = JSON.parse(fs.readFileSync('wallets_evm_chain.json'));
const walletsSolana = JSON.parse(fs.readFileSync('wallets_solana.json'));

// Helper function to compare two wallets
const compareWallets = (wallet1, wallet2) => {
  return wallet1.name === wallet2.name;
};

// Function to find wallets that are in file1 but not in file2
const findUniqueWallets = (file1, file2) => {
  return file1.filter(wallet1 => 
    !file2.some(wallet2 => compareWallets(wallet1, wallet2))
  );
};

// Find unique wallets
const uniqueWallets = findUniqueWallets(walletsSolana, walletsEvmChain);

// Write unique wallets to a new JSON file
fs.writeFileSync('unique_wallets.json', JSON.stringify(uniqueWallets, null, 2));

console.log('Unique wallets have been written to unique_wallets.json');
