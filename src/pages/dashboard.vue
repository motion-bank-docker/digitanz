<template lang="pug">
  q-page.flex.column
    video-modal(:show="showVideoModal", :preview="preview", @canceled="showVideoModal = false")
    image-modal(:show="showImageModal", :source="preview", @canceled="showImageModal = false")

    // SORT-BUTTONS
    div.row
      q-btn.q-ma-xs(disable flat dark) {{ $t('dates.sort_label') }}
    div.row.q-mx-md.no-wrap
      q-btn.q-ma-xs(color="faded" v-for="(date, index) in dates" @click="scrollToDate(date)") {{ index + 1 }}

    // MY SAVED ITEMS
    q-list.row.no-border(v-for="date in dates", :ref="getDateLabel(date)", v-if="date.show")
      q-list-header.no-margin
        div.row.items-baseline
          h3.no-margin {{ $t(date.title) }}
          p.q-pl-xl.no-margin {{ getDateLabel(date) }}
      div.line-separator.full-width
      q-item.q-my-md(v-if="date.description") {{ $t(date.description) }}
      q-item.col-12(v-for="item in date.entries" :key="item.annotation.uuid", :src="item.annotation.body.source.id")
        q-item-main.self-start.col-10
          q-btn.no-padding(@click="openPreview(item)")
            img(:src="item.preview", style="width: 70vw; height: auto")
        q-item-side.self-end.col
          q-item-tile.no-margin.column
            q-btn(flat round :icon="getItemStyle(item).icon" :color="getItemStyle(item).color" @click="setAsPortrait(item)")
            q-btn(flat round icon="edit")
            q-btn(flat round icon="delete" @click="openDeleteModal()")
            q-btn(flat round icon="cloud_download", @click="download(item.annotation.body.source.id)")
      div.row.full-width(v-if="isDateActive(date)")
        q-btn.q-ma-md(color="faded" style="flex-grow: 1") {{ $t('dates.all_results') }}
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
