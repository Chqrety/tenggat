import { chromium } from 'playwright'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config()

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

;(async () => {
  console.log('🚀 Tenggat Dynamic Scraper (History & Pagination) dimulai...')

  // --- 1. BACA DATA LAMA (HISTORY) ---
  let existingTasks: Task[] = []
  const dataFile = 'data.json'

  if (fs.existsSync(dataFile)) {
    try {
      const rawData = fs.readFileSync(dataFile, 'utf-8')
      existingTasks = JSON.parse(rawData)
      console.log(`📁 Menemukan ${existingTasks.length} tugas lama di database.`)
    } catch (err) {
      console.log('⚠️ Gagal membaca data.json lama, membuat ulang...')
    }
  }

  const taskHistoryMap = new Map<string, Task>()
  existingTasks.forEach((task) => {
    if (task.id) taskHistoryMap.set(task.id, task)
  })

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  })
  const page = await browser.newPage()

  try {
    console.log('🌐 Membuka halaman login...')
    await page.goto('https://kulino.dinus.ac.id/login/index.php')
    await page.fill('#username', process.env.KULINO_USER || '')
    await page.fill('#password', process.env.KULINO_PASS || '')
    await page.click('#loginbtn')

    console.log('📅 Pindah ke Kalender...')
    await page.waitForTimeout(2000)
    await page.goto('https://kulino.dinus.ac.id/calendar/view.php?view=month', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.calendartable', { timeout: 15000 })

    // --- 2. AMBIL LIST TUGAS DENGAN DYNAMIC PAGINATION ---
    let currentTasks: Task[] = []
    let monthsScraped = 0
    const MIN_MONTHS = 2 // Minimal ambil 2 bulan
    const MAX_MONTHS = 5 // Maksimal ambil 5 bulan (sampai sekitar bulan Juli)
    const TARGET_TASKS = 20 // Target standar jumlah tugas

    while (monthsScraped < MAX_MONTHS) {
      console.log(`\n🔍 Scraping Kalender Bulan ke-${monthsScraped + 1}...`)

      // Ambil data di bulan yang sedang tampil
      let monthTasks: Task[] = await page.$$eval('td.day', (dayCells: Element[]) => {
        const results: Task[] = []
        for (const cell of dayCells) {
          const events = cell.querySelectorAll('a[data-action="view-event"]')
          if (events.length > 0) {
            const rawTimestamp = cell.getAttribute('data-day-timestamp')
            const timestampMs = rawTimestamp ? parseInt(rawTimestamp) * 1000 : null

            events.forEach((el: Element) => {
              const rawTitle = el.getAttribute('title') || ''
              const cleanTitle = rawTitle.replace(' is due', '').replace(' opens', '').trim()
              results.push({
                id: el.getAttribute('data-event-id'),
                title: cleanTitle,
                timestamp: timestampMs,
                link: el.getAttribute('href'),
              })
            })
          }
        }
        return results
      })

      // Masukkan ke array utama (pastikan tidak ada duplikat)
      monthTasks.forEach((newTask) => {
        const isDuplicate = currentTasks.some((existing) => existing.id === newTask.id)
        if (!isDuplicate) currentTasks.push(newTask)
      })

      monthsScraped++
      console.log(`📊 Terkumpul sementara: ${currentTasks.length} tugas unik.`)

      // CEK KONDISI BERHENTI (Algoritma Limit)
      if (monthsScraped >= MIN_MONTHS && currentTasks.length >= TARGET_TASKS) {
        console.log(
          `✅ Sudah melewati ${MIN_MONTHS} bulan dan mencapai limit (${currentTasks.length} >= ${TARGET_TASKS} tugas). Stop pindah bulan.`,
        )
        break
      } else if (monthsScraped >= MIN_MONTHS && currentTasks.length < TARGET_TASKS) {
        console.log(`⚠️ Baru ${currentTasks.length} tugas. Masih di bawah ${TARGET_TASKS}. Lanjut ke bulan berikutnya!`)
      }

      // PINDAH KE BULAN BERIKUTNYA
      if (monthsScraped < MAX_MONTHS) {
        const nextButton = await page.$('.arrow_link.next')
        if (nextButton) {
          await nextButton.click()
          console.log('⏳ Menunggu kalender bulan berikutnya dimuat...')
          await page.waitForTimeout(3000) // Tunggu loading Moodle via AJAX
        } else {
          console.log('⛔ Tombol Next Month tidak ditemukan. Berhenti di sini.')
          break
        }
      }
    }

    console.log(`\n✅ Total Kalender Selesai. Siap inspeksi detail ${currentTasks.length} tugas...`)

    // --- 3. DEEP SCRAPING DENGAN LOGIKA SKIP ---
    for (let i = 0; i < currentTasks.length; i++) {
      const task = currentTasks[i]
      if (!task || !task.id || !task.link) continue

      const oldTask = taskHistoryMap.get(task.id)

      // HISTORY TETAP AMAN: Kalau sudah submit sebelumnya, skip buka halamannya
      if (oldTask && oldTask.is_submitted) {
        console.log(`⏩ [${i + 1}/${currentTasks.length}] SKIP: ${task.title} (Sudah dikumpulkan sebelumnya)`)
        currentTasks[i] = oldTask as Task
        taskHistoryMap.delete(task.id)
        continue
      }

      console.log(`➡️ [${i + 1}/${currentTasks.length}] SCRAPE: ${task.title}`)

      try {
        await page.goto(task.link, { waitUntil: 'domcontentloaded' })

        const detail = await page.evaluate(() => {
          let descText = document.querySelector('#intro .no-overflow')?.textContent?.trim() || 'Tidak ada deskripsi'
          let statusText = 'Belum dikerjakan'
          let isSubmitted = false
          let openedDate = ''
          let dueDate = ''

          const dateDivs = document.querySelectorAll('[data-region="activity-dates"] > div')
          dateDivs.forEach((div: Element) => {
            const text = div.textContent?.trim() || ''
            if (text.includes('Opened:')) openedDate = text.replace('Opened:', '').trim()
            else if (text.includes('Due:')) dueDate = text.replace('Due:', '').trim()
            else if (text.includes('Closes:')) dueDate = text.replace('Closes:', '').trim()
          })

          const tableRows = document.querySelectorAll('.submissionstatustable table.generaltable tbody tr')
          if (tableRows.length > 0) {
            tableRows.forEach((row: Element) => {
              const th = row.querySelector('th')?.textContent?.trim() || ''
              const td = row.querySelector('td')?.textContent?.trim() || ''
              if (th.includes('Submission status') || th.includes('Status pengajuan')) {
                statusText = td
                if (td.toLowerCase().includes('submitted') || td.toLowerCase().includes('dikumpulkan')) {
                  isSubmitted = true
                }
              }
            })
          } else {
            const quizAttemptBtn = document.querySelector('form[action*="startattempt.php"] button')
            if (quizAttemptBtn) {
              statusText = 'Kuis belum dikerjakan'
              isSubmitted = false
            } else {
              const uploadForm = document.querySelector('.editsubmissionform')
              if (uploadForm) {
                statusText = 'Belum submit file'
                isSubmitted = false
              }
            }
          }

          return { descText, statusText, isSubmitted, openedDate, dueDate }
        })

        task.description = detail.descText
        task.status = detail.statusText
        task.is_submitted = detail.isSubmitted
        task.opened_date = detail.openedDate
        task.due_date = detail.dueDate

        taskHistoryMap.delete(task.id)
        await page.waitForTimeout(1000)
      } catch (err) {
        console.log(`⚠️ Gagal membaca detail untuk: ${task.title}`)
        if (oldTask) {
          currentTasks[i] = oldTask as Task
        } else {
          task.status = 'Gagal mengambil data'
        }
      }
    }

    // --- 4. GABUNGKAN DATA BARU & HISTORY LAMA ---
    const finalTasks = [...currentTasks, ...Array.from(taskHistoryMap.values())]

    console.log('\n🎉 Proses Scraping & Merging Selesai!')
    fs.writeFileSync(dataFile, JSON.stringify(finalTasks, null, 2))
    console.log(`📁 Berhasil menyimpan total ${finalTasks.length} tugas (Baru + History) ke data.json`)
  } catch (error) {
    console.error('❌ Error Total:', error)
  } finally {
    await browser.close()
  }
})()
