import { getSQLPool, sql } from '../db.js'

export class ProfitMarginStoreProService {
  async getList(params) {
    const pool = getSQLPool()
    const request = pool.request()

    request.input('startDate', sql.DateTime, params.startDate)
    request.input('endDate', sql.DateTime, params.endDate)

    request.input('limit', sql.Int, params.limit ?? 20)
    request.input('page', sql.Int, params.page ?? 1)
    request.input('search', sql.VarChar(200), params.search ?? null)
    request.input('Customer', sql.VarChar(200), params.Customer ?? null)
    request.input('ItemName', sql.VarChar(200), params.ItemName ?? null)

    const result = await request.execute('fetch_profit_margin')
    return result.recordset
  }
}
