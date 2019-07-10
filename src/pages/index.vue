<template lang="pug">
  q-page

    div
      griddle-moves(:enclosed="true", :time="1000")

    q-page-sticky.q-pb-md(position="bottom")
      q-btn.q-px-lg(@click="$router.push({path: '/tools'})", style="border: 1px solid #666;", label="Go!", rounded)

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
