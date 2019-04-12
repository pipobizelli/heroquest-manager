import express from 'express'
import { GetSession, ListSession, AddSession } from '../api/controllers/session'
import { GetQuest, ListQuest, AddQuest, UpdateQuest, RemoveQuest } from '../api/controllers/quests'
import { GetCharacter, ListCharacter } from '../api/controllers/characters'
import { ListMonsters, GetMonster } from '../api/controllers/monsters'
import { ListFurniture, GetFurniture } from '../api/controllers/furniture'
import BodyParser from 'body-parser'

const app = express()
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))

// Session ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--=
app.get('/sessions/:id', (req, res) => { GetSession(req, res) })
app.get('/sessions', (req, res) => {
  try { ListSession(req, res) } catch (e) { res.send('ListSession Error') }
})
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
app.get('/quests', (req, res) => {
  try { ListQuest(req, res) } catch (e) { res.send('ListQuest Error') }
})
app.get('/quests/:id', (req, res) => {
  try { GetQuest(req, res) } catch (e) { res.send('GetQuest Error') }
})
app.post('/quests/add', async (req, res, next) => {
  try { await AddQuest(req, res) } catch (e) { res.send('AddQuest Error') }
})
app.post('/quests/update', async (req, res) => {
  try { await UpdateQuest(req, res) } catch (e) { res.send('UpdateQuest Error') }
})
app.delete('/quests/remove', async (req, res) => {
  try { await RemoveQuest(req, res) } catch (e) { res.send('RemoveQuest Error') }
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
