<template lang="pug">
  q-page.bg-grey-3
    // q-scroll-observable(@scroll="scrollingHandler")

    // .fixed-top.bg-grey-3
    .fixed-top.bg-grey-3

      //----- text
      .row.items-center(:style="{height: '66vh'}")
        .bg-grey-10(:style="{height: '66vh', transform: 'translateY(' + mrGriddleOffset + 'px)'}")
          // img(src="statics/003-master-1-white.svg", :style="{height: '100%', width: '100vw', opacity: mrGriddleOpacity}")
          // img(src="statics/digitanz-2.jpg", :style="{height: '100%', opacity: mrGriddleOpacity}")
          img(src="statics/digitanz-2.jpg", style="height: 100%;")
        .absolute.transition.q-mx-md(:class="{'opacity-0': textOpacity}")
          // .bg-grey-3.text-grey-9.q-pa-md(style="border-radius: 3px;")
          .text-grey-1.q-mt-md.q-headline.q-px-md(style="border-radius: 3px;")
            | #digitanz
            span.text-weight-light lite
            | &nbsp;entstand aus einem Forschungsprojekt zwischen JGU und HS Mainz.
          .text-center.q-mt-md.q-pt-md
            q-btn.bg-grey-1.text-grey-9(@click="smoothScroll", flat, rounded, no-caps)
              // .q-caption.text-weight-bold
              | Mehr...

        // griddle-moves.col-xs-10.col-sm-9.col-md-8.col-lg-7.col-xl-5(:enclosed="true", :time="1000")

      //----- buttons
      .row.items-center.justify-center(:style="{height: '34vh'}")
        .q-px-lg.row.full-width
          .col-xs-8.offset-xs-2.col-md-4.offset-md-4.row.items-center.text-grey-9.transition(
          :class="{'opacity-0': textOpacity}")
            // .col-6.text-center
              q-item.q-pa-none.q-mb-xs
                q-item-main
                  q-item-tile.q-pb-sm.text-center.text-grey-9
                    q-btn.bg-white.text-grey-9(@click="smoothScroll", flat, round, size="xl", no-caps)
                      // .q-caption.text-weight-bold
                        | Mehr
                        | Infos
                      q-icon.rotate-270(name="keyboard_backspace", size="26px")
                      // q-icon(name="info", size="26px")
                  q-item-tile.text-center.q-pt-sm
                    .q-caption.text-weight-medium
                      | Mehr...
                      // | Mehr Infos

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

      //
        .absolute-bottom.row
          .col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3.text-center.transition(
          position="bottom", :class="[scrolled ? 'hide-arrow' : '']")
            .q-mx-md
              .bg-white
                q-btn.full-width.q-py-md(@click.native="smoothScroll", flat, no-ripple, no-caps)
                  // q-icon(name="keyboard_arrow_down", size="30px")
                  //
                    | Hier geht's lang
                    q-icon.rotate-270.q-ml-xs(name="keyboard_backspace", size="20px")
                  .q-subheading.text-weight-medium
                    | Mehr über #digitanz
                  //
                    .float-right
                      q-icon.rotate-270.q-ml-xs(name="keyboard_backspace", size="20px")

    // --------------------------------------------------------------------------------------------------------- content
    .q-body-1.line-height-wider.row(style="margin-top: 100vh;")

      .col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3.z-top.bg-grey-3.text-grey-8
        //.q-px-md.q-pt-sm.q-pb-lg.q-mb-none.bg-white.q-mx-none.bg-grey-9.text-grey-3
        .q-px-md.q-mb-xl
          .q-headline.q-px-md.q-py-xl
            | Etetur sadipscing elitr, sed diam nonumy eirm.
          div.q-mb-md
            | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.
          div
            | Consetetur sadipscing elitr, sed diam nonumy eirmod tempor sed diam nonumy eirmod tempor invidunt ut labore et dolore magna ainvidunt ut labore et dolore magna aliquyam erat.
          .q-my-xl
            img.full-width.round-borders-3(src="statics/screenshot-1.png")
          div
            | Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.

        .q-px-md
          .q-headline.q-px-md.q-py-xl
            | Nonumy eirmod temportetur sadipscing elitr, sed diam nonumy eirm.
          div
            | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.

        .q-px-md.q-py-xl.text-center
          q-btn.bg-white.text-grey-9.q-mt-sm(@click="$router.push({path: '/tools'})", flat, round, size="xl", no-caps)
            q-icon.rotate-180(name="keyboard_backspace", size="26px")
          .q-caption.q-mt-sm.text-weight-medium Zu den Tools

      .col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3.z-top.bg-grey-1
        .text-center.col-12.bg-white.q-mb-xl
          img(src="~assets/BMBF_deutsch.jpg", style="width: 80%; max-width: 200px;")
        .row.q-mt-md
          .col-4.offset-2
            img(src="statics/HSM_Logo_G_schwarz_klein_bold_regular.png", style="width: 80%; max-width: 200px;")
          .col-4
            img(src="statics/logo-jgu.svg", style="width: 80%; max-width: 200px;")

        q-btn.q-mt-lg.q-py-md.text-center.full-width(@click="$router.push({path: '/'})", flat, no-caps)
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
