
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findSubstrateMeasureList, productList } from '@/api/chipManage/abnormalManage/reworkManage'
import { userList } from '@/api/chipBasicInfoManage/machineInfo'
import { findTree } from '@/api/background/deptManager'
import { scCategoryList } from '@/api/pcChipCasting/pcChipCasting'
import { queryHasScrapped, cancelPendingData, generateBillNo, getHasScrapDetail, deleteBill, receive, pageList, borrow } from '@/api/scrapManage/scrap'
import { processList } from '@/api/chipBasicInfoManage/machineInfo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      checkDialogVisible: false,
      editDialogVisible: false,
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      dialogType: 0,
      rowInfo: null,
      batchNo: '',
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
      measureList: [],
      productLists: [],
      typeList: [
        {
          id: 4,
          name: '待入库'
        },
        {
          id: 5,
          name: '已入库'
        }
      ],
      dialogForm: {
        billNo: '',
        deptName: '',
        deptId: '',
        rdeptName: '',
        rdeptId: '',
        creator: '',
        creatTime: '',
        baofeiNum: '',
        deptSuggess: '',
        duserId: '',
        dcreatTime: '',
        dremark: '',
        qceptSuggess: '',
        qcuserId: '',
        qccreatTime: '',
        qcremark: ''
      },
      checkList: [
        {
          id: 0,
          name: '通过'
        },
        {
          id: 1,
          name: '不通过'
        }
      ],
      userList: [],
      isActive: 0,
      bitchNo: '',
      waferId: '',
      productId: '',
      measureId: '',
      typeId: '',
      userId: '',
      treelist: [],
      deptId: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isSpan: false,
      isSpan1: false,
      isSpan2: false,
      deptName: '',
      billNo: '',
      tpType: '',
      timeType: 1,
      categoryList: [],
      selectList: [],
      creatTime: '',
      creatTime1: '',
      creatTime2: '',
      creatTime3: '',
      list: [],
      typeLists: [
        {
          id: 0,
          name: '圆片'
        },
        {
          id: 1,
          name: '方片'
        }
      ],
      urgentList: [
        {
          id: 0,
          name: '否'
        },
        {
          id: 1,
          name: '是'
        }
      ],
      gxchexk: '',
      isReal: '',
      tpTypes: '',
      processListspage: [],
      rules: {
        borrow: [{ required: true, message: '请输入借片人', trigger: 'blur' }],
        createTime: [{ required: true, message: '请选择借片时间', trigger: 'blur' }]
      },
      machineForm: {
        backTime: '',
        borrow: '',
        borrowRemark: '',
        createTime: ''
      }
    }
  },
  mounted() {
    this.fetchData()
    this.findSubstrateMeasureList()
    this.productList()
    this.userLists()
    this.findTree()
    this.scCategoryList()
    this.processListpage()
  },
  methods: {
    processListpage() {
      this.processListspage = []
      const params = {
        pageNum: 1,
        pageSize: 100000
      }
      processList(params).then(res => {
        this.processListspage = res.data.list
      })
    },
    scCategoryList() {
      scCategoryList().then(res => {
        this.categoryList = res.data.list
      })
    },
    setSpan() {
      this.isSpan = !this.isSpan
    },
    setSpan1() {
      if (this.dialogType > 1) {
        return
      }
      this.isSpan1 = !this.isSpan1
    },
    setSpan2() {
      if (this.dialogType > 1) {
        return
      }
      this.isSpan2 = !this.isSpan2
    },
    handleNodeClick(node) {
      this.deptId = node.id
      this.deptName = node.name
      this.isSpan = false
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    editsubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.rowInfo.id,
            backTime: this.formatDate(this.machineForm.backTime),
            borrow: this.machineForm.borrow,
            borrowRemark: this.machineForm.borrowRemark,
            createTime: this.formatDate(this.machineForm.createTime)
          }
          if (this.machineForm.backTime === '') {
            params.backTime = ''
          } else {
            if (this.machineForm.backTime < this.machineForm.createTime) {
              this.$message({
                type: 'error',
                message: '借片时间大于返还时间!'
              })
              return
            }
          }
          borrow(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '借片成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleNodeClick1(node) {
      this.dialogForm.deptId = node.id
      this.dialogForm.deptName = node.name
      this.isSpan1 = false
    },
    handleNodeClick2(node) {
      this.dialogForm.rdeptId = node.id
      this.dialogForm.rdeptName = node.name
      this.isSpan2 = false
    },
    navClick(type) {
      if (type !== this.isActive) {
        this.pageNum = 1
        this.pageSize = 15
        this.bitchNo = ''
        this.waferId = ''
        this.productId = ''
        this.measureId = ''
        this.tpType = ''
        this.beginDate = ''
        this.endDate = ''
        this.deptId = ''
        this.deptName = ''
        this.typeId = ''
        this.timeType = ''
        this.userId = ''
        this.billNo = ''
        this.gxchexk = ''
        this.isReal = ''
        this.tpTypes = ''
        this.isActive = type
        this.fetchData()
      }
    },
    deleteList(index) {
      this.selectList.splice(index, 1)
      this.dialogForm.baofeiNum = this.selectList.length
    },
    findTree() {
      const params = {
        code: '',
        name: ''
      }
      findTree(params).then(res => {
        if (res.code === 0) {
          this.treelist = res.data
        }
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    handleAdd(row) {
      this.rowInfo = row
      this.machineForm = {
        backTime: '',
        borrow: '',
        borrowRemark: '',
        createTime: ''
      }
      this.editDialogVisible = true
    },
    // 查询
    findSubstrateMeasureList() {
      findSubstrateMeasureList().then(res => {
        this.measureList = res.data
      })
    },
    // 查询
    productList() {
      productList().then(res => {
        this.productLists = res.data
      })
    },
    userLists() {
      userList().then(res => {
        this.userList = res.data.list
      })
    },
    resetOption() {
      this.selectTheadVisble = false
    },
    // 重置
    clearAll() {
      this.pageNum = 1
      this.pageSize = 15
      this.bitchNo = ''
      this.waferId = ''
      this.productId = ''
      this.measureId = ''
      this.tpType = ''
      this.beginDate = ''
      this.endDate = ''
      this.deptId = ''
      this.deptName = ''
      this.typeId = ''
      this.timeType = ''
      this.userId = ''
      this.billNo = ''
      this.gxchexk = ''
      this.isReal = ''
      this.tpTypes = ''
      this.batchNo = ''
      this.handleSearch()
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
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 时间戳转yyyy-mm-dd HH:mm
    formatDates(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      var h = '0' + date.getHours()
      var mi = '0' + date.getMinutes()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length) + ' ' + h.substring(h.length - 2, h.length) + ':' + mi.substring(mi.length - 2, mi.length)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      if (this.isActive === 0) {
        const params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          deptId: this.deptId,
          status: this.typeId,
          billNo: this.billNo,
          type: 2,
          timeType: this.timeType,
          auditor: this.userId,
          startTime: this.formatDate(this.beginDate),
          endTime: this.formatDate(this.endDate)
        }
        if (this.beginDate === '') {
          params.startTime = ''
        }
        if (this.endDate === '') {
          params.endTime = ''
        }
        queryHasScrapped(params).then(res => {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      } else {
        if (this.isReal === null) {
          this.isReal = ''
        }
        const params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          billNo: this.billNo,
          waferNo: this.waferId,
          taskModel: this.productId,
          category: this.tpType,
          batchNo: this.batchNo,
          process: this.gxchexk,
          isReam: this.isReal,
          sliceType: this.tpTypes,
          startTime: this.formatDate(this.beginDate),
          endTime: this.formatDate(this.endDate)
        }
        if (this.beginDate === '') {
          params.startTime = ''
        }
        if (this.endDate === '') {
          params.endTime = ''
        }
        pageList(params).then(res => {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      }
    },
    handleSelectionChange(data) {
      this.selectList = data
      let flag = ''
      let flags = false
      for (const item of data) {
        if (flag === '') {
          flag = item.responsibleDept
        } else if (flag !== item.responsibleDept) {
          flags = true
        }
      }
      if (flags) {
        this.$message({
          type: 'error',
          message: '所选待报废批号责任部门不相同，请重新选择!'
        })
        return
      }
    },
    // 撤销
    cancelPendingData(row) {
      this.$confirm('此操作将撤销报废批号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id
        }
        cancelPendingData(param).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '撤销成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    // 删除
    deleteBill(row) {
      this.$confirm('此操作将删除单据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id
        }
        deleteBill(param).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    addBaoFei() {
      this.rowInfo = null
      let flag = ''
      let flags = false
      for (const item of this.selectList) {
        if (flag === '') {
          flag = item.responsibleDept
        } else if (flag !== item.responsibleDept) {
          flags = true
        }
      }
      if (flags) {
        this.$message({
          type: 'error',
          message: '所选待报废批号责任部门不相同，请重新选择!'
        })
        return
      }
      if (this.selectList.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要报废的批号!'
        })
        return
      }
      this.addDialogVisible = true
      this.dialogType = 1
      this.creatTime = this.formatDates(new Date().getTime())
      this.creatTime1 = ''
      this.creatTime2 = ''
      this.creatTime3 = ''
      this.dialogForm = {
        billNo: '',
        deptName: '',
        deptId: sessionStorage.getItem('deptId'),
        rdeptName: this.selectList[0].responsibleDept,
        rdeptId: '',
        creator: parseInt(sessionStorage.getItem('User-Id')),
        creatTime: new Date().getTime(),
        baofeiNum: this.selectList.length,
        deptSuggess: '',
        duserId: '',
        dcreatTime: '',
        dremark: '',
        qceptSuggess: '',
        qcuserId: '',
        qccreatTime: '',
        qcremark: ''
      }
      for (const item of this.treelist) {
        if (item.id === this.dialogForm.deptId) {
          this.dialogForm.deptName = item.name
          break
        }
      }
      generateBillNo().then(res => {
        if (res.code === 0) {
          this.dialogForm.billNo = res.data
        }
      })
    },
    submitBill() {
      if (this.selectList.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要报废的批号!'
        })
        return
      }
      const lit = []
      for (const item of this.selectList) {
        lit.push({
          id: item.id,
          isReal: item.isReal ? '1' : '0',
          remark: item.remark
        })
      }
      const params = {
        id: this.rowInfo.id,
        recevicer: sessionStorage.getItem('User-Id'),
        details: lit
      }
      receive(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '入库成功!'
          })
          this.addDialogVisible = false
          this.fetchData()
        }
      })
    },
    importDBF() {
      let startTime = this.formatDate(this.beginDate)
      let endTime = this.formatDate(this.endDate)
      if (this.beginDate === '') {
        startTime = ''
      }
      if (this.endDate === '') {
        endTime = ''
      }
      if (this.isReal === null) {
        this.isReal = ''
      }
      window.open(process.env.BASE_API + `/xpStorehouseScrap/exportExcel?waferNo=${this.waferId}&startTime=${startTime}&endTime=${endTime}&billNo=${this.billNo}&category=${this.tpType}&taskModel=${this.productId}&batchNo=${this.batchNo}&isReam=${this.isReal}&process=${this.gxchexk}&sliceType=${this.tpTypes}`)
    },
    findInfo(row) {
      this.rowInfo = row
      this.checkDialogVisible = true
      this.getHasScrapDetail(row)
    },
    getHasScrapDetail(row) {
      let deptSuggess = ''
      let qceptSuggess = ''
      if (row.status === 3) {
        this.dialogType = 1
        qceptSuggess = 1
      } else if (row.status === 1) {
        this.dialogType = 1
        deptSuggess = 1
      } else if (row.status === 0) {
        this.dialogType = 2
      } else if (row.status === 2) {
        this.dialogType = 3
        deptSuggess = 0
      } else if (row.status === 4) {
        this.dialogType = 4
        deptSuggess = 0
        qceptSuggess = 0
      } else if (row.status === 5) {
        this.dialogType = 5
        deptSuggess = 0
        qceptSuggess = 0
      }
      this.creatTime = row.createTime
      this.creatTime1 = row.auditTimeLeader
      this.creatTime2 = row.auditTime
      this.creatTime3 = row.receviceTime
      this.dialogForm = {
        billNo: row.billNo,
        deptName: row.applyDept,
        deptId: '',
        rdeptName: row.responsibleDept,
        rdeptId: '',
        creator: row.creatorName,
        creatTime: new Date(row.createTime).getTime(),
        baofeiNum: row.scrapNum,
        deptSuggess: deptSuggess,
        duserId: row.auditLeader,
        dcreatTime: new Date(row.auditTimeLeader).getTime(),
        dremark: row.leaderAuditOpinion,
        qceptSuggess: qceptSuggess,
        qcuserId: row.auditor,
        qccreatTime: new Date(row.auditTime).getTime(),
        qcremark: row.qcAuditOpinion
      }
      const params = {
        scrapId: row.id
      }
      getHasScrapDetail(params).then(res => {
        this.selectList = []
        for (const item of res.data) {
          if (this.checkDialogVisible) {
            if (item.isReal === 1) {
              item.isReal = true
            } else if (item.isReal === 0) {
              item.isReal = false
            } else {
              item.isReal = ''
            }
          } else {
            item.isReal = item.isReal === 1 || item.isReal === null
          }
          this.selectList.push(item)
        }
      })
    },
    chulibaofei(row) {
      this.rowInfo = row
      this.addDialogVisible = true
      this.dialogForm = {
        billNo: '',
        deptName: '',
        deptId: '',
        rdeptName: '',
        rdeptId: '',
        creator: '',
        creatTime: '',
        baofeiNum: '',
        deptSuggess: '',
        duserId: '',
        dcreatTime: '',
        dremark: '',
        qceptSuggess: '',
        qcuserId: '',
        qccreatTime: '',
        qcremark: ''
      }
      this.getHasScrapDetail(row)
    },
    cheIstrue(row) {
      this.rowInfo = row
      this.addDialogVisible = true
      this.dialogForm = {
        billNo: '',
        deptName: '',
        deptId: '',
        rdeptName: '',
        rdeptId: '',
        creator: '',
        creatTime: '',
        baofeiNum: '',
        deptSuggess: '',
        duserId: '',
        dcreatTime: '',
        dremark: '',
        qceptSuggess: '',
        qcuserId: '',
        qccreatTime: '',
        qcremark: ''
      }
      this.getHasScrapDetail(row)
    }
  }
}

