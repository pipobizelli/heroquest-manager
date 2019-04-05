<template>
  <section class="editor">
    <board :quest="quest" :tiles_disabled="tiles"></board>
    <div class="editor__close-menu" @click="closeMenu()" @contextmenu.prevent="closeMenu()" v-show="visible"></div>
    <article class="editor__menu" :style="menuStyle" v-show="visible">
      <ul class="editor__actions" v-show="board">
        <li v-for="action in actions" v-show="tiles.length >= action.condition">
          <template v-if="action.sub">
            <div class="editor__sub">
              <a href="#" @mouseover="action.show = true">
                <font-awesome-icon :icon="action.icon"></font-awesome-icon>
                <span v-html="action.label"></span>
              </a>
              <ul class="editor__menu editor__menu--sub" @mouseleave="action.show = false" v-show="action.show">
                <li class="editor__item" v-for="sub in action.sub">
                  <a href="#" @click.prevent="add({
                    type: sub.handle,
                    collection: action.collection
                  })">
                    <img :src="`${image_path}${sub.image}?alt=media`" :alt="sub.handle" v-if="sub.image">
                    <font-awesome-icon :icon="sub.icon" v-else></font-awesome-icon>
                    <span v-html="sub.label"></span>
                  </a>
                </li>
              </ul>
            </div>
          </template>

          <template v-else>
            <a href="#" @click.prevent="add(action.handle)">
              <font-awesome-icon :icon="action.icon"></font-awesome-icon>
              <span v-html="action.label"></span>
            </a>
          </template>
        </li>
      </ul>

      <ul class="editor__actions" v-show="actors">
        <li>
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
      actions: {
        actors: {
          handle: 'actors',
          icon: 'skull',
          label: 'add monster',
          condition: 1,
          show: false,
          collection: 'monsters',
          sub: []
        },
        furniture: {
          handle: 'furniture',
          icon: 'couch',
          label: 'add móveis',
          condition: 3,
          show: false,
          collection: 'furniture',
          sub: []
        },
        blocks: {
          handle: 'blocks',
          icon: 'plus-square',
          label: 'add block',
          condition: 1
        },
        traps: {
          handle: 'traps',
          icon: 'exclamation-triangle',
          label: 'add armardilha',
          condition: 1
        },
        secretDoors: {
          handle: 'secret-doors',
          icon: 'eye-slash',
          label: 'add passagem secreta',
          condition: 1
        },
        doors: {
          handle: 'doors',
          icon: 'dungeon',
          label: 'add porta',
          condition: 2
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
      this.showActions(e, 'board')
      if (this.tiles.length < 1) {
        this.tiles = [e.tile]
      }
    })

    EventHub.$on('Actor/click', (e) => {
      this.showActions(e, 'actors')
      this.component = {
        id: e.id,
        type: e.type
      }
    })
  },
  methods: {
    getAllComponents (collection) {

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
    add (data) {
      this.closeMenu()
      EventHub.$emit('Editor/add', {
        type: data.type,
        collection: data.collection || '',
        tiles: this.tiles
      })
      this.tiles = []
    },
    remove () {
      this.closeMenu()
      EventHub.$emit('Editor/remove', this.component)
      this.tiles = []
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
      max-width: 140px;

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
        right: -125px;

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
      line-height: 20px;

      img {
        width: 25px;
      }

      span {
        font-size: 12px;
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

    &__actions {
      > li + li {
        border-top: 1px solid gray;
        margin-top: 10px;
        padding-top: 10px;
      }

      a {
        color: black;
        text-decoration: none;
        display: grid;
        grid-column-gap: 5px;
        grid-template-columns: 25px auto;
      }
    }
  }
</style>
