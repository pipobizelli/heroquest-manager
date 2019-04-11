<template>
  <section class="info">
    <article class="info__resume">
      <img class="info__image" :src="`${image_path}${data.icon}?alt=media`" :alt="data.handle">
      <a class="info__label" href="#" @click.prevent="showInfo(data)" v-html="data.name || data.label"></a>
    </article>
  </section>
</template>

<script>
import { EventHub } from '@@/models/event_hub'
import Config from '@@/config/env'
export default {
  props: ['data'],
  computed: {
    image_path () {
      return Config.paths.images
    }
  },
  methods: {
    showInfo (data) {
      console.log(data)
      EventHub.$emit('Info/click', data)
    }
  }
}
</script>

<style lang="scss">
.info {
  &__resume {
    display: grid;
    grid-template-columns: 25px auto;
    grid-column-gap: 10px;
  }

  &__image {
    width: 100%;
  }

  &__label {
    line-height: 25px;
    text-decoration: none;
    color: gray;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
