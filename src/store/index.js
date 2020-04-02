import Vue from 'vue'
import Vuex from 'vuex'

// import user from './user'
// import app from './app'
import menu from './modules/menu'
import request from './modules/request'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    count: (state => state.count + 1)
  },
  mutations: {
    add(state, n) {
      state.count += n;
    },
    red(state) {
      state.count -= 1;
    }
  },
  actions: {
    addFun(commit, n) {
      commit.commit("add", n)
    },
    redFun(commit) {
      commit.commit("fun")
    }
    //
  },
  modules: {
    // user,
    // app,
    menu,
    request
  }
})