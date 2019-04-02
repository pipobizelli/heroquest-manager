<template>
  <div :class="[{
    'draggable': isDraggable(type)
    }, `${handle}--${rotation}`,
     handle, 'actor']"
    :data-id="entity_id"
    :data-actor="handle"
    :data-tiles="tiles"
    :data-x="position.x"
    :data-y="position.y"
    :style="styles"
    @contextmenu.prevent="handler($event)"
    ></div>
</template>

<script>
import Tile from '../helpers/tile'
import { EventHub } from '@@/models/event_hub'
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
    'entity_id': {
      type: String
    },
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
    },
    'active': {
      type: Boolean,
      default: false
    }
  },
  watch: {
    tiles () {
      this.getPos()
    }
  },
  methods: {
    isDraggable (type) {
      return (type === 'hero' || type === 'monster') && this.active
    },
    getPos () {
      this.position = Tile(this.board).getTileOffset(this.tiles[0])
    },
    handler (e) {
      e.preventDefault()
      EventHub.$emit('Actor/click', {
        e,
        id: this.entity_id,
        type: this.type,
        tile: this.tiles[0]
      })
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
  .block { @include oneTileActor('block') }
  .chest { @include oneTileActor('chest') }
  .chaos { @include oneTileActor('chaos') }
  .dwarf { @include oneTileActor('dwarf') }
  .elf { @include oneTileActor('elf') }
  .fimir { @include oneTileActor('fimir') }
  .gargoyle { @include oneTileActor('gargoyle') }
  .goblin { @include oneTileActor('goblin') }
  .mummy { @include oneTileActor('mummy') }
  .orc { @include oneTileActor('orc') }
  .skeleton { @include oneTileActor('skeleton') }
  .wizard { @include oneTileActor('wizard') }
  .zombie { @include oneTileActor('zombie') }

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

  // 1x3 Tiles Actors =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  .bookcase {
    @include oneTileActor('bookcase');
    @include tripleW;
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
