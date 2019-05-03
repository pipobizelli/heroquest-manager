<template>
  <section class="turns container">
    <h2 class="turns__title">Turnos:</h2>
    <ul class="turns__list">
      <li :class="[{'turns__actor--active': i == actual}, 'turns__actor']" v-for="(hero, i) in heroes">
        <info :data="hero"></info>
      </li>
      <li v-if="hasMonsters" :class="[{'turns__actor--active': actual > (heroes.length - 1)}, 'turns__actor']">
        <info :data="{
          icon: 'chaos.png',
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
    },
    actual () {
      return this.active % this.components.length
    },
    hasMonsters () {
      return this.components.filter(c => c.class === 'monster').length > 0
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
