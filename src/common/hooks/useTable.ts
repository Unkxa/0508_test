import { ref, reactive } from 'vue'

interface TableOptions {
  changeCallBack?: Function
  [key: string]: any
}

export const useTable = (params: TableOptions) => {
  const selectedRows: any = ref([])
  const sortList: any = ref([])
  const pagination = reactive({
    total: 0,
    currentPage: 1,
    pageSize: 50,
    pageSizeOptions: ['10', '50', '100', '200', '500', '1000'],
  })
  const gridOptions = reactive({
    columnDefs: [],
    rowData: [],
    onSortChanged: (e: any) => {
      onSortChanged(e.columnApi.getColumnState().filter((item: any) => item.sort)[0])
    },
  })
  function onSortChanged(e: any) {
    sortList.value = []
    if (e) {
      sortList.value = [
        {
          sortField: e.colId,
          sortWay: e.sort,
        },
      ]
    } else {
      sortList.value = []
    }
    params.changeCallBack && params.changeCallBack()
  }
  function getSelectedRows(rows: any[]) {
    selectedRows.value = rows
  }
  function onInfoSet(
    params: { page: { currentPage: any; pageSize: any } },
    columnConditions = {},
    formalSortList = []
  ) {
    const info = {
      columnConditions: { ...columnConditions },
      pagingSort: {
        currentPage: params.page.currentPage || 1,
        pageSize: params.page.pageSize,
        totalCount: 0,
      },
      sortList: !!formalSortList.length ? formalSortList : sortList.value,
    }
    return info
  }

  function changePageSize($event: any, current: any, pageSize: any) {
    pagination.currentPage = current
    pagination.pageSize = pageSize
    params.changeCallBack && params.changeCallBack()
  }

  return {
    selectedRows,
    gridOptions,
    pagination,
    getSelectedRows,
    onInfoSet,
    changePageSize,
    onSortChanged,
  }
}
