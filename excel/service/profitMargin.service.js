import { sqlBuilder } from '../config/sql.js'

function convertArraysToString(obj) {
  const newObj = {}
  for (const key in obj) {
    newObj[key] = Array.isArray(obj[key]) ? obj[key].join(',') : obj[key]
  }
  return newObj
}

export class ProfitMarginStoreProService {
  static async getList(params) {
    return await sqlBuilder.execute(
      'fetch_profit_margin',
      convertArraysToString(params) // ✅ pass directly
    )
  }
static async getFilterList() {
  return await sqlBuilder.execute('Profit_margin_api_filters')
}
}
