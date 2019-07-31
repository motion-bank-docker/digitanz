const global = {
  namespaced: true,
  state: {
    statusInfoBox: false
  },
  getters: {
    getStatusInfoBox: state => state.statusInfoBox
  },
  mutations: {
    handlerStatusInfoBox (state) {
      state.statusInfoBox = !state.statusInfoBox
    }
  },
  actions: {
  }
}

export default global
