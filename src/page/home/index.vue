<template>
  <div>
    <!--<h2>我这里是首页</h2>-->
    <!--<Markdown></Markdown>-->
    <Canvas></Canvas>
  </div>
</template>

<script>
  import Markdown from '@/page/editor/markdown';
  import Canvas from '@/page/demo/canvas';
  export default {
    name: 'main',
    components: {
      Markdown,
      Canvas
    }
  }
</script>