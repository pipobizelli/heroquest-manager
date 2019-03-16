import Adapter from '@@/adapters/firebase'
export default () => {
  return {
    async get (id, type) {
      let character = await Adapter.getData(id, 'characters')
      return character
    }
  }
}
