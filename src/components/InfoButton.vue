<template lang="pug">
  q-btn.relative-position(v-if="showInfoBox", flat, :size="buttonSize", round)
    span.absolute {{ nr }}
    q-spinner-puff(color="grey-9", :size="spinnerSize")
    q-popover.bg-grey-9.q-px-md.q-py-sm.text-grey-1.q-caption.q-mx-sm
      span.q-mr-sm.q-pr-xs {{ nr }}
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
        buttonSize: undefined,
        showInfoBox: undefined
      }
    },
    props: ['size', 'nr'],
    computed: {
      ...mapGetters({
        statusInfoBox: 'globalSettings/getStatusInfoBox'
      })
    },
    watch: {
      statusInfoBox () {
        this.showInfoBox = this.statusInfoBox
      }
    },
    mounted () {
      console.log(this.statusInfoBox)
      if (this.size === ('md' || '')) {
        this.spinnerSize = '30'
        this.buttonSize = 'md'
      }
      if (this.size === 'sm') {
        this.spinnerSize = '25'
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
