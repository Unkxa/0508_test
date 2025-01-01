<template>
  <div class="marqueeBox flex-x-start-center">
    <div class="marqueeBox-icon">
      <span title="回收站" class="iconfont">&#xe725;</span>
    </div>
    <div class="marqueeBox-showArea" :style="{ width: `${width}px` }">
      <!-- 设置margin，使内容 有从无到有的出现效果 -->
      <div class="marqueeBox-container" v-if="width > 0" :style="{ margin: `0 ${width}px`, height: `${height}px` }">
        <div
          v-for="(item, index) in list"
          :key="item"
          v-show="index === showIndex"
          :style="{ lineHeight: `${height}px` }"
        >
          <span v-if="index === showIndex">
            {{ item }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'marquee',
  components: {},
  data() {
    return {
      showIndex: 0,
      width: 0,
    }
  },
  props: {
    // 自定义跑马灯高度
    height: {
      type: Number,
      default: 30,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.initList()
  },
  methods: {
    // 初始化函数----------------------------------
    async initList() {
      // 在mounted阶段，才可以获取真实DOM节点
      const showArea = document.querySelector('.marqueeBox-showArea')
      //从左到右滚动，首先把滚动条置到元素的最右边
      this.width = showArea.scrollWidth
      showArea.scrollLeft = showArea.scrollWidth
      this.$nextTick(() => {
        function f() {
          //如果滚动条到了元素的最左边，那么把它再初始化到最右边
          if (showArea.scrollLeft < 3) {
            this.showIndex = this.showIndex + 1 > this.list.length - 1 ? 0 : this.showIndex + 1
            showArea.scrollLeft = showArea.scrollWidth
          } else {
            //每次滚动条向左移动2，改变speed可以调整滚动速度
            const speed = 2
            showArea.scrollLeft -= speed
          }
          //使用requestAnimationFrame，优化滚动效果
          requestAnimationFrame(f.bind(this))
        }
        this.list.length > 0 && requestAnimationFrame(f.bind(this))
      })
    },

    // 事件函数----------------------------------
    // 点击列表
    changeUnit(i) {
      console.log(i)
    },
  },
}
</script>
<style lang="less" scoped>
@import '@/assets/styleSpecial/global.params.less';

.marqueeBox {
  width: 100%;

  .marqueeBox-icon {
    margin: 0 15px 0 15px;
  }

  .marqueeBox-showArea {
    flex: 1;
    height: 100%;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
  }

  .marqueeBox-container {
    height: 100%;
  }
}
</style>
