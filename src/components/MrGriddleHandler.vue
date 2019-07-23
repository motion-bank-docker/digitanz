<template lang="pug">
  .row.items-center(style="border-top: 1px solid #666; height: 52px;")

    q-item.q-pa-none.full-width(style="min-height: auto;")

      // play-/stop-button
      q-item-side.q-ml-md(v-if="states.length > 0", style="min-width: auto;")
        q-btn.text-white(@click="$emit('clickPlay')", :icon="$props.play ? 'stop' : 'play_arrow'",
        :class="[$props.play ? 'bg-white text-grey-10' : 'border']", round, size="sm", flat,
        :disabled="states.length === 0")

      // state-buttons
      q-item-main.q-pl-md
        q-btn.q-mx-xs(v-for="(state, index) in states",
        round,  size="sm",
        :class="[currentState === index ? 'bg-white' : 'border scaled']",
        v-model="selectedStates",
        val="'option-' + {{index}}",
        @click="$emit('clickState', {state, index})",
        v-touch-hold="() => {openDeleteModal({state, index})}")

      // add-butoon
      q-item-side.q-mr-md(style="min-width: auto;")
        q-btn.no-padding.border.text-white(icon="add", size="sm", flat, no-ripple,
        round, @click="$emit('clickAdd')",
        :class="{'': states.length >= 5}",
        :disabled="states.length >= 5")

    //
      .col-xs-2.col-sm-1
        q-btn(icon="save", size="lg", @click="$emit('saveSequence')", :disabled="states.length <= 0")

    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")

</template>

<script>
  import ConfirmModal from '../components/ConfirmModal'

  export default {
    components: {
      ConfirmModal
    },
    props: [
      'states',
      'play',
      'currentState',
      'edit'
    ],
    data () {
      return {
        selectedStates: []
      }
    },
    watch: {
      play () {
        console.log(this.$props.play)
      }
    },
    methods: {
      openDeleteModal (item) {
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
      },
      deleteItem (item) {
        this.$emit('deleteItem', item)
      }
      // },
      // async deleteItem (item) {
      //   console.log('item should get deleted')
      //   this.$q.loading.show({ message: this.$t('messages.deleting_video') })
      //   // remove portrait annotation (if any)
      //   const query = {
      //     'target.id': `${process.env.TIMELINE_BASE_URI}${process.env.PORTRAITS_TIMELINE_UUID}`,
      //     'author.id': this.user.uuid,
      //     'body.source.id': item.annotation.body.source.id
      //   }
      //   let result = await this.$store.dispatch('annotations/find', query)
      //   if (result.items) {
      //     for (const portrait of result.items) {
      //       await this.$store.dispatch('annotations/delete', portrait.uuid)
      //       await this.$store.dispatch('acl/remove', {uuid: portrait.uuid, role: 'public', permission: 'get'})
      //     }
      //     const message = {
      //       video: item.annotation.body.source.id,
      //       user: this.user.uuid
      //     }
      //     await this.$store.dispatch('logging/log', { action: 'portrait_unset', message })
      //   }
      //   // remove item / annotation
      //   await VideoHelper.deleteVideoItem(this, item)
      //   this.$q.loading.hide()
      //   // await this.fetchVideos()
      //   this.$emit('changed')
      // }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~variables'

  .scaled
    transform scale(.5)

</style>
