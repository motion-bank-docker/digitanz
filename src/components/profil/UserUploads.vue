<template lang="pug">
  div
    video-list-view(:videos="uploads",
                    v-if="portraits.map",
                    layoutStyle="sm",
                    :buttons="['delete', 'download']",
                    :showDuration="true",
                    @changed="loadData")
      template(slot="customButtons" slot-scope="{ video }")
        q-btn.q-px-none(flat, size="sm" round, :icon="getItemStyle(video).icon", :color="getItemStyle(video).color", @click="setAsPortrait(video)")
    .text-center(v-else)
      loading-spinner

</template>

<script>
  import LoadingSpinner from '../LoadingSpinner'
  import VideoListView from '../VideoListView'
  import { mapGetters } from 'vuex'
  import { VideoHelper } from '../../lib'
  import { DateTime } from 'luxon'
  import { ObjectUtil } from 'mbjs-utils'

  export default {
    components: {
      LoadingSpinner,
      VideoListView
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    data () {
      return {
        uploads: [],
        portraits: {
          map: undefined,
          annotations: []
        }
      }
    },
    async mounted () {
      if (this.user) {
        await this.loadData()
        await this.loadPortraits()
      }
    },
    watch: {
      async user (val) {
        if (val) await this.loadData()
        if (val) await this.loadPortraits()
      }
    },
    methods: {
      async loadData () {
        let query = {
          'author.id': this.$store.state.auth.user.uuid,
          'title': 'Meine Videos'
        }
        let results = await this.$store.dispatch('maps/find', query)
        if (results.items && results.items.length) {
          this.map = Object.assign({}, results.items[0])
          query = {
            'author.id': this.user.uuid,
            'body.type': 'Video',
            'body.source.type': 'video/mp4',
            'target.id': {
              $eq: `${process.env.TIMELINE_BASE_URI}${this.map.uuid}`
            }
          }
          this.uploads = await VideoHelper.fetchVideoItems(this, query)
        }
      },
      getItemStyle (item) {
        for (let portrait of this.portraits.annotations) {
          if (portrait.body.source && item.annotation.body.source.id === portrait.body.source.id) return {color: 'primary', icon: 'account_box'}
        }
        return {color: 'grey-5', icon: 'portrait'}
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
          await this.$store.dispatch('acl/remove', {uuid: portrait.uuid, role: 'public', permission: 'get'})
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
        // fetch new portrait on profile page
        this.$emit('changed')
      },
      async loadPortraits () {
        /**
         * Get the global portrait timeline and its contents
         */
        const portraitsMapResult = await this.$store.dispatch('maps/get', process.env.PORTRAITS_TIMELINE_UUID)
        if (portraitsMapResult) {
          const portraitsQuery = {
            'target.id': `${process.env.TIMELINE_BASE_URI}${portraitsMapResult.uuid}`,
            'author.id': this.user.uuid
          }
          const portraitsResult = await this.$store.dispatch('annotations/find', portraitsQuery)
          const portraitAnnotations = portraitsResult.items.sort(this.$sort.onCreatedDesc)
          this.portraits = Object.assign({}, this.portraits, {map: portraitsMapResult, annotations: portraitAnnotations})
          console.log('portraits loaded: ', this.portraits)
        }
      }
    }
  }
</script>

<style scoped>

</style>
