import Vue from 'vue'
import router from '@/router'
import Cookies from 'js-cookie'
import store from '@/store'

/**
 * 校验会话超时
 * @param data
 * @returns {boolean}
 */
function checkTimeout(data) {
  if (data.flag === '9990') { // timeout
    let timeoutMes = '对不起,会话失效或未登录，请登录执行此操作。';
    Cookies.remove('user');
    Vue.prototype.$uiModal.error({
      title: '会话超时',
      content: timeoutMes,
      closable: false,
      okText: '我知道了',
      onOk: () => {
        let timeout = store.getters.timeout;
        for (let i = 0; i < timeout.length; i++) {
          window.clearInterval(timeout[i])
        }
        store.commit('STORAGE_TIMEOUT', []);
        router.push('/login')
      }
    });
    return false
  }
  return true
}

export default function (ajaxParam) {
  return new Promise((resolve, reject) => {
    let p = {
      url: '/mock' + ajaxParam.url,
      data: JSON.stringify(ajaxParam.data) || JSON.stringify({}),
      async: ajaxParam.async === undefined ? true : ajaxParam.async,
      type: ajaxParam.type ? ajaxParam.type : 'POST',
      contentType: 'application/json; charset=UTF-8',
      dataType: 'json',
      cache: false,
      error: function (jqXHR, textStatus, errorThrown) {
        if (ajaxParam.showLoading !== false) {
          // Vue.prototype.$uiLoading.error();
        }
        reject(jqXHR, textStatus, errorThrown)
      },
      dataFilter: function (data) {
        return data
      },
      success: function (data, textStatus, jqXHR) {
        if (ajaxParam.showLoading !== false) {
          // Vue.prototype.$uiLoading.finish()
        }
        let res = data;
        if (res) { // 判断成功回调是否有数据
          let timeout = checkTimeout(res);
          if (!timeout) return false
        }
        resolve(res)
      }
    };
    $.ajax(p)
  })
}