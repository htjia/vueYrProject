
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryList, queryOneDetail, userList, qualityAssuranceAudit, counterTrial } from '@/api/extensionManage/audit/warehousing'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  directives: {
    'el-loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          /**
          * scrollHeight 获取元素内容高度(只读)
          * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
          * clientHeight 读取元素的可见高度(只读)
          * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
          * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
          */
          console.log(this.scrollTop)
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },
  data() {
    const validate = (rule, value, callback) => {
      const num = new RegExp('^-?\\d+$')
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('输入不能为空'))
      } else {
        if (!num.test(value)) {
          callback(new Error('输入必须为正整数'))
        } else {
          callback()
        }
      }
    }
    return {
      rowInfo: null,
      rowInfos: {
        auditResult: '',
        auditResults: '',
        auditTime: '',
        auditor: '',
        auditorName: '',
        billNo: '',
        createTime: '',
        creator: '',
        creatorName: '',
        editionType: '',
        id: '',
        operation: '',
        operationName: '',
        remark: '',
        structureType: '',
        substrateType: '',
        taker: '',
        takerName: '',
        takerTime: '',
        wyGiveSliceDetails: ''
      },
      anothertotalPage: 0,
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
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
      addDialogVisible: false,
      editDialogVisible: false,
      machineForm: {
        yzpMin: '',
        yzpMax: '',
        otherMin: '',
        otherMax: ''
      },
      rules: {
        yzpMin: [{ required: true, validator: validate, trigger: 'blur' }],
        yzpMax: [{ required: true, validator: validate, trigger: 'blur' }],
        otherMin: [{ required: true, validator: validate, trigger: 'blur' }],
        otherMax: [{ required: true, validator: validate, trigger: 'blur' }]
      },
      auditResult: '',
      examineSelectOptions: [
        {
          id: 1,
          name: '通过'
        },
        {
          id: 0,
          name: '不通过'
        },
        {
          id: 2,
          name: '待审核'
        }
      ],
      examineSelectOptions1: [
        {
          id: 1,
          name: '通过'
        },
        {
          id: 0,
          name: '不通过'
        }
      ],
      isActive: 0,
      anotherlist: [],
      isDisabled: false,
      printDialogVisible: false,
      userListOption: [],
      waferId: '',
      billNo: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleJP() {
      this.editDialogVisible = true
    },
    // 单据信息/Wafer信息切换
    navClick(index) {
      this.isActive = index
    },
    clearCondition() {
      this.billNo = ''
      this.waferId = ''
      this.beginDate = ''
      this.endDate = ''
      this.auditResult = ''
      this.handleSearch()
    },
    importExcel() {
      if (this.rowInfo !== null && this.rowInfo.id !== null) {
        window.open(process.env.BASE_API + `/wy-give-slice/export-give-slice?billNo=${this.rowInfo.billNo}`)
      } else {
        this.$message({
          type: 'error',
          message: '请选择要导出的入库单!'
        })
      }
    },
    checkAudit() {
      this.addDialogVisible = true
      this.rowInfos.billNo = this.rowInfo.billNo
      this.rowInfos.editionType = this.rowInfo.editionType
      this.rowInfos.substrateType = this.rowInfo.substrateType
      this.rowInfos.structureType = this.rowInfo.structureType
      this.rowInfos.creatorName = this.rowInfo.creatorName
      this.rowInfos.operationName = this.rowInfo.operationName
      this.rowInfos.createTime = this.rowInfo.createTime
      this.rowInfos.remark = this.rowInfo.remark
      this.rowInfos.auditor = this.rowInfo.auditor
      this.rowInfos.auditTime = (this.rowInfo.auditTime !== null && this.rowInfo.auditTime !== '') ? this.rowInfo.auditTime : this.formatDate(new Date())
      this.rowInfos.auditResult = ''
      this.rowInfos.auditResults = this.rowInfo.auditResult
      if (this.rowInfo.auditResult !== null && this.rowInfo.auditResult !== '2') {
        this.rowInfos.auditResult = parseInt(this.rowInfo.auditResult)
      }
      this.userLists()
    },
    printDiv() {
      this.printDialogVisible = false
      this.$print(this.$refs.print)
    },
    report() {
      if (this.rowInfo !== null && this.rowInfo.billNo !== null && this.rowInfo.billNo !== '') {
        this.rowInfos.printDate = this.getCurrentTime()
        this.printDialogVisible = true
        this.rowInfos.billNo = this.rowInfo.billNo
        this.rowInfos.editionType = this.rowInfo.editionType
        this.rowInfos.substrateType = this.rowInfo.substrateType
        this.rowInfos.structureType = this.rowInfo.structureType
        this.rowInfos.creatorName = this.rowInfo.creatorName
        this.rowInfos.takerName = this.rowInfo.takerName
        this.rowInfos.takerTime = this.rowInfo.takerTime
        this.rowInfos.auditorName = this.rowInfo.auditorName
        this.rowInfos.operationName = this.rowInfo.operationName
        this.rowInfos.createTime = this.rowInfo.createTime
        this.rowInfos.remark = this.rowInfo.remark
        this.rowInfos.auditor = this.rowInfo.auditor
        this.rowInfos.auditTime = this.rowInfo.auditTime
        this.rowInfos.auditResult = ''
        this.rowInfos.auditResults = this.rowInfo.auditResult
        if (this.rowInfo.auditResult !== null && this.rowInfo.auditResult !== '2') {
          this.rowInfos.auditResult = parseInt(this.rowInfo.auditResult)
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要打印的单据!'
        })
      }
    },
    loadMore() {
      console.log(1231)
    },
    userLists() {
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      userList(params).then(res => {
        this.userListOption = res.data.list
      })
    },
    // 单击单据信息
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
      if (this.rowInfo.operation === '0') {
        this.rowInfo.operationName = '送片'
      } else if (this.rowInfo.operation === '1') {
        this.rowInfo.operationName = '送样'
      } else if (this.rowInfo.operation === '2') {
        this.rowInfo.operationName = '破坏测试'
      }
      this.queryOneDetail()
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
    chanceList() {
      this.innerVisible = false
      this.selectList = []
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
    // 查询
    fetchData() {
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        billNo: this.billNo,
        waferId: this.waferId,
        auditResult: this.auditResult,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      queryList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        this.anothertotalPage = 0
        if (this.list.length > 0) {
          this.$refs.listTabel.setCurrentRow(this.list[0])
          // this.handleCurrentChange(this.list[0])
        }
      }, res => {
        this.listLoading = false
      })
    },
    queryOneDetail() {
      const params = {
        pageSize: 1000000,
        pageNum: 1,
        billId: this.rowInfo.id,
        waferId: this.waferId
      }
      queryOneDetail(params).then(res => {
        this.anotherlist = res.data.list
        this.anothertotalPage = parseInt(res.data.total)
        this.listLoading = false
      }, res => {
        this.listLoading = false
      })
    },
    getCurrentTime() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var myddy = date.getDay()// 获取存储当前日期
      var weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      return year + '-' + month + '-' + day + ' ' + weekday[myddy]
    },
    qualityAssuranceAudit() {
      if (this.rowInfos.auditor === null || this.rowInfos.auditor === 0) {
        this.$message({
          type: 'warning',
          message: '请选择审核人!'
        })
        return
      }
      if (this.rowInfos.auditResult === null || this.rowInfos.auditResult === '') {
        this.$message({
          type: 'warning',
          message: '请选择审核状态!'
        })
        return
      }
      const params = {
        auditResult: this.rowInfos.auditResult,
        auditor: this.rowInfos.auditor,
        billNo: this.rowInfos.billNo
      }
      qualityAssuranceAudit(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '审核完成!'
          })
          this.addDialogVisible = false
          this.fetchData()
        }
      })
    },
    checkBack() {
      const params = {
        billNo: this.rowInfos.billNo
      }
      counterTrial(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '反审完成!'
          })
          this.addDialogVisible = false
          this.fetchData()
        }
      })
    }
  }
}

