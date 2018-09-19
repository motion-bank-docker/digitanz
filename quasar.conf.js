// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'raven',
      'dt-components',
      'api',
      'auth',
      'axios',
      'i18n',
      'notifications',
      'dates',
      'sort'
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
        API_HOST: JSON.stringify(process.env.API_HOST || 'https://api.motionbank.org'),
        TRANSCODER_HOST: JSON.stringify(process.env.TRANSCODER_HOST || 'https://transcoder.motionbank.org'),
        LOGGER_HOST: JSON.stringify(process.env.LOGGER_HOST || 'https://logging.motionbank.org'),
        UI_HOST: JSON.stringify(process.env.UI_HOST || 'https://app.digitanz.de'),
        ASSETS_BASE_PATH: JSON.stringify(process.env.ASSETS_BASE_PATH || 'https://assets.motionbank.org/piecemaker/'),
        //
        // Resources
        //
        TIMELINE_BASE_URI: JSON.stringify(process.env.TIMELINE_BASE_URI || 'http://id.motionbank.org/maps/'),
        ANNOTATION_BASE_URI: JSON.stringify(process.env.ANNOTATION_BASE_URI || 'http://id.motionbank.org/annotations/'),
        GRID_BASE_URI: JSON.stringify(process.env.GRID_BASE_URI || 'http://id.motionbank.org/maps/'),
        ID_FIELD: JSON.stringify(process.env.ID_FIELD || 'uuid'),
        SYSTEM_USER_UUID: JSON.stringify(process.env.SYSTEM_USER_UUID || 'aa5a24cc-dbd3-5b5d-8ca6-76552699cbd9'),
        PORTRAITS_TIMELINE_UUID: JSON.stringify(process.env.PORTRAITS_TIMELINE_UUID || 'dfceff69-75a8-4087-b3cc-0bbd23c833c3'),
        SEQUENCES_TIMELINE_UUID: JSON.stringify(process.env.SEQUENCES_TIMELINE_UUID || 'd93ebf09-2c01-4d28-9cbb-0a6d1629b4be'),
        MR_GRIDDLE_TIMELINE_UUID: JSON.stringify(process.env.MR_GRIDDLE_TIMELINE_UUID || '3c5d7c77-95b3-4b26-b197-888dec885469'),
        APP_NAME: JSON.stringify(process.env.APP_NAME || 'digitanz'),
        //
        // Auth0
        //
        AUTH0_DOMAIN: JSON.stringify(process.env.AUTH0_DOMAIN || 'auth.motionbank.org'),
        AUTH0_CLIENT_ID: JSON.stringify(process.env.AUTH0_CLIENT_ID || '80t5TRU9MVhGDVnZ522CvX4hutBxDB6U'),
        AUTH0_REDIRECT_URL: JSON.stringify(process.env.AUTH0_REDIRECT_URL || 'https://app.digitanz.de/users/callback'),
        AUTH0_AUDIENCE: JSON.stringify(process.env.AUTH0_AUDIENCE || 'https://api.motionbank.org'),
        //
        //
        //
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN || null),
        //
        // Toggle tools/features
        //
        FEATURE_MR_GRIDDLE: JSON.stringify(process.env.FEATURE_MR_GRIDDLE || false),
        FEATURE_RECIPES: JSON.stringify(process.env.FEATURE_RECIPES || false),
        FEATURE_SPACE: JSON.stringify(process.env.FEATURE_SPACE || false),
        FEATURE_SEQUENCER: JSON.stringify(process.env.FEATURE_SEQUENCER || true),
        FEATURE_UPLOAD: JSON.stringify(process.env.FEATURE_MR_GRIDDLE || true)
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
        'QBtnDropdown'
      ],
      directives: [
        'Ripple'
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
