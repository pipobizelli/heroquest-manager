<template>
  <section class="turn">
    <ul clas="turns__heros-list">
      <li class="turns__actor" v-for="hero in heroes">
        <info :data="hero"></info>
      </li>
      <li class="turns__dm-actors">
        <ul class="turns__monster-list">
          <li class="turns__actor" v-for="monster in monsters">
            <info :data="monster"></info>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script>
import Info from './info.vue'
export default {
  props: ['heroes', 'monsters'],
  components: {
    Info
  }
}
</script>

<style lang="scss">
</style>
