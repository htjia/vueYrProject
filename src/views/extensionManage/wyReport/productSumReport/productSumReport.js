import PageHeaderLayout from '@/components/PageHeaderLayout'
import { find } from '@/api/extensionManage/wyReport/productSum'
export default {
  components: { PageHeaderLayout },
  data() {
    return {
      listLoading: false,
      list: [],
      month: this.getFormatDate()
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        month: this.month
      }
      find(requestParams).then(res => {
        this.list = res.data
        this.listLoading = false
      })
    },
    monthChange(month) {
      this.month = month
      this.fetchData()
    },
    rowStyle({ rowIndex }) {
      if (rowIndex >= 0 & rowIndex <= 7) {
        return 'background: rgb(240, 249, 248)'
      } else if (rowIndex > 7 & rowIndex <= 15) {
        return 'background: #FFEBFF'
      } else if (rowIndex > 15 & rowIndex <= 23) {
        return 'background: #CFF5FF'
      }
      return 'background: #FFFFFF'
    },
    tableRowClassColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 & rowIndex === 24) {
        return 'background: rgb(255, 255, 51)'
      }
    },
    getFormatDate() {
      var date = new Date()
      var month = date.getMonth() + 1
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      var currentDate = date.getFullYear() + '-' + month
      return currentDate
    },
    handleSearch() {
      this.fetchData()
    },
    exportAll() {
      window.open(process.env.BASE_API + `/wyReportProductSum/exportProductSum?month=${this.month}`)
    }
  }
}
