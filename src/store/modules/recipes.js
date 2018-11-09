import { Assert } from 'mbjs-utils'
import parseURI from 'mbjs-data-models/src/lib/parse-uri'

const publicTimelineID = `${process.env.TIMELINE_BASE_URI}${process.env.PUBLIC_RECIPES_TIMELINE_UUID}`

const recipes = {
  namespaced: true,
  state: {},
  actions: {
    async togglePublic ({ dispatch }, annotation) {
      Assert.isType(annotation.id, 'string', 'annotation id must be string')
      const id = annotation.body.source && annotation.body.source.id ? annotation.body.source.id : annotation.id
      const query = {
        'target.id': publicTimelineID,
        'body.source.id': id,
        'body.type': 'Recipe'
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
            purpose: annotation.body.purpose,
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
      const id = annotation.body.source && annotation.body.source.id ? annotation.body.source.id : annotation.id
      const query = {
        'target.id': publicTimelineID,
        'body.source.id': id,
        'body.type': 'Recipe'
      }
      const results = await dispatch('annotations/find', query, { root: true })
      return results && results.items && results.items.length
    },
    async getPersonal ({ dispatch }, userID) {
      const query = {
        'author.id': userID,
        'target.id': { $ne: publicTimelineID },
        'body.purpose': 'personal',
        'body.type': 'Recipe'
      }
      const results = await dispatch('annotations/find', query, { root: true })
      if (results && results.items) return results.items
      return []
    },
    async getRemixed ({ dispatch }, userID) {
      const query = {
        'author.id': userID,
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
        'body.type': 'Recipe',
        'body.purpose': 'personal'
      }
      const results = await dispatch('annotations/find', query, { root: true })
      if (results && results.items) return results.items
      return []
    },
    async getPublicRemixed ({ dispatch }) {
      const query = {
        'target.id': publicTimelineID,
        'body.type': 'Recipe',
        'body.purpose': 'remix'
      }
      const results = await dispatch('annotations/find', query, { root: true })
      if (results && results.items) return results.items
      return []
    },
    async delete ({ dispatch }, annotation) {
      let id = annotation.id, uuid = annotation.uuid
      if (annotation.body.source && annotation.body.source.id) {
        id = annotation.body.source.id
        uuid = parseURI(id).uuid
      }
      const query = {
        'target.id': publicTimelineID,
        'body.source.id': id,
        'body.type': 'Recipe'
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
      await dispatch('annotations/delete', uuid, { root: true })
    }
  }
}

export default recipes
