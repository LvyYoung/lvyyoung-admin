import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './assets/iconfont/iconfont.css';

// router.beforeEach((to, from, next) => {
//   NProgress.start()
//   next()
// })
//
// router.afterEach(() => {
//   NProgress.done()
// })
Vue.use(ElementUI)


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created() {
    // debugger
    // if (sessionStorage.getItem("router")) {
    //   var _router = Object.assign({}, router, JSON.parse(sessionStorage.getItem("router")))
    //   router.addRoutes([_router]);
    // }
  }
})