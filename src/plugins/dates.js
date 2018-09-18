export default ({ Vue }) => {
  Vue.prototype.$dates = () => {
    return [
      {
        id: 'date_1',
        title: 'dates.date_1.title',
        start: '2018-08-17T00:00:00.000+02:00',
        end: '2018-08-23T23:59:59.000+02:00',
        description: 'dates.date_1.description',
        show: process.env.FEATURE_UPLOAD || false,
        map_title: 'dates.date_1.map_title',
        map: undefined,
        entries: [],
        componentName: 'portraits'
      },
      {
        id: 'date_2',
        title: 'dates.date_2.title',
        start: '2018-08-24T00:00:00.000+02:00',
        end: '2018-08-30T23:59:59.000+02:00',
        description: 'dates.date_2.description',
        show: false,
        map_title: 'dates.date_2.map_title',
        map: undefined,
        entries: [],
        componentName: 'portraits-plus-plus'
      },
      {
        id: 'date_3',
        title: 'dates.date_3.title',
        start: '2018-08-31T00:00:00.000+02:00',
        end: '2018-09-20T23:59:59.000+02:00',
        description: 'dates.date_3.description',
        show: process.env.FEATURE_SEQUENCER || false,
        map_title: 'dates.date_3.map_title',
        map: undefined,
        entries: [],
        componentName: 'group-video-sequences',
        path: 'groupsequences'
      },
      {
        id: 'date_4',
        title: 'dates.date_4.title',
        start: '2018-09-07T00:00:00.000+02:00',
        end: '2018-09-13T23:59:59.000+02:00',
        description: 'dates.date_4.description',
        show: process.env.FEATURE_XXX_UNDEFINED_NEEDS_NAME || false,
        map_title: 'dates.date_4.map_title',
        map: undefined,
        entries: [],
        componentName: 'default'
      },
      {
        id: 'date_5',
        title: 'dates.date_5.title',
        start: '2018-09-14T00:00:00.000+02:00',
        end: '2018-09-20T23:59:59.000+02:00',
        description: 'dates.date_5.description',
        show: process.env.FEATURE_XXX_UNDEFINED_NEEDS_NAME || false,
        map_title: 'dates.date_5.map_title',
        map: undefined,
        entries: [],
        componentName: 'default'
      },
      {
        id: 'date_6',
        title: 'dates.date_6.title',
        start: '2018-09-21T00:00:00.000+02:00',
        end: '2018-09-27T23:59:59.000+02:00',
        description: 'dates.date_6.description',
        show: process.env.FEATURE_XXX_UNDEFINED_NEEDS_NAME || false,
        map_title: 'dates.date_6.map_title',
        map: undefined,
        entries: [],
        componentName: 'default'
      },
      {
        id: 'date_7',
        title: 'dates.date_7.title',
        start: '2018-09-28T00:00:00.000+02:00',
        end: '2018-10-18T23:59:59.000+02:00',
        description: 'dates.date_7.description',
        show: process.env.FEATURE_XXX_UNDEFINED_NEEDS_NAME || false,
        map_title: 'dates.date_7.map_title',
        map: undefined,
        entries: [],
        componentName: 'default'
      },
      {
        id: 'date_8',
        title: 'dates.date_8.title',
        start: '2018-10-19T00:00:00.000+02:00',
        end: '2018-10-25T23:59:59.000+02:00',
        description: 'dates.date_8.description',
        show: process.env.FEATURE_XXX_UNDEFINED_NEEDS_NAME || false,
        map_title: 'dates.date_8.map_title',
        map: undefined,
        entries: [],
        componentName: 'default'
      },
      {
        id: 'date_9',
        title: 'dates.date_9.title',
        start: '2018-10-26T00:00:00.000+02:00',
        end: '2018-11-08T23:59:59.000+02:00',
        description: 'dates.date_9.description',
        show: process.env.FEATURE_XXX_UNDEFINED_NEEDS_NAME || false,
        map_title: 'dates.date_9.map_title',
        map: undefined,
        entries: [],
        componentName: 'default'
      },
      {
        id: 'date_10',
        title: 'dates.date_10.title',
        start: '2018-11-09T00:00:00.000+02:00',
        end: '2018-11-15T23:59:59.000+02:00',
        description: 'dates.date_10.description',
        show: process.env.FEATURE_XXX_UNDEFINED_NEEDS_NAME || false,
        map_title: 'dates.date_10.map_title',
        map: undefined,
        entries: [],
        componentName: 'default'
      },
      {
        id: 'date_11',
        title: 'dates.date_11.title',
        start: '2018-11-16T00:00:00.000+02:00',
        end: '2018-11-22T23:59:59.000+02:00',
        description: 'dates.date_11.description',
        show: process.env.FEATURE_XXX_UNDEFINED_NEEDS_NAME || false,
        map_title: 'dates.date_11.map_title',
        map: undefined,
        entries: [],
        componentName: 'default'
      },
      {
        id: 'date_12',
        title: 'dates.date_12.title',
        start: '2018-11-23T00:00:00.000+02:00',
        end: '2018-11-29T23:59:59.000+02:00',
        description: 'dates.date_12.description',
        show: process.env.FEATURE_XXX_UNDEFINED_NEEDS_NAME || false,
        map_title: 'dates.date_12.map_title',
        map: undefined,
        entries: [],
        componentName: 'default'
      },
      {
        id: 'date_13',
        title: 'dates.date_13.title',
        start: '2018-11-30T00:00:00.000+02:00',
        end: '2018-12-06T23:59:59.000+02:00',
        description: 'dates.date_13.description',
        show: process.env.FEATURE_XXX_UNDEFINED_NEEDS_NAME || false,
        map_title: 'dates.date_13.map_title',
        map: undefined,
        entries: [],
        componentName: 'default'
      },
      {
        id: 'date_14',
        title: 'dates.date_14.title',
        start: '2018-12-07T00:00:00.000+02:00',
        end: '2018-12-14T23:59:59.000+02:00',
        description: 'dates.date_14.description',
        show: process.env.FEATURE_XXX_UNDEFINED_NEEDS_NAME || false,
        map_title: 'dates.date_14.map_title',
        map: undefined,
        entries: [],
        componentName: 'default'
      }
    ]
  }
}
