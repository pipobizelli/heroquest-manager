<template>
  <section class="editor">
    <board :quest="quest" :tiles_disabled="tiles"></board>
    <div class="editor__close-menu" @click="clearTiles" @contextmenu.prevent="clearTiles" v-show="visible"></div>
    <article class="editor__menu" :style="menuStyle" v-show="visible">
      <ul class="editor__assets" v-show="board">
        <li v-for="asset in assets" :class="{'editor__asset': asset.condition.indexOf(tiles.length) >= 0}" v-show="asset.condition.indexOf(tiles.length) >= 0">
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
      </ul>

      <ul class="editor__assets" v-show="actors">
        <li class="editor__asset">
          <a href="#" @click.prevent="remove()">
            <font-awesome-icon icon="trash-alt"></font-awesome-icon> remover
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
        blocks: {
          handle: 'blocks',
          icon: 'th',
          label: 'add bloco',
          condition: [1]
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
          condition: [1]
        },
        doors: {
          handle: 'doors',
          icon: 'dungeon',
          label: 'add porta',
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
      console.log(e)
      let tile = e.tile
      if (this.tiles.indexOf(tile) >= 0) {
        this.tiles = this.tiles.filter(t => t !== tile)
      } else {
        this.tiles.push(tile)
      }
    })

    EventHub.$on('Board/action/handler', (e) => {
      this.showActions(e, 'board')
      if (this.tiles.length < 1) {
        this.tiles = [e.tile]
      }
    })

    EventHub.$on('Actor/click', (e) => {
      console.log(e)
      // this.component = {
      //   id: e.id,
      //   type: e.type
      // }
    })

    EventHub.$on('Actor/handler', (e) => {
      this.showActions(e, 'actors')
      this.component = {
        id: e.id,
        type: e.type
      }
    })

    // Load assets
    this.getMonsters()
    this.getForniture()
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
    showActions (data, sub) {
      this.closeMenu()
      let pos = Tile(this.board).getTileOffset(data.tile)
      this.showMenu(sub)
      this.menuStyle = `top: ${pos.y}px; left: ${pos.x}px;`
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
    rotate () {
      EventHub.$emit('Editor/rotate', this.component)
    },
    remove () {
      EventHub.$emit('Editor/remove', this.component)
      this.clearTiles()
    }
  }
}
</script>

<style lang="scss">
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

    &__asset + &__asset {
      border-top: 1px solid gray;
      margin-top: 10px;
      padding-top: 10px;
    }
  }
</style>
