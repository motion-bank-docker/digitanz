const spaceTool = {
  namespaced: true,
  state: {
    shapes: [{
      id: '#diagonal-lines-1',
      elements: [
        {type: 'line', x1: '0', y1: '0', x2: '100', y2: '100'}
      ]
    }, {
      id: '#diagonal-lines-2',
      elements: [
        {type: 'line', x1: '0', y1: '0', x2: '100', y2: '100'},
        {type: 'line', x1: '100', y1: '0', x2: '0', y2: '100'}
      ]
    }, {
      id: '#two-triangles-1',
      elements: [
        {type: 'polygon', points: '0,0 100,0 50,50'},
        {type: 'polygon', points: '0,100 100,100 50,50'}
      ]
    }, {
      id: '#two-triangles-2',
      elements: [
        {type: 'polygon', points: '0,0 0,100 50,50'},
        {type: 'polygon', points: '100,0 100,100 50,50'}
      ]
    }, {
      id: '#two-triangles-3',
      elements: [
        {type: 'polygon', points: '0,0 100,0 100,100'}
      ]
    }, {
      id: '#rect-1',
      elements: [
        {type: 'rect', x: '0', y: '0', width: '100', height: '100'}
      ]
    }, {
      id: '#ellipses-1',
      elements: [
        {type: 'ellipse', cx: '50', cy: '50', rx: '50', ry: '50'}
      ]
    }, {
      id: '#ellipses-2',
      elements: [
        {type: 'ellipse', cx: '50', cy: '50', rx: '40', ry: '40'}
      ]
    }, {
      id: '#ellipses-3',
      elements: [
        {type: 'ellipse', cx: '50', cy: '50', rx: '25', ry: '25'}
      ]
    }, {
      id: '#ellipses-4',
      elements: [
        {type: 'ellipse', cx: '30', cy: '30', rx: '12', ry: '12'},
        {type: 'ellipse', cx: '60', cy: '60', rx: '25', ry: '25'}
      ]
    }, {
      id: '#traingle-4',
      elements: [
        {type: 'polygon', points: '53,100 3,25 93,25'}
      ]
    }],
    selectedShapes: []
  },
  getters: {
    getShapes: state => state.shapes,
    getSelectedShapes: state => state.selectedShapes
  },
  mutations: {
    setSelectedShapes (state, val) {
      console.log(state, val, this.selectedShapes)
      state.selectedShapes = val
    }
  },
  actions: {
  }
}

export default spaceTool
