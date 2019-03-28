<template>
  <section class="character">
    <h2 class="character__title title">Novo personagem:</h2>
    <form class="character-form__form">
      <label>
        <h3 class="character-form__label">Quest:</h3>
        <input type="text" name="character-name" value="" v-model="name">
      </label>

      <button type="button" name="create" @click="create_session">Play!</button>
    </form>
  </section>
</template>

<script>
export default {
}
</script>

<style lang="scss">
</style>
