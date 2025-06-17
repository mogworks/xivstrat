import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const iconSizes = [32, 128, 256, 512]
const srcIcon = path.join(__dirname, '../public/favicon.svg')
const destDir = path.join(__dirname, '../src-tauri/icons')

async function generateIcons() {
  console.log('Generating app icons...')
  
  // Ensure icons directory exists
  await fs.mkdir(destDir, { recursive: true })
  
  // Generate PNG icons for different sizes
  for (const size of iconSizes) {
    const outputPath = path.join(destDir, `${size}x${size}.png`)
    await sharp(srcIcon)
      .resize(size, size)
      .png()
      .toFile(outputPath)
    console.log(`✓ Generated ${size}x${size}.png`)
    
    // Generate @2x version for 128px
    if (size === 128) {
      const output2xPath = path.join(destDir, `${size}x${size}@2x.png`)
      await sharp(srcIcon)
        .resize(size * 2, size * 2)
        .png()
        .toFile(output2xPath)
      console.log(`✓ Generated ${size}x${size}@2x.png`)
    }
  }
  
  // Generate icon.png (default icon)
  await sharp(srcIcon)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(destDir, 'icon.png'))
  console.log('✓ Generated icon.png')
  
  console.log('\nNote: You need to manually create icon.icns (macOS) and icon.ico (Windows)')
  console.log('You can use online converters or tools like icnsutil/convert')
}

generateIcons().catch(console.error)