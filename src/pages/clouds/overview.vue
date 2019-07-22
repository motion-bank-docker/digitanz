<template lang="pug">
  q-page.q-pa-md
    .text-center.border-bottom.border-color-grey-4.q-pb-md.q-mb-md(v-if="!tempClouds") Leer
    template(v-else)
      div.q-mb-md(v-for="cloud in tempClouds") {{ cloud }}
    .text-right
      q-btn.bg-grey-9.text-grey-2(@click="$router.push('/clouds')", no-caps, flat, icon="add", round)
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'overview',
    data () {
      return {
      }
    },
    computed: {
      ...mapGetters({
        tempClouds: 'cloud/getTempClouds'
      })
    }
  }
</script>

<style scoped lang="styl">
</style>
