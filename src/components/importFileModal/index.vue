<template>
  <ab-modal :maskClosable="false" :visible="visible" :title="title" @cancel="cancel" centered>
    <!-- 正常导入 -->
    <template slot="content" v-if="!special">
      <ab-steps :current="stepsCurrent" :dataSource="stepList"></ab-steps>
      <div class="first-step" v-if="stepsCurrent === 0">
        <div class="title">请先下载模板</div>
        <div class="download">
          <span>文件列表</span>
          <a-button type="primary" ghost @click="templateDownload">模板下载</a-button>
        </div>
      </div>
      <div class="second-step" v-if="stepsCurrent === 1">
        <div class="title">请先上传导入文件(可先下载模板)</div>
        <div class="ab-upload">
          <span>文件列表</span>
          <ab-upload
            name="multipartFile"
            accept=".xls,.xlsx"
            class="upload"
            action="/administrativeapi/resource/upload_file"
            :fileList="fileList"
            @change="uploadChange"
            @deleteFile="deleteFile"
          >
          </ab-upload>
        </div>

        <div class="extra">注：仅支持xls,xlsx格式文件</div>
      </div>
      <div class="third-step" v-if="stepsCurrent === 2">
        <img :src="imgSrc" alt="" />
        <span class="title">导入失败 </span>
        <a-button type="primary" ghost @click="resetImport">重新导入</a-button>
        <span v-show="failedPath" class="failed-report" @click="downloadReport" style="color: #165dff"
          >请下载失败报告</span
        >
      </div>
      <div class="fourth-step" v-if="stepsCurrent === 3">
        <img :src="imgSrc" alt="" />
        <span class="title">导入成功</span>
        <a-button type="primary" ghost @click="checkInfo">前往查看</a-button>
      </div>
    </template>
    <!-- 特殊导入 -->
    <template slot="content" v-else>
      <div class="second-step">
        <div class="ab-upload">
          <span>文件列表</span>
          <ab-upload
            name="multipartFile"
            accept=".xls,.xlsx"
            class="upload"
            action="/administrativeapi/resource/upload_file"
            :fileList="fileList"
            @change="uploadChange"
            @deleteFile="deleteFile"
          >
          </ab-upload>
        </div>

        <div class="extra">注：仅支持xls,xlsx格式文件</div>
      </div>
    </template>
    <template slot="footer" v-if="!special">
      <a-button @click="cancel">取消</a-button>
      <a-button v-if="stepsCurrent === 1" type="primary" ghost @click="prev">上一步</a-button>
      <a-button
        v-if="stepsCurrent !== 2 && stepsCurrent !== 3"
        type="primary"
        :disabled="stepsCurrent === 1 && fileList.length === 0"
        @click="next"
        >下一步</a-button
      >
      <a-button
        v-if="stepsCurrent === 2 || stepsCurrent === 3"
        :disabled="stepsCurrent === 2"
        type="primary"
        @click="confirm"
      >
        完成导入
      </a-button>
    </template>
    <template slot="footer" v-else>
      <a-button @click="cancel">取消</a-button>
      <a-button :disabled="fileList.length === 0" type="primary" @click="confirm"> 完成导入 </a-button>
    </template>
  </ab-modal>
</template>

<script>
import { saveFile } from '@/common/toolFun/util'
import downloadApi from '@/api/downloadApi/download.api'
export default {
  name: 'ImportFileModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '导入数据',
    },
    type: {
      type: String,
      default: '0',
    },
    special: {
      type: Boolean,
      default: false,
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
    repoId: {
      // 导入题库id
      type: String,
      default: '',
    },
  },
  data() {
    return {
      failedPath: '',
      fileList: [],
      stepsCurrent: 0,
      stepList: [
        {
          title: '下载模板',
        },
        {
          title: '上传文件',
        },
        {
          title: '导入成功',
        },
      ],
    }
  },
  computed: {
    imgSrc() {
      return this.stepsCurrent === 3 ? require('@/assets/images/success.png') : require('@/assets/images/failed.png')
    },
  },
  methods: {
    async templateDownload() {
      try {
        const data = {
          type: this.type,
        }
        const res = await downloadApi.excelMultiImportDownFileByType(data)
        saveFile(res)
        this.$abNotification.open({
          type: 'success',
          message: '操作成功',
          description: '模板下载成功',
        })
        this.next()
      } catch (error) {
        this.$abNotification.open({
          type: 'error',
          message: '操作失败',
          description: '模板下载失败',
        })
      }
    },
    // 上传文件
    async uploadChange(e) {
      const { file, fileList } = e
      if (file?.status === 'done') {
        if (this.isMultiple) {
          this.fileList = fileList
        } else {
          this.fileList = fileList.length > 1 ? fileList.slice(-1) : fileList
        }
      }
    },
    deleteFile(e) {
      this.fileList = e.fileList
    },
    // 点击确认
    async confirm() {
      this.$emit('confirm', this.fileList)
    },
    cancel() {
      this.$emit('cancel')
    },

    async importFile() {
      try {
        const data = {
          type: this.type,
          filePath: this.fileList[0].filePath ?? this.fileList[0].response?.data.filePath,
          extraObject: { repo_id: this.repoId },
        }
        const res = await downloadApi.excelMultiImportAnalysisSaveData(data)

        if (res.result) {
          this.$abNotification.open({
            type: 'success',
            message: '操作成功',
            description: '文件上传成功',
          })
          this.stepsCurrent = 3
        } else {
          this.$abNotification.open({
            type: 'error',
            message: '操作成功',
            description: '文件上传失败',
          })
          this.stepsCurrent = 2
          this.failedPath = res.result
        }
      } catch (e) {
        this.stepsCurrent = 2
      }
    },
    //下载失败报告
    async downloadReport() {
      const info = {
        path: this.failedPath,
        fileName: '失败报告.xlsx',
      }
      const res = await downloadApi.resourceDownload2(info)
      saveFile(res)
    },
    prev() {
      this.stepsCurrent--
    },
    next() {
      if (this.stepsCurrent === 1) {
        this.importFile()
      } else {
        this.stepsCurrent++
      }
    },
    resetImport() {
      this.stepsCurrent = 0
      this.failedPath = ''
      this.fileList = []
    },
    checkInfo() {
      this.$emit('checkInfo')
    },
  },
}
</script>

<style lang="less" scoped>
.fourth-step,
.third-step,
.second-step,
.first-step {
  margin: 24px 0;
  .title {
    color: #1d2129;
    font-weight: 600;
    margin: 24px 0;
  }
}
.fourth-step,
.third-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    color: #1d2129;
    font-weight: 600;
    margin: 16px 0;
  }
  .failed-report {
    margin-top: 16px;
    color: '#165dff';
    cursor: pointer;
  }
}
.download {
  display: flex;
  align-items: center;
  > span {
    width: 56px;
    color: var(--light-text-color-text-2, #4e5969);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
    margin-right: 16px;
  }
}
.ab-upload {
  display: flex;
  > span {
    flex-shrink: 0;
    width: 56px;
    color: var(--light-text-color-text-2, #4e5969);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
    margin-right: 16px;
    padding-top: 4px;
  }
  .upload {
    width: calc(100% - 56px);
  }
}
.extra {
  color: var(---black-6, #86909c);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  margin-left: 72px;
  margin-top: 8px;
}
</style>
