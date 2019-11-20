import request from '@/utils/request'
import router from '@/router';
import {toTreeData} from "../../utils"

export default {
  state: {
    menus: [], // 菜单
    breadcrumbList: [], // 面包屑列表
    activeRoutes: [], // 通过addroutes添加的路由
    tagsList: [], // 所有页签
    tagsOpenList: [], // 打开的页签
  },
  getters: {
    menuList: (state) => state.menuList,
    menus: (state) => state.menus,
    tagsOpenList: (state) => state.tagsOpenList,
    breadcrumbList: (state) => state.breadcrumbList
  },
  mutations: {
    GET_MENU_LIST(state, menuList) {
      state.menuList = menuList;
    },
    GET_MENU(state, menus) {
      state.menus = menus
      // sessionStorage.setItem("menu",JSON.stringify(menus));
    },
    GET_ROUTE(state) {
      // let pageMaps = {page: {}, router: {}};
      let menus = state.menus;
      let menuGroup = router.options.routes[2];
      let getSubRoute = function (subMenus) {
        for (let j = 0; j < subMenus.length; j++) {
          // pageMaps['router'][subMenus[j].menuId] = subMenus[j];
          if (subMenus[j].menuType === '1') {
            let url = subMenus[j].url;
            if (!url && (!subMenus[j].children || subMenus[j].children.length === 0)) continue;
            let subGroup = {
              path: '/' + subMenus[j].menuId,
              name: subMenus[j].menuName,
              title: subMenus[j].menuName,
              component(resolve) {
                require(['@/page' + url], resolve)
              }
            };
            menuGroup.children.push(subGroup);
          }
          if (subMenus[j].children && subMenus[j].children.length > 0) {
            getSubRoute(subMenus[j].children);
          }
        }
      }
      getSubRoute(menus);
      router.addRoutes([menuGroup]);
      console.log(router)
      // state.pageMenu = pageMaps;
      // state.activeRoutes = state.activeRoutes.concat([menuGroup]);
      sessionStorage.clear();
      sessionStorage.setItem("router",JSON.stringify(menuGroup))
    },
    SET_TAGS_LIST(state) {
      let tagsList = [];
      let fullRoutes = router.options.routes.concat(state.activeRoutes);
      fullRoutes.map((item) => {
        tagsList.push(item)
      });
      state.tagsList.push(...tagsList)
    },
    SET_OPEND_LIST(state) {
      let pages = localStorage.tagsOpenList
      state.tagsOpenList = pages ? JSON.parse(pages) : [{
        id: '/layout',
        name: '首页',
        path: '/layout',
        closable: false
      }]
    },
    INCREASE_TAG(state, tagObj) {
      state.tagsOpenList.splice(1, 0, tagObj)
    },
    DELETE_TAG(state, index) {
      state.tagsOpenList.splice(index, 1);
    },
    DELETE_ALL_TAG(state) {
      if (state.tagsOpenList.length > 1) {
        state.tagsOpenList.splice(1, state.tagsOpenList.length - 1);
      }
    },
    BREAD_CRUMB_LIST(state) {
      state.breadcrumbList = vm.$route.matched.filter(item => item.name)
    }
  },
  actions: {
    getMenu({commit}) {
      request({
        url: '/menu'
      }).then((res) => {
        if (res.flag === 1) {
          let record = res.data;
          if (record) {
            let menus = toTreeData(record, '0', 'pId', 'menuId');
            // commit("GET_MENU_LIST", record);
            commit("GET_MENU", menus);
            commit("GET_ROUTE");
            commit("SET_TAGS_LIST");
          }
        }
      }).catch((res) => {
      })
    },
    breadcrumbList({commit}) {
      commit("BREAD_CRUMB_LIST");
    }
  }
}