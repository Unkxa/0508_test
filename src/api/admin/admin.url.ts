export enum ApiUrl {
  getChangePassword = '/user/password/change', //修改密码
  allUnitOfUser = '/admin/all_unit_of_user', //全宗切换列表
  changeUnit = '/change/unit',
  updateDefaultUnit = '/user/update_default_unit', //设置主单位
  loginOut = '/login_out',
  getOperationLog = '/admin/get_event_log_by_operate_object_id', //日志
  userTreeFilter = '/admin/user_tree_filter', // 获取admin用户树
  getUserById = '/admin/get_user_by_id', // 通过用户id获取用户信息
}
