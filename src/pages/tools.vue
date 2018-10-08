<template lang="pug">
  q-page
    .q-mt-md.row
      .column.items-center.q-mb-xs.col-xs-6.col-md-2(v-for="button in buttons", :class="{'inactive': !button.status}")
        q-btn.q-ma-xs(@click.native="actions(button.action)", :class="{'bg-grey-9': button.status}",
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
          action: 'form',
          icon: 'accessibility',
          label: 'Form',
          status: true
        }, {
          action: 'unset',
          icon: 'stars',
          label: 'Raum',
          status: false
        }, {
          action: 'unset',
          icon: 'stars',
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
        case 'form':
          this.$router.push('/mr-griddle/create')
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
    opacity .2
</style>
