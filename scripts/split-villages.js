const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const apiDir = path.join(root, 'docs', 'api')
const villagesPath = path.join(apiDir, 'villages.json')

if (!fs.existsSync(villagesPath)) {
  console.error('docs/api/villages.json not found — cannot split')
  process.exit(1)
}

const districtsPath = path.join(apiDir, 'districts.json')
const regenciesPath = path.join(apiDir, 'regencies.json')

if (!fs.existsSync(districtsPath) || !fs.existsSync(regenciesPath)) {
  console.error('docs/api/districts.json or docs/api/regencies.json missing — required to map village -> province')
  process.exit(1)
}

const villages = JSON.parse(fs.readFileSync(villagesPath, 'utf8'))
const districts = JSON.parse(fs.readFileSync(districtsPath, 'utf8'))
const regencies = JSON.parse(fs.readFileSync(regenciesPath, 'utf8'))

// build mappings: districtId -> cityId, cityId -> provinceId
const districtToCity = Object.create(null)
for (const d of districts) districtToCity[String(d.id)] = String(d.cityId || d.city_id || d.cityID || d.city)

const cityToProvince = Object.create(null)
for (const c of regencies) cityToProvince[String(c.id)] = String(c.provinceId || c.province_id || c.province)

// group villages by provinceId
const byProvince = Object.create(null)

for (const v of villages) {
  const districtId = String(v.districtId || v.district_id || v.kecamatan_id || v.district)
  const cityId = districtToCity[districtId]
  if (!cityId) {
    // skip if we can't map
    continue
  }
  const provId = cityToProvince[cityId]
  if (!provId) continue
  if (!byProvince[provId]) byProvince[provId] = []
  byProvince[provId].push(v)
}

const outDir = path.join(apiDir, 'villages')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

for (const provId of Object.keys(byProvince)) {
  const outPath = path.join(outDir, `${provId}.json`)
  fs.writeFileSync(outPath, JSON.stringify(byProvince[provId], null, 2))
  console.log(`wrote ${path.relative(root, outPath)} (${byProvince[provId].length} items)`)
}

console.log('split-villages: done')
