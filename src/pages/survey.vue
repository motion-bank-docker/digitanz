<template lang="pug">
  q-page.q-pa-lg
    h2.no-margin.q-pb-sm Kursevaluation
    p.q-pb-md Hier kannst du den Kurs bewerten. Die Angaben sind anonym und wir würden uns über deine ehrliche Meinung freuen.
    q-list.no-border.no-margin.no-padding.column(seperator, multiline)
      q-item.column(v-for="(item, index) in surveyQuestions", :question="question")
        q-item-tile
          p {{ item.question }}
          p {{ index }}
        q-item-tile(style="width: 50vw")
          q-radio.q-ma-sm(v-model="selected", val="bad + index", @input="log(index)", color="transparent", keep-color, style="width: 20%")
            img(src="~assets/bad.png", style="width: 100%")
          q-radio.q-ma-sm(v-model="selected", val="neutral + index", @input="log(index)", color="transparent", keep-color, style="width: 20%")
            img(src="~assets/neutral.png", style="width: 100%")
          q-radio.q-ma-sm(v-model="selected", val="good + index", @input="log(index)", color="transparent", keep-color, style="width: 20%")
            img(src="~assets/good.png", style="width: 100%")
</template>

<script>
  export default {
    data () {
      return {
        surveyQuestions: [
          {question: 'Wie fühlst du dich im Unterricht?'},
          {question: 'Kannst du das Ziel des Projekts erkennen?'},
          {question: 'Hast du das Gefühl, dass du etwas lernst?'},
          {question: 'Bewerte die bisherige Kommunikation im Kurs!'},
          {question: 'Kommst du mit den Aufgabenstellungen zurecht?'},
          {question: 'Bewerte den Umgang der von dir geteilten/hochgeladenen/erstellten Daten in der App!'},
          {question: 'Empfindest du dein hochgeladenes Videomaterial als Hilfe zum Gestalten?'},
          {question: 'Kannst du das Ziel des Projekts erkennen?'}
        ]
      }
    },
    methods: {
      log (index) {
        console.log(this.selected + index)
      }
    }
  }
</script>

<style scoped>
</style>
