<template lang="pug">
  q-page

    div
      griddle-moves(:enclosed="true", :time="1000")

    q-page-sticky.q-pa-md(position="bottom")
      q-btn(@click="$router.push({path: '/tools'})") Go!

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
