import Vue from 'vue'
import request from '@/utils/request'
import store from '@/store'

/**
 * 检查返回是否合法
 * @param data
 * @returns {boolean}
 * @private
 */
function checkRespon(data) {
  let flag = data.flag;
  let prompt = data.prompt;
  prompt = prompt.replace(/</g, '&lt;');
  prompt = prompt.replace(/>/g, '&gt;');

  let modalCfg = {
    title: '错误信息',
    okText: '我知道了',
    content: '<span STYLE="word-wrap: break-word;">' + prompt + '</span>'
  };
  if (flag !== 1) {
    setTimeout(() => {
      Vue.prototype.$uiModal.error(modalCfg)
    }, 500);
    return false
  }

  let returnFlag = true;
  if (data.response && data.response[0]) {
    for (let i = 0; i < data.response.length; i++) {
      flag = data.response[i].result.flag;
      prompt = data.response[i].result.prompt.trim();
      if (flag !== 1) {
        setTimeout(() => {
          Vue.prototype.$uiModal.error(modalCfg)
        }, 200);
        returnFlag = false
      }
    }
  } else {
    setTimeout(() => {
      Vue.prototype.$uiModal.error(modalCfg)
    }, 200);
    returnFlag = false
  }
  return returnFlag
}

export default {
  state: {
    jsonData: {},
    showLoading: false
  },
  mutations: {
    AJAX(state, jsonData) {
      state.jsonData = jsonData
    },
    CLEAR_JSONDATA(state) {
      state.jsonData = {}
    },
    SHOW_LOADING(state) {
      state.showLoading = true;
    },
    HIDE_LOADING(state) {
      state.showLoading = false;
    }
  },
  actions: {
    /*
     * 用户登录
     * @param commit
     * @param reqParam{data:{},success:function(){},exception: function() {}}
     * */
    login({commit}, reqParam) {
      debugger
      return request({
        url: '/login', // 请求地址
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: reqParam.data // 提交数据
      }).then((res) => {
        commit('AJAX', res);
        reqParam.success(res)
        // if (!checkRespon(res)) {
        //   if (typeof reqParam['error'] === 'function') reqParam.error(res)
        // } else {
        //   if (typeof reqParam['success'] === 'function') reqParam.success(res)
        // }
      }).catch((res) => {
        if (typeof reqParam['exception'] === 'function') reqParam.exception(res)
      })
    },

    /*
     * 用户注销
     * @param commit
     * @param reqParam{data:{},success:function(){},exception: function() {}}
     * */
    logout() {
      let timeout = store.getters.timeout
      for (let i = 0; i < timeout.length; i++) {
        window.clearInterval(timeout[i])
      }
      store.commit('STORAGE_TIMEOUT', [])
      return request({
        url: '/menu',
        type: 'POST',
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    },


    /**
     * 数据请求状态管理器
     * @param commit
     * @param reqParam {url:'',data:[{obj_code: '', param: {}, async: boolean}],success: function() {}, exception: function() {}}
     */
    ajax({commit}, reqParam) {
      request({
        url: reqParam.url,
        data: reqParam.data
      }).then((res) => {
        debugger
        commit('HIDE_LOADING');
        commit('AJAX', res);
        if (reqParam.url && reqParam.url !== '') {
          if (typeof reqParam['success'] === 'function') reqParam.success(res);
          return false;
        }
        let retObj = res.response[0];
        if (!checkRespon(res)) {
          if (typeof reqParam['error'] === 'function') reqParam.error(retObj.result)
        } else {
          if (typeof reqParam['success'] === 'function') reqParam.success(retObj.record, retObj.result)
        }
      }).catch((res) => {
        commit('HIDE_LOADING');
        if (typeof reqParam['exception'] === 'function') reqParam.exception(res)
      })
    }
  },
  getters: {
    jsonData: (state) => state.jsonData,
  }
}