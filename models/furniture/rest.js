import Adapter from '../../adapters/firebase'
export async function Get (id) {
  try {
    let furniture = await Adapter().getDoc('furniture', id)
    return furniture
  } catch (e) {
    console.log('[model] furniture')
    return e
  }
}

export async function GetAll () {
  try {
    let furniture = []
    let response = await Adapter().getAllDocs('furniture')
    response.forEach(f => {
      furniture.push({
        id: f.id,
        data: f.data()
      })
    })
    return furniture
  } catch (e) {
    console.log('[model] furniture')
    return e
  }
}
