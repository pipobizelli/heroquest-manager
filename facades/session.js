import axios from 'axios'
export default () => {
  return {
    async getSession (id) {
      try {
        let response = await axios.get(`http://localhost:3000/api/sessions/${id}`)
        return response
      } catch (e) {
        console.log('[facade] session', e)
        return {}
      }
    },

    async addSession (session) {
      try {
        let response = await axios.post('http://localhost:3000/api/sessions/add', session)
        return response
      } catch (e) {
        console.log('[facade] session', e)
        return {}
      }
    }
  }
}
