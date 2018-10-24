<template lang="pug">
  q-page.q-pa-lg.column
    h2.no-margin.q-pb-sm Kursevaluation
    p.q-pb-md Hier kannst du den Kurs bewerten. Die Angaben sind anonym und wir würden uns über deine ehrliche Meinung freuen.
    q-list(v-if="hasVoted === false").no-border.no-margin.no-padding.column(seperator, multiline)
      q-item.column(v-for="(item, index) in surveyQuestions", :question="question")
        q-item-tile
          p {{ item.question }}
          p {{ item.answer }}
        q-item-tile(style="width: 50vw")
          q-radio.q-ma-sm(v-model="item.answer", val="bad", color="transparent", keep-color, style="width: 20%")
            img(src="~assets/bad.png", style="width: 100%", :class="{ inactive: isTrue}")
          q-radio.q-ma-sm(v-model="item.answer", val="neutral", color="transparent", keep-color, style="width: 20%")
            img(src="~assets/neutral.png", style="width: 100%", :class="{ inactive: isTrue}")
          q-radio.inactive.q-ma-sm(v-model="item.answer", val="good", color="transparent", keep-color, style="width: 20%")
            img(src="~assets/good.png", style="width: 100%", :class="{ inactive: isTrue}")
    q-btn.item-center.q-mt-lg(label="Absenden", icon="send", color="primary")
    q-item.column
      q-btn(@click="storeSurvey") SAVE
    p(v-if="hasVoted === true") Vielen Dank fuier deine tollen supi Antowrten.
    q-btn(v-if="surveyUUID", @click="deleteSurvey") RESET
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        hasVoted: undefined,
        surveyUUID: undefined,
        surveyQuestions: [
          {question: 'Wie fühlst du dich im Unterricht?', answer: undefined},
          {question: 'Kannst du das Ziel des Projekts erkennen?', answer: undefined},
          {question: 'Hast du das Gefühl, dass du etwas lernst?', answer: undefined},
          {question: 'Bewerte die bisherige Kommunikation im Kurs!', answer: undefined},
          {question: 'Kommst du mit den Aufgabenstellungen zurecht?', answer: undefined},
          {question: 'Bewerte den Umgang der von dir geteilten/hochgeladenen/erstellten Daten in der App!', answer: undefined},
          {question: 'Empfindest du dein hochgeladenes Videomaterial als Hilfe zum Gestalten?', answer: undefined},
          {question: 'Kannst du das Ziel des Projekts erkennen?', answer: undefined}
        ],
        isTrue: false
      }
    },
    async mounted () {
      await this.loadData()
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    watch: {
      async user () {
        await this.loadData()
      }
    },
    methods: {
      log (index) {
        console.log(this.selected + index)
      },
      async loadData () {
        if (!this.user) return
        this.hasVoted = await this.$store.dispatch('survey/hasVoted', this.user.uuid)
        if (this.hasVoted) {
          const result = await this.$store.dispatch('survey/fetchAnswers', this.user.uuid)
          console.log(result)
          console.log(result)
          this.surveyUUID = result[0].uuid
        }
        console.debug('hasVoted', this.hasVoted)
      },
      async storeSurvey () {
        await this.$store.dispatch('survey/storeSurvey', this.surveyQuestions)
        await this.loadData()
      },
      async deleteSurvey () {
        if (!this.surveyUUID) return
        await this.$store.dispatch('survey/deleteAnswers', this.surveyUUID)
        this.surveyUUID = undefined
        await this.loadData()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .inactive
    opacity: 0.2
</style>
