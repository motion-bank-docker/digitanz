const global = {
  namespaced: true,
  state: {
    statusInfoBox: false,
    tool: undefined,
    deviceDimensions: {height: undefined, width: undefined}
  },
  getters: {
    getStatusInfoBox: state => state.statusInfoBox,
    getTool: state => state.tool,
    getDeviceDimensions: state => state.deviceDimensions
  },
  mutations: {
    handlerDeviceDimensions (state, param) {
      console.log('device dimensions', state.deviceDimensions, param)
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
