<template lang="pug">
  q-page.bg-grey-3
    q-scroll-observable(@scroll="scrollingHandler")

    .fixed-top(:style="{opacity: mrGriddleOpacity, marginTop: mrGriddleOffset * -1 + 'px'}")
      // .row.items-center(@click="$router.push({path: '/tools'})", style="height: calc(100vh - 52px);")
      .row.items-center(style="height: 100vh;")
        .absolute.text-center.q-mx-md(
        @click="smoothScroll")
          // .bg-grey-3.text-grey-9.q-pa-md(style="border-radius: 3px;")
          .text-grey-3.q-px-md.q-mt-sm.q-title(style="border-radius: 3px;")
            | #digitanz ist ein Forschungsprojekt zwischen der JGU und der HS Mainz
            br
            br
            //
              q-btn.bg-white.text-grey-9(@click="$router.push({path: '/tools'})", flat, rounded)
              | zu den tools
          .q-mt-md
            q-btn.bg-white.text-grey-9(@click="smoothScroll", flat, round, size="lg")
              q-icon(name="keyboard_arrow_down")
              // | mehr
            q-btn.bg-white.text-grey-9.q-ml-md(@click="$router.push({path: '/tools'})", flat, round, size="lg")
              q-icon(name="keyboard_arrow_right")
        img.full-height(src="statics/screenshot-1.png")
        // griddle-moves.col-xs-10.col-sm-9.col-md-8.col-lg-7.col-xl-5(:enclosed="true", :time="1000")

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

    .q-body-1.line-height-wider.row(style="margin-top: 100vh;")

      .col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3.z-top
        //.q-px-md.q-pt-sm.q-pb-lg.q-mb-none.bg-white.q-mx-none.bg-grey-9.text-grey-3
        .q-px-md.q-pt-lg.q-pb-lg.q-mb-none.bg-white.q-mx-none.bg-grey-9.text-grey-3
          .q-subheading.q-mb-lg.text-weight-medium.q-mt-md
            | Etetur sadipscing elitr, sed diam nonumy eirm.
          div
            | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.
          div.q-mt-sm
            | Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.

        .q-px-md.q-pt-sm.q-pb-lg.bg-white
          .q-subheading.q-mb-lg.text-weight-medium.q-mt-none
            | Nonumy eirmod temportetur sadipscing elitr, sed diam nonumy eirm.
          div
            | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.

        .q-px-md.q-pt-md.q-mb-md.q-pb-md.text-center.bg-grey-3
          q-btn.bg-white.text-grey-9.q-mt-sm(@click="$router.push({path: '/tools'})", flat, round, size="lg", no-caps)
            q-icon.rotate-180(name="keyboard_backspace")
          .q-caption.q-mt-sm.text-weight-medium Zu den Tools

      .col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3.z-top
        .text-center.bg-white.col-12
          img(src="~assets/BMBF_deutsch.jpg", style="width: 80%; max-width: 200px;")

        q-btn.q-py-md.text-center.full-width(@click="$router.push({path: '/'})", flat, no-caps)
          | Imprint

</template>

<script>
  import * as pkg from '../../package.json'
  export default {
    data () {
      return {
        name: pkg.name,
        version: pkg.version,
        scrolled: false,
        mrGriddleOpacity: 1,
        mrGriddleOffset: 0
      }
    },
    methods: {
      scrollingHandler (scroll) {
        scroll.position > 10 ? this.scrolled = true : this.scrolled = false
        // this.mrGriddleOpacity = 1 / (scroll.position / 100)
        this.mrGriddleOffset = scroll.position / 5
      },
      smoothScroll () {
        window.scroll({
          top: window.innerHeight - 16,
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
