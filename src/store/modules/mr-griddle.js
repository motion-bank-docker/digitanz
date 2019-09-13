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
      console.log('cellRatio', state.cellRatio)
    },
    setTempGrid (state, val) {
      if (state.tempGrid.rows > 2) state.tempGrid.rows += val.rows
      else if (state.tempGrid.rows === 2 && val.rows === 1) state.tempGrid.rows += val.rows
      if (state.tempGrid.columns > 2) state.tempGrid.columns += val.columns
      else if (state.tempGrid.columns === 2 && val.columns === 1) state.tempGrid.columns += val.columns
    },
    setTempFrameLength (state, val) {
      state.frameLength = val
    }
  },
  actions: {
  }
}

export default poses
