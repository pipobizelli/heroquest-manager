import SessionController from '../controllers/session'

export default (req, res) => {
  let action = function (params) {
    SessionController(req(params), res)
  }

  action({
    id: 'IqUvbPFIbemnrGj0FyZj'
  })
}
