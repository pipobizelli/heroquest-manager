import Adapter from '../adapters/firebase'
export default () => {
  return {
    async get (id) {
      try {
        let session = await Adapter().getData('sessions', id)
        return session
      } catch (e) {
        console.log('[model] session', e)
        return {}
      }
    },

    async create (payload) {
      try {
        let session = await Adapter().addDoc('sessions', payload)
        return session.id
      } catch (e) {
        console.log('[model] session', e)
        return {}
      }
    }
  }
}
