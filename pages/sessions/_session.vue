<template>
  <section class="session">
    <article class="session__turns">
      <turns :heroes="initiative.heroes" :monsters="initiative.monsters"></turns>
    </article>
    <article class="session__board">
      <board :quest="quest" active_actor="orc"></board>
    </article>
  </section>
</template>

<script>
import { EventHub } from '@@/models/event_hub'
import Board from '@@/components/board.vue'
import Turns from '@@/components/turns.vue'
import SessionFacade from '@@/facades/session'
export default {
  data () {
    return {
      quest: {
        components: [],
        objectives: {},
        map: {
          doors: [],
          blocks: []
        }
      },
      turns: [],
      slots: [],
      active_turn: 0,
      initiative: {
        heroes: [],
        monsters: []
      }
    }
  },
  async created () {
    EventHub.$on('Board/action/move', (data) => {
      console.log(data)
    })

    try {
      var sessionId = this.$route.params.session
      let session = await SessionFacade().getSession(sessionId)
      this.setup(session)
    } catch (e) {
      console.log('[session] load', e)
    }
  },
  methods: {
    setup ({data}) {
      this.quest = data.quest
      this.turns = data.turns
      this.slots = data.slots
      this.active_turn = data.turns.length
      this.setInitiative()
    },
    setTurn (action) {
      this.turns.push(action)
      this.active_turn = this.turns.length
    },
    setInitiative () {
      // Heroes first at all
      this.initiative.heroes = this.quest.components.filter(comp => comp.slot >= 0)

      // Monsters after
      this.initiative.monsters = this.quest.components.filter(comp => comp.class === 'monster')
    }
  },
  components: {
    Board,
    Turns
  }
}
</script>

<style lang="scss">
.session {
  display: grid;
  grid-template-columns: 15% auto;
}
</style>
