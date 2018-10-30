<template lang="pug">
  div
    svg(width="100vw",height="100vh")
      defs
        linearGradient#verlauf
          stop(offset="50%" stop-color="#FFF")
          stop(offset="100%" stop-color="#000")
        symbol#plus(viewBox="0 0 100 100")
          rect(x="33px" y="0" width="33px" height="100px" fill="black")
          rect(x="0" y="33px" width="100px" height="33px" fill="black")
        symbol#minus(viewBox="0 0 100 100")
          rect(x="0" y="33px" width="150px" height="33px" fill="black")
      g.time-bar
        rect(:x="timeLooptoPercent(getTimeLoop())" y="0" width="100%" height="100%" fill="url(#verlauf)" stroke="none")
      g.bars
        template(v-for="(rhythmWeight, i) in rhythmWeights")
          //g(class="rhythmBar" :transform="xTranslateSyntax(rhythm.x[i])")
          //https://www.sarasoueidan.com/blog/mimic-relative-positioning-in-svg/
          svg(:x="rhythm.x[i]" :width="rhythm.width[i]")
            polygon(:points="trianglePoints()" fill="#eee")
            rect(x="0" y="0" width="100%" height="100%" fill="none" stroke="white")
      g#pulse
        rect(x="0" y="0" width="100%" height="100%" fill="white" v-show="pulse")
      g#interface
        ellipse(cx="87%", cy="91%", rx="25", ry="25", fill="darkred", @click="$router.push({path:'rhythm-creator'})")
        use(href="#minus" x="90%" y="87%" width="50" height="50" @click="() => {removeBar()}")
        use(href="#plus" x="95%" y="87%" width="50" height="50" @click="() => {addBar()}")
        template(v-for="(rhythmWeight, i) in rhythmWeights")
          svg(:x="rhythm.x[i]" :width="rhythm.width[i]")
            use(xlink:href="#plus" x="15px" y="50px" width="40" height="40" @click="() => {addRhythmWeight(i)}")
            use(xlink:href="#minus" x="15px" y="120px" width="40" height="40" @click="() => {minusRhythmWeight(i)}")
    audio(src="@/assets/beep.mp3")
    div.input-interface
      div
        label Sekunden:
          input(v-model="timeLength" size="5")
      div
        label Patterns:
          select(@change="handlePatternChange")
            template(v-for="(pattern, i) in patterns")
              option(:value="i") {{pattern.name}}
</template>

<script>
  // import NetworkClock from '../lib/network-clock'
  export default {
    data () {
      return {
        patterns: [
          {name: '3/3', rhythmWeights: [33.33, 33.33, 33.33]},
          {name: '4/4', rhythmWeights: [25, 25, 25, 25]},
          {name: 'tscha-tscha', rhythmWeights: [25, 25, 16.66, 16.66, 16.66]}
        ],
        rhythmWeights: [
          10, 10, 10
        ],
        timeLength: 10,
        playing: {},
        sounds: {pulse: '../assets/beep.mp3'},
        netClock: undefined, // new NetworkClock(),
        time: 0,
        lastPulseTime: 0,
        interv: undefined
      }
    },
    async mounted () {
      const _this = this
      this.interv = setInterval(() => {
        _this.time = Date.now()
      }, 40)
      // this.netClock.on('broadcast', data => {
      //   if (data.rhythmWeights) {
      //     this.setState(data)
      //   }
      // })
      if (this.$route.params && this.$route.params.annotationId) {
        const _this = this
        this.$store.dispatch('annotations/find', { query: { 'body.purpose': 'linking', 'uuid': this.$route.params.annotationId } })
          .then(entries => {
            if (entries && entries.length > 0) {
              let annotation = entries[0]
              let state = JSON.parse(annotation.body.value)
              _this.setState(state, false)
            }
          })
      }
    },
    beforeDestroy () {
      clearInterval(this.interv)
    },
    methods: {
      handlePatternChange (event) {
        let selPatternId = event.target.value
        let pattern = this.patterns[selPatternId]
        this.setState(pattern)
      },
      setState (newState, doStore = true) {
        this.rhythmWeights = newState.rhythmWeights
        if (newState.timeLength) {
          this.timeLength = newState.timeLength
        }
        if (doStore) this.storeState()
      },
      getState () {
        return {
          rhythmWeights: this.rhythmWeights,
          timeLength: this.timeLength,
          time: this.time
        }
      },
      storeState () {
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
          })
        }
      },
      trianglePoints: function () {
        return `0 ${window.innerHeight}, ${window.innerWidth} ${window.innerHeight}, ${window.innerWidth} 0`
      },
      weightToFactor (weight) {
        let sumOfRhythm = this.rhythmWeights.reduce(function (acc, val) {
          return acc + val
        })
        return (weight / sumOfRhythm)
      },
      addBar: function () {
        let newRhythmWeights = this.rhythmWeights.slice(0)
        newRhythmWeights.push(10)
        this.setState({rhythmWeights: newRhythmWeights})
      },
      removeBar: function () {
        let newRhythmWeights = this.rhythmWeights.slice(0)
        newRhythmWeights.pop()
        this.setState({rhythmWeights: newRhythmWeights})
      },
      timeLooptoPercent: function (timeLoop) {
        return (timeLoop * 100) - 100 + '%'
      },
      getTimeLoop () {
        let timeFactor = this.timeLength * 1000
        return (this.time % timeFactor) / timeFactor
      },
      addRhythmWeight: function (pos) {
        let newRhythmWeights = this.rhythmWeights.slice(0)
        newRhythmWeights[pos] += 5
        this.setState({rhythmWeights: newRhythmWeights})
        // this.$set(this.rhythmWeights, pos, newValue)
      },
      minusRhythmWeight: function (pos) {
        let newRhythmWeights = this.rhythmWeights.slice(0)
        newRhythmWeights[pos] -= 5
        if (newRhythmWeights[pos] <= 0) {
          newRhythmWeights.splice(pos, 1)
        }
        this.setState({rhythmWeights: newRhythmWeights})
      },
      // Play Sound (q&d weil Audio API nicht überlagern kann)
      player: function (soundfile) {
        let b = new Date()
        let a = soundfile + b.getTime()
        this.playing[a] = new Audio(this.sounds[soundfile])
        this.playing[a].onended = function () {
          delete this.playing[a]
        }
        this.playing[a].play()
        window.console.log(this.playing[a].play())
      },
      setLastTimeSlot (val) {
        this.lastTimeSlot = val
      },
      saveRhythm: function () {
        let storage = localStorage.getItem('rythms')
        let saveObject = {
          rhythm: this.rhythmWeights,
          time: this.timeLength
        }
        if (storage) {
          let rhythmList = JSON.parse(storage)
          rhythmList.push(saveObject)
          localStorage.setItem('rythms', JSON.stringify(rhythmList))
        }
        else {
          let rhythmList = []
          rhythmList.push(saveObject)
          localStorage.setItem('rythms', JSON.stringify(rhythmList))
        }
        this.readLocalRythm()
      },
      readRhythm: function (rhythm, time) {
        this.rhythmWeights = rhythm
        this.timeLength = time
      }
    },
    computed: {
      readLocalRythm: function () {
        let storage = localStorage.getItem('rythms')
        let rhythmList = JSON.parse(storage)
        return rhythmList
      },
      rhythm: function () {
        let rhythmFactor = []
        let rhythmBarWidth = []
        let rhythmBarXpos = []
        let x = 0
        /* eslint-disable no-unused-vars */
        let prev = 0
        /* eslint-enable no-unused-vars */
        this.rhythmWeights.forEach((val, i) => {
          let barFactor = this.weightToFactor(val) // (val - prev) / 100
          prev = val
          console.log(val, barFactor, val / 100.0)
          let width = barFactor * 100
          rhythmFactor[i] = barFactor
          rhythmBarWidth[i] = width + '%'
          rhythmBarXpos[i] = x + '%'
          x = x + width
        })
        return {width: rhythmBarWidth, x: rhythmBarXpos, factor: rhythmFactor}
      },
      rhythmTime: function () {
        let timeArray = []
        let time = 0
        this.rhythm.factor.forEach(function (weight) {
          time = weight + time
          timeArray.push(Math.round(time * 100))
        })
        return timeArray
      },
      pulse: function () {
        let timeNow = this.getTimeLoop() * 100
        let currentTimeSlot = this.rhythmTime.filter(t => {
          return timeNow < t
        }).shift()
        let doPulse = this.lastTimeSlot !== currentTimeSlot
        this.setLastTimeSlot(currentTimeSlot)
        if (doPulse === true) {
          // Block Autoplay Policy
          // chrome://media-engagement/
          // this.player(this.soundFile)
        }
        return doPulse
      },
      soundFile: function () {
        return require('../assets/beep.mp3')
      }
    }
  }
</script>

<style scoped>
  div svg {
    background: darkgray;
  }
  .bars rect {
    stroke: #fff;
    stroke-width: 3px;
  }
  .time-bar {
    opacity: 0.5;
    pointer-events: none;
  }
  .input-interface {
    position: absolute;
    bottom: 5vh;
    left: 2vh;
  }
  .save-menu {
    width: 100vw;
  }
  .save-menu li {
    margin: 0.2rem;
    padding: 0.2rem;
    font-size: 2rem;
    list-style: none;
    background: #f1f1f1;
  }
</style>
