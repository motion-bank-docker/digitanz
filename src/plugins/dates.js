export default ({ Vue }) => {
  Vue.prototype.$dates = () => {
    return [
      {
        title: 'Portrait',
        start: '2018-08-17T00:00:00.000+02:00',
        end: '2018-08-17T23:59:59.000+02:00',
        description: 'An unserem ersten Termin beschäftigen wir uns mit Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue.',
        show: true,
        map_title: 'Meine Videos',
        map: undefined,
        entries: []
      },
      {
        title: 'Remix Portrait',
        start: '2018-08-24T00:00:00.000+02:00',
        end: '2018-08-24T23:59:59.000+02:00',
        description: 'An unserem zweiten Termin machen wir daraus Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue.',
        show: false,
        map_title: 'Meine Remixes',
        map: undefined,
        entries: []
      }
    ]
  }
}
