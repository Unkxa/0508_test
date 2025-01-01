<template>
  <ab-modal :maskClosable="false" :visible="visible" :width="960" title="导入日志" @cancel="cancel" centered>
    <template slot="content">
      <div class="table-box">
        <ab-table
          ref="abTable"
          @change="change"
          :buttons="buttons"
          :filters="filters"
          @click="tableClick"
          :gridOptions="gridOptions"
          :pagination="pagination"
        />
      </div>
    </template>
    <template slot="footer">
      <a-button @click="cancel">关闭</a-button>
    </template>
  </ab-modal>
</template>

<script>
import tableMinxin from '@/mixin/table.mixin'
import { columnDefs } from './column'
import ExportResultGrid from './exportResultGrid.vue'
import ExportStatusGrid from './exportStatusGrid.vue'
import downloadApi from '@/api/downloadApi/download.api'
import { saveFile } from '@/common/toolFun/util'
import _moment from 'moment'
import ArchivalPublicityApi from '@/api/archivalPublicity/archivalPublicity.api'
import ENV from '@/common/config'

export default {
  name: 'ViewLogModal',
  mixins: [tableMinxin],
  components: { ExportResultGrid, ExportStatusGrid },
  props: {
    visible: {
      type: Boolean,
    },
    classification: {
      type: String,
    },
  },
  data() {
    return {
      gridOptions: {
        columnDefs: columnDefs,
        rowData: [],
      },
      filters: {
        mode: 'auto',
        options: [
          {
            type: 'date',
            field: 'operationDate',
            label: '操作时间',
            placeholder: ['开始时间', '结束时间'],
            options: {
              format: 'YYYY-MM-DD',
            },
          },
        ],
      },
      buttons: {
        type: 'horizontal',
        options: [],
      },
    }
  },
  created() {
    this.getList()
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
        case 'lookInfo':
          window.open(`${ENV.baseUrl}preview?path=${row.importFileInfo.filePath}`)
          break
        case 'exportUploadFile':
          this.exportUploadFile(row)
          break
        case 'downLoad':
          this.download(row)
          break
        case 'deleteInfo':
          this.deleteInfo(row)
          break
      }
    },
    // 获取列表数据
    async getList() {
      try {
        this.gridOptions.loading = true
        this.$refs?.abTable?.gridOptionsDeal.api.deselectAll()
        const info = {
          pagingSort: this.pagination,
          columnConditions: {
            classification: {
              value: this.classification,
              filterConditionCode: 5,
            },
          },
        }
        this.$refs?.abTable?.getFilters()?.then(async (values) => {
          let columnConditions = {}
          if (values.operationDate.length) {
            let startTime = _moment(values.operationDate[0]).format('YYYY-MM-DD')
            let endTime = _moment(values.operationDate[1]).format('YYYY-MM-DD')
            columnConditions = Object.assign(columnConditions, {
              operationDate: { value: { left: startTime, right: endTime }, filterConditionCode: 8 },
            })
          }
          info.columnConditions = columnConditions
        })
        let res = await ArchivalPublicityApi.importLogQueryByParams(info)
        this.gridOptions.rowData = res.records
        this.pagination.total = res.total
        this.gridOptions.loading = false
      } catch (e) {
        this.gridOptions.loading = false
      }
    },
    async download(row) {
      console.log('row', row)

      let fileName =
        row.createDate.substring(0, 10) +
        '_' +
        row.createDate.substring(12).split(':').join('-') +
        '导入失败清单' +
        '.' +
        row.failFileInfo.extension
      let info = {
        path: row.failFileInfo.filePath,
        fileName: fileName,
      }
      const response = await downloadApi.resourceDownload2(info)
      saveFile(response)
    },
    exportUploadFile(row) {
      console.log('row', row)
    },
    async deleteInfo(row) {
      this.$customPrompt({
        msg: '确认要进行删除吗？',
        describe: '删除后无法查看日志，并且无法恢复',
      })
        .then(async () => {
          await ArchivalPublicityApi.importLogDeleteById(row.id)
          this.$abNotification.open({
            type: 'success',
            message: '操作成功',
            description: '日志已删除成功',
          })
          this.getList()
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 当表格搜索项、分页
    change($event, current, pageSize) {
      this.pagination.currentPage = current
      this.pagination.pageSize = pageSize
      this.getList()
    },
    cancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<style lang="less" scoped>
::v-deep .scroll {
  padding: 0;
}
.table-box {
  height: 420px;
}
</style>
