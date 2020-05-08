
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { siteList, add, update } from '@/api/processManagement/siteManage'
import { getList, createBoxNo, createNo, trial, findStoreDetailByWafer, stroeAdjust, findWafer, refreshBoxNo } from '@/api/chipManage/extensionStorageManage/outStorageSelect'
import { ckOutbillTypeFind } from '@/api/chipManage/extensionStorageManage/outStorage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      noBoxNo: false,
      isDisabled: false,
      isSetout: false,
      exchangeDialogVisible: false,
      selectExchangeDialogVisible: false,
      printDialogVisible: false,
      list: [],
      printData: [],
      dialogList: [],
      selectedRunRow: null,
      ckBoxNo: '',
      ckSequence: '',
      pageSize: 15,
      pageNum: 1,
      totalNum: 0,
      productType: '',
      orderType: 0,
      currentStatus: '',
      selectedNum: 0,
      selectedRow: [],
      totalPage: 0,
      tableKey: 0,
      sortRadio: 1,
      beginDate: '',
      ruleId: '',
      endDate: '',
      dialogSearchWaferId: '',
      searchKeys: {
        sqdh: '',
        djlx: '',
        khmc: '',
        ckxs: '',
        sqr: '',
        sqrq: '',
        ckdh: '',
        tpgz: '',
        bb: '',
        sqsl: '',
        remark: '',
        mhsl: 24,
        checked: false,
        boxChecked: false
      },
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
      processOptions: [],
      poleOptions: [
        {
          id: 0,
          name: '是'
        },
        {
          id: 1,
          name: '否'
        }
      ],
      currentId: '',
      rightCheck: '',
      setMousList: [],
      hoverRow: null,
      hidden: false,
      eventWhich: 0,
      boxNumYq: 1,
      hourRow: null,
      firstIndexSelect: -1
    }
  },
  created() {
    this.isSetout = this.$route.query.type === 1
    this.ruleId = this.$route.query.ruleId
    this.currentStatus = parseInt(this.$route.query.status)
    this.isDisabled = parseInt(this.$route.query.status) === 2 || parseInt(this.$route.query.status) === 4
    this.orderType = this.$route.query.orderType
    this.searchKeys.khmc = this.$route.query.customer
    this.searchKeys.ckxs = this.$route.query.type === 0 ? '出库' : '备货'
    this.searchKeys.sqr = this.$route.query.creator
    this.searchKeys.sqrq = this.$route.query.createTime
    this.searchKeys.tpgz = this.$route.query.rules
    this.searchKeys.bb = this.$route.query.version
    this.searchKeys.sqsl = this.$route.query.pickNo
    this.searchKeys.ccsl = this.$route.query.outNo
    this.searchKeys.sqdh = this.$route.query.applyNo
    this.searchKeys.remark = this.$route.query.remark
    this.count = this.$route.query.count
    this.currentId = this.$route.query.id
    this.productType = this.$route.query.productType
    this.searchKeys.mhsl = this.$route.query.boxNum
  },
  mounted() {
    this.createNoFun()
    this.fetchData()
    this.ckOutbillTypeFindFun()
  },
  methods: {
    handleRelSelect() {
      this.$confirm(`是否确认重新挑片?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refreshBoxNo({ id: this.currentId }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$router.push({ path: '/extensionStorageManage/outStorage' })
        })
      })
    },
    setHidden() {
      this.hidden = true
    },
    // 单据类型
    ckOutbillTypeFindFun() {
      ckOutbillTypeFind({}).then(res => {
        res.data.map(item => {
          if (item.id === parseInt(this.$route.query.orderType)) {
            this.searchKeys.djlx = item.name
          }
        })
      })
    },
    handleExport() {
      const columnCn = 'RunID;WaferID;出库盒号;出库片位;柜位;入库盒号;入库片位;衬底类型;衬底厂家;镭刻号;目检;PL_WD;PL_WD_STD;PL.I.I;PL.I.I.Std;PL_PD;PL_Ref;LOP(460);综合判定;ESD(200);ESD去坏(50V);综合良率;VF1 Yield;Ir Yield;VZ Yield;VF1;VF2;WLD1;Ir;VZ;IV;WLD(PL-COW);预估COW波长;ESD(400);验证版型;生产类型;IR<0.2 yield;Recipe_Name;外延盒号;HW;B.S;目检原因;Color;Sub;机台;ESD去坏（500V）;ESD去坏（300V）;BOW;PLINT_STD;Avg_Vf4;Thyristor良率'
      const columnEn = 'runId,waferId,ckBoxNo,ckSequence,arkName,boxNo,sequence,subType,supplier,laserMark,inspection,plWd,plWtd,plIi,PLIIStd,plPd,plRef,lop460,judge,esd200v,esd50v,yield,vf1Yield,lrYield,vzYield,vf1,vf2,wld,lr,vz,iv,kVal,cowWd,esd400,yzType,product,yieldIr02,recipe,wyBoxNo,hw1,bs,visualReason,color,sub,machine,esd500,esd300,bow,plintStd,avgVf4,thyristor'
      window.open(process.env.BASE_API + `/scOutgoing/export?id=${this.currentId}&type=${this.$route.query.type}&orderNo=${this.searchKeys.ckdh}&columnEn=${columnEn}&columnCn=${columnCn}`)
    },
    boxNumChange() {
      if (this.searchKeys.mhsl > 24) {
        this.searchKeys.mhsl = 24
      }
    },
    hoverCall(row, column, cell, event) {
      if (event.buttons !== 1) {
        this.hourRow = row
      } else {
        if (event.which === 1) {
          if (!row.selected) {
            if (this.hourRow !== null && this.hourRow !== row) {
              this.$refs.runTable.toggleRowSelection([{ row: this.hourRow, selected: true }])
              for (let i = 0; i < this.list.length; i++) {
                if (this.list[i] === this.hourRow) {
                  this.firstIndexSelect = i
                  this.list[i].selected = true
                  break
                }
              }
              this.hourRow = null
            }
            let x = this.firstIndexSelect
            for (let i = 0; i < this.list.length; i++) {
              if (this.list[i].selected && x <= i) {
                x = i
              }
              if (!this.list[i].selected && x < i) {
                this.$refs.runTable.toggleRowSelection([{ row: this.list[i], selected: true }])
                this.list[i].selected = true
              }
              if (this.list[i] === row) {
                break
              }
            }
            this.$refs.runTable.toggleRowSelection([{ row: row, selected: true }])
            row.selected = true
            return false
          } else {
            if (this.hourRow !== null && this.hourRow !== row) {
              this.$refs.runTable.toggleRowSelection([{ row: this.hourRow, selected: false }])
              for (let i = 0; i < this.list.length; i++) {
                if (this.list[i] === this.hourRow) {
                  this.firstIndexSelect = i
                  this.list[i].selected = false
                  break
                }
              }
              this.hourRow = null
            }
            let x = this.firstIndexSelect
            for (let i = 0; i < this.list.length; i++) {
              if (this.list[i].selected && x <= i) {
                x = i
              }
              if (this.list[i].selected && x < i) {
                this.$refs.runTable.toggleRowSelection([{ row: this.list[i], selected: false }])
                this.list[i].selected = false
              }
              if (this.list[i] === row) {
                break
              }
            }
            this.$refs.runTable.toggleRowSelection([{ row: row, selected: false }])
            row.selected = false
          }
        }
      }
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchWafers()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchWafers()
    },
    clearSearch() {
      this.batchNum = ''
      this.process = ''
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.pole = ''
    },
    // 异常上报
    handleReporting() {
      this.abnormalReportDialog = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        name: this.siteName,
        type: this.siteType
      }
      siteList(requestParams).then(res => {
        this.abnormalList = res.data.list
        // this.$refs.runTable.setCurrentRow(this.abnormalList[0])
        this.selectedRunRow = this.abnormalList[0]
      })
      this.textareaRow = 15
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
    // 单击异常信息
    rowClick(row) {
      this.selectedRunRow = row
    },
    cellClick(row, column, cell, event) {
      if (column.className === 'el-table-column--selection') {
        this.$refs.runTable.toggleRowSelection([{ row: row, selected: true }])
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
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        id: this.currentId,
        type: this.$route.query.type,
        boxNum: this.boxNumYq,
        orderCol: this.sortRadio
      }
      // 如果为非  待挑片  状态则调查看接口
      if (this.currentStatus !== 0) {
        findWafer(requestParams).then(res => {
          this.list = res.data
          this.selectedRunRow = this.list[0]
          this.tableKey = Math.random()
          setTimeout(() => {
            this.list.map(item => {
              this.$refs.runTable.toggleRowSelection([{ row: item, selected: true }])
            })
            this.$refs.runTable.setCurrentRow(this.list[0])
          }, 200)
          this.listLoading = false
        })
      } else { // 挑片状态
        if (this.searchKeys.tpgz === '特殊挑片' || this.count > 0) {
          findWafer(requestParams).then(res => {
            this.list = res.data
            this.selectedRunRow = this.list[0]
            setTimeout(() => {
              this.$refs.runTable.setCurrentRow(this.list[0])
              const num = parseInt(this.searchKeys.sqsl)
              for (let i = 0; i < num; i++) {
                this.$refs.runTable.toggleRowSelection([{ row: this.list[i], selected: true }])
              }
            }, 200)
            if (res.data.length !== 0) {
              this.noBoxNo = this.list[0].tkBoxNo === undefined
            }
            this.tableKey = Math.random()
            this.listLoading = false
          })
        } else {
          getList(requestParams).then(res => {
            this.list = res.data
            this.selectedRunRow = this.list[0]
            // this.$refs.runTable.setCurrentRow(this.list[0])
            if (res.data.length !== 0) {
              this.noBoxNo = this.list[0].tkBoxNo === undefined
            }
            if (this.searchKeys.djlx === '库存调整' || this.isSetout) {
              setTimeout(() => {
                if (this.searchKeys.sqsl > this.list.length) {
                  this.searchKeys.sqsl = this.list.length
                }
              }, 300)
            }
            this.tableKey = Math.random()
            this.listLoading = false
            setTimeout(() => {
              const num = parseInt(this.searchKeys.sqsl)
              for (let i = 0; i < num; i++) {
                this.$refs.runTable.toggleRowSelection([{ row: this.list[i], selected: true }])
              }
            }, 200)
          })
        }
      }
    },
    selectionChange(data) {
      this.selectedNum = data.length
      this.selectedRow = data
      if (data.length === 0) {
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].selected = false
        }
      }
    },
    createNoFun() {
      createNo({ type: parseInt(this.$route.query.type) }).then(res => {
        this.searchKeys.ckdh = res.data
        if (this.$route.query.orderNo !== null) {
          this.searchKeys.ckdh = this.$route.query.orderNo
        }
      })
    },
    // 微调换片
    handleExchange() {
      if (this.selectedRunRow === null) {
        this.$message({
          type: 'error',
          message: '请选择需要换片的行!'
        })
      }
      this.ckBoxNo = this.selectedRunRow.ckBoxNo
      this.ckSequence = this.selectedRunRow.ckSequence
      if (this.ruleId === null) { // 特殊挑片
        this.exchangeDialogVisible = true
      } else {
        this.fetchWafers()
        this.selectExchangeDialogVisible = true
      }
    },
    fetchWafers() {
      const params = {
        id: this.selectedRunRow.id,
        ruleId: this.ruleId,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      findStoreDetailByWafer(params).then(res => {
        this.dialogList = res.data.list
        this.totalPage = res.data.total
      })
    },
    handleSearch() {
      if (this.list.filter(item => { return item.waferId === this.dialogSearchWaferId }).length !== 0) {
        this.$message({
          type: 'error',
          message: '当前Wafer已存在!'
        })
        return false
      }
      this.dialogList = []
      findStoreDetailByWafer({ waferId: this.dialogSearchWaferId }).then(res => {
        if (res.data) {
          this.dialogList.push(res.data)
        }
      })
    },
    // 库存调整
    handleTransmit() {
      if (this.selectedNum === 0) {
        this.$message({
          type: 'error',
          message: '请选择Wafer!'
        })
        return false
      }
      if (parseInt(this.searchKeys.sqsl) < this.selectedNum) {
        this.$message({
          type: 'error',
          message: '挑片数量不能大于申请数量!'
        })
        return false
      }
      if (parseInt(this.searchKeys.sqsl) !== this.selectedNum) {
        this.$confirm('挑片数量与任务单数量不符，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const details = []
          this.list.map(item => {
            details.push({
              boxNo: item.ckBoxNo,
              sequence: item.ckSequence,
              detailId: item.id
            })
          })
          const requestParams = {
            id: this.currentId,
            trial: sessionStorage.getItem('User-Id'),
            orderNo: this.searchKeys.ckdh,
            type: this.$route.query.type,
            status: 1,
            details
          }
          stroeAdjust(requestParams).then(res => {
            this.$router.push({ path: '/extensionStorageManage/outStorage' })
          })
        })
      }
    },
    selectWafer(row) {
      let flag = true
      for (const item of this.list) {
        if (row.waferId === item.waferId) {
          flag = false
          break
        }
      }
      if (flag) {
        let deleteIndex = 0
        row.ckBoxNo = this.ckBoxNo
        row.ckSequence = this.ckSequence
        this.list.forEach((item, index) => {
          if (item.runId === this.selectedRunRow.runId) {
            deleteIndex = index
          }
        })
        this.list.splice(deleteIndex, 1, row)
        this.$refs.runTable.clearSelection()
        setTimeout(() => {
          this.$refs.runTable.toggleAllSelection()
        }, 200)
        this.selectExchangeDialogVisible = false
        this.selectedRunRow = null
        this.$message({
          type: 'success',
          message: '换片成功!'
        })
      } else {
        this.$message({
          type: 'error',
          message: '当前Wafer已存在!'
        })
      }
    },
    // 确认换片
    exchangeSubmit() {
      let deleteIndex = 0
      this.dialogList[0].ckBoxNo = this.ckBoxNo
      this.dialogList[0].ckSequence = this.ckSequence
      this.list.forEach((item, index) => {
        if (item.id === this.selectedRunRow.id) {
          deleteIndex = index
        }
      })
      this.list.splice(deleteIndex, 1, this.dialogList[0])
      this.$refs.runTable.clearSelection()
      this.list.map(item => {
        this.$refs.runTable.toggleRowSelection([{ row: item, selected: true }])
      })
      this.exchangeDialogVisible = false
    },
    sortFun() {
      return function(a, b) {
        if (a.arkName > b.arkName) {
          return 1
        } else if (a.arkName < b.arkName) {
          return -1
        }
        if (a.boxNo > b.boxNo) {
          return 1
        } else if (a.boxNo < b.boxNo) {
          return -1
        }
        if (a.sequence > b.sequence) {
          return 1
        } else if (a.sequence < b.sequence) {
          return -1
        } else {
          return 0
        }
      }
    },
    // 分配出库盒号
    handleAssignBox() {
      if (this.searchKeys === '') {
        this.$message({
          type: 'error',
          message: '请输入每盒数量!'
        })
        return false
      }
      if (this.selectedNum === 0) {
        this.$message({
          type: 'error',
          message: '请选择Wafer!'
        })
        return false
      }
      this.listLoading = true
      this.selectedRow.sort(this.sortFun())
      const requestParams = {
        details: this.selectedRow,
        model: this.productType,
        num: this.searchKeys.mhsl
      }
      createBoxNo(requestParams).then(res => {
        this.list = res.data
        setTimeout(() => {
          this.$refs.runTable.toggleAllSelection()
        }, 500)
        this.noBoxNo = false
        this.listLoading = false
      })
    },
    finishSelect() {
      if (this.selectedNum === 0) {
        this.$message({
          type: 'error',
          message: '请选择Wafer!'
        })
        return false
      }
      if (parseInt(this.searchKeys.sqsl) < this.selectedNum) {
        this.$message({
          type: 'error',
          message: '挑片数量不能大于申请数量!'
        })
        return false
      }
      if (parseInt(this.searchKeys.sqsl) !== this.selectedNum) {
        this.$confirm('挑片数量与任务单数量不符，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.selectedSubmit()
        })
      } else {
        this.selectedSubmit()
      }
    },
    // 完成挑片
    selectedSubmit() {
      const details = []
      this.selectedRow.map(item => {
        if (this.currentStatus === 0 && this.searchKeys.tpgz !== '特殊挑片' && this.count === 0) {
          details.push({
            boxNo: item.ckBoxNo,
            sequence: item.ckSequence,
            detailId: item.id,
            size: item.size
          })
        } else {
          details.push({
            boxNo: item.ckBoxNo,
            sequence: item.ckSequence,
            detailId: item.detailId,
            id: item.id
          })
        }
      })
      const requestParams = {
        id: this.currentId,
        trial: sessionStorage.getItem('User-Id'),
        orderNo: this.searchKeys.ckdh,
        type: this.$route.query.type,
        status: this.currentStatus,
        ruleIds: this.ruleId,
        boxNum: this.searchKeys.mhsl,
        operate: this.currentStatus === 0 ? 'new' : 'edit',
        details
      }
      trial(requestParams).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        if (res.data !== null) {
          this.$alert(`出库单号重复已修改为${res.data.code}`, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.push({ path: '/extensionStorageManage/outStorage' })
            }
          })
        } else {
          this.$router.push({ path: '/extensionStorageManage/outStorage' })
        }
        this.$router.push({ path: '/extensionStorageManage/outStorage' })
      })
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
      this.dialogSearchWaferId = ''
      this.dialogList = []
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            type: this.siteForm.siteType,
            name: this.siteForm.siteName,
            status: this.siteForm.siteStatus
          }
          add(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.addDialogVisible = false
              this.fetchData()
            }
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
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            type: this.siteForm.siteType,
            name: this.siteForm.siteName,
            status: this.siteForm.siteStatus
          }
          update(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.editDialogVisible = false
              this.$refs[formName].resetFields()
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除
    handleDelete(index) {
      this.$confirm('是否确认删除该Wafer信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.splice(index, 1)
        this.$refs.runTable.clearSelection()
        this.list.map(item => {
          this.$refs.runTable.toggleRowSelection([{ row: item, selected: true }])
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    }
  }
}

