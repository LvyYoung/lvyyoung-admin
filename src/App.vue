<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    created () {
      // if (sessionStorage.getItem("store") ) {   //页面加载前读取sessionStorage里的状态信息
      //   this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
      // }

      // window.addEventListener("beforeunload",()=>{   //在页面刷新前将vuex里的信息保存到sessionStorage里
      //   debugger
      //   var _router = Object.assign({}, this.$router, JSON.parse(sessionStorage.getItem("router")))
      //   this.$router.addRoutes([_router]);
      // })
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  #app {
    width: 100%;
    height: 100%;
    position: absolute;
  }
</style>
