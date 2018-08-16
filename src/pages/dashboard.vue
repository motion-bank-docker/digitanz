<template lang="pug">
  q-page.flex.column
    video-modal(ref="videoModal")
    image-modal(:show="showImageModal", :source="preview", @canceled="showImageModal = false")
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    // HEADLINE
    //
    h3.text-center
      | Hi!
    div.q-mx-md.q-mb-xl.text-grey-8
      | {{ $t('dashboard.description') }}

    // TERMINE IM DETAIL
    //
    q-collapsible(v-for="(date, i) in dates", :ref="getDateLabel(date)", v-if="date.show", opened, style="border-top: 1px solid #333;")
      template(slot="header")
        q-item.full-width.q-pl-none
          // q-item-side {{ i + 1 }}.
          q-item-main
            h4.q-mt-md.q-mb-none(style="line-height: 1em;") {{ $t(date.title) }}
            p.q-caption.text-grey-8.no-padding.q-mt-sm {{ getDateLabel(date) }}
      .q-mb-xl(style="border-top: 0px solid #333;")
        q-item.q-mb-xl.no-padding(v-for="item in date.entries", :key="item.annotation.uuid", :src="item.annotation.body.source.id")
          q-item-main.self-start
            q-item-tile.text-center
              q-btn.no-padding(@click="openPreview(item)")
                img(:src="item.preview", style="height: auto; max-height: 50vh; width: auto; max-width: 100%;")
            q-item-tile.no-margin.text-center.q-pt-sm
              q-btn(flat, round, :icon="getItemStyle(item).icon", :color="getItemStyle(item).color", @click="setAsPortrait(item)")
              // q-btn(flat, round, icon="edit")
              q-btn(flat, round, icon="delete", @click="openDeleteModal(item)")
              q-btn(flat, round, icon="cloud_download", @click="download(item.annotation.body.source.id)")
</template>

<script>
  import path from 'path'
  import { openURL, scroll } from 'quasar'
  import { DateTime, Interval } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'
  import { mapGetters } from 'vuex'

  import VideoModal from '../components/VideoModal'
  import ImageModal from '../components/ImageModal'
  import ConfirmModal from '../components/ConfirmModal'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
      VideoModal,
      ImageModal,
      ConfirmModal
    },
    data () {
      return {
        // itemDate: this.$route.query.item_id,
        groupedList: '',
        showImageModal: false,
        showDeleteModal: false,
        portraits: {
          map: undefined,
          annotations: []
        },
        dates: undefined
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    methods: {
      formatTime (val) {
        // console.log(val)
        return DateTime.fromISO(val).toLocaleString()
      },
      download (file) {
        openURL(`${process.env.TRANSCODER_HOST}/downloads/${path.basename(file)}`)
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
        console.log(item)
        this.$q.loading.show({ message: this.$t('messages.deleting_video') })
        for (let portrait of this.portraits.annotations) {
          if (item.annotation.body.source.id === portrait.body.source.id) {
            await this.setAsPortrait(item, true)
          }
        }
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
        try {
          await this.$store.dispatch('annotations/delete', item.annotation.uuid)
        }
        catch (e) { console.error('Failed to remove annotation', e.message) }
        try {
          await this.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(item.preview)}`, {headers})
        }
        catch (e) { console.error('Failed to remove preview', e.message) }
        try {
          await this.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(item.annotation.body.source.id)}`, { headers })
        }
        catch (e) { console.error('Failed to remove video', e.message) }
        const message = {
          annotation: item.annotation.uuid,
          source: item.annotation.body.source.id,
          user: this.user.uuid
        }
        await this.$store.dispatch('logging/log', { action: 'delete', message })
        this.$q.loading.hide()
        await this.loadDates()
      },
      openPreview (item) {
        this.preview = item.annotation
        if (item.annotation.body.source.type === 'video/mp4') this.$refs.videoModal.show(item.annotation)
        else if (item.annotation.body.source.type === 'image/jpeg') this.showImageModal = true
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async setAsPortrait (item, silent = false) {
        console.debug('setting as portrait...', item, this.portraits)
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
          await this.$store.dispatch('acl/remove', {uuid: result.uuid, role: 'public', permission: 'get'})
        }
        console.debug('existing portrait removed', result)
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
          console.debug('new portrait set', result)
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
        return {color: 'grey', icon: 'portrait'}
      },
      async loadPortraits () {
        /**
         * Get the global portrait timeline and its contents
         */
        this.$q.loading.show({ message: this.$t('messages.loading_portraits') })
        const portraitsMapResult = await this.$store.dispatch('maps/get', process.env.PORTRAITS_TIMELINE_UUID)
        if (portraitsMapResult) {
          this.portraits.map = portraitsMapResult
          const portraitsQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}`
          }
          const portraitsResult = await this.$store.dispatch('annotations/find', portraitsQuery)
          this.portraits.annotations = portraitsResult.items.sort(this.$sort.onCreatedDesc)
        }
        this.$q.loading.hide()
      },
      async loadDates () {
        /**
         * Iterate over dates and fetch content for each one
         */
        this.$q.loading.show({ message: this.$t('messages.loading_dates') })
        for (let date of this.dates) {
          let query = {
            'author.id': this.user.uuid,
            'title': this.$t(date.map_title)
          }
          let result = await this.$store.dispatch('maps/find', query)
          if (result.items.length) {
            date.map = result.items[0]
            query = {
              // 'created': { $gte: date.start, $lte: date.end },
              'author.id': this.user.uuid,
              'body.type': 'Video',
              'body.source.type': 'video/mp4',
              'target.id': { $ne: `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}` }
            }
            result = await this.$store.dispatch('annotations/find', query)
            const items = result.items.sort(this.$sort.onCreatedDesc)
            const entries = []
            for (let annotation of items) {
              try {
                const metadata = await this.$store.dispatch('metadata/get', annotation.uuid)
                const preview = annotation.body.source.id.replace(/mp4$/, 'png')
                entries.push({annotation, metadata, preview})
              }
              catch (e) { console.error('Failed to add item', annotation, e.message) }
            }
            date.entries = entries
          }
        }
        this.$q.loading.hide()
      }
    },
    async mounted () {
      // alert(this.$route.query.item_id)
      this.dates = this.$dates()
      await this.loadPortraits()
      await this.loadDates()
    }
  }
</script>
