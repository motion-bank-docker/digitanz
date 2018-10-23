<template lang="pug"></template>

<script>
  export default {
    mounted () {
      const query = this.$route.query
      if (query.success === 'true') {
        this.$store.commit('notifications/addMessage', {
          type: 'success',
          body: query.message,
          mode: 'alert',
          options: { position: 'top' }
        })
      }
      else {
        this.$store.commit('notifications/addMessage', {
          type: 'error',
          body: query.message || 'errors.email_verification_failed',
          mode: 'alert',
          options: { position: 'top' }
        })
      }
      this.$router.replace({ name: 'site.welcome' })
    }
  }
</script>
