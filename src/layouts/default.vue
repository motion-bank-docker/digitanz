<template lang="pug">
  q-layout(view='lHh Lpr lFf')
    q-layout-header
      q-toolbar(dark, color='black', :glossy="$q.theme === 'mat'", :inverted="$q.theme === 'ios'")
        q-btn(flat, dense, round, @click='leftDrawerOpen = !leftDrawerOpen', aria-label='Menu')
          q-icon(name='menu')
        q-toolbar-title {{ info.productName }}
    q-layout-drawer(dark, v-model='leftDrawerOpen', :content-class="$q.theme === 'mat' ? 'bg-dark' : null")
      //q-list(dark, no-border, link, inset-delimiter, v-if="urls")
      q-list(dark, no-border, link, inset-delimiter)
        q-list-header Main Menu
        q-item(@click.native="$router.push('/')")
          q-item-side(icon='list')
          q-item-main(label='Dashboard', sublabel='All your saved media')
        q-item(@click.native="urlClick(`${urls.subappVue}/#/mr-griddle`)", separator)
          q-item-side(icon='accessibility')
          q-item-main(label='Mr. Griddle', sublabel='Do the griddle')
        q-item(@click.native="$router.push('/allrecipes')")
          q-item-side(icon='list')
          q-item-main(label='Rezepte', sublabel='Remix Motion-Recipes')
        q-item(@click.native="urlClick(`${urls.subappVue}/#/lost-in-space`)")
          q-item-side(icon='explore')
          q-item-main(label='Lost in Space', sublabel='Experience space')
        q-item(@click.native="$router.push('/videosequencer')")
          q-item-side(icon='movie')
          q-item-main(label='Video Sequencer', sublabel='Reorder movements')
        q-item(@click.native="$router.push('/upload')", separator)
          q-item-side(icon='cloud upload')
          q-item-main(label='Upload', sublabel='Upload video(s)')
        q-item(@click.native="$router.push('/dashboard')")

    q-page-container
      router-view
</template>

<script>
  import { openURL } from 'quasar'
  export default {
    data () {
      return {
        urls: {},
        info: {
          productName: '#digitanz'
        },
        leftDrawerOpen: this.$q.platform.is.desktop
      }
    },
    async mounted () {
      const params = await this.$params()
      this.urls = params.urls && params.urls.length ? params.urls[0] : {}
    },
    methods: {
      openURL
    }
  }
</script>
