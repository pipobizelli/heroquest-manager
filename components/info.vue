<template>
  <section class="info">
    <article class="info__resume">
      <img :src="`${image_path}${data.icon}?alt=media`" :alt="data.handle">
      <a href="#" v-html="data.name || data.label"></a>
    </article>

  </section>
</template>

<script>
import Config from '@@/config/env'
export default {
  props: ['data'],
  computed: {
    image_path () {
      return Config.paths.images
    }
  }
}
</script>

<style lang="scss">
</style>
