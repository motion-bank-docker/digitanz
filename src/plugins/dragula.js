import { Vue2Dragula } from 'vue2-dragula'
import 'dragula/dist/dragula.css'

export default ({ Vue }) => {
  Vue.use(Vue2Dragula, {
    logging: {
      service: true // to only log methods in service (DragulaService)
    }
  })
}
