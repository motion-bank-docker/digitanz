<template lang="pug">

  .row
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")
    video-list-view(
      v-if="entries.length > 0",
      :videos="entries",
      layoutStyle="sm")
        template(slot="customButtons" slot-scope="{ video }")
          q-btn.q-px-none(flat, size="sm" round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="setAsPortrait(video)")
          q-btn.q-px-none(flat, size="sm" round, icon="delete", @click="openDeleteModal(video)")
    template(v-else)
      | {{ $t('messages.no_videos') }}

</template>

<script>
  import { DateTime, Interval } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../../lib'
  import VideoListView from '../../components/VideoListView'
  import ConfirmModal from '../../components/ConfirmModal'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    name: 'dashboard-portraits',
    components: {
      VideoListView,
      ConfirmModal
    },
    props: [
      'date'
    ],
    data () {
      return {
        entries: [],
        map: undefined,
        dimensions: {
          width: '',
          height: ''
        },
        groupedList: undefined,
        showImageModal: false,
        showDeleteModal: false,
        portraits: {
          map: undefined,
          annotations: []
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      async user () {
        if (!this.portraits.map) {
          await this.loadPortraits()
          await this.loadDates()
        }
      }
    },
    async mounted () {
      const _this = this
      if (this.user) {
        await this.loadPortraits()
        await this.loadDates()
      }
      this.$root.$on('updateVideos', async () => {
        await _this.loadPortraits()
        await this.loadDates()
      })
    },
    methods: {
      formatTime (val) {
        return DateTime.fromISO(val).toLocaleString()
      },
      getDateLabel (date) {
        const dt = DateTime.fromISO(date.start)
        return `${dt.day}.${dt.month}.${dt.year}`
      },
      isDateActive (date) {
        const interval = Interval.fromDateTimes(DateTime.fromISO(date.start), DateTime.fromISO(date.end))
        return interval.contains(DateTime.local())
      },
      async deleteItem (item) {
        this.$q.loading.show({ message: this.$t('messages.deleting_video') })
        for (let portrait of this.portraits.annotations) {
          if (item.annotation.body.source.id === portrait.body.source.id) {
            await this.setAsPortrait(item, true)
          }
        }
        await VideoHelper.deleteVideoItem(this, item)
        this.$q.loading.hide()
        await this.loadDates()
      },
      openPreview (item) {
        this.preview = item.annotation
        // alert(item.metadata.width)
        // this.dimensions.width = 300
        // if (item.annotation.body.source.type === 'video/mp4') this.$refs.videoModal.show(item.annotation)
        if (item.annotation.body.source.type === 'video/mp4') this.$refs.videoModal.show(item)
        else if (item.annotation.body.source.type === 'image/jpeg') this.showImageModal = true
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async setAsPortrait (item, silent = false) {
        if (!silent) this.$q.loading.show({ message: this.$t('messages.setting_portrait') })
        const query = {
          'target.id': `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}`,
          'author.id': this.user.uuid
        }
        let result = await this.$store.dispatch('annotations/find', query)
        let isCurrentPortrait = false
        for (let portrait of result.items) {
          if (portrait.body.source.id === item.annotation.body.source.id) isCurrentPortrait = true
          await this.$store.dispatch('annotations/delete', portrait.uuid)
          await this.$store.dispatch('acl/remove', {uuid: portrait.uuid, role: 'public', permission: 'get'})
        }
        const message = {
          video: item.annotation.body.source.id,
          user: this.user.uuid
        }
        if (!isCurrentPortrait) {
          const portrait = {
            body: ObjectUtil.merge({}, item.annotation.body),
            target: {
              id: `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}`,
              type: 'Timeline',
              selector: {
                type: 'Fragment',
                value: DateTime.local().toISO()
              }
            }
          }
          result = await this.$store.dispatch('annotations/post', portrait)
          if (result) {
            await this.$store.dispatch('acl/set', {uuid: result.uuid, role: 'public', permissions: ['get']})
          }
          await this.$store.dispatch('logging/log', { action: 'portrait', message })
          if (!silent) this.$q.loading.hide()
        }
        else if (!silent) {
          await this.$store.dispatch('logging/log', { action: 'portrait_unset', message })
          this.$q.loading.hide()
        }
        await this.loadPortraits()
      },
      scrollToDate (date, duration = 1000) {
        const el = this.$refs[this.getDateLabel(date)][0].$el
        setScrollPosition(getScrollTarget(el), el.offsetTop - el.scrollHeight, duration)
      },
      getItemStyle (item) {
        for (let portrait of this.portraits.annotations) {
          if (item.annotation.body.source.id === portrait.body.source.id) return {color: 'primary', icon: 'account_box'}
        }
        return {color: 'grey-5', icon: 'portrait'}
      },
      async loadPortraits () {
        /**
         * Get the global portrait timeline and its contents
         */
        this.$q.loading.show({ message: this.$t('messages.loading_portraits') })
        const portraitsMapResult = await this.$store.dispatch('maps/get', process.env.PORTRAITS_TIMELINE_UUID)
        if (portraitsMapResult) {
          const portraitsQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${portraitsMapResult.uuid}`,
            'author.id': this.user.uuid
          }
          const portraitsResult = await this.$store.dispatch('annotations/find', portraitsQuery)
          const portraitAnnotations = portraitsResult.items.sort(this.$sort.onCreatedDesc)
          this.portraits = Object.assign({}, this.portraits, {map: portraitsMapResult, annotations: portraitAnnotations})
        }
        this.$q.loading.hide()
      },
      async loadDates () {
        /**
         * Iterate over dates and fetch content for each one
         */
        this.$q.loading.show({ message: this.$t('messages.loading_dates') })
        // for (let date of this.dates) {
        let query = {
          'author.id': this.user.uuid,
          'title': this.$t(this.date.map_title)
        }
        let result = await this.$store.dispatch('maps/find', query)
        const items = []
        if (result.items.length) {
          this.map = result.items[0]
          query = {
            'created': { $gte: this.date.start, $lte: this.date.end },
            'author.id': this.user.uuid,
            'body.type': 'Video',
            'body.source.type': 'video/mp4',
            'target.id': {
              $eq: `${process.env.TIMELINE_BASE_URI}${this.map.uuid}`,
              $ne: `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}`
            }
          }
          const portraits = await VideoHelper.fetchVideoItems(this, query)
          for (let portrait of portraits) {
            // const responsesQuery = {
            //   'target.id': `${process.env.ANNOTATION_BASE_URI}${portrait.annotation.uuid}`,
            //   'body.purpose': 'commenting'
            // }
            // portrait.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
            // console.debug('portrait', portrait)
            items.push(portrait)
          }
          this.entries = items
        }
        // }
        this.$q.loading.hide()
      }
    }
  }
</script>

<style scoped>
  .q-px-none {
    padding: 0 !important;
  }
</style>
