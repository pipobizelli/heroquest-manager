import Adapter from '../../adapters/firebase'
import { Add, Get, AddEntities } from './rest'
export async function GetSession (sessionId) {
  try {
    let session = await Get(sessionId)
    let quest = await Adapter().getDoc('quests', session.quest)
    let entities = await Adapter().queryDocs('session_entities', ['session_id', '==', sessionId])
    let components = entities.map(e => {
      return {
        ...e.data(),
        entity_id: e.id
      }
    })

    return {
      ...session,
      quest: {
        title: quest.name,
        description: quest.description,
        objectives: {
          ...quest.objectives
        },
        map: quest.map,
        components: components
      }
    }
  } catch (e) {
    console.log('[factory] session GetSession')
  }
}

export async function AddSession (session) {
  // Criar as entities juntando os personagens e components
  try {
    let quest = await Adapter().getDoc('quests', session.quest)
    let components = await GetComponents(quest)
    let characters = await GetCharaceters(session.slots)
    let heroes = ValidateCharacters(characters)
    let entitiesArr = heroes.concat(components)
    let id = await Add(session)
    entitiesArr.map((e) => {
      e.session_id = id
      return e
    })
    await AddEntities(entitiesArr)

    return id
  } catch (e) {
    console.log('[factory] session AddSession')
  }
}

// Carregar os components da quest
export async function GetComponents (quest) {
  try {
    let components = quest.components.map(async (c) => {
      let comp = await Adapter().getDoc(c.collection, c.type)
      return {
        ...comp,
        attributes: {
          ...comp.attributes,
          tiles: c.attributes.tiles
        }
      }
    })
    return Promise.all(components)
  } catch (e) {
    console.log('[factory] session GetComponents')
  }
}

// Carregar e validar os Personagens carregados (se existem e se estão aptos)
export async function GetCharaceters (slots) {
  try {
    let characters = slots.map(async (slot, index) => {
      let char = await Adapter().getDoc('characters', slot.character)
      let hero = await Adapter().getDoc('heroes', char.type)
      return {
        ...hero,
        ...char,
        slot: index,
        class: 'hero',
        attributes: {
          ...char.attributes,
          tiles: slot.tiles
        }
      }
    })
    return Promise.all(characters)
  } catch (e) {
    console.log('[factory] session ValidateCharacters')
  }
}

export function ValidateCharacters (characters) {
  return characters.filter((c) => {
    return c.attributes.life > 0
  })
}
