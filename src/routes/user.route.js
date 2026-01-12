const user=require('../controller/user.controller')
const router=require('router')()
const verifyToken=require('../middleware/verifyToken')

router.post('/register',verifyToken,user.createUser)
router.post('/update',user.updateUser)
router.get('/list',user.getUserList)
router.get('/view/:id',user.getUserView)
router.delete('/delete/:id',user.deleteUser)
router.get('/orders',user.getOrders)

module.exports=router