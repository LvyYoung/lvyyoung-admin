<template>
  <div class="main" ref="main">
    <div class="toolbar" v-show="visible.toolBar">
      <span class="item" v-for="(item, index) in toolbarData"
            :key="index">
        <el-button class="item-button"
                   @click="handleContent(index)">
          <i :class=item.icon></i><br/>
          <span>{{item.text}}</span>
        </el-button>
      </span>
      <span class="item floatR">
        <el-button class="item-button" @click="openHelp">
          <i class="el-icon-question"></i><br/>
          帮助
        </el-button>
      </span>
    </div>
    <div class="center" :style="centerStyle">
      <div class="center-left floatL" :style="leftStyle" v-show="visible.pagingLeft">
        <el-input
          type="textarea"
          v-model="text"
          placeholder="请输入文本">
        </el-input>
      </div>
      <div class="center-mid floatL">
        <i :class="midIcon.toolBar" @click="handleMidBar(0)"></i>
        <i :class="midIcon.paging" @click="handleMidBar(1)"></i>
        <i :class="midIcon.preview" @click="handleMidBar(2)"></i>
      </div>
      <div class="center-right floatL" v-show="visible.pagingRight"
           :style="rightStyle" v-html="html">
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import showdown from 'showdown'

  export default {
    data() {
      return {
        html: '',
        text: '',
        converter: {},
        toolbarData: [
          {icon: 'iconfont icon-bold', text: '粗体'},
          {icon: 'iconfont icon-italic', text: '斜体'},
          {icon: 'iconfont icon-head', text: '标题'},
          {icon: 'iconfont icon-delete-line', text: '删除线'},
          {icon: 'iconfont icon-picture', text: '图片'},
          {icon: 'iconfont icon-code-block', text: '代码块'},
          {icon: 'iconfont icon-ordered-list', text: '有序'},
          {icon: 'iconfont icon-unordered-list', text: '无序'},
          {icon: 'iconfont icon-todo-list', text: '待办'},
          {icon: 'iconfont icon-table', text: '表格'},
          {icon: 'iconfont icon-link', text: '超链接'},
          {icon: 'iconfont icon-quote', text: '引用'}
        ],
        visible: {
          toolBar: true,
          pagingLeft: true,
          pagingRight: true,
        },
        midIcon: {
          toolBar: 'iconfont icon-up',
          paging: 'iconfont icon-paging-right',
          preview: 'iconfont icon-preview'
        },
        pageWidth: 0
      }
    },
    components: {
      showdown
    },
    watch: {
      text(newVal) {
        this.html = this.converter.makeHtml(newVal);
      }
    },
    computed: {
      centerStyle() {
        let height = this.visible.toolBar ? '700' : '756';
        return {
          height: `${height}px`
        }
      },
      leftStyle() {
        let sideWidth = this.pageWidth - 32;
        let width = this.visible.pagingRight ? sideWidth/2 : sideWidth;
        return {
          width: `${width}px`
        }
      },
      rightStyle() {
        let sideWidth = this.pageWidth - 32;
        let width = this.visible.pagingLeft ? sideWidth/2 : sideWidth;
        return {
          width: `${width}px`
        }
      }
    },
    methods: {
      openHelp() {
        this.$notify({
          title: '帮助',
          dangerouslyUseHTMLString: true,
          duration: 0,
          offset: 110,
          message: '<pre class="markdown-highlighting"><span class="token h2 alt"><span class="token p">快捷键</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token p">撤销：Ctrl/Command + Z</span>\n' +
            '<span class="token p">重做：Ctrl/Command + Y</span>\n' +
            '<span class="token p">加粗：Ctrl/Command + B</span>\n' +
            '<span class="token p">斜体：Ctrl/Command + I</span>\n' +
            '<span class="token p">标题：Ctrl/Command + Shift + H</span>\n' +
            '<span class="token p">无序列表：Ctrl/Command + Shift + U</span>\n' +
            '<span class="token p">有序列表：Ctrl/Command + Shift + O</span>\n' +
            '<span class="token p">检查列表：Ctrl/Command + Shift + C</span>\n' +
            '<span class="token p">插入代码：Ctrl/Command + Shift + K</span>\n' +
            '<span class="token p">插入链接：Ctrl/Command + Shift + L</span>\n' +
            '<span class="token p">插入图片：Ctrl/Command + Shift + G</span>\n' +
            '<span class="token p">查找：Command + F</span>\n' +
            '<span class="token p">替换：Command + G</span>\n' +
            '\n' +
            '<span class="token h2 alt"><span class="token p">标题</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token h1"><span class="token cl cl-hash">#</span><span class="token p"> 1级标题</span></span>\n' +
            '<span class="token h2"><span class="token cl cl-hash">##</span><span class="token p"> 2级标题</span></span>\n' +
            '<span class="token h3"><span class="token cl cl-hash">###</span><span class="token p"> 3级标题</span></span>\n' +
            '<span class="token h4"><span class="token cl cl-hash">####</span><span class="token p"> 四级标题 </span></span>\n' +
            '<span class="token h5"><span class="token cl cl-hash">#####</span><span class="token p"> 五级标题  </span></span>\n' +
            '<span class="token h6"><span class="token cl cl-hash">######</span><span class="token p"> 六级标题</span></span>\n' +
            '\n' +
            '<span class="token h2 alt"><span class="token p">文本样式</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token em"><span class="token cl cl-em cl-start">*</span>强调文本<span class="token cl cl-em cl-close">*</span></span><span class="token p"> </span><span class="token em"><span class="token cl cl-em cl-start">_</span>强调文本<span class="token cl cl-em cl-close">_</span></span>\n' +
            '\n' +
            '<span class="token strong"><span class="token cl cl-strong cl-start">**</span>加粗文本<span class="token cl cl-strong cl-close">**</span></span><span class="token p"> </span><span class="token strong"><span class="token cl cl-strong cl-start">__</span>加粗文本<span class="token cl cl-strong cl-close">__</span></span>\n' +
            '\n' +
            '<span class="token mark"><span class="token cl">==</span><span class="token cl-mark-text">标记文本</span><span class="token cl">==</span></span>\n' +
            '\n' +
            '<span class="token del"><span class="token cl">~~</span><span class="token cl-del-text">删除文本</span><span class="token cl">~~</span></span>\n' +
            '\n' +
            '<span class="token blockquote"><span class="token cl cl-gt">&gt;</span><span class="token p"> 引用文本</span></span>\n' +
            '\n' +
            '<span class="token p">H</span><span class="token sub"><span class="token cl">~</span>2<span class="token cl">~</span></span><span class="token p">O is是液体。</span>\n' +
            '\n' +
            '<span class="token p">2</span><span class="token sup"><span class="token cl">^</span>10<span class="token cl">^</span></span><span class="token p"> 运算结果是 1024。</span>\n' +
            '\n' +
            '<span class="token h2 alt"><span class="token p">列表</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token cl cl-li">- </span><span class="token p">项目</span>\n' +
            '<span class="token cl cl-li">  * </span><span class="token p">项目</span>\n' +
            '<span class="token cl cl-li">    + </span><span class="token p">项目</span>\n' +
            '\n' +
            '<span class="token cl cl-li">1. </span><span class="token p">项目1</span>\n' +
            '<span class="token cl cl-li">2. </span><span class="token p">项目2</span>\n' +
            '<span class="token cl cl-li">3. </span><span class="token p">项目3</span>\n' +
            '\n' +
            '<span class="token cl cl-li">- </span><span class="token task"><span class="token cl">[</span> <span class="token cl">]</span> </span><span class="token p">计划任务</span>\n' +
            '<span class="token cl cl-li">- </span><span class="token task"><span class="token cl">[</span><span class="token strong">x</span><span class="token cl">]</span> </span><span class="token p">完成任务</span>\n' +
            '\n' +
            '<span class="token h2 alt"><span class="token p">链接</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token p">链接: </span><span class="token link">[<span class="token cl cl-underlined-text">link</span>](https://mp.csdn.net)</span><span class="token p">.</span>\n' +
            '\n' +
            '<span class="token p">图片: </span><span class="token img">![Alt](<span class="token cl cl-src">https://imgconvert.csdnimg.cn/aHR0cHM6Ly9hdmF0YXIuY3Nkbi5uZXQvNy83L0IvMV9yYWxmX2h4MTYzY29tLmpwZw</span>)</span>\n' +
            '\n' +
            '<span class="token p">带尺寸的图片: </span><span class="token img">![Alt](<span class="token cl cl-src">https://imgconvert.csdnimg.cn/aHR0cHM6Ly9hdmF0YXIuY3Nkbi5uZXQvNy83L0IvMV9yYWxmX2h4MTYzY29tLmpwZw</span> <span class="token cl cl-size">=30x30</span>)</span>\n' +
            '\n' +
            '<span class="token p">居中的图片: </span><span class="token img">![Alt](<span class="token cl cl-src">https://imgconvert.csdnimg.cn/aHR0cHM6Ly9hdmF0YXIuY3Nkbi5uZXQvNy83L0IvMV9yYWxmX2h4MTYzY29tLmpwZw#pic_center</span>)</span>\n' +
            '\n' +
            '<span class="token p">居中并且带尺寸的图片: </span><span class="token img">![Alt](<span class="token cl cl-src">https://imgconvert.csdnimg.cn/aHR0cHM6Ly9hdmF0YXIuY3Nkbi5uZXQvNy83L0IvMV9yYWxmX2h4MTYzY29tLmpwZw#pic_center</span> <span class="token cl cl-size">=30x30</span>)</span>\n' +
            '\n' +
            '<span class="token h2 alt"><span class="token p">代码片</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token p">下面展示一些 </span><span class="token code" spellcheck="false"><span class="token cl cl-code">`</span>内联代码片<span class="token cl cl-code">`</span></span><span class="token p">。</span>\n' +
            '\n' +
            '<span class="token pre gfm" spellcheck="false"><span class="token cl cl-pre">```</span>\n' +
            '// A code block\n' +
            'var foo = \'bar\';\n' +
            '<span class="token cl cl-pre">```</span></span>\n' +
            '\n' +
            '<span class="token pre gfm" spellcheck="false"><span class="token language-javascript"><span class="token cl cl-pre">```javascript</span>\n' +
            '<span class="token comment">// An highlighted block</span>\n' +
            '<span class="token keyword">var</span> foo <span class="token operator">=</span> <span class="token string">\'bar\'</span><span class="token punctuation">;</span>\n' +
            '<span class="token cl cl-pre">```</span></span></span>\n' +
            '\n' +
            '<span class="token h2 alt"><span class="token p">表格</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token table"><span class="token p">项目     </span><span class="token cl cl-pipe">|</span><span class="token p"> Value</span>\n' +
            '<span class="token cl cl-title-separator">-------- | -----</span>\n' +
            '<span class="token p">电脑  </span><span class="token cl cl-pipe">|</span><span class="token p"> $1600</span>\n' +
            '<span class="token p">手机  </span><span class="token cl cl-pipe">|</span><span class="token p"> $12</span>\n' +
            '<span class="token p">导管  </span><span class="token cl cl-pipe">|</span><span class="token p"> $1</span>\n' +
            '</span>\n' +
            '<span class="token table"><span class="token cl cl-pipe">|</span><span class="token p"> Column 1 </span><span class="token cl cl-pipe">|</span><span class="token p"> Column 2      </span><span class="token cl cl-pipe">|</span>\n' +
            '<span class="token cl cl-title-separator">|:--------:| -------------:|</span>\n' +
            '<span class="token cl cl-pipe">|</span><span class="token p"> centered 文本居中 </span><span class="token cl cl-pipe">|</span><span class="token p"> right-aligned 文本居右 </span><span class="token cl cl-pipe">|</span>\n' +
            '</span>\n' +
            '<span class="token h2 alt"><span class="token p">自定义列表</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token deflist"><span class="token term">Markdown</span>\n' +
            '<span class="token cl">: </span><span class="token p"> Text-to-HTML conversion tool</span>\n' +
            '\n' +
            '</span><span class="token deflist"><span class="token term">Authors</span>\n' +
            '<span class="token cl">: </span><span class="token p"> John</span>\n' +
            '<span class="token cl">: </span><span class="token p"> Luke</span>\n' +
            '\n' +
            '</span><span class="token h2 alt"><span class="token p">注脚</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token p">一个具有注脚的文本。</span><span class="token fn"><span class="token cl">[^</span>1<span class="token cl">]</span></span>\n' +
            '\n' +
            '<span class="token fndef"><span class="token ref-id"><span class="token cl">[^</span>1<span class="token cl">]</span></span><span class="token p">: 注脚的解释</span></span>\n' +
            '\n' +
            '<span class="token h2 alt"><span class="token p">注释</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token p">Markdown将文本转换为 HTML。</span>\n' +
            '\n' +
            '<span class="token abbrdef"><span class="token abbr-id"><span class="token cl">*[</span>HTML<span class="token cl">]</span></span>:   超文本标记语言</span>\n' +
            '\n' +
            '<span class="token h2 alt"><span class="token p">LaTeX 数学公式</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token link">[<span class="token cl cl-underlined-text">参考文档</span>](https://khan.github.io/KaTeX/)</span>\n' +
            '\n' +
            '<span class="token p">Gamma公式展示 </span><span class="token math expr inline" spellcheck="false"><span class="token cl cl-bracket-start">$</span><span class="token keyword">\\Gamma</span><span class="token lparen">(</span>n<span class="token rparen">)</span> = <span class="token lparen">(</span>n-1<span class="token rparen">)</span>!<span class="token keyword">\\quad</span><span class="token keyword">\\forall</span>\n' +
            'n<span class="token keyword">\\in</span><span class="token keyword">\\mathbb</span> N<span class="token cl cl-bracket-end">$</span></span><span class="token p"> 是通过 Euler integral</span>\n' +
            '\n' +
            '<span class="token math expr block" spellcheck="false"><span class="token cl cl-bracket-start">$$</span>\n' +
            '<span class="token keyword">\\Gamma</span><span class="token lparen">(</span>z<span class="token rparen">)</span> = <span class="token keyword">\\int</span>_0^<span class="token keyword">\\infty</span> t^<span class="token lparen">{</span>z-1<span class="token rparen">}</span>e^<span class="token lparen">{</span>-t<span class="token rparen">}</span>dt<span class="token keyword">\\,</span>.\n' +
            '<span class="token cl cl-bracket-end">$$</span></span>\n' +
            '\n' +
            '<span class="token h2 alt"><span class="token p">插入甘特图</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token link">[<span class="token cl cl-underlined-text">参考文档</span>](https://mermaidjs.github.io/#/gantt)</span>\n' +
            '\n' +
            '<span class="token pre gfm" spellcheck="false"><span class="token cl cl-pre">```</span>mermaid\n' +
            'gantt\n' +
            '        dateFormat  YYYY-MM-DD\n' +
            '        title Adding GANTT diagram functionality to mermaid\n' +
            '        section 现有任务\n' +
            '        已完成               :done,    des1, 2014-01-06,2014-01-08\n' +
            '        进行中               :active,  des2, 2014-01-09, 3d\n' +
            '        计划中               :         des3, after des2, 5d\n' +
            '<span class="token cl cl-pre">```</span></span>\n' +
            '\n' +
            '<span class="token h2 alt"><span class="token p">插入UML图</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token link">[<span class="token cl cl-underlined-text">参考文档</span>](https://mermaidjs.github.io/#/sequenceDiagram)</span>\n' +
            '\n' +
            '<span class="token pre gfm" spellcheck="false"><span class="token cl cl-pre">```</span>mermaid\n' +
            'sequenceDiagram\n' +
            '张三 -&gt;&gt; 李四: 你好！李四, 最近怎么样?\n' +
            '李四--&gt;&gt;王五: 你最近怎么样，王五？\n' +
            '李四--x 张三: 我很好，谢谢!\n' +
            '李四-x 王五: 我很好，谢谢!\n' +
            'Note right of 王五: 李四想了很长时间, 文字太长了&lt;br/&gt;不适合放在一行.\n' +
            '\n' +
            '李四--&gt;&gt;张三: 打量着王五...\n' +
            '张三-&gt;&gt;王五: 很好... 王五, 你怎么样?\n' +
            '<span class="token cl cl-pre">```</span></span>\n' +
            '\n' +
            '<span class="token h2 alt"><span class="token p">插入Mermaid流程图</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token link">[<span class="token cl cl-underlined-text">参考文档</span>](https://mermaidjs.github.io/#/flowchart?id=graph)</span>\n' +
            '\n' +
            '<span class="token pre gfm" spellcheck="false"><span class="token cl cl-pre">```</span>mermaid\n' +
            'graph LR\n' +
            'A[长方形] -- 链接 --&gt; B((圆))\n' +
            'A --&gt; C(圆角长方形)\n' +
            'B --&gt; D{菱形}\n' +
            'C --&gt; D\n' +
            '<span class="token cl cl-pre">```</span></span>\n' +
            '\n' +
            '<span class="token h2 alt"><span class="token p">插入Flowchart流程图</span>\n' +
            '<span class="token cl cl-hash">---------------------------</span></span>\n' +
            '<span class="token link">[<span class="token cl cl-underlined-text">参考文档</span>](http://flowchart.js.org/)</span>\n' +
            '\n' +
            '<span class="token pre gfm" spellcheck="false"><span class="token cl cl-pre">```</span>mermaid\n' +
            'flowchat\n' +
            'st=&gt;start: 开始\n' +
            'e=&gt;end: 结束\n' +
            'op=&gt;operation: 我的操作\n' +
            'cond=&gt;condition: 确认？\n' +
            '\n' +
            'st-&gt;op-&gt;cond\n' +
            'cond(yes)-&gt;e\n' +
            'cond(no)-&gt;op\n' +
            '<span class="token cl cl-pre">```</span></span>\n' +
            '</pre>'
        });
      },
      handleContent(param) {
        switch (param) {
          case 0:
            this.text += '**加粗样式**\n';
            break;
          case 1:
            this.text += '*斜体样式*\n';
            break;
          case 2:
            this.text += '## 标题\n';
            break;
          case 3:
            this.text += '~~ 这是删除线 ~~\n\n';
            break;
          case 4:
            this.text += ' <img src="https://img-blog.csdnimg.cn/2019110110321010.png" width="30px" height="30px">\n';
            break;
          case 5:
            this.text += '`在这里插入代码片`\n\n' +
              '```\n' +
              '这里是代码块\n' +
              '这里是代码块\n' +
              '这里是代码块\n' +
              '```\n';
            break;
          case 6:
            this.text += ' 1. List item\n';
            break;
          case 7:
            this.text += ' - List item\n';
            break;
          case 8:
            this.text += '- [ ] 计划任务\n' +
              '- [x] 完成任务';
            break;
          case 9:
            this.text += '|  |  |\n' +
              '|--|--|\n' +
              '|  |  |\n';
            break;
          case 10:
            this.text += '[百度\n' +
              '](http://baidu.com)\n';
            break;
          case 11:
            this.text += '> 这里是引用\n\n';
            break;
          default:
            break;
        }
      },
      handleMidBar(param) {
        switch (param) {
          case 0:
            this.visible.toolBar = !this.visible.toolBar;
            this.midIcon.toolBar = this.visible.toolBar ? 'iconfont icon-up' : 'iconfont icon-down';
            break;
          case 1:
            if (this.midIcon.paging === 'iconfont icon-paging-right') {
              this.visible.pagingRight = false;
              this.midIcon.paging = 'iconfont icon-paging-left';
            } else {
              this.visible.pagingRight = true;
              this.midIcon.paging = 'iconfont icon-paging-right';
            }
            this.visible.pagingLeft = true;
            break;
          case 2:
            if (this.midIcon.preview === 'iconfont icon-preview') {
              this.visible.pagingLeft = false;
              this.midIcon.preview = 'iconfont icon-pen';
              this.visible.pagingLeft = true;
              this.midIcon.preview = 'iconfont icon-preview';
            }
            this.visible.pagingRight = true;
            break;
          default:
            break;
        }
      }
    },
    mounted() {
      //创建实例
      this.converter = new showdown.Converter();
      this.pageWidth = this.$refs.main.clientWidth;
    }
  }
</script>
<style lang="less">
  @import "../../../styles/showdown.less";
  @import "../../../styles/markdown.less";
</style>