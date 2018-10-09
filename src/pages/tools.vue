<template lang="pug">
  q-page
    .q-mt-md.row
      .column.items-center.q-mb-xs.col-xs-6.col-md-2(v-for="button in buttons", :class="{'inactive': !button.status}")
        q-btn.q-ma-xs(@click.native="actions(button.action)", :class="{'bg-grey-10': button.status}",
        :disabled="!button.status", round, size="xl")
          q-icon(:name="button.icon", size="xl")
        p {{ button.label }}

    q-card.bg-grey-9.q-mx-md.q-mt-xl.q-pa-md.q-mb-md
      // h3.text-center {{ $t('pages.team.headline') }}
      q-card-title {{ $t('pages.team.headline') }}
      q-card-separator.bg-dark
      q-card-main
        p Florian Jenett
        p.q-mb-none
          | florian@motionbank.org
          br
          | 06131-628-2259
      q-card-separator.bg-dark
      q-card-main
        p Tim Bindel
        p.q-mb-none
          | tbindel@uni-mainz.de
          br
          | 06131-39-23744

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
          label: 'Mr. Griddle',
          status: true
        }, {
          action: 'space-tool',
          icon: 'scatter_plot',
          label: 'Raum',
          status: true
        }, {
          action: 'rhytmus',
          icon: 'linear_scale',
          label: 'Rhytmus',
          status: false
        }]
      }
    },
    methods: {
      actions (val) {
        switch (val) {
        case 'sequenz':
          this.$router.push('/sequences/create')
          break
        case 'mr-griddle':
          this.$router.push('/mr-griddle/create')
          break
        case 'space-tool':
          this.$router.push('/space-tool')
          break
        case 'rhytmus':
          this.$router.push('/rhythm')
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
