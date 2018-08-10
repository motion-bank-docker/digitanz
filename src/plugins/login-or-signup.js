const login = function (store) {
  return store.dispatch('auth/authenticate', {
    strategy: 'local',
    email: localStorage.localLogin,
    password: localStorage.localPassword
  }).then(() => {
    if (localStorage.localTimeline) return
    const query = {
      query: {
        author: store.state.auth.payload.userId
      }
    }
    return store.dispatch('maps/find', query)
  }).then(timelines => {
    if (localStorage.localTimeline) return
    if (!timelines || !timelines.length) {
      const tl = {
        type: ['Timeline'],
        title: 'mytimeline',
        author: store.state.auth.payload.userId
      }
      return store.dispatch('maps/post', tl).then(timeline => {
        console.log('created timeline', timeline)
        localStorage.setItem('localTimeline', timeline.uuid)
      })
    }
    else localStorage.setItem('localTimeline', timelines[0].uuid)
  })
}

const loginOrSignup = function (store) {
  if (localStorage.localLogin) {
    return login(store)
  }
  else {
    return store.dispatch('users/create', {
      email: `${this.$localID()}@fake.motionbank.org`,
      password: this.$localID(),
      name: this.$localID()
    }).then(result => {
      console.log('created account', result)
      localStorage.setItem('localLogin', `${this.$localID()}@fake.motionbank.org`)
      localStorage.setItem('localPassword', this.$localID())
      return login(store)
    })
  }
}

export default ({ Vue }) => {
  Vue.prototype.$loginOrSignup = loginOrSignup
}
