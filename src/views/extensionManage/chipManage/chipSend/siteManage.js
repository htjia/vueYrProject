
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryList, queryOneDetail, pendingControlslice, pendingSlice, addAndUpdate, settingQuery, userList, substrateFindList, matfindList, billNo, structurefindAll, wySubstrateCraftList, deleteBill } from '@/api/processManagement/chipManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      innerVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      selectTheadVisble: false,
      notBastic: false,
      list: [],
      innerList: [],
      anotherlist: [],
      defaultFormThead: [],
      rightCheck: -1,
      waferTol: 14,
      isActive: 0,
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      anotherpageSize: 12,
      anotherpageNum: 1,
      anothertotalPage: 0,
      beginDate: '',
      endDate: '',
      printDialogVisible: false,
      billNo: '',
      editionType: '',
      structureType: '',
      substrateType: '',
      auditResult: '',
      creatorName: '',
      substrateFindOptions: [],
      machineOptions: [],
      setMousList: [],
      eventWhich: 0,
      lefteventWhich: 0,
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
      tipOutForm: {
        orderNum: '', // 单号
        editionType: '', // 版型
        editionId: '',
        substrateType: '', // 衬底类型
        structureType: '', // 结构类型
        flatPerson: '', // 送片人
        flatDate: '', // 送片日期
        operation: 0, // 操作,
        remark: ''
      },
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
          name: '未审核'
        }
      ],
      editionTypeSelectOptions: [],
      structureTypeSelectOptions: [],
      checkStatusOptions: [],
      // 送片人列表
      operationList: [{
        id: 0,
        name: '送片'
      }],
      // 操作列表
      flatPerson: [{
        id: 0,
        name: '送片人'
      }],
      rules: {
        orderNum: [{ required: true, message: '请选择单号', trigger: 'blur' }],
        editionType: [{ required: true, message: '请选择版型', trigger: 'blur' }],
        substrateType: [{ required: true, message: '请选择衬底类型', trigger: 'blur' }],
        structureType: [{ required: true, message: '请选择结构类型', trigger: 'blur' }],
        flatPerson: [{ required: true, message: '请选择送片人', trigger: 'blur' }],
        flatDate: [{ required: true, message: '请选择送片日期', trigger: 'blur' }]
      },
      // 审核人
      auditor: '',
      auditorList: [{
        id: 0,
        name: '审核人'
      }],
      auditorDate: '',
      auditorResult: '',
      auditorResultList: [{
        id: 0,
        name: '审核人'
      }],
      // 收片人
      receiver: '',
      receiverList: [{
        id: 0,
        name: '收片人'
      }],
      machineValue: '',
      receiverDate: '',
      leftList: [],
      leftList1: [],
      rightList: [],
      rightList1: [],
      rightshowList1: [],
      info: {
        orderNum: '',
        flatPerson: '',
        flatDate: '',
        classes: '',
        substrateType: '',
        auditor: '',
        auditorDate: '',
        editionType: '',
        receiver: '',
        receiverDate: '',
        printDate: '',
        printList: []
      },
      userList: [],
      rowInfo: {
        auditResult: '',
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
        remark: '',
        structureType: '',
        substrateType: '',
        taker: '',
        takerName: '',
        takerTime: '',
        wyGiveSliceDetails: ''
      },
      selectbillNo: '',
      activeTabIndex: 0,
      selectedRightItem: '',
      selectedLeftItem: '',
      selectedList: [],
      setLeftMousList: [],
      runTime: '',
      currentTime: '',
      isSelectedEnd: false,
      showExceptionHandle: false,
      currentId: '',
      isLeft: true,
      isDisabled: false,
      hoverRow: null,
      lefthoverRow: null
    }
  },
  mounted() {
    this.fetchData()
    // this.showtime()
    this.settingQuery()
    this.userLists()
    this.substrateFindList()
    this.matfindList()
    this.structurefindAll()
    this.wySubstrateCraftList()
  },
  methods: {
    wySubstrateCraftList() {
      wySubstrateCraftList().then(res => {
        this.checkStatusOptions = res.data
      })
    },
    structurefindAll() {
      structurefindAll().then(res => {
        this.structureTypeSelectOptions = res.data.list
      })
    },
    // 导入完成
    importsClosure() {
      this.innerVisible = false
      this.activeTabIndex = 1
    },
    timeStop(val) {
      if (val) {
        this.currentTime = this.getCurrentTime()
      }
    }, // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    formatDates(timeStamp) {
      var day = new Date()
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length) + ' ' + day.getHours() + ':' + day.getMinutes() + ':' + day.getSeconds()
    },
    settingQuery() {
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      settingQuery(params).then(res => {
        this.editionTypeSelectOptions = res.data.list
      })
    },
    matfindList() {
      matfindList().then(res => {
        this.machineOptions = res.data
      })
    },
    billNoclick() {
      const params = {
        time: this.formatDate(this.tipOutForm.flatDate)
      }
      billNo(params).then(res => {
        this.tipOutForm.orderNum = res.data
      })
    },
    userLists() {
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      userList(params).then(res => {
        this.userList = res.data.list
      })
    },
    editSubstrateInfo() {
      this.leftList = []
      for (let i = 0; i < this.leftList1.length; i++) {
        // this.leftList[i].frontSubstrate = this.leftList[i].waferId.substring(this.leftList[i].waferId.length - 9)
        var data = {
          runId: this.leftList1[i].runId,
          waferId: this.leftList1[i].waferId,
          laserMark: this.leftList1[i].laserMark,
          visualLevelName: this.leftList1[i].visualLevelName,
          wavelength: this.leftList1[i].wavelength,
          std: this.leftList1[i].std,
          frontSubstrate: '',
          remark: this.leftList1[i].remark,
          typeCode: this.leftList1[i].typeCode,
          structureCode: this.leftList1[i].structureCode,
          substrateCode: this.leftList1[i].substrateCode,
          rightCheck: this.leftList1[i].rightCheck
        }
        if (this.leftList1[i].isControl !== null) {
          data.isControl = this.leftList1[i].isControl + ''
        } else {
          data.isControl = this.leftList1[i].rightCheck + ''
        }
        if (this.leftList1[i].frontSubstrate !== null) {
          data.frontSubstrate = this.leftList1[i].frontSubstrate + ''
        }
        for (const item of this.setLeftMousList) {
          if (item.waferId === this.leftList1[i].waferId) {
            data.frontSubstrate = this.leftList1[i].waferId.substring(2, 4) + '-' + this.leftList1[i].waferId.substring(5, 10) + '-' + this.leftList1[i].waferId.substring(10)
            this.leftList1[i].frontSubstrate = this.leftList1[i].waferId.substring(2, 4) + '-' + this.leftList1[i].waferId.substring(5, 10) + '-' + this.leftList1[i].waferId.substring(10)
            this.$message({
              type: 'success',
              message: '设置成功!'
            })
            break
          }
        }
        this.leftList.push(data)
      }
    },
    // 选择Laser_Mark
    toLeft() {
      if (!this.isLeft) {
        return
      }
      this.isLeft = false
      if (!this.selectedRightItem && this.setMousList.length === 0) {
        this.$message({
          type: 'error',
          message: '请先选择衬底信息!'
        })
      } else {
        let delectIndex = -1
        this.rightshowList1.forEach((item, index) => {
          if (this.selectedRightItem !== null && item.laserMark === this.selectedRightItem.laserMark) {
            if (this.leftList.length > 0) {
              if (this.tipOutForm.editionType === item.typeCode && this.tipOutForm.structureType === item.waferId.substring(0, 1) && this.tipOutForm.substrateType === item.waferId.substring(1, 2)) {
                delectIndex = index
              }
            }
          }
        })
        if (this.rightCheck === 1) {
          if (this.setMousList.length > 0) {
            for (let i = 0; i < this.setMousList.length; i++) {
              for (let x = 0; x < this.rightshowList1.length; x++) {
                if (this.setMousList[i].waferId === this.rightshowList1[x].waferId) {
                  this.setMousList[i].rightCheck = 1
                  this.setMousList[i].isControl = '1'
                  if (this.leftList.length === 0) {
                    this.tipOutForm.editionType = this.setMousList[i].typeCode
                    this.tipOutForm.editionId = this.setMousList[i].type
                    this.tipOutForm.structureType = this.setMousList[i].structureCode
                    this.tipOutForm.substrateType = this.setMousList[i].substrateCode
                  }
                  if (this.tipOutForm.editionType === this.setMousList[i].typeCode && this.tipOutForm.structureType === this.setMousList[i].structureCode && this.tipOutForm.substrateType === this.setMousList[i].substrateCode) {
                    if (this.leftList.length > 0 && this.leftList[this.leftList.length - 1].rightCheck === 0) {
                      if (this.leftList.length >= 21) {
                        this.$message({
                          type: 'error',
                          message: '添加数据超过20行!'
                        })
                        break
                      }
                      this.leftList.splice(this.leftList.length - 1, 0, this.setMousList[i])
                    } else {
                      if (this.leftList.length >= 20) {
                        this.$message({
                          type: 'error',
                          message: '添加数据超过20行!'
                        })
                        break
                      }
                      this.leftList.push(this.setMousList[i])
                    }
                    this.rightshowList1.splice(x, 1)
                  } else {
                    this.$message({
                      type: 'error',
                      message: '所选验证片的版型、衬底工艺和结构类型必须一致，请重试!'
                    })
                  }
                  break
                }
              }
            }
            this.setMousList = []
          } else {
            this.rightshowList1.splice(delectIndex, 1)
            if (this.leftList.length > 0 && this.leftList[this.leftList.length - 1].rightCheck === 0) {
              this.selectedRightItem.isControl = '0'
              this.leftList.splice(this.leftList.length - 1, 0, this.selectedRightItem)
            } else {
              this.selectedRightItem.isControl = '1'
              this.leftList.push(this.selectedRightItem)
            }
          }
          if (this.rightshowList1.length > 0) {
            this.selectedRightItem = this.rightshowList1[0]
            this.setMousList = [this.rightshowList1[0]]
            this.$refs.rightshowList1.setCurrentRow(this.rightshowList1[0])
          }
        } else {
          if (this.leftList.length > 0 && this.leftList[this.leftList.length - 1].rightCheck === 0) {
            this.$message({
              type: 'error',
              message: '列表已添加控制片!'
            })
            this.isLeft = true
            return
          }
          if (this.tipOutForm.editionType !== '' && this.tipOutForm.editionType !== null) {
            if (this.tipOutForm.editionType !== this.selectedRightItem.editionType || this.tipOutForm.structureType !== this.selectedRightItem.struType || this.tipOutForm.substrateType !== this.selectedRightItem.subType) {
              this.$message({
                type: 'error',
                message: '控制片类型不匹配，请重新选择控制片!'
              })
              this.isLeft = true
              return
            }
          }
          this.selectedRightItem.isControl = '0'
          this.rightList = []
          this.selectedRightItem.typeCode = this.selectedRightItem.editionType
          this.selectedRightItem.structureCode = this.selectedRightItem.struType
          this.selectedRightItem.substrateCode = this.selectedRightItem.subType
          this.leftList.push(this.selectedRightItem)
          this.$refs.rightList.setCurrentRow()
        }
        this.tipOutForm.editionType = this.leftList[0].typeCode
        this.tipOutForm.editionId = this.leftList[0].type
        this.tipOutForm.structureType = this.leftList[0].structureCode
        this.tipOutForm.substrateType = this.leftList[0].substrateCode
        this.leftList1 = []
        for (let i = 0; i < this.leftList.length; i++) {
          this.leftList1.push(this.leftList[i])
        }
        // const sortList = []
        // for (let i = 0; i < this.rightList1.length; i++) {
        //   for (let j = 0; j < this.leftList.length; j++) {
        //     if (this.rightList1[i].waferId === this.leftList[j].waferId && this.leftList[j].rightCheck !== 0) {
        //       sortList.push(this.rightList1[i])
        //       break
        //     }
        //   }
        // }
        // if (this.leftList[this.leftList.length - 1].rightCheck === 0) {
        //   sortList.push(this.leftList[this.leftList.length - 1])
        // }
        // console.log(sortList)
        // this.selectedList.push(this.selectedRightItem)
        // for (const item of this.leftList) {
        //   if (item.laserMark === '') {
        //     item.Laser_Mark = this.selectedRightItem.Laser_Mark
        //     return
        //   }
        // }
      }
      this.selectedRightItem = null
      this.isLeft = true
      this.setRigthList()
    },
    toRight() {
      if (this.selectedLeftItem === '' && this.setLeftMousList.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要解绑的Wafer信息!'
        })
      } else {
        if (this.setLeftMousList.length > 0) {
          const setObj = {}
          for (let i = 0; i < this.setLeftMousList.length; i++) {
            setObj[this.setLeftMousList[i].waferId] = this.setLeftMousList[i]
            for (let x = 0; x < this.leftList.length; x++) {
              if (this.setLeftMousList[i].waferId === this.leftList[x].waferId) {
                this.leftList.splice(x, 1)
                // if (this.leftList.length > 0 && this.leftList[this.leftList.length - 1].rightCheck === 0) {
                //   this.leftList.splice(this.leftList.length - 1, 0, this.setMousList[i])
                // } else {
                //   this.leftList.push(this.setMousList[i])
                // }
                break
              }
            }
            if (this.setLeftMousList[i].rightCheck === 0 && this.rightList.length === 0) {
              this.rightList = [this.setLeftMousList[i]]
            }
          }
          var newList = []
          for (let i = 0; i < this.rightList1.length; i++) {
            if (setObj[this.rightList1[i].waferId] === null || setObj[this.rightList1[i].waferId] === undefined) {
              for (let x = 0; x < this.rightshowList1.length; x++) {
                if (this.rightList1[i].waferId === this.rightshowList1[x].waferId) {
                  newList[newList.length] = this.rightList1[i]
                  break
                }
              }
            } else {
              newList[newList.length] = this.rightList1[i]
            }
          }
          this.rightshowList1 = newList
          this.setLeftMousList = []
        }
        // if (this.selectedLeftItem.laserMark === '') {
        //   this.$message({
        //     type: 'error',
        //     message: '请先选择衬底信息!'
        //   })
        // } else {
        //   // this.deleteItem(this.selectedLeftItem)

        //   this.$refs.leftList.setCurrentRow()
        // }
        this.leftList1 = []
        for (let i = 0; i < this.leftList.length; i++) {
          this.leftList1.push(this.leftList[i])
        }
      }
    },
    setRigthList() {
      if (this.rightList.length === 0 && this.leftList.length > 0 && this.leftList[this.leftList.length - 1].rightCheck !== 0) {
        const params = {
          pageSize: 9999999,
          pageNum: 1
        }
        pendingControlslice(params).then(res => {
          for (const item of res.data.list) {
            if (this.tipOutForm.editionType === item.editionType && this.tipOutForm.structureType === item.struType && this.tipOutForm.substrateType === item.subType) {
              item.typeCode = item.editionType
              item.structureCode = item.struType
              item.substrateCode = item.subType
              this.rightList.push(item)
              break
            }
          }
        })
      }
    },
    // 上移
    handleUp(row, index) {
      if (index > 0) {
        const beforeLaserMark = this.leftList[index - 1].Laser_Mark
        const currentLaserMark = row.Laser_Mark
        this.leftList[index - 1].Laser_Mark = currentLaserMark
        this.leftList[index].Laser_Mark = beforeLaserMark
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    // 下移
    handleDown(row, index) {
      if ((index + 1) === this.leftList.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else {
        const nextLaserMark = this.leftList[index + 1].Laser_Mark
        const currentLaserMark = row.Laser_Mark
        this.leftList[index + 1].Laser_Mark = currentLaserMark
        this.leftList[index].Laser_Mark = nextLaserMark
      }
    },
    deleteItem(row, index) {
      if (row.Laser_Mark === '') {
        this.$message({
          type: 'error',
          message: '请先选择衬底信息!'
        })
      } else {
        var delectIndex
        var delectItem
        this.selectedList.forEach((item, index) => {
          if (item.Laser_Mark === row.Laser_Mark) {
            delectIndex = index
            delectItem = item
          }
        })
        this.selectedList.splice(delectIndex, 1)
        this.rightList.push(delectItem)
        row.Laser_Mark = ''
      }
    },
    showtime() {
      this.runTime = this.getCurrentTime()
      setTimeout(this.showtime, 1000)
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
    report() {
      if (this.rowInfo !== null && this.rowInfo.billNo !== null && this.rowInfo.billNo !== '') {
        this.rowInfo.printDate = this.getCurrentTime()
        this.printDialogVisible = true
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要打印的单据!'
        })
      }
    },
    subStrateCurrentChange(row) {
      this.selectedLeftItem = row
    },
    waferLeftChange(row) {
      if (row !== undefined && row !== null) {
        this.setLeftMousList = [row]
        this.selectedLeftItem = row
      }
    },
    waferCurrentChange(row) {
      if (row !== undefined && row !== null) {
        this.rightCheck = 0
        this.setMousList = []
        this.selectedRightItem = row
        this.selectedRightItem.rightCheck = this.rightCheck
        this.$refs.rightshowList1.setCurrentRow()
      }
    },
    waferCurrentChange1(row) {
      if (row !== undefined && row !== null) {
        this.rightCheck = 1
        this.selectedRightItem = row
        // this.setMousList = [row]
        this.$refs.rightshowList1.clearSelection()
        this.$refs.rightshowList1.toggleRowSelection(row)
        this.selectedRightItem.rightCheck = this.rightCheck
        this.$refs.rightList.setCurrentRow()
      }
    },
    hoverCall(row, column, cell, event) {
      if (event.buttons === 1) {
        if (event.which === 1) {
          this.rightCheck = 1
          if (this.eventWhich === 0) {
            // this.setMousList = []
            this.$refs.rightshowList1.clearSelection()
          }
          if (this.hoverRow !== null && this.hoverRow.waferId !== row.waferId) {
            // this.setMousList[this.setMousList.length] = this.hoverRow
            this.$refs.rightshowList1.toggleRowSelection(this.hoverRow)
            this.hoverRow = null
          }
          this.$refs.rightshowList1.toggleRowSelection(row)
          // this.setMousList[this.setMousList.length] = row
          this.eventWhich = 1
          this.$refs.rightshowList1.setCurrentRow()
        } else {
          // this.setMousList = []
          this.$refs.rightshowList1.clearSelection()
          this.eventWhich = 0
          this.hoverRow = row
        }
      } else {
        this.hoverRow = row
      }
    },
    handleSelectionChange(val) {
      this.setMousList = []
      if (val.length > 0) {
        this.rightCheck = 1
        if (val.length === 1) {
          this.selectedRightItem = val[0]
          this.selectedRightItem.rightCheck = this.rightCheck
        }
        for (const item of val) {
          this.setMousList.push(item)
        }
      }
    },
    tableRowClassColor({ row, rowIndex }) {
      for (let i = 0; i < this.setMousList.length; i++) {
        if (row.waferId === this.setMousList[i].waferId) {
          return 'set_green'
        }
      }
    },
    lefthoverCall(row, column, cell, event) {
      if (event.buttons === 1) {
        if (event.which === 1) {
          if (this.lefteventWhich === 0) {
            this.setLeftMousList = []
          }
          if (this.lefthoverRow !== null && this.lefthoverRow.waferId !== row.waferId) {
            this.setLeftMousList[this.setLeftMousList.length] = this.lefthoverRow
            this.hoverRow = null
          }
          this.setLeftMousList[this.setLeftMousList.length] = row
          this.lefteventWhich = 1
        } else {
          this.lefteventWhich = 0
          this.lefthoverRow = row
        }
      } else {
        this.lefthoverRow = row
      }
    },
    lefttableRowClassColor({ row, rowIndex }) {
      for (let i = 0; i < this.setLeftMousList.length; i++) {
        if (row.waferId === this.setLeftMousList[i].waferId) {
          return 'set_green'
        }
      }
    },
    waferClick(data) {
      data.isActive = !data.isActive
    },
    openControlFlat() {
      this.innerVisible = true
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      pendingControlslice(params).then(res => {
        this.listLoading = false
        this.innerList = []
        for (const item of res.data.list) {
          let flag = true
          for (const left of this.leftList) {
            if (left.waferId === item.waferId && left.laserMark === item.laserMark && left.runId === item.runId) {
              flag = false
              break
            }
          }
          if (flag) {
            this.innerList.push(item)
          }
        }
      }, res => {
        this.listLoading = false
      })
    },
    add(row) {
      this.innerVisible = false
      this.rightList = [row]
    },
    // 异常处理
    exceptionHandling() {
      this.showExceptionHandle = true
    },
    // 生成WaferID
    createWaferID() {
      this.activeTabIndex = 1
    },
    // 单击Run信息
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.anotherpageSize = 100000000
      this.anotherpageNum = 1
      this.selectbillNo = row.billNo
      this.rowInfo = row
      this.queryOneDetail()
    },
    queryOneDetail() {
      const params = {
        pageSize: this.anotherpageSize,
        pageNum: this.anotherpageNum,
        billId: this.rowInfo.id
      }
      queryOneDetail(params).then(res => {
        this.anotherlist = res.data.list
        this.anothertotalPage = parseInt(res.data.total)
        this.listLoading = false
      }, res => {
        this.listLoading = false
      })
    },
    // 双击Run信息
    cellDblclick(row, column, cell, event) {
      // this.isActive = 1
      this.anotherpageSize = 12
      this.anotherpageNum = 1
      this.selectbillNo = row.billNo
      this.rowInfo = row
      this.queryOneDetail()
      this.tipEdit()
    },
    // Run信息/Wafer信息切换
    navClick(index) {
      this.isActive = index
    },
    substrateFindList() {
      substrateFindList().then(res => {
        this.substrateFindOptions = res.data
      })
    },
    // 新增
    tipAdd() {
      this.addDialogVisible = true
      this.tipOutForm = {
        orderNum: '', // 单号
        editionType: '', // 版型
        editionId: '', // 版型
        substrateType: '', // 衬底类型
        structureType: '', // 结构类型
        flatPerson: parseInt(sessionStorage.getItem('User-Id')), // 送片人
        flatDate: this.formatDate(new Date()), // 送片日期
        operation: 0, // 操作
        remark: ''
      }
      this.billNoclick()
      this.auditor = ''
      this.auditorDate = ''
      this.auditorResult = ''
      this.leftList = []
      this.rightList = []
      this.rightList1 = []
      this.setMousList = []
      this.setLeftMousList = []
      this.hoverRow = null
      this.lefthoverRow = null
      this.pendingSlice()
    },
    pendingSlice() {
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      if (this.machineValue !== '') {
        params.mCode = this.machineValue
      }
      pendingSlice(params).then(res => {
        this.listLoading = false
        this.rightList1 = res.data.list
        this.rightshowList1 = []
        for (let i = 0; i < res.data.list.length; i++) {
          let flag = true
          for (const item of this.leftList) {
            if (item.waferId === res.data.list[i].waferId) {
              flag = false
              break
            }
          }
          if (flag) {
            res.data.list[i].frontSubstrate = ''
            this.rightshowList1[this.rightshowList1.length] = res.data.list[i]
          }
        }
      }, res => {
        this.listLoading = false
      })
    },
    // 修改
    tipEdit() {
      if (this.rowInfo.billNo === '') {
        this.$message({
          type: 'warning',
          message: '请选择要修改的单据!'
        })
        return
      }
      if (this.rowInfo.auditResult === '1') {
        this.$message({
          type: 'warning',
          message: '无法修改审核通过的单据!'
        })
        return
      }
      this.editDialogVisible = true
      this.tipOutForm.orderNum = this.rowInfo.billNo
      this.tipOutForm.editionType = this.rowInfo.editionType
      this.tipOutForm.flatPerson = this.rowInfo.creator
      this.tipOutForm.flatDate = this.rowInfo.createTime
      this.tipOutForm.substrateType = this.rowInfo.substrateType
      this.tipOutForm.structureType = this.rowInfo.structureType
      this.tipOutForm.operation = parseInt(this.rowInfo.operation)
      this.tipOutForm.remark = this.rowInfo.remark
      this.receiver = this.rowInfo.taker
      this.receiverDate = this.rowInfo.takerTime
      this.auditor = this.rowInfo.auditor
      this.auditorDate = this.rowInfo.auditTime
      this.auditorResult = parseInt(this.rowInfo.auditResult)
      this.leftList = []
      this.leftList1 = []
      for (let i = 0; i < this.anotherlist.length; i++) {
        var data = this.anotherlist[i]
        data.typeCode = this.anotherlist[i].editionType
        data.visualLevelName = this.anotherlist[i].visualLevelCode
        this.leftList.push(data)
        this.leftList1.push(data)
      }
      this.pendingSlice()
    },

    // 衬底投片 基本信息/Wafer信息
    tabClick(index) {
      this.activeTabIndex = index
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
    // 每页数量改变
    anothersizeChange(pageSize) {
      this.anotherpageSize = pageSize
      this.queryOneDetail()
    },
    // 当前页数改变
    anothercurrentChange(pageNum) {
      this.panotherageNum = pageNum
      this.queryOneDetail()
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        billNo: this.billNo,
        editionType: this.editionType,
        structureType: this.structureType,
        substrateType: this.substrateType,
        auditResult: this.auditResult,
        creatorName: this.creatorName,
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
    // 添加
    handleAdd() {
      this.siteForm.siteType = ''
      this.siteForm.siteName = ''
      this.siteForm.siteStatus = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tipOutForm.flatPerson === null || this.tipOutForm.flatPerson.length === 0) {
            this.$message({
              type: 'error',
              message: '请选择送片人!'
            })
            return
          }
          if (this.tipOutForm.flatDate === null || this.tipOutForm.flatDate.length === 0) {
            this.$message({
              type: 'error',
              message: '请选择送片日期!'
            })
            return
          }
          if (this.leftList.length === 0) {
            this.$message({
              type: 'error',
              message: '请添加送片列表!'
            })
            return
          }
          this.isDisabled = true
          const list = []
          for (const item of this.leftList) {
            list.push({
              frontSubstrate: item.frontSubstrate,
              giveSliceId: '',
              isControl: item.rightCheck,
              supplier: '',
              waferId: item.waferId,
              chooseSliceId: item.id
            })
          }
          const params = {
            billNo: this.tipOutForm.orderNum,
            createTime: this.formatDates(this.tipOutForm.flatDate),
            creator: this.tipOutForm.flatPerson,
            editionType: this.tipOutForm.editionId,
            operation: this.tipOutForm.operation,
            structureType: this.tipOutForm.structureType,
            substrateType: this.tipOutForm.substrateType,
            remark: this.tipOutForm.remark,
            wyGiveSliceDetails: list,
            operationState: 'add'
          }
          addAndUpdate(params).then(res => {
            this.isDisabled = false
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.addDialogVisible = false
              this.fetchData()
            }
          }, res => {
            this.isDisabled = false
          })
        } else {
          return false
        }
      })
    },
    deleteLIT() {
      if (this.rowInfo.billNo === '') {
        this.$message({
          type: 'warning',
          message: '请选择要修改的单据!'
        })
        return
      }
      if (this.rowInfo.auditResult !== '2') {
        this.$message({
          type: 'warning',
          message: '只能删除待审核的单据!'
        })
        return
      }
      this.$confirm('是否确认删除该单据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isDisabled = true
        const params = {
          id: this.rowInfo.id
        }
        deleteBill(params).then(res => {
          this.isDisabled = false
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        }, res => {
          this.isDisabled = false
        })
      }).catch(() => {
      })
    },
    // 添加提交
    editsubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tipOutForm.flatPerson.length === 0) {
            this.$message({
              type: 'error',
              message: '请选择送片人!'
            })
            return
          }
          if (this.tipOutForm.flatDate.length === 0) {
            this.$message({
              type: 'error',
              message: '请选择送片日期!'
            })
            return
          }
          if (this.leftList.length === 0) {
            this.$message({
              type: 'error',
              message: '请添加送片列表!'
            })
            return
          }
          const list = []
          for (const item of this.leftList) {
            list.push({
              frontSubstrate: item.frontSubstrate,
              giveSliceId: '',
              isControl: item.rightCheck,
              supplier: '',
              waferId: item.waferId,
              chooseSliceId: item.id
            })
          }
          this.isDisabled = true
          const params = {
            billNo: this.tipOutForm.orderNum,
            createTime: this.formatDates(this.tipOutForm.flatDate),
            creator: this.tipOutForm.flatPerson,
            editionType: this.tipOutForm.editionId,
            operation: this.tipOutForm.operation,
            structureType: this.tipOutForm.structureType,
            substrateType: this.tipOutForm.substrateType,
            remark: this.tipOutForm.remark,
            wyGiveSliceDetails: list,
            operationState: 'update'
          }
          addAndUpdate(params).then(res => {
            this.isDisabled = false
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
              this.fetchData()
            }
          }, res => {
            this.isDisabled = false
          })
        } else {
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
    clearButton() {
      this.billNo = ''
      this.editionType = ''
      this.structureType = ''
      this.substrateType = ''
      this.auditResult = ''
      this.creatorName = ''
      this.beginDate = ''
      this.endDate = ''
      this.fetchData()
    },
    printDiv() {
      this.printDialogVisible = false
      setTimeout(() => {
        const head_str = '<html><head><title></title></head><body>'
        const foot_str = '</body></html>'
        const new_str = document.getElementById('printDiv').innerHTML
        const newWind = window.open('打印窗口', '_blank')
        newWind.document.write(head_str + new_str + foot_str)
        newWind.document.close()
        newWind.print()
        newWind.close()
        // this.$print(this.$refs.print)
      }, 500)
    },
    exportAll() {
      if (this.rowInfo !== null && this.rowInfo.billNo !== null && this.rowInfo.billNo !== '') {
        window.open(process.env.BASE_API + `/wy-give-slice/export-give-slice?billNo=${this.rowInfo.billNo}`)
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要导出的单据!'
        })
      }
    }
  }
}

