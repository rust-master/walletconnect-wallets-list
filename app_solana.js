const axios = require('axios');
const fs = require('fs');


const urlTemplate = 'https://explorer-api.walletconnect.com/v3/all?projectId=2f05ae7f1116030fde2d36508f472bfb&entries=40&page={page}&chains=solana%3A5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp&build=1722409907377';

const wallets = [];
const maxWallets = 400;

async function fetchWallets() {
  let page = 1;

  while (wallets.length < maxWallets) {
    const url = urlTemplate.replace('{page}', page);
    try {
      const response = await axios.get(url);
      const listings = response.data.listings;
      const newWallets = Object.values(listings)
        .filter(wallet => wallet.app_type === "wallet" && wallet.chains.includes("solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"))
        .map((wallet, index) => ({
          srNo: wallets.length + index + 1,
          name: wallet.name,
          category: wallet.category,
          imageUrlSm: wallet.image_url.sm,
          imageUrlMd: wallet.image_url.md,
          imageUrlLg: wallet.image_url.lg,
          appType: wallet.app_type
        }));

      wallets.push(...newWallets);

      // If there are no more listings, break the loop
      if (newWallets.length === 0) {
        break;
      }

      page++;
      console.log("🚀 ~ fetchWallets ~ page:", page);
    } catch (error) {
      console.error('Error fetching data:', error);
      break;
    }
  }

  // Limit the wallets array to maxWallets
  const limitedWallets = wallets.slice(0, maxWallets);

  // Save the results to a JSON file
  fs.writeFileSync('wallets_solana1.json', JSON.stringify(limitedWallets, null, 2), 'utf8');
  console.log(`Saved ${limitedWallets.length} wallets to wallets_solana1.json`);
}

fetchWallets();
