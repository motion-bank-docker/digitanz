<template lang="pug">
  q-page.q-pt-sm.q-pb-lg
    .q-pt-lg.q-px-lg.row.gutter-sm
      .col-xs-6.col-md-2(v-for="button in buttons", :class="{'inactive': !button.status}")

        q-item.q-pa-none.q-mb-xs
          q-item-main
            q-item-tile.text-center.q-mb-sm.text-grey-9

              //----- tool-button
              q-btn(v-if="button.action !== tool", @click.native="highlightButton(button.action)",
              :icon="button.icon", size="xl", round, flat :disabled="!button.status", no-ripple)

              q-btn.shadow-2.bg-grey-1.text-grey-9(v-else, @click.native="actions(button.action)", size="xl", round, flat)
                q-icon.rotate-180(name="keyboard_backspace", size="30px")

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
        statusInfoBox: 'globalSettings/getStatusInfoBox',
        tool: 'globalSettings/getTool'
      })
    },
    mounted () {
      this.$store.commit('globalSettings/handlerStatusInfoBox')
    },
    methods: {
      highlightButton (val) {
        this.$store.commit('globalSettings/handlerTool', val)
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
</style>
