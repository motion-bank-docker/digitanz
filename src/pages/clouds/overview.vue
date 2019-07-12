<template lang="pug">
  q-page.q-pa-md
    .q-mb-md Meine Wortwolken
    q-btn.border.full-width.text-white(@click="$router.push('/clouds')", no-caps, align="left") Neue Wortwolke
</template>

<script>
  export default {
    name: 'overview'
  }
</script>

<style scoped lang="styl">
</style>
