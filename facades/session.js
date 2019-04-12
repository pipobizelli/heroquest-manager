import axios from 'axios'
import Config from '../config/env'
export default () => {
  return {
    async getSession (id) {
      try {
        let response = await axios.get(`${Config.paths.base_url}/api/sessions/${id}`)
        return response
      } catch (e) {
        console.log('[facade] session', e)
        return {}
      }
    },

    async getAllSessions () {
      try {
        let response = await axios.get(`${Config.paths.base_url}/api/sessions`)
        return response
      } catch (e) {
        console.log('[facade] session', e)
        return {}
      }
    },

    async addSession (session) {
      try {
        let response = await axios.post(`${Config.paths.base_url}/api/sessions/add`, session)
        return response
      } catch (e) {
        console.log('[facade] session', e)
        return {}
      }
    }
  }
}
