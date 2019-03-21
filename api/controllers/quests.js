import QuestModel from '../../models/quest'

export async function GetQuest (req, res) {
  try {
    let response = await QuestModel().get(req.params.id)
    res.json(response)
  } catch (e) {
    console.log('[controller] getQuest', e)
  }
}

export async function ListQuest (req, res) {
  try {
    let response = await QuestModel().getAll()
    res.json(response)
  } catch (e) {
    console.log('[controller] ListQuest', e)
  }
}
