<template lang="pug">
  q-page.bg-grey-3
    q-scroll-observable(@scroll="userHasScrolled")

    div.relative-position(@click="$router.push({path: '/tools'})")
      griddle-moves(:enclosed="true", :time="1000", style="box-shadow: 0 0 3px 0 rgba(0, 0, 0, .3)")

      .absolute-bottom.q-pb-md.full-width.text-center.transition(
      position="bottom",
      :class="[scrolled ? 'hide-arrow' : '']")
        q-btn(@click.native="", flat, round, size="sm")
          q-icon(name="keyboard_arrow_down", size="30px")

    .bg-grey-1.q-body-1.line-height-wider

      .q-px-md.q-py-lg.q-mb-md
        .q-subheading.q-mb-md.text-weight-medium.q-mt-md
          | Etetur sadipscing elitr, sed diam nonumy eirm.
        div
          | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.
        div.q-mt-sm
          | Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.

      q-item-separator.q-my-none.q-mx-md

      .q-px-md.q-py-lg.q-mb-md
        .q-subheading.q-mb-md.text-weight-medium.q-mt-md
          | Nonumy eirmod temportetur sadipscing elitr, sed diam nonumy eirm.
        div
          | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.

      q-item-separator.q-my-none.q-mx-md

      .q-px-md.q-py-xl.text-center
        q-btn.bg-white.text-grey-9.shadow-1(@click="$router.push({path: '/tools'})", flat, round, size="lg", no-caps)
          q-icon.rotate-180(name="keyboard_backspace")
        .q-caption.q-mt-sm.text-weight-medium Zu den Tools

      .text-center.bg-white
        img(src="~assets/BMBF_deutsch.jpg", style="width: 80%;")

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
