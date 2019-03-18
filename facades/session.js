import axios from 'axios'
export default () => {
  return {
    async getSession (id) {
      try {
        let response = await axios.get(`http://localhost:3000/api/sessions/${id}`)
        return response
      } catch (e) {
        console.log('[facade] session', e)
      }
    }
  }
}
