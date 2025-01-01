<template>
  <a-modal
    title=""
    :visible="show"
    width="520px"
    :footer="null"
    :closable="false"
    :mask="false"
    :maskClosable="true"
    @cancel="closeModal"
    class="r-current-unit-modal"
  >
    <div>
      <div class="unit-header">
        <a-select
          :value="searchParams.quality"
          @change="changeSelect"
          class="select-op"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode || document.body"
        >
          <a-select-option value="all">所有</a-select-option>
          <!-- <a-select-option value="village">村、社区</a-select-option> -->
          <a-select-option value="archives">档案馆</a-select-option>
          <!-- <a-select-option value="office">镇、街、部门、直属单位</a-select-option> -->
        </a-select>
        <a-input v-model="searchParams.keyWord" @pressEnter="inputKeyWord" placeholder="请输入关键字">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <div class="major">
        <span class="label-before">·</span>
        <span class="unit-label">主单位：</span>
        <span v-if="major">{{ major.name && major.fonds ? major.name + '-' + major.fonds : '' }}</span>
      </div>
      <ul v-if="pageResult" class="unit-list">
        <li
          v-for="item in pageResult.data"
          :key="item.id"
          :class="userCurrentUnit.code === item.code ? 'active' : ''"
          @click.stop="changeUnit(item)"
        >
          <span :title="item.name + '_' + item.fonds" class="unit-name-fonds text-overflow-hidden">
            {{ item.name }}{{ item.fonds ? '-' + item.fonds : '' }}</span
          >
          <span>
            <!-- <a-button
              v-if="major.id !== item.id"
              class="major-button"
              @click.stop="setMajor(item.code)"
              type="default"
              size="small"
            >
              设为主单位
            </a-button>
            <a-button
              v-if="userCurrentUnit.code !== item.code"
              class="major-button"
              @click.stop="changeUnit(item)"
              type="primary"
              size="small"
            >
              切换单位
            </a-button> -->
          </span>
        </li>
        <li v-if="!pageResult || pageResult.data.length === 0" class="empty-placeholder">
          <span>暂无数据</span>
        </li>
      </ul>
      <div class="unit-footer">
        <div>共 {{ pageResult.total || 0 }} 条</div>
        <!-- todo yc 没有分页功能 -->
        <a-pagination simple :defaultCurrent="pageResult.page" size="20" :total="pageResult.total" />
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import store from '@/common/toolFun/initStore'
import adminApi from '@/api/admin/admin.api'
import ENV from '@/common/config'
import _ from 'lodash'
import { message } from 'ant-design-vue'
import { Vue, Component, PropSync, Watch } from 'vue-property-decorator'

interface DataItem {
  id?: number
  name?: string
  code?: string
  fonds?: string
}

type Page = {
  page: number
  total: number
  data: DataItem[]
}
@Component({})
export default class SetCurrentUnit extends Vue {
  @PropSync('visible', { type: Boolean }) show!: boolean

  searchParams = {
    quality: 'all',
    keyWord: '',
  }

  major = {
    id: 0,
    name: '',
    fonds: '',
  }
  // 分页数据----
  pageResult: Page = {
    page: 1,
    total: 0,
    data: [],
  }
  userCurrentUnit = {
    code: '',
  }

  @Watch('show')
  onChildChanged(val: boolean) {
    if (val) {
      this.userCurrentUnit = store.getFolderInfoByKey('unit')
    }
  }
  created() {
    this.getUnitList()
  }

  // 初始化函数----------------------------
  async getUnitList(data?: { quality: any; keyWord: any } | undefined) {
    const quality = this.getQuality()
    const body = {
      keyWord: '',
      pageDTO: {
        currentPage: this.pageResult.page || 1,
        pageSize: 20,
      },
      quality: quality,
    }
    if (data) {
      const { quality, keyWord } = data
      body.quality = quality
      body.keyWord = keyWord
    }
    // const res: any = await adminApi.allUnitOfUser(body)
    // this.major = res.content?.major || null
    this.pageResult = {
      ...this.pageResult,
      // ...res.content.pageResultDTO,
    }
  }

  // 事件----------------------------

  // 修改地区设置
  changeSelect(val: any) {
    this.searchParams = {
      ...this.searchParams,
      quality: val,
    }
    const quality = this.getQuality(val)
    this.getUnitList({ ...this.searchParams, quality })
  }
  //输入事件
  inputKeyWord() {
    const quality = this.getQuality(this.searchParams.quality)
    this.getUnitList({ ...this.searchParams, quality })
  }
  // 关闭model
  closeModal() {
    this.show = false
  }

  // 设置主单位
  async setMajor(unitCode: any) {
    console.log('主单位：', unitCode)
    const userLoginName = store.getFolderInfoByKey('user')?.loginName
    const res: any = await adminApi.updateDefaultUnit({ userLoginName, unitCode })
    if (res) {
      message.success('设置成功！')
      this.closeModal()
      this.$emit('setMajor')
    }
  }
  /**
   * 切换全宗
   */
  async changeUnit({ code, name }: DataItem) {
    console.log('切换单位:', code, name)
    await adminApi.changeUnit(code)
    this.$router.push({
      path: '/homePage',
    })
    let goto = window.location.href
    goto = goto.split('?')[0]?.split('#')[1]
    setTimeout(() => {
      store.removeFolderInfoByKey(['user', 'unit', 'grade'])
      location.reload()
    }, 200)
  }
  // 工具函数----------------------------
  /**
   * 机构性质集合。性质定义 -》 1：镇街、2：机关、3：平台、4：村 5、档案馆 6、立档单位 7、档案服务企业
   * 查询条件 >  所有 : all    村、社区 village      档案馆 archives     镇、街、部门、直属单位 office
   */
  getQuality(codeStr?: string) {
    let data: any[] = []
    const code = codeStr || 'all'
    switch (code) {
      case 'all':
        data = [1, 2, 3, 4, 5, 6, 7]
        break
      case 'village':
        data = ['4']
        break
      case 'archives':
        data = ['5']
        break
      case 'office':
        data = ['1,6']
        break
    }
    return data
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styleSpecial/global.params.less';

.r-current-unit-modal {
  ::v-deep .ant-modal {
    top: 60px;
    left: calc(100vw - 536px);
    margin: unset;

    .ant-modal-content {
      box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.2);
    }

    .ant-modal-body {
      padding: @paddingBase * 2 !important;
    }
  }

  .unit-header {
    display: flex;
    align-items: center;
    width: 100%;

    .select-op {
      width: 136px;
      margin-right: 8px;
    }
  }

  .major {
    margin-top: 8px;
    display: flex;
    align-items: center;

    .unit-label {
      font-weight: bold;
      font-size: 14px;
      color: @textTitle;
    }

    .label-before {
      font-size: 30px;
      color: #1e88e5;
      margin-right: 4px;
    }

    > span {
      line-height: 32px;
      display: block;
    }
  }

  .unit-list {
    width: 100%;
    max-height: 300px;
    overflow: scroll;
    padding: 0;
    padding-right: 0;
    padding-bottom: 0;
    margin-top: 8px;

    > li {
      padding: 0 8px;
      margin-bottom: 2px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    > li:hover {
      background-color: #efeff0;
      cursor: pointer;

      .major-button {
        display: inline-block;
        margin-left: 8px;
      }
    }

    .active {
      background-color: #efeff0;
      cursor: no-drop !important;
    }

    .major-button {
      display: none;
      margin-left: 8px;
    }

    .unit-name-fonds {
      display: inline-block;
      width: 210px;
    }
  }

  .unit-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }
}
</style>
