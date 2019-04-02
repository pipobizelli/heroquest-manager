import Adapter from '../../adapters/firebase'
export async function Get (id) {
  try {
    let quest = await Adapter().getData('quests', id)
    return quest
  } catch (e) {
    console.log('[model] quest', e)
    return {}
  }
}

export async function GetAll () {
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

export async function Add (payload) {
  try {
    let response = await Adapter().addDoc('quests', payload)
    return response
  } catch (e) {
    console.log('[model] quest add')
    return {}
  }
}

export async function Update (payload) {
  try {
    let response = await Adapter().updateDoc('quests', payload)
    return response
  } catch (e) {
    console.log('[model] quest update')
    return {}
  }
}
