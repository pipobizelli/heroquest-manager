import Adapter from '../adapters/firebase'
export default () => {
  return {
    async get (id) {
      try {
        let quest = await Adapter().getData('quests', id)
        return quest
      } catch (exception) {
        console.log('Erro', exception)
      }
    }
  }
}
