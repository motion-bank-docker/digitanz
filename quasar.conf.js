// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      // 'raven',
      'dt-components',
      // 'api',
      // 'auth',
      'axios',
      'i18n',
      'notifications',
      'dates',
      'sort',
      'vuelidate'
      // 'dragula'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons'
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: false,
    vendor: {
      add: [],
      remove: []
    },
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        }, {
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        })
      },
      env: {
        //
        // Hosts
        //
        UI_HOST: JSON.stringify(process.env.UI_HOST || 'https://lite.digitanz.de'),
        APP_NAME: JSON.stringify(process.env.APP_NAME || '#digitanz lite'),
        //
        //
        //
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN || null)
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      host: '0.0.0.0',
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutFooter',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QTooltip',
        'QBtn',
        'QBtnGroup',
        'QBtnToggle',
        'QFab',
        'QFabAction',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemTile',
        'QUploader',
        'QModal',
        'QModalLayout',
        'QItemSeparator',
        'QInput',
        'QField',
        'QCard',
        'QCardActions',
        'QCardTitle',
        'QCardMain',
        'QCardMedia',
        'QCardSeparator',
        'QCheckbox',
        'QPageSticky',
        'QScrollArea',
        'QInnerLoading',
        'QSpinner',
        'QSpinnerMat',
        'QSpinnerTail',
        'QSpinnerHearts',
        'QChip',
        'QCollapsible',
        'QContextMenu',
        'QWindowResizeObservable',
        'QSlideTransition',
        'QInputFrame',
        'QProgress',
        'QTabs',
        'QTab',
        'QTabPane',
        'QBtnDropdown',
        'QPopover',
        'QSlider',
        'QRadio',
        'QSelect',
        'QSpinnerPuff',
        'QScrollObservable'
      ],
      directives: [
        'Ripple',
        'CloseOverlay',
        'TouchHold'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Loading'
      ],
      config: {
        loading: {
          spinner: 'GriddleMoves',
          spinnerSize: 300,
          spinnerColor: 'primary',
          customClass: 'bg-dark half-transparent',
          messageColor: 'light-gray',
          delay: 400
        }
      },
      i18n: 'de'
    },
    // animations: 'all' --- includes all animations
    animations: 'all',
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.2'
  }
}
