<template lang="pug">
  q-page.flex.column

    date-block(v-for="comp in components")
      q-btn.bg-green.text-white.q-pa-sm.q-caption(slot="label", rounded) {{ comp.date }}
      template(slot="label")
        div
      template(slot="sublabel")
        div
      component(slot="content", :is="comp.component")
      //
        template(slot="buttons")
          q-btn.full-width.bg-dark(v-for="button in comp.buttons", :label="button.label", @click="$router.push('dashboard-new')")
</template>

<script>

  import { allPortraits, allSequences, allGroupSequences } from '../components/dashboard'
  import dateBlock from '../components/dashboard/dateBlock'

  export default {
    components: {
      allPortraits,
      allSequences,
      allGroupSequences,
      dateBlock
    },
    data () {
      return {
        dates: this.$dates(),
        components: [{
          buttons: [{
            label: 'neu'
          }],
          component: 'all-portraits',
          date: '17. August',
          title: 'Termin 1'
        }, {
          buttons: [{
            label: 'neu cdscsd'
          }],
          component: 'all-sequences',
          date: '24. August',
          title: 'Termin 2'
        }]
      }
    },
    mounted () {
    }
  }
</script>
