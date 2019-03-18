import Adapter from '@@/adapters/firebase'
export default () => {
  return {
    async get (id, type) {
      try {
        let character = await Adapter.getData(id, 'characters')
        return character
      } catch (e) {
        console.log('[model] characters', e)
      }
    }
  }
}
