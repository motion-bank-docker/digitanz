<template lang="pug">
  q-page.flex.column
    video-modal(:show="showVideoModal", :preview="preview", @canceled="showVideoModal = false")
    image-modal(:show="showImageModal", :source="preview", @canceled="showImageModal = false")

    // SORT-BUTTONS
    div.row
      q-btn.q-ma-xs(disable flat dark) Workshop Termin...
    div.row.q-mx-md.no-wrap
      q-btn.q-ma-xs(color="faded" v-for="(date, index) in dates" @click="scrollToElement(getDateLabel(date))") {{ index + 1 }}

    // MY SAVED ITEMS
    q-list.row.no-border(v-for="date in dates", :id="getDateLabel(date)")
      q-list-header.no-margin(:ref="getDateLabel(date)")
        div.row.items-baseline
          h3.no-margin {{ date.title }}
          p.q-pl-xl.no-margin {{ getDateLabel(date) }}
      div.line-separator.full-width
      q-item.q-my-md(v-if="date.description") {{ date.description }}
      q-item.col-12(v-for="item in date.entries" :key="item.annotation.uuid", :src="item.annotation.body.source.id")
        q-item-main.self-start.col-10
          q-btn.no-padding(@click="openPreview(item)")
            img(:src="item.preview", style="width: 70vw; height: auto")
        q-item-side.self-end.col
          q-item-tile.no-margin.column
            q-btn(flat round :icon="itemLikeStatus(item).icon" :color="itemLikeStatus(item).color" @click="likeItem(item, date)")
            q-btn(flat round icon="edit")
            q-btn(flat round icon="delete" @click="openDeleteModal()")
            q-btn(flat round icon="cloud_download", @click="download(item.annotation.body.source.id)")
      div.row.full-width(v-if="isDateActive(date)")
        q-btn.q-ma-md(color="faded" style="flex-grow: 1") Ergebnisse von allen
</template>

<script>
  import path from 'path'
  import { openURL } from 'quasar'
  import { DateTime, Interval } from 'luxon'
  import VideoModal from '../components/VideoModal'
  import ImageModal from '../components/ImageModal'
  import DeleteModal from '../components/DeleteModal'

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
        const
          start = DateTime.fromISO(date.start),
          end = DateTime.fromISO(date.end),
          interval = Interval.fromDateTimes(start, end)
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
      likeItem (thisItem, date) {
        let likeValue = 'liked'
        // if (!Array.isArray(item.tags)) {
        //   item.tags = item.tags.split(' ')
        // }
        if (!thisItem.tags.includes(likeValue)) {
          console.log('Liked Item: ' + thisItem.uuid)
          this.groupedList[date.date].forEach(function (savedItem) {
            savedItem.tags = savedItem.tags.filter(item => item !== likeValue)
          })
          thisItem.tags.push(likeValue)
        }
        else {
          thisItem.tags = thisItem.tags.filter(item => item !== likeValue)
        }
        console.log(thisItem.tags)
      },
      scrollToElement (index) {
        let element = document.getElementById(index)
        let headerOffset = 50
        let elementPosition = element.getBoundingClientRect().top
        let offsetPosition = elementPosition - headerOffset
        window.scroll({
          top: offsetPosition,
          behavior: 'smooth'
        })
        // let target = this.$q.getScrollTarget(el)
        // let offset = el.offsetTop - el.scrollHeight
        // let duration = 1000
        // this.$g.setScrollPosition(target, offset, duration)
      },
      itemLikeStatus (item) {
        for (let portrait of this.portraits.annotations) {
          if (item.annotation.uuid === portrait.uuid) return true
        }
        return false
      }
    },
    async mounted () {
      this.dates = this.$dates()
      /**
       * Get the global portrait timeline and its contents
       */
      const portraitsMapQuery = {
        'author.id': process.env.SYSTEM_USER_UUID,
        'title': 'Digitanz Portraits'
      }
      const portraitsMapResult = await this.$store.dispatch('maps/find', portraitsMapQuery)
      if (portraitsMapResult.items.length) {
        this.portraits.map = portraitsMapResult.items[0]
        const portraitsQuery = {
          'target.id': `${process.env.TIMELINE_BASE_URI}${this.portraits.map.uuid}`
        }
        const portraitsResult = await this.$store.dispatch('annotations/find', portraitsQuery)
        this.portraits.annotations = portraitsResult.items
      }
      /**
       * Iterate over dates and fetch content for each one
       */
      for (let date of this.dates) {
        let query = {
          'author.id': this.$store.state.auth.user.uuid,
          'title': date.map_title
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
