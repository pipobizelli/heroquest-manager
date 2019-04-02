<template>
  <section class="session--active">
    <turns :heroes="initiative.heroes" :monsters="initiative.monsters"></turns>
    <board :quest="quest" :active_actor="'barbarian'"></board>
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
    setup (data) {
      this.quest = data.data.quest
      this.turns = data.data.turns
      this.slots = data.data.slots
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
      this.initiative.monsters = this.quest.components.filter(comp => comp.class !== 'hero')
    }
  },
  components: {
    Board,
    Turns
  }
}
</script>

<style lang="css">
</style>
