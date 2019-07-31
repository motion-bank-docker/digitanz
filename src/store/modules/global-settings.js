const global = {
  namespaced: true,
  state: {
    statusInfoBox: false
  },
  getters: {
    getStatusInfoBox: state => state.statusInfoBox
  },
  mutations: {
    handlerStatusInfoBox (state, buttonAction) {
      console.log(buttonAction)
      state.statusInfoBox = !state.statusInfoBox
    }
  },
  actions: {
  }
}

export default global
