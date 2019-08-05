<template lang="pug">
  q-page
    div list
    div {{ shapes }}
    q-btn(@click="$router.push('/space-tool')") go

    svg(width="100vw", height="50vh")
      rect(width="100%" height="100%" fill="#3e3e99")
      defs
        g#shape-protos
          g#diagonal-lines-1
            line(x1="-50", y1="-50", x2="50", y2="50")
          g#diagonal-lines-2
            line(x1="-50", y1="-50", x2="50", y2="50")
            line(x1="50",  y1="-50", x2="-50", y2="50")
</template>

<script>
  import { mapGetters } from 'vuex'

  // import LostInSpace from '../../components/LostInSpace'
  export default {
    components: {
      // LostInSpace
    },
    computed: {
      ...mapGetters({
        shapes: 'spaceTool/getShapes'
      })
    }
  }
</script>

<style lang="stylus" scoped>
</style>
