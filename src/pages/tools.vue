<template lang="pug">
  q-page
    .q-pt-md.q-px-md.row.gutter-sm
      .col-xs-6.col-md-2(v-for="button in buttons", :class="{'inactive': !button.status}")
        // q-btn.full-width.q-py-lg.capitalize(@click.native="actions(button.action)", :class="{'bg-grey-10': button.status}",
        // :disabled="!button.status", size="xl")
        q-btn.full-width.q-px-none.q-py-lg.capitalize(@click.native="actions(button.action)", :class="{'bg-white text-grey-10': button.status}",
        :disabled="!button.status", size="xl")
          q-item.q-pa-none
            q-item-main
              q-item-tile.text-center.q-mb-sm
                q-icon(:name="button.icon", size="xl")
              q-item-tile.text-center
                .q-caption {{ button.label }}

</template>

<script>
  export default {
    data () {
      return {
        buttons: [{
          action: 'mr-griddle',
          icon: 'accessibility',
          label: 'Mr. Griddle Sequenz',
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
          status: true
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
    methods: {
      actions (val) {
        switch (val) {
        case 'clouds':
          this.$router.push('/clouds')
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
  .inactive
    opacity .4
</style>
