<template>
  <div class="menu">
    <el-menu
      :collapse="isCollapse"
      @select="handleSelect"
      >
      <el-button class="menu-topButton" type="text" @click="handleCollapse">
        <i class="el-icon-s-operation"
           :style="{transform: 'rotateZ(' + (isCollapse? '90' : '0') + 'deg) scale(1) skew(0) translateY(5px)'}"></i>
      </el-button>
      <div v-for="(item, index) in menus" :key="item.menuId">
        <el-submenu v-if="item.children" :index="index">
          <template slot="title">
            <i :class=item.icon></i>
            <span slot="title">{{item.menuName}}</span>
          </template>
          <el-menu-item v-for="(childItem, childIndex) in item.children" :index="childIndex" :route="childItem.path">
            <i :class=childItem.icon></i>
            <span slot="title">{{childItem.menuName}}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-if="!item.children" :index="index" :route="item.path">
          <i :class=item.icon></i>
          <span slot="title">{{item.menuName}}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>

</template>
<script type="text/ecmascript-6">

  export default {
    props: {
      menus: Array
    },
    data() {
      return {
        isCollapse: false,
      }
    },
    methods: {
      handleCollapse() {
        this.isCollapse = !this.isCollapse;
        this.$emit('on-collapse', this.isCollapse);
      },
      handleSelect(path, keyPath) {
        let route = {};
        if (keyPath.length === 1) {
          route = this.menus[keyPath[0]];
        } else {
          route = this.menus[keyPath[0]].children[keyPath[1]];
        }
        let tagsOpenList = this.$store.getters.tagsOpenList;
        // this.$store.dispatch('activeRouter', keyPath);
        if (tagsOpenList.findIndex((item) => {
          return item.id === route.menuId
        }) === -1) {
          let tag = {
            id: route.menuId,
            name: route.menuName,
            path: route.menuId,
            closable: true
          }
          this.$store.commit("INCREASE_TAG",tag);
        }
        // debugger
        this.$router.push(route.menuId);
      }
    }
  }
</script>

<style lang="less" scoped>
  .menu {
    &-topButton {
      width: 100%;
    }
  }
  .iconfont {
    font-size: 24px;
  }
</style>