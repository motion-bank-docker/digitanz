import axios from 'axios'

const metadata = {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async get (context, payload) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
      let metadataURL
      if (typeof annotation === 'string') metadataURL = `${process.env.TRANSCODER_HOST}/metadata/${payload}`
      else {
        try {
          metadataURL = `${process.env.TRANSCODER_HOST}/metadata/url?url=${encodeURIComponent(payload.body.source.id)}`
        }
        catch (e) { /* ignored */ }
      }
      let result
      if (metadataURL) {
        result = await axios.get(metadataURL, {headers})
      }
      const metadata = result ? result.data : {}
      // console.debug('metadata', metadata)
      return metadata
    }
  }
}

export default metadata
