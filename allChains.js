const https = require('https');
const fs = require('fs');
const path = require('path');

// URL of the API and the base URL for images
const apiUrl = 'https://chainlist.wtf/page-data/sq/d/3672587576.json';
const baseUrl = 'https://chainlist.wtf';

// Path to the output JSON file
const outputFilePath = path.join(__dirname, 'all-chains.json');

// Fetch data from the API
https.get(apiUrl, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    // Parse the API response
    const apiData = JSON.parse(data).data.allChain.nodes;

    // Extract relevant details for each chain
    const chains = apiData.map(chain => {
      // Attempt to get the image URL
      let imageUrl = '';

      if (chain.icon?.publicURL) {
        imageUrl = `${baseUrl}${chain.icon.publicURL}`;
      } else if (chain.icon?.childImageSharp?.gatsbyImageData?.images?.fallback?.src) {
        imageUrl = `${baseUrl}${chain.icon.childImageSharp.gatsbyImageData.images.fallback.src}`;
      }

      // Extract explorers, if available
      const explorers = chain.explorers ? chain.explorers.map(explorer => explorer.url) : [];

      return {
        name: chain.name,
        chainId: chain.chainId,
        image: imageUrl,
        explorers: explorers,
        nativeCurrencySymbol: chain.nativeCurrency?.symbol || ''
      };
    });

    // Save the data to all-chains.json
    fs.writeFile(outputFilePath, JSON.stringify(chains, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing to all-chains.json:', err);
      } else {
        console.log('all-chains.json has been created successfully.');
      }
    });
  });
}).on('error', (err) => {
  console.error('Error fetching data from the API:', err);
});
