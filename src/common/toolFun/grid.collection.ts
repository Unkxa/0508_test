/**
 * @description 项目使用的表格组件 配置 以及展示模板
 */
/**
 * 自动加上title 表格列 取列的value 值取展示
 * @param params
 * @returns
 */
export const cellRendererTitle = (params: any) => {
  return `<span class="grid--name--column">
    <a class="grid--name"  title="${params.value || ''}" >${params.value || ''}</a>
  </span>`
}
/**
 * gridCheckBox 表格 第一列的 可选配置
 */
export const gridCheckBox = {
  headerName: '',
  field: '',
  maxWidth: 45,
  checkboxSelection: true, //设置为ture显示为复选框
  headerCheckboxSelection: true, //表头是否也显示复选框，全选反选用
  resizable: true,
  suppressSizeToFit: true,
}

export const gridSortBox = {
  field: 'order',
  headerName: '序号',
  width: 52,
  suppressSizeToFit: true,
  cellRenderer: (params: any) => parseInt(params.node.id) + 1,
  cellStyle: {
    'text-align': 'center',
  },
}
