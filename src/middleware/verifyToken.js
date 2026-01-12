const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.token

  if (!authHeader) {
    return res.status(401).json("You are not authenticated")
  }

  const token = authHeader.split(" ")[1]

jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  if (err) return res.status(403).json(err.message) // 👈 show real reason
  req.user = user
  next()
})

}

module.exports = verifyToken
