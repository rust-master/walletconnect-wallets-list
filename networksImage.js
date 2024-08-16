const https = require('https');
const fs = require('fs');
const path = require('path');

// URL of the API and the base URL for images
const apiUrl = 'https://chainlist.wtf/page-data/sq/d/3672587576.json';
const baseUrl = 'https://chainlist.wtf';

// Path to the network list JSON file
const networkListPath = path.join(__dirname, 'network-list.json');

// Fetch data from the API
https.get(apiUrl, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    // Parse the API response
    const apiData = JSON.parse(data).data.allChain.nodes;

    // Read the existing network list file
    fs.readFile(networkListPath, 'utf8', (err, networkListData) => {
      if (err) {
        console.error('Error reading network-list.json:', err);
        return;
      }

      let networkList = JSON.parse(networkListData);

      // Update the network list with image URLs and explorer links
      networkList = networkList.map((network) => {
        const match = apiData.find((chain) => chain.name === network.Name);

        if (match) {
          // Attempt to get the image URL
          let imageUrl = '';

          if (match.icon?.publicURL) {
            imageUrl = `${baseUrl}${match.icon.publicURL}`;
          } else if (match.icon?.childImageSharp?.gatsbyImageData?.images?.fallback?.src) {
            imageUrl = `${baseUrl}${match.icon.childImageSharp.gatsbyImageData.images.fallback.src}`;
          }

          // Get the explorer link
          const explorerLink = match.explorers?.[0]?.url || '';

          return {
            ...network,
            Image: imageUrl,
            ExplorerLink: explorerLink
          };
        }

        return network;
      });

      // Write the updated data back to network-list.json
      fs.writeFile(networkListPath, JSON.stringify(networkList, null, 2), 'utf8', (err) => {
        if (err) {
          console.error('Error writing to network-list.json:', err);
        } else {
          console.log('network-list.json has been updated successfully.');
        }
      });
    });
  });
}).on('error', (err) => {
  console.error('Error fetching data from the API:', err);
});
