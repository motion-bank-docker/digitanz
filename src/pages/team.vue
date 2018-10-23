<template lang="pug">
  q-page.q-ma-md.column
    h3.text-center {{ $t('pages.team.headline') }}

    .q-mb-md
      | Bei Fragen stehen wir euch gerne zur Verfügung. Wir sind hier erreichbar:

    q-card.bg-dark.q-mb-md(v-for="member in team")
      q-card-main
        p {{ member.name }}
        p.q-mb-none
          | {{ member.mail }}
          br
          | {{ member.phone }}
    q-btn.q-ma-md.self-center(label="Bewerte den Kurs" icon="thumb_up" color="primary" @click="$router.push('')")

</template>

<script>
  export default {
    data () {
      return {
        team: [{
          mail: 'florian@motionbank.org',
          name: 'Florian Jenett',
          phone: '06131-628-2259'
        }, {
          mail: 'tbindel@uni-mainz.de',
          name: 'Tim Bindel',
          phone: '06131-39-23744'
        }]
      }
    }
  }
</script>

<style scoped lang="stylus">
</style>
