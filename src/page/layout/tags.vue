<template>
  <div class="tags">
    <el-tag
      class="tags-tag" hit
      v-for="(tag, index) in tags"
      :key="index"
      disable-transitions
      :closable="tag.closable"
      @click="clickTag(tag.id)"
      @close="closeTag(index)">
      {{tag.name}}
    </el-tag>
    <i class="el-icon-close" @click="closeAllTag"></i>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data() {
      return {}
    },
    props: {
      tags: Array
    },
    methods: {
      clickTag(path) {
        this.$router.push(path);
      },
      closeTag(index) {
        this.$store.commit("DELETE_TAG", index);
        this.$router.push('/layout');
      },
      closeAllTag() {
        this.$store.commit("DELETE_ALL_TAG");
        this.$router.push('/layout');
      }
    }
  }
</script>
<style lang="less" scoped>
  .tags {
    background: #d3dce6;
    padding: 5px;
    &-tag {
      margin-right: 5px;
    }
  }
</style>