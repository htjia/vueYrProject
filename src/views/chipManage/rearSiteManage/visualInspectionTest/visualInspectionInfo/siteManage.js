
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { abnormalSave, receiveScanning } from '@/api/chipManage/rearSiteManage/tensileTest'
import { getList, nowProcessList } from '@/api/chipManage/transitSiteConfig'
import { getRemark, getProgram, afterReceiveScanning, findUserByRoleName } from '@/api/chipManage/frontSiteManage/cleanSite'
import { findAbnormalList, deliverScanning, transmitting, addReceive, queryList, queryClassifyList, getExceptionCode, submitAbnormalList, insertRecording } from '@/api/chipManage/rearSiteManage/visualInspectionInfo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      editDialogVisible: false,
      afterReportingDialog: false,
      batchDialogVisible: false,
      notBastic: false,
      cancelAbSubmitFlag: false,
      selectedAbnormalNum: 0,
      waferTotal: 0,
      batchTotal: 0,
      abnormalBatchNum: '',
      selectedAbnormalRow: {},
      batchNo: '',
      model: '',
      pole: '',
      textareaRow: 0,
      isReceive: 0,
      proceOptions: [],
      transmitList: [],
      rightList: [],
      abnormalReport: [],
      abnormalReportCopy: [],
      abnormalRemark: '',
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      poleOptions: [
        {
          id: 0,
          name: '否'
        },
        {
          id: 1,
          name: '是'
        }
      ],
      abnormalFeedbackVisible: false,
      selectWaferVisible: false,
      alertDialogVisible: false,
      splicingTime: '',
      currentId: '',
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      abnormalReportDialog: false,
      receiveDialogVisible: false,
      deliverDialogVisible: false,
      transmitDialogVisible: false,
      activeTabIndex: 0,
      waferTotalNum: 24,
      batch: 5,
      batchNum: '',
      jBatchNum: '',
      sBatchNum: '',
      cBatchNum: '',
      process: '',
      sProcess: '',
      jProcess: '',
      cProcess: '',
      jRemark: '',
      program: '',
      cRemark: '',
      sRemark: '',
      jOperator: '',
      sOperator: '',
      cOperator: '',
      jRemarkLeft: '',
      sRemarkLeft: '',
      cRemarkLeft: '',
      abnormalList: [{}],
      detailList: [{}],
      selectedRunRow: {},
      list: [],
      classifyList: [],
      userOptions: [],
      receiveList: [],
      endDate: '',
      processId: '',
      timeRadio: 0,
      aoiRadio: 0,
      batchNoTotal: 0,
      beginDate: '',
      exceptionCode: [],
      aoiRemarkLeft: '',
      visualOptions: [
        {
          id: 0,
          name: '待目检'
        },
        {
          id: 1,
          name: '目检完成'
        }
      ],
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
      searchKeys: {
        mjzt: '',
        ph: '',
        WaferNo: ''
      },
      machineForm: {
        code: '',
        name: '',
        remark: ''
      },
      processCardOptions: [
        { name: 1 },
        { name: 2 }
      ],
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
    this.nowProcessListFun()
    this.getListFun()
    this.classifyListFun()
    this.findMachineUserFun()
    this.getExceptionCodeFun()
  },
  computed: {
    totalNum() {
      let num = 0
      this.receiveList.map(item => {
        num += item.total
      })
      return num
    }
  },
  methods: {
    selectChange() {
      console.log(this.detailList)
    },
    getExceptionCodeFun() {
      getExceptionCode({}).then(res => {
        this.exceptionCode = res.data
      })
    },
    // 获取对应站点的工序
    nowProcessListFun() {
      nowProcessList({ siteId: 27 }).then(res => {
        this.proceOptions = res.data
        this.jProcess = this.proceOptions[0].id
      })
    },
    processJChange() {
      this.receiveList = []
      this.batchNoTotal = 0
      this.waferTotal = 0
      if (this.cBatchNum !== '') {
        this.handleReceiveInput()
      }
    },
    processCChange() {
      this.receiveList = []
      if (this.cBatchNum !== '') {
        this.handleDeliverInput()
      }
    },
    getListFun() {
      const params = {
        siteId: 27
      }
      getList(params).then(res => {
        this.isReceive = res.data[0].isReceive
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
    classifyListFun() {
      queryClassifyList({ isShow: 0, pageNum: 1, pageSize: 10000 }).then(res => {
        this.classifyList = res.data.list
      })
    },
    // 传片扫描
    handleDeliverInput() {
      if (this.cBatchNum.trim() === '') {
        this.$message({
          type: 'error',
          message: '该扫描数据不存在，请确认后，再扫描!'
        })
        this.cBatchNum = ''
        return false
      }
      if (this.receiveList.filter(item => { return item.batchNo === this.cBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批号已存在!'
        })
        this.cBatchNum = ''
        return false
      }
      if (this.receiveList.filter(item => { return item.waferNo === this.cBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前WaferID已存在!'
        })
        this.cBatchNum = ''
        return false
      }
      deliverScanning({ key: this.cBatchNum, processId: this.jProcess }).then(res => {
        if (res.data !== null) {
          this.getRemarkFun()
          this.getProgramFun()
          this.processId = res.data[0].processId
          this.receiveList = [...this.receiveList, ...res.data]
          this.cBatchNum = ''
          let batch = ''
          this.batchNoTotal = 0
          this.receiveList.map(item => {
            item.classifyId = ''
            item.exceptionId = ''
            item.classifyIdArr = []
            item.resonIdArr = []
            if (item.batchNo !== batch) {
              batch = item.batchNo
              this.batchNoTotal++
            }
          })
        }
      }).catch(() => { this.cBatchNum = '' })
    },
    // 人员
    findMachineUserFun() {
      findUserByRoleName({ roleName: '后段目检过站操作员' }).then(res => {
        this.userOptions = res.data
      })
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
    abnormalAfterSubmit() {
      const params = []
      this.receiveList.map(item => {
        if (item.classifyIdArr.length > 0) {
          params.push({
            creator: sessionStorage.getItem('User-Id'),
            pattern: 1,
            reason: item.resonNameArr.join(';'),
            checkProcess: this.jProcess,
            waferNo: item.waferNo
          })
        }
      })
      if (params.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择异常原因!'
        })
        return false
      }
      this.afterReportingDialog = false
      console.log(params)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      // submitAbnormalList(params).then(res => {
      // })
    },
    cancelAbAfterSubmit() {
      this.afterReportingDialog = false
      this.receiveList.map(item => {
        item.abnormalStatus = false
      })
    },
    // 异常上报
    handleReporting() {
      console.log(this.jProcess)
      if (this.jProcess !== 72) {
        this.receiveList.map(item => {
          item.abnormalStatus = false
          item.abnormalCause = ''
          item.resonDeatilList = []
          item.resonCode = []
          item.disposeArr = []
          item.resonIdArr = []
          item.classifyIdArr = []
          item.resonNameArr = []
        })
        console.log(this.receiveList)
        this.afterReportingDialog = true
        return false
      }
      this.abnormalRemark = ''
      const batch = []
      const wafer = []
      this.receiveList.map(item => {
        batch.push(item.batchNo)
        wafer.push(item.waferNo)
      })
      const params = {
        list: Array.from(new Set(batch)),
        waferFilter: wafer
      }
      findAbnormalList(params).then(res => {
        res.data.map(item => {
          item.selectedWafer = 0
          item.abnormalStatus = false
          if (item.wafers.length !== 0) {
            item.wafers.map(wafer => {
              wafer.abnormalStatus = false
              wafer.abnormalCause = ''
              wafer.resonDeatil = []
              wafer.resonDeatilList = []
              wafer.resonCode = []
              wafer.disposeArr = []
              wafer.resonIdArr = []
              wafer.classifyIdArr = []
            })
          }
        })
        this.abnormalReport = res.data
        this.abnormalReportDialog = true
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.abnormalReport[0])
        }, 500)
        this.detailList = this.abnormalReport.length === 0 ? [] : this.abnormalReport[0].wafers
        this.waferTotalNum = this.abnormalReport[0].wafers.length
        this.abnormalBatchNum = this.abnormalReport[0].batchNo
        this.selectedAbnormalRow = this.abnormalReport[0]
        this.textareaRow = 18
      })
    },
    abnormalCauseChange(data) {
      data.resonDeatil = []
      this.classifyList.map(item => {
        if (item.id === parseInt(data.abnormalCause.split('#')[0])) {
          data.resonDeatilList = item.details
        }
      })
    },
    cancelAbSubmit() {
      console.log(this.abnormalReport)
      this.abnormalReport.map(item => {
        item.wafers.map(wafer => {
          wafer.abnormalCause = ''
          wafer.resonDeatil = []
          wafer.resonIdArr = []
          wafer.resonCode = []
          wafer.disposeArr = []
          wafer.classifyIdArr = []
        })
      })
      this.cancelAbSubmitFlag = true
      this.abnormalReportDialog = false
    },
    // 异常选中
    abnormalChange(data) {
      this.selectedAbnormalNum = data.filter(item => { return item.abnormalStatus === true }).length
    },
    // 异常详情选中
    abnormalDetailChange(data) {
      const selectedNum = data.filter(item => { return item.abnormalStatus === true }).length
      console.log(selectedNum)
      if (selectedNum > 0) {
        this.selectedAbnormalRow.abnormalStatus = true
        this.selectedAbnormalRow.selectedWafer = selectedNum
      } else {
        this.selectedAbnormalRow.abnormalStatus = false
        this.selectedAbnormalRow.selectedWafer = 0
      }
      this.selectedAbnormalNum = this.abnormalReport.filter(item => { return item.abnormalStatus === true }).length
    },
    abnormalDetailCauseChange(data) {
      data.classifyIdArr = []
      data.resonCode = []
      data.disposeArr = []
      data.resonIdArr = []
      data.resonDeatil.map(item => {
        data.disposeArr.push(item.split('#')[3])
        data.resonCode.push(item.split('#')[2])
        data.resonIdArr.push(item.split('#')[1])
        data.classifyIdArr.push(item.split('#')[0])
      })
      if (data.disposeArr.includes('1')) {
        data.abnormalStatus = true
      } else {
        data.abnormalStatus = false
      }
      this.abnormalDetailChange(this.detailList)
    },
    abnormalDetailCauseAftChange(data) {
      data.classifyIdArr = []
      data.resonCode = []
      data.resonIdArr = []
      data.resonNameArr = []
      data.disposeArr = []
      data.resonDeatil.map(item => {
        data.disposeArr.push(item.split('#')[4])
        data.resonCode.push(item.split('#')[2])
        data.resonIdArr.push(item.split('#')[1])
        data.classifyIdArr.push(item.split('#')[0])
        data.resonNameArr.push(item.split('#')[2] + '(' + item.split('#')[3] + ')')
      })
      if (data.disposeArr.includes('1')) {
        data.abnormalStatus = true
      } else {
        data.abnormalStatus = false
      }
      console.log(this.receiveList)
    },
    // 单击异常信息
    rowClick(row) {
      this.detailList = row.wafers
      this.waferTotalNum = row.wafers.length
      this.abnormalBatchNum = row.batchNo
      this.selectedAbnormalRow = row
    },
    // 异常提交
    abnormalSubmit() {
      // let flag = false
      let itemFlag = false
      let hasAblm = false
      this.abnormalReport.map(item => {
        if (item.abnormalStatus) {
          hasAblm = true
          // if (item.selectedWafer === 0) {
          //   flag = true
          // }
          item.wafers.map(subItem => {
            if (subItem.abnormalStatus) {
              if (subItem.resonDeatil.length === 0) {
                itemFlag = false
              }
            }
          })
        }
      })
      if (!hasAblm) {
        this.$message({
          type: 'error',
          message: '异常数据不能为空!'
        })
        return false
      }
      // if (flag) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择异常wafer!'
      //   })
      //   return false
      // }
      if (itemFlag) {
        this.$message({
          type: 'error',
          message: '请选择异常原因!'
        })
        return false
      }
      if (this.abnormalRemark.trim() === '') {
        this.$message({
          type: 'error',
          message: '请输入异常原因!'
        })
        return false
      }
      // const params = {
      //   creator: sessionStorage.getItem('User-Id'),
      //   description: this.abnormalRemark,
      //   processId: this.jProcess,
      //   exceptionSiteCode: 'H08',
      //   details
      // }
      this.abnormalReportDialog = false
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      // abnormalSave(params).then(res => {
      //   this.$message({
      //     type: 'success',
      //     message: '操作成功!'
      //   })
      //   this.abnormalReportDialog = false
      // })
    },
    // 接片
    handleReceive() {
      this.receiveDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputJp.focus()
      }, 100)
    },
    // 获取备注
    getRemarkFun() {
      const requestParams = {
        siteId: 27,
        processId: this.jProcess,
        batchNo: this.cBatchNum
      }
      getRemark(requestParams).then(res => {
        this.jRemark = res.data
      })
    },
    // 获取程序
    getProgramFun() {
      const requestParams = {
        siteId: 27,
        processId: this.jProcess,
        batchNo: this.cBatchNum
      }
      getProgram(requestParams).then(res => {
        this.program = res.data
      })
    },
    // 接片扫描
    handleReceiveInput() {
      if (this.cBatchNum.trim() === '') {
        this.$message({
          type: 'error',
          message: '该扫描数据不存在，请确认后，再扫描!'
        })
        this.cBatchNum = ''
        return false
      }
      if (this.receiveList.filter(item => { return item.batchNo === this.cBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前批号已存在!'
        })
        this.cBatchNum = ''
        return false
      }
      if (this.receiveList.filter(item => { return item.waferNo === this.cBatchNum }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前WaferID已存在!'
        })
        this.cBatchNum = ''
        return false
      }
      // J-PB00X99826053X01
      if (this.jProcess !== 72) {
        afterReceiveScanning({ binNo: this.cBatchNum, processId: this.jProcess }).then(res => {
          this.program = res.data.program
          this.jRemark = res.data.remark
          const wafers = []
          res.data.wafers.map(item => {
            wafers.push({
              batchNo: res.data.batchNo,
              emergency: res.data.emergency,
              waferNo: item
            })
          })
          this.receiveList = [...this.receiveList, ...wafers]
          console.log(this.receiveList, 'this.receiveList----------')
          this.cBatchNum = ''
          let batch = ''
          this.batchNoTotal = 0
          this.receiveList.map(item => {
            if (item.batchNo !== batch) {
              batch = item.batchNo
              this.batchNoTotal++
            }
          })
        }).catch(() => { this.cBatchNum = '' })
      } else {
        const requestParams = {
          key: this.cBatchNum,
          processId: this.jProcess,
          siteCode: 'H08'
        }
        receiveScanning(requestParams).then(res => {
          if (res.data !== null) {
            this.program = res.data.program
            this.jRemark = res.data.remark
            const wafers = []
            res.data.wafers.map(item => {
              wafers.push({
                batchNo: res.data.batchNo,
                emergency: res.data.emergency,
                waferNo: item.waferNo
              })
            })
            this.receiveList = [...this.receiveList, ...wafers]
            console.log(this.receiveList, 'this.receiveList----------')
            this.cBatchNum = ''
            let batch = ''
            this.batchNoTotal = 0
            this.receiveList.map(item => {
              if (item.batchNo !== batch) {
                batch = item.batchNo
                this.batchNoTotal++
              }
            })
          }
        }).catch(() => { this.cBatchNum = '' })
      }
    },
    deleteItem(index) {
      this.$confirm('确认删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.receiveList.splice(index, 1)
        let batch = ''
        this.batchNoTotal = 0
        this.receiveList.map(item => {
          if (item.batchNo !== batch) {
            batch = item.batchNo
            this.batchNoTotal++
          }
        })
      })
    },
    // 接片确认
    handleReceiveDialog() {
      if (this.jOperator === '') {
        this.$message({
          type: 'error',
          message: '请选择操作员!'
        })
        return false
      }
      const details = []
      this.receiveList.map(item => {
        if (this.jProcess !== 72) { // 分选后
          details.push({
            batchNo: item.batchNo,
            waferNo: item.waferNo
          })
        } else {
          details.push({ // 分选前
            batchNo: item.batchNo,
            waferNo: item.waferNo
          })
        }
      })
      const requestParams = {
        creator: this.jOperator,
        remark: this.jRemarkLeft,
        details
      }
      if (this.jProcess !== 72) {
        requestParams.type = 1
      }
      addReceive(requestParams).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.receiveDialogVisible = false
        this.fetchData()
      })
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
      if (this.jProcess !== 72) { // 分选后
        const details = []
        this.receiveList.map(receiveItem => {
          details.push({
            batchNo: receiveItem.batchNo,
            waferNo: receiveItem.waferNo,
            classifyId: Array.from(new Set(receiveItem.classifyIdArr)).join(','),
            exceptionId: receiveItem.resonIdArr.join(',')
          })
        })
        // 异常上报-------------------------
        const arterParams = []
        let isAbnormal = false // 是否需要上报异常
        const isAbnormalWafer = []
        this.receiveList.map(subItem => {
          if (subItem.resonDeatil && subItem.resonDeatil.length > 0) {
            if (subItem.abnormalStatus) {
              isAbnormal = true
              isAbnormalWafer.push(subItem.waferNo)
              arterParams.push({
                creator: sessionStorage.getItem('User-Id'),
                pattern: 1,
                reason: subItem.resonNameArr.join(';'),
                checkProcess: this.jProcess,
                waferNo: subItem.waferNo
              })
            }
          }
        })
        if (isAbnormal) { // 有异常数据
          submitAbnormalList(arterParams).then(res => {
            insertRecording(details).then(res => {
              this.$message({
                type: 'error',
                message: `${isAbnormalWafer.join(',')} 存在异常，请先进行异常处理!`
              })
            })
          })
        } else { // 没有异常数据直接传片
          if (this.cOperator === '') {
            this.$message({
              type: 'error',
              message: '请选择操作员!'
            })
            return false
          }
          const requestParams = {
            creator: this.cOperator,
            remark: this.cRemarkLeft,
            isAoi: this.aoiRadio,
            aoiRemark: this.aoiRemarkLeft,
            type: 1,
            details
          }
          transmitting(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.fetchData()
            this.transmitDialogVisible = false
          })
        }
      } else {
        // 传片分选前数据组装-------------------------
        var waferList = []
        // 获取异常Wafer
        this.abnormalReport.map(item => {
          if (item.abnormalStatus) {
            item.wafers.map(subItem => {
              if (subItem.resonDeatil.length !== 0) {
                waferList.push(subItem)
              }
            })
          }
        })
        waferList.map(item => {
          this.receiveList.map(receiveItem => {
            if (item.waferNo === receiveItem.waferNo) {
              receiveItem.classifyId = Array.from(new Set(item.classifyIdArr)).join(',')
              receiveItem.exceptionId = item.resonIdArr.join(',')
            }
          })
        })
        // ///////
        const details = []
        this.receiveList.map(item => {
          details.push({
            batchNo: item.batchNo,
            waferNo: item.waferNo,
            classifyId: item.classifyId,
            exceptionId: item.exceptionId
          })
        })
        // 异常上报-------------------------
        const detail = []
        let isAbnormal = false // 是否需要上报异常
        this.abnormalReport.map(item => {
          if (item.abnormalStatus) {
            item.wafers.map(subItem => {
              if (subItem.resonDeatil.length === 0) {
                if (subItem.abnormalStatus) {
                  detail.push({
                    initAbnormal: true,
                    batchNo: item.batchNo,
                    reason: '',
                    waferNo: subItem.waferNo
                  })
                } else {
                  detail.push({
                    initAbnormal: false,
                    batchNo: item.batchNo,
                    reason: '',
                    waferNo: subItem.waferNo
                  })
                }
              } else {
                if (subItem.abnormalStatus) {
                  isAbnormal = true
                  detail.push({
                    initAbnormal: true,
                    batchNo: item.batchNo,
                    reason: subItem.resonCode.join(','),
                    waferNo: subItem.waferNo
                  })
                } else {
                  detail.push({
                    initAbnormal: false,
                    batchNo: item.batchNo,
                    reason: subItem.resonCode.join(','),
                    waferNo: subItem.waferNo
                  })
                }
              }
            })
          }
        })
        const params = {
          creator: sessionStorage.getItem('User-Id'),
          description: this.abnormalRemark,
          processId: this.jProcess,
          exceptionSiteCode: 'H08',
          details: detail
        }
        console.log(params)
        if (isAbnormal) { // 有异常数据
          abnormalSave(params).then(res => {
            insertRecording(details).then(res => {
              this.$message({
                type: 'error',
                message: '该批次数据异常，请先进行异常处理!'
              })
            })
          })
        } else { // 没有异常数据直接传片
          if (this.cOperator === '') {
            this.$message({
              type: 'error',
              message: '请选择操作员!'
            })
            return false
          }
          const requestParams = {
            creator: this.cOperator,
            remark: this.cRemarkLeft,
            isAoi: this.aoiRadio,
            aoiRemark: this.aoiRemarkLeft,
            details
          }
          if (this.jProcess !== 72) {
            requestParams.type = 1
          }
          console.log(requestParams)
          transmitting(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.fetchData()
            this.transmitDialogVisible = false
          })
        }
      }
    },
    tabClick(index) {
      this.activeTabIndex = index
    },
    clearSearch() {
      this.searchKeys.mjzt = ''
      this.searchKeys.ph = ''
      this.searchKeys.WaferNo = ''
      this.endDate = ''
      this.beginDate = ''
      this.handleSearch()
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    exportExcel() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      let url = ''
      if (this.timeRadio === 0) {
        url = process.env.BASE_API + `/xp-visual-inspection/export-data?batchNo=${this.searchKeys.ph}&waferNo=${this.searchKeys.WaferNo}&timeType=${this.timeRadio}&receiveStartTime=${startTime}&receiveEndTime=${endTime}`
      } else {
        url = process.env.BASE_API + `/xp-visual-inspection/export-data?batchNo=${this.searchKeys.ph}&waferNo=${this.searchKeys.WaferNo}&timeType=${this.timeRadio}&deliverStartTime=${startTime}&deliverEndTime=${endTime}`
      }
      window.open(url)
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
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        batchNo: this.searchKeys.ph,
        waferNo: this.searchKeys.WaferNo,
        status: this.searchKeys.mjzt
      }
      if (this.timeRadio === 0) {
        requestParams.receiveStartTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
        requestParams.receiveEndTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      } else {
        requestParams.deliverStartTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
        requestParams.deliverEndTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      queryList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      this.machineForm.code = ''
      this.machineForm.name = ''
      this.machineForm.remark = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.receiveList = []
      this.batchNoTotal = 0
      this.batchTotal = 0
      this.aoiRadio = 0
      this.cOperator = ''
      this.cRemarkLeft = ''
      this.aoiRemarkLeft = ''
      this.cBatchNum = ''
      this.jBatchNum = ''
      this.jRemarkLeft = ''
      this.cRemarkLeft = ''
      this.jOperator = ''
      this.cOperator = ''
      this.jProcess = this.proceOptions[0].id
      this.jRemark = ''
      this.program = ''
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}

