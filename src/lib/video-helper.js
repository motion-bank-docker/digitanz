import path from 'path'
import parseURI from 'mbjs-data-models/src/lib/parse-uri'
// import { Assert } from 'mbjs-utils'
import { SequenceHelper } from './index'

class VideoHelper {
  static async fetchVideoItems (context, query, sortFunc = undefined) {
    // Assert.isInstance(context, 'VueComponent', 'fetchVideoItems context')

    /** Fetch query results (annotations) */
    const results = await context.$store.dispatch('annotations/find', query)

    /** Sort on descending creation date */
    const items = results.items.sort(sortFunc || context.$sort.onCreatedDesc)

    /**
     * Build the list of video items
     */
    const videos = []
    for (let annotation of items) {
      let metadata = {}
      try {
        metadata = await context.$store.dispatch('metadata/get', annotation.uuid)
      }
      catch (e) {
        console.error(`Failed to fetch metadata: ${e.message}`)
        context.$captureException(e)
      }
      const preview = {
        high: annotation.body.source.id.replace(/\.mp4$/, '.jpg'),
        medium: annotation.body.source.id.replace(/\.mp4$/, '-m.jpg'),
        small: annotation.body.source.id.replace(/\.mp4$/, '-s.jpg')
      }
      console.debug('fetched metadata', metadata)
      videos.push({annotation, metadata, preview})
    }
    return videos
  }

  static async deleteVideoItem (context, item) {
    // Assert.isInstance(context, 'VueComponent', 'deleteVideoItem context')

    let sequences = []

    /**
     * Remove annotations referencing this video
     */
    const results = await context.$store.dispatch('annotations/find', { 'body.source.id': item.annotation.body.source.id })
    for (let annotation of results.items) {
      if (annotation.target.type === 'Timeline') {
        const prefix = 'Sequenz: '
        const parsed = parseURI(annotation.target.id)
        const map = await context.$store.dispatch('maps/get', parsed.uuid)
        if (map.title.indexOf(prefix) === 0) {
          let exists = false
          for (let sequence of sequences) {
            if (sequence.uuid === map.uuid) exists = true
          }
          if (!exists) sequences.push(map)
        }
      }
      try {
        await context.$store.dispatch('annotations/delete', annotation.uuid)
      }
      catch (e) {
        console.error('Failed to remove annotation', e.message)
        context.$captureException(e)
      }
    }

    /**
     * Re-render affected sequences
     */
    for (let sequence of sequences) {
      await SequenceHelper.renderSequence(context, sequence)
    }

    /**
     * Build headers config for direct requests with axios
     */
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }

    /**
     * Remove video previews
     */
    const previewKeys = Object.keys(item.preview)
    for (let key of previewKeys) {
      try {
        await context.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(item.preview[key])}`, { headers })
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
      await context.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(item.annotation.body.source.id)}`, { headers })
    }
    catch (e) {
      console.error('Failed to remove video', e.message)
      context.$captureException(e)
    }

    /**
     * Log delete action
     */
    const message = {
      annotation: item.annotation.uuid,
      source: item.annotation.body.source.id,
      user: context.$store.state.auth.user.uuid
    }
    await context.$store.dispatch('logging/log', { action: 'delete', message })
  }
}

export default VideoHelper
