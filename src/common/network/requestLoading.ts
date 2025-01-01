import store from '@/store/index'
import _ from 'lodash'
class LoadingManager {
  count = 0
  isOpen = false

  //每次请求count++
  increase(url?: string) {
    this.count++
    url && console.log('count_up', url)
    this.refresh()
  }
  //请求结束或者请求失败count--
  decrease(url?: string) {
    this.count = Math.max(this.count - 1, 0)
    url && console.log('count_down', url)
    setTimeout(() => {
      this.refresh()
    })
  }
  refresh() {
    console.log('count', this.count)
    if (this.count > 0) {
      //同时也避免多次调用this.open方法
      !this.isOpen && this.open()
    } else {
      // 函数a,入参为一个函数b,0.5秒内,函数a 多次调用,只取最后一次来调用函数b
      _.throttle(() => {
        this.close()
      }, 500)()
    }
  }
  open() {
    //避免重复改变vuex中的值
    if (!store.getters.getLodingShow) {
      store.commit('setLoading', true)
    }
    this.isOpen = true
  }
  close() {
    if (this.isOpen) {
      store.commit('setLoading', false)
      console.log('经过节流之后的loading关闭!!!')
    }
    this.isOpen = false
  }
}
export default new LoadingManager()
