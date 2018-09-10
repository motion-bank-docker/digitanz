<template lang="pug">
  .q-uploader.relative-position.no-padding(:class="classes", @dragover="__onDragOver")
    <!--q-input-frame(-->
    <!--ref="input",-->
    <!--:prefix="prefix",-->
    <!--:suffix="suffix",-->
    <!--:stackLabel="stackLabel",-->
    <!--:floatLabel="floatLabel",-->
    <!--:error="error",-->
    <!--:warning="warning",-->
    <!--:readonly="readonly",-->
    <!--:inverted="inverted",-->
    <!--:invertedLight="invertedLight",-->
    <!--:dark="dark",-->
    <!--:hideUnderline="hideUnderline",-->
    <!--:before="before",-->
    <!--:after="after",-->
    <!--:color="color",-->
    <!--:align="align",-->
    <!--:noParentField="noParentField",-->
    <!--:length="queueLength",-->
    <!--:additionalLength="true")-->
    q-input-frame(
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
    :color="color",
    :align="align",
    :noParentField="noParentField",
    :length="queueLength",
    :additionalLength="true")

      // .col.q-input-target.ellipsis(:class="alignClass") {{label}}

      template(v-if="uploading")
        q-item
          q-item-side
            q-spinner.q-if-end.self-center(size="24px", color="white")
          q-item-main(:label="files[0].name", :sublabel="files[0].__size")
          q-item-side(:right="true").q-pr-sm
            q-item-tile.cursor-pointer.text-white(:icon="$q.icon.uploader[files[0].__doneUploading ? 'done' : 'clear']",
            :color="white",
            @click.native="__remove(files[0])",
            size="sm")
        //
          q-icon.q-if-end.self-center.q-if-control(
          slot="after",
          // :name="$q.icon.uploader[`clear${this.isInverted ? 'Inverted' : ''}`]",
          @click.native="abort")

      template(v-else)
        // q-icon.full-width.q-uploader-pick-button.self-center.q-if-control.relative-position.overflow-hidden(
        q-btn.full-width(
        :icon="$q.icon.uploader.add",
        :disabled="addDisabled",
        flat)

          .q-ml-sm {{ $t('upload.title') }}

          input.q-uploader-input.absolute-full.cursor-pointer(
          ref="file", type="file",
          :accept="extensions",
          :multiple="multiple",
          @change="__add")
        //
          q-icon.q-if-control.self-center(
          slot="after",
          v-if="!hideUploadButton",
          // :name="$q.icon.uploader.upload",
          // :disabled="queueLength === 0",
          @click.native="upload")

      //
        q-icon.q-if-control.generic_transition.self-center(
        v-if="hasExpandedContent",
        slot="after",
        // :class="{'rotate-180': expanded}",
        // :name="$q.icon.uploader.expand",
        @click.native="expanded = !expanded")

    //
      q-slide-transition
        div(:class="expandClass", :style="expandStyle", v-show="expanded")
          q-list.q-uploader-files.q-py-none.scroll.no-border(:style="fileStyle", :dark="dark")
            template(v-for="file in files")
              // q-item.q-uploader-file.q-pa-xs(:key="file.name + file.__timestamp")
              q-item.q-my-sm.shadow-3.q-uploader-file.q-pa-xs(:key="file.name + file.__timestamp")
                template(v-if="!hideUploadProgress")
                  q-item-side
                    q-spinner.q-if-end.self-center(size="24px")
                    //
                      q-progress.q-uploader-progress-bg(
                      //:percentage="file.__progress")
                      .text-primary {{file.__progress}} %
                // q-item-side(v-bind="file.__img ? { image: file.__img.src } : { icon: $q.icon.uploader.file, color: color }")
                q-item-main(:label="file.name", :sublabel="file.__size")
                q-item-side(:right="true")
                  q-item-tile.cursor-pointer(:icon="$q.icon.uploader[file.__doneUploading ? 'done' : 'clear']", :color="color", @click.native="__remove(file)")

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
