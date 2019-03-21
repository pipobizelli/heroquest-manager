<template>
  <section class="session">
    <session-form></session-form>
  </section>
</template>

<script>
import SessionForm from '@@/components/session_form.vue'
import SessionFacade from '@@/facades/session'
import { EventHub } from '@@/models/event_hub'
// import Render from '@@/renders/session'
export default {
  created () {
    EventHub.$on('SessionForm/setQuest', async (session) => {
      try {
        var newSession = await SessionFacade().addSession(session)
        this.$router.replace({ path: `sessions/${newSession.data}` })
      } catch (e) {
        console.log('[page] session create')
      }
    })
    EventHub.$on('Board/action/move', (payload) => { console.log(payload) })
  },
  components: {
    SessionForm
  }
}
</script>
