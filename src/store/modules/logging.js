import { DateTime } from 'luxon'
import { Assert } from 'mbjs-utils'

const logging = {
  namespaced: true,
  state: {
    messages: []
  },
  mutations: {
    addMessage: (state, data) => {
      state.messages.push(data)
    }
  },
  actions: {
    async log (context, { action, message }) {
      Assert.isType(action, 'string')
      Assert.ok(typeof message !== 'undefined')
      const entry = {
        app: process.env.APP_NAME,
        time: DateTime.local().toISO(),
        action,
        message
      }
      console.debug('logging', entry)
    }
  }
}

export default logging
