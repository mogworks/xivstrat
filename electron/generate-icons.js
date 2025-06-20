const fs = require('node:fs')
const path = require('node:path')
const sharp = require('sharp')

// 源图标路径
const SOURCE_ICON = path.join(__dirname, '../public/favicon.svg')
const BUILD_DIR = path.join(__dirname, 'build')

// 确保 build 目录存在
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true })
}

// 生成 PNG 图标（用于 Linux）
async function generatePNG() {
  await sharp(SOURCE_ICON)
    .resize(512, 512)
    .png()
    .toFile(path.join(BUILD_DIR, 'icon.png'))

  console.log('✓ Generated icon.png')
}

// 生成 ICO 图标（用于 Windows）
// 注意：这需要额外的工具，这里生成多个 PNG 作为准备
async function generateICOPrep() {
  const sizes = [16, 32, 48, 64, 128, 256]

  for (const size of sizes) {
    await sharp(SOURCE_ICON)
      .resize(size, size)
      .png()
      .toFile(path.join(BUILD_DIR, `icon_${size}x${size}.png`))
  }

  console.log('✓ Generated PNG files for ICO conversion')
  console.log('  Note: Use png2ico or similar tool to create icon.ico')
}

// 生成 ICNS 图标（用于 macOS）
// 注意：这需要额外的工具，这里生成多个 PNG 作为准备
async function generateICNSPrep() {
  const sizes = [16, 32, 64, 128, 256, 512, 1024]

  for (const size of sizes) {
    await sharp(SOURCE_ICON)
      .resize(size, size)
      .png()
      .toFile(path.join(BUILD_DIR, `icon_${size}x${size}.png`))
  }

  console.log('✓ Generated PNG files for ICNS conversion')
  console.log('  Note: Use png2icns or similar tool to create icon.icns')
}

// 主函数
async function main() {
  console.log('Generating Electron icons...')

  try {
    await generatePNG()
    await generateICOPrep()
    await generateICNSPrep()

    console.log('\n✅ Icon generation complete!')
    console.log('\nNext steps:')
    console.log('1. For Windows: Convert PNGs to icon.ico using png2ico')
    console.log('2. For macOS: Convert PNGs to icon.icns using png2icns')
    console.log('3. Place the generated files in electron/build/')
  } catch (error) {
    console.error('❌ Error generating icons:', error)
    require('node:process').exit(1)
  }
}

main()
