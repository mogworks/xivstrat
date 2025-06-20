const fs = require('node:fs')
const path = require('node:path')

const distPath = path.join(__dirname, '../dist')

console.log('Checking dist directory structure...\n')

// 检查关键路径
const keyPaths = [
  'index.html',
  './_astro',
  '07/m5s/p1/index.html',
  '07/m6s/p1/index.html'
]

keyPaths.forEach((p) => {
  const fullPath = path.join(distPath, p)
  const exists = fs.existsSync(fullPath)
  console.log(`${exists ? '✓' : '✗'} ${p}`)

  if (exists && p.endsWith('.html')) {
    // 读取 HTML 文件的前几行
    const content = fs.readFileSync(fullPath, 'utf8')
    const lines = content.split('\n').slice(0, 5)
    console.log('  First few lines:')
    lines.forEach((line) => {
      if (line.includes('href=') || line.includes('src=')) {
        console.log('  ', `${line.trim().substring(0, 100)}...`)
      }
    })
  }
})

// 列出 _astro 目录内容
const astroPath = path.join(distPath, './_astro')
if (fs.existsSync(astroPath)) {
  console.log('\n./_astro directory contents:')
  const files = fs.readdirSync(astroPath)
  files.slice(0, 10).forEach((file) => {
    console.log('  -', file)
  })
  if (files.length > 10) {
    console.log('  ... and', files.length - 10, 'more files')
  }
}

// 检查一个子页面的内容
const subPagePath = path.join(distPath, '07/m5s/p1/index.html')
if (fs.existsSync(subPagePath)) {
  console.log('\nChecking sub-page (07/m5s/p1/index.html):')
  const content = fs.readFileSync(subPagePath, 'utf8')

  // 查找所有的资源引用
  const resourceMatches = content.match(/(href|src)="([^"]+)"/g)
  if (resourceMatches) {
    console.log('Resource references found:')
    const uniquePatterns = new Set()
    resourceMatches.forEach((match) => {
      const value = match.match(/"([^"]+)"/)[1]
      if (value.startsWith('/.') || value.startsWith('http')) {
        uniquePatterns.add(`${value.substring(0, 50)}...`)
      }
    })
    uniquePatterns.forEach(pattern => console.log('  -', pattern))
  }

  // 检查是否有 base 标签
  if (content.includes('<base')) {
    const baseMatch = content.match(/<base[^>]+>/)
    console.log('\nBase tag found:', baseMatch[0])
  } else {
    console.log('\nNo base tag found')
  }
}

console.log('\nRun "pnpm build:electron" first if files are missing.')
