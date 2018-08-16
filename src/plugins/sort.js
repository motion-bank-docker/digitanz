import { DateTime } from 'luxon'

class Sort {
  static onCreatedDesc (a, b) {
    return Sort.onCreated(a, b, -1)
  }
  static onCreated (a, b, mod = 1) {
    const
      dateA = DateTime.fromISO(a.created),
      dateB = DateTime.fromISO(b.created)
    if (dateA > dateB) return 1 * mod
    else if (dateA < dateB) return -1 * mod
    return 0
  }
}

export default ({ Vue }) => {
  Vue.prototype.$sort = Sort
}
