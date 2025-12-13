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

## Deskripsi Website yang Akan Dibuat
Website PinterArt adalah platform berbasis web untuk menampilkan, membuat, dan mengelola karya seni digital oleh komunitas pengguna. Aplikasi ini fokus pada pengalaman sederhana: pengguna dapat melihat galeri karya, masuk/daftar akun, membuat karya baru, mengedit/menghapus karya miliknya, serta mengelola profil.

### Tujuan Utama
- Menyediakan galeri karya seni (publik) yang mudah dijelajahi.
- Memfasilitasi proses autentikasi pengguna (login/registrasi) secara sederhana.
- Memungkinkan pengguna membuat, mengedit, dan menghapus karya (CRUD) milik sendiri.
- Menyajikan profil pengguna dengan daftar karya terkait.

### Peran Pengguna (User Roles)
- **Pengunjung (Guest):** Dapat melihat beranda dan galeri (karya publik), namun tidak bisa membuat atau mengubah karya.
- **Pengguna Terautentikasi (User):** Setelah login, dapat membuat karya baru, mengedit/menghapus karya miliknya, serta mengelola profil.
- **Admin (opsional, future):** Memiliki kontrol moderasi, dapat menghapus karya yang melanggar ketentuan. Peran ini bisa ditambahkan kemudian jika diperlukan.

### Halaman & Navigasi Utama
- **Beranda (`PinterArtHome.jsx`):**
   - Menampilkan ringkasan platform dan highlight beberapa karya terbaru/populer.
   - Akses cepat ke galeri dan tombol untuk login/registrasi.
   - Termasuk fitur chat drawer sederhana (ikon chat di navbar) untuk pesan komunitas.
- **Dashboard (`PinterArtDashboard.jsx`):**
   - Tampilan ringkas aktivitas pengguna setelah login.
   - Menampilkan statistik dinamis (pendapatan, subscriber, views) dengan filter waktu Hari ini/7 Hari/30 Hari.
   - Tabel "Karya Terpopuler" diisi dari data `pins` di `ArtContext`.
- **Buat Karya (`PinterArtCreate.jsx`):**
   - Form untuk membuat karya baru: judul, deskripsi, kategori/tag, gambar/URL.
   - Validasi dasar dan umpan balik (success/error).
- **Profil (`PinterArtProfile.jsx`):**
   - Informasi pengguna: nama, avatar (opsional), bio singkat.
   - Daftar karya milik pengguna dengan aksi edit/hapus.
   - Edit profil inline (username, bio, avatar URL) tersinkron ke `AuthContext`.
- **Autentikasi (`PinterArtAuth.jsx`):**
   - Form login dan registrasi.
   - Terintegrasi dengan `AuthContext` untuk state dan aksi.
   - Mendukung "redirect back" ke halaman asal setelah login (via `location.state.from`).

Catatan: Jika routing digunakan, halaman-halamaan di atas akan dihubungkan via router (mis. `react-router-dom`). Jika belum, navigasi sederhana melalui kondisi di `App.jsx` tetap memungkinkan.

### Model Data (Sederhana)
- **User**
   - `id`: string/number
   - `name`: string
   - `email`: string
   - `avatarUrl`: string (opsional)
   - `bio`: string (opsional)
- **Art (Karya)**
   - `id`: string/number
   - `title`: string
   - `description`: string
   - `imageUrl`: string (atau file upload, disederhanakan menjadi URL)
   - `tags`: string[] (opsional)
   - `authorId`: mengacu ke `User.id`
   - `createdAt` / `updatedAt`: tanggal/waktu

Model data ini dikelola oleh `ArtContext` untuk operasi CRUD, dan `AuthContext` untuk informasi pengguna.

### Alur Fitur Inti
- **Lihat Galeri:**
   - Pengunjung membuka Beranda → melihat daftar karya publik dari `ArtContext`.
- **Registrasi & Login:**
   - Pengunjung membuka Autentikasi → submit form → `AuthContext.login/register` mengubah state user.
   - Setelah login, navigasi menuju Dashboard.
- **Buat Karya:**
   - Dari Dashboard/Profil → buka Buat Karya → isi form → panggil `ArtContext.create` → karya baru muncul di galeri dan profil.
- **Edit/Hapus Karya:**
   - Di Profil, pengguna memilih karya milik sendiri → `ArtContext.update/delete` untuk perubahan.

### Autentikasi & Otorisasi
- **State Auth:**
   - `AuthContext` menyimpan `user` (objek), `isAuthenticated` (boolean), dan fungsi `login`, `logout`, `register`.
   - Menyediakan `updateProfile(data)` untuk memperbarui `username`, `bio`, `avatarUrl` serta persist ke `localStorage`.
- **Proteksi Halaman:**
   - Halaman seperti Dashboard/Buat Karya/Profil memerlukan login. Jika belum login, alihkan ke Autentikasi dengan menyertakan `state.from` agar setelah login diarahkan kembali ke halaman asal.
- **Token/Session (Mock):**
   - Pada tahap awal, autentikasi dimock dengan state lokal, serta persist user ke `localStorage` agar profil tersimpan setelah reload. Di tahap lanjut, integrasi API dapat menambahkan token JWT.

### UI & Styling
- **Tailwind CSS:**
   - Gunakan utility classes untuk layout responsive, spacing, warna, dan tipografi.
   - Komponen mengikuti gaya konsisten: kartu karya, grid galeri, form yang jelas.
- **Aksesibilitas:**
   - Label form, aria-attributes dasar, kontras warna memadai.

### Integrasi API & Persistensi (Tahap Lanjut)
- **Mock Data (awal):**
   - Data karya dan pengguna disimpan di state Context (in-memory). User dipersist ke `localStorage`; metrik dashboard masih berbasis derivasi sederhana dari `pins`.
- **API Sungguhan:**
   - Di tahap lanjut, tambahkan layanan API (REST/GraphQL). `ArtContext`/`AuthContext` akan memanggil API untuk operasi CRUD dan auth.
- **Upload Gambar:**
   - Mulai dari URL gambar; nanti bisa ditambah upload ke storage (mis. Cloud Storage) dan menyimpan URL hasil unggahan.

### Kebutuhan Non-Fungsional
- **Kinerja:**
   - Vite untuk dev cepat, build produksi dioptimalkan.
- **Keandalan:**
   - Penanganan error di form dan operasi CRUD.
- **Keamanan (dasar):**
   - Validasi input, proteksi halaman, dan sanitasi deskripsi.
- **Skalabilitas:**
   - Pemisahan Context dan komponen agar mudah diperluas.

### Roadmap Pengembangan (Iteratif)
1. Rangka UI dasar dan navigasi antar halaman.
2. Implementasi `AuthContext` (mock) dan proteksi halaman.
3. Implementasi `ArtContext` dengan CRUD in-memory.
4. Styling konsisten dengan Tailwind; komponen kartu galeri.
5. Integrasi router (bila belum) dan deep-linking halaman.
6. Integrasi API backend (opsional tahap lanjut) untuk data nyata.
7. Fitur tambahan: pencarian/filter karya, like/favorite, komentar, dan peran admin.