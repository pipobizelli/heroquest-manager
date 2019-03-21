import axios from 'axios'
export default () => {
  return {
    async getCharacter (id) {
      try {
        let response = await axios.get(`http://localhost:3000/api/characters/${id}`)
        return response
      } catch (e) {
        console.log('[facade] quest', e)
        return {}
      }
    },

    async getAllCharacters () {
      try {
        let response = await axios.get(`http://localhost:3000/api/characters`)
        return response
      } catch (e) {
        console.log('[facade] quest', e)
        return {}
      }
    }
  }
}
