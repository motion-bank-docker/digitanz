<template lang="pug">

  q-card.relative-position.q-mb-lg.relative-position.bg-dark
    span.my-flag(v-if="showContentFlag && isOwnContent()")
      q-icon(name="how_to_reg" size="1.3em")
    div.user-flag-wrapper(v-else-if="showContentFlag")
      div.user-flag(:style="{ 'background-image': 'url(' + portrait + ')' }")
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem(item)")
    q-window-resize-observable(@resize="onResize")

    // mr-griddle-modal(ref="mrGriddleModal", :requestedHeight="requestedHeight", :screenSize="screenSize")
    // | {{ requestedHeight }}
    svg.bg-grey-10(ref="svgContainer", v-if="states && item", :width="requestedHeight", :height="requestedHeight")
      g#mr-griddle.random
        rect(width="100%", height="100%", fill="url(#cell-pattern)")
        line(v-for="(line, i) in lines", :key="`line-${i}`",
        :stroke-width="strokeWidth",
        :x1="line.x1 * gridCell.width", :y1="line.y1 * gridCell.height",
        :x2="line.x2 * gridCell.width", :y2="line.y2 * gridCell.height")

    .row.bg-grey-10.items-center(v-else, :style="{height: requestedHeight + 'px'}")
      .full-width.q-px-md.q-mb-none.text-center Keine Vorschau verfügbar

    // div
      // slot(name="customButtons", :item="item")

    // .row.bg-blue.justify-around(slot="customButtons", slot-scope="{ item }")
    q-card-actions(v-if="buttonsNew || buttonsNewDropdown").row.justify-around
      q-btn(v-for="btn in buttonsNew", @click="onAction(btn.label)", :icon="btn.icon",
      round, flat, size="sm", :class="{'text-primary': isPublic}")
        // q-chip(v-if="btn.label === 'response'", floating, color="red") {{ getResponseCount(item) }}
        q-chip(v-if="btn.label === 'response' && countResponses > 0", floating, color="blue") {{ countResponses }}

      q-btn.q-px-none(v-if="buttonsNewDropdown", flat, size="sm", round, icon="more_vert", @click="showActionButton = !showActionButton")
        q-popover.bg-dark(:offset="[10, 0]")
          q-list
            q-item(v-for="btn in buttonsNewDropdown").q-px-sm
              q-btn(round, flat, size="sm", :icon="btn.icon", @click="onAction(btn.label)")

      //
        slot(name="customButtons", :video="video")

        slot(v-if="displayMoreButton", name="moreButton", :item="item")
          q-btn.q-px-none(flat, size="sm", round, icon="more_vert", @click="showActionButton = !showActionButton")
            q-popover.bg-dark(:offset="[10, 0]")
              q-list
                q-item(v-for="btn in buttonsNewDropdown").q-px-sm
                  q-btn(round, flat, size="sm", :icon="btn.icon", @click="onAction(btn.label)")

                slot(name="customMoreButtons", :item="item")
                //
                  q-item(v-if="displayMoreVisibility()").q-px-sm
                    q-btn(round, flat, size="sm", icon="group", v-close-overlay, @click="toggleVisibility(video)")
                  q-item(v-if="displayMoreDownload()").q-px-sm
                    q-btn(round, flat, size="sm", icon="cloud_download", v-close-overlay, @click="downloadItem(video)")
                  q-item(v-if="displayMoreDelete()").q-px-sm
                    q-btn(round, flat, size="sm", icon="delete", v-close-overlay, @click="openDeleteModal(video)")

</template>

<script>
  // import MrGriddleModal from './MrGriddleModal'
  import ConfirmModal from '../components/ConfirmModal'
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../lib/video-helper'

  const UI_RESIZER_FACTOR = 2

  export default {
    components: {
      // MrGriddleModal
      ConfirmModal
    },
    props: {
      buttons: Array,
      buttonsNew: Array,
      buttonsNewDropdown: Array,
      play: {
        type: Boolean
      },
      showContentFlag: {
        type: Boolean,
        default: false
      },
      buttonVisibility: {
        type: String
      },
      requestedWidth: {
        // type: Number,
        default: null
      },
      requestedHeight: {
        // type: Number,
        default: null
      },
      states: {
        type: Array,
        default () {
          return []
        }
      },
      item: undefined
    },
    data () {
      return {
        responses: undefined,
        countResponses: 0,
        currentState: -1,
        currentTime: 0,
        favoriteSequences: [],
        frameLength: 300,
        grid: {
          columns: 10,
          rows: 16
        },
        gridCell: {
          width: 0,
          height: 0
        },
        isPublic: false,
        lastFrameTime: -1,
        lines: [],
        maxFrameLength: 60 * 6,
        minFrameLength: 60 / 3,
        portrait: undefined,
        portraitLoading: false,
        resizingCell: false,
        resizerFactor: UI_RESIZER_FACTOR,
        showActionButton: false,
        openDeleteModal: false,
        settingFrameLength: false,
        svgSize: {
          width: 0,
          height: 0
        },
        target: undefined,
        timerId: -1
      }
    },
    computed: {
      strokeWidth () {
        return 20 * this.skeletonScale
      },
      skeletonScale () {
        const scale = Math.min(1, this.svgSize.width / 900)
        return scale
      },
      timerInterval () {
        return (1000 / 60.0) * (this.minFrameLength + (this.maxFrameLength - this.frameLength))
      },
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    mounted () {
      this.checkIfPublic(this.item)
      this.loadResponses()
      this.loadAuthorProfile()
      if (this.requestedWidth && this.requestedHeight) {
        this.svgSize = {
          width: this.requestedWidth,
          height: this.requestedHeight
        }
      }
      else {
        this.svgSize = {
          width: this.$el.offsetWidth,
          height: this.$el.offsetHeight
        }
      }
      this.gridCell = {
        width: this.svgSize.width / this.grid.columns,
        height: this.svgSize.height / this.grid.rows
      }
      this.currentState = -1
      if (this.states && this.states.length > 0) {
        this.currentState = 0
        this.frameLength = this.states[0].frameLength || Math.round(250 + Math.random() * 100)
      }
      this.drawSkeleton()
      if (this.play) this.startTimer()
    },
    watch: {
      states () {
        this.currentState = -1
        if (this.states && this.states.length > 0) {
          this.currentState = 0
          this.frameLength = this.states[0].frameLength || Math.round(250 + Math.random() * 100)
        }
        this.drawSkeleton()
      },
      play (playing) {
        if (playing) {
          this.startTimer()
        }
        else {
          clearInterval(this.timerId)
          this.timerId = undefined
        }
      }
    },
    methods: {
      async uploadResponse () {
        this.$refs.uploadRemixModal.show({
          id: this.target.id,
          type: 'Timeline'
        })
        const message = {
          portrait: this.target.uuid,
          user: this.user.uuid
        }
        await this.$store.dispatch('logging/log', { action: 'open_response', message })
      },
      async checkIfPublic (item) {
        const targetNew = await this.$store.dispatch('maps/get', process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID)
        if (targetNew) {
          const favAnnotations = await this.$store.dispatch('annotations/find', {
            'target.id': targetNew.id,
            'author.id': this.user.uuid
          })
          this.favoriteSequences = favAnnotations.items
        }
        // console.log('this.favoriteSequences', this.favoriteSequences)
        let targetId
        if (item.hasOwnProperty('target')) targetId = item.target.id
        else targetId = item.id
        const favorite = this.favoriteSequences.find(a => {
          return a.body.source && a.body.source.id === targetId
        })
        // console.log('favorite', favorite)
        if (favorite) this.isPublic = true
        // console.log('CHECK 222222', this.favoriteSequences)
      },
      async toggleItemFavorite (item) {
        const targetNew = await this.$store.dispatch('maps/get', process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID)
        if (targetNew) {
          const favAnnotations = await this.$store.dispatch('annotations/find', {
            'target.id': targetNew.id,
            'author.id': this.user.uuid
          })
          this.favoriteSequences = favAnnotations.items
        }
        // console.log('this.favoriteSequences', this.favoriteSequences)
        let targetId
        if (item.hasOwnProperty('target')) targetId = item.target.id
        else targetId = item.id
        const favorite = this.favoriteSequences.find(a => {
          return a.body.source && a.body.source.id === targetId
        })
        // console.log('favorite', favorite)
        const messageNew = {
          timeline: targetId,
          user: this.user.uuid
        }
        if (favorite) {
          this.isPublic = false
          await this.$store.dispatch('annotations/delete', favorite.uuid)
          await this.$store.dispatch('acl/remove', {uuid: favorite.uuid, role: 'digitanz', permission: 'get'})
        }
        else {
          this.isPublic = true
          const payload = {
            type: 'MrGriddleFavourite',
            target: {
              type: 'Timeline',
              id: `${process.env.TIMELINE_BASE_URI}${process.env.MR_GRIDDLE_SEQUENCES_TIMELINE_UUID}`
            },
            body: {
              source: {
                id: targetId
              },
              type: 'Timeline',
              purpose: 'linking'
            }
          }
          const fav = await this.$store.dispatch('annotations/post', payload)
          if (fav) {
            await this.$store.dispatch('acl/set', {uuid: fav.uuid, role: 'digitanz', permissions: ['get']})
          }
          await this.$store.dispatch('logging/log', { action: 'griddle_sequence_favourite_set', messageNew })
        }
      },
      async loadAuthorProfile () {
        let itemUser = this.item.author.id
        // console.log('itemUser', itemUser)
        if (itemUser) {
          // this.portraitLoading = true
          const portraitsMapResult = await this.$store.dispatch('maps/get', process.env.PORTRAITS_TIMELINE_UUID)
          if (portraitsMapResult) {
            const portraitsQuery = {
              'target.id': `${process.env.TIMELINE_BASE_URI}${portraitsMapResult.uuid}`,
              'author.id': itemUser
            }
            let portrait = await VideoHelper.fetchVideoItems(this, portraitsQuery)
            if (typeof portrait === 'undefined') return
            this.portrait = portrait[0].preview.small
            // this.portraitLoading = false
          }
          // console.log('this.portrait', this.portrait)
          /*
          console.log('user', user)
          */
        }
      },
      isOwnContent () {
        // return (this.video.annotation.author.id === this.user.uuid)
        return (this.item.author.id === this.user.uuid)
        // return this.user.uuid
      },
      async loadResponses () {
        this.target = await this.$store.dispatch('maps/get', this.item.uuid)

        if (this.target) {
          const responsesQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${this.target.uuid}`,
            'target.type': 'Timeline',
            'body.purpose': 'commenting'
          }
          this.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
          this.countResponses = this.responses.length
        }
      },
      onAction (val) {
        // console.log(this.item)
        switch (val) {
        case 'delete':
          this.$refs.confirmDeleteModal.show('labels.confirm_delete', this.item, 'buttons.delete')
          break
        case 'edit':
          this.$router.push('mr-griddle/' + this.item.uuid + '/edit')
          break
        case 'response':
          this.$router.push('mr-griddle/' + this.item.uuid + '/responses')
          break
        case 'visibility':
          // this.toggleVisibility()
          this.toggleItemFavorite(this.item)
          break
        }
      },
      /*
      deleteItem () {
        alert('wird gelöscht')
      },
      */
      async deleteItem (item) {
        // console.log(item)
        // this.$q.loading.show({ message: this.$t('messages.deleting_sequence') })
        /*
        const favorite = this.favoriteSequences.find(a => {
          return a.body.source && a.body.source.id === item.target.id
        })
        if (favorite) {
          await this.$store.dispatch('annotations/delete', favorite.uuid)
          await this.$store.dispatch('acl/remove', {uuid: favorite.uuid, role: 'digitanz', permission: 'get'})
        }
        */
        // await this.$store.dispatch('maps/delete', item.target.id.split('/').pop())
        const mapUuid = item.target.id.split('/').pop()
        await this.$store.dispatch('maps/delete', mapUuid)
        // this.$q.loading.hide()
        // await this.loadData()
        let check = true
        this.$emit('emitLoadData', check)
      },
      toggleVisibility () {
        console.log('sichtbarkeit wechseln')
      },
      openModal () {
        this.$refs.mrGriddleModal.show(this.states)
      },
      onResize () {
        this.gridCell = {
          width: this.requestedHeight / this.grid.columns,
          height: this.requestedHeight / this.grid.rows
        }
        // this.strokeWidth()
        // this.skeletonScale()
      },
      startTimer () {
        this.timerId = setInterval(this.timerIntervalHandler, this.timerInterval)
        this.lastFrameTime = Date.now()
      },
      timerIntervalHandler () {
        this.currentState = (this.currentState + 1) % this.states.length
        this.drawSkeleton()
        this.lastFrameTime = Date.now()
      },
      displayMoreButton () {
        if (typeof this.buttons !== 'undefined') {
          for (let btn of this.buttons) {
            if (btn.includes('more')) {
              return true
            }
          }
          return false
        }
        else return false
      },
      displayMoreVisibility () {
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('more-visibility') > -1)
        else return false
      },
      displayMoreDelete () {
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('more-delete') > -1)
        else return false
      },
      displayMoreDownload () {
        if (typeof this.buttons !== 'undefined') return (this.buttons.indexOf('more-download') > -1)
        else return false
      },
      drawSkeleton () {
        let skeletonLines = []
        // draw previewData
        if (this.states && this.states.length > 0) {
          skeletonLines = this.states[this.currentState].skeleton
          let x = Math.floor(this.grid.columns / 2)
          let y = Math.floor(this.grid.rows / 2)
          let w = this.svgSize.width / this.grid.columns
          let h = this.svgSize.height / this.grid.rows
          this.lines = skeletonLines.map(line => {
            return {
              x1: x + Math.round(line.x1 * this.skeletonScale / w),
              y1: y + Math.round(line.y1 * this.skeletonScale / h),
              x2: x + Math.round(line.x2 * this.skeletonScale / w),
              y2: y + Math.round(line.y2 * this.skeletonScale / h)
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .my-flag
    z-index 1000
    position absolute
    top 0
    right 0
    width: 2.5em
    height: 2.5em
    // margin-top -3px
    // margin-right -5px
    // background-color $secondary
    background-color rgba(0,0,0,.4)
    // border 1px solid white
    color white
    /*padding 2px*/
    margin 5px
    border-radius 50%
    display: flex
    align-items center
    justify-content center
  .user-flag
    z-index 1000
    width: 100%
    height: 100%
    /*margin 5px*/
    border-radius 100%!important
    background-color rgba(0,0,0,.4)
    background-size 100%
    background-position center
  .user-flag-wrapper
    z-index 999
    position absolute
    top 0
    right 0
    width: 2.5em
    height: 2.5em
    margin 2.5px
    border-radius 100%!important
    background-color rgba(255,255,255,0.2)
    display flex
    justify-content center
    align-items center
    padding 1px

  #mr-griddle
    line
      stroke mediumvioletred
      stroke-linecap round

  #mr-griddle.random
    line
      stroke white

  #resize-handle
    fill: white
    stroke: gray
    stroke-width: 2

  #resize-handle *:hover,
  #resize-handle.resizing
    fill: gray

</style>
