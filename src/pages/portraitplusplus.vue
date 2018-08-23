<template lang="pug">
  q-page
    <!--video-modal(ref="videoModal")-->
    <!--upload-remix-modal(ref="uploadRemixModal")-->
    <!--confirm-modal(ref="confirmDeleteModal", @confirm="deleteItem")-->

    // HEAD
    //
    h3.text-center
      | {{ $t('pages.portraitplusplus.title') }}
    .q-mx-md.q-mb-xl.text-grey-8
      | {{ $t('pages.portraitplusplus.description') }}

    //job-list

    // SHOW RESULTS
    //
    q-list.no-border(separator)
      q-item.q-pt-xl(v-for="item in videoSequences")
        q-item-main.text-center
          img.cursor-pointer.q-mt-sm.portrait-image(
            @click="openPreview(item)",
            :src="item.preview.medium")
          q-btn.full-width.q-my-md(
            v-if="item.annotation.author.id !== user.uuid"
            dark, color="primary",
            @click="uploadResponse(item.annotation)")
            | {{ $t('buttons.upload_remix') }}

          q-collapsible.full-width.no-padding.q-my-sm(
            v-if="item.responses.length > 0",
            :label="getResponseLabel(item.responses.length)")
            q-card(v-for="(responseItem, i) in item.responses", inline, square)
              q-card-media.bg-dark.items-center.row.justify-center.text-left(
                overlay-position="bottom",
                style="width: 19vw; height: 19vw; margin: .5vw;")
                img.card-image.no-margin(
                  @click="openPreview(responseItem)",
                  :src="responseItem.preview.medium")
              q-btn.q-py-md(
                v-if="responseItem.annotation.author.id === user.uuid", color="white",
                @click="deleteItem(responseItem)", icon="delete", flat)

          .q-pa-md.text-grey-8(v-else)
            | {{ $t('pages.portraitplusplus.no_remix') }}
</template>

<script>
  export default {
    components: {
    },
    data () {
      return {
        videoSequences: []
      }
    },
    name: 'portraitplusplus'
  }
</script>

<style scoped>
</style>
