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
    async post (context, { sequence, detail }) {
      console.debug('Sequence: post', sequence, detail)
      return 'dummyjob'
    },
    async get (context, jobId) {
      console.debug('Sequence: get', jobId)
    }
  }
}

export default sequences
