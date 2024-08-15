const fs = require('fs');
const path = require('path');

const countImages = () => {
  const imagesDir = path.join(__dirname, 'networkImages');

  // Check if the directory exists
  if (!fs.existsSync(imagesDir)) {
    console.error(`Directory not found: ${imagesDir}`);
    return;
  }

  // Read the directory contents
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`);
      return;
    }

    // Filter out non-image files (e.g., files that don't have .png or .jpg extension)
    const imageFiles = files.filter(file =>
      ['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(file).toLowerCase())
    );

    // Count and print the number of images
    console.log(`Number of images in '${imagesDir}': ${imageFiles.length}`);
  });
};

// Run the count function
countImages();
