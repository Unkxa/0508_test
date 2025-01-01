<template>
  <div class="empty">
    <img src="@/assets/images/no-data.png" alt="" />
    <span class="no-data-title">暂无数据</span>
  </div>
</template>
<script>
export default {
  name: 'emptyData',
}
</script>
<style lang="less" scoped>
.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -95px;
  margin-left: -95px;
  display: flex;
  flex-direction: column;
  img {
    width: 190px;
    height: 190px;
  }
  .no-data-title {
    display: flex;
    justify-content: center;
    margin-top: -60px;
    color: #4e5969;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }
}
</style>
