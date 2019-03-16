import Firebase from 'firebase-admin'

export default () => {
  return {
    getDb () {
      return Firebase.firestore()
    },

    async getData (collection, id) {
      let db = this.getDb()
      var result = await db.collection(collection).doc(id).get()
      return result.data()
    }
  }
}
