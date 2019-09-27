<template>
  <el-container class="layout">
    <el-aside :width="asideWidth">
      <Menu :menus="menus"
            @on-collapse="handleCollapse">
      </Menu>
    </el-aside>
    <el-container>
      <el-header height="120px" class="layout-header">
        <el-row>
          <el-col span="24">
            <div class="layout-header-bread">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{path: '/layout'}">
                  <i class="el-icon-s-home"></i>
                  <span>首页</span>
                </el-breadcrumb-item>
                <el-breadcrumb-item v-for="item in breadcrumbList">
                  <i :class="item.icon"></i>
                  <span>{{item.menuName}}</span>
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div class="layout-header-extra">
              <!--<el-avatar :icon="avatarIcon"></el-avatar>-->
              <i class="iconfont icon-avatar-0"></i>
              <el-popover class="layout-header-extra-button"
                          width="100"
                          v-model="visible">
                <p style="text-align: center">确定退出系统吗？</p>
                <div style="text-align: center">
                  <el-button type="primary" size="mini" @click="handleLoginOut">确定</el-button>
                </div>
                <el-button slot="reference" type="info" icon="iconfont icon-out" circle
                           @click="visible = true">
                </el-button>
              </el-popover>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="24">
            <Tags :tags="tagsOpenList"></Tags>
          </el-col>
        </el-row>
      </el-header>
      <el-container class="layout-content">
        <el-main class="layout-content-main">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script type="text/ecmascript-6">
  import Menu from '@/page/layout/menu'
  import Tags from '@/page/layout/tags';

  import {ajax, request} from '@/utils/request.js'

  export default {
    name: 'layout',
    components: {
      Menu,
      Tags
    },
    data() {
      return {
        imageUrl: '',
        asideWidth: '160px',
        breadcrumbList: [],
        visible: false
      }
    },
    watch: {
      '$route'(to) {
        this.$router.push(to.path)
        this.getBreadcrumb();
      }
    },
    computed: {
      menuList() {
        return this.$store.getters.menuList;
      },
      menus() {
        return this.$store.getters.menus;
      },
      tagsList() {
        return this.$store.getters.tagsList;
      },
      tagsOpenList() {
        return this.$store.getters.tagsOpenList;
      },
      activeRouter() {
        return this.$store.getters.activeRouter;
      },
      asideWidth() {
        let width = this.isCollapse ? 60 : 160;
        return {width: `${width}px`, flex: `0 0 ${width}px`};
      },
      avatarIcon() {
        debugger
        // icon-avatar-3
        return `iconfont icon-avatar-${Math.floor(Math.random() * 10)}`;
      }
    },
    methods: {
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      errorHandler() {
        return true
      },
      handleCollapse(isCollapse) {
        this.asideWidth = isCollapse ? '50px' : '160px';
      },
      handleLoginOut() {
        this.$router.replace('/')
      },
      getMenuList() {
        debugger
        // this.$store.dispatch('getMenu');

        request({
          url: '/mock/menu',
          type: 'post',
          data: {
            test: 'test'
          },
          success: (response) => {

            console.log(response);
            debugger
            if (response.flag === 1) {
              let record = response.data;
              if (record) {
                let menus = toTreeData(record, '0', 'pId', 'menuId');
              }
            }
          },
          error: (response) => {
            debugger
            console.log(response)
          }
        })
      },
      getBreadcrumb() {
        let matched = this.$route.matched;
        let arr = [];
        let getMatched = function (menus) {
          let flag = 0;
          for (let i = 0; i < menus.length; i++) {
            if (menus[i].children && menus[i].children.length > 0) {
              if (getMatched(menus[i].children)) {
                if (matched.findIndex((item) => item.name === menus[i].menuName) > -1) {
                  arr.push(menus[i]);
                  flag = 1;
                }
                arr.push(menus[i]);
              }
            }
            if (matched.findIndex((item) => item.name === menus[i].menuName) > -1) {
              arr.push(menus[i]);
              flag = 1;
            }
          }
          return flag;
        }
        getMatched(this.menus);
        arr.sort((a, b) => {
          if (a.menuId < b.menuId) {
            return -1;
          } else if (a.menuId > b.menuId) {
            return 1;
          }
          return 0;
        });
        this.breadcrumbList = arr;
      }
    },
    created() {
      this.getMenuList();
      this.$store.commit('SET_OPEND_LIST', this.$router);
    }
  }
</script>
<style lang="less" scoped>
  @import "../../styles/layout";
</style>

