class SequenceHelper {
  static async renderSequence (context, timeline, targetTimeline = undefined, items = undefined) {
    if (!items) {
      const query = {
        'target.id': `${process.env.TIMELINE_BASE_URI}${timeline.uuid}`
      }
      let results = await context.$store.dispatch('annotations/find', query)
      items = results.items.sort(context.$sort.onRef).map(annotation => {
        return { annotation }
      })
    }
    const detail = {
      title: timeline.title,
      timeline: targetTimeline ? targetTimeline.uuid : undefined,
      uuid: timeline.uuid
    }
    const sequence = {
      uuid: timeline.uuid,
      map: {
        title: timeline.title
      },
      sources: items.map(entry => {
        return entry.annotation
      })
    }
    const job = await context.$store.dispatch('sequences/post', { sequence, detail })
    console.debug('render sequence', job, detail, sequence)
  }
}

export default SequenceHelper
