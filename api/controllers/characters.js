import CharacterModel from '../../models/characters'

export async function GetCharacter (req, res) {
  try {
    let response = await CharacterModel().get(req.params.id)
    res.json(response)
  } catch (e) {
    console.log('[controller] CharacterModel', e)
    return {}
  }
}

export async function ListCharacter (req, res) {
  try {
    let response = await CharacterModel().getAll()
    res.json(response)
  } catch (e) {
    console.log('[controller] ListCharacter', e)
    return {}
  }
}
