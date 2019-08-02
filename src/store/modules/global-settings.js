const global = {
  namespaced: true,
  state: {
    statusInfoBox: false,
    tool: undefined
  },
  getters: {
    getStatusInfoBox: state => state.statusInfoBox,
    getTool: state => state.tool
  },
  mutations: {
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
