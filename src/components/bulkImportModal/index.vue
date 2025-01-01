<template>
  <ab-modal :maskClosable="false" :visible="visible" :width="960" title="导入数据" @cancel="cancel" centered>
    <template slot="content">
      <ab-steps :current="stepsCurrent" :dataSource="stepList"></ab-steps>
      <div class="first-step" v-if="stepsCurrent === 0">
        <div class="upload-import-list">
          <div class="step-desc">
            <div class="step-header">
              <a-tag color="blue"> 步骤1</a-tag>
              <div class="step-title">选择待导入的数据表格</div>
            </div>
            <div class="step-desc-tip">目前只支持从Excel文件导入数据</div>
          </div>
          <div class="select-archive-right-operate">
            <div class="right-operate-desc">
              <span class="choose-attachment">请选择数据文件</span>
            </div>
            <div class="upload-operate">
              <a-input disabled type="text" :value="fileName" :placeholder="'请选择'" />
              <ab-upload
                text="选择文件"
                name="multipartFile"
                :showUploadList="false"
                action="/administrativeapi/resource/upload_file"
                accept=".xls,.xlsx"
                @change="selectFileChange"
              >
                <a-button type="primary">选择文件</a-button>
              </ab-upload>
              <span class="download-template" @click="downloadTemplate"> 下载导入模板 </span>
            </div>
          </div>
          <div class="step-desc">
            <div class="step-header">
              <a-tag color="blue"> 步骤2</a-tag>
              <div class="step-title">关联文件</div>
            </div>
            <div class="step-desc-tip">上传文件并关联</div>
          </div>
          <div class="select-archive-right-operate">
            <div class="right-operate-desc">
              <span class="choose-attachment">选择要匹配的字段</span>
            </div>
            <div class="upload-operate content">文件名称</div>
          </div>
          <div class="select-archive-right-operate">
            <div class="right-operate-desc">
              <span class="choose-attachment">待关联文件列表</span>
            </div>
            <div class="table-box">
              <div class="operate">
                <ab-upload
                  ref="abUpLoad"
                  name="multipartFile"
                  class="upload"
                  action="/administrativeapi/resource/upload_file"
                  :showUploadList="false"
                  @change="uploadChange"
                  @before="beforeUpload"
                  :multiple="true"
                  :accept="acceptFileType"
                >
                  <template slot="content">
                    <div>
                      <a-button type="primary">上传文件</a-button>
                    </div>
                  </template>
                </ab-upload>
                <a-button type="primary" ghost :disabled="selectedRows.length == 0" @click="removeFiles">移除</a-button>
                <a-button type="danger" ghost :disabled="selectedRows.length == 0" @click="emptyFiles">清空</a-button>
              </div>
              <ab-table
                ref="abTable"
                @click="tableClick"
                :gridOptions="gridOptions"
                :pagination="{ showPagination: false }"
                @getSelectedRows="getSelectedRows"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="second-step" v-if="stepsCurrent === 1">
        <div class="content">
          <div class="importDone" v-if="importDone">
            <img :src="imgSrc" alt="" />
            <div class="title">导入完成</div>
            <div class="result">本次导入数据{{ finishTotal }}条，成功{{ successNum }}条，失败{{ failTotal }}条</div>
            <a-button type="primary" @click="viewLog">查看日志</a-button>
          </div>
          <div class="progress-box">
            <div class="title">导入进度</div>
            <a-progress strokeColor="#165dff" :percent="progress" />
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <a-button v-if="stepsCurrent == 0" @click="cancel">取消</a-button>
      <a-button
        v-if="stepsCurrent == 0"
        type="primary"
        :disabled="!fileName || !gridOptions.rowData.length"
        @click="next"
        >提交</a-button
      >
      <a-button v-if="stepsCurrent === 1" :disabled="!importDone" type="primary" @click="confirm"> 完成导入 </a-button>
    </template>
  </ab-modal>
</template>

<script>
import { saveFile } from '@/common/toolFun/util'
import downloadApi from '@/api/downloadApi/download.api'
import ArchivalPublicityApi from '@/api/archivalPublicity/archivalPublicity.api'
import { gridCheckBox } from '@/common/toolFun/grid.collection'
import tableMinxin from '@/mixin/table.mixin'
import { acceptFileType } from '@/common/enums/accept.enum.ts'

export default {
  name: 'BulkImportModal',
  mixins: [tableMinxin],
  props: {
    visible: {
      type: Boolean,
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      stepsCurrent: 0,
      successNum: 0,
      failTotal: 0,
      finishTotal: 0,
      importFileInfo: {},
      acceptFileType,
      stepList: [
        {
          title: '上传导入清单',
        },
        {
          title: '确认导入结果',
        },
      ],
      fileName: '',
      gridOptions: {
        columnDefs: [
          gridCheckBox,
          {
            headerName: '文件名',
            enableSorting: false,
            resizable: true,
            field: 'fileName',
            colId: 'fileName',
            width: 150,
            suppressSizeToFit: false,
          },
          {
            field: 'operate',
            headerName: '操作',
            suppressSizeToFit: true,
            width: 80,
            buttons: [
              {
                label: '删除',
                handler: 'deleteInfo',
                color: '#F53F3F',
              },
            ],
            pinned: 'right',
          },
        ],
        rowData: [],
      },
      progress: 0,
      importDone: false,
    }
  },
  computed: {
    imgSrc() {
      return require('@/assets/images/success.png')
    },
  },
  methods: {
    // 表格点击
    tableClick(event, handler, row) {
      switch (handler) {
        case 'deleteInfo':
          this.deleteInfo(row)
          break
      }
    },
    // 删除
    deleteInfo(row) {
      let index = this.gridOptions.rowData.findIndex((item) => item.fileName === row.fileName)
      this.gridOptions.rowData.splice(index, 1)
      this.gridOptions.rowData = [...this.gridOptions.rowData]
    },
    // 移除
    removeFiles() {
      this.selectedRows.forEach((item, index) => {
        this.gridOptions.rowData.forEach((tableItem, i) => {
          if (item.fileName === tableItem.fileName) {
            this.gridOptions.rowData.splice(i, 1)
            this.gridOptions.rowData = [...this.gridOptions.rowData]
            this.$refs?.abTable?.gridOptionsDeal.api.deselectAll()
          }
        })
      })
    },
    // 清空
    emptyFiles() {
      this.gridOptions.rowData = []
    },
    async downloadTemplate() {
      let info = {
        type: this.type,
      }
      const res = await ArchivalPublicityApi.excelMultiImportDownloadTemplate(info)
      saveFile(res)
    },
    async selectFileChange(e) {
      const { file, fileList } = e
      if (file?.status === 'done') {
        this.fileName = file.name
        this.importFileInfo = file.response.data
      }
    },
    // 上传文件
    async uploadChange(e) {
      const { file, fileList } = e
      if (file?.response?.code == '200') {
        this.gridOptions.rowData.push(file.response.data)
        this.gridOptions.rowData = [...this.gridOptions.rowData]
      }
    },
    beforeUpload(file, fileList, currentList, callBack) {
      let fileNameList = this.gridOptions.rowData.map((item) => item.fileName)
      if (fileNameList.includes(file.name)) {
        this.$abNotification.open({
          message: '上传失败',
          description: '不可上传重复文件',
          duration: 1,
          type: 'warning',
        })
      } else {
        callBack(true)
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
    //下载失败报告
    async downloadReport() {
      const info = {
        path: this.failedPath,
        fileName: '失败报告.xlsx',
      }
      const res = await downloadApi.resourceDownload2(info)
      saveFile(res)
    },
    async next() {
      let info = {
        importFileInfo: this.importFileInfo,
        attachmentInfoList: this.gridOptions.rowData,
      }
      let res =
        this.type == 'manuscript_template'
          ? await ArchivalPublicityApi.manuscriptLibraryImportData(info)
          : await ArchivalPublicityApi.contributeImportData(info)
      if (res) {
        this.id = res.result
        this.stepsCurrent++
      }
    },
    viewLog() {
      this.$emit('viewLog')
    },
    importLogGetImportProgress() {
      this.getImportResult()
      const intervalId = setInterval(() => {
        this.getImportResult()
        if (this.importDone) {
          clearInterval(intervalId)
        }
      }, 3000)
    },
    async getImportResult() {
      let res = await ArchivalPublicityApi.importLogGetImportProgress(this.id)
      this.importDone = res.importDone
      this.progress = res.progress
      this.finishTotal = res.finishTotal
      this.failTotal = res.failTotal
      this.successNum = res.successTotal
    },
  },
  watch: {
    stepsCurrent(v) {
      if (v == 1) {
        // 获取导入进度
        this.importLogGetImportProgress()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.second-step {
  height: 380px;
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .progress-box {
      width: 760px;
      height: 100px;
      background: #f2f3f5;
      padding: 16px;
      .title {
        margin-bottom: 12px;
      }
    }
    .title {
      color: #1d2129;
      font-weight: 500;
    }
    .ant-btn {
      margin: 12px 0 64px 0;
    }
    .importDone {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
.upload-import-list {
  .step-desc {
    display: flex;
    flex-direction: column;
    margin: @marginBase*4 0 @marginBase*2 0;
    .step-header {
      display: flex;
      margin-left: @marginBase;
      .step-title {
        color: @black-10;
        font-weight: bold;
      }
    }
    .step-desc-tip {
      color: @black-6;
      margin-left: @marginBase*8 - 2px;
    }
  }
  .view-mode {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding-left: @paddingBase*8;
    .grid-field-select {
      width: 184px;
      margin: 0 16px;
    }
  }
  .mappingRule-table {
    margin-left: 64px;
    max-height: 214px;
    background: #fff;
    overflow: scroll;
  }
  .step-volume-rules-select {
    margin-bottom: 50px;
    padding-left: @paddingBase * 8 - 2px;
    .step-volume-rules-select-radio {
      .grid-field-select {
        width: 100%;
        margin-right: 24px;
      }
    }
  }
  .select-archive-right-operate {
    display: flex;
    width: calc(100% - 48px);
    margin-left: 64px;
    .content {
      color: #1d2129;
      margin-left: 12px;
    }
    .right-operate-desc {
      width: 126px;
      line-height: 32px;
    }
    .choose-attachment {
      color: @black-8;
      font-size: 14px;
    }
    .upload-operate {
      display: flex;
      align-items: center;
      input {
        width: @marginBase*60;
        margin: 0 @marginBase*1.5;
        background-color: @white;
        cursor: pointer;
      }
      ::v-deep {
        .amber-upload {
          width: auto;
        }
        .amber-upload-button {
          background-color: @main;
          color: @white;
        }
      }
      .download-template {
        color: @blue-6;
        cursor: pointer;
        margin-left: @marginBase;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .table-box {
      width: calc(100% - 138px);
      height: 400px;
      ::v-deep .amber-table {
        width: 100%;
        overflow-x: hidden;
      }
      ::v-deep .amber-table-header-filterwrap {
        margin-left: 12px;
        padding-top: 8px;
      }
      ::v-deep .amber-table-all-aggrid {
        width: 100%;
        margin-left: 12px;
      }
      ::v-deep .amber-table-all-pagination {
        display: none;
      }
      .operate {
        display: flex;
        padding-left: 12px;
        .upload {
          width: unset;
        }
        .ant-btn-primary {
          margin-right: 8px;
        }
      }
    }
  }
  .mappingRule {
    .mappingRule-header {
      display: flex;
      align-items: center;
      margin: @marginBase 0;
      margin-left: 64px;
      .grid-field-select {
        width: 184px;
        margin: 0 @marginBase;
      }
      span {
        color: var(--light-text-color-text-2, #4e5969);
        text-align: right;
        font-family: 'PingFang SC';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        display: inline-block;
        height: 22px;
      }
    }
  }
  .cover--archives--box {
    margin-left: 64px;
    margin-bottom: 23px;
    .cover--archives--box--top {
      display: flex;
      align-items: center;
      margin-top: 16px;
      .cover--archives--box-select {
        width: 200px;
        margin-left: 16px;
      }
    }
  }
}
</style>
