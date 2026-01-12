const { request } = require('express')
const jwt=require('jsonwebtoken')

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET||"Your Secret",{expiresIn:'1d'})
}

module.exports=generateToken