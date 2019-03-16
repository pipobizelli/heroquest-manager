import Session from '../models/session'
import Quest from '../models/quest'
import Actors from '../models/actors'

export default async function (req, res) {
  let session = await Session().get(req.params.id)
  let quest = await Quest().get(session.quest)
  let heroes = session.slots.map(async (h) => {
    let char = await Actors().get('characters', h.character)
    let hero = await Actors().get('heroes', char.class)
    return {
      ...hero,
      ...char,
      tiles: h.tiles
    }
  })
  let others = quest.components.map(async (c) => {
    let comp = await Actors().get(c.collection, c.id)
    return {
      ...comp,
      tiles: c.tiles
    }
  })
  let components = Promise.all(heroes.concat(others)).then((result) => {
    return result
  })

  res.json({
    ...session,
    quest: {
      map: quest.map,
      components: await components
    }
  })
}
