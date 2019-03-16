import Adapter from '@@/adapters/firebase'
export default () => {
  return {
    async get (id, collection) {
      let actor = await Adapter.getData(id, collection)
      return actor
    }

    // TODO
    // async get_attributes (char) {}
  }
}
