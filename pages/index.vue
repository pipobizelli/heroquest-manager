<template>
  <section>
    <h1>Welcome to HeroQuest Manager!</h1>
    <p>Selecione a opção que desejar:</p>
    <ul>
      <li>
        <nuxt-link to="/quests">Quests</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/sessions">Nova Sessão</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/characters">Novo Personagem</nuxt-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
}
</script>

<style lang="scss">
</style>
