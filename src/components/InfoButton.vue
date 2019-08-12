<template lang="pug">
  q-btn(flat, :size="buttonSize", round)
    q-spinner-puff(color="grey-9", :size="spinnerSize")
    q-popover.bg-grey-9.q-px-md.q-py-sm.text-grey-1.q-caption
      slot
</template>

<script>
  export default {
    name: 'info-button',
    data () {
      return {
        spinnerSize: undefined,
        buttonSize: undefined
      }
    },
    props: ['size'],
    mounted () {
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
