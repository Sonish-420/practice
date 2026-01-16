import { createServer } from 'http'
import express from 'express'
import xlsx from 'xlsx'
import { connectSQL, getSQLPool, sql } from './db.js'
import ProfitMarginRoute from './routes/profitMargin.route.js'

const app = express()
const PORT = 8080
const server = createServer(app)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectSQL()
function excelSerialToJSDate(serial) {
  // Excel base date: 1899-12-30
  const excelBaseDate = new Date(Date.UTC(1899, 11, 30))
  return new Date(excelBaseDate.getTime() + serial * 86400000)
}

function safeNumber(val) {
  if (val === null || val === undefined || val === '') return null
  const n = Number(val)
  return Number.isFinite(n) ? n : null
}

function safeDate(val) {
  if (val === null || val === undefined || val === '') return null

  // If it's already Date
  if (val instanceof Date && !isNaN(val)) return val

  // If excel serial number
  if (typeof val === 'number') {
    // protect against invalid serials
    if (val <= 0) return null
    const d = excelSerialToJSDate(val)
    return isNaN(d) ? null : d
  }

  // If string date
  const d = new Date(val)
  if (isNaN(d)) return null
  return d
}
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/api/v1', async (req, res) => {
  try { 
    const pool = getSQLPool()

    const tableName = 'Fact_Profit_Margin'
    const filePath = './DiaWithoutCost.xlsx'

    const wb = xlsx.readFile(filePath, { cellDates: true }) // ✅ important
    const ws = wb.Sheets[wb.SheetNames[0]]

    const rows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: null })

    if (!rows || rows.length < 3) {
      return res.status(400).json({
        message: 'Excel must have row2 as header and row3+ as data',
        rowsFound: rows.length,
      })
    }

    const headerRowIndex = 1
    const dataStartIndex = 2

    const excelHeaders = rows[headerRowIndex]
    const excelDataRows = rows.slice(dataStartIndex)

    // ✅ fetch db columns with datatypes
    const dbColsResult = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = '${tableName}'
      ORDER BY ORDINAL_POSITION
    `)

    const dbCols = dbColsResult.recordset
    const dbColNames = dbCols.map((c) => c.COLUMN_NAME)

    // ✅ bulk table
    const bulkTable = new sql.Table(tableName)
    bulkTable.create = false

    // ✅ Add correct types instead of NVARCHAR for all
    for (const col of dbCols) {
      const colName = col.COLUMN_NAME
      const type = col.DATA_TYPE.toLowerCase()

      if (type === 'date') bulkTable.columns.add(colName, sql.Date, { nullable: true })
      else if (type === 'int') bulkTable.columns.add(colName, sql.Int, { nullable: true })
      else if (type === 'decimal' || type === 'numeric')
        bulkTable.columns.add(colName, sql.Decimal(18, 4), { nullable: true })
      else bulkTable.columns.add(colName, sql.NVarChar(sql.MAX), { nullable: true })
    }

    let inserted = 0
    let skippedEmpty = 0

    for (const row of excelDataRows) {
      const allEmpty = row.every((cell) => cell == null || String(cell).trim() === '')
      if (allEmpty) {
        skippedEmpty++
        continue
      }

      const values = dbCols.map((dbCol, idx) => {
        const val = row[idx]
        const type = dbCol.DATA_TYPE.toLowerCase()

        if (type === 'date') {
          // ✅ TransactionDate and other date columns
          return safeDate(val)
        }

        if (type === 'int') {
          return safeNumber(val)
        }

        if (type === 'decimal' || type === 'numeric') {
          return safeNumber(val)
        }

        // string/varchar
        if (val === null || val === undefined || val === '') return null
        return String(val)
      })

      bulkTable.rows.add(...values)
      inserted++
    }

    await pool.request().bulk(bulkTable)

    res.json({
      message: '✅ Imported successfully with correct Date/Number handling',
      inserted,
      skippedEmpty,
      excelHeaders: excelHeaders.length,
      dbCols: dbCols.length,
      note:
        'Now TransactionDate will be real date or NULL. Blank numeric cells also become NULL.',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: '❌ Import failed',
      error: err.message,
    })
  }
})

app.use('/api/v1/profitmargin', ProfitMarginRoute)

server.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
