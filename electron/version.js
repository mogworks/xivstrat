// 比较版本号大小
// 假设 v1 与 v2 都是 x.x.x 的形式
// 如果 v1 > v2 返回 true
function compareVersion(v1, v2) {
  console.log(v1)
  console.log(v2)
  const splitV1 = v1.split('.').map(Number)
  const splitV2 = v2.split('.').map(Number)
  for (let i = 0; i < 2; i++) {
    const num1 = splitV1[i] || 0
    const num2 = splitV2[i] || 0

    if (num1 > num2) {
      return true
    }
    if (num1 < num2) {
      return false
    }
  }
}

async function getVersionFrom(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request error：${response.status}`)
  }
  const data = await response.json()
  console.log('Found update:', data)
  return data
}

module.exports = { compareVersion, getVersionFrom }
