import axios from 'axios'
export default () => {
  return {
    async getFurniture (id) {
      try {
        let response = await axios.get(`http://localhost:3000/api/furniture/${id}`)
        return response
      } catch (e) {
        console.log('[facade] getFurniture')
        return e
      }
    },

    async getAllFurniture () {
      try {
        let response = await axios.get(`http://localhost:3000/api/furniture`)
        return response
      } catch (e) {
        console.log('[facade] getAllFurniture')
        return e
      }
    }
  }
}
