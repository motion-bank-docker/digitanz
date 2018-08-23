import users from './users'

const routes = [
  users,
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/welcome') },
      { path: 'dashboard', component: () => import('pages/dashboard'), meta: {private: true} },
      { path: 'allrecipes', component: () => import('pages/allRecipes'), meta: {private: true} },
      { path: 'slotmachine', component: () => import('pages/slotMachine'), meta: {private: true} },
      { path: 'sequences', component: () => import('pages/sequences/list'), meta: {private: true} },
      { path: 'sequences/create', component: () => import('pages/sequences/edit'), meta: {private: true} },
      { path: 'sequences/:uuid/edit', component: () => import('pages/sequences/edit'), meta: {private: true} },
      { path: 'responses/:uuid', component: () => import('pages/responses'), meta: {private: true} },
      { path: 'upload', component: () => import('pages/upload'), meta: {private: true} },
      { path: 'portrait', component: () => import('pages/portrait'), meta: {private: true} },
      { path: 'portraitplusplus', component: () => import('pages/portraitplusplus'), meta: {private: true} },
      { path: 'dk', component: () => import('pages/devtestdk'), meta: {private: true} }
    ]
  },
  {
    path: '/newrecipe/:uuid',
    component: () => import('layouts/none'),
    children: [
      { path: '', component: () => import('pages/recipe'), meta: {private: true} }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/404.vue')
  })
}

export default routes
