const axios = require('axios');

// Function to fetch data from the API
async function fetchData() {
  try {
    const response = await axios.get('https://chainlist.wtf/page-data/sq/d/3672587576.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Function to check for chain ID eip155:1
async function checkChainId(data) {
  if (!data || !data.data || !data.data.allChain || !data.data.allChain.nodes) {
    console.error('Invalid data format');
    return;
  }

  const nodes = data.data.allChain.nodes;
  const targetChainId = 1; // Right side of eip155:1

  const result = nodes.find(node => node.chainId === targetChainId);

  if (result) {
    console.log('Chain ID eip155:1 found:', result);
  } else {
    console.log('Chain ID eip155:1 not found');
  }
}

// Main function to orchestrate the process
async function main() {
  const data = await fetchData();
  await checkChainId(data);
}

// Run the main function
main();
