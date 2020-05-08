
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { exceptionList, confirmException } from '@/api/extensionManage/audit/warehousing'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      billNo: '',
      status: 0,
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
      waferId: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
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
      this.status = ''
      this.billNo = ''
      this.beginDate = ''
      this.endDate = ''
      this.waferId = ''
      this.handleSearch()
    },
    // 单击单据信息
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
      this.anotherList = row.wafers
      this.waferTol = row.wafers.length
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
        billNo: this.billNo,
        status: this.status,
        waferId: this.waferId,
        confirmKey: 0
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      exceptionList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        this.anotherList = []
        this.waferTol = 0
        if (this.list.length > 0) {
          this.$refs.listTabel.setCurrentRow(this.list[0])
          // this.handleCurrentChange(this.list[0])
        }
      })
    },
    confirmNew(row) {
      this.$confirm('是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var list = []
        for (const li of row.wafers) {
          list.push({
            waferId: li.waferId,
            levelId: li.newVisualId,
            reasonId: li.newReasonId
          })
        }
        const params = {
          billNo: row.billNo,
          auditor: sessionStorage.getItem('User-Id'),
          list: list
        }
        confirmException(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '确认成功!'
            })
            this.fetchData()
          }
        })
      })
    }
  }
}

