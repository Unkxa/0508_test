<template>
  <div class="fileList-container">
    <div class="file-box" v-for="item in fileList" :key="item.id">
      <div class="link-fileName">
        <ab-icon style="font-size: 16px" className="FCfile-text"></ab-icon>
        <a class="file-name" :title="item.fileName">{{ item.fileName }}</a>
      </div>
      <ab-icon style="font-size: 16px" className="FCdownload-2" @click="handleFileDownload(item)"></ab-icon>
    </div>
  </div>
</template>
<script>
export default {
  name: 'fileList',
  props: {
    fileList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {}
  },
  methods: {
    handleFileDownload(item) {
      this.$emit('download', item)
    },
  },
}
</script>

<style lang="less" scoped>
.fileList-container {
  .file-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    line-height: 36px;
    background-color: #f7f8fa;
    padding-right: 12px;
    padding-left: 12px;
    border-radius: 2px;
    max-width: 300px;
    margin-top: 4px;
    &:hover {
      background-color: #e6f1ff;
    }
  }
  .link-fileName {
    display: flex;
    align-items: center;
  }
  .file-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 12px;
    color: #4e5969;
    max-width: 200px;
    font-size: 12px;
  }
}
</style>
