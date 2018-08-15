<template lang="pug">
  q-layout(view='lHh Lpr lFf')
    q-layout-header
      q-toolbar(dark, color='black', :glossy="$q.theme === 'mat'", :inverted="$q.theme === 'ios'")
        q-btn(flat, dense, round, @click='leftDrawerOpen = !leftDrawerOpen', aria-label='Menu')
          q-icon(name='menu')
        q-toolbar-title
          span(@click="clickLogo()") {{ info.productName }}
        q-btn(color="primary", flat, icon="eject",
          v-if="userState", @click="logout") {{ $t('navigation.logout') }}
        q-btn(color="primary", flat, icon="arrow_forward",
          v-if="!userState", @click="login") {{ $t('navigation.login') }}
    q-layout-drawer(dark, v-model='leftDrawerOpen', :content-class="$q.theme === 'mat' ? 'bg-dark' : null", v-if="userState")
      //q-list(dark, no-border, link, inset-delimiter, v-if="urls")
      q-list(dark, no-border, link, inset-delimiter)
        // q-list-header Main Menu
        q-item(@click.native="$router.push('/dashboard')")
          q-item-side
            q-item-tile(avatar)
              q-icon(name='list')
          q-item-main(:label='$t(\'navigation.dashboard.label\')', :sublabel='$t(\'navigation.dashboard.sublabel\')')
        //
          q-item
            q-item-side
            q-item-main
              q-list.no-border.no-margin
                // q-item.no-padding(@click.native="$router.push('/dashboard')") 17.8.2018
                q-item.no-padding(@click.native="$router.push('/dashboard?item_id=abc')") 17.8.2018
        q-item(@click.native="$router.push('/portrait')")
          q-item-side
            q-item-tile(avatar)
              q-icon(name='flip_to_front')
          q-item-main(:label='$t(\'navigation.portrait.label\')', :sublabel='$t(\'navigation.portrait.sublabel\')')
        q-item(v-if="env.FEATURE_MR_GRIDDLE", @click.native="$router.push('/mr-griddle')", separator)
          q-item-side(icon='accessibility')
          // q-item-main(label='Mr. Griddle', sublabel='Do the griddle')
          q-item-main(:label='$t(\'navigation.mr_griddle.label\')', :sublabel='$t(\'navigation.mr_griddle.sublabel\')')
        q-item(v-if="env.FEATURE_RECIPES", @click.native="$router.push('/allrecipes')")
          q-item-side(icon='list')
          // q-item-main(label='Rezepte', sublabel='Remix Motion-Recipes')
          q-item-main(:label='$t(\'navigation.recipe.label\')', :sublabel='$t(\'navigation.recipe.sublabel\')')
        q-item(v-if="env.FEATURE_SPACE", @click.native="urlClick('/lost-in-space')")
          q-item-side(icon='explore')
          // q-item-main(label='Lost in Space', sublabel='Experience space')
          q-item-main(:label='$t(\'navigation.lost_in_space.label\')', :sublabel='$t(\'navigation.lost_in_space.sublabel\')')
        q-item(v-if="env.FEATURE_SEQUENCER", @click.native="$router.push('/videosequencer')")
          q-item-side(icon='movie')
          q-item-main(:label='$t(\'navigation.video_sequencer.label\')', :sublabel='$t(\'navigation.video_sequencer.sublabel\')')
        q-item(v-if="env.FEATURE_UPLOAD", @click.native="$router.push('/upload')", separator)
          q-item-side(icon='cloud upload')
          q-item-main(:label='$t(\'navigation.upload.label\')', :sublabel='$t(\'navigation.upload.sublabel\')')

    q-page-container
      router-view
    conversion-jobs
    mb-notification-service
</template>

<script>
  import { mapGetters } from 'vuex'
  import ConversionJobs from '../components/ConversionJobs'
  export default {
    components: {
      ConversionJobs
    },
    data () {
      return {
        env: process.env,
        info: {
          productName: '#digitanz'
        },
        leftDrawerOpen: this.$q.platform.is.desktop
      }
    },
    computed: {
      ...mapGetters({
        userState: 'auth/getUserState'
      })
    },
    methods: {
      clickLogo () {
        this.$router.push('/')
      },
      login () {
        this.$auth.authenticate()
      },
      logout () {
        this.$store.commit('auth/setUser', undefined)
        this.$auth.logout()
      }
    }
  }
</script>
