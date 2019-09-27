import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/login'
import Layout from '@/page/layout'
import Home from '@/page/home'
import NotFound from '@/page/notFound'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/layout',
      name: 'Layout',
      component: Layout,
      children: [{
        path: '/',
        name: 'Home',
        component: Home
      }]
    },
    {
      path: '/page',
      name: 'page',
      redirect: '/home',
      component(resolve) {
        require(['@/page/layout'], resolve)
      },
      children: []
    },
    // {path: '*', name: '404', component: NotFound}
  ]
});

router.beforeEach((to, from, next) => {
  // 如果未匹配到路由
  if (to.matched.length === 0) {
    // 跳转至登陆页面
    next('/layout')
  } else {
    try {
      next()
      /*!// 判断cookie是否未登录，未记录则拦截，跳转至登陆页面
      if (!Cookies.get('user')) {
        // 前往的页面是不是登录页，不是则跳转到登录页
        if (to.name !== 'login') {
          next('/login')
        } else {
          next()
        }
      } else {
        if (to.name === 'login') {
          next('/home')
        } else {
          next()
        }
      }*/
    } catch (e) {
      next()
    }
  }
});

export default router

