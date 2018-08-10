import axios from 'axios'

let params = null

const getParams = async function () {
  if (!params) {
    try {
      const response = await axios.get(process.env.PARAM_HOST)
      params = response.data
      return params
    }
    catch (e) {
      console.error('Params error', e.message)
    }
    return {}
  }
  else return params
}

export {
  getParams
}

export default ({ Vue }) => {
  Vue.prototype.$params = getParams
}
