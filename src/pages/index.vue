<template lang="pug">
  q-page.bg-grey-3

    div.relative-position(@click="$router.push({path: '/tools'})")
      griddle-moves(:enclosed="true", :time="1000")

      .absolute-bottom.q-pb-md.full-width.text-center(position="bottom")
        q-icon(name="keyboard_arrow_down", size="30px")

    .bg-grey-1.q-px-md.q-mt-lg.q-body-1.line-height-wider

      .q-py-lg
        .q-subheading.q-mb-md.text-weight-medium
          | Etetur sadipscing elitr, sed diam nonumy eirm.
        p.q-px-none
          | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.

      q-item-separator.q-ma-none

      .q-py-lg
        .q-subheading.q-mb-md.text-weight-medium
          | Sub 22222
        p.q-px-none
          | Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.

      q-item.q-px-none.q-body-1.text-center
        .full-width.text-center
          q-btn.bg-grey-9.text-grey-1(flat, round, size="lg")
            q-icon.rotate-180(name="keyboard_backspace", size="30px")

      q-item-separator

      .q-py-lg
        q-item.q-px-none.q-body-1
          .text-center.bg-white
            img(src="~assets/BMBF_deutsch.jpg", style="width: 80%;")

</template>

<script>
  import * as pkg from '../../package.json'
  export default {
    data () {
      return {
        name: pkg.name,
        version: pkg.version
      }
    }
  }
</script>
