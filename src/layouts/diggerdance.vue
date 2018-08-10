<template lang="pug">
  q-layout.column(view='lHh Lpr lFf')
    q-layout-header
      q-btn(icon="menu" round @click="leftDrawerOpen = !leftDrawerOpen")
    q-layout-drawer(v-model="leftDrawerOpen", side="left")
      //q-btn.no-border(icon="menu" outline="false" @click="leftDrawerOpen = false")
      q-btn.full-width(@click="$router.push('/')" color="primary") Home
      h1.q-subheading.uppercase Meine Tools
      q-btn.full-width.q-ml-md(@click="$router.push('/allrecipes')") Rezepte
      q-btn.full-width.q-ml-md(@click="$router.push('/videosequencer')") Video Sequencer
      q-btn.full-width.q-ml-md(@click="$router.push('/slotmachine')") Glücksrad
      q-btn.full-width.q-ml-md Mr. Griddle
      q-btn.full-width.q-ml-md Raum-Tool
    q-page-container
      router-view.q-ma-lg
</template>

<script>
const { productName } = require('../../package.json')

import {QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QLayoutDrawer} from 'quasar'
export default {
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QLayoutDrawer
  },
  name: 'LayoutDefault',
  data () {
    return {
      info: {
        productName
      },
      leftDrawerOpen: false
    }
  }
}
</script>
