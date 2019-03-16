import Adapter from '../adapters/firebase'
export default () => {
  return {
    async get (collection, id) {
      let actor = await Adapter().getData(collection, id)
      return actor
    }

    // TODO
    // async get_attributes (char) {}
  }
}
