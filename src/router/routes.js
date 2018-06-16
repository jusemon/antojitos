export default [
  {
    path: '/antojitos',
    alias: '/',
    component: () => import('layouts/default'),
    children: [
      { path: 'list', alias: '', name: 'list_antojitos', component: () => import('pages/antojitos/list') },
      { path: 'create', name: 'create_antojito', component: () => import('pages/antojitos/create') },
      { path: 'update/:id', name: 'update_antojito', component: () => import('pages/antojitos/update') }
    ]
  },
  {
    path: '/chat',
    component: () => import('layouts/default'),
    children: [
      { path: '', name: 'messages', component: () => import('pages/chat/list') }
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
