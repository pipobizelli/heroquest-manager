<template>
  <section class="info">
    <article class="info__resume">
      <img :src="`${image_path}${data.icon}?alt=media`" :alt="data.handle">
      <a href="#" v-html="data.name || data.label"></a>
    </article>

  </section>
</template>

<script>
export default {
  props: ['data'],
  computed: {
    image_path () {
      return 'https://firebasestorage.googleapis.com/v0/b/heroquest-manager.appspot.com/o/'
    }
  }
}
</script>

<style lang="scss">
</style>
