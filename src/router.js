import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    {
      component: load('Index'),
      path: '/antojitos',
      alias: '/',
      name: 'antojitos',
      children: [
        {
          path: 'list',
          alias: '',
          component: load('antojitos/List'),
          name: 'list_antojitos'
        },
        {
          path: 'create',
          component: load('antojitos/Create'),
          name: 'create_antojito'
        },
        {
          path: 'update/:id',
          component: load('antojitos/Update'),
          name: 'update_antojito'
        },
        {
          path: 'delete/:id',
          component: load('antojitos/Delete'),
          name: 'delete_antojito'
        }
      ]
    },
    { path: '/auth', component: load('auth/Index'), name: 'auth' },
    // Always leave this last one
    { path: '*', component: load('Error404') } // Not found
  ]
})
