<template lang="pug">
  q-page.q-pt-sm

    //----- clouds
    template(v-if="tempClouds.length > 0")
      .row.justify-between.q-px-sm

        template(v-for="(cloud, index) in tempClouds")
          .col-6
            q-list.min-height-auto.q-pa-sm(no-border)
              q-radio.full-width.q-mb-none.word-break.relative-position(v-model="optionCloud",
              :val="index")
                .round-borders.full-width.shadow-1(@click="handlerRadiobutton(index)",
                :class="[optionCloud === index ? 'bg-grey-1 text-grey-8' : 'bg-e4 text-grey-6']")
                  template(v-for="(term, i) in cloud")
                    q-item.q-pa-none.q-px-sm
                      q-item-main.q-caption {{ term }}

                    q-item-separator.q-ma-none(:class="[optionCloud === index ? 'bg-grey-3' : 'bg-grey-5 opacity-4']")

                //----- "remove"-button
                .absolute.full-width.full-height.overflow-hidden(@click="handlerRadiobutton(index)")
                  .absolute-top-right.transition.q-px-sm.q-pt-xs(:class="[optionCloud !== index ? 'leave-right-absolute' : '']")
                    q-btn.bg-grey-9.text-grey-2(icon="delete", @click="removeTempCloud(index)", round, size="sm", flat)

    //----- "add"-button
    .q-px-md.q-pb-md.q-pt-sm
      q-item.q-pa-none.row.items-center
        q-item-side.inactive(v-if="tempClouds.length <= 0") Leer

        q-item-main.text-right
          q-btn.bg-grey-9.text-white(@click="$router.push('/clouds')", round, flat)
            q-icon(name="add")

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
      handlerRadiobutton (index) {
        console.log(this.optionCloud, index)
        if (index === this.optionCloud) this.optionCloud = undefined
      },
      removeTempCloud (index) {
        this.$store.commit('cloud/removeFromTempClouds', index)
      }
    }
  }
</script>

<style scoped lang="styl">
</style>
