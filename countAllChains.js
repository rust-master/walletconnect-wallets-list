const fs = require('fs');
const path = require('path');

// Path to the all-chains.json file
const filePath = path.join(__dirname, 'all-chains.json');

// Read the all-chains.json file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading all-chains.json:', err);
    return;
  }

  // Parse the JSON data
  const chains = JSON.parse(data);

  // Count the number of chains
  const chainCount = chains.length;

  console.log(`Total number of chains: ${chainCount}`);
});
