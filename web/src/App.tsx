import { useState, useEffect } from "react"
import data from "./data/data.json"
import {
  FiSearch,
  FiFilter,
  FiBriefcase,
  FiCheckSquare,
  FiClock,
  FiArrowRight,
  FiX,
  FiExternalLink,
} from "react-icons/fi"

// Mendefinisikan tipe data
interface Task {
  id: string | null
  title: string
  timestamp: number | null
  link: string | null
  description?: string
  status?: string
  is_submitted?: boolean
  opened_date?: string
  due_date?: string
}

// Komponen Card Kecil untuk di area "Project" (Desain Kiri)
const HighlightCard = ({ task, isUrgent, onClick }: { task: Task; isUrgent?: boolean; onClick: () => void }) => (
  <div
    className={`shrink-0 w-64 md:w-80 p-6 rounded-3xl cursor-pointer shadow-sm hover:shadow-md transition-all ${
      isUrgent ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"
    }`}
    onClick={onClick}
  >
    <div className="flex justify-between items-start mb-10">
      <div className={`p-3 rounded-xl ${isUrgent ? "bg-slate-800" : "bg-slate-100"}`}>
        <FiBriefcase className={`text-xl ${isUrgent ? "text-rose-400" : "text-slate-600"}`} />
      </div>
      <div className={`p-2 rounded-full ${isUrgent ? "bg-slate-800" : "bg-slate-100"}`}>
        <FiArrowRight className={`${isUrgent ? "text-slate-100" : "text-slate-900"}`} />
      </div>
    </div>
    <h3 className="font-bold text-lg mb-2 truncate">{task.title}</h3>
    <p className={`text-xs ${isUrgent ? "text-rose-300" : "text-slate-500"}`}>
      Due: {task.due_date || "Tidak diketahui"}
    </p>
  </div>
)

// Komponen List Item untuk area "Tasks" (Desain Kiri & Kanan)
const TaskListItem = ({ task, onClick }: { task: Task; onClick: () => void }) => (
  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
    <div
      className={`p-4 rounded-xl cursor-pointer ${
        task.is_submitted ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
      }`}
      onClick={onClick}
    >
      <FiCheckSquare className="text-xl" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-sm text-slate-900 truncate">{task.title}</h4>
      <p className="text-xs text-slate-500 truncate">{task.due_date || "N/A"}</p>
    </div>
    <div className={`w-3 h-3 rounded-full ${task.is_submitted ? "bg-emerald-400" : "bg-slate-300"}`}></div>
  </div>
)

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const tasks: Task[] = data as Task[]

  // Update Jam setiap detik (Fitur Info Tambahan)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Format Tanggal dan Jam (WIB)
  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const formattedTime =
    currentTime.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " WIB"

  // Logika Waktu (7 Hari untuk Urgent)
  const nowMs = Date.now()
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

  const doneTasks = tasks.filter(t => t.is_submitted)
  const pendingTasks = tasks.filter(t => !t.is_submitted)

  // Urgent (Deadline <= 7 hari)
  const urgentTasks = pendingTasks.filter(t => t.timestamp && t.timestamp - nowMs <= SEVEN_DAYS_MS)
  // To Do (Deadline > 7 hari)
  const todoTasks = pendingTasks.filter(t => !t.timestamp || t.timestamp - nowMs > SEVEN_DAYS_MS)

  // Statistik untuk Grafik Sederhana (Fitur Grafis)
  const total = tasks.length
  const percentDone = total > 0 ? (doneTasks.length / total) * 100 : 0
  const percentUrgent = total > 0 ? (urgentTasks.length / total) * 100 : 0

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-24 md:pb-10">
      {/* 💻 Wrapper Desktop (Flexbox biar responsif di layar gede) */}
      <div className="md:flex md:gap-10 md:max-w-7xl md:mx-auto md:p-10">
        {/* 📱 AREA KIRI (Dashboard Utama / Mobile View) */}
        <div className="flex-1 p-6 md:p-0">
          {/* Header (Greeting + Info Jam/Tanggal) */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-slate-500 text-sm">Hey, Mahasiswa Dinus! ✨</p>
              <h1 className="text-3xl font-extrabold text-slate-950 mt-1">Mari Cek Tenggat!</h1>
              {/* Fitur Info: Tanggal & Jam */}
              <div className="flex flex-col text-xs text-slate-400 mt-2">
                <p>{formattedDate}</p>
                <p className="font-mono">{formattedTime}</p>
              </div>
            </div>
            {/* Profile Placeholder (Gambar Asli Referensi Kanan) */}
            <div className="w-14 h-14 rounded-full bg-slate-300 border-4 border-white shadow-sm overflow-hidden">
              <img
                src="https://kulino.dinus.ac.id/theme/image.php/lambda/core/1658822515/u/f1"
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Search Bar (Desain Kiri) */}
          <div className="relative mb-8 flex items-center gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari tugas, kuis..."
                className="w-full bg-white text-sm p-4 pl-12 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <button className="bg-slate-900 text-slate-100 p-4 rounded-2xl shadow-lg">
              <FiFilter />
            </button>
          </div>

          {/* Fitur Grafis: Statistik Sederhana */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-sm text-center border border-slate-200">
              <p className="text-3xl font-extrabold text-slate-950">{total}</p>
              <p className="text-xs text-slate-500 mt-1">Total</p>
            </div>
            <div className="bg-emerald-950 p-4 rounded-2xl shadow-sm text-center">
              <p className="text-3xl font-extrabold text-emerald-400">{doneTasks.length}</p>
              <p className="text-xs text-emerald-300 mt-1">Selesai</p>
            </div>
            <div className="bg-rose-950 p-4 rounded-2xl shadow-sm text-center relative overflow-hidden">
              <p className="text-3xl font-extrabold text-rose-400 relative z-10">{urgentTasks.length}</p>
              <p className="text-xs text-rose-300 mt-1 relative z-10">Urgent</p>
              {/* Grafik Garis Sederhana Mepet Deadline (dummy visual) */}
              <div className="absolute -bottom-2 -left-2 w-full h-8 opacity-20">
                <svg
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  className="w-full h-full text-rose-400 fill-current"
                >
                  <path d="M0 20 L20 15 L40 18 L60 10 L80 14 L100 5 L100 20 Z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Seksi "Tugas Urgent" (Scrolling Card Sederhana biar Rame) */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">Paling Mepet!</h2>
              <span className="text-sm text-emerald-600 font-semibold cursor-pointer">Lihat Semua</span>
            </div>
            {/* Horizontal Scroll (Desain Tengah/Project) */}
            <div className="flex gap-6 overflow-x-auto custom-scrollbar pb-4 -mx-6 px-6">
              {urgentTasks.length > 0 ? (
                urgentTasks.map((t, i) => (
                  <HighlightCard key={t.id || i} task={t} isUrgent={true} onClick={() => setSelectedTask(t)} />
                ))
              ) : (
                <div className="shrink-0 w-64 md:w-80 p-6 rounded-3xl bg-white text-center text-slate-500 text-sm italic border border-slate-200">
                  <FiClock className="text-3xl mx-auto mb-2 opacity-50" />
                  Aman bos! Nggak ada tugas mepet deadline dalam 7 hari ini.
                </div>
              )}
            </div>
          </div>

          {/* Seksi "Tasks" (List Tugas Belum Selesai Lainnya) */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">Tugas To Do</h2>
            </div>
            <div className="space-y-4">
              {todoTasks.length > 0 ? (
                todoTasks.map((t, i) => <TaskListItem key={t.id || i} task={t} onClick={() => setSelectedTask(t)} />)
              ) : (
                <p className="text-slate-500 text-sm italic text-center py-6 bg-white rounded-2xl border border-slate-200">
                  Yeay, tugas To Do kosong!
                </p>
              )}
            </div>
          </div>

          {/* Seksi "Selesai" (List Tugas Sudah Submit) */}
          <div className="mb-8 md:hidden">
            {/* Di desktop disembunyikan karena dipindah ke kanan */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-emerald-700 flex items-center gap-2">Riwayat Sukses</h2>
            </div>
            <div className="space-y-4 opacity-70">
              {doneTasks.length > 0 ? (
                doneTasks.map((t, i) => <TaskListItem key={t.id || i} task={t} onClick={() => setSelectedTask(t)} />)
              ) : (
                <p className="text-slate-500 text-sm italic text-center py-6 bg-white rounded-2xl border border-slate-200">
                  Belum ada tugas yang disubmit.
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Selesai Area Kiri */}
        {/* 💻 AREA KANAN (Hanya muncul di Desktop / Timeline View) */}
        <div className="hidden md:flex flex-col flex-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-slate-950">Timeline Sukses</h2>
            <div className="text-emerald-500 text-2xl p-4 bg-emerald-50 rounded-2xl shadow-inner font-extrabold font-mono">
              {formattedDate.split(" ")[0]}
            </div>
          </div>

          {/* Area Statistik Persentase (Konsep Versus / Kiri-Kanan) */}
          <div className="mb-8 pb-8 border-b border-slate-100">
            <div className="flex items-center justify-between gap-2">
              {/* Kiri: Kelar (Kubu Hijau) */}
              <div className="flex-1 text-left">
                <p className="text-slate-400 font-medium text-sm mb-1">Kelar</p>
                <div className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">
                  {percentDone.toFixed(0)}%
                </div>
              </div>

              {/* Tengah: Divider Estetik (Kesan Versus) */}
              <div className="flex flex-col items-center justify-center px-4">
                <div className="h-6 w-0.5g-slate-100 rounded-full"></div>

                <div className="h-6 w-0.5 bg-slate-100 rounded-full"></div>
              </div>

              {/* Kanan: Urgent (Kubu Merah) */}
              <div className="flex-1 text-right">
                <p className="text-slate-400 font-medium text-sm mb-1">Mepet</p>
                <div className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-l from-rose-400 to-orange-400">
                  {percentUrgent.toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Visual Bar "Tarik Tambang" */}
            <div className="mt-6 w-full h-3 bg-slate-100 rounded-full flex overflow-hidden shadow-inner">
              {/* Bar Hijau ngisi dari kiri */}
              <div
                style={{ width: `${percentDone}%` }}
                className="h-full bg-linear-to-r rom-emerald-400 to-cyan-400 transition-all duration-500"
              ></div>
              {/* Ruang kosong / sisa tugas biasa */}
              <div className="flex-1 bg-transparent"></div>
              {/* Bar Merah ngisi dari kanan */}
              <div
                style={{ width: `${percentUrgent}%` }}
                className="h-full bg-linear-to-l from-rose-400 to-orange-400 transition-all duration-500"
              ></div>
            </div>
          </div>

          <h3 className="font-bold text-lg text-slate-700 mb-6 flex items-center gap-2">
            Tugas yang Sudah Dikumpulkan
          </h3>
          <div className="space-y-4">
            {doneTasks.length > 0 ? (
              doneTasks.map((t, i) => <TaskListItem key={t.id || i} task={t} onClick={() => setSelectedTask(t)} />)
            ) : (
              <p className="text-slate-500 text-sm italic text-center py-10">Belum ada tugas yang diselesaikan.</p>
            )}
          </div>

          {/* Dummy Bottom Spacer (biar bisa scroll) */}
          <div className="h-20"></div>
        </div>
      </div>
      {/* Selesai Wrapper Desktop */}
      {/* ✨ OVERLAY MODAL DETAIL TUGAS ✨ */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedTask(null)} // Tutup modal kalau klik background blur
        >
          <div
            className="bg-white rounded-4xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()} // Biar klik di dalam card nggak nutup modal
          >
            {/* Modal Header */}
            <div
              className={`p-6 text-white flex justify-between items-start ${selectedTask.is_submitted ? "bg-emerald-500" : "bg-slate-900"}`}
            >
              <div>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                  {selectedTask.status || "Status Unknown"}
                </span>
                <h2 className="text-xl font-bold mt-4 leading-tight">{selectedTask.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Body (Bisa di-scroll) */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold mb-1">DIBUKA</p>
                  <p className="text-sm font-medium text-slate-700">{selectedTask.opened_date || "-"}</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                  <p className="text-xs text-rose-400 font-semibold mb-1">TENGGAT WAKTU</p>
                  <p className="text-sm font-bold text-rose-700">{selectedTask.due_date || "-"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold mb-2 uppercase">Deskripsi Tugas</p>
                {/* whitespace-pre-wrap bikin \n dari JSON berubah jadi enter/baris baru */}
                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {selectedTask.description || "Tidak ada deskripsi."}
                </p>
              </div>
            </div>

            {/* Modal Footer (Tombol Aksi) */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => selectedTask.link && window.open(selectedTask.link, "_blank")}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex justify-center items-center gap-2"
              >
                Kerjakan di Kulino <FiExternalLink />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
