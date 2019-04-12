var serviceAccount = require('./heroquest-manager-firebase-key.json')
module.exports = {
  firebase_credentials: serviceAccount,
  paths: {
    base_url: (() => {
      return 'http://localhost:3000'
    })(),
    images: 'https://firebasestorage.googleapis.com/v0/b/heroquest-manager.appspot.com/o/'
  }
}
