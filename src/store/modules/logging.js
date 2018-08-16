import axios from 'axios'
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
      try {
        const result = await axios.post(`${process.env.LOGGER_HOST}/entries`, entry)
        return result.data
      }
      catch (e) { console.error(`Failed to store log entry: ${e.message}`) }
    }
  }
}

export default logging
