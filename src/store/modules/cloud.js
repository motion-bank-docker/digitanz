import axios from 'axios'
import { ObjectUtil } from 'mbjs-utils'

const getRequestConfig = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.access_token}`
    }
  }
}

const baseURL = `${process.env.DIGITANZ_API_HOST}/objects`

const cloud = {
  namespaced: true,
  state: {},
  actions: {
    async addWord (context, word) {
      const result = await axios.post(baseURL, {
        type: 'word',
        value: word
      }, getRequestConfig())
      return result.data
    },
    async listWords () {
      const query = JSON.stringify({ type: 'word' })
      const result = await axios.get(baseURL, ObjectUtil.merge(getRequestConfig(), { params: { query } }))
      return result.data ? result.data.items : []
    },
    async addAssociation (context, words) {
      const result = await axios.post(baseURL, {
        type: 'word-association',
        value: words
      }, getRequestConfig())
      return result.data
    },
    async listAssociations (context, userId) {
      let query = { type: 'word-association' }
      if (userId) query['author.id'] = userId
      query = JSON.stringify(query)
      const result = await axios.get(baseURL, ObjectUtil.merge(getRequestConfig(), { params: { query } }))
      return result.data ? result.data.items : []
    },
    async getAssociation (context, uuid) {
      const result = await axios.get(`${baseURL}/${uuid}`, getRequestConfig())
      return result.data
    },
    async listPublicAssociations (context, userId) {
      let query = { type: 'word-association', isPublic: true }
      if (userId) query['author.id'] = userId
      query = JSON.stringify(query)
      const result = await axios.get(baseURL, ObjectUtil.merge(getRequestConfig(), { params: { query } }))
      return result.data ? result.data.items : []
    },
    async removeAssociation (context, uuid) {
      const result = await axios.delete(`${baseURL}/${uuid}`, getRequestConfig())
      return result.data
    },
    async updateAssociationPublic (context, [uuid, isPublic]) {
      const result = await axios.patch(`${baseURL}/${uuid}`, { isPublic }, getRequestConfig())
      return result.data
    }
  }
}

export default cloud
