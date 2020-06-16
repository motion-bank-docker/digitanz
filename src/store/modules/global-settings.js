const global = {
  namespaced: true,
  state: {
    statusInfoBox: false,
    tool: '',
    deviceDimensions: {height: undefined, width: undefined},
    scrollPosition: {x: undefined, y: undefined}
  },
  getters: {
    getStatusInfoBox: state => state.statusInfoBox,
    getTool: state => state.tool,
    getDeviceDimensions: state => state.deviceDimensions,
    getScrollPosition: state => state.scrollPosition
  },
  mutations: {
    handlerScrollPosition (state, param) {
      state.scrollPosition.y = param.y
    },
    handlerDeviceDimensions (state, param) {
      state.deviceDimensions.width = param.width
      state.deviceDimensions.height = param.height
    },
    handlerTool (state, target) {
      state.tool = target
    },
    handlerStatusInfoBox (state, param) {
      if (param === 'close') state.statusInfoBox = false
      if (param === 'open') state.statusInfoBox = true
      // else state.statusInfoBox = !state.statusInfoBox
    }
  },
  actions: {
  }
}

export default global
