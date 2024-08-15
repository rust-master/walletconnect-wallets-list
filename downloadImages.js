const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to download an image from a URL and save it locally
const downloadImage = async (url, filename) => {
  try {
    const response = await axios({
      url,
      responseType: 'stream',
    });

    return new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(filename))
        .on('finish', () => resolve())
        .on('error', (e) => reject(e));
    });
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error.message);
  }
};

// Function to process the API data and download images
const downloadNetworkImages = async () => {
  const apiUrl = 'https://chainlist.wtf/page-data/sq/d/3672587576.json';
  const outputDir = path.join(__dirname, 'networkImages');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  try {
    const response = await axios.get(apiUrl);
    const networks = response.data.data.allChain.nodes;
    console.log("networks:", networks.length);
    
    for (const network of networks) {
      if (network.icon && network.icon.publicURL) {
        const imageUrl = `https://chainlist.wtf${network.icon.publicURL}`;
        const imageName = `${network.name.replace(/ /g, '_').toLowerCase()}.png`;
        const outputPath = path.join(outputDir, imageName);

        console.log(`Downloading ${imageUrl}...`);
        await downloadImage(imageUrl, outputPath);
        console.log(`Saved to ${outputPath}`);
      }
    }

    console.log('All images downloaded successfully.');
  } catch (error) {
    console.error('Failed to fetch network data:', error.message);
  }
};

// Run the download function
downloadNetworkImages();
