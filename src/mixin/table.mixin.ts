// ad-table 公共部分提取出来使用
import { Vue, Component } from 'vue-property-decorator'
interface FilterObj {
  [key: string]: any; 
}

@Component({})
export default class MyMixin extends Vue {
  $OLD_PAGE_SIZE: number | string | null = null // 存过去的分页参数 只有分页参数变化了才调用 changeCallBack
  $OLD_CURRENT: number | string | null = null
  sortList: any = []
  selectedRows = []
  gridOptions = {
    loading: false,
    columnDefs: [],
    rowData: [],
    noRowsOverlayComponentParams: {
      config: {},
    },
    onSortChanged: (e: any) => {
      this.onSortChanged(e.columnApi.getColumnState().filter((item: any) => item.sort)[0])
    },
  } //列表配置
  pagination = {
    total: 0,
    currentPage: 1,
    pageSize: 50,
    pageSizeOptions: ['10', '50', '100', '200', '500', '1000'],
  }

  getSelectedRows(rows: any[]) {
    (this as any).selectedRows = rows
    console.log(rows)
  }
  // 拼接请求参数 使用
  // tableClick(event, handler, row) { },
  onInfoSet(params: { page: { currentPage: any; pageSize: any } }, columnConditions = {}, sortList = []) {
    const info = {
      columnConditions: { ...columnConditions },
      pagingSort: {
        currentPage: params.page.currentPage || 1,
        pageSize: params.page.pageSize,
        totalCount: 0,
      },
      sortList: !!sortList.length ? sortList : this.sortList,
    }
    return info
  }
  newOnInfoSet(params: { page: { currentPage: any; pageSize: any } }, columns = {}) {
    const info = {
      ...columns,
      pagingSort: {
        currentPage: params.page.currentPage || 1,
        pageSize: params.page.pageSize,
        totalCount: 0,
      },
      sortList: this.sortList,
    }
    return info
  }
  // 获取当前 table 搜索 参数的json 对象
  async getFilterValues(): Promise<unknown> {
    return await (this as any).$refs.abTable.getFilters()
  }
  onSortChanged(e: any) {
    this.sortList = []
    if (e) {
      this.sortList = [
        {
          sortField: e.colId,
          sortWay: e.sort,
        },
      ]
    } else {
      this.sortList = []
    }
    this.getList()
  }
  getList() {
    // 获取列表数据
  }

  /**
   * 获取分页筛选信息
   * !!注意!!使用时需要确保给table设置了ref为table 否则需要传对应的ref名称
   * 因为组件库提供的 getFilters()是异步事件导致这个也只能是异步
   * */
  async getPaginationAndFilters( newFilters = false , refName = 'abTable') {
    const sortList: any[] = this.sortList
    const filterList = await this.getSearchParams(refName)
    const paging = this.pagination
    const pagingSort = { currentPage: 1, pageSize: 50 }
    const filterObj: any = {}
    pagingSort.currentPage = paging.currentPage
    pagingSort.pageSize = paging.pageSize

    this.$OLD_PAGE_SIZE = pagingSort.pageSize
    this.$OLD_CURRENT = pagingSort.currentPage
    if (filterList) {
      for (const key in filterList) {
        if (Object.prototype.hasOwnProperty.call(filterList, key)) {
          const value = filterList[key]
          if (value) {
            filterObj[key] = value
          }
        }
      }
    }
    if(!newFilters){
      return { ...filterObj, pagingSort, sortList }
    }
    const columnConditions:FilterObj = {}
    for (const key in filterObj) {
        const value = filterObj[key];
        columnConditions[key] = {
          filterConditionCode: 6,
          value,
        }
    }
    return { columnConditions , pagingSort , sortList }
  }

  //列表单击事件
  tableClick(event: any, handler: string, row: any) {
    if (
      handler &&
      typeof handler === 'string' &&
      (this as any)[handler] &&
      typeof (this as any)[handler] === 'function'
    ) {
      ;(this as any)[handler](row, event)
    } else {
      console.error('方法未定义:' + handler)
    }
  }
  //分页器修改事件
  async change(e: number, c: number, p: number) {
    if (c != this.$OLD_CURRENT || p != this.$OLD_PAGE_SIZE) {
      this.pagination.currentPage = c
      this.pagination.pageSize = p
      this.changeCallBack(e, c, p)
    }else{
      this.searchChangeBack(await this.getSearchParams())
    }
    this.getList()
    return false
  }
  /**
   * 分页器回调
   * */
  changeCallBack(e: number, c: number, p: number) {
    console.warn('分页器回调事件 changeCallBack 未定义:', e, c, p, '若不需要可以忽视')
    return true
  }

  /**
   * 筛选回调
  */
  searchChangeBack(params : any ) {
    console.warn('筛选回调回调事件 searchChangeBack 未定义:', params, '若不需要可以忽视')
    return true
  }

  /**
   * 重置回调
   * */
  resetCallBack() {
    console.warn('重置事件回调事件若不需要可以忽视')
    return true
  }
  /**
   * 重置查询条件
   */
  resetFilter(refName = 'abTable') {
    ;(this.$refs[refName] as any)?.form?.resetFields()
    this.resetCallBack()
    this.getList()
  }
  /**
   * 获取查询条件
   */
  async getSearchParams(refName = 'abTable') {
    const filterList = await (this.$refs[refName] as any)?.getFilters()
    return filterList
  }

  async getFilterParams(refName = 'abTable') {
    const params = await this.getSearchParams(refName)
    for (const key in params) {
      if (!params[key]) {
        delete params[key]
      }
    }
    return params
  }
}
