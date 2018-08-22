import path from 'path'
import { Assert } from 'mbjs-utils'

class VideoHelper {
  static async fetchVideoItems (context, query) {
    Assert.isInstance(context, 'VueComponent', 'fetchVideoItems context')
    const results = await context.$store.dispatch('annotations/find', query)
    const items = results.items.sort(context.$sort.onCreatedDesc)
    const videos = []
    for (let annotation of items) {
      let metadata = {}
      try {
        metadata = await context.$store.dispatch('metadata/get', annotation.uuid)
      }
      catch (e) { console.error(`Failed to fetch metadata: ${e.message}`) }
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
    Assert.isInstance(context, 'VueComponent', 'deleteVideoItem context')

    const headers = {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
    try {
      await context.$store.dispatch('annotations/delete', item.annotation.uuid)
    }
    catch (e) { console.error('Failed to remove annotation', e.message) }
    const previewKeys = Object.keys(item.preview)
    for (let key of previewKeys) {
      try {
        await context.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(item.preview[key])}`, { headers })
      }
      catch (e) { console.error('Failed to remove preview', e.message) }
    }
    try {
      await context.$axios.delete(`${process.env.TRANSCODER_HOST}/uploads/${path.basename(item.annotation.body.source.id)}`, { headers })
    }
    catch (e) { console.error('Failed to remove video', e.message) }
    const message = {
      annotation: item.annotation.uuid,
      source: item.annotation.body.source.id,
      user: context.$store.state.user.uuid
    }
    await context.$store.dispatch('logging/log', { action: 'delete', message })
  }
}

export default VideoHelper
