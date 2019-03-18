<template>
  <section class="session">
    <board :quest="quest"></board>
  </section>
</template>

<script>
import Board from '@@/components/board.vue'
import SessionFacade from '@@/facades/session'
// import Render from '@@/renders/session'
export default {
  data () {
    return {
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
  },
  created () {
    SessionFacade().getSession('IqUvbPFIbemnrGj0FyZj').then((resp) => {
      this.quest.components = resp.data.quest.components
      this.quest.map = resp.data.quest.map
    })
    // let response = Render().start({
    //   session_id: 'IqUvbPFIbemnrGj0FyZj',
    //   slots: [{
    //     character: 'Bob',
    //     tiles: ['0:0']
    //   }]
    // })
    // console.log(response)
    // this.session = response.session
    // this.quest = response.quest
  },
  components: {
    Board
  }
}
</script>
