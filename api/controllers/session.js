import { Factory, Rest } from '../../models/session/index'

export async function GetSession (req, res) {
  try {
    let session = await Factory.GetSession(req.params.id)
    res.json(session)
  } catch (e) {
    console.log('[Controller] Session GetSession')
    res.json({
      error: e
    })
  }
}

export async function AddSession (req, res) {
  try {
    let response = await Factory.AddSession({
      'quest': req.body.quest,
      'slots': req.body.slots,
      'turns': req.body.turns
    })
    res.json(response)
  } catch (e) {
    console.log('[controller] session AddSession')
  }
}

export async function AddEntities (req, res) {
  try {
    let response = await Rest.addEntities(req.body.entities)
    res.json(response)
  } catch (e) {
    console.log('[controller] session AddEntities')
  }
}
