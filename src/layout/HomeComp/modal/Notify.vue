<template>
  <a-modal
    :visible="show"
    :maskClosable="false"
    @cancel="onCancel"
    :closable="false"
    :width="650"
    :bodyStyle="{ height: getHeight() + 'px', overflow: 'auto' }"
  >
    <template slot="title">
      <div class="titleRow">
        <div>通知</div>
        <a-radio-group :value="allOrNotRead" @change="changeRadio">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="notRead">未读</a-radio-button>
        </a-radio-group>
        <div v-if="allOrNotRead == 'notRead'" class="all-read" @click="allRead">标记已读</div>
        <div v-if="allOrNotRead == 'all'" class="all-read" @click="clear">清空</div>
      </div>
    </template>
    <!-- 无数据 -->
    <div v-if="dataList.length == 0">
      <div class="no-data">
        <!-- <img referrerpolicy="no-referrer" src="@/assets/images/no--message.jpg" /> -->
        <p>您当前没有任何待处理的消息</p>
      </div>
    </div>
    <!-- 有数据 -->
    <div class="message-box" v-if="dataList.length != 0">
      <ul>
        <li class="message-item" v-for="(item, index) of dataList" :key="index">
          <div class="icon iconfont FCxiangqing"></div>
          <div class="content">
            <div @click.stop="goto(item)">{{ item.title }}</div>
            <div>发送时间 : {{ item.sendTime }}</div>
            <div>数据来源 : {{ item.filingUnit }}</div>
          </div>
        </li>
        <li class="more--show" @click="getMoreNotifyList">显示更多</li>
      </ul>
    </div>

    <template slot="footer">
      <a-button @click="onCancel"> 关闭 </a-button>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Watch, Ref } from 'vue-property-decorator'
import messageApi from '@/api/message/message.api'
import downloadApi from '@/api/downloadApi/download.api'
import ENV from '@/common/config'
import { saveFile } from '@/common/toolFun/util'
@Component({})
export default class Notify extends Vue {
  @PropSync('visible', { type: Boolean }) show!: boolean
  /**全部 / 未读 */
  allOrNotRead = 'all'
  dataList = []
  pageSize = 3

  mounted() {
    this.getList()
  }
  getHeight() {
    return this.pageSize == 3 ? 375 : 500
  }
  async getList() {
    const data = {
      columns: [
        {
          filterConditionCode: 6,
          name: 'da_read_state',
          type: 'string',
          value: this.allOrNotRead == 'all' ? '' : '02',
        },
      ],
      pagingSort: {
        currentPage: 1,
        endIndex: 0,
        pageCount: 0,
        pageSize: this.pageSize,
        sortField: '',
        sortFieldType: 'da_send_time',
        sortWay: 'desc',
        totalCount: 0,
      },
      queryConditionByColumnFields: '',
      sortList: [
        {
          sortField: 'da_send_time',
          sortWay: 'desc',
        },
      ],
    }
    const res = await messageApi.getMassageList(data)
    this.dataList = res?.result
  }

  changeRadio(e: any) {
    this.pageSize = 3
    this.allOrNotRead = e.target.value
    this.getList()
  }

  goto(item: any) {
    if (item.title.includes('任务催办')) return
    if (item.content?.split(':')[0] == '鉴定批次详情id') {
      //跳转
      const queryParams: any = {
        id: item.content?.split(':')[1],
        identifyType: 0,
        way: 'identifyTask',
        //  name:'启动鉴定',
        approvalType: 'opening_appraisal',
      }
      let params = ''
      for (const item in queryParams) {
        //拼接 id='123'&identifyType='0'&way=......
        params += `${item}=${queryParams[item]}&`
      }
      window.open(`${`${ENV.baseUrl}` + 'identifyApproval' + '?'}${params}`)
    } else if (item.content?.split(':')[0] == '待办任务条目') {
      const res = JSON.parse(item.content.replace(`${item.content.split(':')[0]}:`, ''))
      const queryParams: any = {
        id: res.businessKey,
        taskId: res.id,
        taskDefinitionKey: res.taskDefinitionKey,
        processDefinitionId: res.processDefinitionId,
        processInstanceId: res.processInstanceId,
        approvalType: res.processType,
        type: 'todo_work_list',
        name: res.name,
        //是否从消息列表跳转
        message: '1',
      }
      let params = ''
      for (const item in queryParams) {
        params += `${item}=${queryParams[item]}&`
      }
      params = params.slice(0, params.length - 1)
      window.open(`${`${ENV.baseUrl}` + 'identifyApproval' + '?'}${params}`)
    } else if (item.title.includes('原文共享')) {
      //共享页面跳转
      //跳转
      const queryParams: any = {
        Company: '其他单位共享档案/档案原文共享',
      }
      let params = ''
      for (const item in queryParams) {
        params += `${item}=${queryParams[item]}&`
      }
      window.open(`${`${ENV.baseUrl}` + 'useOfManagement/fileSharing' + '?'}${params}`)
    } else if (item.title.includes('本次拆包失败')) {
      //TODO 暂无到期处置模块
      // this.$router.push({ path: '/archiveManage/destoryManage/stayForTurn' })
      // this.onCancel()
    } else if (item.title.includes('移交批次')) {
      // this.$router.push({ path: '/archiveManage/destoryManage/HandoverBatch' })
      // this.onCancel()
    }
  }

  /**显示更多 */
  getMoreNotifyList() {
    this.pageSize += 5
    this.getList()
  }

  /**
   * 标记已读
   */
  async allRead() {
    await messageApi.readAll()
    this.getList()
  }

  /**
   * 清空
   */
  async clear() {
    await messageApi.clearAll()
    this.getList()
  }
  /**
   * 关闭
   */
  onCancel() {
    this.show = false
    this.$store.dispatch('setNotify', false)
  }
}
</script>
<style lang="less" scoped>
.titleRow {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .all-read {
    font-size: 12px;
    color: gray;
    cursor: pointer;
  }
}
.no-data {
  text-align: center;
}
.message-item {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  border-bottom: 1px solid #e3e3e3;
  padding-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
  .content {
    cursor: pointer;
    flex-direction: column;
  }
}
.icon {
  font-size: 32px;
  color: #dba50e;
  margin-right: 16px;
}
.more--show {
  display: block;
  text-align: center;
  cursor: pointer;
  color: #1e87e5;
  padding: 10px 0 0;
}
.message-box {
  height: 100%;
  overflow: scroll;
}
</style>
