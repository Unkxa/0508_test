export default {
  data() {
    return {
      unwatches: [],
      watches: [],
      isload: false,
    }
  },
  mounted() {
    if (!this.isload) {
      this.isload = true
      this.executionWatch()
    }
  },
  activated() {
    if (!this.isload) {
      this.isload = true
      this.executionWatch()
    }
  },
  deactivated() {
    if (this.unwatches) {
      this.unwatches.forEach((unwatch) => unwatch())
      this.unwatches = []
      this.isload = false
    }
  },
  methods: {
    Watch(watches) {
      this.watches = watches
    },
    // 执行监听
    executionWatch() {
      this.watches.forEach((w) => {
        const watchOptions = {}
        if (w.deep) {
          watchOptions.deep = true
        }
        this.unwatches.push(this.$watch(w.key, w.handler, watchOptions))
        if (w.immediate) {
          w.immediate = false
          const value = this.getValueByPath(this, w.key)
          w.handler(value)
        }
      })
    },
    getValueByPath(obj, path) {
      return path.split('.').reduce((o, i) => o[i], obj)
    },
  },
}
