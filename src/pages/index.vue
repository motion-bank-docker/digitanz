<template lang="pug">
  q-page.bg-grey-3
    q-scroll-observable(@scroll="scrollingHandler")

    .fixed-top(:style="{opacity: mrGriddleOpacity, top: '52px'}")
      .row.justify-center.items-center(@click="$router.push({path: '/tools'})", style="height: calc(100vh - 52px);")
        griddle-moves.col-xs-10.col-sm-9.col-md-8.col-lg-7.col-xl-5(:enclosed="true", :time="1000")

      .absolute-bottom.full-width.text-center.transition(
      position="bottom",
      :class="[scrolled ? 'hide-arrow' : '']")
        .bg-white.q-py-sm.q-mx-md
          q-btn(@click.native="smoothScroll", flat, no-ripple)
            q-icon(name="keyboard_arrow_down", size="30px")

    .q-body-1.line-height-wider.row(style="margin-top: 100vh;")

      .col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3.z-top
        .q-px-md.q-pt-sm.q-pb-lg.q-mb-md.bg-white.q-mx-md
          .q-subheading.q-mb-lg.text-weight-medium.q-mt-md
            | Etetur sadipscing elitr, sed diam nonumy eirm.
          div
            | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.
          div.q-mt-sm
            | Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.

        .q-px-md.q-pt-sm.q-pb-lg.q-mb-md.bg-white.q-mx-md
          .q-subheading.q-mb-lg.text-weight-medium.q-mt-md
            | Nonumy eirmod temportetur sadipscing elitr, sed diam nonumy eirm.
          div
            | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.

        .q-px-md.q-pt-md.q-mb-md.q-mx-md.q-pb-md.text-center.bg-white
          q-btn.bg-grey-4.text-grey-9.q-mt-sm(@click="$router.push({path: '/tools'})", flat, round, size="lg", no-caps)
            q-icon.rotate-180(name="keyboard_backspace")
          .q-caption.q-mt-sm.text-weight-medium Zu den Tools

      .col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3.z-top
        .text-center.bg-white.col-12.q-mx-md
          img(src="~assets/BMBF_deutsch.jpg", style="width: 80%; max-width: 200px;")

        q-btn.q-py-md.text-center.full-width(@click="$router.push({path: '/tools'})", flat, no-caps)
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
        mrGriddleOpacity: 1
      }
    },
    methods: {
      scrollingHandler (scroll) {
        scroll.position > 10 ? this.scrolled = true : this.scrolled = false
        this.mrGriddleOpacity = 1 / (scroll.position / 100)
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
    margin-bottom -100px
</style>
