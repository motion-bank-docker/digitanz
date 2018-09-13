<template lang="pug">
  q-page.flex.column

    all-portraits

    h3.text-center Kursübersicht

    .q-mt-md

      date-block.bg-grey-9(v-for="(comp, i) in components", style="border-radius: .25rem; overflow: hidden;")
        template(slot="title")
          h4.text-center {{ comp.title }}
        template(slot="sublabel")
        component(slot="content", :is="comp.component")
        //
          template(slot="buttons")
            q-btn.full-width.bg-dark(v-for="button in comp.buttons", :label="button.label", @click="$router.push('dashboard-new')")
</template>

<script>

  // import { allPortraits, allSequences, allGroupSequences } from '../components/dashboard'
  import { allPortraits, allSequences } from '../components/dashboard'
  import dateBlock from '../components/dashboard/dateBlock'

  export default {
    components: {
      allPortraits,
      allSequences,
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
          title: 'Geteilte Sequenzen',
          description: this.$t('navigation.portraitplusplus.sublabel')
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
      console.log('#####', this.$dates)
    },
    methods () {
    }
  }
</script>
