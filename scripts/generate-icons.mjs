import sharp from 'sharp';
import fs from 'fs';

async function generateIcons() {
  const svgPath = './public/icon.svg';
  
  if (!fs.existsSync(svgPath)) {
    console.error('❌ icon.svg not found');
    return;
  }

  try {
    // Generate 192x192 icon
    await sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile('./public/icon-192.png');
    console.log('✅ icon-192.png generated');

    // Generate 512x512 icon
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile('./public/icon-512.png');
    console.log('✅ icon-512.png generated');

  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
  }
}

generateIcons();
