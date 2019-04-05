<template>
  <div :class="[{
    'draggable': isDraggable(type)
    }, `actor--${rotation}`,
     handle, 'actor']"
    :data-id="entity_id"
    :data-actor="handle"
    :data-tiles="tiles"
    :data-x="position.x"
    :data-y="position.y"
    :style="styles"
    @click="clickActor"
    @contextmenu.prevent="handler"
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
    clickActor (e) {
      EventHub.$emit('Actor/click', {
        e,
        id: this.entity_id,
        type: this.type,
        tile: this.tiles[0]
      })
    },
    handler (e) {
      e.preventDefault()
      EventHub.$emit('Actor/handler', {
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

  .actor {
    &--90 {
      transform-origin: 17px 17px;
    }
  }

  // One Tile Actors =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  .block { @include oneTileActor('block'); }
  .chest { @include oneTileActor('chest'); }
  .throne { @include oneTileActor('throne'); }
  .secretdoor { @include oneTileActor('secretdoor'); }
  .speartrap { @include oneTileActor('speartrap'); }
  .pittrap { @include oneTileActor('pittrap'); }

  // Heroes
  .barbarian { @include oneTileActor('barbarian'); background-size: 85%; }
  .dwarf { @include oneTileActor('dwarf'); background-size: 85%; }
  .elf { @include oneTileActor('elf'); background-size: 85%; }
  .wizard { @include oneTileActor('wizard'); background-size: 85%; }

  // Monters
  .chaos { @include oneTileActor('chaos'); background-size: 85%; }
  .fimir { @include oneTileActor('fimir'); background-size: 85%; }
  .gargoyle { @include oneTileActor('gargoyle'); background-size: 85%; }
  .goblin { @include oneTileActor('goblin'); background-size: 85%; }
  .mummy { @include oneTileActor('mummy'); background-size: 85%; }
  .orc { @include oneTileActor('orc'); background-size: 85%; }
  .skeleton { @include oneTileActor('skeleton'); background-size: 85%; }
  .zombie { @include oneTileActor('zombie'); background-size: 85%; }

  // 2x1 Tiles Actors =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  .doubleblock {
    @include oneTileActor('doubleblock');
    @include doubleW;
  }

  .door {
    @include oneTileActor('door');
    @include doubleW;
  }

  // 1x3 Tiles Actors =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  .bookcase {
    @include oneTileActor('bookcase');
    @include tripleW;
  }

  .cupboard {
    @include oneTileActor('cupboard');
    @include tripleW;
  }

  .fireplace {
    @include oneTileActor('fireplace');
    @include tripleW;
  }

  .weaponsrack {
    @include oneTileActor('weaponsrack');
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
  }

  .tomb {
    @include oneTileActor('tomb');
    @include doubleH;
    @include tripleW;
  }

  .rack {
    @include oneTileActor('rack');
    @include doubleH;
    @include tripleW;
  }

  .alchemistsbench {
    @include oneTileActor('alchemistsbench');
    @include doubleH;
    @include tripleW;
  }

  .sorcererstable {
    @include oneTileActor('sorcererstable');
    @include doubleH;
    @include tripleW;
  }
</style>
