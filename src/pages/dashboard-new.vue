<template lang="pug">
  q-page.flex.column

    .q-mt-md
      // date-block.bg-dark.text-white.q-caption
        div(slot="description") vbjdfhkvbsjkhcd

      date-block.bg-dark(v-for="(comp, i) in components", style="border-radius: .25rem;",
        :class="{'bg-yellow': components.length <= i}")
        template(slot="date")
          // | {{ components.length }} - {{ i }}
          div {{ comp.description }}
        template(slot="title")
          div {{ comp.title }}
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
          day: '2018-08-17',
          date: this.$t('navigation.portrait.sublabel'),
          title: this.$t('navigation.portrait.label'),
          description: this.$t('navigation.portrait.sublabel')
        }, {
          component: 'all-sequences',
          day: '2018-08-24',
          date: this.$t('navigation.portraitplusplus.sublabel'),
          title: this.$t('navigation.portraitplusplus.label'),
          description: this.$t('navigation.portraitplusplus.sublabel')
        }, {
          component: 'all-group-sequences',
          day: '2018-08-31',
          date: this.$t('navigation.portraitplusplus.sublabel') + ' xxxxxxxx',
          title: this.$t('navigation.portraitplusplus.label'),
          description: '31.8.'
        }]
      }
    },
    mounted () {
      this.components.sort(function (a, b) {
        let x = a.day > b.day ? -1 : 1
        return x
      })
    },
    methods () {
    }
  }
</script>
