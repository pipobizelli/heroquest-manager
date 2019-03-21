<template>
  <section class="session-form">
    <form class="session-form__form">
      <label>
        <h3 class="session-form__label">Quest:</h3>
        <select class="session-form__quest-select" v-model="selected_quest">
          <option disabled value="">Escolha a quest</option>
          <option v-for="q in quests" :value="q.id" v-html="q.data.name"></option>
        </select>
      </label>
      <label>
        <h3 class="session-form__label">Dificuldade:</h3>
        <select class="session-form__difficulty" v-model="difficulty">
          <option disabled value="">Escolha a dificuldade</option>
          <option>easy</option>
          <option>normal</option>
          <option>hard</option>
        </select>
      </label>
      <label>
        <h3 class="session-form__label">Personagens:</h3>
        <div class="session-form__players" v-for="(s, i) in slots">
          <p v-html="`Slot ${i}`"></p>
          <input type="text" name="players" v-model="slots[i].character" v-if="!slots[i].is_loaded">
          <p v-if="slots[i].is_loaded">
            <span v-html="slots[i].name"></span>
            <font-awesome-icon icon="check"></font-awesome-icon>
          </p>
        </div>
      </label>
      <button type="button" name="play" @click="create_session">Play!</button>
    </form>
  </section>
</template>

<script>
import { EventHub } from '@@/models/event_hub'
import QuestFacade from '@@/facades/quest'
import CharactersFacade from '@@/facades/characters'
export default {
  data () {
    return {
      quests: [{
        id: '',
        data: {
          name: ''
        }
      }],
      all_characters: [],
      selected_quest: '',
      difficulty: '',
      slots: []
    }
  },
  computed: {
    characters () {
      let chars = this.slots.map(s => s.character)
      return chars
    }
  },
  watch: {
    selected_quest (val) {
      let quest = this.quests.filter(q => q.id === val)[0]
      quest.data.slots.forEach((s) => {
        this.slots.push({
          is_loaded: false,
          tiles: s.tiles
        })
      })
    },
    characters (val) {
      val.map((c, i) => {
        if (c) {
          let chars = this.all_characters.filter(a => a.data.name === c)
          let char = chars[0]
          if (char) {
            this.slots[i] = {
              character: char.id,
              name: char.data.name,
              class: char.data.class,
              is_loaded: true,
              tiles: this.slots[i].tiles
            }
          }
        }
      })
    }
  },
  async created () {
    try {
      let chars = await CharactersFacade().getAllCharacters()
      this.all_characters = chars.data
    } catch (e) {
      console.log('[component] session form characters', e)
    }
  },
  async mounted () {
    try {
      let quest = await QuestFacade().getAllQuests()
      this.quests = quest.data
    } catch (e) {
      console.log('[component] session form quest', e)
    }
  },
  methods: {
    create_session () {
      EventHub.$emit('SessionForm/setQuest', {
        quest: this.selected_quest,
        slots: this.slots.filter(s => s.is_loaded),
        turns: []
      })
    }
  }
}
</script>

<style lang="scss">
</style>
