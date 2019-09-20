<template lang="pug">
  q-page.bg-grey-3
    // q-scroll-observable(@scroll="scrollingHandler")

    .fixed-top.bg-grey-3

      // ---------------------------------------------------------------------------------------------------- teaser-img
      .row.items-center(:style="{height: '66vh'}")

        //----- images
        .full-width.text-center(:style="{height: '66vh', transform: 'translateY(' + mrGriddleOffset + 'px)'}")
          div.fit(style="background: url('statics/digitanz-2.jpg'); background-size: cover;")
          // img(src="statics/digitanz-2.jpg", style="height: 100%;")

        //----- text
        .absolute.transition.q-mx-md.text-center.full-width.row(:class="{'opacity-0': textOpacity}")

          .text-grey-1.q-mt-md.q-headline.q-px-md.col-xs-12.col-sm-10.offset-sm-1.col-md-6.offset-md-3(style="border-radius: 3px;")
            | #digitanz
            span.text-weight-light lite
            | &nbsp;entstand aus einem Forschungsprojekt zwischen JGU und HS Mainz.

          .text-center.q-mt-md.q-pt-md.col-12
            q-btn.bg-grey-3.text-grey-9.round-borders-3(@click="smoothScroll", flat, no-caps)
              | Mehr...

        // griddle-moves.col-xs-10.col-sm-9.col-md-8.col-lg-7.col-xl-5(:enclosed="true", :time="1000")

      //----- buttons
      .row.items-center.justify-center(:style="{height: '34vh'}")
        .q-px-lg.row.full-width
          .col-xs-8.offset-xs-2.col-md-4.offset-md-4.row.items-center.text-grey-9.transition(
          :class="{'opacity-0': textOpacity}")

            .col-12.text-center
              q-item.q-pa-none.q-mb-xs
                q-item-main
                  q-item-tile.q-pb-sm.text-center.text-grey-9
                    q-btn.text-grey-7.bg-grey-1(@click="$router.push({path: '/tools'})", flat, round, size="xl", no-caps)
                      // .q-caption.text-weight-bold Tools
                      q-icon.rotate-180(name="keyboard_backspace", size="26px")
                      // q-icon(name="build", size="26px")
                  q-item-tile.text-center.q-pt-sm
                    .q-caption.text-weight-medium
                      | Zu den Tools

    // ------------------------------------------------------------------------------------------------------------ menu
    .desktop-only.fixed-bottom-left.q-headline.q-ma-lg.z-max.transition(:class="{'opacity-0': !textOpacity}")
      .round-borders-3.q-mt-xs.q-px-sm Das Projekt.
      .bg-white.round-borders-3.q-mt-xs.q-px-sm Das Team.
      .round-borders-3.q-mt-xs.q-px-sm Die Tools.
      .round-borders-3.q-mt-xs.q-px-sm Die Ergebnisse.
    // --------------------------------------------------------------------------------------------------------- content
    .row.q-body-1.line-height-wider(style="margin-top: 150vh;")

      .row.bg-grey-3.z-top

        .col-xs-12.col-sm-8.offset-sm-2.col-md-7.offset-md-4.bg-grey-3.text-grey-8

          .q-px-md(style="margin-bottom: 33vh;")
            .q-headline.q-px-md.q-py-xl
              | Das Projekt.
            div.q-mb-md
              | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.
            div.q-mb-md
              | Consetetur sadipscing elitr, sed diam nonumy eirmod tempor sed diam nonumy eirmod tempor invidunt ut labore et dolore magna ainvidunt ut labore et dolore magna aliquyam erat.
            .q-my-xl
              img.full-width.round-borders-3(src="statics/screenshot-1.png")
            div
              | Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.

          .q-px-md(style="margin-bottom: 50vh;")
            .q-headline.q-px-md.q-py-xl
              | Nonumy eirmod temportetur sadipscing elitr, sed diam nonumy eirm.
            div.q-mb-md
              | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.
            div
              | Consetetur sadipscing elitr, sed diam nonumy eirmod tempor sed diam nonumy eirmod tempor invidunt ut labore et dolore magna ainvidunt ut labore et dolore magna aliquyam erat.

          .q-px-md.q-py-xl.text-center
            q-btn.bg-white.text-grey-9.q-mt-sm(@click="$router.push({path: '/tools'})", flat, round, size="xl", no-caps)
              q-icon.rotate-180(name="keyboard_backspace", size="26px")
            .q-caption.q-mt-sm.text-weight-medium Zu den Tools

        // .row.col-xs-12.col-md-8.offset-md-2.z-top.items-center
          .col-xs-12.col-sm-4.text-center.q-my-lg
            img(src="~assets/BMBF_deutsch.jpg", style="max-height: 100px;")
          .col-xs-12.col-sm-4.text-center.q-my-lg
            img(src="statics/HSM_Logo_G_schwarz_klein_bold_regular.png", style="max-height: 50px;")
          .col-xs-12.col-sm-4.text-center.q-my-lg
            img(src="statics/logo-jgu.svg", style="max-height: 80px;")

        .row.full-width.bg-white.q-pt-md
          .row.col-12.gutter-md.items-center
            .col-xs-4.col-xs-4.col-md-3.text-center
              img(src="~assets/BMBF_deutsch.jpg", style="max-height: 80px;")
            .col-xs-4.col-xs-4.col-md-3.text-center
              img(src="statics/HSM_Logo_G_schwarz_klein_bold_regular.png", style="max-height: 30px;")
            .col-xs-4.col-xs-4.col-md-3.text-center
              img(src="statics/logo-jgu.svg", style="max-height: 50px;")
            .col-xs-12.col-xs-12.col-md-3.text-center
              q-btn.q-my-lg(@click="$router.push({path: '/'})", flat, no-caps)
              | Imprint

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
      smoothScroll () {
        window.scroll({
          top: this.deviceDimensions.height,
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
