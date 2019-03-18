<template>
  <article class="board">
    <section class="tiles_wrapper">
      <template v-for="(line, l) in board.tiles.lines">
        <div v-for="(column, c) in board.tiles.columns"
          :class="[{
              'tile--larger': (c+1)%3 === 0
            },{
              'tile--pathconfig': showPathConfig
            }, `tileconfig-${get_tile_config(`${l}:${c}`)}`, 'tile']"
          :data-tile="`${l}:${c}`"
          @click="get_tile_config(`${l}:${c}`)"
          @contextmenu.prevent="handler($event, `${l}:${c}`)">
          <p v-show="showNum">
            {{l}}:{{c}}
          </p>
          <!-- <input v-show="showPathConfig" type="text" name="config"
          v-model="board.config[(board.tiles.columns * l) + c]" maxlength="10"> -->
        </div>
      </template>
      <article class="actors" ref="container">
        <template v-for="block in quest.map.blocks">
          <actor
            :board="board"
            :tiles="block.tiles"
            :handle="block.tiles.length > 1 ? 'doubleblock' : 'block'"
            type="block"
            :rotation="0">
          </actor>
        </template>
        <template v-for="door in quest.map.doors">
          <actor
            :board="board"
            :tiles="door.tiles"
            handle="door"
            type="door"
            :rotation="get_rot(door)">
          </actor>
        </template>
        <template v-for="objective in Object.values(quest.objectives)">
          <actor
            :board="board"
            :tiles="objective.attributes.tiles"
            :handle="objective.label"
            :type="objective.type"
            :rotation="objective.attributes.rotation">
          </actor>
        </template>
        <template v-for="(comp, index) in quest.components">
          <actor
            :board="board"
            :tiles="comp.attributes.tiles"
            :handle="comp.label"
            :id="comp.id"
            :type="comp.class"
            :rotation="comp.attributes.rotation">
          </actor>
        </template>
      </article>
    </section>
    <img :src="get_image('board.jpg')" alt="board">
  </article>
</template>

<script>
import interact from 'interactjs'
import HeroquestBoard from '@@/data/heroquest.json'
import Actor from '@@/components/actor.vue'
import Tile from '@@/helpers/tile'
import { EventHub } from '@@/models/event_hub'
import { image } from '@@/helpers/media'
// import Quest from '../data/the_maze'

export default {
  data () {
    return {
      gridWidth: 0,
      gridHeight: 0,
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
      default: {
        components: [],
        objectives: {},
        map: {
          doors: [],
          blocks: []
        }
      }
    }
  },
  watch: {
    'board.config' (val, oldVal) {
      this.set_board_config(val)
    }
  },
  components: {
    Actor
  },
  methods: {
    get_image (img) {
      return image(img)
    },
    set_board_config (val) {
      this.board.config = val
    },
    get_rot (actor) {
      var t1 = actor.tiles[0]
      var t2 = actor.tiles[1]
      var rot = 0

      if (Tile(this.board).isTileInColumn(t1, t2)) {
        rot = 90
      }

      return rot
    },
    set_target_position (payload) {
      let target = payload.target
      let tile = document.querySelectorAll(`[data-tile='${payload.r}:${payload.c}']`)[0]
      let x = tile.offsetLeft
      let y = tile.offsetTop
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
    handler (e, tile) {
      // this.open_door(tile)
      e.preventDefault()
    }
  },
  mounted () {
    let self = this
    this.$nextTick(function () {
      interact('.draggable').draggable({
        inertia: false,
        autoScroll: false
      }).on('dragmove', (event) => {
        let target = event.target
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
        target.style.webkitTransform = target.style.transform = `translate(${x}px, ${y}px)`
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      }).on('dragend', (event) => {
        let tile = document.getElementsByClassName('tile')[0]
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

        EventHub.$emit('Board/action/move', {
          tile: `${r}:${c}`,
          actor: event.target.dataset.actor
        })

        this.set_target_position({
          r,
          c,
          target: event.target
        })
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
    // width: $tileW;
    // height: $tileH;
    z-index: 3;

    > img {
      width: 100%;
    }
  }

  // &.auto-play {
  //   .actor { transition: all .2s; }
  // }
}
  .tile {
    font-size: 10px;
    width: 3.8%;
    float: left;
    height: 5.27%;
    box-sizing: border-box;
    z-index: 1;

    &--larger {
      width: 3.95%;
    }

    &--disabled {
      background-color: rgba(200,200,200,.5);
    }

    &--green {
      background-color: rgba(99,161,110,.5);
    }

    &--yellow {
      background-color: rgba(238,239,159,.5);
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
</style>
