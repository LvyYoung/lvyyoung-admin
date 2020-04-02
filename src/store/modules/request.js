import request from '@/utils/request'

export default {
  state: {
    jsonData: {},
    showLoading: false
  },
  mutations: {
    AJAX(state, jsonData) {
      state.jsonData = jsonData
    }
  },
  actions: {
    /*
     * 用户登录
     * */
    login({commit}, reqParam) {
      debugger
      return request({
        url: '/login', // 请求地址
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: reqParam.data // 提交数据
      }).then((res) => {
        debugger
        commit('AJAX', res);
        reqParam.success(res)
      }).catch((res) => {
        if (typeof reqParam['exception'] === 'function') reqParam.exception(res)
      })
    },


    /**
     * ajax请求
     */
    ajax({commit}, reqParam) {
      request({
        url: reqParam.url,
        data: reqParam.data
      }).then((res) => {
        commit('AJAX', res);
        if (reqParam.url && reqParam.url !== '') {
          if (typeof reqParam['success'] === 'function') reqParam.success(res);
        }
        let retObj = res.response[0];
        if (typeof reqParam['success'] === 'function') reqParam.success(retObj.record, retObj.result)
      }).catch((res) => {
        if (typeof reqParam['exception'] === 'function') reqParam.exception(res)
      })
    }
  },
  getters: {
    jsonData: (state) => state.jsonData,
  }
}