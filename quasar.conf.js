// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'api',
      'auth',
      'axios',
      'params'
   //   'dragula'
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
        GENTLY: JSON.stringify(false),
        PARAM_HOST: JSON.stringify(process.env.PARAM_HOST || 'http://params.digitanz.de/'),
        API_HOST: JSON.stringify(process.env.API_HOST || 'https://api.motionbank.org'),
        TRANSCODER_HOST: JSON.stringify(process.env.TRANSCODER_HOST || 'https://transcoder.motionbank.org'),
        UI_HOST: JSON.stringify(process.env.UI_HOST || 'http://app.digitanz.de'),
        TIMELINE_BASE_URI: JSON.stringify(process.env.TIMELINE_BASE_URI || 'https://app.motionbank.org/piecemaker/timelines/'),
        GRID_BASE_URI: JSON.stringify(process.env.GRID_BASE_URI || 'https://app.motionbank.org/mosys/grids/'),
        ID_FIELD: JSON.stringify(process.env.ID_FIELD || 'uuid'),
        AUTH0_DOMAIN: JSON.stringify(process.env.AUTH0_DOMAIN || 'motionbank.eu.auth0.com'),
        AUTH0_CLIENT_ID: JSON.stringify(process.env.AUTH0_CLIENT_ID || 'q2iRQgbj8weO946f2XqDE0Mp05s5bcFi'),
        AUTH0_REDIRECT_URL: JSON.stringify(process.env.AUTH0_REDIRECT_URL || 'http://app.digitanz.de/users/callback'),
        AUTH0_AUDIENCE: JSON.stringify(process.env.AUTH0_AUDIENCE || 'https://api.motionbank.org')
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
        'QCheckbox',
        'QPageSticky',
        'QScrollArea',
        'QInnerLoading',
        'QSpinnerMat',
        'QChip'
      ],
      directives: [
        'Ripple'
      ],
      // Quasar plugins
      plugins: [
        'Notify'
      ]
    },
    // animations: 'all' --- includes all animations
    animations: [
    ],
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
