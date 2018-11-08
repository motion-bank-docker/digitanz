import { Assert } from 'mbjs-utils'

const publicTimelineID = `${process.env.TIMELINE_BASE_URI}${process.env.PUBLIC_RECIPES_TIMELINE_UUID}`

const recipes = {
  namespaced: true,
  state: {},
  actions: {
    async togglePublic ({ dispatch }, annotation) {
      Assert.isType(annotation.id, 'string', 'annotation id must be string')
      const query = {
        'target.id': publicTimelineID,
        'body.source.id': annotation.id,
        'body.type': 'Recipe',
        'body.purpose': 'linking'
      }
      const results = await dispatch('annotations/find', query, { root: true })
      if (results && results.items && results.items.length) {
        for (let a of results.items) {
          await dispatch('annotations/delete', a.uuid, { root: true })
          try {
            await dispatch('acl/remove', {uuid: a.uuid, role: 'digitanz', permission: 'get'}, {root: true})
          }
          catch (e) { console.debug('unable to remove acl for public recipe annotation', e) }
        }
        // try {
        //   await dispatch('acl/remove', {uuid: annotation.uuid, role: 'digitanz', permission: 'get'}, { root: true })
        // }
        // catch (e) { console.debug('unable to remove acl for recipe annotation', e) }
        return false
      }
      else {
        const a = {
          target: {
            id: publicTimelineID,
            type: 'Timeline'
          },
          body: {
            purpose: 'linking',
            type: 'Recipe',
            value: annotation.body.value,
            source: {
              id: annotation.id
            }
          }
        }
        try {
          const pa = await dispatch('annotations/post', a, { root: true })
          // await dispatch('acl/set', {uuid: annotation.uuid, role: 'digitanz', permissions: ['get']}, { root: true })
          await dispatch('acl/set', {uuid: pa.uuid, role: 'digitanz', permissions: ['get']}, { root: true })
        }
        catch (e) { console.debug('unable to create public recipe annotation', e) }
        return true
      }
    },
    async isPublic ({ dispatch }, annotation) {
      Assert.isType(annotation.id, 'string', 'annotation id must be string')
      const query = {
        'target.id': publicTimelineID,
        'body.source.id': annotation.id,
        'body.type': 'Recipe',
        'body.purpose': 'linking'
      }
      const results = await dispatch('annotations/find', query, { root: true })
      return results && results.items && results.items.length
    },
    async getPersonal ({ dispatch }) {
      const query = {
        'target.id': { $ne: publicTimelineID },
        'body.purpose': 'personal',
        'body.type': 'Recipe'
      }
      const results = await dispatch('annotations/find', query, { root: true })
      if (results && results.items) return results.items
      return []
    },
    async getRemixed ({ dispatch }) {
      const query = {
        'target.id': { $ne: publicTimelineID },
        'body.purpose': 'remix',
        'body.type': 'Recipe'
      }
      const results = await dispatch('annotations/find', query, { root: true })
      if (results && results.items) return results.items
      return []
    },
    async getPublic ({ dispatch }) {
      const query = {
        'target.id': publicTimelineID,
        'body.type': 'Recipe'
      }
      const results = await dispatch('annotations/find', query, { root: true })
      if (results && results.items) return results.items
      return []
    },
    async delete ({ dispatch }, annotation) {
      const query = {
        'target.id': publicTimelineID,
        'body.source.id': annotation.id,
        'body.source.type': 'Recipe',
        'body.purpose': 'linking'
      }
      const results = await dispatch('annotations/find', query, { root: true })
      if (results && results.items && results.items.length) {
        for (let a of results.items) {
          await dispatch('annotations/delete', a.uuid, { root: true })
          try {
            await dispatch('acl/remove', {uuid: a.uuid, role: 'digitanz', permission: 'get'}, {root: true})
          }
          catch (e) { console.debug('unable to remove acl for public recipe annotation', e) }
        }
      }
      await dispatch('annotations/delete', annotation.uuid, { root: true })
    }
  }
}

export default recipes
