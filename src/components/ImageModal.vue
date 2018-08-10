<template lang="pug">
  q-modal(v-model="showModal", minimized)
    q-modal-layout(dark, :content-class="{'bg-dark': true}")
      .layout-padding(v-if="preview")
        img(v-if="image", :src="item.source" style="width: 80vw")
      q-toolbar.bg-dark(slot="footer", dark)
        .col-12.layout-padding
          q-btn.on-right.float-right(color="primary", @click="closePreview", label="Close")
</template>

<script>
export default {
  props: ['show', 'preview', 'source'],
  methods: {
    closePreview () {
      this.$emit('canceled')
    }
  },
  data () {
    return {
      index: -1,
      image: undefined
    }
  },
  watch: {
    preview () {
      if (Array.isArray(this.preview) && this.preview.length) {
        this.index = 0
        this.image = { source: { type: 'image/jpeg', id: this.preview[this.index].source.source } }
      }
      else if (this.preview) {
        this.image = this.preview
      }
    }
  },
  computed: {
    showModal () {
      return (this.show === true)
    }
  }
}
</script>
