import path from 'path'

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
    if (!items.length) {
      await SequenceHelper.deleteSequence(context, timeline.uuid)
      return
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

  static async deleteSequence (context, uuid) {
    /**
     * Delete map
     */
    const map = await context.$store.dispatch('maps/get', uuid)
    try {
      await context.$store.dispatch('maps/delete', map.uuid)
    }
    catch (e) {
      console.error('Failed to remove annotation', e.message)
      context.$captureException(e)
    }

    /**
     * Delete associated annotations
     */
    let result = await context.$store.dispatch('annotations/find', {
      'target.id': `${process.env.TIMELINE_BASE_URI}${map.uuid}`
    })
    for (let annotation of result.items) {
      try {
        await context.$store.dispatch('annotations/delete', annotation.uuid)
      }
      catch (e) {
        console.error('Failed to remove annotation', e.message)
        context.$captureException(e)
      }
    }

    /**
     * Build headers config for direct requests with axios
     */
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
    const mediaFile = `${process.env.ASSETS_BASE_PATH}${map.uuid}.mp4`

    /**
     * Delete associated references
     */
    result = await context.$store.dispatch('annotations/find', { 'body.source.id': mediaFile })
    for (let annotation of result.items) {
      try {
        await context.$store.dispatch('annotations/delete', annotation.uuid)
      }
      catch (e) {
        console.error('Failed to remove annotation', e.message)
        context.$captureException(e)
      }
    }

    /**
     * Remove video previews
     */
    const preview = {
      high: mediaFile.replace(/\.mp4$/, '.jpg'),
      medium: mediaFile.replace(/\.mp4$/, '-m.jpg'),
      small: mediaFile.replace(/\.mp4$/, '-s.jpg')
    }
    const previewKeys = Object.keys(preview)
    for (let key of previewKeys) {
      try {
        await context.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(preview[key])}`, { headers })
      }
      catch (e) {
        console.error('Failed to remove preview', e.message)
        context.$captureException(e)
      }
    }

    /**
     * Remove video file
     */
    try {
      await context.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(mediaFile)}`, { headers })
    }
    catch (e) {
      console.error('Failed to remove video', e.message)
      context.$captureException(e)
    }
  }
}

export default SequenceHelper
