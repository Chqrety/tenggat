import { FiBriefcase, FiArrowRight, FiCheckSquare, FiClock } from "react-icons/fi"
import { Task } from "../types"

// Komponen Card Kecil untuk di area "Project"
export const HighlightCard = ({ task, isUrgent, onClick }: { task: Task; isUrgent?: boolean; onClick: () => void }) => (
  <div
    // Tambahan: relative overflow-hidden wajib ada biar watermark nggak bocor
    className={`relative overflow-hidden group shrink-0 w-64 md:w-80 p-6 rounded-3xl cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${
      isUrgent ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900 border border-slate-100"
    }`}
    onClick={onClick}
  >
    {/* ✨ WATERMARK ICON BESAR DI KIRI BAWAH ✨ */}
    {isUrgent ? (
      <FiClock className="absolute -left-6 -bottom-6 text-[8rem] opacity-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none" />
    ) : (
      <FiBriefcase className="absolute -left-6 -bottom-6 text-[8rem] opacity-[0.03] text-slate-900 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 pointer-events-none" />
    )}

    {/* Konten Utama (z-10 biar di atas watermark) */}
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-xl transition-colors duration-300 ${isUrgent ? "bg-slate-800 group-hover:bg-rose-500/20" : "bg-slate-100 group-hover:bg-slate-200"}`}
        >
          <FiBriefcase
            className={`text-xl transition-colors duration-300 ${isUrgent ? "text-rose-400 group-hover:text-rose-300" : "text-slate-600"}`}
          />
        </div>
        <div
          className={`p-2 rounded-full transition-colors duration-300 ${isUrgent ? "bg-slate-800 group-hover:bg-slate-700" : "bg-slate-100 group-hover:bg-slate-200"}`}
        >
          <FiArrowRight
            className={`transition-transform duration-300 group-hover:translate-x-1 ${isUrgent ? "text-slate-100" : "text-slate-900"}`}
          />
        </div>
      </div>

      {/* Teks di-push ke kanan (text-right items-end) */}
      <div className="flex flex-col items-end text-right mt-4">
        <h3 className="font-bold text-lg mb-1 truncate w-full">{task.title}</h3>
        <p className={`text-xs font-medium ${isUrgent ? "text-rose-300" : "text-slate-500"}`}>
          Due: {task.due_date?.split(",")[0] || "Tidak diketahui"}
        </p>
      </div>
    </div>
  </div>
)

// Komponen List Item untuk area "Tasks"
export const TaskListItem = ({ task, onClick }: { task: Task; onClick: () => void }) => (
  <div
    // Tambahan: relative overflow-hidden
    className="relative overflow-hidden group flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer border border-transparent hover:border-slate-100"
    onClick={onClick}
  >
    {/* ✨ WATERMARK ICON DI LIST ✨ */}
    <FiCheckSquare
      className={`absolute -left-3 -bottom-4 text-6xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 pointer-events-none ${
        task.is_submitted ? "text-emerald-500 opacity-10" : "text-slate-900 opacity-[0.03]"
      }`}
    />

    {/* Konten Utama */}
    <div className="relative z-10 flex items-center gap-4 w-full">
      <div
        className={`p-4 rounded-xl transition-colors duration-300 ${
          task.is_submitted
            ? "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200"
            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
        }`}
      >
        <FiCheckSquare className="text-xl" />
      </div>

      {/* Teks di-push agak ke kanan dengan padding-right & text-right */}
      <div className="flex-1 min-w-0 flex flex-col items-end text-right pr-2">
        <h4
          className={`font-semibold text-sm truncate w-full transition-colors duration-300 ${
            task.is_submitted
              ? "text-emerald-600" // Warna Sukses
              : task.timestamp && task.timestamp - Date.now() <= 7 * 24 * 60 * 60 * 1000
                ? "text-rose-600 group-hover:text-rose-500" // Warna Urgent
                : "text-slate-900 group-hover:text-slate-500" // Warna Biasa
          }`}
        >
          {task.title}
        </h4>
        <p
          className={`text-xs truncate w-full ${
            task.is_submitted
              ? "text-emerald-400"
              : task.timestamp && task.timestamp - Date.now() <= 7 * 24 * 60 * 60 * 1000
                ? "text-rose-400"
                : "text-slate-500"
          }`}
        >
          {task.due_date || "N/A"}
        </p>
      </div>

      <div
        className={`w-3 h-3 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-125 ${task.is_submitted ? "bg-emerald-400" : "bg-slate-300"}`}
      ></div>
    </div>
  </div>
)
