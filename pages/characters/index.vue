<template>
  <section class="character">
    <h2 class="character__title title">Novo personagem:</h2>
    <form class="character-form__form">
      <label>
        <h3 class="character-form__label">Nome:</h3>
        <input type="text" name="character-name" v-model="name">
      </label>

      <label>
        <h3 class="character-form__label">Classe:</h3>
        <select name="character-class" v-model="klass">
          <option value="" disabled>Classe do personagem</option>
          <option v-for="c in classes" :value="c.value" v-html="c.label"></option>
        </select>
      </label>

      <button type="button" name="create" @click="create_character">Criar</button>
    </form>
  </section>
</template>

<script>
export default {
  data () {
    return {
      classes: [{
        label: 'Anão',
        value: 'dwarf'
      }, {
        label: 'Bárbaro',
        value: 'barbarian'
      }, {
        label: 'Elfo',
        value: 'elf'
      }, {
        label: 'Mago',
        value: 'wizard'
      }],
      name: '',
      klass: ''
    }
  }
}
</script>

<style lang="scss">
</style>
