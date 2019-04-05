import axios from 'axios'
export default () => {
  return {
    async getMonster (id) {
      try {
        let response = await axios.get(`http://localhost:3000/api/monsters/${id}`)
        return response
      } catch (e) {
        console.log('[facade] getMonster')
        return e
      }
    },

    async getAllMonsters () {
      try {
        let response = await axios.get(`http://localhost:3000/api/monsters`)
        return response
      } catch (e) {
        console.log('[facade] getAllMonsters')
        return e
      }
    }
  }
}
