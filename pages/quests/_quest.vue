<template>
  <section class="quest">
    <article class="quest__info">
      <div class="quest__data">
        <h2 class="quest__label">Titulo</h2>
        <p class="quest__value" v-html="quest.name" v-show="!edit.name"></p>
        <input class="quest__field" type="text" name="quest_name" v-show="edit.name" v-model="quest.name">
        <a class="quest__edit" href="#" @click.prevent="editInfo('name')">
          <font-awesome-icon icon="edit"></font-awesome-icon>
        </a>
      </div>
      <div class="quest__data">
        <h2 class="quest__label">Descrição</h2>
        <p class="quest__value" v-html="quest.description" v-show="!edit.desc"></p>
        <textarea class="quest__field" name="quest_desc" rows="6" v-show="edit.desc" v-model="quest.description"></textarea>
        <a class="quest__edit" href="#" @click.prevent="editInfo('desc')">
          <font-awesome-icon icon="edit"></font-awesome-icon>
        </a>
      </div>
      <div class="quest__data">
        <h2 class="quest__label">Dificuldade</h2>
        <p class="quest__value" v-html="quest.dificulty" v-show="!edit.dificulty"></p>
        <select class="quest__dificulty" name="quest-dificulty" v-show="edit.dificulty" v-model="quest.dificulty">
          <option value="easy">Facil</option>
          <option value="normal">Normal</option>
          <option value="hard">Difícil</option>
        </select>
        <a class="quest__edit" href="#" @click.prevent="editInfo('dificulty')">
          <font-awesome-icon icon="edit"></font-awesome-icon>
        </a>
      </div>
    </article>
    <editor :quest="quest"></editor>
    <!-- <button type="button" name="quest_update" @click="update()">Salvar</button> -->
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
          blocks: [],
          stairway: []
        },
        slots: []
      }
    }
  },
  components: {
    Editor
  },
  created () {
    EventHub.$on('Editor/add', (payload) => {
      switch (payload.type) {
        case 'slots':
          this.addSlot(payload)
          break
        case 'blocks':
        case 'doors':
        case 'stairway':
          this.addMapComp(payload)
          break
        default:
          this.addComponent(payload)
          break
      }
    })

    EventHub.$on('Editor/remove', (payload) => {
      switch (payload.type) {
        case 'slots':
          this.removeSlot(payload)
          break
        case 'blocks':
        case 'doors':
        case 'stairway':
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
      }, 300)
    },
    editInfo (node) {
      this.edit[node] = !this.edit[node]
      this.saveQuest()
    },
    update () {
      this.edit.name = false
      this.edit.desc = false
      this.edit.dificulty = false
    },
    async saveQuest () {
      await QuestFacade().updateQuest({
        id: this.id,
        data: this.quest
      })
    },
    addSlot (payload) {
      this.quest.slots.push({
        tiles: payload.tiles
      })
      this.update()
    },
    removeSlot (payload) {
      this.quest.slots = this.quest.slots.filter(s => s.tiles[0] !== payload.tiles[0])
      this.update()
    },
    addMapComp (payload) {
      this.quest.map[payload.type].push({
        tiles: payload.tiles,
        id: `comp_${Date.now()}`
      })
      this.update()
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
      this.update()
    },
    removeMapComp (payload) {
      let arr = this.quest.map[payload.type].filter(b => b.id !== payload.id)
      this.quest.map[payload.type] = arr
      this.update()
    },
    removeComponent (payload) {
      let arr = this.quest.components.filter(c => c.id !== payload.id)
      this.quest.components = arr
      this.update()
    }
  }
}
</script>

<style lang="scss">
.quest {
  display: grid;
  grid-template-columns: 20% auto;
  grid-gap: 10px;

  &__info {
    margin: 10px 0 0 10px;
  }

  &__data {
    background-color: #fff8ea;
    border-radius: 3px;
    padding: 20px;
    -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.3);
    -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.3);
    box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.3);
  }

  &__data + &__data {
    margin-top: 10px;
  }

  &__label {
    font-size: 12px;
    color: gray;
    border-bottom: 1px solid lightgray;
    padding-bottom: 5px;
  }

  &__value {
    display: inline-block;
    margin-top: 10px;
    font-size: 12px;
    font-weight: bold;
    max-width: 120px;
  }

  &__edit {
    color: gray;
    display: inline-block;
    margin: 7px 0 0 10px;
    vertical-align: top;
    text-decoration: none;

    > svg {
      font-size: 16px;
      vertical-align: top;
    }
  }

  &__field {
    display: inline-block;
    margin-top: 10px;
    max-width: 120px;
  }
}
</style>
