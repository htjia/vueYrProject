
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { siteList } from '@/api/processManagement/siteManage'
import { findTree } from '@/api/background/deptManager'
import { generateBillNo } from '@/api/scrapManage/scrap'
import { customerList, productList, findList, determine, gyFlowCardFind, exceptionBill, findErrorList, fetchCardInfo, gyFlowCardFindback, completeDeterMine, getDetails } from '@/api/chipManage/abnormalManage/productionAbnormal'
import Cookies from 'js-cookie'
import Sortable from 'sortablejs'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateModel = (rule, value, callback) => {
      const az = new RegExp('[0-9]')
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('请输入有效数字'))
      } else {
        if (!az.test(value)) {
          callback(new Error('快捷键为0~9的字符'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      addDialogVisible1: false,
      checkDialogVisible: false,
      printDialogVisible: false,
      dialogVisible: false,
      showFlag: false,
      isready: false,
      list: [],
      pageSize: 12,
      billNo: '',
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      mulForm: {
        mulWaferID: ''
      },
      mulrules: {
        mulWaferID: [{ required: true, message: '请输入waferID', trigger: 'blur' }]
      },
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
      beginDate1: '',
      endDate1: '',
      pickerOptionsStart1: {
        disabledDate: (time) => {
          const endDateVal = this.endDate1
          if (endDateVal) {
            return time.getTime() > endDateVal
          }
        }
      },
      pickerOptionsEnd1: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate1
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      batchNo: '',
      billNos: '',
      status: '',
      waferNo: '',
      productModel: '',
      creator: '',
      radio: 0,
      productLists: [],
      userLists: [],
      normalList: [],
      backForm: {
        typeId: 1,
        flowCardId: '',
        creator: [],
        reason: '',
        prevent: '',
        dept: []
      },
      backForms: {
        typeId: 1,
        flowCardId: '',
        creator: [],
        reason: '',
        prevent: '',
        dept: []
      },
      rules: {
        typeId: [{ required: true, message: '请选择异常分类', trigger: 'blur' }],
        flowCardId: [{ required: true, message: '请选择返工流程卡', trigger: 'blur' }],
        creator: [{ required: true, message: '请选择责任人', trigger: 'blur' }],
        dept: [{ required: true, message: '请选择责任部门', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入报废原因', trigger: 'blur' }],
        prevent: [{ required: true, message: '请输入预防措施', trigger: 'blur' }],
        conversionNum: [{ required: true, validator: validateModel, trigger: 'blur' }]
      },
      historyList: [],
      typeList: [
        {
          id: 0,
          name: '待处理'
        },
        {
          id: 1,
          name: '已完成'
        },
        {
          id: 2,
          name: '处理中'
        }
      ],
      infoList: [],
      multipleSelection: [],
      flowList: [],
      flowBackList: [],
      flowBackLists: [],
      errorLists: [],
      backNumber: '',
      rowInfo: null,
      crrentCode: '',
      currentCardType: '',
      currentCardName: '',
      currentCraft: '',
      currentCraftId: '',
      currentRemark: '',
      currentStatus: '',
      currentCreateTime: '',
      currentUpdateTime: '',
      currentCreator: '',
      currentModifier: '',
      innerVisible: false,
      currentModelList: [],
      forepartSiteOptions: [],
      endSiteOptions: [],
      dialogList: [],
      dialogEndList: [],
      infosList: [],
      backList: [],
      chipList: [],
      checkType: -1,
      paramsReasy: null,
      deptList: [],
      deptId: ''
    }
  },
  mounted() {
    this.fetchData()
    this.productList()
    this.customerList()
  },
  methods: {
    findTree() {
      findTree().then(res => {
        this.deptList = res.data
        for (const item of res.data) {
          if (item.name === '芯片部') {
            this.deptId = item.id
            sessionStorage.setItem('deptIds', item.id)
            break
          }
        }
      })
    },
    findErrorList() {
      findErrorList().then(res => {
        this.errorLists = res.data.list
      })
    },
    // 返工流程卡
    gyFlowCardFind() {
      gyFlowCardFind().then(res => {
        this.flowList = res.data.list
      })
    },
    gyFlowCardFindback(craftId) {
      const params = {
        // craftId: craftId,
        type: 2,
        pageNum: 1,
        pageSize: 100000,
        status: 0
      }
      gyFlowCardFindback(params).then(res => {
        this.flowBackList = res.data.list
      })
    },
    gyFlowCardFindbacks(craftId) {
      const params = {
        craftId: craftId,
        type: 2,
        pageNum: 1,
        pageSize: 100000,
        status: 0
      }
      gyFlowCardFindback(params).then(res => {
        this.flowBackLists = res.data.list
      })
    },
    // 查询
    productList() {
      productList().then(res => {
        this.productLists = res.data
      })
    },
    // 查询
    customerList() {
      customerList().then(res => {
        this.userLists = res.data.list
      })
    },
    // 返工单号
    exceptionBill(batchNo) {
      exceptionBill({ batchNo: batchNo }).then(res => {
        this.backNumber = res.data
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
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
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        batchNo: this.batchNo,
        batchNos: this.mulForm.mulWaferID,
        productModel: this.productModel,
        billNo: this.billNo,
        auditor: this.creator,
        waferNo: this.waferNo,
        status: this.status,
        createTimeStart: this.beginDate1 === '' ? '' : this.formatDate(this.beginDate1),
        createTimeEnd: this.endDate1 === '' ? '' : this.formatDate(this.endDate1),
        auditTimeStart: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        auditTimeEnd: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      findList(params).then(res => {
        this.mulForm.mulWaferID = ''
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    clearAll() {
      this.pageNum = 1
      this.batchNo = ''
      this.waferNo = ''
      this.productModel = ''
      this.billNo = ''
      this.creator = ''
      this.beginDate1 = ''
      this.endDate1 = ''
      this.beginDate = ''
      this.endDate = ''
      this.status = ''
      this.mulForm.mulWaferID = ''
      this.fetchData()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.processResult !== null) {
        return 'set_red'
      }
    },
    handelRow(row) {
      this.addDialogVisible = true
      this.infoList = []
      this.infoList.push(row)
      this.radio = 0
      this.backForm = {
        typeId: 1,
        flowCardId: '',
        creator: [this.infoList[0].upCreator],
        reason: '',
        prevent: '',
        dept: []
      }
      this.backForms = {
        typeId: 1,
        flowCardId: '',
        creator: [],
        reason: '',
        prevent: '',
        dept: []
      }
      this.exceptionBill(row.batchNo)
      this.gyFlowCardFind()
      this.gyFlowCardFindbacks(row.craftId)
      this.getForepartSiteList()
      this.getEndSiteList()
      this.findTree()
      const params = {
        batchNo: this.infoList[0].batchNo,
        exceptionId: this.infoList[0].id
      }
      getDetails(params).then(res => {
        if (res.code === 0) {
          this.historyList = res.data
          this.showFlag = false
          for (const item of this.historyList) {
            if (item.abnormalStatus !== null && item.abnormalStatus !== 5 && item.abnormalStatus !== 6) {
              this.showFlag = false
              break
            }
            if (item.processResult !== null) {
              this.showFlag = true
              break
            }
          }
          const _this = this
          setTimeout(function() {
            for (const item of _this.historyList) {
              if (item.initAbnormal && item.status === 0) {
                _this.$refs.history.toggleRowSelection(item)
              }
            }
          }, 300)
        }
      })
      // this.historyList = row.details
    },
    showResult(row) {
      this.addDialogVisible1 = true
      this.infoList = []
      this.infoList.push(row)
      const params = {
        batchNo: this.infoList[0].batchNo,
        exceptionId: this.infoList[0].id
      }
      getDetails(params).then(res => {
        if (res.code === 0) {
          this.historyList = res.data
          this.showFlag = false
          for (const item of this.historyList) {
            if (item.abnormalStatus !== null && item.abnormalStatus !== 5 && item.abnormalStatus !== 6) {
              this.showFlag = false
              break
            }
            if (item.processResult !== null) {
              this.showFlag = true
              break
            }
          }
        }
      })
    },
    checkList(row) {
      return (row.status === 0)
    },
    checkFinish() {
      this.$confirm('此操作将未判定的wafer统一按正常处理, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // const list = []
        // for (const item of this.historyList) {
        //   if (item.status === 0) {
        //     list.push(item)
        //   }
        // }
        const params = {
          auditor: sessionStorage.getItem('User-Id'),
          batchNo: this.infoList[0].batchNo,
          exceptionId: this.infoList[0].id
        }
        completeDeterMine(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
            this.addDialogVisible = false
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    openCheck() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要处理的异常数据!'
        })
        return
      }
      const lists = []
      for (const item of this.historyList) {
        if (item.status === 0) {
          lists.push(item)
        }
      }
      if (this.multipleSelection.length === lists.length) {
        this.isready = true
      } else {
        this.isready = false
      }
      this.backForm = {
        typeId: 1,
        flowCardId: '',
        creator: [this.infoList[0].upCreator],
        reason: '',
        prevent: '',
        dept: []
      }
      this.backForms = {
        typeId: 1,
        flowCardId: '',
        creator: [],
        reason: '',
        prevent: '',
        dept: []
      }
      this.checkDialogVisible = true
      this.findErrorList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      for (const item of val) {
        if (item.status === 0) {
          this.multipleSelection.push(item)
        }
      }
    },
    navClick(type) {
      if (this.radio !== type) {
        this.radio = type
      }
      if (type === 2) {
        this.generateBillNo()
      }
    },
    // 上移
    handleUp(index) {
      if (index > 0) {
        const upDate = this.chipList[index - 1]
        this.chipList.splice(index - 1, 1)
        this.chipList.splice(index, 0, upDate)
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    deleteXP(index) {
      this.chipList.splice(index, 1)
    },
    // 下移
    handleDown(index) {
      if ((index + 1) === this.chipList.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else {
        const downDate = this.chipList[index + 1]
        this.chipList.splice(index + 1, 1)
        this.chipList.splice(index, 0, downDate)
      }
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.left .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.chipList.splice(oldIndex, 1)[0]
          _this.chipList.splice(newIndex, 0, currRow)
        }
      })
    },
    determine(type) {
      var params = {
        resultKey: this.radio
      }
      if (parseInt(this.radio) === 0) {
        const details = []
        for (const item of this.multipleSelection) {
          details.push({
            waferNo: item.waferNo
          })
        }
        const record = {
          creator: sessionStorage.getItem('User-Id'),
          batchNo: this.infoList[0].batchNo,
          details: details
        }
        record.oldBatchNo = this.infoList[0].batchNo
        params.record = record
        determine(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
            this.checkDialogVisible = false
            this.addDialogVisible = false
            this.fetchData()
          }
        })
      } else {
        if (parseInt(this.radio) === 1) {
          if (this.backForm.creator.length > 10) {
            this.$message({
              type: 'error',
              message: '选择责任人不得超过10人!'
            })
            return
          }
          if (type === 5) {
            let flag = false
            let flag1 = false
            for (const item of this.historyList) {
              if (item.result === 3 && item.status !== 0) {
                flag = true
                break
              }
              if (item.result === 0) {
                flag1 = true
                break
              }
            }
            if (flag) {
              this.$message({
                type: 'error',
                message: '存在正在进行异常单处理的wafer，无法整批返工!'
              })
              return
            }
            if (flag1) {
              this.$message({
                type: 'error',
                message: '存在处理为正常的wafer，无法整批返工!'
              })
              return
            }
          }
          this.$refs['backForm'].validate((valid) => {
            if (valid) {
              const record = {
                creator: sessionStorage.getItem('User-Id'),
                details: []
              }
              const details = []
              record.allRework = (type === 5)
              if (type === 2) {
                record.oldBatchNo = this.infoList[0].batchNo
                record.responsible = this.backForm.creator.join()
                for (const item of this.multipleSelection) {
                  details.push({
                    waferNo: item.waferNo,
                    typeId: this.backForm.typeId,
                    responsible: this.backForm.creator.join(),
                    flowCardId: this.backForm.flowCardId,
                    reason: this.backForm.reason,
                    prevent: this.backForm.prevent,
                    exceptionId: this.infoList[0].id,
                    initialFlowCardId: this.infoList[0].initialFlowCardId,
                    creator: sessionStorage.getItem('User-Id')
                  })
                }
              } else if (type === 1 || type === 5) {
                record.batchNo = this.backNumber
                record.oldBatchNo = this.infoList[0].batchNo
                if (type === 5) {
                  record.batchNo = this.infoList[0].batchNo
                }
                record.responsible = this.backForm.creator.join()
                for (const item of this.multipleSelection) {
                  details.push({
                    waferNo: item.waferNo,
                    typeId: this.backForm.typeId,
                    responsible: this.backForm.creator.join(),
                    flowCardId: this.backForm.flowCardId,
                    reason: this.backForm.reason,
                    prevent: this.backForm.prevent,
                    exceptionId: this.infoList[0].id,
                    serialNum: type === 5 ? item.sequence : null,
                    initialFlowCardId: this.infoList[0].initialFlowCardId,
                    creator: sessionStorage.getItem('User-Id')
                  })
                }
              }
              this.checkType = type
              record.details = details
              params.record = record
              if (this.checkType === 1) {
                this.paramsReasy = params
                this.handleprint(this.infoList[0], this.backForm.flowCardId)
              } else {
                if (type === 5) {
                  this.$confirm('此操作不可逆，是否确认整批返工?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    determine(params).then(res => {
                      if (res.code === 0) {
                        this.$message({
                          type: 'success',
                          message: '提交成功!'
                        })
                        this.checkDialogVisible = false
                        this.addDialogVisible = false
                        this.fetchData()
                      }
                    })
                  })
                } else {
                  determine(params).then(res => {
                    if (res.code === 0) {
                      this.$message({
                        type: 'success',
                        message: '提交成功!'
                      })
                      this.checkDialogVisible = false
                      this.addDialogVisible = false
                      this.fetchData()
                    }
                  })
                }
              }
            } else {
              console.log('error submit!!')
              return false
            }
          })
        } else if (parseInt(this.radio) === 2) {
          this.$refs['backForms'].validate((valid) => {
            if (valid) {
              const record = {
                creator: sessionStorage.getItem('User-Id'),
                details: []
              }
              const details = []
              record.oldBatchNo = this.infoList[0].batchNo
              if (type === 3) {
                record.batchNo = this.backNumber
                record.billNo = this.billNos
                record.applyDept = sessionStorage.getItem('deptId')
                for (const item of this.multipleSelection) {
                  details.push({
                    waferNo: item.waferNo,
                    responsibleDept: this.backForms.dept.join(),
                    reason: this.backForms.reason,
                    prevent: this.backForms.prevent,
                    exceptionId: this.infoList[0].id,
                    creator: sessionStorage.getItem('User-Id'),
                    conversionNum: this.backForms.conversionNum
                  })
                }
              } else if (type === 4) {
                for (const item of this.multipleSelection) {
                  details.push({
                    waferNo: item.waferNo,
                    responsibleDept: this.backForms.dept.join(),
                    reason: this.backForms.reason,
                    prevent: this.backForms.prevent,
                    exceptionId: this.infoList[0].id,
                    creator: sessionStorage.getItem('User-Id'),
                    conversionNum: this.backForms.conversionNum
                  })
                }
              }
              this.checkType = type
              record.details = details
              params.record = record
              determine(params).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '提交成功!'
                  })
                  this.checkDialogVisible = false
                  this.addDialogVisible = false
                  this.fetchData()
                }
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
        }
      }
    },
    // 弹框内查看按钮
    handleReview(row) {
      this.getForepartSiteList()
      this.getEndSiteList()
      this.rowInfo = row
      const requestParams = {
        pageNum: 1,
        pageSize: 100000
      }
      gyFlowCardFind(requestParams).then(res => {
        for (const item of res.data.list) {
          if (item.id === this.rowInfo.flowCardId) {
            this.crrentCode = item.code
            this.currentCardType = item.type
            this.currentCardName = item.name
            this.currentCraft = item.craftName
            this.currentCraftId = item.craftId
            this.currentRemark = item.remark
            this.currentStatus = item.status
            this.currentCreateTime = item.createTime
            this.currentUpdateTime = item.lastUpdateTime
            this.currentCreator = item.creator
            this.currentModifier = item.modifier
            break
          }
        }
      })
      this.getProceCodeModel(row.flowCardId)
      this.innerVisible = true
    },
    // 复制流程卡请求型号
    getProceCodeModel(id) {
      const requestParams = {
        id
      }
      fetchCardInfo(requestParams).then(res => {
        var arr = []
        res.data.modelList.map((item) => {
          if (item !== null) {
            arr.push({
              color: item.color,
              modelName: item.modelList
            })
          }
        })
        this.currentModelList = arr
        this.setCopyProce(res.data.processList)
      })
    },
    // 添加
    handleprint(row, floadCard) {
      this.printDialogVisible = true
      this.infosList = []
      this.backList = []
      this.chipList = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.chipList.push({
          index: i + 1,
          id: this.multipleSelection[i].id,
          waferNo: this.multipleSelection[i].waferNo,
          laserMark: this.multipleSelection[i].laserMark
        })
      }
      if (this.multipleSelection.length < 24) {
        for (let i = this.multipleSelection.length; i < 24; i++) {
          this.chipList.push({
            index: i + 1,
            id: '',
            laserMark: '',
            waferNo: ''
          })
        }
      }
      let name = ''
      for (const item of this.flowBackLists) {
        if (this.backForm.flowCardId === item.id) {
          name = item.name
          break
        }
      }
      this.infosList.push({
        num: this.multipleSelection.length,
        batchNo: this.paramsReasy.record.batchNo,
        reworkFlowCard: name,
        productModel: row.productCode,
        craft: row.craft
      })
      const requestParams = {
        id: floadCard
      }
      fetchCardInfo(requestParams).then(res => {
        this.backList = res.data.processList
      })
      const _this = this
      setTimeout(function() {
        _this.rowDrop()
      }, 1000)
    },
    prints() {
      for (let x = 0; x < this.paramsReasy.record.details.length; x++) {
        for (let i = 0; i < this.chipList.length; i++) {
          if (this.chipList[i].waferNo === this.paramsReasy.record.details[x].waferNo) {
            this.paramsReasy.record.details[x].serialNum = i + 1
            break
          }
        }
      }
      determine(this.paramsReasy).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.printDialogVisible = false
          this.fetchData()
          this.$print(this.$refs.prints)
          Cookies.set('isbackready', 1)
          const _this = this
          setTimeout(function() {
            _this.$router.push({ path: '/abnormalManage/reworkManage' })
          }, 2000)
        }
      })
    },
    setCopyProce(data) {
      const firstProce = []
      const endProce = []
      data.map((item) => {
        if (item.type === 0) {
          firstProce.push(item)
        } else {
          endProce.push(item)
        }
      })
      this.dialogList = firstProce
      this.dialogEndList = endProce
    },
    // 所有前段站点
    getForepartSiteList() {
      const requestParams = {
        type: 0,
        status: 0,
        pageSize: 1000,
        pageNum: 1
      }
      siteList(requestParams).then(res => {
        this.forepartSiteOptions = res.data.list
      })
    },
    // 所有后段站点
    getEndSiteList() {
      const requestParams = {
        type: 1,
        status: 0,
        pageSize: 1000,
        pageNum: 1
      }
      siteList(requestParams).then(res => {
        this.endSiteOptions = res.data.list
      })
    },
    generateBillNo() {
      generateBillNo().then(res => {
        if (res.code === 0) {
          this.billNos = res.data
        }
      })
    },
    // 批量查询
    mulSearchClick() {
      this.mulForm.mulWaferID = ''
      this.dialogVisible = true
    },
    // 批量查询提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(123)
          // this.mulWaferFind()
          this.dialogVisible = false
          this.fetchData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    opennew() {
      const details = []
      for (const item of this.multipleSelection) {
        details.push({
          waferNo: item.waferNo,
          exceptionId: this.infoList[0].id,
          creator: sessionStorage.getItem('User-Id')
        })
      }
      const record = {
        creator: sessionStorage.getItem('User-Id'),
        batchNo: this.backNumber,
        details: details,
        row: this.infoList[0]
      }
      sessionStorage.removeItem('errorRowInfo')
      sessionStorage.setItem('addAbnormalBill', JSON.stringify(record))
      this.$router.push({ path: '/abnormalManage/addAbnormalBillxp' })
    }
  }
}

