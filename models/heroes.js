import Adapter from '@@/adapters/firebase'
export default () => {
  return {
    async get (id, type) {
      let actor = await Adapter.getData(id, type)
      return actor
    }
  }
}
