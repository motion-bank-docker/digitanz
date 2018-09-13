<template lang="pug">
  q-layout(view='lHh Lpr lFf')
    q-layout-header
      q-toolbar(dark, color='black', :glossy="$q.theme === 'mat'", :inverted="$q.theme === 'ios'")
        //
          q-btn(v-if="userState", flat, dense, round, @click.native.prevent='leftDrawerOpen = !leftDrawerOpen', aria-label='Menu')
            q-icon(name='menu')
        q-toolbar-title
          span(@click.prevent="clickTitle()") {{ info.productName }}
        q-btn(color="primary", flat, icon-right="eject",
          v-if="userState", @click.prevent="logout", :label="$t('navigation.logout')")
        q-btn(color="primary", flat, icon-right="arrow_forward",
          v-if="!userState", @click.prevent="login", :label="$t('navigation.login')")
    // q-layout-drawer(dark, v-model='leftDrawerOpen', :content-class="$q.theme === 'mat' ? 'bg-dark' : null", v-if="userState")
      //q-list(dark, no-border, link, inset-delimiter, v-if="urls")
      q-list(dark, no-border, link, inset-delimiter)
        // q-list-header Main Menu
        q-item(@click.native="$router.push('/dashboard')")
          q-item-side(icon="list")
          q-item-main(:label='$t(\'navigation.dashboard.label\')', :sublabel='$t(\'navigation.dashboard.sublabel\')')
        //
          q-item
            q-item-side
            q-item-main
              q-list.no-border.no-margin
                // q-item.no-padding(@click.native="$router.push('/dashboard')") 17.8.2018
                q-item.no-padding(@click.native="$router.push('/dashboard?item_id=abc')") 17.8.2018
        q-item(@click.native="$router.push('/portrait')")
          q-item-side(icon='account_box')
          q-item-main(:label='$t(\'navigation.portrait.label\')', :sublabel='$t(\'navigation.portrait.sublabel\')')

        q-item(@click.native="$router.push('/portraitplusplus')")
          q-item-side(icon='account_box')
          q-item-main(:label='$t(\'navigation.portraitplusplus.label\')', :sublabel='$t(\'navigation.portraitplusplus.sublabel\')')

        q-item(@click.native="$router.push('/groupsequences')")
          q-item-side(icon='account_box')
          q-item-main(:label="$t('navigation.groupsequences.label')", :sublabel="$t('navigation.groupsequences.sublabel')")

        q-item(v-if="env.FEATURE_MR_GRIDDLE", @click.native="$router.push('/mr-griddle')", separator)
          q-item-side(icon='accessibility')
          // q-item-main(label='Mr. Griddle', sublabel='Do the griddle')
          q-item-main(:label='$t(\'navigation.mr_griddle.label\')', :sublabel='$t(\'navigation.mr_griddle.sublabel\')')

        q-item(v-if="env.FEATURE_RECIPES", @click.native="$router.push('/allrecipes')", separator)
          q-item-side(icon='list')
          // q-item-main(label='Rezepte', sublabel='Remix Motion-Recipes')
          q-item-main(:label='$t(\'navigation.recipe.label\')', :sublabel='$t(\'navigation.recipe.sublabel\')')

        q-item(v-if="env.FEATURE_SPACE", @click.native="urlClick('/lost-in-space')", separator)
          q-item-side(icon='explore')
          // q-item-main(label='Lost in Space', sublabel='Experience space')
          q-item-main(:label='$t(\'navigation.lost_in_space.label\')', :sublabel='$t(\'navigation.lost_in_space.sublabel\')')

        q-item(v-if="env.FEATURE_SEQUENCER", @click.native="$router.push('/sequences')", separator)
          q-item-side(icon='movie')
          q-item-main(:label="$t('navigation.video_sequencer.label')", :sublabel="$t('navigation.video_sequencer.sublabel')")

        q-item(v-if="env.FEATURE_UPLOAD", @click.native="$router.push('/upload')", separator)
          q-item-side(icon='cloud upload')
          q-item-main(:label='$t(\'navigation.upload.label\')', :sublabel='$t(\'navigation.upload.sublabel\')')

        q-item(@click.native="$router.push('/team')", separator)
          q-item-side(icon='help')
          q-item-main(:label="$t('navigation.team.label')", :sublabel="$t('navigation.team.sublabel')")

    q-layout-footer.text-center.bg-dark.q-py-xs(v-if="userState")
      q-btn.q-mx-md.q-pa-xs(round, flat, size="lg",
        :class="{ 'text-white bg-grey-9': currentApp === 'my-digitanz' }",
        @click="executeApp('my-digitanz')")
        q-icon(name="person")

      // q-btn.q-mx-md(@click="$router.push('dashboard-new')", round, flat, size="lg")
      q-btn.q-mx-md(round, flat, size="lg",
        :class="{ 'text-white bg-grey-9': currentApp === 'dashboard-new' }",
        @click="executeApp('dashboard-new')")
        q-icon(name="home")

      // q-btn.q-mx-md(@click="$router.push('tools')", round, flat, size="lg")
      q-btn.q-mx-md(round, flat, size="lg",
        :class="{ 'text-white bg-grey-9': currentApp === 'tools' }",
        @click="executeApp('tools')")
        q-icon(name="add")

    q-page-container
      router-view
    conversion-jobs
    sequence-jobs
    mb-notification-service
</template>

<script>
  import { mapGetters } from 'vuex'
  import ConversionJobs from '../components/ConversionJobs'
  import SequenceJobs from '../components/SequenceJobs'
  export default {
    components: {
      ConversionJobs,
      SequenceJobs
    },
    data () {
      return {
        currentApp: null,
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
      clickTitle () {
        this.$router.push('/')
      },
      executeApp (appName) {
        this.currentApp = appName
        this.$router.push(appName)
      },
      login () {
        this.$auth.authenticate()
      },
      async logout () {
        await this.$store.dispatch('logging/log', { action: 'logout', message: this.userState.uuid })
        this.$store.commit('auth/setUser', undefined)
        this.$auth.logout()
      }
    }
  }
</script>
