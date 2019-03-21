<template>
  <section class="session">
    <article class="session__preset" v-if="!preset">
      <session-form></session-form>
    </article>
    <article class="session__board" v-else>
      <board :quest="quest"></board>
    </article>
  </section>
</template>

<script>
import Board from '@@/components/board.vue'
import SessionForm from '@@/components/session_form.vue'
import SessionFacade from '@@/facades/session'
import { EventHub } from '@@/models/event_hub'
// import Render from '@@/renders/session'
export default {
  data () {
    return {
      preset: false,
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
    // SessionFacade().getSession('IqUvbPFIbemnrGj0FyZj').then((resp) => {
    //   this.quest = resp.data.quest
    // })
    EventHub.$on('SessionForm/setQuest', (session) => {
      try {
        console.log('gravando a quest...', session)
        SessionFacade().addSession(session).then(s => console.log(s))
      } catch (e) {
        console.log('[page] session create')
      }
    })
    EventHub.$on('Board/action/move', (payload) => { console.log(payload) })
  },
  components: {
    Board,
    SessionForm
  }
}
</script>
