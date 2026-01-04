const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const apiDir = path.join(root, 'api');

// Ensure output directories exist
const regenciesDir = path.join(apiDir, 'regencies');
const districtsDir = path.join(apiDir, 'districts');
const villagesDir = path.join(apiDir, 'villages');

if (!fs.existsSync(regenciesDir)) fs.mkdirSync(regenciesDir, { recursive: true });
if (!fs.existsSync(districtsDir)) fs.mkdirSync(districtsDir, { recursive: true });
if (!fs.existsSync(villagesDir)) fs.mkdirSync(villagesDir, { recursive: true });

// Helper to write JSON file
const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data)); // Write minified directly
};

// 1. Split Districts per Regency (Kabupaten)
console.log('Splitting districts per regency...');
const districtsPath = path.join(apiDir, 'districts.json');
if (fs.existsSync(districtsPath)) {
  const districts = JSON.parse(fs.readFileSync(districtsPath, 'utf8'));
  const districtsByRegency = {};

  districts.forEach(d => {
    const regencyId = d.cityId; // Note: property is cityId in source
    if (!districtsByRegency[regencyId]) districtsByRegency[regencyId] = [];
    districtsByRegency[regencyId].push(d);
  });

  // Clear existing province-based files in districts/ if any (optional, but cleaner)
  // fs.rmSync(districtsDir, { recursive: true, force: true });
  // fs.mkdirSync(districtsDir);

  Object.keys(districtsByRegency).forEach(regencyId => {
    const outFile = path.join(districtsDir, `${regencyId}.json`);
    writeJson(outFile, districtsByRegency[regencyId]);
  });
  console.log(`  - Created ${Object.keys(districtsByRegency).length} regency files for districts.`);
}

// 2. Split Villages per District (Kecamatan)
console.log('Splitting villages per district...');
const villagesPath = path.join(apiDir, 'villages.json');
if (fs.existsSync(villagesPath)) {
  const villages = JSON.parse(fs.readFileSync(villagesPath, 'utf8'));
  const villagesByDistrict = {};

  villages.forEach(v => {
    const districtId = v.districtId;
    if (!villagesByDistrict[districtId]) villagesByDistrict[districtId] = [];
    villagesByDistrict[districtId].push(v);
  });

  // Clear existing province-based files in villages/
  // fs.rmSync(villagesDir, { recursive: true, force: true });
  // fs.mkdirSync(villagesDir);

  Object.keys(villagesByDistrict).forEach(districtId => {
    const outFile = path.join(villagesDir, `${districtId}.json`);
    writeJson(outFile, villagesByDistrict[districtId]);
  });
  console.log(`  - Created ${Object.keys(villagesByDistrict).length} district files for villages.`);
}

console.log('Granular splitting complete.');
