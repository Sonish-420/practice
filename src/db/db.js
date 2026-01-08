const sql = require('mssql/msnodesqlv8')

let pool

const sqlConfig = {
  server: 'IT_5\\SQLEXPRESS',
  database: 'test',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  },
  driver: 'msnodesqlv8'
}

async function connectSQL() {
  if (pool) return pool

  pool = await sql.connect(sqlConfig)
  console.log('✅ SQL connected')

  await pool.request().query('SELECT 1 AS warmup')

  return pool
}

function getSQLPool() {
  if (!pool) throw new Error('SQL not connected')
  return pool
}

module.exports = {
  connectSQL,   // 👈 MUST BE THIS NAME
  getSQLPool,
  sql
}
