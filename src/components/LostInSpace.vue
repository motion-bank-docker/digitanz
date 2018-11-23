<template lang="pug">
  svg(width="100vw", height="100vh", @mouseup="addParticle")
    defs
      g#shape-protos
        g#diagonal-lines-1
          line(x1="-50", y1="-50", x2="50", y2="50")
        g#diagonal-lines-2
          line(x1="-50", y1="-50", x2="50", y2="50")
          line(x1="50",  y1="-50", x2="-50", y2="50")
        g#two-triangles-1
          polygon(points="-50,-50 50,-50 0,0")
          polygon(points="-50,50 50,50 0,0")
        g#two-triangles-2
          polygon(points="-50,-50 -50,50 0,0")
          polygon(points="50,-50 50,50 0,0")
        g#two-triangles-3
          polygon(points="-50,-50 50,-50 50,50")
        g#rect-1
          rect(x="-60", y="-60", width="120", height="120")
        g#ellipses-1
          ellipse(cx="0", cy="0", rx="60", ry="60")
        g#ellipses-2
          ellipse(cx="0", cy="0", rx="40", ry="40")
        g#ellipses-3
          ellipse(cx="0", cy="0", rx="20", ry="20")
        g#ellipses-4
          ellipse(cx="-30", cy="-30", rx="20", ry="20")
          ellipse(cx="25", cy="25", rx="40", ry="40")
        g#triangle-1
          polygon(points="3,50 -43,-24 43,-25")
    g#force-field(v-if="showForceField")
      template(v-for="(cell, i) in forceField")
        rect(:x="(i % forceFieldDimensions.columns) * forceFieldDimensions.width",
          :y="Math.floor(i / forceFieldDimensions.columns) * forceFieldDimensions.height",
          :width="forceFieldDimensions.width",
          :height="forceFieldDimensions.height",
          :fill="radiansToColor(cell)")
        polygon(points="10,0 -10,-10 0,0 -10,10",
          fill="rgba(255, 255, 255, 0.7)",
          :transform="`translate(${forceFieldDimensions.width / 2 + (i % forceFieldDimensions.columns) * forceFieldDimensions.width},${forceFieldDimensions.height / 2 + Math.floor(i / forceFieldDimensions.columns) * forceFieldDimensions.height}) rotate(${(cell / (Math.PI * 2)) * 360}) scale(${forceFieldDimensions.width / 70.0})`")
    g#shapes
      template(v-if="showShapePolys", v-for="shape in shapes")
        template(v-if="shape.points.length > 1")
          polygon(
            :points="shape.points.map(p=>{return `${p.x},${p.y} `})"
            :fill="'none' || shape.fill || 'black'", stroke="black", stroke-width="5")
          <!--ellipse(:cx="shape.center.x", :cy="shape.center.y", :rx="5", :ry="5",-->
            <!--fill="yellow", stroke="blue", stroke-width="3")-->
        template(v-else-if="showShapeFilling")
          ellipse(:cx="shape.points[0].x", :cy="shape.points[0].y", rx="10", ry="10", fill="white", stroke="black", stroke-width="2")
      use(x="0", y="0",
        :href="`#${currentShapeId}`",
        :transform="`translate(${svgSize.width/2},${svgSize.height/2}) scale(${svgSize.scale})`",
        fill="none", stroke="rgb(120,120,120)", stroke-width="4")
    g#particles
      template(v-for="particle in particles")
        ellipse(:cx="particle.position.x", :cy="particle.position.y", rx="10", ry="10")
</template>

<script>
  export default {
    data () {
      return {
        showShapeFilling: false,
        showForceField: false,
        showShapePolys: false,
        forceFieldCellSize: 60,
        forceFieldStrength: 0.05,
        forceRepelStrength: 0.5,
        numberOfParticles: 100,
        frameLength: 20.0,
        lastFrameTime: -1,
        timerId: -1,
        currentShape: -1,
        shapeProtos: [],
        shapes: [],
        shapeIds: [],
        currentShapeId: '#ellipses-1',
        particles: [],
        forceFieldDimensions: {
          columns: -1,
          rows: -1,
          width: -1,
          height: -1
        },
        forceField: [],
        shapePolygonizerDetail: 10,
        shapeFilling: {
          width: 11,
          height: 11
        }
      }
    },
    beforeDestroy () {
      window.removeEventListener('keyup', this.handleKey)
      clearInterval(this.timerId)
    },
    mounted () {
      const that = this

      window.addEventListener('keyup', this.handleKey)

      const shapeProtos = this.$el.querySelectorAll('#shape-protos > g')

      const winHalfWidth = this.svgSize.width / 2
      const winHalfHeight = this.svgSize.height / 2
      const smallestLengthFull = Math.min(this.svgSize.width, this.svgSize.height)
      const smallestLength = smallestLengthFull * 0.7

      const fillWidth = this.shapeFilling.width
      const fillHeight = this.shapeFilling.height

      this.shapeIds = []
      this.shapeProtos = Array(shapeProtos.length).fill(0).map((v2, l) => {
        let proto = shapeProtos[l]
        that.shapeIds.push(proto.id)
        let shapes = Array(proto.children.length).fill(0).map((v1, i) => {
          let svgEl = proto.children[i]
          let pathLen = svgEl.getTotalLength()
          let amount = this.shapePolygonizerDetail
          let step = pathLen / (amount - 1)
          let points = Array(amount).fill(0).map((v, n) => {
            let len = step * n
            let point = svgEl.getPointAtLength(len)
            return {
              x: winHalfWidth + (point.x / 100.0 * smallestLength),
              y: winHalfHeight + (point.y / 100.0 * smallestLength)
            }
          })
          return {points: points}
        })
        let fillShapes = []
        shapes.forEach(shape => {
          let w = fillWidth
          let h = fillHeight
          Array(w * h).fill(0).forEach((v4, m) => {
            let x = ((m % w) / w) * 150.0 - 75
            let y = (Math.round(m / w) / w) * 150.0 - 75
            let p = {
              x: winHalfWidth + (x / 100.0 * smallestLength),
              y: winHalfHeight + (y / 100.0 * smallestLength)
            }
            if (that.isPointInPolygon(p, shape.points)) {
              fillShapes.push({points: [p]})
            }
          })
        })
        shapes = shapes.concat(fillShapes)
        return shapes
      })

      this.forceFieldDimensions.columns = Math.ceil(window.innerWidth / this.forceFieldCellSize)
      this.forceFieldDimensions.width = window.innerWidth / this.forceFieldDimensions.columns
      this.forceFieldDimensions.rows = Math.ceil(window.innerHeight / this.forceFieldCellSize)
      this.forceFieldDimensions.height = window.innerHeight / this.forceFieldDimensions.rows

      this.nextShape()

      this.particles = Array(this.numberOfParticles).fill(0).map(() => {
        return that.makeParticle()
      })

      this.timerId = setInterval(this.timerIntervalHandler, this.frameLength)
    },
    computed: {
      svgSize () {
        const smallestLengthFull = Math.min(window.innerWidth, window.innerHeight)
        const smallestLength = smallestLengthFull * 0.7
        return {
          width: window.innerWidth,
          height: window.innerHeight,
          side: smallestLength,
          scale: smallestLength / 100.0
        }
      }
    },
    methods: {
      // randomForceField () {
      //   // random FF
      //   this.forceField = Array(forceFieldLength).fill(0).map(() => {
      //     return Math.random() * Math.PI * 2
      //   })
      // },
      // circularForceField () {
      //   // circular FF
      //   this.forceField = Array(forceFieldLength).fill(0).map((v, i) => {
      //     let x = i % this.forceFieldDimensions.columns
      //     let y = Math.round(i / this.forceFieldDimensions.columns)
      //     let xDist = this.forceFieldDimensions.columns / 2 - x
      //     let yDist = this.forceFieldDimensions.rows / 2 - y
      //     return Math.atan2(yDist, xDist) + Math.PI / 2
      //   })
      // },
      timerIntervalHandler () {
        this.updateParticles()
      },
      updateParticles () {
        let that = this
        if (this.particles) {
          this.particles = this.particles.map((particle, i) => {
            let rad = this.getForceFieldValue(particle.position.x, particle.position.y)

            let forceX = Math.cos(rad) * this.forceFieldStrength
            let forceY = Math.sin(rad) * this.forceFieldStrength

            particle.direction.x += forceX
            particle.direction.y += forceY

            // repel from other particles
            for (let n = i + 1, k = that.particles.length; n < k; n++) {
              let particle2 = that.particles[n]
              let distX = particle2.position.x - particle.position.x
              let distY = particle2.position.y - particle.position.y
              let dist = Math.sqrt(distX * distX + distY * distY)
              if (dist < 30) {
                let rad2 = Math.atan2(distY, distX)
                let forceX = Math.cos(rad2) * this.forceRepelStrength
                let forceY = Math.sin(rad2) * this.forceRepelStrength
                particle.direction.x -= forceX
                particle.direction.y -= forceY
                particle2.direction.x += forceX
                particle2.direction.y += forceY
              }
            }

            // attract to shapes (-points)
            that.shapes.map(shape => {
              let isFilling = shape.points.length === 1
              shape.points.map(point => {
                let distX = point.x - particle.position.x
                let distY = point.y - particle.position.y
                let dist = Math.sqrt(distX * distX + distY * distY)
                if (dist < 100) {
                  let fac = isFilling ? 0.3 : 0.2
                  let rad2 = Math.atan2(distY, distX)
                  let forceX = Math.cos(rad2) * fac
                  let forceY = Math.sin(rad2) * fac
                  particle.direction.x += forceX
                  particle.direction.y += forceY
                }
              })
            })

            let len = Math.sqrt(particle.direction.x * particle.direction.x + particle.direction.y * particle.direction.y)
            if (len !== 0 && len !== 1) {
              particle.direction.x /= len
              particle.direction.y /= len
            }

            particle.position.x += particle.direction.x * particle.velocity
            particle.position.y += particle.direction.y * particle.velocity

            if (particle.position.x >= that.svgSize.width) particle.position.x = 1
            if (particle.position.x <= 0) particle.position.x = that.svgSize.width - 1
            if (particle.position.y >= that.svgSize.height) particle.position.y = 1
            if (particle.position.y <= 0) particle.position.y = that.svgSize.height - 1

            return particle
          })
        }
      },
      addParticle (event) {
        this.particles.push(this.makeParticle(event.clientX, event.clientY))
      },
      radiansToColor (rad) {
        let angle = (rad / (Math.PI * 2)) * 360
        return `hsl(${angle} 100% 50%)`
      },
      getForceFieldValue (x, y) {
        let fx = Math.floor(x / this.forceFieldDimensions.width)
        let fy = Math.floor(y / this.forceFieldDimensions.height)
        return this.forceField[fx + fy * this.forceFieldDimensions.columns]
      },
      makeParticle (x, y) {
        let rad = Math.random() * Math.PI * 2
        return {
          position: {
            x: x || (Math.random() * window.innerWidth),
            y: y || (Math.random() * window.innerHeight)
          },
          direction: {
            x: Math.cos(rad),
            y: Math.sin(rad)
          },
          velocity: 1 + Math.random() * 2
        }
      },
      updateShapes () {
        // const winX = window.innerWidth
        // const winY = window.innerHeight
        // this.shapes = this.shapes.map(shape => {
        //   shape.points = shape.points.map(point => {
        //     let dx = winX - point.x
        //     let dy = winY - point.y
        //     let len = Math.sqrt(dx * dx + dy * dy)
        //     let rad = Math.atan2(dy, dx)
        //     rad += Math.PI / 600
        //     point.x = Math.cos(rad) * len
        //     point.y = Math.sin(rad) * len
        //     return point
        //   })
        //   return shape
        // })
      },
      updateForceField () {
        const that = this
        let forceFieldLength = this.forceFieldDimensions.columns * this.forceFieldDimensions.rows
        // FF based on shapes
        this.forceField = Array(forceFieldLength).fill(0).map((v, i) => {
          let x = i % that.forceFieldDimensions.columns
          let y = Math.round(i / that.forceFieldDimensions.columns)
          let xDist = 0
          let yDist = 0

          that.shapes.map(shape => {
            if (shape.points.length > 1) {
              shape.points.map(point => {
                let sx = Math.round(point.x / that.forceFieldDimensions.width)
                let sy = Math.round(point.y / that.forceFieldDimensions.height)
                let xd = sx - x
                let yd = sy - y
                let dist = Math.sqrt(xd * xd + yd * yd)
                let factor = 1
                if (dist > 0) factor = 1 / (dist * dist * dist)
                xDist += xd * factor
                yDist += yd * factor
              })
            }
          })

          return Math.atan2(yDist, xDist)
        })
      },
      async handleKey (event) {
        if (event.key === ' ') {
          this.nextShape()
        }
      },
      async nextShape () {
        this.currentShape++
        this.currentShape %= this.shapeProtos.length

        this.shapes = this.shapeProtos[this.currentShape]
        this.currentShapeId = this.shapeIds[this.currentShape]

        const message = {
          shapeNum: this.currentShape,
          totalShapes: this.shapeProtos.length,
          shapeId: this.currentShapeId,
          numberOfParticles: this.numberOfParticles
        }
        await this.$store.dispatch('logging/log', {
          action: 'space-shape',
          message
        })

        this.updateShapes()
        this.updateForceField()

        this.storeState()
      },
      storeState () {
        /*
        if (this.$store.state.auth.payload && this.$store.state.auth.payload.userId) {
          let annotation = {
            body: {
              type: 'LostInSpaceShape',
              purpose: 'linking',
              value: JSON.stringify({
                forceFieldCellSize: this.forceFieldCellSize,
                numberOfParticles: this.numberOfParticles,
                currentShapeId: this.currentShapeId,
                forceFieldDimensions: this.forceFieldDimensions,
                shapePolygonizerDetail: this.shapePolygonizerDetail,
                shapeFilling: this.shapeFilling,
                svgSize: this.svgSize
              })
            },
            author: this.$store.state.auth.payload.userId
          }
          this.$store.dispatch('annotations/create', annotation).then((resp) => {
            console.log(resp)
          })
        }
        */
      },
      isPointInPolygon (point, polygon) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        let x = point.x
        let y = point.y

        let inside = false
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          let xi = polygon[i].x
          let yi = polygon[i].y
          let xj = polygon[j].x
          let yj = polygon[j].y

          let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
          if (intersect) inside = !inside
        }

        return inside
      }
      // ,
      // makeShape () {
      //   let size = 50 + Math.random() * window.innerWidth / 2
      //   let x = Math.random() * window.innerWidth
      //   let y = Math.random() * window.innerHeight
      //   let shape = {
      //     center: {x: x, y: y},
      //     points: []
      //   }
      //   Array(3 + Math.ceil(Math.random() * 5)).fill(0).map(() => {
      //     let rad = Math.random() * Math.PI * 2
      //     shape.points.push({
      //       x: x + Math.cos(rad) * Math.random() * size,
      //       y: y + Math.sin(rad) * Math.random() * size
      //     })
      //   })
      //   this.shapes.push(shape)
      // }
    }
  }
</script>

<style scoped lang="stylus">
</style>
