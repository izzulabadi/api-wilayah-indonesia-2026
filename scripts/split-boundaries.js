const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const apiDir = path.join(root, 'api');

// Ensure output directories exist
const regenciesDir = path.join(apiDir, 'regencies');
const districtsDir = path.join(apiDir, 'districts');

if (!fs.existsSync(regenciesDir)) fs.mkdirSync(regenciesDir);
if (!fs.existsSync(districtsDir)) fs.mkdirSync(districtsDir);

// 1. Split Regencies
console.log('Splitting regencies...');
const regenciesPath = path.join(apiDir, 'regencies.json');
if (fs.existsSync(regenciesPath)) {
  const regencies = JSON.parse(fs.readFileSync(regenciesPath, 'utf8'));
  const regenciesByProvince = {};

  regencies.forEach(regency => {
    const pId = regency.provinceId;
    if (!regenciesByProvince[pId]) regenciesByProvince[pId] = [];
    regenciesByProvince[pId].push(regency);
  });

  Object.keys(regenciesByProvince).forEach(pId => {
    const outFile = path.join(regenciesDir, `${pId}.json`);
    fs.writeFileSync(outFile, JSON.stringify(regenciesByProvince[pId], null, 2));
  });
  console.log(`  - Created ${Object.keys(regenciesByProvince).length} province files for regencies.`);
} else {
  console.error('  - api/regencies.json not found!');
}

// 2. Split Districts
console.log('Splitting districts...');
const districtsPath = path.join(apiDir, 'districts.json');
if (fs.existsSync(districtsPath) && fs.existsSync(regenciesPath)) {
  const districts = JSON.parse(fs.readFileSync(districtsPath, 'utf8'));
  const regencies = JSON.parse(fs.readFileSync(regenciesPath, 'utf8'));
  
  // Map regencyId (cityId) -> provinceId
  const regencyToProvince = {};
  regencies.forEach(r => {
    regencyToProvince[r.id] = r.provinceId;
  });

  const districtsByProvince = {};

  districts.forEach(district => {
    const pId = regencyToProvince[district.cityId];
    if (pId) {
      if (!districtsByProvince[pId]) districtsByProvince[pId] = [];
      districtsByProvince[pId].push(district);
    } else {
      console.warn(`  - Warning: District ${district.id} (${district.name}) has unknown cityId ${district.cityId}`);
    }
  });

  Object.keys(districtsByProvince).forEach(pId => {
    const outFile = path.join(districtsDir, `${pId}.json`);
    fs.writeFileSync(outFile, JSON.stringify(districtsByProvince[pId], null, 2));
  });
  console.log(`  - Created ${Object.keys(districtsByProvince).length} province files for districts.`);
} else {
  console.error('  - api/districts.json or api/regencies.json not found!');
}

console.log('Done.');
