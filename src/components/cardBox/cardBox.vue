<template>
  <div class="main-container-content">
    <div class="content-wrap">
      <div class="top">
        <img class="back-img" src="@/assets/images/card-back.svg" alt="" />
        <div class="title">{{ firstTitle }}</div>
        <div class="details">
          {{ details }}
        </div>
      </div>
      <div class="bottom">
        <div v-if="secondTitle" class="title">{{ secondTitle }}</div>
        <div class="state-box" v-for="(child, index) in topCardDataRows" :key="index">
          <div class="state-box-item" @click="gotoApprove(item.routePath)" v-for="item in child" :key="item.id">
            <div class="item-header">
              <img class="right-icon" :src="item.icon" />
              <img class="router-link-bg" src="@/assets/images/card-bott-back.png" alt="" />
              <div class="sub-title">{{ item.subTitle }}</div>
              <div class="sub-details">{{ item.details }}</div>
            </div>
            <div class="item-footer">
              <span>进入</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10.7811 7.33327L7.20506 3.75726L8.14786 2.81445L13.3333 7.99993L8.14786 13.1853L7.20506 12.2425L10.7811 8.6666H2.66666V7.33327H10.7811Z"
                  fill="#165DFF"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isHasPermission } from '@/common/toolFun/util'
export default {
  name: 'cardBox',
  props: {
    //一级TITLE
    firstTitle: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
    // 二级TITLE
    secondTitle: {
      type: String,
      default: '',
    },
    // 卡片数据
    topCardData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      topCardDataRows: [],
    }
  },
  created() {
    this.mapArr2()
  },
  methods: {
    // 跳转
    gotoApprove(routePath) {
      this.$emit('gotoApprove', routePath)
    },
    mapArr2() {
      const result = this.topCardData
        .filter((c) => isHasPermission(c.permission))
        .flatMap((val, index, arr) => {
          if (index % 3 === 0) {
            return [arr.slice(index, index + 3)]
          }
          return []
        })
      this.topCardDataRows = result
    },
  },
}
</script>
<style lang="less" scoped>
.top {
  position: relative;
  flex-shrink: 0;
  height: 240px;
  padding: 64px 24px;
  background: #eef2fd;
  .back-img {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 1;
  }

  .title {
    margin-bottom: 8px;
    color: var(---black-10, #1d2129);
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 32px; /* 133.333% */
    position: relative;
    z-index: 10;
  }
  .details {
    width: calc(100% - 400px);
    color: var(---black-8, #4e5969);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
    position: relative;
    z-index: 10;
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    height: 52px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff);
    z-index: 1;
  }
}
.bottom {
  flex: 1;
  overflow: hidden auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  .title {
    margin-bottom: 16px;
    color: var(---black-10, #1d2129);
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 32px; /* 200% */
  }
}
.state-box {
  width: 100%;
  display: flex;
  flex-wrap: no-wrap;
  gap: 24px;
  .state-box-item {
    display: flex;
    flex-direction: column;
    width: calc(33.33% - 16px);
    min-width: 376px;
    height: 169px;
    flex-shrink: 0;
    border-radius: 4px;
    border: 1px solid var(---black-3, #e5e6eb);
    background: #fff;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: transform;
    transition-property: transform;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;

    .item-header {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 16px 16px 0 16px;
      position: relative;
      .router-link-bg {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: none;
      }

      .right-icon {
        width: 44px;
        height: 44px;
        display: block;
        margin-bottom: 6px;
      }
      .sub-title {
        color: var(---black-10, #1d2129);
        font-weight: 600;
        line-height: 22px;
        margin-bottom: 4px;
      }
      .sub-details {
        color: var(---black-8, #4e5969);
        font-size: 12px;
        font-weight: 400;
        line-height: 20px; /* 166.667% */
      }
    }

    .item-footer {
      width: 100%;
      height: 35px;
      border-top: 1px solid #e5e6eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      position: relative;

      span {
        color: #165dff;
      }
    }
  }

  .state-box-item:hover {
    .item-header {
      width: 100%;
      height: 130px;
      background-size: 100% 100%;
      transition: all 0.1s;
      position: relative;
      .router-link-bg {
        height: 100%;
        display: block;
        z-index: -1;
      }
    }
    .item-footer {
      background-color: #165dff;
      transition: background-color 0.5s;
      span {
        color: #fff;
      }
      path {
        fill: #fff;
      }
    }
  }

  .state-box-item:hover {
    border: 1px solid #165dff;
  }
}
</style>
