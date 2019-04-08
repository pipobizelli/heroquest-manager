import Adapter from '../../adapters/firebase'
export async function Get (id) {
  try {
    let monster = await Adapter().getDoc('monsters', id)
    return monster
  } catch (e) {
    console.log('[model] monster')
    return e
  }
}

export async function GetAll () {
  try {
    let monsters = []
    let response = await Adapter().getAllDocs('monsters')
    response.forEach(monster => {
      monsters.push({
        id: monster.id,
        data: monster.data()
      })
    })
    return monsters
  } catch (e) {
    console.log('[model] monster')
    return e
  }
}
