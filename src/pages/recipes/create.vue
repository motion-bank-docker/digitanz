<template lang="pug">
  q-page.q-py-md.min-height-auto

    // ---------------------------------------------------------------------------------------------------------- recipe
    div.q-mx-md.bg-e4.text-grey-8.round-borders(style="overflow: hidden;")
      q-list.q-pa-none.no-border.full-width(style="overflow-x: hidden;")

        //----- title
        q-list-header.q-title.min-height-auto.q-px-none.q-py-none(:class="{'bg-grey-1': !showIcon.recipeTitle}")
          .absolute-right.q-mt-md.q-pt-md.q-mr-md.q-px-sm.text-grey-6(v-if="showIcon.recipeTitle && !newRecipe.title")
            q-icon(name="edit", round, size="24px")
          q-input.q-title.q-px-sm.q-py-md(v-model="newRecipe.title",
          type="textarea",
          :error="$v.newRecipe.title.$error",
          hide-underline,
          :class="[!showIcon.recipeTitle ? '' : 'opacity-7']",
          placeholder="Titel", autofocus,
          @focus="showIcon.recipeTitle = false; option = '';",
          @blur="showIcon.recipeTitle = true")

        q-item-separator.q-ma-none.bg-grey-5.opacity-4

        //----- ingredients
        template(v-for="(ingr, index) in newRecipe.entries")
          q-item.q-px-sm.q-py-sm.min-height-auto.transition-padding.relative-position(
          :description="ingr",
          :key="ingr",
          @click="handlerRadiobutton(ingr)",
          :class="[option === ingr ? 'bg-grey-1 text-grey-8' : 'text-grey-6 q-py-sm', {'q-py-md' : (option === ingr)}]",
          multiline)

            //----- ingredient & index
            q-item-side.inactive.q-py-xs
              | {{ index + 1 }}
            q-item-main.transition(style="max-width: 100%;")
              q-radio.text-grey-9.q-py-xs.full-width(v-model="option", :val="ingr") {{ ingr }}

            //----- move-buttons, delete-button
            .absolute-top-right.transition.q-px-sm.items-start.row.q-mt-sm.q-pt-xs(
            :class="[option !== ingr ? 'leave-right-absolute' : '']",
            style="margin-top: 10px;")
              info-button.q-mr-sm(:size="'sm'")
                button-description(:iconName="'keyboard_arrow_up'")
                  | Verschiebe die Zutat nach oben.
                button-description.q-my-sm(:iconName="'keyboard_arrow_down'")
                  | Verschiebe die Zutat nach unten.
                button-description(:iconName="'delete'")
                  | Lösche die Zutat.

              q-btn.bg-grey-3.text-grey-9.shadow-1(@click="moveUp(index)", round, size="sm", flat)
                q-icon(name="keyboard_arrow_up", size="18px")
              q-btn.bg-grey-3.text-grey-9.shadow-1.q-mx-sm(@click="moveDown(index)", round, size="sm", flat)
                q-icon(name="keyboard_arrow_down", size="18px")
              q-btn.bg-grey-3.text-grey-9.shadow-1(@click="deleteTodoItem(index)", round, size="sm", flat)
                q-icon(name="delete", size="16px")

            info-button.absolute-right(v-if="option !== ingr && index === 0", :size="'sm'")
              | Dies ist eine Zutat. Durch antippen lässt sie sich aus- und wieder abwählen.

          q-item-separator.q-ma-none.bg-grey-5.opacity-4

        //----- input
        q-item.no-padding(:class="{'bg-white': focusOnInput}")
          q-item-main(style="max-width: 100%;")
            q-input.q-px-sm.q-pt-md.q-pb-md(
            @click="resetValues", v-model="addIngredient", type="textarea", v-on:keyup.enter="addTodoItem",
            placeholder="Rezepteintrag", :error="$v.newRecipe.entries.$error",
            hide-underline,
            @focus="showIcon.newRecipeEntry = false; option = ''; focusOnInput = true",
            @blur="showIcon.newRecipeEntry = true; focusOnInput = false",
            :after="[{icon: 'edit', condition: showIcon.newRecipeEntry && !addIngredient}]")
          q-item-side.min-width-auto.min-height-auto.transition.row.self-stretch(:class="[!addIngredient ? 'leave-right' : '']")
            .transition.q-px-sm.items-top.row.q-pt-xs.q-mt-sm
              q-btn.bg-grey-3.text-grey-9.shadow-1(@click="addTodoItem", round, size="sm", flat)
                q-icon(name="add", size="16px")
              q-btn.bg-grey-3.text-grey-9.shadow-1.q-ml-sm(@click="resetValues", round, size="sm", flat)
                q-icon(name="clear", size="16px")

    // ----------------------------------------------------------------------------------------------- buttons at bottom
    .q-px-md.q-mt-md.overflow-hidden.row

      .col-6
        q-btn.border.bg-grey-9.text-grey-2.q-mr-md(@click="$router.push('/recipes')", flat, no-caps, icon="clear",
        round)

      .col-6.text-right.relative-position
        .absolute-right.transition(:class="[(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0 ? 'leave-right' : '']")
          q-btn.bg-grey-9.text-grey-2.capitalize(
          v-if="recipe.type === 'remix'",
          @click="submitRemix",
          :disable="(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0",
          type="submit", no-caps, icon="check", round, flat)

          q-btn.bg-grey-9.text-grey-2.capitalize(
          v-else,
          @click="submitRecipe",
          :disable="(addIngredient.length || selectAktion.length || selectGestaltung.length || selectCloudThree.length) > 0",
          type="submit", no-caps, icon="check", round, flat)
</template>

<script>
  import { mapGetters } from 'vuex'
  import { required, minLength } from 'vuelidate/lib/validators'
  import json from '../../components/json/aktionsbegriffe.json'
  import wolkeDrei from '../../components/json/wolkeDrei.json'

  import infoButton from '../../components/InfoButton'
  import buttonDescription from '../../components/ButtonDescription'

  export default {
    components: {
      infoButton,
      buttonDescription
    },
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
        tempTermsNewArranged: [],
        focusOnInput: false
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

        console.log(val, this.option)
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
