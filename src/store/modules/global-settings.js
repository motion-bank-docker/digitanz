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
    handlerStatusInfoBox (state) {
      state.statusInfoBox = !state.statusInfoBox
    }
  },
  actions: {
  }
}

export default global
