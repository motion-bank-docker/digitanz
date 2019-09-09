<template lang="pug">
  q-page.relative-position.min-height-auto

    //--------------------------------------------------------------------------------------------------------- zoom box
    q-modal.bg-grey-1(v-model="zoom", minimized)

        .column.text-center.items-center.row(
        @click="handlerZoom(selectedCloud.terms, selectedCloud.index)",
        style="height: 100vh;")
          .col.q-title.row.q-px-md(v-for="(term, index) in selectedCloud.terms", style="font-weight: normal;")
            .self-center {{ term }}

    //----------------------------------------------------------------------------------------------------------- clouds
    .q-pt-sm
      template(v-if="tempClouds.length > 0")
        .row
          q-list.min-height-auto.q-py-none.col-xs-12.col-md-8.offset-md-2.col-lg-6.offset-lg-3(v-for="(cloud, index) in tempClouds", no-border)
            div.relative-position.overflow-hidden.q-px-md.q-py-sm
              div.bg-e4.text-center.round-borders
                .overflow-hidden.relative-position.round-borders

                  q-radio.full-width(
                  v-model="optionCloud", :val="index",
                  :class="[optionCloud === index ? 'bg-grey-1 text-grey-9' : 'text-grey-8']",
                  style="min-height: 100px;")
                    .word-break.full-width.q-pa-lg(@click="handlerRadiobutton(index)")
                      template(v-for="(term, i) in cloud")
                        span {{ term }}
                        span(v-if="i < cloud.length - 1") ,&ensp;

                  .absolute-top-right.transition.q-mr-sm.q-pt-sm(:class="[optionCloud !== index ? 'leave-right-absolute' : '']")
                    info-button.q-mr-sm(:size="'sm'")
                      button-description(:iconName="'fullscreen'")
                        | Betrachte die Wortwolke auf ganzer Bildschirmfläche.
                      button-description.q-my-sm(:iconName="'edit'")
                        | Bearbeite die Wortwolke.
                      button-description(:iconName="'delete'")
                        | Lösche die Wortwolke.

                    //----- "zoom-box"-button
                    q-btn.bg-grey-3.text-grey-9.shadow-1(@click="handlerZoom(cloud, index)", round, size="sm", flat)
                      q-icon(name="fullscreen", size="16px")

                    //----- "zoom-box"-button
                    q-btn.bg-grey-3.text-grey-9.shadow-1.q-mx-sm(@click="editCloud(index)", round, size="sm", flat)
                      q-icon(name="edit", size="16px")

                    //----- "remove"-button
                    q-btn.bg-grey-3.text-grey-9.shadow-1(@click="removeTempCloud(index)", round, size="sm", flat)
                      q-icon(name="delete", size="16px")

                  info-button.absolute-top-left.q-ma-sm(v-if="optionCloud === undefined && index === 0", :size="'sm'")
                    | Dies ist eine Wortwolke. Durch antippen lässt sie sich aus- und wieder abwählen.

    // ---------------------------------------------------------------------------------------------------- "add"-button
    .q-px-md.q-pb-md

      //----- empty screen
      .row.items-center.height-empty(v-if="tempClouds.length <= 0")
        q-item.text-center.q-ma-none.full-width
          q-item-main.q-mb-xl

            q-item-tile.inactive.q-title.text-weight-light
              | Noch keine Wortwolken vorhanden,
              | füge eine hinzu.

            q-item-tile.q-pt-sm.q-mt-xs
              q-btn.bg-grey-9.text-white(@click="addCloud()", round, flat)
                q-icon(name="add")

            q-item-tile.q-mt-xs
              info-button(:size="'md'")
                | Wortwolken sind eine Sammlung von Begriffen.
                button-description.q-mt-sx(:iconName="'add'")
                  | Füge hier eine Wortwolke hinzu.

      //----- filled screen
      .text-right.q-pt-sm(v-else)
        q-btn.bg-grey-9.text-white(@click="addCloud()", round, flat)
          q-icon(name="add")

</template>

<script>
  import { mapGetters } from 'vuex'

  import infoButton from '../../components/InfoButton'
  import buttonDescription from '../../components/ButtonDescription'

  export default {
    components: {
      infoButton,
      buttonDescription
    },
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
        tempClouds: 'cloud/getTempClouds',
        cloudIndex: 'cloud/getCloudIndex'
      })
    },
    mounted () {
    },
    methods: {
      addCloud () {
        this.$store.commit('cloud/setCloudIndex', undefined)
        this.$router.push('/clouds')
      },
      editCloud (index) {
        this.$store.commit('cloud/setCloudIndex', index)
        this.$router.push('/clouds')
      },
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
