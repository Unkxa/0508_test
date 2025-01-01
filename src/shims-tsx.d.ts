/**
 * 允许你以.tsx结尾的文件，在Vue项目中编写jsx代码
 */
import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
