<template lang="pug">
  q-page
    .q-pt-lg.q-px-lg.row.gutter-sm
      .col-xs-6.col-md-2(v-for="button in buttons", :class="{'inactive': !button.status}")

        q-btn.full-width.q-pa-none.capitalize.q-mb-xs(:disabled="!button.status", size="xl", flat, no-ripple)
          q-item.q-pa-none
            q-item-main
              q-item-tile.text-center.q-mb-sm.text-grey-9.relative-position(:class="{'button-offset' : button.status}")
                q-btn(@click.native="actions(button.action)",
                :icon="button.icon", size="xl", round, flat, :class="{'shadow-2': button.status}")
                q-btn.q-ml-md.absolute-top-right.bg-grey-3(v-if="button.status", @click="handlerVideoButton()",
                icon="videocam", size="md", round, style="margin-right: -32px;")
              q-item-tile.text-center
                .q-caption.q-pt-xs {{ button.label }}

</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        buttons: [{
          action: 'mr-griddle',
          icon: 'accessibility',
          label: 'Mr. Griddle',
          status: true
        }, {
          action: 'clouds',
          icon: 'cloud',
          label: 'Wortwolke',
          status: true
        }, {
          action: 'recipes',
          icon: 'restaurant_menu',
          label: 'Rezepte',
          status: true
        }, {
          action: 'space-tool',
          icon: 'scatter_plot',
          label: 'Raum',
          status: true
        }, {
          action: 'inspiration',
          icon: 'star_border',
          label: 'Inspiration',
          status: false
        }, {
          action: 'sequenz',
          icon: 'extension',
          label: 'Sequenz',
          status: false
        }, {
          action: 'rhythmus',
          icon: 'linear_scale',
          label: 'Rhythmus',
          status: false
        }]
      }
    },
    computed: {
      ...mapGetters({
        statusInfoBox: 'globalSettings/getStatusInfoBox'
      })
    },
    methods: {
      handlerVideoButton () {
        this.$store.commit('globalSettings/handlerStatusInfoBox')
      },
      actions (val) {
        switch (val) {
        case 'clouds':
          this.$router.push('/clouds/overview')
          break
        case 'sequenz':
          this.$router.push('/sequences/create')
          break
        case 'mr-griddle':
          this.$router.push('/mr-griddle/create')
          break
        case 'recipes':
          this.$router.push('/recipes')
          break
        case 'rhytmus':
          this.$router.push('/rhythm')
          break
        case 'space-tool':
          this.$router.push('/space-tool')
          break
        case 'inspiration':
          this.$router.push('/inspiration')
          break
        case 'unset':
          console.log('unset')
          break
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .button-offset
    margin-right 32px
</style>
