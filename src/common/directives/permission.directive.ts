import permissionService from '../permission/permission.service'

// 根据权限判断当前dom 是否可显示
const auth = {
  inserted: function (_el: any, binding: any) {
    let permissionCodeOrNames = binding.value
    while (permissionCodeOrNames.indexOf("'") !== -1) {
      permissionCodeOrNames = permissionCodeOrNames.replace("'", '')
    }
    const result = permissionService.check(permissionCodeOrNames)
    if (result) {
      _el.style.display = ''
    } else {
      _el.style.display = 'none'
    }
  },
}

const defaults: Record<string, unknown> = {
  auth,
}
export default defaults
