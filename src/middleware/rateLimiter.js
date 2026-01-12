const maxLoginAttempts = 5
const blockDurationMins = 60
const failedLoginMap = new Map()

// ✅ middleware
const rateLimitLogin = (req, res, next) => {
  const email = req.body.email || req.body.username

  if (!email) {
    return res.status(400).json({ message: "Email/Username is required" })
  }

  const now = Date.now()
  const record = failedLoginMap.get(email)

  if (record && record.blockUntil && record.blockUntil > now) {
    const waitMs = record.blockUntil - now
    return res.status(429).json({
      blocked: true,
      message: `Too many failed login attempts. Try again in ${Math.ceil(waitMs / 60000)} minutes.`,
    })
  }

  next()
}

const trackFailedLogin = (email) => {
  const now = Date.now()
  const record = failedLoginMap.get(email)

  const attempts = record ? record.attempts : 0

  if (attempts + 1 >= maxLoginAttempts) {
    failedLoginMap.set(email, {
      attempts: attempts + 1,
      blockUntil: now + blockDurationMins * 60 * 1000,
    })
  } else {
    failedLoginMap.set(email, {
      attempts: attempts + 1,
      blockUntil: 0,
    })
  }
}

const resetLoginAttempts = (email) => {
  failedLoginMap.delete(email)
}

module.exports = { rateLimitLogin, trackFailedLogin, resetLoginAttempts }
