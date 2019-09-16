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
    setColumns (state, param) {
      console.log(param)
      if (param) state.tempGrid.columns = param
    },
    setTempGrid (state, val) {
      if (state.tempGrid.rows > 2) state.tempGrid.rows += (val.rows * 2)
      else if (state.tempGrid.rows === 2 && val.rows === 1) state.tempGrid.rows += (val.rows * 2)
      if (state.tempGrid.columns > 2) state.tempGrid.columns += (val.columns * 2)
      else if (state.tempGrid.columns === 2 && val.columns === 1) state.tempGrid.columns += (val.columns * 2)
    },
    setTempFrameLength (state, val) {
      state.frameLength = val
    }
  },
  actions: {
  }
}

export default poses
