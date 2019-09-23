<template lang="pug">
  q-page
    // q-scroll-observable(@scroll="scrollingHandler")

    q-page-sticky.z-top.q-pb-xl.transition(position="bottom", :class="{'opacity-0': textOpacity}")
      q-btn.text-weight-regular.text-grey-9.bg-grey-1.q-mx-sm.q-px-lg(@click="smoothScroll('down')", flat, rounded, no-caps, size="lg") Info
      q-btn.text-weight-regular.text-grey-9.bg-grey-1.q-mx-sm.q-px-lg(@click="$router.push({path: '/tools'})", flat, rounded, no-caps, size="lg") Tools

    // ------------------------------------------------------------------------------------------------------ teaser-img
    .fixed-top.bg-grey-3
      .row.items-end(:style="{height: '100vh'}")
        .fit.text-center
          .fit.transition(style="background: url('statics/003-master-1.svg'); background-size: contain; background-repeat: no-repeat; background-position: center center; transform: scale(.9);",
          :class="{'opacity-0': textOpacity}")

    // ----------------------------------------------------------------------------------------------------- description
    .row.line-height-wider(style="margin-top: 100vh;")

      .row.z-top.full-height(style="min-height: 100vh;")

        .col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3.text-grey-9

          .q-px-md.q-mr-md.q-subheading.text-weight-regular.q-pt-md(style="line-height: 1.7rem;")
            div.q-mb-md.hyphens
              | Die in dieser App versammelten Tools sind für den Einsatz in einem angeleiteten Tanzkurs oder Workshop gedacht. Zu jedem Tool finden Sie in der App einige Beispiele für deren Einsatz. Darüber hinaus sind natürlich noch vielfältige andere Nutzungsformen denkbar und wir freuen uns über Ihre Erfahrungsberichte dazu.
            div.hyphens
              | Die einzelnen Tools sind ein Auszug aus einer für einen Tanzkurs an einer Regelschule entwickelten App, die im Forschungsprojekt #digitanz (Link auf digitanz.de) zum Einsatz kam. Das Kooperationsprojekt zwischen der Johannes Gutenberg Universität und der Hochschule Mainz erforscht, ob und wie digitale Tools die Kreativität der Schüler eines Tanzkurses an einer Regelschule beeinflussen. Das Projekt #digitanz findet im Rahmen der Förderlinie „Digitalität in der kulturellen Bildung“ des BMBF statt.

        .row.full-width.bg-white.q-my-xl
          .row.col-12.items-center.q-px-lg.q-py-md
            .col-xs-6.col-xs-4.col-md-3.text-center.q-px-md.q-my-sm
              img(src="~assets/BMBF_deutsch.jpg", style="max-height: 80px;")
            .col-xs-6.col-xs-4.col-md-3.text-center.q-px-md.q-my-sm
              img(src="statics/HSM_Logo_G_schwarz_klein_bold_regular.png", style="max-height: 30px;")
            .col-xs-6.col-xs-4.col-md-3.text-center.q-px-md.q-my-sm
              img(src="statics/logo-jgu.svg", style="max-height: 50px;")
            .col-xs-6.col-xs-4.col-md-3.text-center.q-px-md.q-my-sm
              img(src="statics/motionbank_logo.svg", style="max-height: 50px;")

        // ------------------------------------------------------------------------------------------------- description
        // div.bg-grey-3.text-grey-9.full-width.q-px-md.q-pb-md
        .col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3.text-grey-9.q-pb-md
          .q-px-md
            | Holzstraße 36
            br
            | 55116 Mainz

</template>

<script>
  import { mapGetters } from 'vuex'

  import * as pkg from '../../package.json'
  export default {
    data () {
      return {
        name: pkg.name,
        version: pkg.version,
        // scrolled: false,
        // mrGriddleOpacity: 1,
        // mrGriddleOffset: 0,
        scrollY: 0
      }
    },
    computed: {
      ...mapGetters({
        deviceDimensions: 'globalSettings/getDeviceDimensions',
        scrollPosition: 'globalSettings/getScrollPosition'
      }),
      mrGriddleOffset () {
        return (this.scrollPosition.y / -5).toFixed(2)
      },
      mrGriddleOpacity () {
        return 1 / (this.scrollPosition.y / 250)
      },
      textOpacity () {
        // return this.scrollPosition.y > this.deviceDimensions.height * 0.34 + 48
        return this.scrollPosition.y > 30
      }
    },
    methods: {
      scrollingHandler () {
        // scroll.position > 10 ? this.scrolled = true : this.scrolled = false
        // this.mrGriddleOpacity = 1 / (scroll.position / 250)
        // this.mrGriddleOffset = (this.scrollPosition.y / -5).toFixed(2)
        // this.scrollY = scroll.position
      },
      smoothScroll (direction) {
        console.log(direction)
        let distance
        if (direction === 'down') distance = this.deviceDimensions.height
        else distance = 0
        window.scroll({
          top: distance,
          behavior: 'smooth'
        })
      }
    }
  }
</script>

<style scoped lang="styl">
  .hide-arrow
    /*opacity 0*/
    /*margin-bottom -100px*/
    button
      opacity 0
</style>
