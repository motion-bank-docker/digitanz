<template lang="pug">
  q-page.flex.column
    video-modal(ref="videoModal", :dimensions="dimensions")
    image-modal(:show="showImageModal", :source="preview", @canceled="showImageModal = false")
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

    // HEADLINE
    //
    h3.text-center
      | {{ $t('pages.dashboard.title') }}
    div.q-mx-md.q-mb-xl.text-grey-8
      | {{ $t('pages.dashboard.description') }}

    //
      .orientation-portrait portrait
      .orientation-landscape landscape

    // TERMINE IM DETAIL
    //
    q-collapsible(v-for="(date, i) in dates", :ref="getDateLabel(date)", v-if="date.show", opened, style="border-top: 1px solid #333;")
      template(slot="header")
        q-item.full-width.q-pl-none
          // q-item-side {{ i + 1 }}.
          q-item-main
            h4.q-mt-md.q-mb-none(style="line-height: 1em;") {{ $t(date.title) }}
            p.q-caption.text-grey-8.no-padding.q-mt-sm {{ $t('pages.dashboard.date_at') }} {{ getDateLabel(date) }}
      p(style="padding-bottom: 1em") {{ $t(date.description) }}
      div(v-if="!date.entries.length")
        .text-grey-8
          | {{ $t('pages.dashboard.no_portraits') }}

      <!--div.overflow-hidden(v-else)-->
        <!--.q-mb-xl.row.justify-center(style="border-top: 0px solid #333;")-->
          <!--q-item.foo.q-mb-xl.no-padding(v-for="item in date.entries", :key="item.annotation.uuid", :src="item.annotation.body.source.id")-->
            <!--q-item-main-->
              <!--q-item-tile.text-center-->
                <!--q-btn.no-padding(@click="openPreview(item)")-->
                  <!--// img(:src="item.preview.medium", style="height: auto; max-height: 50vh; width: auto; max-width: 100%;")-->
                  <!--img(:src="item.preview.medium", style="max-height:150px; max-width:200px")-->
              <!--q-item-tile.no-margin.text-center.q-pt-sm-->
                <!--q-btn(flat, round, :icon="getItemStyle(item).icon", :color="getItemStyle(item).color", @click="setAsPortrait(item)")-->
                <!--// q-btn(flat, round, icon="edit")-->
                <!--q-btn(flat, round, icon="delete", @click="openDeleteModal(item)")-->
                <!--q-btn(flat, round, icon="cloud_download", @click="download(item.annotation.body.source.id)")-->
      //
      div.row.justify-center(v-else)
        q-card.q-pb-xl.q-px-md(v-for="item in date.entries", :key="item.annotation.uuid", :src="item.annotation.body.source.id", style="width:280px", inline, flat)
          div.bgsuper(:style="{ 'background-image': 'url(' + item.preview.medium + ')' }", @click="openPreview(item)")
          q-card-main
            q-item-tile.no-margin.text-center.q-pt-sm
              q-btn(flat, round, :icon="getItemStyle(item).icon", :color="getItemStyle(item).color", @click="setAsPortrait(item)")
              // q-btn(flat, round, icon="edit")
              q-btn(flat, round, icon="delete", @click="openDeleteModal(item)")
              q-btn(flat, round, icon="cloud_download", @click="download(item.annotation.body.source.id)")
      //
      div(v-if="i === 0")
        file-uploader.full-width.self-center(:query="query")
        job-list

</template>

<script>
  import path from 'path'
  import { openURL, scroll } from 'quasar'
  import { DateTime, Interval } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'
  import { mapGetters } from 'vuex'

  import { VideoHelper } from '../lib'

  import VideoModal from '../components/VideoModal'
  import ImageModal from '../components/ImageModal'
  import ConfirmModal from '../components/ConfirmModal'
  import FileUploader from '../components/FileUploader'
  import JobList from '../components/JobList'
  import Portrait from './portrait'

  const { getScrollTarget, setScrollPosition } = scroll

  export default {
    components: {
      Portrait,
      VideoModal,
      ImageModal,
      ConfirmModal,
      FileUploader,
      JobList
    },
    data () {
      return {
        // itemDate: this.$route.query.item_id,
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
        },
        dates: undefined
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
        }
        if (!this.dates[0].map) {
          await this.loadDates()
        }
      }
    },
    async mounted () {
      const _this = this
      this.dates = this.$dates()
      if (this.user) {
        await this.loadPortraits()
        await this.loadDates()
      }
      this.$root.$on('updateVideos', async () => {
        await _this.loadPortraits()
        await _this.loadDates()
      })
      this.$root.$on('updateSequences', async () => {
        await _this.loadDates()
      })
    },
    methods: {
      formatTime (val) {
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
          await this.$store.dispatch('acl/remove', {uuid: result.uuid, role: 'public', permission: 'get'})
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
        return {color: 'grey', icon: 'portrait'}
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
              'target.id': {
                $eq: `${process.env.TIMELINE_BASE_URI}${date.map.uuid}`,
                $ne: `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}`
              }
            }
            date.entries = await VideoHelper.fetchVideoItems(this, query)
          }
        }
        this.$q.loading.hide()
      }
    }
  }
</script>

<style>
  .foo {
    width: 200px;
    height: 200px;
    position: relative;
  }
  .bgsuper {
    width: 100%;
    height: 200px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
