<template>
  <section class="quests">
    <article class="quests__edit">
      <h2 class="quests__title">Lista de Quests:</h2>
      <font-awesome-icon v-show="quests.length < 1" icon="compass" class="fa-spin"></font-awesome-icon>
      <ul class="quests__list">
        <li class="quests__item" v-for="quest in quests">
          <nuxt-link :to="`/quests/${quest.id}`" v-html="quest.data.name"></nuxt-link>
          <a href="#" @click.prevent="removeQuest(quest.id)">
            <font-awesome-icon icon="trash-alt"></font-awesome-icon>
          </a>
        </li>
      </ul>
    </article>
    <article class="quests__new">
      <h2 class="quests__title">Nova Quest:</h2>
      <form class="quests__form">
        <label>
          <h3 class="quests__label">Titulo:</h3>
          <input type="text" name="quest_title" v-model="quest.name">
        </label>
        <label>
          <h3 class="quests__label">Descrição:</h3>
          <textarea name="quest_desc" rows="8" cols="80" v-model="quest.description"></textarea>
        </label>
        <button type="button" name="new_quest" @click="addNewQuest()">Nova Quest</button>
      </form>
    </article>
  </section>
</template>

<script>
import QuestFacade from '@@/facades/quest'
import DefaultQuest from '@@/data/quest.json'
export default {
  data () {
    return {
      errors: [],
      quests: [],
      quest: DefaultQuest
    }
  },
  async created () {
    this.getAllQuests()
  },
  methods: {
    async getAllQuests () {
      let response = await QuestFacade().getAllQuests()
      this.quests = response.data
    },
    async addNewQuest () {
      if (this.quest.name) {
        let newQuest = await QuestFacade().addQuest(this.quest)
        this.$router.replace({ path: `quests/${newQuest.data}` })
      } else {
        this.errors.push({
          error: 'quest-name',
          message: 'O campo nome não pode esta vazio!'
        })
      }
    },
    async removeQuest (id) {
      let response = await QuestFacade().removeQuest(id)
      if (response) {
        this.getAllQuests()
      }
    }
  }
}
</script>

<style lang="scss">
</style>
