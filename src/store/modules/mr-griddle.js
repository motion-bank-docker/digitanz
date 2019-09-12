const poses = {
  namespaced: true,
  state: {
    tempPoses: [],
    // tempGrid: {columns: 10, rows: 16},
    tempGrid: {
      landscape: {columns: 28, rows: 20},
      portrait: {columns: 10, rows: 18}
    },
    frameLength: 300
  },
  getters: {
    getTempPoses: state => state.tempPoses,
    getTempGrid: state => state.tempGrid,
    getTempFrameLength: state => state.frameLength
  },
  mutations: {
    setTempGrid (state, val) {
      console.log('store: tempGrid', val)
      state.tempGrid.landscape.columns += val.columns
      state.tempGrid.landscape.rows += val.rows
      state.tempGrid.portrait.columns += val.columns
      state.tempGrid.portrait.rows += val.rows
    },
    setTempFrameLength (state, val) {
      state.frameLength = val
    }
  },
  actions: {
  }
}

export default poses
