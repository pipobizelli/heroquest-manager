import express from 'express'
import { GetSession, AddSession } from '../api/controllers/session'
import { GetQuest, ListQuest } from '../api/controllers/quests'
import { GetCharacter, ListCharacter } from '../api/controllers/characters'
import BodyParser from 'body-parser'

const app = express()
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))

// Session ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--=
app.get('/sessions/:id', (req, res) => { GetSession(req, res) })
app.post('/sessions/add', async (req, res, next) => {
  try {
    await AddSession(req, res)
  } catch (e) {
    next(e)
  }
}, async (req, res) => {
  res.send('Erro')
})

// Quests ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
app.get('/quests', (req, res) => { ListQuest(req, res) })
app.get('/quests/:id', (req, res) => { GetQuest(req, res) })

// Characters ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
app.get('/characters', (req, res) => { ListCharacter(req, res) })
app.get('/characters/:id', (req, res) => { GetCharacter(req, res) })

export default {
  path: '/api',
  handler: app
}
