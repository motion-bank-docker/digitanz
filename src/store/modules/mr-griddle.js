const poses = {
  namespaced: true,
  state: {
    tempPoses: [],
    tempGrid: {
      rows: 20,
      columns: 10
    },
    cellRatio: 1,
    frameLength: 300
  },
  getters: {
    getTempPoses: state => state.tempPoses,
    getTempGrid: state => state.tempGrid,
    getTempFrameLength: state => state.frameLength,
    getCellRatio: state => state.cellRatio
  },
  mutations: {
    setCellRatio (state, ratio) {
      state.cellRatio = ratio
      console.log(state.cellRatio)
    },
    setTempGrid (state, val) {
      console.log('store: tempGrid', val)
      state.tempGrid.rows += val.rows
    },
    setTempFrameLength (state, val) {
      state.frameLength = val
    }
  },
  actions: {
  }
}

export default poses
