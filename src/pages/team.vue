<template lang="pug">
  q-page.q-ma-md
    h3.text-center {{ $t('pages.team.headline') }}

    q-card.bg-dark.q-mb-md(v-for="member in team")
      q-card-main
        p {{ member.name }}
        p.q-mb-none
          | {{ member.mail }}
          br
          | {{ member.phone }}

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
