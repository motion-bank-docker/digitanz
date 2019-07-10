const metadata = {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async get (context, payload) {
      console.debug('Get metadata', payload)
      return {}
    }
  }
}

export default metadata
