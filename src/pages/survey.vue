<template lang="pug">
  q-page.q-pa-lg.column
    h2.no-margin.q-pb-sm Kursevaluation
    p.q-pb-md Hier kannst du den Kurs bewerten. Die Angaben sind anonym und wir würden uns über deine ehrliche Meinung freuen.
    q-list.no-border.no-margin.no-padding.column(seperator, multiline)
      q-item.column(v-for="(item, index) in surveyQuestions", :question="question")
        q-item-tile
          p {{ item.question }}
          p {{ item.answer }}
        q-item-tile(style="width: 50vw")
          q-radio.q-ma-sm(v-model="item.answer", val="bad", color="transparent", keep-color, style="width: 20%")
            img(src="~assets/bad.png", style="width: 100%", :class="{ inactive: isTrue = false}")
          q-radio.q-ma-sm(v-model="item.answer", val="neutral", color="transparent", keep-color, style="width: 20%")
            img(src="~assets/neutral.png", style="width: 100%", :class="{ inactive: isTrue = false}")
          q-radio.q-ma-sm(v-model="item.answer", val="good", color="transparent", keep-color, style="width: 20%")
            img(src="~assets/good.png", style="width: 100%", :class="{ inactive: isTrue = false}")
    q-btn.item-center.q-mt-lg(label="Absenden", icon="send", color="primary")
</template>

<script>
  export default {
    data () {
      return {
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
    methods: {
    }
  }
</script>

<style lang="stylus" scoped>
  .inactive
    opacity: 0.2
</style>
