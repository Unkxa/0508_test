## 四川-行政管理平台

### 需求文档地址： 迭代 1:-https://amberdata.yuque.com/okq86h/xl78ri/ri34c6dgfpboafi4#ZagG

### 规范参考地址：https://amberdata.yuque.com/qqh85l/lguzve/tr5iv8cwygwv0d10

### 公司内部组件库：http://dvb.amberdata.cn/amberdv/zh/guide/

### 打包发布命令：npm run cdn_push;会生成一串带有账户和时间的哈希值

### git 分支管理/提交规范:https://amberdata.yuque.com/qqh85l/uggbsz/pgza27

### 页签缓存方案：https://amberdata.yuque.com/okq86h/ny8dn9/robnnyfzc2ga5tzu

### 技术架构

> _Node v14.12.0_ + _Vue v2.7.14_ + _Vuex v3.6.2_ + _AntDesignVue v1.7.8_ + _Element-ui v2.15.14_

### 文件目录说明

- src 存放 Vue 相关业务代码
  - > api 全局公共请求方法
  - > assets 静态资源文件
  - > components 全局公共组件
  - > router 路由文件
  - > store 存放公共 vuex
  - > styles 存放公共样式
  - > utils 工具集

### 开发说明

- 一定要看上方公司内部的前端规范，可以使用 AI 工具优化代码
- vue 版本升级到了vue@2.7.14,支持 veu3 语法使用
- 不要在全局挂载过多东西,对于某些包体积过大的情况下，可以看一下有没有平替方案
- 对于自己的远程分支，要合并后勾选删掉，保持分支纯净
