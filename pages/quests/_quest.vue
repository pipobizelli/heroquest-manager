<template>
  <section class="quest">
    <article class="quest__info">
      <div class="quest__data">
        <h2 class="quest__label">Titulo:</h2>
        <p class="quest__value" v-html="quest.name" v-show="!edit.name"></p>
        <input type="text" name="quest_name" v-show="edit.name" v-model="quest.name">
        <font-awesome-icon icon="edit" @click="editInfo('name')"></font-awesome-icon>
      </div>
      <div class="quest__data">
        <h2 class="quest__label">Descrição:</h2>
        <p class="quest__value" v-html="quest.description" v-show="!edit.desc"></p>
        <textarea name="quest_desc" rows="8" cols="80" v-show="edit.desc" v-model="quest.description"></textarea>
        <font-awesome-icon icon="edit" @click="editInfo('desc')"></font-awesome-icon>
      </div>
      <div class="quest__data">
        <h2 class="quest__label">Dificuldade:</h2>
        <p class="quest__value" v-html="quest.dificulty" v-show="!edit.dificulty"></p>
        <select class="quest__dificulty" name="quest-dificulty" v-show="edit.dificulty" v-model="quest.dificulty">
          <option value="easy">Facil</option>
          <option value="normal">Normal</option>
          <option value="hard">Difícil</option>
        </select>
        <font-awesome-icon icon="edit" @click="editInfo('dificulty')"></font-awesome-icon>
      </div>
    </article>
    <editor :quest="quest"></editor>
    <button type="button" name="quest_update" @click="update()">Salvar</button>
  </section>
</template>

<script>
import Editor from '@@/components/editor'
import QuestFacade from '@@/facades/quest'
import { EventHub } from '@@/models/event_hub'
export default {
  data () {
    return {
      edit: {
        name: false,
        desc: false,
        dificulty: false
      },
      id: '',
      quest: {
        name: '',
        description: '',
        dificulty: '',
        components: [],
        objectives: {},
        map: {
          doors: [],
          blocks: []
        }
      }
    }
  },
  components: {
    Editor
  },
  created () {
    EventHub.$on('Editor/add', (payload) => {
      console.log(payload)
      switch (payload.type) {
        case 'blocks':
        case 'doors':
          this.addMapComp(payload)
          break
        default:
          this.addComponent(payload)
          break
      }
    })

    EventHub.$on('Editor/remove', (payload) => {
      switch (payload.type) {
        case 'blocks':
        case 'doors':
          this.removeMapComp(payload)
          break
        default:
          this.removeComponent(payload)
          break
      }
    })
  },
  mounted () {
    this.id = this.$route.params.quest
    this.$nextTick(async () => {
      let response = await QuestFacade().getQuest(this.$route.params.quest)
      this.setup(response.data)
    })
  },
  methods: {
    setup (quest) {
      let self = this
      setTimeout(() => {
        self.quest = quest
      }, 500)
    },
    editInfo (node) {
      this.edit[node] = true
    },
    async update () {
      this.edit.name = false
      this.edit.desc = false
      this.edit.dificulty = false
      await QuestFacade().updateQuest({
        id: this.id,
        data: this.quest
      })
    },
    addMapComp (payload) {
      this.quest.map[payload.type].push({
        tiles: payload.tiles,
        id: `comp_${Date.now()}`
      })
    },
    addComponent (payload) {
      this.quest.components.push({
        attributes: {
          tiles: payload.tiles
        },
        collection: payload.collection,
        id: `${payload.type}_${Date.now()}`,
        type: payload.type
      })
    },
    removeMapComp (payload) {
      let arr = this.quest.map[payload.type].filter(b => b.id !== payload.id)
      this.quest.map[payload.type] = arr
    },
    removeComponent (payload) {
      let arr = this.quest.components.filter(c => c.id !== payload.id)
      this.quest.components = arr
    }
  }
}
</script>

<style lang="scss">
</style>
