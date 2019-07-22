<template lang="pug">
  q-page.q-py-md

    // ---------------------------------------------------------------------------------------------------------- recipe
    div.q-mx-md.shadow-1.bg-grey-4.text-grey-8.round-borders.border-white-1
      q-list.q-pa-none.no-border.full-width(style="overflow-x: hidden;")

        //----- title
        q-list-header.q-title.min-height-auto.q-px-none.q-py-none
          .absolute-right.q-mt-md.q-pt-md.q-mr-md.q-px-sm.text-grey-6(v-if="showIcon.recipeTitle")
            q-icon(name="edit", round, size="24px")
          q-input.q-title.q-px-sm.q-py-md.q-pr-xl(v-model="newRecipe.title",
          type="textarea",
          :error="$v.newRecipe.title.$error",
          hide-underline,
          :class="{'bg-white': !showIcon.recipeTitle}",
          placeholder="Titel", autofocus,
          @focus="showIcon.recipeTitle = false; option = '';",
          @blur="showIcon.recipeTitle = true")

        q-item-separator.q-ma-none.q-mb-sm.bg-grey-5

        //----- ingredients
        q-item.q-px-sm.q-py-xs.min-height-auto.transition-padding(
        v-for="(ingr, index) in newRecipe.entries",
        :description="ingr",
        :key="ingr",
        :class="[option === ingr ? 'bg-white q-py-md' : 'q-py-sm', {'q-mb-sm': index === newRecipe.entries.length - 1 || 0}]",
        multiline
        )
          //----- show list-position from ingredient
          q-item-side.q-py-xs.text-grey-8.min-width-auto.transition(style="width: 30px;") {{ index + 1 }}

          //----- ingredient
          q-item-main.transition(style="max-width: 100%;")
            q-item-tile
              q-radio.full-width.q-mb-none(v-model="option", :val="ingr",
              :class="[option === ingr ? 'text-grey-8' : '']")
                div.q-py-xs.full-width(@click="handlerRadiobutton(ingr)") {{ ingr }}

            //----- move-buttons, delete-button
            .absolute-top-right.transition.q-px-sm.items-start.row.q-mt-sm.q-pt-xs(
            :class="[option !== ingr ? 'leave-right-absolute' : '']",
            style="margin-top: 10px;")
              q-btn.bg-grey-9.text-grey-2(icon="keyboard_arrow_up", @click="moveUp(index)", round, size="sm", flat)
              q-btn.bg-grey-9.text-grey-2.q-ml-sm.q-mr-md(icon="keyboard_arrow_down", @click="moveDown(index)", round, size="sm", flat)
              q-btn.bg-grey-9.text-grey-2(@click="deleteTodoItem(index)", icon="delete", round, size="sm", flat)

            //----- delete-button
              .absolute-top-left.transition.items-start.row.q-pl-sm(
              // :class="[option !== ingr ? 'leave-left-absolute' : '']",
              style="margin-top: 3px;")
                 q-btn.bg-grey-4.text-grey-10(@click="deleteTodoItem(index)", icon="delete", round, size="sm", flat)

    // ---------------------------------------------------------------------------------------------------------- inputs
    q-list.no-border.q-pa-none.q-mx-md.q-mt-lg(style="overflow-x: hidden;")

      q-item.no-padding.q-mb-sm
        q-item-main.border-bottom.border-color-grey-4(style="max-width: 100%;")
          q-input.q-pa-sm(
          @click="resetValues", v-model="addIngredient", type="textarea", v-on:keyup.enter="addTodoItem",
          placeholder="Rezepteintrag", :error="$v.newRecipe.entries.$error",
          hide-underline,
          @focus="showIcon.newRecipeEntry = false; option = '';",
          @blur="showIcon.newRecipeEntry = true",
          :after="[{icon: 'edit', condition: showIcon.newRecipeEntry}]")
        q-item-side.min-width-auto.transition.row.self-stretch(:class="[!addIngredient ? 'leave-right' : '']")
          .transition.q-pl-sm.items-center.row
            q-btn.bg-grey-9.text-grey-2.rotate-90(@click="addTodoItem", icon="add", round, size="sm", flat)
            q-btn.bg-grey-9.text-grey-2.q-ml-sm(@click="resetValues", round, icon="clear", size="sm", flat)

      q-item.no-padding.q-mb-sm
        q-item-main.border-bottom.border-color-grey-4(style="max-width: 100%;")
          q-select.q-pa-sm(
          v-model="selectGestaltung", @focus="resetValues", :options="wordsNewArranged",
          placeholder="Adjektiv", color="grey-8",
          hide-underline)
        q-item-side.min-width-auto.q-pl-sm.transition(:class="[!selectGestaltung ? 'leave-right' : '']")
          .transition
            q-btn.bg-grey-9.text-grey-2(@click="addTodoItem", icon="add", round, size="sm", flat)
            q-btn.bg-grey-9.text-grey-2.q-ml-sm(@click="resetValues", round, icon="clear", size="sm", flat)

      q-item.no-padding.q-mb-sm
        q-item-main.border-bottom.border-color-grey-4(style="max-width: 100%;")
          q-select.q-pa-sm(
          v-model="selectAktion", @focus="resetValues", :options="myJson",
          placeholder="Aktionsbegriff", color="grey-8",
          hide-underline)
        q-item-side.min-width-auto.q-pl-sm.transition(:class="[!selectAktion ? 'leave-right' : '']")
          .transition
            q-btn.bg-grey-9.text-grey-2(@click="addTodoItem", icon="add", round, size="sm", flat)
            q-btn.bg-grey-9.text-grey-2.q-ml-sm(@click="resetValues", round, icon="clear", size="sm", flat)

      q-item.no-padding
        q-item-main.border-bottom.border-color-grey-4(style="max-width: 100%;")
          q-select.q-pa-sm(
          v-model="selectCloudThree", @focus="resetValues", :options="cloudThree",
          placeholder="Gestaltungsbegriff", color="grey-8",
          hide-underline,
          style="overflow: hidden; text-overflow: ellipsis;")
        q-item-side.min-width-auto.q-pl-sm.transition(:class="[!selectCloudThree ? 'leave-right' : '']")
          .transition
            q-btn.bg-grey-9.text-grey-2(@click="addTodoItem", icon="add", round, size="sm", flat)
            q-btn.bg-grey-9.text-grey-2.q-ml-sm(@click="resetValues", round, icon="clear", size="sm", flat)

    // ----------------------------------------------------------------------------------------------- buttons at bottom
    .q-mx-md.q-mt-xl.overflow-hidden
      // .row.gutter-sm
      div.text-right
        // .col-6
        q-btn.border.bg-grey-9.text-grey-2.q-mr-md(@click="$router.push('/recipes')", flat, no-caps, icon="clear",
        round)
            // | Abbrechen
        // .col-6.relative-position
        q-btn.capitalize(
        v-if="recipe.type === 'remix'",
        @click="submitRemix",
        :class="[(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0 ? '' : 'bg-grey-9 text-grey-2']",
        :disable="(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0",
        type="submit", no-caps, icon="check", round, flat)
          // | {{ $t('buttons.save') }}
        q-btn.capitalize(
        v-else,
        @click="submitRecipe",
        :class="[(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0 ? '' : 'bg-grey-9 text-grey-2']",
        :disable="(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0",
        type="submit", no-caps, icon="check", round, flat)
          // | {{ $t('buttons.save') }}
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
      if (this.recipe.recipe !== undefined) {
        this.newRecipe.title = this.recipe.recipe.title
        this.newRecipe.entries = this.recipe.recipe.entries
      }
    },
    computed: {
      ...mapGetters({
        tempRecipes: 'recipes/getTempRecipes'
      })
    },
    methods: {
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
        this.words = await this.$store.dispatch('cloud/listWords')
        for (let i = 0; i <= this.words.length - 1; i++) {
          this.wordsNewArranged.push({label: this.words[i].value, value: this.words[i].value})
        }
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
        if (this.recipe.recipe !== undefined) {
          this.newRecipe.index = this.recipe.index
          this.$store.commit('recipes/updateExistingRecipe', this.newRecipe)
        }
        else {
          this.$store.commit('recipes/addToTempRecipes', this.newRecipe)
        }
        this.$router.push('/recipes')
      },
      submitRemix () {
        console.log('SUBMIT REMIX')
        if (this.recipe.recipe !== undefined) {
          this.$store.commit('recipes/updateExistingRemix', this.newRecipe)
        }
        this.$router.push('/recipes')
      }
    }
  }
</script>

<style lang="stylus" scoped>
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

  .transition-padding
    transition ease 300ms padding
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
