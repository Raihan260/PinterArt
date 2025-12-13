# Struktur Proyek PinterArt (Vite + React + Tailwind)

Dokumen ini menjelaskan susunan folder dan peran tiap berkas di proyek agar mudah dipahami dan dikembangkan bersama.

## Ringkasan Teknologi
- Vite: bundler dan dev server cepat.
- React: library UI berbasis komponen.
- Tailwind CSS: utility-first CSS.
- Context API: state global untuk Auth dan Art.

## Struktur Folder Utama
```
root/
├─ index.html              # HTML utama untuk Vite
├─ package.json            # Dependensi, script, metadata proyek
├─ vite.config.js          # Konfigurasi Vite
├─ tailwind.config.js      # Konfigurasi Tailwind
├─ postcss.config.js       # Konfigurasi PostCSS (Tailwind)
├─ jsconfig.json           # Path alias/JS tooling (opsional)
├─ public/                 # Asset statis (di-serve apa adanya)
│  └─ images/              # Gambar publik
└─ src/                    # Kode sumber aplikasi
   ├─ main.jsx             # Entry React (mount ke DOM)
   ├─ App.jsx              # Root komponen aplikasi (routing/layout)
   ├─ index.css            # Impor Tailwind & gaya global
   ├─ components/          # Komponen halaman & UI
   │  ├─ PinterArtHome.jsx
   │  ├─ PinterArtDashboard.jsx
   │  ├─ PinterArtCreate.jsx
   │  ├─ PinterArtProfile.jsx
   │  └─ PinterArtAuth.jsx
   └─ context/             # React Context (state global)
      ├─ AuthContext.jsx   # Login, user, otorisasi
      └─ ArtContext.jsx    # Data karya, operasi CRUD
```

## Peran Berkas Kunci
- `index.html`: Template HTML Vite; root `<div id="root">` untuk render React.
- `src/main.jsx`: Inisialisasi React dan render `<App />` ke `#root`. Biasanya juga memasang provider Context.
- `src/App.jsx`: Komponen root; mengatur layout dan navigasi (router jika digunakan).
- `src/index.css`: Memuat direktif Tailwind (`@tailwind base; @tailwind components; @tailwind utilities;`) dan gaya global.
- `src/components/*`: Satu file per halaman/fitur.
  - `PinterArtHome.jsx`: Beranda, menampilkan konten utama/landing.
  - `PinterArtDashboard.jsx`: Ringkasan aktivitas/user atau admin.
  - `PinterArtCreate.jsx`: Form/mekanisme membuat karya baru.
  - `PinterArtProfile.jsx`: Profil pengguna dan karya terkait.
  - `PinterArtAuth.jsx`: Form login/register; memakai `AuthContext`.
- `src/context/AuthContext.jsx`: Menyimpan informasi autentikasi (user, token, status login) dan fungsi `login`, `logout`, dll. Diekspos via `AuthProvider` dan hook/helper.
- `src/context/ArtContext.jsx`: Menyimpan daftar karya (arts) dan operasi (fetch, create, update, delete). Diekspos via `ArtProvider`.

## Alur Data & Komunikasi
- Provider Context dibungkus di level atas (umumnya di `main.jsx` atau `App.jsx`).
- Komponen di `components/` mengakses state/fungsi dari Context melalui `useContext(AuthContext)` atau `useContext(ArtContext)`.
- Tailwind dipakai di komponen melalui class utility (mis. `className="p-4 bg-gray-100"`).
- Asset di `public/images` dapat diakses langsung via path `/images/...`.

## Skrip Penting (package.json)
Contoh umum (cek berkas aktual):
- `dev`: Menjalankan server pengembangan Vite.
- `build`: Membangun aset produksi.
- `preview`: Menjalankan preview build.

## Cara Menjalankan
1. Instal dependensi:
   ```powershell
   npm install
   ```
2. Jalankan pengembangan (hot reload):
   ```powershell
   npm run dev
   ```
3. Build produksi:
   ```powershell
   npm run build
   ```
4. Preview hasil build:
   ```powershell
   npm run preview
   ```

## Tips Kolaborasi
- Tambahkan komponen baru di `src/components/` dan impor di `App.jsx` (atau router) sesuai kebutuhan.
- Jika butuh state global baru, buat Context di `src/context/` dan bungkus `App` dengan providernya.
- Gunakan Tailwind untuk konsistensi styling.
- Simpan gambar publik di `public/images/`.

Jika butuh detail lebih lanjut (mis. contoh penggunaan Context atau struktur router), beri tahu agar saya tambahkan contoh kode singkat.