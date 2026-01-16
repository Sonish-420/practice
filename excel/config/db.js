import sql from 'mssql/msnodesqlv8.js'

let pool

const sqlConfig = {
 server: 'IT_5\\SQLEXPRESS',
  database: 'test',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
  driver: 'msnodesqlv8',
}

export async function connectSQL() {
  if (pool) return pool
console.log(sqlConfig)
  pool = await sql.connect(sqlConfig)
  console.log('✅ SQL connected')

  await pool.request().query('SELECT 1 AS warmup')

  return pool
}

export function getSQLPool() {
  if (!pool) throw new Error('SQL not connected')
  return pool
}

export { sql }