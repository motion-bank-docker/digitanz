<template lang="pug">
  q-page.q-pa-md
    .text-center.border-bottom.border-color-grey-4.q-pb-md.q-mb-md(v-if="tempClouds.length <= 0") Leer
    template(v-else)
      .row.justify-between
        template(v-for="(cloud, index) in tempClouds")
          .relative-position.overflow-hidden(style="width: 46%;")
            q-list.q-pa-none.q-mb-md.min-height-auto(no-border)
              q-radio.full-width.q-mb-none.word-break(v-model="optionCloud", :val="index")
                .shadow-1.round-borders.full-width(:class="[optionCloud === index ? 'bg-white text-grey-8' : 'bg-grey-4']")
                  template(v-for="(term, i) in cloud")
                    q-item.q-pa-none.q-px-sm
                      // q-item-side.text-grey-4 {{ i }}
                      q-item-main.q-caption
                        | {{ term }}
                    q-item-separator.q-ma-none(:class="[optionCloud === index ? 'bg-grey-3' : 'bg-grey-5']")

              //----- "remove"-button
              .absolute-top-right.transition.q-px-sm.q-pt-xs(:class="[optionCloud !== index ? 'leave-right-absolute' : '']")
                q-btn.bg-grey-9.text-grey-2(icon="delete", @click="removeTempCloud(index)", round, size="sm", flat)

    .text-right
      q-btn.bg-grey-9.text-grey-2(@click="$router.push('/clouds')", no-caps, flat, icon="add", round)
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'overview',
    data () {
      return {
        optionCloud: undefined
      }
    },
    computed: {
      ...mapGetters({
        tempClouds: 'cloud/getTempClouds'
      })
    },
    methods: {
      removeTempCloud (index) {
        this.$store.commit('cloud/removeFromTempClouds', index)
      }
    }
  }
</script>

<style scoped lang="styl">
</style>
