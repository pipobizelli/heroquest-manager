import Adapter from '../adapters/firebase'
export default () => {
  return {
    async get (id, type) {
      try {
        let character = await Adapter.getDoc(id, 'characters')
        return character
      } catch (e) {
        console.log('[model] characters', e)
      }
    },

    async getAll () {
      try {
        let chars = []
        let response = await Adapter().getAllDocs('characters')
        response.forEach(char => {
          chars.push({
            id: char.id,
            data: char.data()
          })
        })
        return chars
      } catch (e) {
        console.log('[model] quest', e)
        return {}
      }
    }
  }
}
