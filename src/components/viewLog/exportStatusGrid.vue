<template>
  <div>
    <span :class="{ success: smallStatus == '1', fail: smallStatus == '2' }">
      {{ statusName }}
      <ab-icon :title="params.data.failReason" v-if="smallStatus == '2'" className="FCalert-fill"></ab-icon>
    </span>
  </div>
</template>

<script>
export default {
  name: 'ExportStatusGrid',

  data() {
    return {
      statusName: '',
      smallStatus: '',
    }
  },

  mounted() {
    this.statusName = this.params.data.statusName
    this.smallStatus = this.params.data.smallStatus
  },

  methods: {},
}
</script>
<style lang="less" scoped>
.success {
  color: #00b42a;
}
.fail {
  color: #f53f3f;
}
.iconfont {
  color: #ff7d00;
}
</style>
