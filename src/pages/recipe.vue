<template lang="pug">
  q-page
    div
      q-btn(
      @click="$router.push('/allrecipes')", round, color="primary", icon="arrow back")

      q-btn.float-right(v-if="!editMode", @click="editMode = true", round, color="primary", icon="edit")

    div.items-start
      q-input.q-title.q-mt-lg.q-mx-lg(v-if="editMode", dark, v-model="newRecipe.title", placeholder="Titel")

      h2.q-display-1.q-ml-lg(v-else) {{newRecipe.title}}

      q-list.q-ml-lg(v-if="newRecipe.entries.length > 0", no-border, v-dragula="newRecipe.entries", style="touch-action:none", drake="furz")
        q-item.items-baseline(v-for="(ingr, index) in newRecipe.entries", :description="ingr", :key="ingr")
          q-item-main
            p.q-title {{ ingr }}
          q-item-side
            q-btn(v-if="editMode", @click="deleteTodoItem(index)", icon="delete")

    div(v-if="editMode")
      q-input.q-ml-lg.q-mr-lg(dark, v-model="addIngedient", type="textarea",
        v-on:keyup.enter="addTodoItem", placeholder="Rezeptpunkt hinzufügen")
        q-btn.vertical-top(@click="addTodoItem") hinzufügen
      div.justify-around.row
        q-btn.q-mt-sm.col-4(@click="saveRecipe", color="primary") speichern
        // q-btn.q-mt-sm.col-4(@click="remixArray", color="secondary") remix
</template>

<script>
  // import { required, minLength } from 'vuelidate/lib/validators'
  export default {
    data () {
      return {
        newRecipe: {
          title: undefined,
          entries: [],
          position: undefined
        },
        addIngedient: undefined,
        editMode: true,
        cols: []
      }
    },
    async mounted () {
      if (this.$route.params.uuid !== 'create') {
        this.anno = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
        this.newRecipe = JSON.parse(this.anno.body.source)
      }
      else {
        this.anno = {
          author: this.$store.state.auth.payload.userId,
          body: {
            type: 'Recipe',
            purpose: 'personal',
            source: JSON.stringify(this.newRecipe)
          }
        }
      }
      /*
      if (!annos || !annos.length) {
        const anno = {
          body: {
            type: 'Recipe',
            source: JSON.stringify({
              title: '',
              entries: []
            })
          }
        }
      }
      */
    },
    methods: {
      addTodoItem: function () {
        this.newRecipe.entries.push(this.addIngedient.trim())
        this.addIngedient = undefined
      },
      deleteTodoItem: function (index) {
        this.newRecipe.entries.splice(index, 1)
      },
      saveRecipe () {
        const _this = this
        console.log(this.newRecipe)
        this.anno.body.source = JSON.stringify(this.newRecipe)
        if (this.anno.uuid) {
          return this.$store.dispatch('annotations/update', [this.anno.uuid, this.anno])
            .then(recipe => {
              console.log('updated recipe', recipe)
              _this.editMode = false
            })
        }
        return this.$store.dispatch('annotations/create', this.anno)
          .then(recipe => {
            console.log('added recipe', recipe)
            _this.editMode = false
          })
      }
    }
  }
</script>
