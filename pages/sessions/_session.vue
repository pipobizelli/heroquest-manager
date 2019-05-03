<template>
  <section class="session">
    <article class="session__info">
      <turns :components="initiative" :active="active_turn"></turns>
      <section class="session__quest container">
        <h2 class="session__quest__title" v-html="quest.title"></h2>
        <p class="session__quest__description" v-html="quest.description"></p>
      </section>
      <button type="button" name="button" @click="undo">Undo</button>
      <nuxt-link to="/sessions" v-html="'Voltar'"></nuxt-link>
    </article>
    <article class="session__board">
      <board :quest="quest" :active_actor="active_actor">
        <gui :menuStyle="menuStyle" v-show="menu_visible" :close="closeMenu">
          <!-- Options -->
          <ul class="menu__assets" v-for="option in options" v-if="option.visible">
            <li v-for="action in option.actions" class="menu__asset">
              <a href="#" @click.prevent="action.callback(action.params)" class="menu__link">
                <font-awesome-icon :icon="action.icon"></font-awesome-icon>
                <span v-html="action.label"></span>
              </a>
            </li>
          </ul>
        </gui>
      </board>
    </article>
  </section>
</template>

<script>
import { EventHub } from '@@/models/event_hub'
import Board from '@@/components/board.vue'
import Turns from '@@/components/turns.vue'
import Gui from '@@/components/menu.vue'
import Tile from '@@/helpers/tile'
import Pathfinder from '@@/helpers/pathfinder'
import SessionFacade from '@@/facades/session'
import DefaultQuest from '@@/data/quest.json'
export default {
  data () {
    return {
      ...Board.data(),
      quest: DefaultQuest,
      turns: [],
      slots: [],
      active_tiles: [],
      active_action: 0,
      active_turn: 0,
      active_actor: '',
      initiative: [],
      menu_visible: false,
      combate_options: false,
      options: {
        combat: {
          visible: false,
          actions: [{
            label: 'atacar',
            icon: 'fist-raised',
            callback: this.fight,
            params: {}
          }]
        },
        search: {
          visible: false,
          actions: [{
            label: 'buscar por armadilha',
            icon: 'mountain',
            callback: this.search,
            params: {
              type: 'traps'
            }
          }, {
            label: 'buscar por passagem secreta',
            icon: 'dungeon',
            callback: this.search,
            params: {
              type: 'secretdoors'
            }
          }, {
            label: 'buscar por tesouros',
            icon: 'gem',
            callback: this.search,
            params: {
              type: 'treasures'
            }
          }]
        },
        self: {
          visible: false,
          actions: [{
            label: 'usar poção',
            icon: 'plus',
            callback: this.usePotion
          }]
        }
      },
      menuStyle: ''
    }
  },
  watch: {
    active_action (val) {
      if (val >= 2) {
        this.active_action = 0
        this.active_turn++
        let order = this.active_turn % this.initiative.length
        this.active_actor = this.initiative[order].entity_id
      }
    },
    turns (val) {
      console.log(val)
    }
  },
  async created () {
    // window.Tile = Tile(this.board)
    EventHub.$on('Board/action/move', (data) => {
      if (data.start !== data.end) {
        this.active_tiles = [data.end]
        this.addAction({
          type: 'move'
        })
        this.active_action++
      }
    })

    EventHub.$on('Actor/handler', (e) => {
      let activeActorDOM = document.querySelectorAll(`[data-id="${this.active_actor}"]`)[0]
      let activeTile = activeActorDOM.dataset.tiles
      if (e.tile === activeTile) {
        this.showMenu({
          ...e,
          type: 'self'
        })
      }

      if (Tile(this.board).isTileAround(activeTile, e.tile)) {
        // todo
        this.showMenu({
          ...e,
          type: 'combat'
        })
      }
    })

    EventHub.$on('Board/action/handler', (e) => {
      this.active_tiles = Pathfinder(this.board).getAllPaths(e.tile)
      this.showMenu({
        ...e,
        type: 'search'
      })
    })

    try {
      var sessionId = this.$route.params.session
      let session = await SessionFacade().getSession(sessionId)
      this.setup(session)
    } catch (e) {
      console.log('[session] load', e)
    }
  },
  methods: {
    setup ({data}) {
      this.quest = data.quest
      this.turns = data.turns
      this.slots = data.slots
      this.active_turn = data.turns.length
      this.setInitiative()
    },
    setInitiative () {
      // Heroes first at all
      this.initiative = this.quest.components.filter(comp => comp.slot >= 0)
      // Monsters after
      this.initiative = this.initiative.concat(this.quest.components.filter(comp => comp.class === 'monster'))
      this.active_actor = this.initiative[this.active_turn].entity_id
    },
    showMenu (payload) {
      this.menu_visible = true
      this.options[payload.type].visible = true
      let pos = Tile(this.board).getTileOffset(payload.tile)
      this.menuStyle = `top: ${pos.y}px; left: ${pos.x}px;`
    },
    closeMenu () {
      this.menu_visible = false
      Object.values(this.options).forEach(option => {
        option.visible = false
      })
    },
    setAction (payload) {
      let component = this.quest.components.filter(c => c.entity_id === payload.id)[0]
      this.turns.push({
        turn: this.active_turn,
        entity_id: payload.id,
        type: payload.type,
        data: {
          ...component,
          ...payload.data
        }
      })
    },
    addAction (payload) {
      this.setAction({
        id: this.active_actor,
        type: payload.type,
        data: {
          attributes: {
            tiles: this.active_tiles
          }
        }
      })
    },
    search (payload) {
      this.closeMenu()
      this.quest.map.searchs[payload.type] = this.active_tiles
      this.addAction({
        type: payload.type
      })
      this.active_action++
      this.active_tiles = []
    },
    undo () {
      this.active_turn = this.active_turn > 0 ? this.active_turn-- : 0
      console.log(this.active_turn, this.initiative.length)
      let order = this.active_turn % this.initiative.length
      console.log('order:', order)
      this.active_actor = this.initiative[order].entity_id
      this.active_tiles = []
      this.applyAction(this.turns[this.active_turn])
    },
    applyAction (turn) {
      console.log(turn)
      this.quest.components.map(c => {
        Object.assign({}, c, turn.data)
      })
    }
  },
  components: {
    Board,
    Turns,
    Gui
  }
}
</script>

<style lang="scss">
@import '~assets/styles/base';
.session {
  display: grid;
  grid-template-columns: 15% auto;
  grid-gap: 10px;

  &__quest {
    &__title {
      font-size: 12px;
      font-weight: bold;
    }

    &__description {
      border-top: 1px solid lightgray;
      font-size: 12px;
      margin-top: 10px;
      padding-top: 10px;
    }
  }
}
</style>
