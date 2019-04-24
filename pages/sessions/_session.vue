<template>
  <section class="session">
    <article class="session__info">
      <turns :components="initiative" :active="active_turn"></turns>
      <section class="session__quest container">
        <h2 class="session__quest__title" v-html="quest.title"></h2>
        <p class="session__quest__description" v-html="quest.description"></p>
      </section>
      <nuxt-link to="/sessions" v-html="'Voltar'"></nuxt-link>
    </article>
    <article class="session__board">
      <board :quest="quest" :active_actor="active_actor">
        <gui :menuStyle="menuStyle" v-show="menu_visible" :close="closeMenu">
          <!-- Combat Options -->
          <ul class="menu__assets" v-if="combate_options">
            <li class="menu__asset">
              <a href="#" class="menu__link">
                <font-awesome-icon icon="fist-raised"></font-awesome-icon> atacar
              </a>
            </li>
          </ul>

          <!-- Search Options -->
          <ul class="menu__assets" v-if="search_options">
            <li class="menu__asset">
              <a href="#" @click.prevent="search({type: 'traps'})" class="menu__link">
                <font-awesome-icon icon="mountain"></font-awesome-icon> buscar por armadilha
              </a>
            </li>
            <li class="menu__asset">
              <a href="#" @click.prevent="search({type: 'secretdoors'})" class="menu__link">
                <font-awesome-icon icon="dungeon"></font-awesome-icon> buscar por passagem secreta
              </a>
            </li>
            <li class="menu__asset">
              <a href="#" @click.prevent="search({type: 'treasures'})" class="menu__link">
                <font-awesome-icon icon="gem"></font-awesome-icon> buscar por tesouros
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
      search_options: false,
      menuStyle: ''
    }
  },
  watch: {
    active_actions (val) {
      if (val >= 2) {
        this.action = 0
        this.active_turn++
      }
    },
    turns (val) {
      console.log(val)
    }
  },
  async created () {
    window.Tile = Tile(this.board)
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
      if (Tile(this.board).isTileAround(activeTile, e.tile)) {
        this.showMenu({
          ...e,
          options: (e.type === 'monster' || e.type === 'hero') ? 'combate_options' : 'search_options'
        })
      }
    })

    EventHub.$on('Board/action/handler', (e) => {
      this.active_tiles = Pathfinder(this.board).getAllPaths(e.tile)
      this.showMenu({
        ...e,
        options: 'search_options'
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
      this[payload.options] = true
      let pos = Tile(this.board).getTileOffset(payload.tile)
      this.menuStyle = `top: ${pos.y}px; left: ${pos.x}px;`
    },
    closeMenu () {
      this.menu_visible = false
      this.combate_options = false
      this.search_options = false
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
