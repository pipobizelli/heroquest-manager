import express from 'express'
import { GetSession, AddSession } from '../api/controllers/session'
import { GetQuest, ListQuest, AddQuest, UpdateQuest } from '../api/controllers/quests'
import { GetCharacter, ListCharacter } from '../api/controllers/characters'
import { ListMonsters, GetMonster } from '../api/controllers/monsters'
import { ListFurniture, GetFurniture } from '../api/controllers/furniture'
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
  res.send('Add Session Error')
})

// Quests ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
app.get('/quests', (req, res) => { ListQuest(req, res) })
app.get('/quests/:id', (req, res) => { GetQuest(req, res) })
app.post('/quests/add', async (req, res, next) => {
  try { await AddQuest(req, res) } catch (e) { next(e) }
}, async (req, res) => {
  res.send('Add Session Error')
})
app.post('/quests/update', async (req, res, next) => {
  try { await UpdateQuest(req, res) } catch (e) { res.send('Update Session Error') }
})

// Characters ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
app.get('/characters', (req, res) => { ListCharacter(req, res) })
app.get('/characters/:id', (req, res) => { GetCharacter(req, res) })

// Monsters ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
app.get('/monsters', (req, res) => { ListMonsters(req, res) })
app.get('/monsters/:id', (req, res) => { GetMonster(req, res) })

// Furniture ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
app.get('/furniture', (req, res) => { ListFurniture(req, res) })
app.get('/furniture/:id', (req, res) => { GetFurniture(req, res) })

export default {
  path: '/api',
  handler: app
}
