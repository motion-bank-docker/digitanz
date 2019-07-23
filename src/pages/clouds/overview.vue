<template lang="pug">
  q-page.q-pa-md
    .text-center.border-bottom.border-color-grey-4.q-pb-md.q-mb-md(v-if="tempClouds.length <= 0") Leer
    template(v-else)
      .row
        .col-8.offset-2.shadow-1.round-borders(v-for="(cloud, index) in tempClouds",
        :class="[index < tempClouds.length - 1 ? 'q-mb-md bg-grey-4' : 'bg-white']")

          q-list.q-pa-none(no-border)
            template(v-for="(term, i) in cloud")
              q-item.q-pa-none.q-px-sm
                | {{ term }}
              q-item-separator(v-if="i < cloud.length -1 && index < tempClouds.length - 1").bg-grey-5.q-ma-none
              q-item-separator(v-if="i < cloud.length -1 && index >= tempClouds.length - 1").bg-grey-3.q-ma-none
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
