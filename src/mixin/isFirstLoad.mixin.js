export default {
  data() {
    return {
      IS_FIRST_LOAD: true,
    }
  },
  deactivated() {
    this.IS_FIRST_LOAD = false
  },
}
