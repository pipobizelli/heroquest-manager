// import SessionController from './controllers/session'
import Session from '../models/session'
import Quest from '../models/quest'

export default async function (req, res) {
  let session = await Session().get(req.params.id)
  let quest = await Quest().get(session.quest)

  res.json({
    ...session,
    quest: quest
  })
}
