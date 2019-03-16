import axios from 'axios'
export default () => {
  return {
    async getSession (id) {
      let response = await axios.get(`/api/sessions/${id}`)
      return response
    }
  }
}
