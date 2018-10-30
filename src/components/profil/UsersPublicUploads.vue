<template lang="pug">
  div
    video-modal(ref="videoModal")

    .text-center.q-mb-md(v-if="publicUploads.length <= 0 && isLoading")
      loading-spinner
    .q-mb-md.no-content(v-else-if="publicUploads.length <= 0 && !isLoading")
      span.text-grey-8 {{ $t('pages.profile.no_content') }}
    .row
      video-list-view(
        v-if="publicUploads && publicUploads.length > 0",
        :allowSelfResponse="true",
        :videos="publicUploads",
        layoutStyle="sm",
        :buttons="['more-download', 'more-delete']")
        template(slot="customButtons" slot-scope="{ video }")
          q-btn.q-px-none(flat, size="sm" round, icon="group", color="primary", @click="togglePublic(video)")
</template>

<script>
  import { mapGetters } from 'vuex'
  import LoadingSpinner from '../LoadingSpinner'
  import VideoListView from '../VideoListView'
  import VideoModal from '../VideoModal'
  import { VideoHelper } from '../../lib'
  import { ObjectUtil } from 'mbjs-utils'
  import { DateTime } from 'luxon'

  export default {
    components: {
      LoadingSpinner,
      VideoModal,
      VideoListView
    },
    data () {
      return {
        publicUploadsMapUUID: `${process.env.TIMELINE_BASE_URI}${process.env.PUBLIC_UPLOADS_TIMELINE_UUID}`,
        publicUploads: [],
        isLoading: false
      }
    },
    async mounted () {
      if (this.user) {
        await this.loadData()
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      async user (val) {
        if (val) await this.loadData()
      }
    },
    methods: {
      async loadData () {
        this.isLoading = true
        this.$q.loading.show({ message: this.$t('messages.loading_sequences') })
        const query = {
          'target.id': this.publicUploadsMapUUID,
          'author.id': this.user.uuid
        }
        const publicUploads = await VideoHelper.fetchVideoItems(this, query)
        // load responses
        for (let upload of publicUploads) {
          const responsesQuery = {
            'target.id': `${process.env.ANNOTATION_BASE_URI}${upload.annotation.uuid}`,
            'body.purpose': 'commenting'
          }
          upload.responses = await VideoHelper.fetchVideoItems(this, responsesQuery)
        }
        this.publicUploads = publicUploads
        this.$q.loading.hide()
        this.isLoading = false
      },
      async togglePublic (item, silent = true) {
        if (!silent) this.$q.loading.show({ message: this.$t('messages.setting_sequence') })
        const query = {
          'target.id': this.publicUploadsMapUUID,
          'author.id': this.user.uuid
        }
        let result = await this.$store.dispatch('annotations/find', query)

        let isCurrentItem = false
        for (let favouredItem of result.items) {
          // remove only this current item
          if (favouredItem.body.source.id === item.annotation.body.source.id) {
            isCurrentItem = true
            await this.$store.dispatch('annotations/delete', favouredItem.uuid)
            await this.$store.dispatch('acl/remove', {uuid: favouredItem.uuid, role: 'public', permission: 'get'})
          }
        }
        const message = {
          video: item.annotation.body.source.id,
          user: this.user.uuid
        }
        if (!isCurrentItem) {
          const annotation = {
            author: {
              id: this.user.uuid
            },
            body: ObjectUtil.merge({}, item.annotation.body),
            target: {
              id: this.publicUploadsMapUUID,
              type: 'Timeline',
              selector: {
                type: 'Fragment',
                value: DateTime.local().toISO()
              }
            }
          }
          const favouredItem = await this.$store.dispatch('annotations/post', annotation)
          if (favouredItem) {
            await this.$store.dispatch('acl/set', {uuid: favouredItem.uuid, role: 'public', permissions: ['get']})
          }
          await this.$store.dispatch('logging/log', { action: 'public_upload_set', message })
          if (!silent) this.$q.loading.hide()
        }
        else if (!silent) {
          await this.$store.dispatch('logging/log', { action: 'public_upload_unset', message })
          this.$q.loading.hide()
        }

        await this.loadData()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .no-content
    margin-top -1em
</style>
