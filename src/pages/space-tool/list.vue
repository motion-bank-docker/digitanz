<template lang="pug">
  q-page.q-pb-xl
    .row.q-px-sm.q-mb-md
      .col-4.q-px-sm.q-mt-md.text-center.round-borders(v-for="shape in shapes")

        input.hidden(v-model="checkboxSelectedShapes", type="checkbox", :id="shape.id", :value="shape.id")

        label.full-width.full-height(:for="shape.id")
          div.shadow-1.q-pa-md.bg-e4.round-borders(:class="[checkIfSelected(shape.id) ? 'bg-grey-1 text-grey-9' : 'text-grey-8']")
            svg(width="100%", height="calc(calc(calc(100vw - calc(16px * 4)) / 3) * 1.33)", viewBox="0 0 100 100")

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

    .fixed-bottom-right.q-px-md.q-mt-md.q-mb-md
      q-btn.bg-grey-9.text-grey-3(@click="$router.push('/space-tool')", round, flat)
        q-icon(name="check")

</template>

<script>
  import { mapGetters } from 'vuex'

  // import LostInSpace from '../../components/LostInSpace'
  export default {
    data () {
      return {
        checkboxSelectedShapes: []
      }
    },
    components: {
      // LostInSpace
    },
    computed: {
      ...mapGetters({
        shapes: 'spaceTool/getShapes'
      })
    },
    watch: {
      checkboxSelectedShapes (val) {
        this.$store.commit('spaceTool/setSelectedShapes', val)
      }
    },
    methods: {
      checkIfSelected (val) {
        return this.checkboxSelectedShapes.includes(val)
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
