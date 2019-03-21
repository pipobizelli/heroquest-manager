import { ListQuest } from '../controllers/quests'

export default (req, res) => {
  let action = function (params) {
    ListQuest(req(params), res)
  }

  action({})
}
