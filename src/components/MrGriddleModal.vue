<template lang="pug">
  q-modal.bg-dark(v-model="showModal", maximized)
    q-modal-layout(dark, :content-class="{'bg-dark': true}")
      | empty
      | -------
      | {{ height }}
      | -------
      .q-caption.text-white ::: {{ modalContent }} +++
      | -------
    q-btn.bg-dark.fixed-top-right.q-ma-md.shadow-4(@click="close", icon="clear", flat, round, size="sm")
</template>

<script>
  // import { VideoPlayer } from 'mbjs-quasar/src/components'

  export default {
    components: {
    },
    props: ['height'],
    data () {
      return {
        device: {
          width: '',
          height: ''
        },
        distance: {
          left: '',
          top: ''
        },
        modalContent: undefined,
        src: '',
        playerWidth: '',
        playerHeight: '',
        index: -1,
        video: undefined,
        showModal: false,
        preview: undefined,
        modalInterval: undefined
      }
    },
    computed: {
    },
    watch: {
    },
    mounted () {
    },
    methods: {
      startTimer (val) {
        // this.timerId = setInterval(this.timerIntervalHandler, this.timerInterval)
        console.log('START')
        let i = 0
        this.modalInterval = setInterval(function () {
          console.log(i, val[i].skeleton[0].id, val[i].skeleton[0].x2)
          i++
          if (i >= val.length) i = 0
        }, 500)
      },
      onResize (size) {
        if (this.preview !== undefined) {
          this.device.width = size.width
          this.device.height = size.height
          let videoX = this.preview.metadata.width
          let videoY = this.preview.metadata.height
          if (this.device.width > this.device.height) { // DEVICE LANDSCAPE
            if (videoX < videoY) {
              this.playerWidth = this.device.height / (videoY / videoX)
              // this.playerHeight = this.playerWidth * (videoY / videoX)
            } // video hochformat
            if (videoX > videoY) this.playerWidth = this.device.width // video querformat
          }
          else if (size.width < size.height) { // DEVICE PORTRAIT
            if (videoX < videoY) this.playerWidth = this.device.width // video hochformat
            if (videoX > videoY) this.playerWidth = this.device.width // video querformat
            this.playerHeight = this.device.height * (videoY / videoX)
          }
          this.distance.left = (this.device.width - this.playerWidth) / 2
          // this.distance.top = (size.width - this.playerHeight) / 2
        }
      },
      show (val) {
        this.showModal = true
        this.modalContent = val
        this.startTimer(val)
        /* if (preview.annotation !== undefined) this.src = preview.annotation
        else if (preview.portrait !== undefined) this.src = preview.portrait
        else this.src = preview.response
        // console.log(this.src)
        this.preview = preview
        this.showModal = true */
      },
      close () {
        this.showModal = false
        this.modalContent = undefined
        clearInterval(this.modalInterval)
        console.log('STOP')
      }
    }
  }
</script>
