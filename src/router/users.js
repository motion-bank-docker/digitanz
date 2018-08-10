export default {
  path: '/users',
  component: () => import('layouts/default'),
  children: [
    {
      path: 'callback',
      name: 'users.callback',
      component: () => import('pages/users/callback')
    },
    {
      path: 'firstlogin',
      name: 'users.firstlogin',
      component: () => import('pages/users/auth0-action')
    },
    {
      path: 'resetpass',
      name: 'users.resetpass',
      component: () => import('pages/users/auth0-action')
    },
    {
      path: 'create',
      name: 'users.create',
      component: () => import('pages/users/create')
    },
    {
      path: 'forgot',
      name: 'users.forgot',
      component: () => import('pages/users/forgot')
    },
    {
      path: 'login',
      name: 'users.login',
      component: () => import('pages/users/login')
    },
    {
      path: 'manage',
      name: 'users.manage',
      component: () => import('pages/users/manage'),
      meta: {private: true}
    }
  ]
}
