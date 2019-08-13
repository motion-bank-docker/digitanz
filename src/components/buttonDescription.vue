<template lang="pug">
  .row.full-width
    .col-1.text-center
      q-icon.text-grey-1(:name="iName", :size="iSize")
    .col-11.q-pl-sm.text-grey-1
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
      if (this.iconSize === undefined) this.iSize = '16px'
      else this.iSize = this.iconSize

      this.iName = this.iconName
    }
  }
</script>

<style scoped>

</style>
