# 🎨 Tengga - Web Dashboard

Ini adalah antarmuka pengguna (Frontend) untuk project **Tengga**. Aplikasi web ini bertugas membaca data tugas Kulino yang telah diekstrak oleh bot _scraper_, lalu menampilkannya dalam bentuk _dashboard_ yang estetik, modern, informatif, dan interaktif.

## 🛠️ Tech Stack

- **Framework:** React
- **Language:** TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4
- **Icons:** React Icons (Feather Icons)
- **Package Manager:** Bun

## ✨ Fitur Utama

- **Smart Dashboard Layout:** Tampilan terbagi menjadi area metrik cepat (kiri) dan _Timeline Sukses_ (kanan untuk desktop).
- **Auto-Categorization:** Tugas otomatis dipisah menjadi **Paling Mepet!** (≤ 7 Hari), **To Do** (> 7 Hari), dan **Riwayat Sukses** (Selesai).
- **Dynamic UI/UX:** Warna teks, titik indikator berkedip (_pulse_), dan warna tombol otomatis berubah sesuai tingkat urgensi tugas.
- **Real-Time Search:** Fitur pencarian instan untuk menyaring tugas berdasarkan nama.
- **Course Tagging:** Label Nama Mata Kuliah tersemat rapi di setiap _card_ dan modal tugas.
- **Interactive Modal:** Pop-up detail tugas bergaya _glassmorphism_ dengan tombol aksi langsung menuju Kulino.

## 💻 Cara Menjalankan Lokal

Karena ini adalah sisi _Frontend_, kita menggunakan **Bun** agar proses instalasi dan _hot-reload_ server berjalan secepat kilat.

1. Pastikan kamu berada di dalam direktori `web/`:

```bash
cd web
```

2. Install semua _dependencies_:

```bash
bun install
```

3. Jalankan _development server_:

```bash
bun run dev
```

4. Buka browser dan akses `http://localhost:5173`.

---

_Catatan: Web ini mengambil data secara otomatis dari file statis `src/data/data.json` yang digenerate secara berkala oleh backend scraper._
