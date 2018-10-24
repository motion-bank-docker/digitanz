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
    }
  }
}

export default cloud
