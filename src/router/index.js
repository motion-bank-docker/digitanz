import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * When going with "history" mode, please also make sure "build.publicPath"
   * is set to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

Router.beforeEach((to, from, next) => {
  const message = {
    to: to ? to.fullPath : undefined,
    from: from ? from.fullPath : undefined
  }
  const waitForStore = (app, cb) => {
    if (app.$store === undefined) setTimeout(() => waitForStore(app, cb), 0)
    else cb()
  }
  waitForStore(Router.app, () => {
    if (!Router.app.$store.state.user) {
      Router.app.$auth.checkSession(Router.app.$store).catch(() => {
        if (to.meta.private) {
          // console.log('store redirect', to.fullPath)
          // Router.app.$store.commit('auth/setRedirect', to.fullPath)
          Router.app.$auth.authenticate()
        }
      }).then(result => {
        if (result) {
          const { user } = result
          /*
          if (first) {
            console.debug('Auth0 first login', user)
            next({ name: 'users.manage', params: { isFirst: true, redirect: to } })
          }
          else next()
          */
          next()
          message.user = user.uuid
        }
        else if (to.meta.private) {
          // console.log('store redirect', to.fullPath)
          // Router.app.$store.commit('auth/setRedirect', to.fullPath)
          Router.app.$auth.authenticate()
        }
        else next()
        return Router.app.$store.dispatch('logging/log', { action: 'nav', message })
      })
    }
    else {
      next()
      message.user = Router.app.$store.state.user.uuid
      return Router.app.$store.dispatch('logging/log', { action: 'nav', message })
    }
  })
})

export default Router
