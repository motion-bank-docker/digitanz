const poses = {
  namespaced: true,
  state: {
    tempPoses: [],
    tempGrid: {columns: 10, rows: 16}
  },
  getters: {
    getTempPoses: state => state.tempPoses,
    getTempGrid: state => state.tempGrid
  },
  mutations: {
  },
  actions: {
  }
}

export default poses
