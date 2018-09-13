<template lang="pug">
  .q-uploader.relative-position.no-padding(:class="classes", @dragover="__onDragOver")

    // q-input-frame(
    .round-borders.text-white.bg-primary(
    ref="input",
    :stackLabel="stackLabel",
    :floatLabel="floatLabel",
    :error="error",
    :warning="warning",
    :readonly="readonly",
    :inverted="inverted",
    :invertedLight="invertedLight",
    :dark="dark",
    :hideUnderline="hideUnderline",
    :before="before",
    :after="after",
    :color="primary",
    :align="align",
    :noParentField="noParentField",
    :length="queueLength",
    :additionalLength="true")

      template(v-if="uploading")
        q-item
          q-item-side
            q-spinner.q-if-end.self-center(size="24px", color="white")
          q-item-main(:label="files[0].name", :sublabel="files[0].__size")
          q-item-side(:right="true")
            q-item-tile.cursor-pointer.text-white(:icon="$q.icon.uploader[files[0].__doneUploading ? 'done' : 'clear']",
            :color="white",
            @click.native="__remove(files[0])",
            size="md")

      template(v-else)
        q-btn.full-width(
        icon="arrow_upward",
        :disabled="addDisabled",
        flat)

          .q-ml-sm {{ $t('upload.title') }}

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
    extends: QUploaderExtended
  }
</script>
