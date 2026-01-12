const sql=require('mssql/msnodesqlv8')
const { getSQLPool } = require('../db/db')

async function authUserService(username,password){ 
    const pool=getSQLPool()

    const result=await pool.request()
    .input('UserName',sql.VarChar(20),username)
    .input('UserPassword',sql.VarChar(50),password)
    .execute('dbo.login_user')
    return result.recordset[0]
}
module.exports=authUserService