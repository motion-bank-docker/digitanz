<template lang="pug">
  q-page.flex.column

    date-block(v-for="comp in components")
      template(slot="date")
        span {{ comp.description }}
      template(slot="title")
        h4 {{ comp.title }}
      template(slot="sublabel")
        // div {{ comp.description }}
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
          component: 'all-portraits',
          date: this.$t('navigation.portrait.sublabel'),
          title: this.$t('navigation.portrait.label'),
          description: this.$t('navigation.portrait.sublabel')
        }, {
          component: 'all-sequences',
          date: this.$t('navigation.portraitplusplus.sublabel'),
          title: this.$t('navigation.portraitplusplus.label'),
          description: this.$t('navigation.portraitplusplus.sublabel')
        }]
      }
    },
    mounted () {
    }
  }
</script>
