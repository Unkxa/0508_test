/**
 * @fileoverview 全局指令入口
 */
import permission from './permission.directive'
import noDataDirective from './noData.directive'
import loadingDirective from './loading.directive'

export default {
  ...permission,
  ...noDataDirective,
  ...loadingDirective,
}
