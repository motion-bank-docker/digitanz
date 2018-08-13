export default ({ Vue }) => {
  Vue.prototype.$dates = () => {
    return [
      {
        title: 'dates.portrait.title',
        start: '2018-08-17T00:00:00.000+02:00',
        end: '2018-08-17T23:59:59.000+02:00',
        description: 'dates.portrait.description',
        show: process.env.FEATURE_UPLOAD || false,
        map_title: 'dates.portrait.map_title',
        map: undefined,
        entries: []
      },
      {
        title: 'dates.remix.title',
        start: '2018-08-24T00:00:00.000+02:00',
        end: '2018-08-24T23:59:59.000+02:00',
        description: 'dates.remix.description',
        show: process.env.FEATURE_SEQUENCER || false,
        map_title: 'dates.remix.map_title',
        map: undefined,
        entries: []
      }
    ]
  }
}
