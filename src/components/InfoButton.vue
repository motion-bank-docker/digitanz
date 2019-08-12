<template lang="pug">
  q-btn.relative-position(v-if="showInfoBox", flat, :size="buttonSize", round)
    span.absolute {{ text }}
    q-spinner-puff(color="grey-9", :size="spinnerSize")
    q-popover.bg-grey-9.q-px-md.q-py-sm.text-grey-1.q-caption.q-mx-sm
      span.q-mr-sm {{ text }}
      .absolute-top-left(style="margin-top: 1px; margin-left: 1px;")
        q-spinner-puff.q-mt-xs.q-ml-sm(color="grey-1", :size="20")
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
    props: ['size', 'text'],
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
        this.spinnerSize = '20'
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
