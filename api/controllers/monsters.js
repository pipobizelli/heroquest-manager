import { Rest } from '../../models/monster/index'

export async function GetMonster (req, res) {
  try {
    let response = await Rest.Get(req.params.id)
    res.json(response)
  } catch (e) {
    console.log('[controller] getMonster')
    res.json(e)
  }
}

export async function ListMonsters (req, res) {
  try {
    let response = await Rest.GetAll()
    res.json(response)
  } catch (e) {
    console.log('[controller] ListMonster')
    res.json(e)
  }
}
