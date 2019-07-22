<template lang="pug">
  q-page.q-pa-md
    .text-right
      q-btn.bg-grey-9.text-grey-2(@click="$router.push('/clouds')", no-caps, flat, icon="add", round)
</template>

<script>
  export default {
    name: 'overview'
  }
</script>

<style scoped lang="styl">
</style>
