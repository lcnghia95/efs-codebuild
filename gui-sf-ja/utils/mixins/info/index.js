import { filterInt } from '@@/utils/client/common'
import YearSlider from '@@/../components/info/YearSlider.vue'
import HeaderBrownLine from '@@/../components/common/HeaderBrownLine.vue'
export default {
  components: {
    YearSlider,
    HeaderBrownLine
  },
  methods: {
    onSelectYear(year) {
      location.href = `/info/${this.type ? this.type + '/' : ''}y/${year}/p/1`
    }
  },
  async asyncData({ params }) {
    let year = filterInt(params.y) || new Date().getFullYear(),
      type = params.type || null
    return {
      year,
      type
    }
  }
}