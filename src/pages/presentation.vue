<template lang="pug">
  q-page
    .q-ma-md
      h3.text-center Geteilte Inhalte
      content-block
        template(slot="title") hier steht irgendwas
        template(slot="buttons")
          q-btn.bg-grey-10.shadow-2(label="?", flat, rounded)
            q-popover.bg-dark.q-py-md.q-px-lg
              | blablabla
        template(slot="content")
          video-list-view()
          | content

</template>

<script>
  import ContentBlock from '../components/ContentBlock'
  import VideoListView from '../components/VideoListView'

  export default {
    components: {
      ContentBlock,
      VideoListView
    },
    name: 'presentation'
  }
</script>

<style scoped lang="stylus">
</style>
