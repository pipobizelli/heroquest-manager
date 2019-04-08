import { Rest } from '../../models/quest/index'

export async function GetQuest (req, res) {
  try {
    let response = await Rest.Get(req.params.id)
    res.json(response)
  } catch (e) {
    console.log('[controller] getQuest')
    res.json(e)
  }
}

export async function ListQuest (req, res) {
  try {
    let response = await Rest.GetAll()
    res.json(response)
  } catch (e) {
    console.log('[controller] ListQuest')
    res.json(e)
  }
}

export async function AddQuest (req, res) {
  try {
    let response = await Rest.Add(req.body)
    res.json(response)
  } catch (e) {
    console.log('[controller] AddQuest')
    res.json(e)
  }
}

export async function UpdateQuest (req, res) {
  try {
    let response = await Rest.Update(req.body)
    res.json(response)
  } catch (e) {
    console.log('[controller] UpdateQuest')
    res.json(e)
  }
}

export async function RemoveQuest (req, res) {
  try {
    let response = await Rest.Remove(req.body.id)
    res.json(response)
  } catch (e) {
    console.log('[controller] RemoveQuest')
    res.json(e)
  }
}
