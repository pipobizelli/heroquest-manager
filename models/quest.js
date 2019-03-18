import Adapter from '../adapters/firebase'
export default () => {
  return {
    async get (id) {
      try {
        let quest = await Adapter().getData('quests', id)
        return quest
      } catch (e) {
        console.log('[model] quest', e)
      }
    }
  }
}
