/**
 * 项目全局使用 cookie 的函数
 */
export class cookiesUtils {
  //获取cookie
  static getCookie(name: string): any {
    const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    const arr = document.cookie.match(reg)
    if (arr) {
      return arr[2]
    } else {
      return null
    }
  }

  //设置cookie,增加到vue实例方便全局调用
  static setCookie(c_name: string, value: string, expiredays?: number) {
    const exdate = new Date()
    expiredays && exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + '=' + escape(value) + (expiredays == null ? '' : ';expires=' + exdate.toString())
  }

  //删除cookie
  static delCookie(name: string) {
    const exp = new Date()
    exp.setTime(exp.getTime() - 1)
    const cval = cookiesUtils.getCookie(name)
    if (cval != null) document.cookie = name + '=' + cval + ';expires=' + exp.toString()
  }
}
