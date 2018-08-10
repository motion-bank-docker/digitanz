import { ObjectUtil } from 'mbjs-utils'

const getID = function () {
  if (localStorage.digitanzID) return localStorage.digitanzID
  localStorage.setItem('digitanzID', ObjectUtil.uuid4())
  return localStorage.digitanzID
}

export default ({ Vue }) => {
  Vue.prototype.$localID = getID
}
