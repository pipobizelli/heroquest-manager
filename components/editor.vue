<template>
  <section class="editor">
    <board :quest="quest" :tiles_selected="tiles"></board>
    <div class="editor__close-menu" @click="clearTiles" @contextmenu.prevent="clearTiles" v-show="visible"></div>
    <article class="editor__menu" :style="menuStyle" v-show="visible">
      <!-- Actors Options -->
      <ul class="editor__assets" v-if="actors">
        <li class="editor__asset">
          <a href="#" @click.prevent="remove()">
            <font-awesome-icon icon="trash-alt"></font-awesome-icon> remover
          </a>
        </li>
      </ul>

      <!-- Board Options -->
      <ul class="editor__assets" v-if="board">
        <li v-for="asset in assets" class="editor__asset" v-if="asset.condition.indexOf(tiles.length) >= 0">
          <template v-if="asset.sub">
            <div class="editor__sub">
              <a href="#" @mouseover="asset.show = true">
                <font-awesome-icon :icon="asset.icon"></font-awesome-icon>
                <span v-html="asset.label"></span>
              </a>
              <ul class="editor__menu editor__menu--sub" @mouseleave="asset.show = false" v-show="asset.show">
                <li class="editor__item" v-for="sub in asset.sub">
                  <a href="#" @click.prevent="add({
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
            <a href="#" @click.prevent="add({
              type: asset.handle
            })">
              <font-awesome-icon :icon="asset.icon"></font-awesome-icon>
              <span v-html="asset.label"></span>
            </a>
          </template>
        </li>

        <li class="editor__asset" v-if="tileAction">
          <a href="#" @click.prevent="disableTiles">
            <font-awesome-icon icon="ban"></font-awesome-icon>
            <span>desabilitar tiles</span>
          </a>
        </li>

        <li class="editor__asset" v-else>
          <a href="#" @click.prevent="enableTiles">
            <font-awesome-icon icon="check-square"></font-awesome-icon>
            <span>habilitar tiles</span>
          </a>
        </li>
      </ul>
    </article>
  </section>
</template>

<script>
import Config from '@@/config/env'
import Board from '@@/components/board'
import Tile from '@@/helpers/tile'
import MonstersFacade from '@@/facades/monsters'
import FurnitureFacade from '@@/facades/furniture'
import { EventHub } from '@@/models/event_hub'
export default {
  data () {
    return {
      ...Board.data(),
      tiles: [],
      visible: false,
      board: false,
      actors: false,
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
    Board
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

    EventHub.$on('Board/action/handler', (e) => {
      this.showOptions(e, 'board')
      if (this.tiles.length < 1) {
        this.tiles = [e.tile]
      }
    })

    // EventHub.$on('Actor/click', (e) => {
    //   console.log(e)
    // })

    EventHub.$on('Actor/handler', (e) => {
      if (e.type !== 'doors' && e.type !== 'stairway') {
        this.showOptions(e, 'actors')
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

    // EventHub.$on('Actor/tile/click', (tile) => {
    //   if (this.tiles.indexOf(tile) >= 0) {
    //     this.tiles = this.tiles.filter(t => t !== tile)
    //   } else {
    //     this.tiles.push(tile)
    //   }
    // })

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
      this.board = true
      this.actors = true
    },
    showMenu (sub) {
      this.visible = true
      this[sub] = true
    },
    closeMenu () {
      this.visible = false
      this.board = false
      this.actors = false
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

  &__menu{
    background: lightgray;
    margin: 0 0 0 30px;
    padding: 10px;
    position: absolute;
    z-index: 999;
    -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
    -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
    box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
    border-radius: 3px;

    &:before {
      content: "";
      position: absolute;
      display: block;
      top: 7px;
      left: -7px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 10px 10px 10px 0;
      border-color: transparent lightgray transparent transparent;
    }

    &--sub {
      // display: none;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 100%;

      &:before {
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  &__sub {
    position: relative;
  }

  &__item {
    img {
      height: 23px;
    }

    span {
      font-size: 12px;
      line-height: 25px;
    }
  }

  &__item + &__item {
    margin-top: 10px;
  }

  &__close-menu {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 998;
  }

  &__assets {
    a {
      color: black;
      text-decoration: none;
      display: grid;
      grid-column-gap: 10px;
      grid-template-columns: auto 1fr;
    }
  }

  &__assets + &__assets {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 5px dotted gray;
  }

  &__asset + &__asset {
    border-top: 1px solid gray;
    margin-top: 10px;
    padding-top: 10px;
  }
}
</style>
