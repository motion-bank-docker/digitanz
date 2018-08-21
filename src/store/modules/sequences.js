import axios from 'axios'

const sequences = {
  namespaced: true,
  state: {
    jobIds: localStorage.getItem('sequences_jobIds') ? JSON.parse(localStorage.getItem('sequences_jobIds')) : [],
    jobDetails: localStorage.getItem('sequences_jobDetails') ? JSON.parse(localStorage.getItem('sequences_jobDetails')) : {}
  },
  getters: {
    getJobIds: state => state.jobIds,
    getJobDetails: state => state.jobDetails
  },
  mutations: {
    addJobId: (state, data) => {
      state.jobIds.push(data)
      localStorage.setItem('sequences_jobIds', JSON.stringify(state.jobIds))
    },
    addJobDetail: (state, { jobId, detail }) => {
      state.jobDetails[jobId] = detail
      localStorage.setItem('sequences_jobDetails', JSON.stringify(state.jobDetails))
    },
    removeJobId: (state, jobId) => {
      state.jobIds.splice(state.jobIds.indexOf(jobId))
      localStorage.setItem('sequences_jobIds', JSON.stringify(state.jobIds))
    },
    removeJobDetail: (state, jobId) => {
      const details = {}
      const jobIds = Object.keys(state.jobDetails)
      for (let id of jobIds) {
        if (jobId !== id) details[id] = state.jobDetails[id]
      }
      state.jobDetails = details
      localStorage.setItem('sequences_jobDetails', JSON.stringify(state.jobDetails))
    }
  },
  actions: {
    async post ({ commit }, { sequence, detail }) {
      const result = await axios.post(`${process.env.TRANSCODER_HOST}/sequences`, sequence)
      console.debug('sequence job added', sequence, result)
      if (result.data.jobId) {
        commit('addJobDetail', { jobId: result.data.jobId, detail })
        commit('addJobId', result.data.jobId)
      }
      else throw new Error('Missing job id')
      return result.data.jobId
    },
    async get (context, jobId) {
      const result = await axios.get(`${process.env.TRANSCODER_HOST}/sequences/${jobId}`)
      return result.data
    }
  }
}

export default sequences
