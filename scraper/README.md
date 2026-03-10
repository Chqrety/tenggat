# 🕷️ Tengga - Deep Scraper Engine

Ini adalah mesin utama di balik Tengga. Script ini menggunakan **Playwright** untuk mensimulasikan browser Chrome, login ke Kulino, membaca kalender, dan mengekstrak detail tugas secara otomatis.

## 🛠️ Tech Stack

- **Runtime:** Node.js (via `ts-node`)
- **Language:** TypeScript (Strict Mode)
- **Automation:** Playwright

## ⚙️ Persiapan (Setup)

1. Pastikan **Node.js** sudah terinstall di komputermu.
2. Install semua _dependencies_ menggunakan npm:

```bash
npm install
```

3. Install engine browser Chromium untuk Playwright (wajib dijalankan pertama kali):

```bash
npx playwright install chromium
```

4. Buat file `.env` di dalam folder `scraper/` ini dan isi dengan kredensial akun Kulino kamu:

```env
KULINO_USER=NIM_KAMU
KULINO_PASS=PASSWORD_KAMU
```

## 🚀 Cara Menjalankan Bot

Untuk memulai proses _scraping_, jalankan perintah berikut di terminal (pastikan posisimu berada di dalam folder `scraper/`):

```bash
npm start
```

_(Catatan: Perintah di atas akan mengeksekusi script `npx ts-node index.ts` di belakang layar)._

## 🧠 Cara Kerja (Logic)

1. **Login & Navigasi:** Bot masuk ke Kulino dan menuju halaman Kalender.
2. **Dynamic Pagination & Course Extraction:** Bot mengekstrak tugas dari kalender bulan ini (termasuk mengklik setiap tugas untuk mengambil **Nama Mata Kuliah** yang bersih), lalu otomatis menekan tombol "Next Month" menembus layar _loading_ Moodle untuk mengambil data bulan berikutnya.
3. **History Checking (Smart Skip):** Bot membaca file riwayat di `../web/src/data/data.json`. Jika sebuah tugas sudah berstatus selesai (`"is_submitted": true`) di masa lalu, bot akan melewatinya secara otomatis untuk menghemat waktu dan memori eksekusi.
4. **Deep Scraping:** Bot mengunjungi halaman spesifik dari setiap tugas baru/belum selesai untuk mengekstrak deskripsi tugas, status pengumpulan tabel, dan rincian tanggal (_opened date / due date_).
5. **Direct JSON Export:** Menyimpan dan menggabungkan hasil akhir langsung ke file `../web/src/data/data.json` sehingga data bisa langsung dikonsumsi dan dirender oleh aplikasi web Frontend Tenggat.
