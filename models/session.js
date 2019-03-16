import Adapter from '../adapters/firebase'
export default () => {
  return {
    async get (id) {
      let session = await Adapter().getData('sessions', id)
      return session
    }
  }
}
