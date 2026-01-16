const user=require('../controller/user.controller')
const router=require('router')()
const verifyToken=require('../middleware/verifyToken')
const  excel  = require('../service/excel.dataconverter')

router.post('/register',verifyToken,user.createUser)
router.post('/update',user.updateUser)
router.get('/list',user.getUserList)
router.get('/view/:id',user.getUserView)
router.delete('/delete/:id',user.deleteUser)
router.get('/orders',user.getOrders)
router.get('/excel/coverter',excel.excelDataconverter)

module.exports=router