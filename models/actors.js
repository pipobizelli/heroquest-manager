import Adapter from '../adapters/firebase'
export default () => {
  return {
    async get (collection, id) {
      try {
        let actor = await Adapter().getDoc(collection, id)
        return actor
      } catch (e) {
        console.log('[model] actors', e)
      }
    }

    // TODO
    // async get_attributes (char) {}
  }
}
