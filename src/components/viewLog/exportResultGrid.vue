<template>
  <div>
    <img src="@/assets/images/success-icon.svg" alt="" />
    <span>{{ successCount }}</span>
    <img src="@/assets/images/fail-icon.svg" alt="" />
    <span>{{ failCount }}</span>
  </div>
</template>

<script>
export default {
  name: 'ExportResultGrid',

  data() {
    return {
      failCount: 0,
      successCount: 0,
    }
  },

  mounted() {
    //
    this.failCount = this.params.data.failNum
    this.successCount = this.params.data.successNum
  },

  methods: {},
}
</script>
<style lang="less" scoped>
img {
  width: 12px;
  margin: 0 4px;
}
</style>
