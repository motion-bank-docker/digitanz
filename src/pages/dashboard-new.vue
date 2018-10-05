<template lang="pug">
  //q-page.flex.column
  q-page

    // h3.text-center Kursübersicht

    all-portraits.bg-dark.q-px-md.q-py-sm.shadow-6

    h3.text-center Geteilte Inhalte

    .q-mt-md
      date-block.bg-dark(v-for="(comp, i) in components")
        template(slot="title")
          .row.q-pl-md.q-py-sm.bg-dark
            .col-10.self-center {{ comp.title }}
            .col-2.text-right.q-pr-md
              q-btn.bg-grey-9(label="?", flat, rounded)
                q-popover.bg-dark.q-py-md.q-px-lg {{ comp.description }}
        template(slot="sublabel")
        component(slot="content", :is="comp.component")
        //
          template(slot="buttons")
            q-btn.full-width.bg-dark(v-for="button in comp.buttons", :label="button.label", @click="$router.push('dashboard-new')")
</template>

<script>

  // import { allPortraits, allSequences, allGroupSequences } from '../components/dashboard'
  import { allPortraits, allSequences, allMrGriddles } from '../components/dashboard'
  import dateBlock from '../components/dashboard/dateBlock'

  export default {
    components: {
      allPortraits,
      allSequences,
      allMrGriddles,
      // allGroupSequences,
      dateBlock
    },
    data () {
      return {
        // dates: this.$dates(),
        components: [{
          component: 'all-sequences',
          day: '2018-08-24',
          date: this.$t('navigation.portraitplusplus.sublabel'),
          title: 'Sequenzen',
          description: this.$t('navigation.portraitplusplus.sublabel')
        }, {
          component: 'all-mr-griddles',
          day: '2018-08-24',
          date: this.$t('navigation.portraitplusplus.sublabel'),
          title: 'Mr. Griddles',
          description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
        }]
        // components: [{
        //   component: 'all-portraits',
        //   day: '2018-08-17',
        //   date: this.$t('navigation.portrait.sublabel'),
        //   title: 'Teilnehmerinnen',
        //   description: this.$t('navigation.portrait.sublabel')
        // }, {
        //   component: 'all-sequences',
        //   day: '2018-08-24',
        //   date: this.$t('navigation.portraitplusplus.sublabel'),
        //   title: this.$t('navigation.portraitplusplus.label'),
        //   description: this.$t('navigation.portraitplusplus.sublabel')
        // }]
      }
    },
    mounted () {
      this.components.sort(function (a, b) {
        let x = a.day > b.day ? -1 : 1
        return x
      })
      console.log('##### dates ', this.$dates)
    },
    methods () {
    }
  }
</script>
