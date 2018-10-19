<template lang="pug">
  //q-page.flex.column
  q-page

    // h3.text-center Kursübersicht

    public-portraits.bg-dark.q-px-md.q-py-sm.shadow-6

    .q-ma-md
      h3.text-center Geteilte Inhalte

      .q-mt-md
        content-block(v-for="(comp, i) in components")
          template(slot="title") {{ comp.title }}
          template(slot="buttons")
            q-btn.bg-grey-10.shadow-2(label="?", flat, rounded)
              q-popover.bg-dark.q-py-md.q-px-lg
                | {{ comp.description }}
                q-btn.q-mt-md(v-if="comp.component === 'public-sequences'", @click="$router.push('/presentation')") Abgabe festlegen
          template(slot="content")
            component(:is="comp.component")
</template>

<script>

  import { PublicPortraits, PublicMrGriddles, PublicUploads, PublicSequences } from '../components/dashboard'
  import ContentBlock from '../components/ContentBlock'

  export default {
    components: {
      PublicPortraits,
      PublicSequences,
      PublicMrGriddles,
      PublicUploads,
      // PublicGroupSequences,
      ContentBlock
    },
    data () {
      return {
        // dates: this.$dates(),
        components: [{
          component: 'public-uploads',
          day: '2018-08-24',
          date: this.$t('navigation.portraitplusplus.sublabel'),
          title: 'Uploads',
          description: 'no description'
        }, {
          component: 'public-sequences',
          day: '2018-08-24',
          date: this.$t('navigation.portraitplusplus.sublabel'),
          title: 'Sequenzen',
          description: this.$t('navigation.portraitplusplus.sublabel')
        }, {
          component: 'public-mr-griddles',
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
      // console.log('##### dates ', this.$dates)
    }
  }
</script>
