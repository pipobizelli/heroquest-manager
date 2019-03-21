<template>
  <section class="session--active">
    <board :quest="quest"></board>
  </section>
</template>

<script>
import Board from '@@/components/board.vue'
import SessionFacade from '@@/facades/session'
export default {
  data () {
    return {
      active_turn: 0,
      turns: [],
      session: {},
      quest: {
        components: [],
        objectives: {},
        map: {
          doors: [],
          blocks: []
        }
      }
    }
  },
  async created () {
    try {
      var sessionId = this.$route.params.session
      let resp = await SessionFacade().getSession(sessionId)
      this.quest = resp.data.quest
    } catch (e) {
      console.log('[session] load', e)
    }
  },
  methods: {
    setTurn (action) {
      this.turns.push(action)
      this.active_turn = this.turns.length
    }
  },
  components: {
    Board
  }
}
</script>

<style lang="css">
</style>
