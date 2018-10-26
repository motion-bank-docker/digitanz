<template lang="pug">
  q-card.relative-position.q-mb-lg.relative-position.bg-dark

    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem(item.uuid)")
    // q-window-resize-observable(@resize="onResize")

    // icons
    span.my-flag(v-if="showContentFlag && user.uuid === item.author.id")
      q-icon(name="how_to_reg" size="1.3em")
    div.user-flag-wrapper(v-else-if="showContentFlag")
      div.user-flag(:style="{ 'background-image': 'url(' + portrait + ')' }")

    // content
    q-card-main.q-mb-lg
      // | {{ item.isPublic }}
      div(@click="$router.push('/clouds/' + item._id + '/responses')")
        p(v-for="word in item.value") {{ word }}

    // buttons
    q-card-actions.absolute-bottom(v-if="buttonsX || buttonsY").row.justify-around

      // buttons
      q-btn(v-for="btn in buttonsX", @click="onAction(btn.label)", :icon="btn.icon",
      round, flat, size="sm", :class="{'text-primary': item.isPublic && btn.label === 'visibility'}")
        // q-chip(v-if="btn.label === 'response'", floating, color="red") {{ getResponseCount(item) }}
        q-chip(v-if="btn.label === 'response' && countResponses > 0", floating, color="blue") {{ countResponses }}

      // buttons dropdown
      q-btn.q-px-none(v-if="buttonsY", flat, size="sm", round, icon="more_vert", @click="showActionButton = !showActionButton")
        q-popover.bg-dark(:offset="[10, 0]")
          q-list
            q-item(v-for="btn in buttonsY").q-px-sm
              q-btn(round, flat, size="sm", :icon="btn.icon", @click="onAction(btn.label)")

</template>

<script>
  // import { DateTime } from 'luxon'
  import { mapGetters } from 'vuex'
  // import { ObjectUtil } from 'mbjs-utils'
  import { VideoHelper } from '../lib/video-helper'
  import ConfirmModal from '../components/ConfirmModal'

  export default {
    components: {
      ConfirmModal
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    props: {
      buttonsX: Array,
      buttonsY: Array,
      item: Object,
      portrait: undefined,
      showContentFlag: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.isOwnContent()
    },
    methods: {
      async deleteItem (uuid) {
        await this.$store.dispatch('cloud/removeAssociation', uuid)
        this.$root.$emit('updateClouds')
      },
      isOwnContent () {
        console.log('#####', this.item)
        console.log('#####', this.user)
        // return (this.item.author.id === this.user.uuid)
      },
      async loadAuthorProfile () {
        let itemUser = this.item.author.id
        if (itemUser) {
          const portraitsMapResult = await this.$store.dispatch('maps/get', process.env.PORTRAITS_TIMELINE_UUID)
          if (portraitsMapResult) {
            const portraitsQuery = {
              'target.id': `${process.env.TIMELINE_BASE_URI}${portraitsMapResult.uuid}`,
              'author.id': itemUser
            }
            let portrait = await VideoHelper.fetchVideoItems(this, portraitsQuery)
            if (typeof portrait === 'undefined') return
            this.portrait = portrait[0].preview.small
          }
        }
      },
      async onAction (val) {
        switch (val) {
        case 'delete':
          this.$refs.confirmDeleteModal.show('labels.confirm_delete', this.item, 'buttons.delete')
          // await this.deleteItem(this.item.uuid)
          break
        case 'edit':
          this.$router.push('/clouds/' + this.item._id + '/responses')
          break
        case 'response':
          this.$router.push('/clouds/' + this.item._id + '/responses')
          break
        case 'visibility':
          // this.toggleItemFavorite(this.item)
          await this.toggleItemPublic(this.item)
          break
        }
      },
      async toggleItemPublic (item) {
        await this.$store.dispatch('cloud/updateAssociationPublic', [item.uuid, !(item.isPublic === true)])
        this.$root.$emit('updateClouds')
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
    background-size cover
    background-position center
    background-repeat no-repeat
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
</style>
