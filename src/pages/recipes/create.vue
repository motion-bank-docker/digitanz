<template lang="pug">
  q-page.q-pa-lg
    q-btn.float-right.no-padding.no-margin.q-ml-md(v-if="!editMode", @click="editMode = true", round, color="primary", icon="edit")
    q-input.q-title.q-my-md(dark, v-model="newRecipe.title", placeholder="Titel", :error="$v.newRecipe.title.$error",
    :readonly="!editMode", :hide-underline="!editMode")
    // h2.q-display-1.q-ml-lg(v-else) {{newRecipe.title}}
    q-list.q-ml-lg(v-if="newRecipe.entries.length > 0", no-border)
      q-item.items-baseline(v-for="(ingr, index) in newRecipe.entries", :description="ingr", :key="ingr")
        q-item-main
          p.q-title.word-break {{ ingr }}
        q-item-side(v-if="editMode")
          q-btn(icon="keyboard_arrow_up", @click="moveUp(index)")
          q-btn(icon="keyboard_arrow_down", @click="moveDown(index)")
          q-btn(@click="deleteTodoItem(index)", icon="delete")
    q-list.q-pa-lg.no-border.no-padding(v-if="editMode")
      q-item.no-padding
        q-item-main
          q-input(dark, autofocus, v-model="addIngredient", type="textarea", v-on:keyup.enter="addTodoItem",
          placeholder="Rezeptpunkt hinzufügen", :error="$v.newRecipe.entries.$error")
        q-item-side
          q-btn(@click="addTodoItem") hinzufügen
    div.justify-around.row
      q-btn.q-my-md.col-4(v-if="editMode", @click="submitRecipe", color="primary", type="submit") speichern
      // q-btn.q-mt-sm.col-4(@click="remixArray", color="secondary") remix

</template>

<script>
  import { required, minLength } from 'vuelidate/lib/validators'

  export default {
    data () {
      return {
        newRecipe: {
          title: undefined,
          entries: [],
          position: undefined
        },
        submitStatus: null,
        addIngredient: undefined,
        editMode: false,
        cols: []
      }
    },
    validations: {
      newRecipe: {
        title: {
          required,
          minLength: minLength(2)},
        entries: {
          required
        }
      }
    },
    async mounted () {
      if (this.$route.params.uuid) {
        this.anno = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
        this.newRecipe = JSON.parse(this.anno.body.value)
      }
      else {
        this.anno = {
          body: {
            type: 'Recipe',
            purpose: 'personal',
            value: JSON.stringify(this.newRecipe)
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
        this.newRecipe.entries.push(this.addIngredient.trim())
        this.addIngredient = undefined
      },
      deleteTodoItem: function (index) {
        this.newRecipe.entries.splice(index, 1)
      },
      moveUp: function (index) {
        if (index === 0) return
        let a = this.newRecipe.entries
        const moved = a.splice(index, 1)
        a.splice(index - 1, 0, moved[0])
      },
      moveDown: function (index) {
        let a = this.newRecipe.entries
        if (index === a.length - 1) return
        const moved = a.splice(index, 1)
        a.splice(index + 1, 0, moved[0])
      },
      submitRecipe () {
        console.log('submit!')
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.submitStatus = 'ERROR'
        }
        else {
          const _this = this
          console.log(this.newRecipe)
          this.anno.body.value = JSON.stringify(this.newRecipe)
          if (this.anno.uuid) {
            return this.$store.dispatch('annotations/patch', [this.anno.uuid, this.anno])
              .then(recipe => {
                console.log('updated recipe', recipe)
                _this.editMode = false
              })
          }
          return this.$store.dispatch('annotations/post', this.anno)
            .then(recipe => {
              console.log('added recipe', recipe)
              _this.editMode = false
            })
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .word-break
    hyphens: auto
  .error
    border: 1px solid red
  .typo__p
    color: red
</style>
