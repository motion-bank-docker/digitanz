<template lang="pug">
  q-page.bg-grey-3(style="margin-top: -1px;")
    .overflow-hidden(style="height: calc(100vh - 52px);")
      lost-in-space

    .absolute-top-left.q-mt-md.q-ml-md

      info-button.q-mt-xs(:size="'sm'")
        | Tippe auf den Screen um zur nächsten Form zu gelangen.

    .absolute-top-right.q-ma-md

      info-button.q-mt-xs(:size="'sm'")
        button-description.q-mb-sm(:iconName="'edit'")
          | Bearbeite deine Auswahl.
        button-description(:iconName="'clear'")
          | Zurück zur Übersicht aller erstellten Spaces.

      q-btn.text-grey-9.bg-grey-3.shadow-1.q-mx-sm(@click="$router.push('/space-tool/create')", round, flat, size="sm")
        q-icon(name="edit", size="16px")
      q-btn.text-grey-9.bg-grey-3.shadow-1(@click="$router.push('/space-tool/list')", round, flat, size="sm")
        q-icon(name="clear", size="16px")
</template>

<script>
  import LostInSpace from '../../components/LostInSpace'
  import infoButton from '../../components/InfoButton'
  import buttonDescription from '../../components/ButtonDescription'

  export default {
    components: {
      LostInSpace,
      infoButton,
      buttonDescription
    }
  }
</script>

<style lang="stylus" scoped>
</style>
