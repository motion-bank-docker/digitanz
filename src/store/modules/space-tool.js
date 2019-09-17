const spaceTool = {
  namespaced: true,
  state: {
    shapes: [{
      id: 'diagonal-lines-1',
      elements: [
        {type: 'line', x1: '1', y1: '1', x2: '99', y2: '99'}
      ]
    }, {
      id: 'diagonal-lines-2',
      elements: [
        {type: 'line', x1: '1', y1: '1', x2: '98', y2: '98'},
        {type: 'line', x1: '98', y1: '1', x2: '1', y2: '98'}
      ]
    }, {
      id: 'two-triangles-1',
      elements: [
        {type: 'polygon', points: '1,1 98,1 50,50'},
        {type: 'polygon', points: '1,98 98,98 50,50'}
      ]
    }, {
      id: 'two-triangles-2',
      elements: [
        {type: 'polygon', points: '1,1 1,98 49,49'},
        {type: 'polygon', points: '98,1 98,98 49,49'}
      ]
    }, {
      id: 'two-triangles-3',
      elements: [
        {type: 'polygon', points: '1,1 98,1 98,98'}
      ]
    }, {
      id: 'rect-1',
      elements: [
        {type: 'rect', x: '1', y: '1', width: '98', height: '98'}
      ]
    }, {
      id: 'ellipses-1',
      elements: [
        {type: 'ellipse', cx: '50', cy: '50', rx: '49', ry: '49'}
      ]
    }, {
      id: 'ellipses-2',
      elements: [
        {type: 'ellipse', cx: '50', cy: '50', rx: '40', ry: '40'}
      ]
    }, {
      id: 'ellipses-3',
      elements: [
        {type: 'ellipse', cx: '50', cy: '50', rx: '25', ry: '25'}
      ]
    }, {
      id: 'ellipses-4',
      elements: [
        {type: 'ellipse', cx: '30', cy: '30', rx: '12', ry: '12'},
        {type: 'ellipse', cx: '60', cy: '60', rx: '25', ry: '25'}
      ]
    }, {
      id: 'triangle-1',
      elements: [
        {type: 'polygon', points: '53,100 3,25 93,25'}
      ]
    }],
    currentShapes: [],
    tempSpaces: [],
    spaceIndex: undefined
  },
  getters: {
    getShapes: state => state.shapes,
    getCurrentShapes: state => state.currentShapes,
    getTempSpaces: state => state.tempSpaces,
    getSpaceIndex: state => state.spaceIndex
  },
  mutations: {
    setCurrentShapes (state, val) {
      state.currentShapes = val
    },
    setTempSpaces (state, val) {
      state.tempSpaces.push(val)
    },
    setSpaceIndex (state, val) {
      state.spaceIndex = val
    }
  },
  actions: {
  }
}

export default spaceTool
