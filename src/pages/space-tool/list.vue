<template lang="pug">
  q-page
    div
      q-btn(@click="$router.push('/space-tool')") go

    div(v-for="shape in shapes")
      svg(width="100px", height="100px")

        template(v-for="element in shape.elements")

          polygon(v-if="element.type === 'polygon'",
          :points="element.points", stroke="black", fill="none")

          line(v-if="element.type === 'line'",
          :x1="element.x1", :x2="element.x2", :y1="element.y1", :y2="element.y2",
          stroke="black", stroke-width="1")
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
