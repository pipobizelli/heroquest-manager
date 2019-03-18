import Adapter from '@@/adapters/firebase'
export default () => {
  return {
    async get (id, type) {
      try {
        let actor = await Adapter.getData(id, type)
        return actor
      } catch (e) {
        console.log('[model] heroes', e)
      }
    }
  }
}
