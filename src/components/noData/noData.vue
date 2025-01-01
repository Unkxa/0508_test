<template>
  <div class="content">
    <div class="no-data">
      <img src="@/assets/images/no-data.png" alt="" />
      <div class="first-title">
        <span class="left">{{ contentConfig.firstTitleLeft }}</span>
        <span v-if="contentConfig.firstTitleRight" class="center">，</span>
        <span @click="clickEvents" class="right">{{ contentConfig.firstTitleRight }}</span>
      </div>
      <div class="second-title">
        {{ contentConfig.secondTitle }}
      </div>
    </div>
  </div>
</template>

<script>
// 此组件有两种使用方式
// 1.使用指令 v-nodata 后面需要传配置例如 data 为你所传的数组内容，config 对应的内容与方法
// {
//   data: data,
//   config: {
//     firstTitleLeft: '暂无数据',
//     firstTitleRight: '点击前往三合一报审系统',
//     secondTitle: '当前立档单位暂无审核通过三合一内容,请前往提交',
//   },
//   methods: {
//     clickEvents() {
//       console.log('点击 事件')
//     },
//   },
// }
//2.ab-table 使用，table.mixin里已增加了通用配置，更改配置需要再gridOptions上书写
// noRowsOverlayComponent: 'NoData',
// noRowsOverlayComponentParams: {
//    config: {
//      firstTitleLeft: '暂无相关数据',
//      firstTitleRight: '点击跳转ERMS库房',
//      secondTitle: '当前暂无库房信息，请点击“跳转ERMS库房”前往设置库房后返回查看,请前往提交',
//      clickEvents: () => this.clickEvents(),
//     },
// },
export default {
  name: 'no-data',
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    contentConfig() {
      let config = {}
      if (this.params) {
        config = Object.assign(
          { firstTitleLeft: '暂无相关数据', firstTitleRight: '', secondTitle: '' },
          this.params.config
        )
      } else {
        config = Object.assign({ firstTitleLeft: '暂无相关数据', firstTitleRight: '', secondTitle: '' }, this.config)
      }
      return config
    },
  },

  methods: {
    // 指令外面覆盖掉此方法重写，table组件 使用此方法
    clickEvents() {
      if (this.params) {
        this.params.config.clickEvents()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  position: relative;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .no-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 252px;
    pointer-events: auto;
    img {
      width: 240px;
      height: 240px;
      cursor: auto;
    }
    .first-title {
      display: flex;
      margin-top: -80px;
      .left {
        color: #4e5969;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
      }
      .right {
        cursor: pointer;
        user-select: none;
        color: var(---blue-6, #165dff);

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
      }
    }
    .second-title {
      color: var(---black-6, #86909c);
      text-align: center;

      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px; /* 157.143% */
    }
  }
}
</style>
