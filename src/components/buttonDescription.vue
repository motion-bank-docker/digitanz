<template lang="pug">
  .row.full-width
    .col-1.text-center
      q-icon(:name="iName", :size="iSize")
    .col-11.q-pl-sm
      slot
</template>

<script>
  export default {
    name: 'button-description',
    props: ['iconName', 'iconSize'],
    data () {
      return {
        iName: undefined,
        iSize: undefined
      }
    },
    mounted () {
      if (this.iconSize === undefined) this.iSize = '14px'
      this.iName = this.iconName
      this.iSize = this.iconSize
    }
  }
</script>

<style scoped>

</style>
