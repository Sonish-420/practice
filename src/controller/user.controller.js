const userService = require('../service/user.service')

const createUser = async (req, res) => {
  try {
    const { username, password } = req.body

    const result = await userService.createUserService(username, password)

    res.status(200).json({
      status: 200,
      data: result,
      message: 'User created successfully'
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

const updateUser=async(req,res)=>{
    try {
        const {userID,username,password}=req.body
        const result=await userService.updateUserService(userID,username,password)
        res.status(200).json({
            status:200,
            data:result,
            message:'User updated successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getUserList=async(req,res)=>{
    try {
        const result=await userService.getUserList()
        res.status(200).json({
            status:200,
            data:result,
            message:"List fetched sucessfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const getUserView=async(req,res)=>{
    try {
        const userID=req.params.id
        const result=await userService.getUserView(userID)
        res.status(200).json({
            status:200,
            data:result,
            message:"List fetched sucessfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const deleteUser=async(req,res)=>{
    try {
        const userID=req.params.id
        const result=await userService.deleteUser(userID)
        res.status(200).json({
            status:200,
            data:result,
            message:"List fetched sucessfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = {
  createUser,
  updateUser,
  getUserList,
  getUserView,
  deleteUser
}
