<template lang="pug">
  .bg-dark.row.items-center.q-pa-xs.justify-between(style="width: 100vw; height: 10vh")
    .col-xs-2.col-sm-1
      q-btn.q-ma-xs(icon="play_arrow", size="lg")
    q-list.no-border.col-xs-8.col-sm-15
      q-radio.q-mx-xs(v-for="(state, index) in storedStates", v-model="selectedState", val="'opt' + {{index}}", size="xl",
      v-touch-hold.prevent="openDeleteModal")
      q-btn.q-ma-xs(icon="add", size="sm", round, style="border-style: dashed", color="grey-6", text-color="dark")
    .col-xs-2.col-sm-1
      q-btn.q-ma-xs(icon="save", size="lg")

    confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")
</template>

<script>
  import ConfirmModal from '../components/ConfirmModal'

  export default {
    components: {
      ConfirmModal
    },
    data () {
      return {
        storedStates: [
          'state1', 'state2', 'state3', 'state1', 'state2'
        ]
      }
    },
    methods: {
      openDeleteModal (item) {
        console.log(item.position) // {x: 22, y: 451}
        console.log(item.duration) // 600
        this.$refs.confirmDeleteModal.show('labels.confirm_delete', item, 'buttons.delete')
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

<style scoped>

</style>
