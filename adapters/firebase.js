import Firebase from 'firebase-admin'

export default () => {
  return {
    getDb () {
      return Firebase.firestore()
    },

    async getData (collection, id) {
      try {
        let db = this.getDb()
        var result = await db.collection(collection).doc(id).get()
        return result.data()
      } catch (e) {
        console.log('[adapter] getData', e)
        return {}
      }
    },

    async getAllDocs (collection) {
      try {
        let db = this.getDb()
        var result = await db.collection(collection).get()
        return result
      } catch (e) {
        console.log('[adapter] getAll', e)
        return {}
      }
    },

    async addDoc (collection, data) {
      try {
        let db = this.getDb()
        var result = await db.collection(collection).add(data)
        return result
      } catch (e) {
        console.log('[adapter] setDoc', e)
        return {}
      }
    }
  }
}
