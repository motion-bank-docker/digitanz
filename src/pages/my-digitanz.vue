<template lang="pug">
  q-page
    p hello world
</template>

<script>
  import VideoItem from '../../components/VideoItem'

  export default {
    components: {
      VideoItem
    },
    data () {
      return {
        foo: false
      }
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style scoped lang="stylus">
</style>
