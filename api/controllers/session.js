import Session from '../../models/session'
import Quest from '../../models/quest'
import Actors from '../../models/actors'

export async function GetSession (req, res) {
  try {
    let session = await Session().get(req.params.id)
    let quest = await Quest().get(session.quest)
    let heroes = session.slots.map(async (h) => {
      try {
        let char = await Actors().get('characters', h.character)
        let hero = await Actors().get('heroes', char.type)
        return {
          ...hero,
          ...char,
          class: 'hero',
          attributes: {
            ...char.attributes,
            tiles: h.tiles
          }
        }
      } catch (e) {
        console.log('[callback] controller session characters', e)
      }
    })

    let others = quest.components.map(async (c) => {
      try {
        let comp = await Actors().get(c.collection, c.type)
        return {
          ...comp,
          attributes: {
            ...comp.attributes,
            tiles: c.attributes.tiles
          }
        }
      } catch (e) {
        console.log('[callback] controller session components', e)
      }
    })
    let components = Promise.all(heroes.concat(others)).then((result) => {
      return result
    })
    res.json({
      ...session,
      quest: {
        objectives: {
          ...quest.objectives
        },
        map: quest.map,
        components: await components
      }
    })
  } catch (e) {
    console.log('[Controller] Session', e)
    res.json({
      error: e
    })
  }
}

export async function AddSession (req, res) {
  try {
    let response = await Session().add(req.params.session)
    res.json(response)
  } catch (e) {
    console.log('[controller] ListQuest', e)
  }
}
