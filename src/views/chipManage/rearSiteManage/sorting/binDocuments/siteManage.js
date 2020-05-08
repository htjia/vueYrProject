
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findRepeat } from '@/api/chipManage/rearSiteManage/sorting/binDocuments'
import { printLabel } from '@/api/pcChipCasting/pcChipCasting'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      list: [],
      beginDate: '',
      endDate: '',
      createName: '',
      binNo: '',
      type: '',
      typeList: [
        {
          id: 0,
          name: '正常'
        },
        {
          id: 1,
          name: '异常'
        }
      ],
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearSearch() {
      this.beginDate = ''
      this.endDate = ''
      this.createName = ''
      this.binNo = ''
      this.type = ''
      this.pageNum = 1
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        createName: this.createName,
        binNo: this.binNo,
        type: this.type
      }
      findRepeat(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    printLabelagain(row) {
      const conetnt = [
        { key: 'binNo', value: row.binNo },
        { key: 'barcode', value: row.barcode },
        { key: 'startTime', value: row.startTime },
        { key: 'endTime', value: row.endTime },
        { key: 'qt', value: row.qt },
        { key: 'num', value: row.num }
      ]
      if (row.type === 1) {
        const paramslist = {
          module: 'lowerBinPrintRepeat',
          contents: [conetnt]
        }
        printLabel(paramslist).then(res => {
          this.$message({
            type: 'success',
            message: '正在准备打印!'
          })
        })
      } else {
        const paramslist = {
          module: 'lowerBinPrint',
          contents: [conetnt]
        }
        printLabel(paramslist).then(res => {
          this.$message({
            type: 'success',
            message: '正在准备打印!'
          })
        })
      }
    }
  }
}

