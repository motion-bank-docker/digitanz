<template lang="pug">
  div
    <!--div {{recordeRhythmTime}}-->
      <!--| {{rhythmWeights}}-->
      <!--| {{timeLength}}-->
    <!--button(@click="() => {sendRhythm()}") An alle-->
    button(@click="() => {openRhythm()}") Speichern
    svg(width="100vw",height="100vh")
      rect(x="0" y="0" width="100%" height="100%" fill="white")
      g
        ellipse(cx="50%" cy="50%" rx="250" ry="250" :fill="statusColor" @click="() => {startRecording()}")
        text(x="50%" y="53%" fill="white" text-anchor="middle") {{currentStatus()}}
        template(v-if="status === 1")
          text(x="50%" y="66%" fill="white" text-anchor="middle") {{recordeRhythmTime.length || 0}}
      ellipse(:cx="tapVisual.x" :cy="tapVisual.y" :rx="tapVisual.size" :ry="tapVisual.size" fill="red")
    ul
      li(@click="() => {saveRhythm()}") save
</template>

<script>
  import NetworkClock from '../lib/network-clock'
  export default {
    data () {
      return {
        recordeStartTime: 0,
        recordeRhythmTime: [],
        time: 0,
        netClock: new NetworkClock(),
        statusText: ['Starten', 'Tap', 'Speichern'],
        status: 0,
        tap: false
      }
    },
    async mounted () {
      const _this = this
      setInterval(() => {
        _this.time = this.netClock.getTime()
      }, 40)
    },
    methods: {
      startRecording: function () {
        if (this.status === 0) {
          this.status = 1
          this.recordeStartTime = this.time
          // this.recordeRhythmTime.push(this.time - this.recordeStartTime)
          console.log('start Recording')
        }
        else if (this.status === 1) {
          this.recordeRhythmTime.push(this.time - this.recordeStartTime)
          console.log(this.recordeRhythmTime)
        }
      },
      currentStatus: function () {
        return this.statusText[this.status]
      },
      tapVisual: function (e) {
        let start = Date.now()
        console.log(e)
        let timer = setInterval(function () {
          let timePassed = Date.now() - start
          if (timePassed >= 500) {
            clearInterval(timer)
            return {
              show: false
            }
          }
          let timeToOpacity = (timePassed / 500) * -1 + 1
          let animate = {
            size: timePassed,
            opacity: timeToOpacity,
            x: e.clientX,
            y: e.clientY,
            show: true
          }
          console.log(animate)
          return animate
        }, 10)
      },
      convertToPercentages: function (array) {
        let max = array[array.length - 1]
        let prev = 0
        return array.map(function (number) {
          let perc = (100.0 * number / max) | 0
          let val = perc - prev
          prev = perc
          return val
        })
      },
      setState (newState) {
        this.rhythmWeights = newState.rhythmWeights
        if (newState.timeLength) {
          this.timeLength = newState.timeLength
        }
        this.storeState()
      },
      getState () {
        return {
          rhythmWeights: this.rhythmWeights,
          timeLength: this.timeLength,
          time: this.time
        }
      },
      storeState () {
        const _this = this
        if (this.$store.state.auth.payload && this.$store.state.auth.payload.userId) {
          let annotation = {
            body: {
              type: 'RhythmToolEditor',
              purpose: 'linking',
              value: JSON.stringify(this.getState())
            },
            author: this.$store.state.auth.payload.userId
          }
          this.$store.dispatch('annotations/create', annotation).then((resp) => {
            console.log(resp)
            _this.$router.push({ path: `/rhythm/${resp.uuid}` })
          })
        }
      },
      sendRhythm () {
        this.netClock.broadcast({ rhythmWeights: this.rhythmWeights, timeLength: this.timeLength })
      },
      openRhythm () {
        this.storeState()
      }
    },
    computed: {
      statusColor: function () {
        if (this.status === 0) {
          return 'red'
        }
        else if (this.status === 1) {
          return 'green'
        }
        else if (this.status === 2) {
          return 'black'
        }
      },
      rhythmWeights: function () {
        if (this.status === 1) {
          console.log(this.convertToPercentages(this.recordeRhythmTime))
          return this.convertToPercentages(this.recordeRhythmTime)
        }
      },
      timeLength: function () {
        let maxTime = this.recordeRhythmTime[this.recordeRhythmTime.length - 1]
        return (maxTime / 1000).toFixed(1)
      }
    }
  }
</script>

<style scoped>
  .input-interface {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    display: flex;
    justify-content: center;
  }
  .input-interface #record {
    width: 50vw;
    height: 30vw;
    align-self: center;
    font-size: 5vh;
  }
  svg text{
    font-size: 10vh;
    pointer-events: none;
  }
 /* #tap-visual {
    transform: scale(0);
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
    opacity: 0.75;
    transition: all 500ms;

  }
  .tap-enter {
    opacity: 0;
    transform: scale(20);
  }
  .tap-visual_animate {
  } */
</style>
