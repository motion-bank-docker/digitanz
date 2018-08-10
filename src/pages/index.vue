<template lang="pug">
  q-page
    q-card(v-for="(media, index) in savedFiles", :media="media" inline class="q-ma-sm")
      q-card-media
        img(:src="media")
      q-card-actions(align="around")
        q-btn(flat round color="red" icon="favorite")
        q-btn(flat round color="faded" icon="bookmark")
        q-btn(flat round color="primary" icon="share")
</template>

<script>
  import * as pkg from '../../package.json'
  export default {
    data () {
      return {
        name: pkg.name,
        version: pkg.version,
        savedFiles: [
          { media: '.statics/test_eins.png' },
          { media: 'assets/test_zwei.png' },
          { media: 'assets/test_drei.png' }
        ]
      }
    }
  }
</script>
