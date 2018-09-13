<template lang="pug">
  q-btn(@dragover="__onDragOver", flat, round, :size="size", :color="color")

    template(v-if="uploading")
      q-spinner

    template(v-else)
      q-icon(
      name="add_circle",
      :size="size",
      :disabled="addDisabled",
      :color="color"
      flat)

      input.q-uploader-input.absolute-full.cursor-pointer(
      ref="file", type="file",
      :accept="extensions",
      :multiple="multiple",
      @change="__add")

    template(v-if="dnd")
      .q-uploader-dnd.flex.row.items-center.justify-center.absolute-full(
      :class="dndClass",
      @dragenter="stopAndPrevent",
      @dragover="stopAndPrevent",
      @dragleave="__onDragLeave",
      @drop="__onDrop")
</template>

<script>
  import QUploaderExtended from './QUploaderExtended'

  export default {
    extends: QUploaderExtended,
    props: [
      'size'
    ]
  }
</script>
