<template lang="pug">
  q-btn.relative-position(v-if="statusInfoBox", flat, :size="buttonSize", round)
    span.absolute {{ nr }}
    q-spinner-puff(color="grey-9", :size="spinnerSize")
    q-popover.bg-grey-9.q-px-md.q-py-sm.text-grey-1.q-caption.q-mx-sm.q-mb-sm(touch-position, anchor="bottom middle",
    self="top middle")
      //
        span.q-mr-sm.q-pr-xs {{ nr }}
      //
        .absolute-top-left(style="margin-top: 2px; margin-left: 3px;")
          q-spinner-puff.q-ml-xs(color="grey-1", :size="25")
      slot
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'info-button',
    data () {
      return {
        spinnerSize: undefined,
        buttonSize: undefined
      }
    },
    props: ['size', 'nr'],
    computed: {
      ...mapGetters({
        statusInfoBox: 'globalSettings/getStatusInfoBox'
      })
    },
    mounted () {
      if (this.size === ('md' || '')) {
        this.spinnerSize = '30'
        this.buttonSize = 'md'
      }
      if (this.size === 'sm') {
        this.spinnerSize = '26'
        this.buttonSize = 'sm'
      }
      if (this.size === 'lg') {
        this.spinnerSize = '40'
        this.buttonSize = 'lg'
      }
    }
  }
</script>

<style scoped lang="styl">
</style>
