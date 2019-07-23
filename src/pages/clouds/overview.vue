<template lang="pug">
  q-page.q-pa-md
    .text-center.border-bottom.border-color-grey-4.q-pb-md.q-mb-md(v-if="tempClouds.length <= 0") Leer
    template(v-else)
      .row.justify-between
        template(v-for="(cloud, index) in tempClouds")
          q-list.q-pa-none.q-mb-md.min-height-auto(no-border,
          style="width: 46%;")
            .shadow-1.round-borders(:class="[index < tempClouds.length - 1 ? 'bg-grey-4' : 'bg-white text-grey-8']")
              template(v-for="(term, i) in cloud")
                q-item.q-pa-none.q-px-sm
                  // q-item-side.text-grey-4 {{ i }}
                  q-item-main.q-caption
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
