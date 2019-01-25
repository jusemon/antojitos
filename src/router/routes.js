export default [
  {
    path: '/antojitos',
    alias: '/',
    component: () => import('layouts/MyLayout'),
    children: [
      { path: 'list', alias: '', name: 'list_antojitos', component: () => import('pages/antojitos/List') },
      { path: 'create', name: 'create_antojito', component: () => import('pages/antojitos/Create') },
      { path: 'update/:id', name: 'update_antojito', component: () => import('pages/antojitos/Update') }
    ]
  },
  {
    path: '/chat',
    component: () => import('layouts/MyLayout'),
    children: [
      { path: '', name: 'messages', component: () => import('pages/chat/List') }
    ]
  },
  { // Always leave this as last one
    path: '/auth',
    name: 'auth',
    component: () => import('pages/auth/Index')
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/Error404')
  }
]
