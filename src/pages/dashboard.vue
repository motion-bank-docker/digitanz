<template lang="pug">
  q-page.flex.column
    video-modal(:show="showVideoModal", :preview="preview", @canceled="showVideoModal = false")
    image-modal(:show="showImageModal", :source="preview", @canceled="showImageModal = false")

    // HEADLINE
    //
    h4.text-center
      | Hi!
    div.q-mx-md.q-mb-xl.text-grey-8
      | {{ $t('dashboard.description') }}

    // TERMINE IM DETAIL
    //
    q-collapsible(
    v-for="(date, i) in dates", :ref="getDateLabel(date)", v-if="date.show", style="border-top: 1px solid #333;")
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
              q-btn(flat, round, icon="edit")
              q-btn(flat, round, icon="delete", @click="openDeleteModal()")
              q-btn(flat, round, icon="cloud_download", @click="download(item.annotation.body.source.id)")
</template>

<script>
  import path from 'path'
  import { openURL, scroll } from 'quasar'
  import { DateTime, Interval } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'
  import VideoModal from '../components/VideoModal'
  import ImageModal from '../components/ImageModal'
  import DeleteModal from '../components/DeleteModal'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
      VideoModal,
      ImageModal,
      DeleteModal
    },
    data () {
      return {
        // itemDate: this.$route.query.item_id,
        groupedList: '',
        showVideoModal: false,
        showImageModal: false,
        showDeleteModal: false,
        portraits: {
          map: undefined,
          annotations: []
        },
        dates: undefined
      }
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
      deleteItem (/* index */) {
        // this.groupedTools.splice(index, 1)
      },
      openPreview (item) {
        this.preview = item.annotation
        if (item.annotation.body.source.type === 'video/mp4') this.showVideoModal = true
        else if (item.annotation.body.source.type === 'image/jpeg') this.showImageModal = true
      },
      openDeleteModal () {
        console.log('Hallo')
        this.showDeleteModal = true
      },
      async setAsPortrait (item) {
        console.debug('setting as portrait...', item, this.portraits)
        const query = {
          'target.id': `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}`,
          'author.id': this.$store.state.auth.user.uuid
        }
        let result = await this.$store.dispatch('annotations/find', query)
        let isCurrentPortrait = false
        for (let portrait of result.items) {
          if (portrait.body.source.id === item.annotation.body.source.id) isCurrentPortrait = true
          await this.$store.dispatch('annotations/delete', portrait.uuid)
          await this.$store.dispatch('acl/remove', {uuid: result.uuid, role: 'public', permission: 'get'})
        }
        console.debug('existing portrait removed', result)
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
        }
        await this.loadPortraits()
      },
      scrollToDate (date, duration = 1000) {
        const el = this.$refs[this.getDateLabel(date)][0].$el
        setScrollPosition(getScrollTarget(el), el.offsetTop - el.scrollHeight, duration)
      },
      getItemStyle (item) {
        for (let portrait of this.portraits.annotations) {
          if (item.annotation.body.source.id === portrait.body.source.id) return {color: 'primary', icon: 'favorite'}
        }
        return {color: 'grey', icon: 'favorite_border'}
      },
      async loadPortraits () {
        /**
         * Get the global portrait timeline and its contents
         */
        const portraitsMapResult = await this.$store.dispatch('maps/get', process.env.PORTRAITS_TIMELINE_UUID)
        if (portraitsMapResult) {
          this.portraits.map = portraitsMapResult
          const portraitsQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}`
          }
          const portraitsResult = await this.$store.dispatch('annotations/find', portraitsQuery)
          this.portraits.annotations = portraitsResult.items
        }
      }
    },
    async mounted () {
      // alert(this.$route.query.item_id)
      this.dates = this.$dates()
      await this.loadPortraits()
      /**
       * Iterate over dates and fetch content for each one
       */
      for (let date of this.dates) {
        let query = {
          'author.id': this.$store.state.auth.user.uuid,
          'title': this.$t(date.map_title)
        }
        let result = await this.$store.dispatch('maps/find', query)
        if (result.items.length) {
          date.map = result.items[0]
          query = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${date.map.uuid}`
            // 'created': { $gte: date.start, $lte: date.end }
          }
          result = await this.$store.dispatch('annotations/find', query)
          const entries = []
          for (let annotation of result.items) {
            const metadata = await this.$store.dispatch('metadata/get', annotation.uuid)
            const preview = annotation.body.source.id.replace(/mp4$/, 'png')
            entries.push({ annotation, metadata, preview })
          }
          date.entries = entries
        }
      }
    }
  }
</script>
