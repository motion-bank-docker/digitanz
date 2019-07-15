const recipes = {
  namespaced: true,
  state: {
    tempRecipes: []
  },
  getters: {
    getTempRecipes: state => state.tempRecipes
  },
  mutations: {
    setTempRecipes (state, val) {
      state.tempRecipes.push(val)
    }
  },
  actions: {
    async togglePublic (context, annotation) {
      console.debug('Recipes: togglePublic', annotation)
      return true
    },
    async isPublic (context, annotation) {
      console.debug('Recipes: isPublic', annotation)
      return true
    },
    async getPersonal (context, userID) {
      console.debug('Recipes: getPersonal', userID)
      return []
    },
    async getRemixed (context, userID) {
      console.debug('Recipes: getRemixed', userID)
      return []
    },
    async getPublic () {
      console.debug('Recipes: getPublic')
      return []
    },
    async getPublicRemixed () {
      console.debug('Recipes: getPublicRemixed')
      return []
    },
    async delete (context, annotation) {
      console.debug('Recipes: delete', annotation)
    }
  }
}

export default recipes
