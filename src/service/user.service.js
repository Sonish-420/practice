const { sql, getSQLPool } = require('../db/db')

class UserService {
  async createUserService(username, password) {
    const pool = getSQLPool()

    const result = await pool.request()
      .input('UserName', sql.VarChar(20), username)
      .input('UserPassword', sql.VarChar(50), password)
      .execute('dbo.create_user')

   return result.recordset[0]   
  }
  async updateUserService(userID,username,password){ 
    const pool=getSQLPool()

    const result=await pool.request()
    .input('UserID',sql.Int,userID)
    .input('UserName',sql.VarChar(20),username)
    .input('UserPassword',sql.VarChar(50),password)
    .execute('dbo.update_user')
    return result.recordset[0]
  }

  async getUserList(){
    const pool=getSQLPool()
    const result=await pool.request().execute('get_orders_by_user_paged')
    return result.recordset
  }
  async getUserView(userID){
    const pool=getSQLPool()
    const result=await pool.request()
    .input('UserID',sql.Int,userID)
    .execute('view_user')
    return result.recordset[0]
  }
  async deleteUser(UserID) {
    const pool = getSQLPool()
    const result = await pool.request()
      .input('UserID', sql.Int, UserID)
      .execute('delete_user')
    return result
  }
  async getOrders(params){
    const pool=getSQLPool()
    const result = await pool.request()
      .input('Search', sql.VarChar(50), params.search || null)
      .input('Status', sql.VarChar(20), params.status || null)
      .input('MinAmount', sql.Decimal(10,2), params.minAmount || null)
      .input('MaxAmount', sql.Decimal(10,2), params.maxAmount || null)
      .input('FromDate', sql.Date, params.fromDate || null)
      .input('ToDate', sql.Date, params.toDate || null)
      .input('OrderBy', sql.VarChar(50), params.orderBy || 'OrderDate')
      .input('OrderDir', sql.VarChar(4), params.orderDir || 'DESC')
      .input('Page', sql.Int, params.page || 1)
      .input('Limit', sql.Int, params.limit || 10)
      .execute('dbo.get_orders_by_user_paged')

    return {
      data: result.recordsets[0],
      total: result.recordsets[1][0].TotalRecords
    }
  }
}
module.exports = new UserService()
