
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getOutStorageList, findOutgoingRule, findPickWafer, findCustomer, findPickRule, outgoingSave, ckOutbillTypeFind, findWaferCountByRule, printArkBoxList } from '@/api/chipManage/extensionStorageManage/outStorage'
import { printLabel, printOutBill } from '@/api/chipManage/extensionStorageManage/outStorageSelect'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      rulesDialogVisible: false,
      detailDialogVisible: false,
      adjustmentDialogVisible: false,
      printDialogVisible: false,
      printTableDialogVisible: false,
      notBastic: false,
      searchKeys: {
        rwdh: '',
        ckxs: '',
        djlx: '',
        shzt: '',
        khmc: ''
      },
      count: 0,
      countDisabled: false,
      waferTotalNum: 24,
      arkBoxList: [],
      abnormalList: [{}],
      detailList: [{}],
      receiveList: [{}],
      selectedRunRow: {
        apply_no: ''
      },
      model: '',
      list: [],
      printData: [],
      pickRuleList: [],
      customerList: [],
      specialList: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      timeRadio: 0,
      ruleName: '',
      version: '',
      contentList: [],
      shapeOptions: [
        {
          id: 0,
          name: '正常出库'
        },
        {
          id: 1,
          name: '备货'
        }
      ],
      processOptions: [
      ],
      auditOptions: [
        { id: 0, name: '待挑片' },
        { id: 1, name: '待审核' },
        { id: 2, name: '审核通过' },
        { id: 3, name: '审核不通过' },
        { id: 4, name: '取消' }
      ],
      adjustmentForm: {
        checked: false,
        rule: '',
        versions: '',
        wafers: '',
        khmc: '',
        num: '',
        outType: '',
        remark: ''
      },
      rules: {
        rule: [{ required: true, message: '请选择挑片规则', trigger: 'blur' }],
        khmc: [{ required: true, message: '请选择客户名称', trigger: 'blur' }],
        num: [{ required: true, message: '请输入挑片数量', trigger: 'blur' }],
        wafers: [{ required: true, message: '请输入WaferId', trigger: 'blur' }],
        outType: [{ required: true, message: '请选择出库类型', trigger: 'blur' }]
      },
      currentId: '',
      hidden: false
    }
  },
  mounted() {
    this.fetchData()
    this.findCustomerFun()
    this.findPickRuleFun()
    this.ckOutbillTypeFindFun()
  },
  methods: {
    // 单据类型
    ckOutbillTypeFindFun() {
      ckOutbillTypeFind({}).then(res => {
        this.processOptions = res.data
      })
    },
    // 客户
    findCustomerFun() {
      findCustomer({}).then(res => {
        this.customerList = res.data
      })
    },
    // 挑片规则
    findPickRuleFun() {
      findPickRule({}).then(res => {
        this.pickRuleList = res.data
      })
    },
    adjustment() {
      this.adjustmentDialogVisible = true
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
    clearSearch() {
      this.beginDate = ''
      this.endDate = ''
      this.searchKeys.rwdh = ''
      this.searchKeys.ckxs = ''
      this.searchKeys.djlx = ''
      this.searchKeys.shzt = ''
      this.searchKeys.khmc = ''
      this.timeRadio = 0
      this.handleSearch()
    },
    // 异常原因合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        return {
          rowspan: 12,
          colspan: 1
        }
      }
    },
    // 单击异常详情信息
    detailRowClick(row) {
      this.$refs.detailTable.toggleRowSelection(row)
    },
    // 异常提交
    abnormalSubmit() {
      this.abnormalReportDialog = false
    },
    // 接片
    handleReceive() {
      this.receiveDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputJp.focus()
      }, 100)
    },
    handleReceiveInput() {
      this.receiveList.push({})
    },
    deleteItem(index) {
      this.$confirm('确认删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.receiveList.splice(index, 1)
      })
    },
    // 接片确认
    handleReceiveDialog() {
      console.log(1)
    },
    // 传片
    handleTransmit() {
      this.transmitDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputCp.focus()
      }, 100)
    },
    // 传片确认
    handleTransmitDialog() {
      console.log(1)
    },
    // 拆批数据
    batchDate() {
      this.batchDialogVisible = true
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        type: this.searchKeys.ckxs, // 出库形式
        orderType: this.searchKeys.djlx, // 单据类型
        timeType: this.timeRadio, // 0 申请 1审核
        customer: this.searchKeys.khmc, //
        orderNo: this.searchKeys.rwdh,
        status: this.searchKeys.shzt,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      getOutStorageList(requestParams).then(res => {
        this.list = res.data.list
        this.listLoading = false
        this.totalPage = parseInt(res.data.total)
        if (this.list.length !== 0) {
          this.selectedRunRow = this.list[0]
          setTimeout(() => {
            this.$refs.billTable.setCurrentRow(this.list[0])
          }, 200)
        }
      })
    },
    // 单击异常信息
    rowClick(row) {
      this.selectedRunRow = row
    },
    handlePrint() {
      printOutBill({ id: this.selectedRunRow.id }).then(res => {
        const printData = res.data
        const result = []
        for (var j = 0; j < printData.length; j += 2) {
          result.push(printData.slice(j, j + 2))
        }
        console.log(result)
        this.printData = result
        this.printDialogVisible = true
        setTimeout(() => {
          this.$print(this.$refs.print)
          this.printDialogVisible = false
        })
        // this.printDialogVisible = true
      })
    },
    printSwitch() {
      this.$print(this.$refs.print)
    },
    setHidden() {
      this.hidden = true
    },
    handleTablePrint() {
      printArkBoxList({ id: this.selectedRunRow.id }).then(res => {
        this.arkBoxList = res.data
        this.printTableDialogVisible = true
        setTimeout(() => {
          this.$print(this.$refs.tablePrint)
          this.printTableDialogVisible = false
        })
      })
    },
    tableLeftStyle(item) {
      return 'height: ' + (Math.ceil(item.wafers.length / 8) * 30 + 17) + 'px;' + 'line-height: ' + (Math.ceil(item.wafers.length / 8) * 30 + 17) + 'px'
    },
    handleBoxPrint() {
      // 打印出库盒标签
      printLabel({ id: this.selectedRunRow.id, module: 'scOutgoing' }).then(res => {
        this.$message({
          type: 'success',
          message: '标签正在打印中，请稍候！'
        })
      })
    },
    // 挑片规则
    viewRules(row) {
      if (row.rules === '特殊挑片') {
        this.detailDialogVisible = true
        findPickWafer({ id: row.id }).then(res => {
          this.specialList = res.data
        })
      } else {
        this.rulesDialogVisible = true
        findOutgoingRule({ id: row.id }).then(res => {
          this.ruleName = res.data[0].name
          this.version = res.data[0].version
          this.contentList = res.data[0].contentList
        })
      }
    },
    // 执行挑片
    viewDetail(row) { // *                                                  是否备货(出库形式)        挑片/查看            单据类型                   客户名称                     申请人                 申请日期                    出库单号                挑片规则          版本                  库存数量         申请数量               备注                            产品代码                        申请单号                                      每盒数量
      this.$router.push({ path: '/extensionStorageManage/outStorageSelect', query: { type: row.type, status: row.status, orderType: row.order_type, customer: row.customerName, creator: row.creator, createTime: row.createTime, orderNo: row.order_no, rules: row.rules, version: row.version, outNo: row.outNo, pickNo: row.pick_no, remark: row.remark, id: row.id, productType: row.productType, applyNo: row.apply_no, ruleId: row.ruleId, boxNum: row.boxNum, count: row.count }})
    },
    // 添加
    handleAdd() {
      this.siteForm.siteType = ''
      this.siteForm.siteName = ''
      this.siteForm.siteStatus = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose() {
      this.adjustmentForm.checked = false
      this.adjustmentForm.rule = ''
      this.adjustmentForm.versions = ''
      this.adjustmentForm.wafers = ''
      this.adjustmentForm.khmc = ''
      this.adjustmentForm.num = ''
      this.adjustmentForm.outType = ''
      this.adjustmentForm.remark = ''
      this.count = 0
    },
    // 设置版本
    ruleChange(val) {
      console.log(val)
      this.pickRuleList.map(item => {
        if (item.id === val) {
          this.adjustmentForm.versions = item.version
          this.findWaferCountByRuleFun(item.content)
        }
      })
    },
    findWaferCountByRuleFun(content) {
      findWaferCountByRule({ ruleWhere: content }).then(res => {
        this.count = res.data
      })
    },
    checkboxChange(data) {
      this.countDisabled = data
      this.adjustmentForm.num = 0
    },
    getNum() {
      if (this.adjustmentForm.wafers === '') {
        return
      }
      const arr = this.adjustmentForm.wafers.split(/\n/)
      this.adjustmentForm.num = arr.length
    },
    // 库存调整提交
    submitadjustmentForm(formName) {
      if (this.adjustmentForm.checked) {
        if (this.adjustmentForm.wafers === '') {
          this.$message({
            type: 'error',
            message: '请输入需要手动挑片的WaferId!'
          })
          return false
        }
      } else {
        if (this.adjustmentForm.rule === '') {
          this.$message({
            type: 'error',
            message: '请选择挑片规则!'
          })
          return false
        }
        if (this.adjustmentForm.num > this.count) {
          this.$message({
            type: 'error',
            message: '挑片数量不能大于库存数量!'
          })
          return false
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            creator: sessionStorage.getItem('User-Id'),
            customer: this.adjustmentForm.khmc,
            orderType: 3,
            pickNo: this.adjustmentForm.num,
            remark: this.adjustmentForm.remark,
            ruleIds: this.adjustmentForm.checked ? '' : this.adjustmentForm.rule,
            status: 2,
            type: this.adjustmentForm.outType,
            waferIds: this.adjustmentForm.checked ? this.adjustmentForm.wafers.split(/\n/).join(',') : ''
          }
          console.log(params)
          outgoingSave(params).then(res => {
            this.adjustmentDialogVisible = false
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      this.notBastic = row.isbastic === 1
      this.currentId = row.id
      this.siteForm.siteType = row.type
      this.siteForm.siteName = row.name
      this.siteForm.siteStatus = row.status
      this.editDialogVisible = true
    }
  }
}

