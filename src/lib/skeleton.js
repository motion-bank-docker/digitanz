const PI = Math.PI
const TWO_PI = Math.PI * 2
const HALF_PI = Math.PI / 2.0
// const QUARTER_PI = Math.PI / 4.0
const PI_12 = Math.PI / 12

class Joint {
  constructor (name, radians, constraints, distance) {
    this.name = name
    this.children = []
    this.parent = null
    this._radians = radians
    constraints.sort()
    this._constraints = constraints
    this.distance = distance * 3

    this.applyConstraints()
  }
  applyConstraints () {
    this._radians = Math.max(this._radians, this._constraints[0])
    this._radians = Math.min(this._radians, this._constraints[1])
  }
  setParent (parent) {
    if (parent) {
      this.parent = parent
    }
  }
  addChild (child) {
    if (child && this.children.indexOf(child) === -1) {
      this.children.push(child)
    }
  }
  get x () {
    return this.getX()
  }
  getX () {
    return (this.parent ? this.parent.x : 0) + Math.cos(this.radians) * this.distance
  }
  get y () {
    return this.getY()
  }
  getY () {
    return (this.parent ? this.parent.y : 0) + Math.sin(this.radians) * this.distance
  }
  get radians () {
    return this.getRadians()
  }
  getRadians () {
    return (this.parent ? this.parent.radians : 0) + this._radians
  }
  getEdges () {
    let edges = []
    if (this.parent) {
      let edge = {
        id: this.name,
        x1: this.parent.x,
        y1: this.parent.y,
        x2: this.parent.x + Math.cos(this.radians) * this.distance,
        y2: this.parent.y + Math.sin(this.radians) * this.distance
      }
      edges.push(edge)
    }
    this.children.forEach(child => {
      edges = edges.concat(child.getEdges())
    })
    return edges
  }
  rotate () {
    this._radians += ((Math.random() * TWO_PI) - Math.PI) * 0.1
    this.applyConstraints()
    this.children.forEach(child => {
      child.rotate()
    })
  }
  static link (parent, child) {
    child.setParent(parent)
    parent.addChild(child)
  }
}

class Skeleton {
  constructor () {
    let hip = new Joint('hip', 0, [0, 0], 0)
    let spine = new Joint('spine', 3 * HALF_PI, [3 * HALF_PI - PI_12, 3 * HALF_PI + PI_12], 20)
    Joint.link(hip, spine)
    let centerShoulder = new Joint('center-shoulder', 0, [PI_12 * -2, PI_12 * 2], 50)
    Joint.link(spine, centerShoulder)
    let head = new Joint('head', 0, [-PI_12 * 3, PI_12 * 3], 30)
    Joint.link(centerShoulder, head)
    let leftShoulder = new Joint('left-shoulder', -HALF_PI, [-HALF_PI - PI_12, -HALF_PI + PI_12], 30)
    Joint.link(centerShoulder, leftShoulder)
    let leftElbow = new Joint('left-elbow', -PI_12 * 2, [-PI_12 * 4, PI_12 * 3], 30)
    Joint.link(leftShoulder, leftElbow)
    let leftWrist = new Joint('left-wrist', 0, [-HALF_PI, PI_12], 30)
    Joint.link(leftElbow, leftWrist)
    let leftHand = new Joint('left-hand', 0, [-PI_12, PI_12], 20)
    Joint.link(leftWrist, leftHand)
    let rightShoulder = new Joint('right-shoulder', HALF_PI, [HALF_PI - PI_12, HALF_PI + PI_12], 30)
    Joint.link(centerShoulder, rightShoulder)
    let rightElbow = new Joint('right-elbow', PI_12 * 2, [-PI_12 * 3, PI_12 * 4], 30)
    Joint.link(rightShoulder, rightElbow)
    let rightWrist = new Joint('right-wrist', 0, [-PI_12, HALF_PI], 30)
    Joint.link(rightElbow, rightWrist)
    let rightHand = new Joint('right-hand', 0, [-PI_12, PI_12], 20)
    Joint.link(rightWrist, rightHand)
    let leftHip = new Joint('left-hip', PI - PI_12 * 2, [PI - PI_12 * 3, PI - PI_12], 20)
    Joint.link(hip, leftHip)
    let leftKnee = new Joint('left-knee', -PI_12 * 2, [-PI_12 * 3, PI_12 * 3], 50)
    Joint.link(leftHip, leftKnee)
    let leftAnkle = new Joint('left-ankle', 0, [-PI_12 * 3, PI_12 * 3], 50)
    Joint.link(leftKnee, leftAnkle)
    let leftFoot = new Joint('left-foot', 0, [-PI_12 * 3, PI_12 * 3], 20)
    Joint.link(leftAnkle, leftFoot)
    let rightHip = new Joint('right-hip', PI_12 * 2, [PI_12, PI_12 * 3], 20)
    Joint.link(hip, rightHip)
    let rightKnee = new Joint('right-knee', PI_12 * 2, [-PI_12 * 3, PI_12 * 3], 50)
    Joint.link(rightHip, rightKnee)
    let rightAnkle = new Joint('right-ankle', 0, [-PI_12 * 3, PI_12 * 3], 50)
    Joint.link(rightKnee, rightAnkle)
    let rightFoot = new Joint('right-foot', 0, [-PI_12 * 3, PI_12 * 3], 20)
    Joint.link(rightAnkle, rightFoot)

    this.joints = []
    this.joints.push(hip)
  }
  getEdges () {
    const reducer = (arr, joint) => {
      return arr.concat(joint.getEdges())
    }
    return this.joints.reduce(reducer, [])
  }
  rotate () {
    this.joints.forEach(joint => {
      joint.rotate()
    })
  }
}

export default Skeleton
