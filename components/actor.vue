<template>
  <div :class="[{
    'draggable': isDraggable(type)
    }, `${handle}--${rotation}`,
     handle, 'actor']"
    :data-actor="handle"
    :data-tiles="tiles"
    :data-x="position.x"
    :data-y="position.y"
    :style="styles"></div>
</template>

<script>
import Tile from '../helpers/tile'
export default {
  data () {
    return {
      position: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    styles () {
      return {
        transform: `translate(${this.position.x}px, ${this.position.y}px) rotate(${this.rotation}deg)`
      }
    }
  },
  props: {
    'handle': {
      type: String
    },
    'type': {
      type: String
    },
    'rotation': {
      type: Number,
      default () {
        return 0
      }
    },
    'tiles': {
      type: Array,
      default () {
        return ['0:0']
      }
    },
    'board': {
      type: Object
    }
  },
  methods: {
    isDraggable (type) {
      return type === 'hero' || type === 'monster'
    },
    getPos () {
      this.position = Tile(this.board).getTileOffset(this.tiles[0])
    }
  },
  mounted () {
    this.getPos()
  }
}
</script>

<style lang="scss">
  @import '~assets/styles/mixins';

  .actors {
    height: 100%;
    width: 100%;
  }

  // One Tile Actors =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  .barbarian { @include oneTileActor('barbarian') }
  .elf { @include oneTileActor('elf') }
  .dwarf { @include oneTileActor('dwarf') }
  .wizard { @include oneTileActor('wizard') }
  .orc { @include oneTileActor('orc') }
  .goblin { @include oneTileActor('goblin') }
  .block { @include oneTileActor('block') }
  .chest { @include oneTileActor('chest') }

  // 2x1 Tiles Actors =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  .doubleblock {
    @include oneTileActor('doubleblock');
    @include doubleW;
  }

  .door {
    @include oneTileActor('door');
    @include doubleW;

    &--90 {
      transform-origin: 17px 17px;
    }
  }

  // 2x2 Tiles Actors =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  .stairway {
    @include oneTileActor('stairway');
    @include doubleH;
    @include doubleW;
  }

  // 2x3 Tiles Actors =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  .table {
    @include oneTileActor('table');
    @include doubleH;
    @include tripleW;

    &--90 {
      transform-origin: 34px 34px;
    }
  }
</style>
