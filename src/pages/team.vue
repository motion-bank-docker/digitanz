<template lang="pug">
  q-page
    q-card.bg-dark.q-ma-md
      // h3.text-center {{ $t('pages.team.headline') }}
      q-card-title {{ $t('pages.team.headline') }}
      q-card-separator.bg-dark
      q-card-main
        p Florian Jenett
        p.q-mb-none
          | florian@motionbank.org
          br
          | 06131-628-2259
      q-card-separator.bg-dark
      q-card-main
        p Tim Bindel
        p.q-mb-none
          | tbindel@uni-mainz.de
          br
          | 06131-39-23744

</template>

<script>
  export default {
  }
</script>

<style scoped lang="stylus">

</style>
