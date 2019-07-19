<template lang="pug">
  q-page.q-py-md

    // ---------------------------------------------------------------------------------------------------------- recipe
    div.q-mx-md.shadow-3.bg-dark.round-borders.border-white-1
      q-list.q-pa-none.no-border.full-width(style="overflow-x: hidden;")

        //----- title
        q-list-header.q-title.min-height-auto.q-px-none.q-py-none
          q-input.q-title.q-px-sm.q-py-md(dark, v-model="newRecipe.title",
          type="textarea",
          :error="$v.newRecipe.title.$error",
          :readonly="!editMode", hide-underline,
          :class="{'bg-body-background': !showIcon.recipeTitle}",
          placeholder="Titel", autofocus,
          @focus="showIcon.recipeTitle = false; option = '';",
          @blur="showIcon.recipeTitle = true",
          :after="[{icon: 'edit', condition: showIcon.recipeTitle && editMode}]")

        q-item-separator.q-ma-none.q-mb-sm.bg-grey-9

        //----- ingredients
        q-item.q-px-sm.q-py-xs.min-height-auto(
        v-for="(ingr, index) in newRecipe.entries",
        :description="ingr",
        :key="ingr",
        :class="[{'bg-body-background': option === ingr && editMode}, {'q-mb-sm': index === newRecipe.entries.length - 1 || 0}]",
        multiline
        )
          //----- show list-position from ingredient
          q-item-side.q-py-xs.text-grey-8.min-width-auto.transition(style="width: 30px;",
          :class="{'invisible': option === ingr}") {{ index + 1 }}.

          //----- ingredient
          q-item-main.transition(style="max-width: 100%;",
          :class="[option === ingr ? 'q-pl-sm' : 'q-pr-sm']")
            q-item-tile
              q-radio.full-width.q-mb-none.word-break(v-model="option", :val="ingr",
              :class="[option === ingr && editMode ? 'text-grey-8' : '']")
                div.q-py-xs.full-width(@click="handlerRadiobutton(ingr)") {{ ingr }}

            //----- move-buttons
            .absolute-top-right.transition.q-px-sm.items-start.row(
            v-if="editMode", :class="[option !== ingr ? 'leave-right-absolute' : '']",
            style="margin-top: 3px;")
              q-btn.bg-grey-4.text-grey-10(icon="keyboard_arrow_up", @click="moveUp(index)", round, size="sm", flat)
              q-btn.bg-grey-4.text-grey-10.q-ml-sm(icon="keyboard_arrow_down", @click="moveDown(index)", round, size="sm", flat)

            //----- delete-button
            .absolute-top-left.transition.items-start.row.q-pl-sm(
            v-if="editMode", :class="[option !== ingr ? 'leave-left-absolute' : '']",
            style="margin-top: 3px;")
               q-btn.bg-grey-4.text-grey-10(@click="deleteTodoItem(index)", icon="delete", round, size="sm", flat)

    // ---------------------------------------------------------------------------------------------------------- inputs
    q-list.no-border.q-pa-none.q-mx-md.q-mt-lg(v-if="editMode", style="overflow-x: hidden;")

      q-item.no-padding.q-mb-sm
        q-item-main.border-bottom(style="max-width: 100%;")
          q-input.q-pa-sm(
          @click="resetValues", dark, v-model="addIngredient", type="textarea", v-on:keyup.enter="addTodoItem",
          placeholder="Rezepteintrag", :error="$v.newRecipe.entries.$error",
          hide-underline,
          @focus="showIcon.newRecipeEntry = false; option = '';",
          @blur="showIcon.newRecipeEntry = true",
          :after="[{icon: 'edit', condition: showIcon.newRecipeEntry}]")
        q-item-side.min-width-auto.transition.row.self-stretch(:class="[!addIngredient ? 'leave-right' : '']")
          .transition.q-pl-sm.items-center.row
            q-btn.bg-white.text-grey-10.rotate-90(@click="addTodoItem", icon="keyboard_backspace", round, size="sm")
            q-btn.border.q-ml-sm(@click="resetValues", round, icon="clear", size="sm")

      q-item.no-padding.q-mb-sm
        q-item-main.border-bottom(style="max-width: 100%;")
          q-select.q-pa-sm(
          v-model="selectGestaltung", @focus="resetValues", :options="wordsNewArranged",
          placeholder="Adjektiv", dark, color="white",
          hide-underline)
        q-item-side.min-width-auto.q-pl-sm.transition(:class="[!selectGestaltung ? 'leave-right' : '']")
          .transition
            q-btn.bg-white.text-grey-10(@click="addTodoItem", icon="add", round, size="sm")
            q-btn.border.q-ml-sm(@click="resetValues", round, icon="clear", size="sm")

      q-item.no-padding.q-mb-sm
        q-item-main.border-bottom(style="max-width: 100%;")
          q-select.q-pa-sm(
          v-model="selectAktion", @focus="resetValues", :options="myJson",
          placeholder="Aktionsbegriff", dark, color="white",
          hide-underline)
        q-item-side.min-width-auto.q-pl-sm.transition(:class="[!selectAktion ? 'leave-right' : '']")
          .transition
            q-btn.bg-white.text-grey-10(@click="addTodoItem", icon="add", round, size="sm")
            q-btn.border.q-ml-sm(@click="resetValues", round, icon="clear", size="sm")

      q-item.no-padding
        q-item-main.border-bottom(style="max-width: 100%;")
          q-select.q-pa-sm(
          v-model="selectCloudThree", @focus="resetValues", :options="cloudThree",
          placeholder="Gestaltungsbegriff", dark, color="white",
          hide-underline,
          style="overflow: hidden; text-overflow: ellipsis;")
        q-item-side.min-width-auto.q-pl-sm.transition(:class="[!selectCloudThree ? 'leave-right' : '']")
          .transition
            q-btn.bg-white.text-grey-10(@click="addTodoItem", icon="add", round, size="sm")
            q-btn.border.q-ml-sm(@click="resetValues", round, icon="clear", size="sm")

    // ----------------------------------------------------------------------------------------------- buttons at bottom
    .q-mx-md.q-mt-xl.overflow-hidden
      .row.gutter-sm
        template(v-if="editMode")
          .col-6
            q-btn.border.full-width(@click="$router.push('/recipes')", flat, no-caps) Abbrechen
          .col-6.relative-position
            q-btn.capitalize.full-width(
            @click="submitRecipe",
            :class="[(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0 ? 'leave-bottom' : 'bg-white text-grey-10']",
            :disable="(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0",
            type="submit", no-caps)
              | {{ $t('buttons.save') }}
        template(v-else)
          .col-6
            q-btn.capitalize.full-width.bg-white.text-grey-10(
            @click="editMode = true",
            type="submit", no-caps)
              | Bearbeiten
          .col-6.relative-position
            q-btn.capitalize.full-width.bg-white.text-grey-10(@click="$router.push('/recipes')",
            icon="done", flat, no-caps, label="Fertig")

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
          position: undefined,
          index: undefined
        },
        submitStatus: null,
        selectAktion: '',
        selectGestaltung: '',
        selectCloudThree: '',
        words: [],
        wordsNewArranged: [],
        addIngredient: '',
        editMode: false,
        cols: [],
        option: [],
        showIcon: {
          recipeTitle: false,
          newRecipeEntry: true
        },
        recipe: this.$route.params
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
      console.log('recipe.index', this.recipe.index)
      console.log('recipe.recipe', this.recipe.recipe)
      if (this.recipe.recipe !== undefined) {
        this.newRecipe.title = this.recipe.recipe.title
        this.newRecipe.entries = this.recipe.recipe.entries
      }
      // this.$root.$on('saveTempRecipe', this.onSaveTempRecipe)

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
        user: 'auth/getUserState',
        tempRecipes: 'recipes/getTempRecipes'
      })
    },
    methods: {
      /*
      onSaveTempRecipe (val) {
        console.log(val)
        console.log('this.recipe.index', this.recipe.index)
        if (this.recipe.recipe !== undefined) {
          this.$store.commit('recipes/updateExistingRecipe', this.newRecipe)
        }
        this.$store.commit('recipes/addToTempRecipes', this.newRecipe)
      },
      */
      handlerRadiobutton (val) {
        this.addIngredient = ''
        this.selectAktion = ''
        this.selectGestaltung = ''
        this.selectCloudThree = ''

        if (val === this.option) this.option = []
      },
      resetValues () {
        this.addIngredient = ''
        this.selectAktion = ''
        this.selectGestaltung = ''
        this.selectCloudThree = ''
        this.option = []
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
        // this.$root.$emit('saveTempRecipe')

        if (this.recipe.recipe !== undefined) {
          this.newRecipe.index = this.recipe.index
          this.$store.commit('recipes/updateExistingRecipe', this.newRecipe)
        }
        else {
          this.$store.commit('recipes/addToTempRecipes', this.newRecipe)
        }

        this.$router.push('/recipes')
        /*
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
        */
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
  .leave-right
    margin-right -50vw
    padding-left 10vw

  .leave-right-absolute
    right -50vw
  .leave-left-absolute
    left -50vw

  .leave-bottom
    margin-bottom -100px
  .border-white-1
    border 1px solid rgba(255, 255, 255, .1)
</style>

<style lang="stylus">
  q-if-inner
    background-color green!important
    overflow hidden
    width 100px
    text-overflow ellipsis
  .column
    flex-wrap nowrap
  .q-option-inner
    display none
</style>
