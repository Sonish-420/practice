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
}
module.exports = new UserService()
