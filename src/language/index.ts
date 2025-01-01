import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { cookiesUtils } from '@/common/toolFun/cookies'
// 针对接口返回的数据还是得采取 国际化
const language = cookiesUtils.getCookie('language') || 'zh'
cookiesUtils.setCookie('language', language)
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: language, //  语言标识
  messages: {
    zh: require('./config/ZH'), // 中文
    en: require('./config/EN'), // 英文
  },
})
export default i18n
