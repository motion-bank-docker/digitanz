<template lang="pug">
  q-page.bg-grey-3

    div(@click="$router.push({path: '/tools'})")
      griddle-moves(:enclosed="true", :time="1000")

    //
      q-page-sticky.q-pb-md(position="bottom")
        q-btn.bg-grey-2.text-grey-7.q-px-lg(@click="$router.push({path: '/tools'})",
        label="Go!", rounded, flat)

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
