<template lang="pug">
  q-page.q-pa-md

    // ----------------------------------------------------------------------------------------------------- cloud title
    q-input.q-title.q-mb-md.bg-grey-9.q-pa-sm.round-borders(dark, v-model="newRecipe.title", placeholder="Titel",
    :error="$v.newRecipe.title.$error",
    :readonly="!editMode", hide-underline,
    :class="[editMode ? '' : 'q-mt-lg' ]")

    // -------------------------------------------------------------------------------------------------- selected terms
    q-list.q-pa-none(v-if="newRecipe.entries.length > 0", no-border, dark)
      q-item.items-baseline.no-padding(
      v-for="(ingr, index) in newRecipe.entries",
      :description="ingr",
      :key="ingr",
      :class="!editMode ? 'q-my-xs' : 'q-my-sm'"
      )
        q-item-side.text-grey-8(v-if="!editMode") {{ index + 1 }}.
        q-item-main
          p.q-mb-none.word-break {{ ingr }}
        q-item-side(v-if="editMode")
          q-btn.bg-grey-10(icon="keyboard_arrow_up", @click="moveUp(index)", round, size="sm")
          q-btn.q-mx-xs(icon="keyboard_arrow_down", @click="moveDown(index)", round, size="sm")
          q-btn(@click="deleteTodoItem(index)", icon="delete", round, size="sm")

    // ---------------------------------------------------------------------------------------------------------- inputs
    q-list.no-border.q-pa-none.q-my-md(v-if="editMode")

      .border-top.q-pt-md
        q-item.no-padding.q-mb-md
          q-item-main
            q-input.q-pa-sm.bg-dark(
            @click="resetValues", dark, v-model="addIngredient", type="textarea", v-on:keyup.enter="addTodoItem",
            placeholder="Rezepteintrag", :error="$v.newRecipe.entries.$error",
            hide-underline)

        q-item.no-padding.q-mb-md
          q-item-main
            q-select.q-pa-sm.bg-dark(
            v-model="selectGestaltung", @focus="resetValues", :options="wordsNewArranged",
            placeholder="Adjektiv", dark,
            hide-underline)

        q-item.no-padding.q-mb-md
          q-item-main
            q-select.q-pa-sm.bg-dark(
            v-model="selectAktion", @focus="resetValues", :options="myJson",
            placeholder="Aktionsbegriff", dark,
            hide-underline)

        q-item.no-padding.q-mb-md
          q-item-main
            q-select.q-pa-sm.bg-dark(
            v-model="selectCloudThree", @focus="resetValues", :options="cloudThree",
            placeholder="Gestaltungsbegriff", dark,
            hide-underline)

        q-item.no-padding.q-mb-sm.row.justify-between.full-width
          q-btn.border.capitalize(@click="resetValues",
          :disabled="!(addIngredient.length > 0 || selectAktion.length > 0 || selectGestaltung.length > 0 || selectCloudThree.length > 0)",
          no-caps, icon="clear", round, size="sm")

          q-btn.border.capitalize(@click="addTodoItem",
          :class="[(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0 ? 'bg-white text-grey-10' : '']",
          :disabled="!(addIngredient.length > 0 || selectAktion.length > 0 || selectGestaltung.length > 0 || selectCloudThree.length > 0)",
          no-caps, icon="add", round, size="sm")

    // ----------------------------------------------------------------------------------------------------- save button
    q-page-sticky.q-pa-md.bg-dark(v-if="editMode", position="bottom", expand)
      q-btn.full-width(@click="submitRecipe",
      :color="[addIngredient.length > 0 || selectAktion.length > 0 || selectGestaltung.length > 0 || selectCloudThree.length > 0 ? 'grey-9' : 'primary']",
      :disable="addIngredient.length > 0 || selectAktion.length > 0 || selectGestaltung.length > 0 || selectCloudThree.length > 0",
      type="submit",
      )
        | {{ $t('buttons.save') }}
        // q-btn.q-mt-sm.col-4(@click="remixArray", color="secondary") remix

    q-page-sticky(position="top-right")
      q-btn.no-padding.q-ma-md(v-if="!editMode", @click="editMode = true", round, color="primary", icon="edit")

</template>

<script>
  import { mapGetters } from 'vuex'
  import { required, minLength } from 'vuelidate/lib/validators'
  import json from '../../components/json/aktionsbegriffe.json'
  import wolkeDrei from '../../components/json/wolkeDrei.json'

  export default {
    data () {
      return {
        myJson: json,
        cloudThree: wolkeDrei,
        newRecipe: {
          title: undefined,
          entries: [],
          position: undefined
        },
        submitStatus: null,
        selectAktion: '',
        selectGestaltung: '',
        selectCloudThree: '',
        words: [],
        wordsNewArranged: [],
        addIngredient: '',
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
        this.editMode = true
      }
      if (this.user) {
        await this.loadData()
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
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    methods: {
      resetValues () {
        this.addIngredient = ''
        this.selectAktion = ''
        this.selectGestaltung = ''
        this.selectCloudThree = ''
      },
      async loadData () {
        // this.$q.loading.show({ message: this.$t('messages.loading_data') })
        this.words = await this.$store.dispatch('cloud/listWords')
        for (let i = 0; i <= this.words.length - 1; i++) {
          this.wordsNewArranged.push({label: this.words[i].value, value: this.words[i].value})
        }
        // this.$q.loading.hide()
      },
      addTodoItem: function () {
        if (this.addIngredient) {
          this.newRecipe.entries.push(this.addIngredient.trim())
        }
        else if (this.selectAktion) {
          this.newRecipe.entries.push(this.selectAktion.trim())
        }
        else if (this.selectGestaltung) {
          this.newRecipe.entries.push(this.selectGestaltung.trim())
        }
        else if (this.selectCloudThree) {
          this.newRecipe.entries.push(this.selectCloudThree.trim())
        }
        this.addIngredient = ''
        this.selectAktion = ''
        this.selectGestaltung = ''
        this.selectCloudThree = ''
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
  .listItemEditMode
    padding-left 0 !important
    padding-right 0 !important
  .listItem
    padding 8px 0!important
</style>
