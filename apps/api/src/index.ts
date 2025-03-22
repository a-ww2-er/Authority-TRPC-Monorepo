import { trpcExpress } from '@authority-trpc/trpc-server'
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello from Express')
})

app.use('/trpc', trpcExpress)

app.listen(8080, () => {
  console.log('Server started on port 8080')
})
