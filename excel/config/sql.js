import { getSQLPool, sql } from './db.js'

export class sqlBuilder {
  static async execute(spName, params = {}) {
    try {
      const request = getSQLPool().request()

      Object.entries(params).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          request.input(key, sql.NVarChar(sql.MAX), null)
        } else if (value instanceof Date) {
          request.input(key, sql.DateTime, value)
        } else if (typeof value === 'number') {
          request.input(key, sql.Int, value)
        } else {
          request.input(key, sql.NVarChar(sql.MAX), value.toString())
        }
      })

      const result = await request.execute(`dbo.${spName}`)
      return result.recordset
    } catch (err) {
      console.log("❌ SQL Builder Error:", err)
      throw err
    }
  }
}
