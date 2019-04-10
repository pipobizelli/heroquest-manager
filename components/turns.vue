<template>
  <section class="turns">
    <h2 class="turns__title">Turnos:</h2>
    <ul clas="turns__list">
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
.turns {
  margin: 10px 0 0 10px;
  background-color: #fff8ea;
  border-radius: 3px;
  padding: 10px;
  -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.3);
  -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.3);
  box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.3);

  &__title {
    color: gray;
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
