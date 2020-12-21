export default {
  methods: {
    localize(idxString) {
      let val = this.$t(idxString)
      return val === idxString ? '' : val
    },
  },
}
