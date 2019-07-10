const acl = {
  namespaced: true,
  state: {
    resources: []
  },
  actions: {
    async set (context, { role, uuid, permissions }) {
      console.debug('set acl', role, uuid, permissions)
    },
    async remove (context, { role, uuid, permission }) {
      console.debug('remove acl', role, uuid, permission)
    },
    async isRoleAllowed (context, { role, uuid, permission }) {
      console.debug('isRoleAllowed', role, uuid, permission)
      return true
    }
  }
}

export default acl
