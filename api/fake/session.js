import { AddSession } from '../controllers/session'

export default (req, res) => {
  let action = function (params) {
    AddSession(req(params), res)
  }

  action({
    quest: 'DDCfjn9xkGdHExNS5XGS ',
    slots: [],
    turns: []
  })
}
