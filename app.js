const axios = require('axios');
const fs = require('fs');

const urlTemplate = 'https://explorer-api.walletconnect.com/v3/all?projectId=2f05ae7f1116030fde2d36508f472bfb&entries=40&page={page}&chains=eip155%3A1&build=1722247577140';
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
        .filter(wallet => wallet.app_type === "wallet")
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
  fs.writeFileSync('wallets.json', JSON.stringify(limitedWallets, null, 2), 'utf8');
  console.log(`Saved ${limitedWallets.length} wallets to wallets.json`);
}

fetchWallets();
