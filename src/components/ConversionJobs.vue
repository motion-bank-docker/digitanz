<template lang="pug">
  div
</template>

<script>
  import { DateTime } from 'luxon'
  export default {
    data () {
      return {
        pollTimeout: undefined
      }
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
        const jobIds = this.$store.state.conversions.jobIds
        for (let jobId of jobIds) {
          console.debug('checking conversion job...', jobId)
          const job = await this.$store.dispatch('conversions/get', jobId)
          console.debug('job status', jobId, job)
          if (job.failed) {
            this.$store.commit('conversions/removeJobId', jobId)
            this.$store.commit('conversions/removeJobDetail', jobId)
            this.$store.commit('notifications/addMessage', {
              body: 'messages.conversion_failed',
              type: 'error'
            })
          }
          else if (job.finished) {
            this.$store.commit('conversions/removeJobId', jobId)
            const detail = this.$store.state.conversions.jobDetails[jobId]
            const payload = {
              body: {
                source: {
                  id: job.result.video,
                  type: 'video/mp4'
                },
                type: 'Video',
                purpose: 'linking'
              },
              target: {
                id: `${process.env.TIMELINE_BASE_URI}${detail.timeline}`,
                type: 'Timeline',
                selector: {
                  type: 'Fragment',
                  value: DateTime.local().toISO()
                }
              }
            }
            console.debug('create annotation with payload', payload)
            const annotation = await this.$store.dispatch('annotations/post', payload)
            console.debug('created annotation', annotation)
            this.$store.commit('conversions/removeJobDetail', jobId)
            this.$root.$emit('updateVideos')
            this.$store.commit('notifications/addMessage', {
              body: 'messages.conversion_successful',
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