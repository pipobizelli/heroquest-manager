import { GetSession } from '../controllers/session'

export default (req, res) => {
  let action = function (params) {
    GetSession(req(params), res).then((data) => {
      console.log('data:', data)
      data.forEach(e => console.log(e.data))
    })
  }

  action({
    id: 'mBUh7YO4LoHYAsG8bRk5'
  })
}
