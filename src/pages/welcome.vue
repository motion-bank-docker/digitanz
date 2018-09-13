<template lang="pug">
  q-page.q-ma-md.relative-position
    q-btn.q-pa-none.absolute-top-right(color="primary", flat, icon-right="arrow_forward",
    v-if="!user", @click.prevent="login", :label="$t('navigation.login')")
    griddle-moves(:enclosed="true", :time="1000")
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      })
    },
    methods: {
      login () {
        this.$auth.authenticate()
      }
    }
  }
</script>
