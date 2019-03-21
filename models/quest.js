import Adapter from '../adapters/firebase'
export default () => {
  return {
    async get (id) {
      try {
        let quest = await Adapter().getData('quests', id)
        return quest
      } catch (e) {
        console.log('[model] quest', e)
        return {}
      }
    },

    async getAll () {
      try {
        let quests = []
        let response = await Adapter().getAllDocs('quests')
        response.forEach(quest => {
          quests.push({
            id: quest.id,
            data: quest.data()
          })
        })
        return quests
      } catch (e) {
        console.log('[model] quest', e)
        return {}
      }
    }
  }
}
