import axios from 'axios'
export default () => {
  return {
    async getQuest (id) {
      try {
        let response = await axios.get(`http://localhost:3000/api/quests/${id}`)
        return response
      } catch (e) {
        console.log('[facade] quest getQuest')
        return e
      }
    },

    async getAllQuests () {
      try {
        let response = await axios.get(`http://localhost:3000/api/quests`)
        return response
      } catch (e) {
        console.log('[facade] quest getAll')
        return e
      }
    },

    async addQuest (quest) {
      try {
        let response = await axios.post('http://localhost:3000/api/quests/add', quest)
        return response
      } catch (e) {
        console.log('[facade] quest addQuest')
        return e
      }
    },

    async updateQuest (quest) {
      try {
        let response = await axios.post('http://localhost:3000/api/quests/update', quest)
        return response
      } catch (e) {
        console.log('[facade] quest addQuest')
        return e
      }
    }
  }
}
