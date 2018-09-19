<template lang="pug">
  q-page.flex.column

    // HEADLINE
    //
    h3.text-center
      | {{ $t('pages.dashboard.title') }}
    div.q-mx-md.q-mb-xl.text-grey-8
      | {{ $t('pages.dashboard.description') }}

    // TERMINE IM DETAIL
    //
    q-collapsible(v-for="(date, i) in dates" :ref="getDateLabel(date)", v-if="date.show", opened, style="border-top: 1px solid #333;")
      template(slot="header")
        q-item.full-width.q-pl-none
          q-item-main
            h4.q-mt-md.q-mb-none(style="line-height: 1em;") {{ $t(date.title) }}
            p.q-caption.text-grey-8.no-padding.q-mt-sm {{ $t('pages.dashboard.date_at') }} {{ getDateLabel(date) }}
      p(style="padding-bottom: 1em") {{ $t(date.description) }}
      component(:is="`dashboard-${date.componentName}`", :date="date", :path="date.path")

</template>

<script>
  import { DateTime } from 'luxon'
  import { mapGetters } from 'vuex'
  import { Portraits, PortraitsPlusPlus, GroupVideoSequences } from '../components/dashboard'
  import VideoListView from '../components/VideoListView'

  export default {
    components: {
      'dashboard-portraits': Portraits,
      'dashboard-portraits-plus-plus': PortraitsPlusPlus,
      'dashboard-group-video-sequences': GroupVideoSequences,
      VideoListView
    },
    data () {
      return {
        dimensions: {
          width: '',
          height: ''
        },
        showImageModal: false,
        dates: undefined
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    async mounted () {
      this.dates = this.$dates()
    },
    methods: {
      getDateLabel (date) {
        const dt = DateTime.fromISO(date.start)
        return `${dt.day}.${dt.month}.${dt.year}`
      }
    }
  }
</script>

<style lang="stylus">
  .q-card.q-mb-lg
    margin-bottom 24px !important
</style>
