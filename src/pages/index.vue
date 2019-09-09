<template lang="pug">
  q-page.bg-grey-3
    q-scroll-observable(@scroll="userHasScrolled")

    div.relative-position(@click="$router.push({path: '/tools'})")
      .row.justify-center.items-center(style="height: calc(100vh - 52px);")
        griddle-moves.col-xs-10.col-sm-9.col-md-8.col-lg-7.col-xl-5(:enclosed="true", :time="1000")

      .absolute-bottom.q-pb-md.full-width.text-center.transition.q-mb-xl(
      position="bottom",
      :class="[scrolled ? 'hide-arrow' : '']")
        q-btn(@click.native="", flat, round, size="sm")
          q-icon(name="keyboard_arrow_down", size="50px")

    .q-body-1.line-height-wider.row

      .col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3
        .q-px-md.q-pt-sm.q-pb-lg.q-mb-md.bg-white.q-mx-sm
          .q-subheading.q-mb-md.text-weight-medium.q-mt-md
            | Etetur sadipscing elitr, sed diam nonumy eirm.
          div
            | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.
          div.q-mt-sm
            | Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.

        .q-px-md.q-pt-sm.q-pb-lg.q-mb-md.bg-white.q-mx-sm
          .q-subheading.q-mb-md.text-weight-medium.q-mt-md
            | Nonumy eirmod temportetur sadipscing elitr, sed diam nonumy eirm.
          div
            | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.

        .q-px-md.q-pt-md.q-pb-lg.text-center
          q-btn.bg-white.text-grey-9(@click="$router.push({path: '/tools'})", flat, round, size="lg", no-caps)
            q-icon.rotate-180(name="keyboard_backspace")
          .q-caption.q-mt-sm.text-weight-medium Zu den Tools

      .col-xs-12.col-sm-8.offset-sm-2.col-md-6.offset-md-3
        .text-center.bg-white.col-12.q-mx-sm
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
        scrolled: false
      }
    },
    methods: {
      userHasScrolled (scroll) {
        scroll.position > 10 ? this.scrolled = true : this.scrolled = false
      }
    }
  }
</script>

<style scoped lang="styl">
  .hide-arrow
    opacity 0
    margin-bottom 30px
</style>
