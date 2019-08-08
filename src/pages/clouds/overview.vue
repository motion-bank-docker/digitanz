<template lang="pug">
  q-page.relative-position.min-height-auto

    //--------------------------------------------------------------------------------------------------------- zoom box
    q-modal.bg-grey-1(v-model="zoom", minimized)

        .column.text-center.items-center.row(
        @click="handlerZoom(selectedCloud.terms, selectedCloud.index)",
        style="height: calc(100vh - 30px);")
          .col.q-title.row.q-px-md(v-for="(term, index) in selectedCloud.terms", style="font-weight: normal;")
            .self-center {{ term }}

        //
          .absolute-top-right
            q-btn.text-grey-9(@click="handlerZoom", round, flat)
              q-icon(name="clear")

    //----------------------------------------------------------------------------------------------------------- clouds
    .q-pt-sm
      template(v-if="tempClouds.length > 0")
        q-list.min-height-auto.q-py-none(v-for="(cloud, index) in tempClouds", no-border)
          div.relative-position.overflow-hidden.q-px-md.q-py-sm
            div.shadow-1.bg-e4.text-center.round-borders
              .overflow-hidden.relative-position.round-borders
                q-radio.full-width(
                v-model="optionCloud", :val="index",
                :class="[optionCloud === index ? 'bg-grey-1 text-grey-9' : 'text-grey-8']",
                style="min-height: 100px;")
                  .word-break.full-width.q-px-lg(@click="handlerRadiobutton(index)")
                    template(v-for="(term, i) in cloud")
                      span {{ term }}
                      span(v-if="i < cloud.length - 1") ,&ensp;

                .absolute-top-right.transition.q-mr-sm.q-pt-sm(:class="[optionCloud !== index ? 'leave-right-absolute' : '']")
                  //----- "zoom-box"-button
                  q-btn.bg-grey-3.text-grey-9.shadow-1.q-mx-sm(@click="handlerZoom(cloud, index)", round, size="sm", flat)
                    q-icon(name="fullscreen", size="16px")

                  //----- "remove"-button
                  q-btn.bg-grey-3.text-grey-9.shadow-1(@click="removeTempCloud(index)", round, size="sm", flat)
                    q-icon(name="delete", size="16px")

    // ---------------------------------------------------------------------------------------------------- "add"-button
    .q-px-md.q-pb-md.q-pt-sm
      div.row.items-center.height-empty(v-if="tempClouds.length <= 0")
        q-item.text-center.q-ma-none.full-width
          q-item-main.q-mb-xl
            q-item-tile.inactive.q-title.text-weight-light
              | Noch keine Einträge,
              br
              | füge einen hinzu.
            q-item-tile.q-pt-sm.q-mt-xs
              q-btn.bg-grey-9.text-white(@click="$router.push('/clouds')", round, flat)
                q-icon(name="add")
      q-item.q-pa-none.row.items-center(v-else)
        // q-item-side.inactive(v-if="tempRecipes.length <= 0") Leer

        q-item-main.text-right
          q-btn.bg-grey-9.text-white(
          @click="$router.push('/recipes/create')", round, flat)
            q-icon(name="add")
      //
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
        selectedCloud: {index: undefined, terms: undefined}
      }
    },
    computed: {
      ...mapGetters({
        tempClouds: 'cloud/getTempClouds'
      })
    },
    mounted () {
    },
    methods: {
      handlerZoom (cloud, index) {
        this.selectedCloud.terms = cloud
        this.selectedCloud.index = index
        this.zoom = !this.zoom
      },
      handlerRadiobutton (index) {
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
  @import '~variables'

  .height-empty
    height calc(100vh - 52px - 16px - 8px)
</style>

<style lang="styl">
</style>
