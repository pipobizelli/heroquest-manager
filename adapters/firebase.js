import Firebase from 'firebase-admin'

export default () => {
  return {
    getDb () {
      return Firebase.firestore()
    },

    async getDoc (collection, id) {
      try {
        let db = this.getDb()
        var result = await db.collection(collection).doc(id).get()
        return result.data()
      } catch (e) {
        console.log('[adapter] getDoc')
        return {}
      }
    },

    async getAllDocs (collection) {
      try {
        let db = this.getDb()
        var result = await db.collection(collection).get()
        return result
      } catch (e) {
        console.log('[adapter] getAll')
        return {}
      }
    },

    async addDoc (collection, data) {
      try {
        let db = this.getDb()
        var result = await db.collection(collection).add(data)
        return result.id
      } catch (e) {
        console.log('[adapter] addDoc')
        return {}
      }
    },

    async queryDocs (collection, query) {
      try {
        let db = this.getDb()
        let ref = db.collection(collection)
        var result = await ref.where(query[0], query[1], query[2]).get()
        return result.docs
      } catch (e) {
        console.log('[adapter] queryDocs')
        return {}
      }
    },

    async batchDocs (collection, arr) {
      try {
        let db = this.getDb()
        let batch = db.batch()
        arr.map(async (data) => {
          try {
            let doc = db.collection(collection).doc()
            let response = await batch.set(doc, data)
            return response
          } catch (e) {
            console.log('[adapter] addDoc batch')
          }
        })
        return await batch.commit()
      } catch (e) {
        console.log('[adapter] addDoc')
        return e
      }
    },

    async updateDoc (collection, payload) {
      try {
        let db = this.getDb()
        var result = await db.collection(collection).doc(payload.id).update(payload.data)
        return result
      } catch (e) {
        console.log('[adapter] updateDoc')
        return e
      }
    },

    async removeDoc (collection, id) {
      try {
        let db = this.getDb()
        let result = await db.collection(collection).doc(id).delete()
        return result
      } catch (e) {
        console.log('[adapter] removeDoc')
        return e
      }
    }
  }
}
