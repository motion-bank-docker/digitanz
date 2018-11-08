<template lang="pug">
  q-card.relative-position.q-mb-lg.relative-position.bg-dark(:style="{'width':cardWidth}")
    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem(item.uuid)")
    // q-window-resize-observable(@resize="onResize")

    // icons
    span.my-flag(v-if="showContentFlag && user.uuid === item.author.id")
      q-icon(name="how_to_reg" size="1.3em")
    div.user-flag-wrapper(v-else-if="showContentFlag")
      div.user-flag(:style="{ 'background-image': 'url(' + portrait + ')' }")

    // content
    q-card-main.q-mb-lg
      p.recipe-title(@click="$router.push('/recipes/edit/' + item.uuid)", :style="{'color':color}") {{ parsedBody.title }}
      <!--div(v-if="parsedBody.entries.length > 0")-->
        <!--ol.q-pl-md-->
          <!--li.q-mb-md(v-for="(ingr, index) in parsedBody.entries") {{ ingr }}-->

    // buttons
    q-card-actions.absolute-bottom(v-if="buttonsX || buttonsY").row.justify-around

      // buttons
      q-btn(v-for="btn in buttonsX", @click="onAction(btn.label)", :icon="btn.icon",
      round, flat, size="sm", :class="{'text-primary': item.isPublic && btn.label === 'visibility'}")
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
  import Portrait from '../pages/portrait'
  import { DateTime } from 'luxon'
  // import { ObjectUtil } from 'mbjs-utils'

  export default {
    components: {
      Portrait,
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
      },
      color: {
        type: String,
        default: 'grey'
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
        responseCount: 0
      }
    },
    watch: {
      item () {
        this.parsedBody = JSON.parse(this.item.body.value)
      }
    },
    async mounted () {
      this.parsedBody = JSON.parse(this.item.body.value)
      console.log('a parsed recipe item', this.parsedBody)
      console.log('recipe item', this.item)
    },
    methods: {
      async deleteItem (item) {
        try {
          await this.$store.dispatch('annotations/delete', item)
        }
        catch (e) {
          console.error('Failed to remove annotation', e.message)
          this.$captureException(e)
        }
        this.$root.$emit('updateRecipes')
        console.debug('recipe might be deleted', item)
      },
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      async togglePublic (item) {
        console.debug('togglePublic called')
        const query = {
          'target.id': this.publicRecipesMapUUID,
          'author.id': this.user.uuid
        }
        let result = await this.$store.dispatch('annotations/find', query)

        let isCurrentItem = false
        for (let favouredItem of result.items) {
          // remove only this current item
          // console.log(favouredItem.body.value, item.body.value)
          if (favouredItem.body.source && favouredItem.body.source.id === item.id) {
            isCurrentItem = true
            await this.$store.dispatch('annotations/delete', favouredItem.uuid)
            await this.$store.dispatch('acl/remove', {uuid: favouredItem.uuid, role: 'public', permission: 'get'})
            console.debug('item is now private')
          }
        }
        const message = {
          video: item.id,
          user: this.user.uuid
        }
        if (!isCurrentItem) {
          const annotation = {
            author: {
              id: this.user.uuid
            },
            // body: ObjectUtil.merge({}, item.body),
            body: {
              purpose: 'linking',
              source: {
                id: item.id
              }
            },
            target: {
              id: this.publicRecipesMapUUID,
              type: 'Timeline',
              selector: {
                type: 'Fragment',
                value: DateTime.local().toISO()
              }
            }
          }
          const favouredItem = await this.$store.dispatch('annotations/post', annotation)
          console.debug('item is now public')
          if (favouredItem) {
            await this.$store.dispatch('acl/set', {uuid: favouredItem.uuid, role: 'public', permissions: ['get']})
          }
          await this.$store.dispatch('logging/log', { action: 'public_recipe_set', message })
        }
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
          this.$router.push('/clouds/' + this.item.uuid + '/responses')
          break
        case 'visibility':
          await this.togglePublic(this.item)
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
  @import '~variables'
  .recipe-title
    font-weight bold
    line-height 1.3em
    text-transform uppercase
    font-size 1.3em
    letter-spacing 0.05em
    color $grey-6
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
</style>
