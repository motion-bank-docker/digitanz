<template lang="pug">
  q-page.min-height-auto.q-pa-md
    | create
    div(v-for="space in spaces") {{ space }}
    q-btn(@click="$router.push('/space-tool')") go
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
        shapes: 'spaceTool/getShapes',
        selectedShapes: 'spaceTool/getSelectedShapes',
        spaces: 'spaceTool/getSpaces'
      })
    }
  }
</script>

<style lang="stylus" scoped>
</style>
