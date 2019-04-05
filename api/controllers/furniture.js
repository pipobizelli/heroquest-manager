import { Rest } from '../../models/furniture/index'

export async function GetFurniture (req, res) {
  try {
    let response = await Rest.Get(req.params.id)
    res.json(response)
  } catch (e) {
    console.log('[controller] getFurniture')
    res.json(e)
  }
}

export async function ListFurniture (req, res) {
  try {
    let response = await Rest.GetAll()
    res.json(response)
  } catch (e) {
    console.log('[controller] ListFurniture')
    res.json(e)
  }
}
