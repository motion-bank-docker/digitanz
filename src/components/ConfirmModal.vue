<template lang="pug">
  q-modal(v-model="showModal", minimized)
    .bg-dark.q-pa-md.text-center
      | {{ msg }}
      .q-mt-md
        q-btn(color="red", @click="confirm") {{ label }}
        q-btn(color="faded", @click="cancel") {{ $t('buttons.cancel') }}
</template>

<script>
export default {
  data () {
    return {
      showModal: false,
      message: undefined,
      confirmLabel: undefined
    }
  },
  methods: {
    show (message, payload = undefined, confirmLabel = undefined) {
      this.message = message
      this.payload = payload
      this.confirmLabel = confirmLabel
      this.showModal = true
    },
    clear () {
      this.showModal = false
      this.message = undefined
      this.confirmLabel = undefined
      this.payload = undefined
    },
    cancel () {
      this.$emit('cancel')
      this.clear()
    },
    confirm () {
      this.$emit('confirm', this.payload)
      this.clear()
    }
  },
  computed: {
    msg () {
      return this.$t(this.message)
    },
    label () {
      return this.confirmLabel ? this.$t(this.confirmLabel) : this.$t('buttons.confirm')
    }
  }
}
</script>
