const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// New behaviour: focus on `api/` folder as the single source of truth.
// The script validates presence of expected files and generates `api/manifest.json`
// containing file name, size and sha256 checksum.

const root = path.resolve(__dirname, '..')
const apiDir = path.join(root, 'api')

if (!fs.existsSync(apiDir)) {
  console.error('api/ folder not found. Please create api/ and add provinces/regencies/districts/villages JSON files.')
  process.exit(1)
}

// discover JSON files in api/ (excluding manifest.json) and any nested files
function listJsonFiles(dir) {
  const res = []
  const items = fs.readdirSync(dir)
  for (const it of items) {
    const p = path.join(dir, it)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) {
      // include json files inside
      const inner = fs.readdirSync(p).filter(f => f.endsWith('.json'))
      for (const f of inner) res.push(path.join(p, f))
    } else if (stat.isFile() && it.endsWith('.json') && it !== 'manifest.json') {
      res.push(p)
    }
  }
  return res
}

function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const rs = fs.createReadStream(filePath)
    rs.on('error', reject)
    rs.on('data', chunk => hash.update(chunk))
    rs.on('end', () => resolve(hash.digest('hex')))
  })
}

async function buildManifest() {
  const manifest = { generatedAt: new Date().toISOString(), files: [] }
  const files = listJsonFiles(apiDir)
  for (const p of files) {
    const rel = path.relative(apiDir, p).replace(/\\/g, '/')
    const stat = fs.statSync(p)
    const sha = await sha256File(p)
    manifest.files.push({ name: rel, sizeBytes: stat.size, sha256: sha })
    console.log(`validated: docs/api/${rel} — ${Math.round(stat.size/1024)} KB — sha256:${sha.slice(0,8)}...`)
  }

  const out = path.join(apiDir, 'manifest.json')
  fs.writeFileSync(out, JSON.stringify(manifest, null, 2))
  console.log('wrote docs/api/manifest.json')
}

buildManifest().catch(err => {
  console.error('error building manifest:', err)
  process.exit(1)
})

console.log('publish-api: done')
