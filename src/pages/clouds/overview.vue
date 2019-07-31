<template lang="pug">
  q-page.relative-position

    //----- cloud in detail
    .absolute.fit.bg-grey-3.transition.overflow-hidden.transition(style="z-index: 10;",
    :class="[zoom ? '' : 'leave-right-100']")
      .column.text-center.bg-grey-3.items-center.row(@click="handlerZoom(selectedCloud.terms, selectedCloud.index)",
      style="height: calc(100vh - 52px);")
        .col.q-title.row(v-for="(term, index) in selectedCloud.terms")
          .self-center {{ term }}

      .absolute-top-right.q-ma-md
        //
          div.q-bt-sm
            q-btn.bg-grey-9.text-grey-1(@click="handlerZoom", icon="clear", round, flat, size="sm")
        div
          q-btn.bg-grey-9.text-grey-1(icon="delete", @click="removeTempCloud(selectedCloud.index)", round, size="sm", flat)

    //----- clouds
    .q-pt-sm
      template(v-if="tempClouds.length > 0")
        q-list.min-height-auto.q-pa-sm.q-px-md(v-for="(cloud, index) in tempClouds", no-border)
          .round-borders.full-width.shadow-1.q-pa-md.text-center(@click="handlerZoom(cloud, index)")
            template(v-for="(term, i) in cloud")
              span {{ term }}
              span(v-if="i < cloud.length - 1") ,&#32;

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
        console.log('----->', cloud)
        this.zoom = !this.zoom
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
