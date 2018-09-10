/* global Primus */

import TinyEmitter from 'tiny-emitter'

class NetworkClock extends TinyEmitter {
  constructor (url = 'http://clock.digitanz.de', options = {}) {
    super()

    const _this = this
    this._primus = Primus.connect(url, options)
    this._start = undefined
    this._remote = undefined
    this._internal = undefined
    this._offset = 0
    this._primus.on('data', data => {
      // console.log('Received a clock message', data)
      // _this.emit('clock', data)
      if (data.us) {
        _this._internal = Date.now()
        if (!_this._start) _this._start = _this._internal
        _this._remote = Math.round(data.us * 0.001)
        _this._offset = _this._internal - _this._remote
      }
      else if (data.type === 'broadcast') {
        this.emit('broadcast', data.payload)
      }
    })
  }

  getTime () {
    // if (!this._offset) return -1
    return Date.now() + this._offset
  }

  getOffset () {
    return this._offset
  }

  broadcast (payload) {
    const data = { payload: payload, type: 'broadcast' }
    this._primus.write(data)
  }
}

export default NetworkClock
