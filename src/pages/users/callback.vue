<template lang="pug">
  .row.fullscreen.vertical-middle.justify-center.items-center
    q-spinner-tail(color="primary", :size="72")
</template>

<script>
  export default {
    props: ['auth'],
    mounted () {
      const _this = this
      this.$auth.handleAuthentication(this.$store).then(async ({ user }) => {
        console.debug('Auth0 authenticated user', user)
        const nav = {
          appCodeName: navigator.appCodeName,
          appName: navigator.appName,
          appVersion: navigator.appVersion,
          cookieEnabled: navigator.cookieEnabled,
          language: navigator.language,
          platform: navigator.platform,
          product: navigator.product,
          userAgent: navigator.userAgent
        }
        Object.keys(navigator).forEach(key => { nav[key] = navigator[key] })
        await _this.$store.dispatch('logging/log', { action: 'login', message: { user: user.uuid, navigator: nav } })
        _this.$store.commit('notifications/addMessage', {
          body: _this.$t('messages.login_success'),
          type: 'success',
          options: { position: 'top' }
        })
        // if (first) _this.$router.replace({ name: 'users.manage', params: { isFirst: true } })
        // else _this.$router.replace({ name: 'site.welcome' })
        /*
        const redirect = _this.$store.state.auth.redirectUri
        if (redirect) {
          _this.$store.commit('auth/clearRedirect')
          _this.$router.replace(redirect)
        }
        else _this.$router.replace('/dashboard')
        */
        _this.$router.replace('/')
      }).catch(err => {
        console.error('Auth0 callback error:', err.error || err.message, err.error_description)
        _this.$store.commit('notifications/addMessage', {
          body: err.message,
          type: 'error',
          options: { position: 'top' }
        })
        _this.$router.replace('/')
      })
    }
  }
</script>
