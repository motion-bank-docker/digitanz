<template lang="pug">
  div
</template>

<script>
  import { DateTime } from 'luxon'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        pollTimeout: undefined
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    mounted () {
      const _this = this
      this.pollTimeout = setTimeout(function () {
        _this.checkJobs()
      }, 1000)
    },
    beforeDestroy () {
      if (this.pollTimeout) clearTimeout(this.pollTimeout)
    },
    methods: {
      async checkJobs () {
        this.pollTimeout = undefined
        const jobIds = this.$store.state.sequences.jobIds
        for (let jobId of jobIds) {
          console.debug('checking sequence job...', jobId)
          const job = await this.$store.dispatch('sequences/get', jobId)
          console.debug('job status', jobId, job)
          if (job.failed) {
            this.$store.commit('sequences/removeJobId', jobId)
            this.$store.commit('sequences/removeJobDetail', jobId)
            this.$store.commit('notifications/addMessage', {
              body: 'messages.sequencing_failed',
              type: 'error'
            })
          }
          else if (job.finished) {
            this.$store.commit('sequences/removeJobId', jobId)
            const detail = this.$store.state.sequences.jobDetails[jobId]
            let annotation
            if (job.result && (detail.target || detail.timeline)) {
              const target = detail.target || {
                id: `${process.env.TIMELINE_BASE_URI}${detail.timeline}`,
                type: 'Timeline',
                selector: {
                  type: 'Fragment',
                  value: DateTime.local().toISO()
                }
              }
              const payload = {
                body: {
                  source: {
                    id: job.result.video,
                    type: 'video/mp4'
                  },
                  type: 'Video',
                  purpose: detail.purpose || 'linking'
                },
                target
              }
              console.debug('create annotation with payload', payload)
              annotation = await this.$store.dispatch('annotations/post', payload)
              console.debug('created annotation', annotation)
              if (detail.isPublic) {
                console.debug('make annotation public')
                await this.$store.dispatch('acl/set', {uuid: annotation.uuid, role: 'public', permissions: ['get']})
              }
            }
            this.$store.commit('sequences/removeJobDetail', jobId)
            const message = {
              video: job.result ? job.result.video : undefined,
              detail,
              annotation: annotation ? annotation.uuid : undefined,
              user: this.user.uuid
            }
            await this.$store.dispatch('logging/log', { action: 'convert', message })
            this.$root.$emit('updateSequences')
            this.$root.$emit('jobResult', { annotation, jobId, detail })
            this.$store.commit('notifications/addMessage', {
              body: 'messages.sequencing_successful',
              type: 'success'
            })
          }
        }
        const _this = this
        this.pollTimeout = setTimeout(function () {
          _this.checkJobs()
        }, 1000)
      }
    }
  }
</script>
