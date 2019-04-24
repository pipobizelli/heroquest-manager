<template>
  <section class="editor">
    <board :quest="quest" :tiles_selected="tiles">
      <gui :menuStyle="menuStyle" :visible="visible" :close="clearTiles">
        <!-- Actors Options -->
        <ul class="menu__assets" v-if="actorsVisible">
          <li class="menu__asset">
            <a class="menu__link" href="#" @click.prevent="remove()" @mouseover="closeSubMenus">
              <font-awesome-icon icon="trash-alt"></font-awesome-icon> remover
            </a>
          </li>
        </ul>

        <!-- Board Options -->
        <ul class="menu__assets" v-if="boardVisible">
          <li v-if="asset.condition.indexOf(tiles.length) >= 0" v-for="asset in assets" class="menu__asset">
            <template v-if="asset.sub">
              <div class="menu__sub">
                <a class="menu__link" href="#" @mouseover="toggleSub(asset)">
                  <font-awesome-icon :icon="asset.icon"></font-awesome-icon>
                  <span v-html="asset.label"></span>
                </a>
                <ul class="menu__gui menu__list" @mouseleave="asset.show = false" v-show="asset.show">
                  <li class="menu__item" v-for="sub in asset.sub">
                    <a class="menu__link" href="#" @click.prevent="add({
                      type: sub.label,
                      collection: asset.collection
                    })">
                      <img :src="`${image_path}${sub.icon}?alt=media`" :alt="sub.handle">
                      <span v-html="sub.label"></span>
                    </a>
                  </li>
                </ul>
              </div>
            </template>

            <template v-else>
              <a class="menu__link" href="#" @mouseover="closeSubMenus" @click.prevent="add({
                type: asset.handle
              })">
                <font-awesome-icon :icon="asset.icon"></font-awesome-icon>
                <span v-html="asset.label"></span>
              </a>
            </template>
          </li>
          <li v-if="tileAction" class="menu__asset">
            <a class="menu__link" href="#" @click.prevent="disableTiles">
              <font-awesome-icon icon="ban"></font-awesome-icon>
              <span>desabilitar tiles</span>
            </a>
          </li>
          <li v-else class="menu__asset">
            <a class="menu__link" href="#" @click.prevent="enableTiles">
              <font-awesome-icon icon="check-square"></font-awesome-icon>
              <span>habilitar tiles</span>
            </a>
          </li>
        </ul>
      </gui>
    </board>
  </section>
</template>

<script>
import Config from '@@/config/env'
import Board from '@@/components/board'
import Gui from '@@/components/menu'
import Tile from '@@/helpers/tile'
import Pathfinder from '@@/helpers/pathfinder'
import MonstersFacade from '@@/facades/monsters'
import FurnitureFacade from '@@/facades/furniture'
import { EventHub } from '@@/models/event_hub'
export default {
  data () {
    return {
      ...Board.data(),
      tiles: [],
      visible: false,
      boardVisible: false,
      actorsVisible: false,
      menuStyle: '',
      component: {},
      image_path: Config.paths.images,
      assets: {
        slots: {
          handle: 'slots',
          icon: 'map-marker-alt',
          label: 'add slot',
          condition: [1]
        },
        monsters: {
          handle: 'monsters',
          icon: 'skull',
          label: 'add monstro',
          condition: [1],
          show: false,
          collection: 'monsters',
          sub: []
        },
        furniture: {
          handle: 'furniture',
          icon: 'couch',
          label: 'add móveis',
          condition: [1, 3, 6],
          show: false,
          collection: 'furniture',
          sub: []
        },
        doors: {
          handle: 'doors',
          icon: 'dungeon',
          label: 'add porta',
          condition: [2]
        },
        blocks: {
          handle: 'blocks',
          icon: 'th',
          label: 'add bloco',
          condition: [1, 2]
        },
        traps: {
          handle: 'traps',
          icon: 'exclamation-triangle',
          label: 'add armardilha',
          condition: [1]
        },
        secretDoors: {
          handle: 'secretdoors',
          icon: 'eye-slash',
          label: 'add passagem secreta',
          condition: [2]
        },
        stairway: {
          handle: 'stairway',
          icon: 'square',
          label: 'add escada',
          condition: [4]
        }
      }
    }
  },
  props: ['quest'],
  components: {
    Board,
    Gui
  },
  created () {
    EventHub.$on('Board/action/click', (e) => {
      let tile = e.tile
      if (this.tiles.indexOf(tile) >= 0) {
        this.tiles = this.tiles.filter(t => t !== tile)
      } else {
        this.tiles.push(tile)
      }
    })

    EventHub.$on('Board/action/dbclick', (e) => {
      this.tiles = Pathfinder(this.board).getAllPaths(e.tile)
    })

    EventHub.$on('Board/action/handler', (e) => {
      this.showOptions(e, 'boardVisible')
      if (this.tiles.length < 1) {
        this.tiles = [e.tile]
      }
    })

    // EventHub.$on('Actor/click', (e) => {
    //   console.log(e)
    // })

    EventHub.$on('Actor/handler', (e) => {
      if (e.type !== 'doors' && e.type !== 'stairway') {
        this.showOptions(e, 'actorsVisible')
        this.component = {
          id: e.id,
          type: e.type
        }
      }
    })

    EventHub.$on('Actor/tile/handler', (e) => {
      let tile = e.tile
      if (this.tiles.indexOf(tile) >= 0) {
        this.tiles = this.tiles.filter(t => t !== tile)
      } else {
        this.tiles.push(tile)
        this.showOptions(e, 'both')
        this.component = {
          id: e.id,
          type: e.type
        }
      }
    })

    // Load assets
    this.getMonsters()
    this.getForniture()
  },
  computed: {
    tileAction () {
      let disables = this.quest.map.disables
      let activeTiles = true
      this.tiles.map(t => {
        activeTiles = disables.indexOf(t) < 0
      })
      return activeTiles
    }
  },
  methods: {
    async getMonsters () {
      let response = await MonstersFacade().getAllMonsters()
      this.assets.monsters.sub = response.data.map(r => r.data)
    },
    async getForniture () {
      let response = await FurnitureFacade().getAllFurniture()
      this.assets.furniture.sub = response.data.map(r => r.data)
    },
    showOptions (data, sub) {
      this.closeMenu()
      let pos = Tile(this.board).getTileOffset(data.tile)
      this.menuStyle = `top: ${pos.y}px; left: ${pos.x}px;`

      if (sub !== 'both') {
        this.showMenu(sub)
      } else {
        this.showAllMenus()
      }
    },
    showAllMenus (sub) {
      this.visible = true
      this.boardVisible = true
      this.actorsVisible = true
    },
    showMenu (sub) {
      this.visible = true
      this[sub] = true
    },
    closeMenu () {
      this.visible = false
      this.boardVisible = false
      this.actorsVisible = false
      this.closeSubMenus()
    },
    closeSubMenus () {
      let assets = Object.values(this.assets)
      assets.filter(a => a.sub).map(a => {
        a.show = false
      })
    },
    toggleSub (asset) {
      this.closeSubMenus()
      asset.show = !asset.show
    },
    clearTiles () {
      this.closeMenu()
      this.tiles = []
    },
    add (data) {
      EventHub.$emit('Editor/add', {
        type: data.type,
        collection: data.collection || '',
        tiles: this.tiles
      })
      this.clearTiles()
    },
    remove () {
      EventHub.$emit('Editor/remove', this.component)
      this.clearTiles()
    },
    enableTiles () {
      let tiles = this.tiles.filter(t => this.quest.map.disables.indexOf(t) >= 0)
      EventHub.$emit('Editor/enableTiles', tiles)
      this.clearTiles()
    },
    disableTiles () {
      EventHub.$emit('Editor/disableTiles', this.tiles)
      this.clearTiles()
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/base';
.editor {
  position: relative;
}
</style>
