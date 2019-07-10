const survey = {
  namespaced: true,
  state: {},
  actions: {
    async storeSurvey (context, answers) {
      console.debug('survey: storeSurvey', answers)
    },
    async hasVoted (context, uuid) {
      console.debug('survey: hasVoted', uuid)
      return true
    },
    async fetchAnswers (context, uuid) {
      console.debug('survey: fetchAnswers', uuid)
      return []
    },
    async deleteAnswers (context, uuid) {
      console.debug('survey: deleteAnswers', uuid)
    }
  }
}

export default survey
