<template lang="pug">
  //q-modal(v-model="showModal", minimized)
    q-modal-layout(dark, :content-class="{'bg-dark': true}")
      .layout-padding(v-if="preview")
        p Möchtest du dieses Element unwiderruflich löschen?

      q-toolbar.bg-dark(slot="footer", dark)
        .col-12.layout-padding
          q-btn.on-right.float-right(color="primary", @click="closePreview", label="Close")

  <!-- specifying Vue ref for last example only -->
  q-modal(v-model="showDeleteModal", :content-css="{padding: '50px'}")
    div.q-display-1.q-mb-md Möchtest du dieses Element unwiderruflich löschen?
    div
      q-btn(color="red") Löschen
      q-btn(color="faded") Abbrechen
    q-btn(color="red" v-close-overlay label="Close")
</template>

<script>
export default {
  props: ['show'],
  methods: {
    closePreview () {
      this.$emit('canceled')
    }
  },
  data () {
    return {
    }
  },
  computed: {
    showDeleteModal () {
      return (this.show === true)
    }
  }
}
</script>
