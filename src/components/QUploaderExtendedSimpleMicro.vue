<template lang="pug">
  q-btn(@dragover="__onDragOver", flat, round, :size="size", :color="color")

    template(v-if="busy")
      q-spinner

    template(v-else)
      q-icon(
      name="add_a_photo",
      :size="size",
      :disabled="addDisabled",
      :color="color"
      flat)

      // input.q-uploader-input.absolute-full.cursor-pointer(
        ref="file", type="file",
        // :accept="extensions",
        // :multiple="multiple",
        @change="__add")

      input.q-uploader-input.absolute-full.cursor-pointer(
      ref="file", type="file",
      :accept="extensions",
      :multiple="multiple",
      @change="__add")

    // template(v-if="dnd")
      .q-uploader-dnd.flex.row.items-center.justify-center.absolute-full(
      // :class="dndClass",
      @dragenter="stopAndPrevent",
      @dragover="stopAndPrevent",
      @dragleave="__onDragLeave",
      @drop="__onDrop")
</template>

<script>
  import QUploaderExtended from './QUploaderExtended'
  import { mapGetters } from 'vuex'

  export default {
    extends: QUploaderExtended,
    props: {
      size: undefined
    },
    computed: {
      ...mapGetters({
        jobIds: 'conversions/getJobIds'
      }),
      busy () {
        return this.uploading || (this.jobIds && this.jobIds.length)
      }
    },
    mounted () {
      // console.log('check')
    },
    methods: {
    }
  }
</script>
