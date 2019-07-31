<template lang="pug">
  q-page.relative-position

    //----- cloud in detail
    .absolute.fit.bg-grey-3.transition.overflow-hidden.transition(style="z-index: 10;",
    :class="[zoom ? '' : 'leave-right-100']")
      .column.text-center.bg-grey-3.items-center.row(style="height: calc(100vh - 52px);")
        .col.q-title.row(v-for="(term, index) in selectedCloud.terms")
          .self-center {{ term }}
      .absolute-top-right.q-ma-md
        q-btn.bg-grey-9.text-grey-1.q-mr-sm(icon="delete", @click="removeTempCloud(selectedCloud.index)", round, size="sm", flat)
        q-btn.bg-grey-9.text-grey-1(@click="handlerZoom", icon="clear", round, flat, size="sm")

    //----- clouds
    .q-pt-sm
      template(v-if="tempClouds.length > 0")
        .row.justify-between.q-px-sm

          template(v-for="(cloud, index) in tempClouds")
            .col-12
              q-list.min-height-auto.q-pa-sm(no-border)
                q-radio.full-width.q-mb-none.word-break.relative-position(v-model="optionCloud",
                :val="index")
                  //
                    .round-borders.full-width.shadow-1.q-pa-md.text-center(@click="handlerRadiobutton(index)",
                    // :class="[optionCloud === index ? 'bg-grey-1 text-grey-9' : 'text-grey-8']")
                  .round-borders.full-width.shadow-1.q-pa-md.text-center(@click="handlerZoom(cloud, index)")
                    template(v-for="(term, i) in cloud")
                      span {{ term }}
                      span(v-if="i < cloud.length - 1") ,&#32;

                  //----- "remove"-button
                    .absolute.full-width.full-height.overflow-hidden.items-center(@click="handlerRadiobutton(index)")
                      .absolute-top-right.transition.q-px-sm.q-pt-sm.q-mt-xs(:class="[optionCloud !== index ? 'leave-right-absolute' : '']")
                        q-btn.bg-grey-9.text-grey-2(icon="delete", @click="removeTempCloud(index)", round, size="sm", flat)
                        q-btn.bg-grey-9.text-grey-2.q-ml-sm(icon="visibility", @click="handlerZoom(cloud)", round, size="sm", flat)

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
        optionCloud: undefined,
        zoom: false,
        selectedCloud: {index: undefined, terms: undefined},
        windowInnerHeight: undefined
      }
    },
    computed: {
      ...mapGetters({
        tempClouds: 'cloud/getTempClouds'
      })
    },
    mounted () {
      this.windowInnerHeight = window.innerHeight - 52
    },
    methods: {
      handlerZoom (cloud, index) {
        this.selectedCloud.terms = cloud
        this.selectedCloud.index = index
        this.zoom = !this.zoom
      },
      handlerRadiobutton (index) {
        console.log(this.optionCloud, index)
        if (index === this.optionCloud) this.optionCloud = undefined
      },
      removeTempCloud (index) {
        this.zoom = false
        this.$store.commit('cloud/removeFromTempClouds', index)
      }
    }
  }
</script>

<style scoped lang="styl">
</style>
