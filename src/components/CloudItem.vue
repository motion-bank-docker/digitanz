<template lang="pug">
  q-card.relative-position.q-mb-lg.relative-position.bg-dark

    // confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem(item)")
    // q-window-resize-observable(@resize="onResize")

    // icons
    span.my-flag(v-if="showContentFlag && isOwnContent()")
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

  export default {
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    props: {
      buttonsX: Array,
      buttonsY: Array,
      item: [],
      publicUploadsMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.PUBLIC_UPLOADS_TIMELINE_UUID}`,
      publicUploads: []
    },
    mounted () {
      // this.loadPublicUploads()
    },
    methods: {
      async deleteItem (uuid) {
        await this.$store.dispatch('cloud/removeAssociation', uuid)
        this.emitLoadData()
      },
      emitLoadData () {
        this.$emit('emitLoadData')
      },
      /* getIconStyleUpload (item) {
        for (let publicUpload of this.publicUploads.items) {
          console.log('getIconStyleUpload', publicUpload)
          if (publicUpload.body.source && item.annotation.body.source.id === publicUpload.body.source.id) return {color: 'primary', icon: 'group'}
        }
        return {color: 'grey-5', icon: 'group'}
      }, */
      /* async loadPublicUploads () {
        const query = {
          'target.id': this.publicUploadsMapUUID,
          'author.id': this.user.uuid
        }
        this.publicUploads = await this.$store.dispatch('annotations/find', query)
        console.log('public uploads', this.publicUploads.items)
        console.log('public uploads length', this.publicUploads.items.length)
      }, */
      onAction (val) {
        switch (val) {
        case 'delete':
          // this.$refs.confirmDeleteModal.show('labels.confirm_delete', this.item, 'buttons.delete')
          this.deleteItem(this.item.uuid)
          this.emitLoadData()
          break
        case 'download':
          console.log('download')
          break
        case 'edit':
          this.$router.push('/clouds/' + this.item._id + '/responses')
          break
        case 'response':
          this.$router.push('/clouds/' + this.item._id + '/responses')
          break
        case 'visibility':
          // this.toggleItemFavorite(this.item)
          this.toggleItemPublic(this.item)
          break
        }
      },
      async toggleItemPublic (item) {
        await this.$store.dispatch('cloud/updateAssociationPublic', [item.uuid, !(item.isPublic === true)])
        this.emitLoadData()
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
