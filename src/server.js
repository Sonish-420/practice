const express = require('express')
const morgan = require('morgan')
const { connectSQL } = require('./db/db')

const app = express()

app.use(express.json())
app.use(morgan('dev'))

async function startServer() {
  console.log('🚀 startServer called')

  try {
    console.log('⏳ connecting to SQL...')
    await connectSQL()
    console.log('✅ SQL connected')

    app.use('/api/users', require('./routes/user'))

    app.listen(3000, () => {
      console.log('🎉 Server is running at port 3000')
    })
  } catch (err) {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
  }
}

startServer()
