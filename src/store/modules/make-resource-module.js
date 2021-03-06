// const sift = require('sift')
import { Assert } from 'mbjs-utils'

const makeResourceModule = function (client, resourceName, resourceNamePluralised = undefined) {
  const
    name = resourceName,
    namePlural = resourceNamePluralised || `${name}s`,
    idList = `${resourceName}IDs`

  const makeResourceAction = (action) => {
    return (context/*, args */) => {
      context.commit('setPending', action)
      /**
       * Execute action
       */
      // if (!Array.isArray(args)) args = [args]
      if (action === 'find') return { items: [] }
    }
  }

  return {
    namespaced: true,
    state: {
      [namePlural]: [],
      [idList]: [],
      currentItem: undefined,
      currentQuery: undefined,
      isPending: {
        find: false,
        get: false,
        post: false,
        put: false,
        patch: false,
        delete: false
      }
    },
    mutations: {
      find: (state, data) => {
        state[namePlural] = data.items
      },
      get: (state, data) => {
        state.currentItem = data
      },
      post: (state, data) => {
        state[namePlural].push(data)
      },
      put: (state, args) => {
        let [id, data] = args
        data.uuid = id
        const index = state[idList].indexOf(id)
        if (index > -1) {
          state[namePlural][index] = data
        }
        else throw new Error(`Update ${name} failed: not found`)
      },
      patch: (state, args) => {
        let [id, data] = args
        data.uuid = id
        // const index = state[idList].indexOf(id)
        // TODO: fix the vuex caching
        // if (index > -1) state[namePlural][index] = ObjectUtil.merge(state[namePlural][index], data)
        // else throw new Error(`Update ${name} failed: not found`)
      },
      delete: (state, id) => {
        console.debug('stub delete', id)
      },
      setPending: (state, action, status = true) => {
        Assert.isType(status, 'boolean', 'setPending: status must be boolean')
        state.isPending[action] = status
      }
    },
    actions: {
      find: makeResourceAction('find'),
      get: makeResourceAction('get'),
      post: makeResourceAction('post'),
      put: makeResourceAction('put'),
      patch: makeResourceAction('patch'),
      delete: makeResourceAction('delete')
    }
  }
}

export default makeResourceModule
