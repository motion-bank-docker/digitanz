const spaceTool = {
  namespaced: true,
  state: {
    shapes: [{
      id: 'diagonal-lines-1',
      elements: [
        {type: 'line', x1: '0', y1: '0', x2: '100', y2: '100'}
      ]
    }, {
      id: 'diagonal-lines-2',
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
    }]
  },
  getters: {
    getShapes: state => state.shapes
  },
  mutations: {
    /*
    handlerTool (state, val) {
    }
    */
  },
  actions: {
  }
}

export default spaceTool
