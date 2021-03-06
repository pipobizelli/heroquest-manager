<template>
  <article class="board">
    <img :src="get_image('board.jpg')" alt="board">
    <section class="tiles_wrapper">
      <template v-for="(line, l) in board.tiles.lines">
        <div v-for="(column, c) in board.tiles.columns"
          :class="[{
              'tile--larger': (c+1)%3 === 0
            },{
              'tile--pathconfig': showPathConfig
            },{
              'tile--disabled': quest.map.disables.indexOf(`${l}:${c}`) >= 0
            },{
              'tile--selected': tiles_selected.indexOf(`${l}:${c}`) >= 0
            },`tileconfig-${get_tile_config(`${l}:${c}`)}`, 'tile']"
          :data-tile="`${l}:${c}`"
          @click="tile_click($event, `${l}:${c}`)"
          @dblclick="tile_dblclick($event, `${l}:${c}`)"
          @contextmenu.prevent="tile_handler($event, `${l}:${c}`)">
          <i class="search-icon search-trap" v-show="quest.map.searchs.traps.indexOf(`${l}:${c}`) >= 0"></i>
          <i class="search-icon search-treasure" v-show="quest.map.searchs.treasures.indexOf(`${l}:${c}`) >= 0"></i>
          <i class="search-icon search-secretdoors" v-show="quest.map.searchs.secretdoors.indexOf(`${l}:${c}`) >= 0"></i>
          <p v-show="showNum">
            {{l}}:{{c}}
          </p>
        </div>
      </template>
      <article class="actors" ref="container">
        <template v-for="block in quest.map.blocks">
          <actor
            :board="board"
            :entity_id="block.id"
            :tiles="block.tiles"
            :handle="block.tiles.length > 1 ? 'doubleblock' : 'block'"
            type="blocks"
            :rotation="0">
          </actor>
        </template>
        <template v-for="door in quest.map.doors">
          <actor
            :board="board"
            :entity_id="door.id"
            :tiles="door.tiles"
            handle="door"
            type="doors"
            :rotation="get_rot(door.tiles)">
          </actor>
        </template>
        <template v-for="stairs in quest.map.stairway">
          <actor
            :board="board"
            :entity_id="stairs.id"
            :tiles="stairs.tiles"
            handle="stairway"
            type="stairway"
            :rotation="stairs.rotate || 0">
          </actor>
        </template>
        <template v-for="objective in Object.values(quest.objectives)">
          <actor
            :board="board"
            :entity_id="objective.id"
            :tiles="objective.attributes.tiles"
            :handle="objective.label"
            :type="objective.type"
            :rotation="objective.rotate || 0">
          </actor>
        </template>
        <template v-for="(comp, index) in quest.components">
          <actor
            :active="active_actor == comp.entity_id || active_actor == comp.class"
            :board="board"
            :entity_id="comp.entity_id || comp.id"
            :tiles="comp.attributes.tiles"
            :handle="comp.label || comp.type"
            :type="comp.class || comp.collection"
            :rotation="comp.rotate || get_rot(comp.attributes.tiles)">
          </actor>
        </template>
      </article>
    </section>
    <slot></slot>
  </article>
</template>

<script>
import interact from 'interactjs'
import HeroquestBoard from '@@/data/heroquest.json'
import Actor from '@@/components/actor.vue'
import Tile from '@@/helpers/tile'
import Config from '@@/config/env'
import DefaultQuest from '@@/data/quest.json'
import { EventHub } from '@@/models/event_hub'
// import Quest from '../data/the_maze'

export default {
  data () {
    return {
      clicks: 0,
      delay: 500,
      showPathConfig: false,
      showNum: false,
      board: {
        tiles: {
          lines: HeroquestBoard.lines,
          columns: HeroquestBoard.columns
        },
        config: HeroquestBoard.config
      }
    }
  },
  props: {
    quest: {
      type: Object,
      default () {
        return DefaultQuest
      }
    },
    active_actor: {
      type: String,
      default () {
        return ''
      }
    },
    tiles_selected: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    Actor
  },
  methods: {
    get_image (img) {
      return `${Config.paths.images}${img}?alt=media`
    },
    set_board_config (val) {
      this.board.config = val
    },
    get_rot (tiles) {
      if (tiles.length < 2 || tiles.length === 4) {
        return 0
      }

      let rot = 0
      tiles.map((t, i) => {
        if (tiles[i + 1]) {
          rot = Tile(this.board).isTileInColumn(t, tiles[i + 1]) ? 90 : 0
        }
      })

      return rot
    },
    get_tile (r, c) {
      return document.querySelectorAll(`[data-tile='${r}:${c}']`)[0]
    },
    snap_target (payload) {
      let target = payload.target
      let tile = this.get_tile(payload.r, payload.c)
      let x = tile.offsetLeft
      let y = tile.offsetTop

      this.set_target_position({
        target,
        x,
        y
      })
    },
    set_target_position (payload) {
      let target = payload.target
      let x = payload.x
      let y = payload.y
      // target.setAttribute('data-tiles', `${payload.r}:${payload.c}`)
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
      target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`
    },
    get_tile_config (tile) {
      return this.board.config[tile].config
    },
    change_tile_config (tile, index, state) {
      var tileConfig = this.get_tile_config(tile).split('')
      tileConfig[index] = state
      this.board.config[tile].config = tileConfig.join('')
    },
    tile_click (e, tile) {
      e.preventDefault()
      EventHub.$emit('Board/action/click', { tile })
    },
    tile_dblclick (e, tile) {
      e.preventDefault()
      EventHub.$emit('Board/action/dbclick', { tile })
    },
    tile_handler (e, tile) {
      // this.open_door(tile)
      e.preventDefault()
      EventHub.$emit('Board/action/handler', { tile })
    }
  },
  mounted () {
    let self = this
    this.$nextTick(function () {
      interact('.draggable').draggable({
        inertia: false,
        autoScroll: false
      }).on('dragmove', (event) => {
        this.set_target_position({
          target: event.target,
          x: (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx,
          y: (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy
        })
      }).on('dragend', (event) => {
        let tile = this.get_tile(0, 0)
        let gridWidth = Math.round(tile.offsetWidth)
        let gridHeight = Math.round(tile.offsetHeight)
        let dataX = Math.round(event.target.getAttribute('data-x'))
        let dataY = Math.round(event.target.getAttribute('data-y'))
        let maxC = self.board.tiles.columns - 1
        let maxR = self.board.tiles.lines - 1

        let c = Math.round(dataX / gridWidth) > 0
          ? Math.round(dataX / gridWidth) > maxC ? maxC : Math.round(dataX / gridWidth)
          : 0
        let r = Math.round(dataY / gridHeight) > 0
          ? Math.round(dataY / gridHeight) > maxR ? maxR : Math.round(dataY / gridHeight)
          : 0

        this.snap_target({
          r,
          c,
          target: event.target
        })

        EventHub.$emit('Board/action/move', {
          start: event.target.dataset.tiles,
          end: `${r}:${c}`,
          actor: event.target.dataset.actor,
          id: event.target.dataset.id
        })

        event.target.setAttribute('data-tiles', `${r}:${c}`)
      })
    })
  }
}
</script>

<style lang="scss">
  .board {
    position: relative;
    width: 100%;
    max-width: 900px;

    > img {
      width: 100%;
    }

    .tiles_wrapper {
      bottom: 1.2%;
      box-sizing: border-box;
      position: absolute;
      left: .6%;
      top: .87%;
      right: .6%;
    }

    .draggable {
      position:absolute;
      touch-action: none;
      user-select: none;
      // width: $tileW;
      // height: $tileH;
      z-index: 3;

      > img {
        width: 100%;
      }
    }
  }
  .tile {
    display: grid;
    grid-template-columns: repeat(auto-fill, 33%);
    font-size: 10px;
    width: 3.8%;
    float: left;
    height: 5.27%;
    box-sizing: border-box;
    z-index: 1;

    &--larger {
      width: 3.95%;
    }

    &--selected {
      background-color: rgba(200,200,200,.5);
    }

    &--disabled {
      background-color: rgba(200,200,200,.8);
    }

    &--green {
      background-color: rgba(99,161,110,.3);
    }

    &--yellow {
      background-color: rgba(238,239,159,.3);
    }

    &--pathconfig {
      box-sizing: border-box;
      position: relative;
      opacity: .5;

      input {
        font-size: 8px;
        border: none;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        opacity: .5;
        text-align: center;
        width: calc(100% - 3px);
      }

      &.tileconfig {
        &-0000 {
          border: 3px solid lightgray;
        }

        &-1000 {
          border: 3px solid lightgray;
          border-top: 3px solid red;
        }

        &-1001 {
          border: 3px solid lightgray;
          border-top: 3px solid red;
          border-left: 3px solid red;
        }

        &-1010 {
          border: 3px solid lightgray;
          border-top: 3px solid red;
          border-bottom: 3px solid red;
        }

        &-1011 {
          border: 3px solid red;
          border-right: 3px solid lightgray;
        }

        &-0100 {
          border: 3px solid lightgray;
          border-right: 3px solid red;
        }

        &-0010 {
          border: 3px solid lightgray;
          border-bottom: 3px solid red;
        }

        &-0001 {
          border: 3px solid lightgray;
          border-left: 3px solid red;
        }

        &-0101 {
          border: 3px solid lightgray;
          border-right: 3px solid red;
          border-left: 3px solid red;
        }

        &-1100 {
          border: 3px solid lightgray;
          border-top: 3px solid red;
          border-right: 3px solid red;
        }

        &-1101 {
          border: 3px solid red;
          border-bottom: 3px solid lightgray;
        }

        &-0110 {
          border: 3px solid lightgray;
          border-right: 3px solid red;
          border-bottom: 3px solid red;
        }

        &-0011 {
          border: 3px solid red;
          border-top: 3px solid lightgray;
          border-right: 3px solid lightgray;
        }

        &-1110 {
          border: 3px solid lightgray;
          border-top: 3px solid red;
          border-right: 3px solid red;
          border-bottom: 3px solid red;
        }

        &-0111 {
          border: 3px solid red;
          border-top: 3px solid lightgray;
        }

        &-1111 {
          border: 3px solid red;
        }
      }
    }
  }

  .search {
    &-icon {
      display: block;
      font-size: 9px;
      border-radius: 10px;
      max-height: 10px;
    }

    &-trap {
      &:before {
        content: "A";
        display: block;
      }
    }

    &-treasure {
      &:before {
        content: "T";
        display: block;
      }
    }

    &-secretdoors {
      &:before {
        content: "S";
        display: block;
      }
    }
  }

</style>
