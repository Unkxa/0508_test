<template>
  <div class="confirm-container">
    <ab-modal
      :maskClosable="false"
      centered
      :width="content.width"
      :visible="visible"
      :title="content.title"
      @cancel="cancel"
    >
      <template slot="content">
        <div class="left">
          <img class="img" :src="imgUrl" alt="" />
        </div>
        <div class="right">
          <span class="sec-title">{{ content.msg }}</span>
          <span class="describe">{{ content.describe }}</span>
        </div>
      </template>
      <template slot="footer">
        <a-button @click="cancel">{{ content.btn.cancel || '取消' }}</a-button>
        <a-button type="primary" @click="confirm">{{ content.btn.confirm || '确认' }}</a-button>
      </template>
    </ab-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: true,
    }
  },
  props: {
    //默认配置，如需修改可在使用处传入
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    content() {
      return Object.assign(
        {
          width: 560,
          title: '提示',
          type: 'warning',
          msg: '',
          describe: '',
          btn: {
            confirm: '确认',
            cancel: '取消',
          },
        },
        this.config
      )
    },
    //根据type动态生成图片路径
    imgUrl() {
      return require(`@/assets/images/font-image/${this.content.type}.png`)
    },
  },
  methods: {
    //这两个方法会被外层调用重写
    cancel() {
      console.log('取消')
    },
    confirm() {
      console.log('确认')
    },
  },
}
</script>
<style lang="less" scoped>
::v-deep {
  .content {
    display: flex;
    .left {
      display: flex;
      justify-content: start;
      margin-right: 8px;
      .img {
        width: 24px;
        height: 24px;
      }
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      .sec-title {
        color: var(--light-text-color-text-1, #1d2129);

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
        margin-bottom: 8px;
      }
      .describe {
        color: var(---black-6, #86909c);

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
      }
    }
  }
  .ant-modal-body {
    min-height: 100px;
  }
}
</style>
