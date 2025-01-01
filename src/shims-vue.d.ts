/**
 * shims-vue.d.ts的作用
 * 为了 typescript 做的适配定义文件，因为.vue 文件不是一个常规的文件类型，ts 是不能理解 vue 文件是干嘛的，
 * 加这一段是是告诉 ts，vue 文件是这种类型的。
 * 可以把这一段删除，会发现 import 的所有 vue 类型的文件都会报错。
 */

// 扩展全局属性类型
// import VueRouter, { Route } from 'vue-router';
declare module '*.vue' {
  import Vue from 'vue'
  declare module 'vue/types/vue' {
    interface Vue {
      _get: any // 全局方法
      $objTree: any
      i18nTransfer: any
      document: any
    }
  }

  export default Vue
}

// declare global {
//   function _get(params: string): string
//   document:any
// }

declare module 'xml-objtree'
declare module 'amber-design-vue'
declare module 'crypto-js'
declare module 'jquery'
declare module 'vue-animate-number'
declare module '@/mixin/isFirstLoad.mixin'
declare interface Window {
  EventBus: any
}
