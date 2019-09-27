<template>
  <div class="canvas">
    <el-row type="flex" class="row" justify="center">
      <el-col span="4" class="row-col">
        <el-slider v-if="isPainting"
                   v-model="lineWidth"
                   :min="1"
                   :max="50">
        </el-slider>
        <el-slider v-else
                   v-model="lineWidth"
                   :min="10"
                   :max="50"
                   :step="10">
        </el-slider>
      </el-col>
      <el-col span="6">
        <div class="header">
          <el-button-group>
            <el-button :type=buttonType(0)
                       icon="iconfont icon-pen" round
                       @click="painting">
            </el-button>
            <el-button :type="buttonType(1)"
                       icon="iconfont icon-eraser"
                       @click="eraser">
            </el-button>
            <el-button :type="buttonType(2)"
                       icon="iconfont icon-last-step"
                       :disabled="history.length === 0"
                       @click="lastStep">
            </el-button>
            <el-button :type="buttonType(3)"
                       icon="iconfont icon-clear"
                       @click="clearAll">
            </el-button>
            <el-button :type="buttonType(4)"
                       icon="iconfont icon-save"
                       round @click="save">
            </el-button>
          </el-button-group>
        </div>
      </el-col>
      <el-col span="6" class="row-col">
        <div class="row-col-color">
          <el-button v-for="(item, index) in colorArr"
                     :size="colorSize(index)"
                     :style="item.style" circle
                     @click="checkColor(index)">
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col span="24">
        <div class="content">
          <canvas ref="canvas" id="canvas"></canvas>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        active: 0,
        colorActive: 0,
        paint: false,
        clear: false,
        isPainting: false,
        lineWidth: 1,
        canvas: {},
        ctx: {},
        pageWidth: 0,
        pageHeight: 0,
        lastPoint: {},
        newPoint: {},
        colorArr: [],
        history: []
      }
    },
    methods: {
      getColor() {
        this.$store.dispatch('ajax', {
          url: '/canvas/color',
          success: (response) => {
            if (response.flag === 1) {
              this.colorArr = response.data;
            }
          }
        });
      },
      initCanvas() {
        let that = this;
        // 获取canvas元素
        this.canvas = this.$refs.canvas;
        // 指定了画布上绘制的类型为2d
        this.ctx = this.canvas.getContext('2d');
        // 获取画布相对于视窗的位置集合
        let rect = this.canvas.getBoundingClientRect();
        let initX = rect.x;
        let initY = rect.y;
        this.pageWidth = document.documentElement.clientWidth - rect.x - 50;
        this.pageHeight = document.documentElement.clientHeight - rect.y - 50;
        this.canvas.width = this.pageWidth;
        this.canvas.height = this.pageHeight;
        let image = this.ctx.getImageData(0, 0, that.pageWidth, that.pageHeight);
        this.history.push(image);
        // 鼠标按下事件
        this.canvas.onmousedown = function (e) {
          that.ctx.beginPath();
          that.paint = that.isPainting;
          that.clear = !that.isPainting;
          let x = e.clientX - initX;
          let y = e.clientY - initY;
          that.lastPoint = {x: x, y: y};
        };
        // 鼠标移动事件
        this.canvas.onmousemove = function (e) {
          if (that.paint) {
            let x = e.clientX - initX;
            let y = e.clientY - initY;
            that.newPoint = {x: x, y: y};
            that.drawLine();
            that.lastPoint = that.newPoint;
          }
          if (that.clear) {
            let x = e.clientX - initX;
            let y = e.clientY - initY;
            that.ctx.save();
            that.ctx.clearRect(x, y, that.lineWidth, that.lineWidth);
            that.ctx.restore();
          }
        };
        // 鼠标松开事件
        this.canvas.onmouseup = function () {
          that.ctx.closePath();
          let image = that.ctx.getImageData(0, 0, that.pageWidth, that.pageHeight);
          that.history.push(image);
          that.paint = that.clear = false;
        };
      },
      drawLine() {
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        this.ctx.lineTo(this.newPoint.x, this.newPoint.y);
        this.ctx.stroke();
        this.ctx.closePath();
      },
      painting() {
        this.isPainting = true;
        this.active = 0;
      },
      eraser() {
        this.isPainting = false;
        this.active = 1;
      },
      clearAll() {
        this.paint = this.clear = this.isPainting = false;
        this.ctx.clearRect(0, 0, this.pageWidth, this.pageHeight);
        this.history.length = 1;
        this.active = 3;
      },
      save() {
        this.active = 4;
        this.paint = this.clear = this.isPainting = false;
        let imgUrl = this.canvas.toDataURL("image/png");
        let saveImg = document.createElement("a");
        document.body.appendChild(saveImg);
        saveImg.href = imgUrl;
        saveImg.download = "canvas" + (new Date).getTime();
        saveImg.target = "_blank";
        saveImg.click();
      },
      checkColor(param) {
        this.ctx.strokeStyle = this.colorArr[param].color;
        this.colorActive = param;
      },
      colorSize(param) {
        if (param === this.colorActive) {
          return "default"
        } else {
          return "medium"
        }
      },
      lastStep() {
        this.history.pop();
        this.ctx.putImageData(this.history[this.history.length - 1], 0, 0);
        this.active = 2;
      },
      buttonType(param) {
        if (param === this.active) {
          return "primary"
        }
      }
    },
    mounted() {
      this.getColor();
      this.initCanvas();
      this.painting();
    }
  }
</script>
<style lang="less" scoped>
  .header {
    text-align: center;
  }

  .row {
    padding: 5px 0;

    &-col {
      padding: 0 30px;
      background-color: #f9fafc;
      border-radius: 50px;
      &-color {
        text-align: center;
        line-height: 30px;
      }
    }
  }
  .content {
    border: 1px solid #DCDFE6;
  }
</style>