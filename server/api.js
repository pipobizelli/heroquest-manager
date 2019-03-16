import express from 'express'
import Session from '../api/session'

const app = express()

app.get('/sessions/:id', (req, res) => {
  // console.log('session')
  Session(req, res)
})

export default {
  path: '/api',
  handler: app
}
