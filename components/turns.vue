<template>
  <section class="turns container">
    <h2 class="turns__title">Turnos:</h2>
    <ul class="turns__list">
      <li :class="[{'turns__actor--active': i == active}, 'turns__actor']" v-for="(hero, i) in heroes">
        <info :data="hero"></info>
      </li>
      <li class="turns__actor">
        <info :data="{
          icon: 'orc.png',
          handle: 'monstros',
          label: 'Monstros'
        }"></info>
      </li>
    </ul>
  </section>
</template>

<script>
import Info from './info.vue'
export default {
  props: ['components', 'active'],
  components: {
    Info
  },
  computed: {
    heroes () {
      return this.components.filter(c => c.class === 'hero')
    }
  }
}
</script>

<style lang="scss">
@import '~assets/styles/base';
.turns {
  &__title {
    // color: gray;
    font-size: 12px;
  }

  &__list {
    display: block;
    margin-top: 10px;
  }

  &__actor {
    padding: 10px;

    &--active {
      background-color: lightgray;
    }
  }

  &__actor + &__actor {
    border-top: 1px solid lightgray;
  }
}
</style>
