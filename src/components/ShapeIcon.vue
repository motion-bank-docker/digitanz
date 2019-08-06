<template lang="pug">

  svg(width="100%", :height="shapeHeight", viewBox="0 0 100 100")

    template(v-for="element in shape.elements")

      polygon(v-if="element.type === 'polygon'",
      :points="element.points",
      stroke="#212121", stroke-width="3", fill="none")

      line(v-if="element.type === 'line'",
      :x1="element.x1", :y1="element.y1", :x2="element.x2", :y2="element.y2",
      stroke="#212121", stroke-width="3")

      rect(v-if="element.type === 'rect'",
      :x="element.x", :y="element.y", :width="element.width", :height="element.height",
      stroke="#212121", stroke-width="3", fill="none")

      ellipse(v-if="element.type === 'ellipse'",
      :cx="element.cx", :cy="element.cy", :rx="element.rx", :ry="element.ry",
      stroke="#212121", stroke-width="3", fill="none")

</template>

<script>
  export default {
    name: 'shape-icon',
    props: ['shape', 'cols'],
    data () {
      return {
        shapeHeight: undefined
      }
    },
    mounted () {
      this.shapeHeight = (window.innerWidth - (16 * (this.cols + 1))) / this.cols
    }
  }
</script>

<style scoped lang="stylus">
</style>
