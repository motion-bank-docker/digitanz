<template lang="pug">
  q-modal(v-model="show", :content-css="{padding: '50px'}")
    div.q-display-1.q-mb-md {{ $t('labels.confirm_delete') }}
    div
      q-btn(color="red", @click="confirm") {{ $t('buttons.delete') }}
      q-btn(color="faded", @click="cancel") {{ $t('buttons.cancel') }}
</template>

<script>
export default {
  props: ['show', 'item'],
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    confirm () {
      this.$emit('confirm', this.item)
    }
  }
}
</script>
