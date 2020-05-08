
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findSubstrateMeasureList, productList } from '@/api/chipManage/abnormalManage/reworkManage'
import { userList } from '@/api/chipBasicInfoManage/machineInfo'
import { findTree } from '@/api/background/deptManager'
import { scCategoryList } from '@/api/pcChipCasting/pcChipCasting'
import { queryPendingData, queryHasScrapped, cancelPendingData, generateBillNo, addBill, getHasScrapDetail, deleteBill, updateBill, review } from '@/api/scrapManage/scrap'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      checkDialogVisible: false,
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      dialogType: 0,
      rowInfo: null,
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
          id: 0,
          name: '待审核(部门)'
        },
        {
          id: 1,
          name: '不通过(部门)'
        },
        {
          id: 2,
          name: '待审核(QC)'
        },
        {
          id: 3,
          name: '不通过(QC)'
        },
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
      selectLists: [],
      isShowMenu: {
        'scrapAudit-auditor': false
      }
    }
  },
  mounted() {
    var _this = this
    setTimeout(function() {
      const roleInfo = sessionStorage.getItem('roleInfo')
      if (roleInfo !== undefined && roleInfo !== null) {
        const roleList = JSON.parse(roleInfo)
        for (const item of roleList) {
          if (item.path === 'xpproductionManage') {
            for (const items of item.children) {
              if (items.path === 'abnormalManage') {
                for (const citems of items.children) {
                  if (citems.path === 'scrapManages') {
                    const menus = citems.funIds.split(',')
                    for (const menu of menus) {
                      _this.isShowMenu[menu] = true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }, 500)
    this.fetchData()
    this.findSubstrateMeasureList()
    this.productList()
    this.userLists()
    this.findTree()
    this.scCategoryList()
  },
  methods: {
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
          batchNo: this.bitchNo,
          waferNo: this.waferId,
          productModel: this.productId,
          sizeId: this.measureId,
          typeId: this.tpType,
          startTime: this.formatDate(this.beginDate),
          endTime: this.formatDate(this.endDate)
        }
        if (this.beginDate === '') {
          params.startTime = ''
        }
        if (this.endDate === '') {
          params.endTime = ''
        }
        queryPendingData(params).then(res => {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      } else {
        const params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          deptId: this.deptId,
          status: this.typeId,
          billNo: this.billNo,
          type: 0,
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
      }
    },
    // 关闭
    handleClose(formName) {
      // this.$refs[formName].resetFields()
    },
    handleSelectionChange(data) {
      this.selectLists = data
      this.selectList = []
      for (const item of this.selectLists) {
        this.selectList.push(item)
      }
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
      this.selectList = []
      for (const item of this.selectLists) {
        this.selectList.push(item)
      }
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
      if (this.dialogType === 1 && (this.rowInfo === null || this.rowInfo.status === 0)) {
        if (this.selectList.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择需要报废的批号!'
          })
          return
        }
        const detail = []
        for (const item of this.selectList) {
          detail.push({
            id: item.id
          })
        }
        const params = {
          applyDept: sessionStorage.getItem('deptId'),
          billNo: this.dialogForm.billNo,
          creator: sessionStorage.getItem('User-Id'),
          details: detail
        }
        addBill(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
            this.addDialogVisible = false
            this.fetchData()
          }
        })
      } else if (this.dialogType === 1 && this.rowInfo.status !== 0) {
        if (this.selectList.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择需要报废的批号!'
          })
          return
        }
        const detail = []
        for (const item of this.selectList) {
          detail.push({
            id: item.id
          })
        }
        const params = {
          id: this.rowInfo.id,
          billNo: this.dialogForm.billNo,
          details: detail
        }
        updateBill(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
            this.addDialogVisible = false
            this.fetchData()
          }
        })
      } else if (this.dialogType === 2 || this.dialogType === 3) {
        let status = 0
        let remark = ''
        let type = ''
        if (this.dialogType === 2) {
          type = 0
          remark = this.dialogForm.dremark
          if (this.dialogForm.deptSuggess === '') {
            this.$message({
              type: 'error',
              message: '请选择审核意见!'
            })
            return
          } else if (this.dialogForm.deptSuggess === 1) {
            status = 1
          } else {
            status = 2
          }
        } else {
          type = 1
          remark = this.dialogForm.qcremark
          if (this.dialogForm.qceptSuggess === '') {
            this.$message({
              type: 'error',
              message: '请选择审核意见!'
            })
            return
          } else if (this.dialogForm.qceptSuggess === 1) {
            status = 3
          } else {
            status = 4
          }
        }
        const params = {
          id: this.rowInfo.id,
          status: status,
          auditor: sessionStorage.getItem('User-Id'),
          remark: remark,
          type: type
        }
        review(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '审核成功!'
            })
            this.addDialogVisible = false
            this.fetchData()
          }
        })
      }
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
      window.open(process.env.BASE_API + `/xpProductExceptionScrapController/exportData?batchNo=${this.bitchNo}&startTime=${startTime}&endTime=${endTime}&typeId=${this.tpType}&sizeId=${this.measureId}&productModel=${this.productId}&waferNo=${this.waferId}`)
    },
    findInfo(row) {
      this.rowInfo = row
      this.checkDialogVisible = true
      this.getHasScrapDetail(row)
    },
    getHasScrapDetail(row) {
      let deptSuggess = ''
      let qceptSuggess = ''
      this.creatTime = row.createTime
      this.creatTime1 = row.auditTimeLeader
      this.creatTime2 = row.auditTime
      this.creatTime3 = row.receviceTime
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
        duserId: this.dialogType === 2 && !this.checkDialogVisible ? parseInt(sessionStorage.getItem('User-Id')) : row.auditLeader,
        dcreatTime: this.dialogType === 2 && !this.checkDialogVisible ? new Date().getTime() : new Date(row.auditTimeLeader).getTime(),
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
        this.selectList = res.data
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

