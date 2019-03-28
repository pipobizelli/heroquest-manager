import axios from 'axios'
export default () => {
  return {
    async getQuest (id) {
      try {
        let response = await axios.get(`http://localhost:3000/api/quests/${id}`)
        return response
      } catch (e) {
        console.log('[facade] quest get', e)
      }
    },

    async getAllQuests () {
      try {
        let response = await axios.get(`http://localhost:3000/api/quests`)
        return response
      } catch (e) {
        console.log('[facade] quest getAll', e)
      }
    }
  }
}
