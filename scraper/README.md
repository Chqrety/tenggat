# 🕷️ Tenggat - Deep Scraper Engine

Ini adalah mesin utama di balik Tenggat. Script ini menggunakan **Playwright** untuk mensimulasikan browser Chrome, login ke Kulino, membaca kalender, dan mengekstrak detail tugas secara otomatis.

## 🛠️ Tech Stack

- **Runtime:** Node.js (via `ts-node`)
- **Language:** TypeScript (Strict Mode)
- **Automation:** Playwright

## ⚙️ Persiapan (Setup)

1. Pastikan Node.js sudah terinstall.
2. Install semua _dependencies_:

   ```bash
   bun install
   # atau npm install
   ```

3. Install browser untuk Playwright (jika belum):

   ```bash
   npx playwright install chromium
   ```

4. Buat file `.env` di dalam folder ini dan isi dengan kredensial Kulino kamu:

   ```env
   KULINO_USER=NIM_KAMU
   KULINO_PASS=PASSWORD_KAMU
   ```

## 🚀 Cara Menjalankan Bot

Untuk memulai proses scraping, jalankan perintah berikut di terminal:

```bash
npx ts-node index.ts
```

## 🧠 Cara Kerja (Logic)

1. **Login & Navigasi:** Masuk ke Kulino dan menuju halaman Kalender bulan ini.
2. **Dynamic Pagination:** Mengambil tugas dari bulan ini, lalu otomatis menekan tombol "Next Month" untuk mengambil bulan berikutnya (maksimal 5 bulan ke depan atau hingga target 20 tugas tercapai).
3. **History Checking (Smart Skip):** Membaca file `data.json` lama. Jika sebuah tugas sudah berstatus `"is_submitted": true` di masa lalu, bot akan melewatinya untuk menghemat waktu eksekusi.
4. **Deep Scraping:** Mengunjungi link setiap tugas yang belum selesai untuk mengekstrak deskripsi dan tanggal pasti (_opened/due date_).
5. **JSON Export:** Menyimpan hasil akhir ke file `data.json` yang akan dikonsumsi oleh Frontend.
