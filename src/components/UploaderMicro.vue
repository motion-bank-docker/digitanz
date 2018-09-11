<template lang="pug">

  q-uploader-extended-simple-micro(
      ref="uploader",
      :prefix="$t('buttons.uploader')",
      auto-expand,
      clearable,
      color="primary",
      align="center",
      inverted,
      :extensions="ext",
      :multiple="false",
      :url="url",
      @add="onSelect",
      @uploaded="onUploaded",
      @fail="onFail",
      @start="onStart",
      @finish="onFinish",
      @click="handleUploaderClick()")

</template>

<script>
  import Uploader from './Uploader'
  import QUploaderExtendedSimpleMicro from './QUploaderExtendedSimpleMicro'

  export default {
    extends: Uploader,
    components: {
      QUploaderExtendedSimpleMicro
    }
  }
</script>

<style lang="stylus">
</style>
