
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryVisualDetail, matfindList } from '@/api/extensionManage/audit/warehousing'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      billNo: '',
      status: '',
      confirmList: [
        {
          id: 0,
          name: '未确认'
        },
        {
          id: 1,
          name: '已确认'
        }
      ],
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      anotherList: [],
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
      },
      listLoading: false,
      list: [],
      isActive: 0,
      waferTol: 0,
      runId: '',
      waferId: '',
      machineValue: '',
      machineOptions: [],
      supplier: ''
    }
  },
  mounted() {
    this.fetchData()
    this.matfindList()
  },
  methods: {
    matfindList() {
      matfindList().then(res => {
        this.machineOptions = res.data
      })
    },
    getNowFormatDate() {
      var today = new Date()
      return this.formatDate(today.getTime())
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    clearCondition() {
      this.runId = ''
      this.waferId = ''
      this.beginDate = ''
      this.endDate = ''
      this.machineValue = ''
      this.supplier = ''
      this.handleSearch()
    },
    // 单击单据信息
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
      // this.findWaferInfo()
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
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    // 单据信息/Wafer信息切换
    navClick(index) {
      this.isActive = index
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        runId: this.runId,
        waferId: this.waferId,
        machineId: this.machineValue,
        supplier: this.supplier
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      queryVisualDetail(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        if (this.list.length > 0) {
          this.$refs.listTabel.setCurrentRow(this.list[0])
          // this.handleCurrentChange(this.list[0])
        }
      })
    },
    exportAll() {
      let startTime = this.formatDate(this.beginDate)
      let endTime = this.formatDate(this.endDate)
      if (this.beginDate === '') {
        startTime = ''
      }
      if (this.endDate === '') {
        endTime = ''
      }
      window.open(process.env.BASE_API + `/zl-visual-amend/export-data-detail?runId=${this.runId}&waferId=${this.waferId}&machineId=${this.machineValue}&supplier=${this.supplier}&startTime=${startTime}&endTime=${endTime}`)
    }
  }
}

