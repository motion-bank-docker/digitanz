<template lang="pug">
  .row.items-center(style="height: 52px;")

    q-item.q-pa-none.full-width(style="min-height: auto;")

      //----- play-/stop-button
      q-item-side.q-ml-md.q-pr-xs(style="min-width: auto;")
        q-btn.text-white.q-pa-none.bg-transparent(@click="$emit('clickPlay')", :icon="$props.play ? 'pause' : 'play_arrow'",
        :class="[$props.play ? 'text-grey-9' : 'text-grey-9', {'leave-bottom': states.length <= 0}]", flat,
        size="lg", no-ripple,
        :disabled="states.length === 0")

      //----- state-buttons
      q-item-main.q-pl-sm
        q-btn.q-mx-xs(v-for="(state, index) in states",
        round,  size="sm", flat,
        v-model="selectedStates",
        val="'option-' + {{index}}",
        @click="handlerStateButton(state, index)")
          q-btn(round,  size="sm", flat, :class="[currentState === index ? 'bg-grey-9' : 'bg-d4 scaled']")
          q-popover.q-pa-xs(anchor="top middle", self="bottom middle", :offset="[0, 12]", ref="popover",
          style="overflow: visible;")
            div.absolute-bottom.full-width.animation(
            style="align-items: center; display: flex; justify-content: center;")
              div.rotate-45.bg-white(style="width: 20px; height: 20px;")
            q-btn.text-grey-9(@click="deleteItem({state, index})", icon="delete", round, flat)

      //----- add-butoon
      q-item-side.q-mr-md(style="min-width: auto;")
        q-btn.no-padding.bg-grey-9.text-grey-2.transition(icon="add", size="sm", flat, no-ripple,
        round, @click="$emit('clickAdd')",
        :class="{'leave-bottom': states.length >= 5}",
        :disabled="states.length >= 5")

</template>

<script>
  import ConfirmModal from '../components/ConfirmModal'

  export default {
    components: {
      ConfirmModal
    },
    props: [
      'states',
      'play',
      'currentState',
      'edit'
    ],
    data () {
      return {
        selectedStates: []
      }
    },
    watch: {
      play () {
        console.log(this.$props.play)
      }
    },
    methods: {
      handlerStateButton (state, index) {
        this.$emit('clickState', {state, index})
        if (this.$props.play) this.$emit('clickPlay')
      },
      deleteItem (item) {
        this.$refs.popover[item.index].hide()
        this.$emit('deleteItem', item)
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .scaled
    transform scale(.5)

  // prevents fading of the arrow below the "delete"-popover for whatever reason
  .animation
    animation ease

</style>
