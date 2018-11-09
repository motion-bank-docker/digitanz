<template lang="pug">
  q-page
    .q-mt-md.row
      .column.items-center.q-mb-xs.col-xs-6.col-md-2(v-for="button in buttons", :class="{'inactive': !button.status}")
        q-btn.q-ma-xs(@click.native="actions(button.action)", :class="{'bg-grey-10': button.status}",
        :disabled="!button.status", round, size="xl")
          q-icon(:name="button.icon", size="xl")
        p {{ button.label }}

</template>

<script>
  export default {
    data () {
      return {
        buttons: [{
          action: 'sequenz',
          icon: 'extension',
          label: 'Sequenz',
          status: true
        }, {
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
