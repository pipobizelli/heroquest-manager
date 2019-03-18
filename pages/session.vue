<template>
  <section class="session">
    <board :quest="quest"></board>
  </section>
</template>

<script>
import Board from '@@/components/board.vue'
import SessionFacade from '@@/facades/session'
import { EventHub } from '@@/models/event_hub'
// import Render from '@@/renders/session'
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
  methods: {
    setTurn (action) {
      this.turns.push(action)
      this.active_turn = this.turns.length
    }
  },
  created () {
    SessionFacade().getSession('IqUvbPFIbemnrGj0FyZj').then((resp) => {
      this.quest = resp.data.quest
    })
    EventHub.$on('Board/action/move', (payload) => { console.log(payload) })
  },
  components: {
    Board
  }
}
</script>
