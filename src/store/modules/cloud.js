const cloud = {
  namespaced: true,
  state: {
    tempClouds: [],
    tempTerms: [],
    cloudIndex: []
  },
  getters: {
    getTempClouds: state => state.tempClouds,
    getTempTerms: state => state.tempTerms,
    getCloudIndex: state => state.cloudIndex
  },
  mutations: {
    setCloudIndex (state, val) {
      state.cloudIndex = val
    },
    removeFromTempClouds (state, index) {
      state.tempClouds.splice(index, 1)
    },
    addToTempClouds (state, val) {
      state.tempClouds.push(val)
    },
    addToTempTerms (state, val) {
      state.tempTerms.push(val)
    }
  },
  actions: {
    async addWord (context, word) {
      console.debug('addWord', word)
    },
    async listWords () {
      console.debug('listWords')
      return []
    },
    async addAssociation (context, words) {
      console.debug('addAssociation', words)
    },
    async listAssociations (context, userId) {
      console.debug('listAssociations', userId)
      return []
    },
    async getAssociation (context, uuid) {
      console.debug('getAssociation', uuid)
    },
    async listPublicAssociations (context, userId) {
      console.debug('listPublicAssociations', userId)
      return []
    },
    async removeAssociation (context, uuid) {
      console.debug('removeAssociation', uuid)
    },
    async updateAssociationPublic (context, [uuid, isPublic]) {
      console.debug('updateAssociationPublic', uuid, isPublic)
    }
  }
}

export default cloud
