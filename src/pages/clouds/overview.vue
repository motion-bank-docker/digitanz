<template lang="pug">
  q-page.relative-position.min-height-auto

    //--------------------------------------------------------------------------------------------------------- zoom box
    q-modal.bg-grey-3(v-model="zoom", minimized)
      div.fit.bg-grey-1.shadow-1

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
        q-list.min-height-auto.q-pa-sm.q-px-md(v-for="(cloud, index) in tempClouds", no-border)
          q-radio.round-borders.full-width.shadow-1.bg-e4.q-pa-md.text-center.relative-position.overflow-hidden(
          v-model="optionCloud", :val="index",
          @click="handlerRadiobutton(index)",
          :class="[optionCloud === index ? 'bg-grey-1 text-grey-9' : 'text-grey-8']",
          style="min-height: 100px;")
            .word-break.full-width.q-mx-md
              template(v-for="(term, i) in cloud")
                span {{ term }}
                span(v-if="i < cloud.length - 1") ,&ensp;

            //----- "remove"-button
            .absolute.full-width.full-height.overflow-hidden.items-center(@click="handlerRadiobutton(index)")
              .absolute-top-right.transition.q-mr-md.q-px-sm.q-pt-sm(:class="[optionCloud !== index ? 'leave-right-absolute' : '']")
                q-btn.bg-grey-9.text-grey-2(icon="delete", @click="removeTempCloud(index)", round, size="sm", flat)
              .absolute-bottom-right.transition.q-mr-md(:class="[optionCloud !== index ? 'leave-right-absolute' : '']")
                q-btn.text-grey-9.q-pr-sm.q-pb-none(icon="zoom_in", @click="handlerZoom(cloud, index)", size="lg",
                flat, no-ripple)

    // ---------------------------------------------------------------------------------------------------- "add"-button
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
</style>

<style lang="styl">
</style>
