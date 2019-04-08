import Adapter from '../../adapters/firebase'

export async function Get (id) {
  try {
    let response = await Adapter().getDoc('sessions', id)
    return response
  } catch (e) {
    console.log('[model] session get')
    return {}
  }
}

export async function Add (payload) {
  try {
    let response = await Adapter().addDoc('sessions', payload)
    return response
  } catch (e) {
    console.log('[model] session add')
    return {}
  }
}

export async function AddEntities (arr) {
  try {
    let response = await Adapter().batchDocs('session_entities', arr)
    return response
  } catch (e) {
    console.log('[model] session addEntity')
    return {}
  }
}
