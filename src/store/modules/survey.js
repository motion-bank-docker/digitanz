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

const survey = {
  namespaced: true,
  state: {},
  actions: {
    async storeSurvey (context, answers) {
      const result = await axios.post(`${baseURL}`, {
        type: 'survey',
        value: answers
      }, getRequestConfig())
      return result.data
    },
    async hasVoted (context, uuid) {
      const query = JSON.stringify({
        type: 'survey',
        'author.id': uuid
      })
      const result = await axios.get(`${baseURL}`, ObjectUtil.merge(getRequestConfig(), { params: { query } }))
      return !result.data.items || result.data.items > 0
    },
    async deleteAnswers (context, uuid) {
      const result = await axios.delete(`${baseURL}/${uuid}`, getRequestConfig())
      return result.data
    }
  }
}

export default survey
