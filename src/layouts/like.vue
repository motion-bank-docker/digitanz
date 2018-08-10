<template lang="pug">
  q-layout(view='lHh Lpr lFf')
    q-layout-header
      q-toolbar(dark, color='black', :glossy="$q.theme === 'mat'", :inverted="$q.theme === 'ios'")
        q-btn(flat, dense, round, @click='leftDrawerOpen = !leftDrawerOpen', aria-label='Menu')
          q-icon(name='menu')
        q-toolbar-title {{ info.productName }}
    q-layout-drawer(dark, v-model='leftDrawerOpen', :content-class="$q.theme === 'mat' ? 'bg-dark' : null")
      q-list(dark, no-border, link, inset-delimiter, v-if="urls")
        q-list-header Main Menu
        q-item(@click.native="$router.push('/')")
          q-item-side(icon='home')
          q-item-main(label='Dashboard', sublabel='Main overview page')
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
          q-item-main(label='Videos', sublabel='Reorder movements')
        q-item(@click.native="$router.push('/upload')", separator)
          q-item-side(icon='cloud upload')
          q-item-main(label='Upload', sublabel='Upload video(s)')
        q-item(@click.native="$router.push('/dashboard')")
          q-item-side(icon='list')
          q-item-main(label='Dashboard', sublabel='See all your saved media')
    q-page-container(dark)
      q-page-sticky(position="top-right" :offset="[13, 13]")
        q-checkbox(v-model="checked" color="red" checked-icon="favorite" unchecked-icon="favorite_border" keep-color style="transform: scale(1.5)")
      //q-btn.sticky(v-model="checked" icon="favorite" color="red" size="md" round keep-color)

      router-view.q-ma-lg
</template>

<script>
  import { openURL } from 'quasar'
  import { productName } from '../../package.json'
  export default {
    name: 'LayoutDefault',
    data () {
      return {
        checked: false,
        urls: null,
        info: {
          productName
        },
        leftDrawerOpen: false
      }
    },
    mounted () {
      const _this = this
      this.$params().then(params => {
        if (!params) return
        _this.urls = params.urls[0]
      })
    },
    methods: {
      urlClick (url) {
        openURL(url)
      }
    }
  }
</script>
