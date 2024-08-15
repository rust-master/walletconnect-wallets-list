const fs = require('fs');
const csv = require('csv-parser');

const results = [];

const ChainType = "EVM"
const ExplorerLink = ""
const Image = ""

fs.createReadStream('network-list.csv')
  .pipe(csv())
  .on('data', (data) => {
    // Extract required fields
   
    const { 'Chain Name': Name, 'Token Name': TokenName, FinalChainID: ChainId} = data;
    
    // Add extracted data to results array
    results.push({ Name, TokenName, ChainId, ChainType, ExplorerLink, Image });
  })
  .on('end', () => {
    // Write the results to a JSON file
    fs.writeFileSync('network-list.json', JSON.stringify(results, null, 2));
    console.log('CSV file successfully processed and JSON file created.');
  });
