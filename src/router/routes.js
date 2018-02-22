export default [
  {
    path: '/antojitos',
    alias: '/',
    name: 'antojitos',
    component: () => import('layouts/default'),
    children: [
      { path: 'list', alias: '', name: 'list_antojitos', component: () => import('pages/antojitos/list') },
      { path: 'create', name: 'create_antojito', component: () => import('pages/antojitos/create') },
      { path: 'update:id', name: 'update_antojito', component: () => import('pages/antojitos/update') }
    ]
  },
  { // Always leave this as last one
    path: '/auth',
    name: 'auth',
    component: () => import('pages/auth/index')
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
