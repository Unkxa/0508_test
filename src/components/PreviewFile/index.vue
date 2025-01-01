<template>
  <div class="docview-container">
    <div id="iframe-container"></div>
  </div>
</template>

<script>
import ENV from '@/common/config'
import $ from 'jquery'
import documentApi from '@/api/downloadApi/download.api.ts'
export default {
  name: 'PreviewFile',
  props: {
    path: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      iframeUrl: '',
    }
  },
  mounted() {
    this.getViewToken()
  },
  methods: {
    async getViewToken() {
      let res = await documentApi.getViewToken(this.path || this.$route.query.path)
      $('#iframe-container').empty()
      let url = `${ENV.previewUrl}/#!/?viewToken=${res.result}`
      $(`<iframe width='100%' height='100%'  src="${url}"></iframe>`).prependTo('#iframe-container')
    },
  },
}
</script>
<style scoped lang="less">
.docview-container {
  width: 100%;
  height: 100%;
  .container-operation-btn {
    display: flex;
    justify-content: flex-end;
    margin: 8px;
  }
  #iframe-container {
    height: 100%;
  }
  button {
    margin: 0 4px;
  }
}
</style>
