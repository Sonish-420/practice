const user=require('../controller/user.controller')
const router=require('router')()

router.post('/register',user.createUser)
router.post('/update',user.updateUser)
router.get('/list',user.getUserList)
router.get('/view/:id',user.getUserView)
router.delete('/delete/:id',user.deleteUser)

module.exports=router