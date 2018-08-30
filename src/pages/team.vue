<template lang="pug">
  q-page
      h3.text-center {{ $t('pages.team.headline') }}
      p Ihr könnt uns jederzeit kontaktieren.

      .row
        q-list.full-width
          q-item
            .col Tim Bindel
            .col
              | tbindel@uni-mainz.de
              | 06131-39-23744
          q-item(separator)
            .col Florian Jenett
            .col
              | florian@motionbank.org
              | 06131-628-2259
</template>

<script>
  export default {
  }
</script>

<style scoped lang="stylus">

</style>
