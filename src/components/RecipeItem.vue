<template lang="pug">
  q-card.relative-position.q-mb-lg.relative-position.bg-dark
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem(item)")
    // q-window-resize-observable(@resize="onResize")

    // icons
    span.my-flag(v-if="showContentFlag && user.uuid === item.author.id")
      q-icon(name="how_to_reg" size="1.3em")
    div.user-flag-wrapper(v-else-if="showContentFlag")
      div.user-flag(:style="{ 'background-image': 'url(' + portrait + ')' }")

    // content
    q-card-main.q-mb-lg
      p.recipe-title(@click="$router.push('/recipes/edit/' + item.uuid)", :class="item.body.purpose === 'personal' ? 'text-primary' : 'text-secondary'") {{ parsedBody.title }}
      q-list(v-if="displayIngr && parsedBody.entries.length > 0", no-border, separator, dark, dense)
        q-item.listItem(v-for="(ingr, index) in parsedBody.entries")
          q-item-side {{ index + 1 }}
          q-item-main
            p.q-mb-none.word-break {{ ingr }}
    // buttons
    q-card-actions.absolute-bottom(v-if="buttonsX || buttonsY").row.justify-around

      // buttons
      q-btn(v-for="btn in buttonsX", @click="onAction(btn.label)", :icon="btn.icon",
      round, flat, size="sm", :class="{'text-primary': isPublic && btn.label === 'visibility'}")
        // q-chip(v-if="btn.label === 'response'", floating, color="red") {{ getResponseCount(item) }}
        q-chip(v-if="btn.label === 'response' && responseCount", floating, color="blue") {{ responseCount }}

      // buttons dropdown
      q-btn.q-px-none(v-if="buttonsY", flat, size="sm", round, icon="more_vert", @click="showActionButton = !showActionButton")
        q-popover.bg-dark(:offset="[10, 0]")
          q-list
            q-item(v-for="btn in buttonsY").q-px-sm
              q-btn(round, flat, size="sm", v-close-overlay, :icon="btn.icon", @click="onAction(btn.label)")

</template>

<script>
  import { mapGetters } from 'vuex'
  import ConfirmModal from '../components/ConfirmModal'
  import VideoHelper from '../lib/video-helper'

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
      showContentFlag: {
        type: Boolean,
        default: false
      },
      displayIngr: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        publicRecipesMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.PUBLIC_RECIPES_TIMELINE_UUID}`,
        parsedBody: {
          title: undefined,
          entries: [],
          position: undefined
        },
        responseCount: 0,
        portraitLoading: false,
        portrait: undefined,
        isPublic: false
      }
    },
    watch: {
      async item () {
        if (this.item) await this.loadData()
      }
    },
    async mounted () {
      this.parsedBody = JSON.parse(this.item.body.value)
      this.loadAuthorProfile()
      if (this.item) await this.loadData()
    },
    methods: {
      async loadData () {
        this.parsedBody = JSON.parse(this.item.body.value)
        this.isPublic = await this.$store.dispatch('recipes/isPublic', this.item)
        console.debug('parsed recipe item', this.parsedBody)
        console.debug('recipe item', this.item)
        const query = {
          'target.id': this.item.id,
          'target.type': 'Recipe',
          'body.purpose': 'commenting',
          'body.type': 'Video'
        }
        const responses = await this.$store.dispatch('annotations/find', query)
        this.responseCount = responses.items ? responses.items.length : 0
      },
      async loadAuthorProfile () {
        if (!this.user) return
        if (this.showContentFlag) {
          let user = this.item.author.id
          this.portraitLoading = true
          const portraitsMapResult = await this.$store.dispatch('maps/get', process.env.PORTRAITS_TIMELINE_UUID)
          if (portraitsMapResult) {
            const portraitsQuery = {
              'target.id': `${process.env.TIMELINE_BASE_URI}${portraitsMapResult.uuid}`,
              'author.id': user
            }
            let portrait = await VideoHelper.fetchVideoItems(this, portraitsQuery)
            if (typeof portrait === 'undefined') return
            this.portrait = portrait[0].preview.small
            this.portraitLoading = false
          }
        }
      },
      async deleteItem (item) {
        try {
          await this.$store.dispatch('recipes/delete', item)
        }
        catch (e) {
          console.error('Failed to remove recipe', e.message)
          this.$captureException(e)
        }
        this.$root.$emit('updateRecipes')
        console.debug('recipe might be deleted', item)
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async togglePublic (item) {
        this.isPublic = await this.$store.dispatch('recipes/togglePublic', item)
        console.debug('toggled public recipe', item, this.isPublic)
        this.$root.$emit('updateRecipes')
      },
      isOwnContent () {
        return (this.item.author.id === this.user.uuid)
      },
      async onAction (val) {
        switch (val) {
        case 'delete':
          this.$refs.confirmDeleteModal.show('labels.confirm_delete', this.item, 'buttons.delete')
          // await this.deleteItem(this.item.uuid)
          break
        case 'edit':
          this.$router.push(`/recipes/edit/${this.item.uuid}`)
          break
        case 'response':
          this.$router.push('/recipes/' + this.item.uuid + '/responses')
          break
        case 'visibility':
          await this.togglePublic(this.item)
          break
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'
  .recipe-title
    font-weight bold
    line-height 1.25em
    text-transform uppercase
    font-size 1.1em
    letter-spacing 0.05em
    overflow-wrap break-word
    word-wrap break-word
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
  .listItem
    padding 8px 0!important
</style>
