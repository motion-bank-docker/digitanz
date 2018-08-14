<template lang="pug">
  q-modal(v-model="show", minimized)
    .bg-dark.q-pa-md.text-center
      | {{ $t('labels.confirm_delete') }}
      .q-mt-md
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
