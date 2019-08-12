<template lang="pug">
  q-btn(flat, :size="spinnerSize", round)
    q-spinner-puff(color="grey-9", size="30px")
    q-popover.bg-grey-9.q-px-md.q-py-sm.text-grey-1.q-caption
      slot
</template>

<script>
  export default {
    name: 'info-button',
    data () {
      return {
        spinnerSize: undefined
      }
    },
    props: ['size'],
    mounted () {
      if (this.size === ('md' || '')) this.spinnerSize = 30
      if (this.size === 'sm') this.spinnerSize = 20
      if (this.size === 'lg') this.spinnerSize = 40
    }
  }
</script>

<style scoped lang="styl">
</style>
