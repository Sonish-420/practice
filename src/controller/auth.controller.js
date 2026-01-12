const authUserService=require('../service/auth.service')
const generateToken=require('../utils/jwt')

const authController=(req,res)=>{ 
    authUserService(req.body.username,req.body.password).then((data)=>{ 
        if(data){ 
            const token=generateToken(data.UserID) 
            res.status(200).json({message:"Login successful",data:{user:data,token}})
        }else{
            res.status(400).json({message:"Invalid username or password"})
        }
    }).catch((err)=>{ 
        console.log(err)
        res.status(500).json({message:"Internal server error"})
    })  
        }

module.exports=authController