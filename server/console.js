const Firebase = require('firebase-admin')
const Config = require('../config/env')

Firebase.initializeApp({
  credential: Firebase.credential.cert(Config.firebase_credentials),
  storageBucket: 'heroquest-manager.appspot.com'
})

var controller = process.argv[process.argv.length - 1].split('=')[1]

var req = (params) => {
  return {
    params: params,
    query: params
  }
}

var res = {
  json (body) {
    console.log(body)
  }
}

import(`../api/fake/${controller}`).then((Controller) => {
  Controller.default(req, res)
})
