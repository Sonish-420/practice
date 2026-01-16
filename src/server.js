const cluster = require('cluster')
const { cpus } = require('os')
const express = require('express')
const morgan = require('morgan')
const { connectSQL } = require('./db/db')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 3000

if (cluster.isPrimary) {
  const numCPUs = cpus().length
  console.log(`Primary ${process.pid} running`)

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker) => {
    // customLog(`Worker ${worker.process.pid} died. Restarting...`)
    cluster.fork()
  })

} else {
  const app = express()

  app.use(express.json())
  app.use(morgan('dev'))
  app.use('/api/users', require('./routes/user.route'))
  app.use('/api/auth', require('./routes/auth.route'))

  async function startServer() {
    try {
      await connectSQL()   // ✅ each worker connects to DB
      app.listen(PORT, () => {
        console.log(`Worker ${process.pid} listening on port ${PORT}`)
      })
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }

  startServer()
}
