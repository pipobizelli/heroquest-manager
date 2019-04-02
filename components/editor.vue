<template>
  <section class="editor">
    <board :quest="quest" :tiles_disabled="tiles"></board>
    <div class="editor__close-menu" @click="closeMenu()" @contextmenu.prevent="closeMenu()" v-show="visible"></div>
    <article class="editor__menu" :style="menuStyle" v-show="visible">
      <ul class="editor__actions" v-show="board">
        <li v-for="action in actions" v-show="tiles.length >= action.condition">
          <a href="#" @click.prevent="add(action.handle)">
            <font-awesome-icon :icon="action.icon"></font-awesome-icon>
            <span v-html="action.label"></span>
          </a>
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
      actions: [{
        handle: 'blocks',
        icon: 'plus-square',
        label: 'add block',
        condition: 1
      }, {
        handle: 'doors',
        icon: 'plus',
        label: 'add porta',
        condition: 2
      }]
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
    add (type) {
      this.closeMenu()
      EventHub.$emit('Editor/add', {
        type,
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
      }
    }
  }
</style>
