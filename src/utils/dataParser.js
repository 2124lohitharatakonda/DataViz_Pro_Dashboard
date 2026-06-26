import * as XLSX from 'xlsx'
import Papa from 'papaparse'

export function parseFile(file) {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop().toLowerCase()
    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: reject,
      })
    } else if (['xlsx', 'xls'].includes(ext)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' })
        resolve(data)
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    } else {
      reject(new Error('Unsupported file type. Please upload CSV or Excel.'))
    }
  })
}

export function analyzeData(data) {
  if (!data || data.length === 0) return null
  const columns = Object.keys(data[0])
  const numericCols = []
  const categoricalCols = []
  const dateCols = []

  columns.forEach((col) => {
    const values = data.map((r) => r[col]).filter((v) => v !== '' && v != null)
    const numericCount = values.filter((v) => !isNaN(Number(v)) && v !== '').length
    const dateCount = values.filter((v) => !isNaN(Date.parse(v)) && isNaN(Number(v))).length

    if (numericCount / values.length > 0.7) {
      numericCols.push(col)
    } else if (dateCount / values.length > 0.5) {
      dateCols.push(col)
    } else {
      categoricalCols.push(col)
    }
  })

  return { columns, numericCols, categoricalCols, dateCols, rowCount: data.length }
}

export function getKPIs(data, numericCols) {
  return numericCols.slice(0, 6).map((col) => {
    const values = data
      .map((r) => Number(r[col]))
      .filter((v) => !isNaN(v))
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const max = Math.max(...values)
    const min = Math.min(...values)
    return { col, sum, avg, max, min, count: values.length }
  })
}

export function getBarData(data, categoricalCol, numericCol, limit = 10) {
  const grouped = {}
  data.forEach((row) => {
    const key = row[categoricalCol] || 'Unknown'
    const val = Number(row[numericCol]) || 0
    grouped[key] = (grouped[key] || 0) + val
  })
  return Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name: String(name).slice(0, 20), value: parseFloat(value.toFixed(2)) }))
}

export function getPieData(data, categoricalCol, limit = 8) {
  const grouped = {}
  data.forEach((row) => {
    const key = row[categoricalCol] || 'Unknown'
    grouped[key] = (grouped[key] || 0) + 1
  })
  return Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name: String(name).slice(0, 20), value }))
}

export function getLineData(data, numericCols, limit = 30) {
  return data.slice(0, limit).map((row, i) => {
    const entry = { index: i + 1 }
    numericCols.slice(0, 3).forEach((col) => {
      entry[col] = parseFloat(Number(row[col]).toFixed(2)) || 0
    })
    return entry
  })
}

export function getScatterData(data, xCol, yCol, limit = 100) {
  return data.slice(0, limit).map((row) => ({
    x: parseFloat(Number(row[xCol]).toFixed(2)) || 0,
    y: parseFloat(Number(row[yCol]).toFixed(2)) || 0,
  }))
}

export function getCorrelation(data, col1, col2) {
  const vals1 = data.map((r) => Number(r[col1])).filter((v) => !isNaN(v))
  const vals2 = data.map((r) => Number(r[col2])).filter((v) => !isNaN(v))
  const n = Math.min(vals1.length, vals2.length)
  if (n === 0) return 0
  const mean1 = vals1.slice(0, n).reduce((a, b) => a + b, 0) / n
  const mean2 = vals2.slice(0, n).reduce((a, b) => a + b, 0) / n
  let num = 0, den1 = 0, den2 = 0
  for (let i = 0; i < n; i++) {
    num += (vals1[i] - mean1) * (vals2[i] - mean2)
    den1 += (vals1[i] - mean1) ** 2
    den2 += (vals2[i] - mean2) ** 2
  }
  return den1 && den2 ? parseFloat((num / Math.sqrt(den1 * den2)).toFixed(3)) : 0
}
