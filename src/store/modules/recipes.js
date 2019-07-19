const recipes = {
  namespaced: true,
  state: {
    tempRecipes: [],
    allIngredients: []
  },
  getters: {
    getTempRecipes: state => state.tempRecipes,
    getAllIngredients: state => state.allIngredients
  },
  mutations: {
    addToTempRecipes (state, val) {
      state.tempRecipes.push(val)

      state.allIngredients = []
      for (let [key, value] of Object.entries(state.tempRecipes)) {
        console.log(`${key}: ${value}`)
        let entries = Object.values(value)[1]
        for (let entry of Object.entries(entries)) {
          state.allIngredients.push(entry[1])
        }
      }
    },
    removeFromTempRecipes (state, val) {
      state.tempRecipes.splice(val, 1)

      state.allIngredients = []
      for (let [key, value] of Object.entries(state.tempRecipes)) {
        console.log(`${key}: ${value}`)
        let entries = Object.values(value)[1]
        for (let entry of Object.entries(entries)) {
          state.allIngredients.push(entry[1])
        }
      }
    },
    updateExistingRecipe (state, recipe) {
      state.tempRecipes.splice(recipe.index, 1, recipe)
      state.allIngredients = []
      for (let [key, value] of Object.entries(state.tempRecipes)) {
        console.log(`${key}: ${value}`)
        let entries = Object.values(value)[1]
        for (let entry of Object.entries(entries)) {
          state.allIngredients.push(entry[1])
        }
      }
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
