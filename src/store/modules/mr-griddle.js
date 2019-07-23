const poses = {
  namespaced: true,
  state: {
    tempPoses: []
  },
  getters: {
    getTempPoses: state => state.tempPoses
  },
  mutations: {
    addToTempRemixes (state, val) {
      state.tempPoses.push(val)
    }
  },
  actions: {
  }
}

export default poses
