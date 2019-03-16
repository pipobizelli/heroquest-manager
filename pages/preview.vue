<template>
  <section class="preview">
    <board :quest="quest"></board>
  </section>
</template>

<script>
import Board from '@@/components/board.vue'
export default {
  data () {
    return {
      quest: {
        components: {},
        objectives: {},
        map: {
          doors: [],
          blocks: []
        }
      }
    }
  },
  components: {
    Board
  }
}
</script>

<style lang="scss">
</style>
