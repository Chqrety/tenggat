# 🎯 Tenggat (Kulino Auto-Scraper & Task Manager)

Tenggat adalah asisten pribadi berbasis otomatisasi untuk mengekstrak, melacak, dan mengelola tugas-tugas kuliah dari portal Moodle/Kulino secara otomatis.

Daripada mengecek kalender Kulino setiap hari secara manual, Tenggat akan melakukan _deep scraping_ menggunakan Playwright dan menyajikan tenggat waktu (deadline) tugas dalam bentuk _dashboard_ web yang rapi.

## ✨ Fitur Utama

- **🤖 Automated Deep Scraping:** Mengambil data tugas dari kalender Moodle secara dinamis.
- **🧠 Smart Pagination & History:** Bot cerdas yang hanya mengambil data baru dan mengingat tugas yang sudah disubmit.
- **⚡ 100% Type-Safe:** Dibangun menggunakan TypeScript yang ketat.
- **🎨 Modern Web UI:** (Segera Hadir) Menampilkan jadwal tugas dengan React/Vite.
- **☁️ Cloud Automation:** (Segera Hadir) Berjalan otomatis setiap tengah malam via GitHub Actions.

## 📂 Struktur Project

Project ini menggunakan konsep _monorepo_ yang memisahkan antara mesin pengambil data (Scraper) dan antarmuka pengguna (Web).

- [`/scraper`](./scraper) - Script backend/bot menggunakan Node.js, TypeScript, dan Playwright.
- [`/web`](./web) - Frontend dashboard menggunakan React.js _(Work in Progress)_.

## 🚀 Cara Menjalankan

Karena project ini terbagi dua, silakan masuk ke masing-masing folder untuk melihat instruksi teknisnya:

1. **Menjalankan Bot:** Baca [Scraper README](./scraper/README.md)
2. **Menjalankan UI:** Baca Web README _(Coming Soon)_

---

_Dibuat untuk mengalahkan kemalasan mengecek tugas Kulino._ 🚀
