const poses = {
  namespaced: true,
  state: {
    tempPoses: [],
    // tempGrid: {columns: 10, rows: 16},
    tempGrid: {columns: undefined, rows: undefined},
    frameLength: 300
  },
  getters: {
    getTempPoses: state => state.tempPoses,
    getTempGrid: state => state.tempGrid,
    getTempFrameLength: state => state.frameLength
  },
  mutations: {
    setTempFrameLength (state, val) {
      state.frameLength = val
    }
  },
  actions: {
  }
}

export default poses
