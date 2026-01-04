# API Wilayah Indonesia Tahun 2026

[![Validate API JSON](https://github.com/izzulabadi/api-wilayah-indonesia-2026/actions/workflows/validate.yml/badge.svg)](https://github.com/izzulabadi/api-wilayah-indonesia-2026/actions/workflows/validate.yml)
[**Lihat Demo**](https://izzulabadi.github.io/api-wilayah-indonesia-2026/)

Data wilayah administrasi Indonesia (Provinsi, Kabupaten/Kota, Kecamatan, Desa/Kelurahan) dalam format JSON.

Repositori ini menyediakan data wilayah Indonesia yang mudah diakses secara langsung (static API) melalui GitHub Pages atau CDN (jsDelivr).

## Daftar Isi

- [Tentang](#tentang)
- [Struktur Data](#struktur-data)
- [Endpoints](#endpoints)
- [Cara Penggunaan](#cara-penggunaan)
- [Instalasi & Pengembangan](#instalasi--pengembangan)
- [Lisensi](#lisensi)

## Tentang

Proyek ini menggunakan data wilayah terbaru (2026) yang bersumber dari [izzulabadi/api-wilayah-indonesia-2026](https://github.com/izzulabadi/api-wilayah-indonesia-2026).

API ini dikemas dengan pendekatan **statis** (tanpa database/backend). Cukup hosting file JSON statis (misalnya di GitHub Pages) dan klien bisa langsung mengambil data yang dibutuhkan.

Kelebihan pendekatan ini:
- **Cepat & Murah**: Bisa di-hosting gratis di GitHub Pages, Vercel, atau Netlify.
- **CDN Ready**: Bisa diakses lewat jsDelivr untuk performa tinggi dan caching global.
- **Optimasi**: Data desa (villages) yang besar dipecah per-provinsi untuk mengurangi ukuran download.

## Struktur Data

Data disimpan dalam folder `api/` dengan format JSON Array.

### Provinsi (`provinces.json`)
```json
[
  {
    "id": "11",
    "name": "ACEH"
  },
  ...
]
```

### Kabupaten/Kota (`regencies.json`)
```json
[
  {
    "id": "1101",
    "provinceId": "11",
    "name": "KABUPATEN SIMEULUE"
  },
  ...
]
```

### Kecamatan (`districts.json`)
```json
[
  {
    "id": "1101010",
    "cityId": "1101",
    "name": "TEUPAH SELATAN"
  },
  ...
]
```

### Desa/Kelurahan (`villages.json` & `villages/{provinceId}.json`)
```json
[
  {
    "id": "1101010001",
    "districtId": "1101010",
    "name": "LATIUNG"
  },
  ...
]
```

## Endpoints

Anda dapat mengakses data langsung melalui URL berikut (ganti `<username>` dan `<repo>` sesuai repositori Anda, atau gunakan URL demo jika tersedia).

**Base URL (jsDelivr - Recommended):**
`https://cdn.jsdelivr.net/gh/izzulabadi/api-wilayah-indonesia-2026@v2.0.1/api`

> **Catatan:** ID yang digunakan dalam API ini adalah ID internal dataset, bukan kode BPS standar (misal: Aceh = 11). Silakan merujuk ke `provinces.json`, `regencies.json`, dst untuk mendapatkan ID yang benar.

| Deskripsi | Endpoint | Contoh URL (Jawa Barat) |
| --- | --- | --- |
| **Semua Provinsi** | `/provinces.json` | [Link](https://cdn.jsdelivr.net/gh/izzulabadi/api-wilayah-indonesia-2026@v2.0.1/api/provinces.json) |
| **Semua Kabupaten** | `/regencies.json` | [Link](https://cdn.jsdelivr.net/gh/izzulabadi/api-wilayah-indonesia-2026@v2.0.1/api/regencies.json) |
| **Kabupaten per Provinsi** | `/regencies/{provinceId}.json` | [Link](https://cdn.jsdelivr.net/gh/izzulabadi/api-wilayah-indonesia-2026@v2.0.1/api/regencies/1.json) |
| **Semua Kecamatan** | `/districts.json` | [Link](https://cdn.jsdelivr.net/gh/izzulabadi/api-wilayah-indonesia-2026@v2.0.1/api/districts.json) |
| **Kecamatan per Kabupaten** | `/districts/{regencyId}.json` | [Link](https://cdn.jsdelivr.net/gh/izzulabadi/api-wilayah-indonesia-2026@v2.0.1/api/districts/1.json) |
| **Semua Desa** (Besar!) | `/villages.json` | [Link](https://cdn.jsdelivr.net/gh/izzulabadi/api-wilayah-indonesia-2026@v2.0.1/api/villages.json) |
| **Desa per Kecamatan** | `/villages/{districtId}.json` | [Link](https://cdn.jsdelivr.net/gh/izzulabadi/api-wilayah-indonesia-2026@v2.0.1/api/villages/1.json) |

> **Catatan:** Sangat disarankan menggunakan endpoint granular (`/regencies/{provinceId}.json`, `/districts/{regencyId}.json`, `/villages/{districtId}.json`) untuk performa aplikasi yang maksimal.

## Cara Penggunaan

### Contoh Fetch (JavaScript)

Mengambil daftar provinsi:

```javascript
fetch('https://cdn.jsdelivr.net/gh/izzulabadi/api-wilayah-indonesia-2026@v2.0.1/api/provinces.json')
  .then(response => response.json())
  .then(provinces => console.log(provinces));
```

Mengambil daftar desa di provinsi Jawa Barat (ID: 32):

```javascript
fetch('https://cdn.jsdelivr.net/gh/izzulabadi/api-wilayah-indonesia-2026@v2.0.1/api/villages/1.json')
  .then(response => response.json())
  .then(villages => console.log(villages));
```

### Contoh Filter (Client-side)

Karena data berbentuk array statis, Anda bisa melakukan filter di sisi klien (browser).

```javascript
// Contoh: Cari kabupaten di provinsi Aceh (ID: 11)
const regencies = await fetch('/api/regencies.json').then(r => r.json());
const acehRegencies = regencies.filter(regency => regency.provinceId === '11');
console.log(acehRegencies);
```

## Instalasi & Pengembangan

Jika Anda ingin mengembangkan atau memodifikasi data ini secara lokal:

1. **Clone repositori**
   ```bash
   git clone https://github.com/izzulabadi/api-wilayah-indonesia-2026.git
   cd api-wilayah-indonesia-2026
   ```

2. **Install dependencies** (hanya butuh Node.js)
   ```bash
   # Tidak ada dependensi npm khusus, cukup Node.js bawaan
   node -v
   ```

3. **Update Data**
   - Edit file JSON di folder `api/` jika diperlukan.
   - Jika mengubah data desa, jalankan script split untuk memperbarui file per-provinsi:
     ```bash
     node scripts/split-villages.js
     ```

4. **Validasi & Build Manifest**
   - Jalankan script publish untuk memvalidasi file dan membuat `manifest.json`:
     ```bash
     node scripts/publish-api.js
     ```

5. **Commit & Push**
   ```bash
   git add .
   git commit -m "Update data wilayah"
   git push origin main
   ```

## Lisensi

Data wilayah ini bersumber dari [izzulabadi/api-wilayah-indonesia-2026](https://github.com/izzulabadi/api-wilayah-indonesia-2026). Silakan merujuk ke repositori tersebut untuk informasi lisensi data yang lebih spesifik.

Repositori ini (skrip dan dokumentasi) bersifat open source. Jika bermanfaat, jangan lupa berikan ⭐️!