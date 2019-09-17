const poses = {
  namespaced: true,
  state: {
    tempPoses: [],
    tempGrid: {
      rows: 20,
      columns: 10
    },
    cellRatio: 1,
    frameLength: 300,
    svgSize: {width: undefined, height: undefined}
  },
  getters: {
    getTempPoses: state => state.tempPoses,
    getTempGrid: state => state.tempGrid,
    getTempFrameLength: state => state.frameLength,
    getCellRatio: state => state.cellRatio,
    getSvgSize: state => state.svgSize
  },
  mutations: {
    setSvgSize (state, size) {
      console.log('svgSize', size)
      state.svgSize.width = size.width
      state.svgSize.height = size.height
    },
    setCellRatio (state, ratio) {
      state.cellRatio = ratio
      console.log('cellRatio', state.cellRatio)
    },
    setColumns (state, param) {
      console.log(param)
      if (param) state.tempGrid.columns = param
    },
    setTempGrid (state, val) {
      if (state.tempGrid.rows > 4) state.tempGrid.rows += (val.rows * 2)
      else if (state.tempGrid.rows === 4 && Math.sign(val.rows) > 0) state.tempGrid.rows += (val.rows * 2)
      if (state.tempGrid.columns > 4) state.tempGrid.columns += (val.columns * 2)
      else if (state.tempGrid.columns === 4 && Math.sign(val.columns) > 0) state.tempGrid.columns += (val.columns * 2)
    },
    setTempFrameLength (state, val) {
      state.frameLength = val
    }
  },
  actions: {
  }
}

export default poses
