<template lang="pug">
  q-page.q-py-md

    // ---------------------------------------------------------------------------------------------------------- recipe
    div.q-mx-md.shadow-1.bg-e4.text-grey-8.round-borders(style="overflow: hidden;")
      q-list.q-pa-none.no-border.full-width(style="overflow-x: hidden;")

        //----- title
        q-list-header.q-title.min-height-auto.q-px-none.q-py-none(:class="{'bg-grey-1': !showIcon.recipeTitle}")
          .absolute-right.q-mt-md.q-pt-md.q-mr-md.q-px-sm.text-grey-6(v-if="showIcon.recipeTitle")
            q-icon(name="edit", round, size="24px")
          q-input.q-title.q-px-sm.q-py-md.q-pr-xl(v-model="newRecipe.title",
          type="textarea",
          :error="$v.newRecipe.title.$error",
          hide-underline,
          :class="[!showIcon.recipeTitle ? 'opacity-7' : 'opacity-3']",
          placeholder="Titel", autofocus,
          @focus="showIcon.recipeTitle = false; option = '';",
          @blur="showIcon.recipeTitle = true")

        q-item-separator.q-ma-none.q-mb-sm.bg-grey-5.opacity-4

        //----- ingredients
        q-item.q-px-sm.q-py-xs.min-height-auto.transition-padding(
        v-for="(ingr, index) in newRecipe.entries",
        :description="ingr",
        :key="ingr",
        :class="[option === ingr ? 'bg-grey-1 text-grey-8 q-py-md' : 'text-grey-6 q-py-sm', {'q-mb-sm': index === newRecipe.entries.length - 1 || 0}]",
        multiline
        )
          //----- show list-position from ingredient
          q-item-side.q-py-xs.min-width-auto.transition.text-grey-6(style="width: 30px;") {{ index + 1 }}

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
          v-model="selectGestaltung", @focus="resetValues", :options="tempTermsNewArranged",
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
    .q-mx-md.q-mt-lg.overflow-hidden

      div.text-right

        q-btn.border.bg-grey-9.text-grey-2.q-mr-md(@click="$router.push('/recipes')", flat, no-caps, icon="clear",
        round)

        q-btn.capitalize(
        v-if="recipe.type === 'remix'",
        @click="submitRemix",
        :class="[(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0 ? '' : 'bg-grey-9 text-grey-2']",
        :disable="(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0",
        type="submit", no-caps, icon="check", round, flat)

        q-btn.capitalize(
        v-else,
        @click="submitRecipe",
        :class="[(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0 ? '' : 'bg-grey-9 text-grey-2']",
        :disable="(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0",
        type="submit", no-caps, icon="check", round, flat)
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
        selectAktion: '',
        selectGestaltung: '',
        selectCloudThree: '',
        addIngredient: '',
        option: [],
        showIcon: {
          recipeTitle: false,
          newRecipeEntry: true
        },
        recipe: this.$route.params,
        tempTermsNewArranged: []
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
      for (let i = 0; i <= this.tempTerms.length - 1; i++) {
        this.tempTermsNewArranged.push({label: this.tempTerms[i], value: this.tempTerms[i]})
      }
    },
    computed: {
      ...mapGetters({
        tempRecipes: 'recipes/getTempRecipes',
        tempTerms: 'cloud/getTempTerms'
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
        if (this.recipe.recipe !== undefined) {
          this.newRecipe.index = this.recipe.index
          this.$store.commit('recipes/updateExistingRemix', this.newRecipe)
        }
        this.$router.push({name: 'recipes', params: {target: 'remix'}})
      }
    }
  }
</script>

<style lang="stylus" scoped>
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
