import express from 'express'
import { GetSession } from '../api/controllers/session'
import { GetQuest, ListQuest } from '../api/controllers/quests'
import { GetCharacter, ListCharacter } from '../api/controllers/characters'

const app = express()

// Session ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--=
app.get('/sessions/:id', (req, res) => { GetSession(req, res) })

// Quests ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
app.get('/quests/:id', (req, res) => { GetQuest(req, res) })
app.get('/quests', (req, res) => { ListQuest(req, res) })

// Characters ==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==
app.get('/characters/:id', (req, res) => { GetCharacter(req, res) })
app.get('/characters', (req, res) => { ListCharacter(req, res) })

export default {
  path: '/api',
  handler: app
}
