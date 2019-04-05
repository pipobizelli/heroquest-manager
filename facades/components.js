import axios from 'axios'
export default () => {
  return {
    async getComponent (col, id) {
      try {
        let response = await axios.get(`http://localhost:3000/api/${col}/${id}`)
        return response
      } catch (e) {
        console.log('[facade] components', e)
        return {}
      }
    },

    async getAllComponents (col) {
      try {
        let response = await axios.get(`http://localhost:3000/api/${col}`)
        return response
      } catch (e) {
        console.log('[facade] components', e)
        return {}
      }
    }
  }
}
