<template lang="pug">
  q-page.q-pa-md
    .text-center.border-bottom.border-color-grey-4.q-pb-md.q-mb-md(v-if="!tempClouds") Leer
    .text-right
      q-btn.bg-grey-9.text-grey-2(@click="$router.push('/clouds')", no-caps, flat, icon="add", round)
</template>

<script>
  export default {
    name: 'overview',
    data () {
      return {
        tempClouds: undefined
      }
    }
  }
</script>

<style scoped lang="styl">
</style>
