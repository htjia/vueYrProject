
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { update, remove } from '@/api/processManagement/siteManage'
import { alternativeSlice, furnacefindAll, matfindList, substrateFindList, decideFind, chooseAdd, alternativeSliceWafers } from '@/api/processManagement/chipManage'
const defaultFormThead = [
  {
    thName: '导入时间',
    thKey: 'name'
  },
  {
    thName: '镭刻号',
    thKey: 'status'
  }
]
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
      defaultFormThead: [],
      formThead: defaultFormThead,
      waferTol: 0,
      isActive: 0,
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      type: '',
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
      userOptions: [],
      wafers: [
        { name: 1, isActive: false }, { name: 2, isActive: false }, { name: 3, isActive: false }, { name: 4, isActive: false }, { name: 5, isActive: false },
        { name: 6, isActive: false }, { name: 7, isActive: false }, { name: 8, isActive: false }, { name: 9, isActive: false }, { name: 10, isActive: false },
        { name: 11, isActive: false }, { name: 12, isActive: false }, { name: 13, isActive: false }, { name: 14, isActive: false }, { name: 15, isActive: false },
        { name: 16, isActive: false }, { name: 17, isActive: false }, { name: 18, isActive: false }, { name: 19, isActive: false }, { name: 20, isActive: false },
        { name: 21, isActive: false }, { name: 22, isActive: false }, { name: 23, isActive: false }, { name: 24, isActive: false }, { name: 25, isActive: false },
        { name: 26, isActive: false }, { name: 27, isActive: false }, { name: 28, isActive: false }, { name: 29, isActive: false }, { name: 30, isActive: false },
        { name: 31, isActive: false }, { name: 32, isActive: false }, { name: 33, isActive: false }, { name: 34, isActive: false }, { name: 35, isActive: false },
        { name: 36, isActive: false }, { name: 37, isActive: false }, { name: 38, isActive: false }, { name: 39, isActive: false }, { name: 40, isActive: false },
        { name: 41, isActive: false }, { name: 42, isActive: false }, { name: 43, isActive: false }, { name: 44, isActive: false }, { name: 45, isActive: false },
        { name: 46, isActive: false }, { name: 47, isActive: false }, { name: 48, isActive: false }, { name: 49, isActive: false }, { name: 50, isActive: false },
        { name: 51, isActive: false }, { name: 52, isActive: false }, { name: 53, isActive: false }, { name: 54, isActive: false }
      ],
      leftList: [],
      rightList: [],
      activeTabIndex: 0,
      selectedRightItem: '',
      selectedLeftItem: '',
      selectedList: [],
      anotherlist: [],
      runTime: '',
      currentTime: '',
      isSelectedEnd: false,
      showExceptionHandle: false,
      checkDialogVisible: false,
      currentId: '',
      LaserMark: '',
      anotherpageSize: 12,
      anotherpageNum: 1,
      anothertotalPage: 0,
      rowInfo: {
        adjusts: '',
        createTime: '',
        creator: '',
        creatorName: '',
        decideId: '',
        endTime: '',
        exception: '',
        finalStatus: '',
        id: '',
        machineCode: '',
        machineId: '',
        measureId: '',
        oldRunId: '',
        platterId: '',
        platterNo: '',
        platterTotal: '',
        produceCode: '',
        produceId: '',
        recipeName: '',
        remark: '',
        runId: '',
        runTime: '',
        standbyReason: '',
        standbyTime: '',
        startTime: '',
        status: '',
        stoveCode: '',
        stoveId: '',
        structureCode: '',
        structureTypeId: '',
        substrateCode: '',
        substrateTypeId: '',
        taker: '',
        takerName: '',
        waferList: '',
        wafers: [],
        decisionRuleId: 0,
        wavelength: ''
      },
      isDisable: false,
      machineOptions: [],
      furnaceOptions: [],
      substrateFindOptions: [],
      machineValue: '',
      furnaceValue: '',
      runId: '',
      statusValue: '',
      decideFindOptions: [],
      decisionRuleId: '',
      checkList: [],
      statusList: [
        { id: 5, name: '目检测试完成' },
        { id: 6, name: 'COW数据返回' },
        { id: 7, name: '已送验证片' }
      ],
      decisionRuleList: [
        { id: 1, name: '1片代1圈' },
        { id: 2, name: '1片代2圈' },
        { id: 3, name: '1片代4圈' }
      ],
      isDisabled: false,
      selectList: [],
      dataList: []
    }
  },
  mounted() {
    this.fetchData()
    this.showtime()
    this.matfindList()
    this.furnacefindAll()
    this.substrateFindList()
    this.decideFind()
  },
  methods: {
    // 导入完成
    importsClosure() {
      this.innerVisible = false
      this.activeTabIndex = 1
    },
    matfindList() {
      matfindList().then(res => {
        this.machineOptions = res.data
      })
    },
    substrateFindList() {
      substrateFindList().then(res => {
        this.substrateFindOptions = res.data.list
      })
    },
    furnacefindAll() {
      const params = {
        pageNum: 1,
        pageSize: 10000000
      }
      furnacefindAll(params).then(res => {
        this.furnaceOptions = res.data.list
      })
    },
    decideFind() {
      const params = {
        pageNum: 1,
        pageSize: 10000000
      }
      decideFind(params).then(res => {
        this.decisionRuleList = res.data.list
      })
    },
    timeStop(val) {
      if (val) {
        this.currentTime = this.getCurrentTime()
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
      var hours = date.getHours()
      var minutes = date.getMinutes()
      var seconds = date.getSeconds()
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (hours < 10) {
        hours = '0' + hours
      }
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    },
    subStrateCurrentChange(row) {
      this.selectedRightItem = row
    },
    waferCurrentChange(row) {
      this.selectedLeftItem = row
    },
    waferClick(data) {
      // data.isActive = !data.isActive
      console.log(data)
    },
    editSubstrateInfo() {
      this.innerVisible = true
    },
    // 异常处理
    exceptionHandling() {
      this.showExceptionHandle = true
    },
    // 生成WaferID
    createWaferID() {
      console.log(123)
    },
    // 单击Run信息
    alternativeSliceWafers() {
      const requestParams = {
        runId: this.rowInfo.runId
      }
      alternativeSliceWafers(requestParams).then(res => {
        this.anotherlist = []
        var waferIdArr = []
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].isAcceptSlice === '1') {
            res.data[i].isSelected = true
            res.data[i].isAcceptSlices = true
          } else if (res.data[i].isAcceptSlice === '0') {
            res.data[i].isSelected = true
            res.data[i].isAcceptSlices = false
          } else {
            res.data[i].isSelected = false
            res.data[i].isAcceptSlices = false
          }
          // row.wafers[i].type = ''
          waferIdArr.push(parseInt(res.data[i].waferId.substr(10, 2)))
          this.anotherlist.push(res.data[i])
        }
        this.wafers.map((item) => {
          item.isActive = false
        })
        this.wafers.forEach((item, index) => {
          waferIdArr.map((waferId) => {
            if (waferId - 1 === index) {
              item.isActive = true
            }
          })
        })
        this.waferTol = res.data.length
        if (this.anotherpageSize === 2) {
          this.tipOut()
        }
      })
    },
    // 单击Run信息
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.anotherpageSize = 1
      // this.selectbillNo = row.machineCode
      this.rowInfo = row
      if (this.rowInfo.startTime !== null && this.rowInfo.startTime.length > 0) {
        this.rowInfo.startTimes = this.rowInfo.startTime.substring(11)
      }
      this.rowInfo.decisionRuleId = row.decideId
      this.alternativeSliceWafers()
      // this.queryOneDetail()
    },
    // 双击Run信息
    cellDblclick(row, column, cell, event) {
      // this.isActive = 1
      if (row === null) {
        return
      }
      this.anotherpageSize = 2
      // this.selectbillNo = row.machineCode
      this.rowInfo = row
      if (this.rowInfo.startTime !== null && this.rowInfo.startTime.length > 0) {
        this.rowInfo.startTimes = this.rowInfo.startTime.substring(11)
      }
      this.rowInfo.decisionRuleId = row.decideId
      this.alternativeSliceWafers()
      this.tipOut()
    },
    setTouPian(row) {
      if (!row.isSelected && row.isAcceptSlice) {
        row.isSelected = true
      }
    },
    resetYanZhengpian(row) {
      let flag = false
      var circle = {}
      let num = 1
      for (let i = 0; i < this.checkList.length; i++) {
        if (this.checkList[i].sign === 1) {
          circle[this.checkList[i].circle] = num
          num = num + 1
        }
      }
      if (this.rowInfo.decisionRuleId === 1) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].isAcceptSlice && this.checkList[i].waferId !== row.waferId && this.checkList[i].circle === row.circle) {
            flag = true
            break
          }
        }
        if (flag) {
          row.isAcceptSlice = false
        }
      } else if (this.rowInfo.decisionRuleId === 2) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].isAcceptSlice && this.checkList[i].waferId !== row.waferId) {
            const ct = circle[this.checkList[i].circle]
            const rowct = circle[row.circle]
            if (ct % 2 === 0) {
              if (ct === rowct || ct - 1 === rowct) {
                flag = true
                break
              }
            } else {
              if (ct === rowct || ct + 1 === rowct) {
                flag = true
                break
              }
            }
          }
        }
        if (flag) {
          row.isAcceptSlice = false
        }
      } else if (this.rowInfo.decisionRuleId === 3) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].isAcceptSlice && this.checkList[i].waferId !== row.waferId) {
            const ct = circle[this.checkList[i].circle]
            const rowct = circle[row.circle]
            if (ct % 4 === 0) {
              if (ct - 4 < rowct && ct >= rowct) {
                flag = true
                break
              }
            } else {
              const index = parseInt(ct / 4) * 4
              if (index < rowct && index + 4 >= rowct) {
                flag = true
                break
              }
            }
          }
        }
        if (flag) {
          row.isAcceptSlice = false
        }
      }
    },
    setYanZhengpian(row) {
      let flag = false
      var circle = {}
      let num = 1
      for (let i = 0; i < this.checkList.length; i++) {
        if (this.checkList[i].sign === 1) {
          circle[this.checkList[i].circle] = num
          num = num + 1
        }
      }
      if (this.rowInfo.decisionRuleId === 1) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].isAcceptSlice && this.checkList[i].waferId !== row.waferId && this.checkList[i].circle === row.circle) {
            flag = true
            break
          }
        }
        if (flag) {
          this.$message({
            type: 'error',
            message: '每一圈只能选择一个验证片'
          })
          row.isAcceptSlice = false
        } else {
          row.isSelected = true
          this.setIsYz(row)
        }
      } else if (this.rowInfo.decisionRuleId === 2) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].isAcceptSlice && this.checkList[i].waferId !== row.waferId) {
            const ct = circle[this.checkList[i].circle]
            const rowct = circle[row.circle]
            if (ct % 2 === 0) {
              if (ct === rowct || ct - 1 === rowct) {
                flag = true
                break
              }
            } else {
              if (ct === rowct || ct + 1 === rowct) {
                flag = true
                break
              }
            }
          }
        }
        if (flag) {
          this.$message({
            type: 'error',
            message: '每两圈只能选择一个验证片'
          })
          row.isAcceptSlice = false
        } else {
          row.isSelected = true
          this.setIsYz(row)
        }
      } else if (this.rowInfo.decisionRuleId === 3) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].isAcceptSlice && this.checkList[i].waferId !== row.waferId) {
            const ct = circle[this.checkList[i].circle]
            const rowct = circle[row.circle]
            if (ct % 4 === 0) {
              if (ct - 4 < rowct && ct >= rowct) {
                flag = true
                break
              }
            } else {
              const index = parseInt(ct / 4) * 4
              if (index < rowct && index + 4 >= rowct) {
                flag = true
                break
              }
            }
          }
        }
        if (flag) {
          this.$message({
            type: 'error',
            message: '每四圈只能选择一个验证片'
          })
          row.isAcceptSlice = false
        } else {
          row.isSelected = true
          this.setIsYz(row)
        }
      }
    },
    setIsYz(row) {
      if (row.isAcceptSlice) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].isAcceptSlice && this.checkList[i].waferId !== row.waferId && this.checkList[i].circle !== row.circle) {
            this.checkList[i].type = row.type
          }
        }
      }
    },
    // Run信息/Wafer信息切换
    navClick(index) {
      this.isActive = index
    },
    // 衬底投片
    tipOut() {
      console.log(this.anotherlist)
      if (this.rowInfo.runId === '') {
        this.$message({
          type: 'error',
          message: '请选择要选片的Run信息!'
        })
        return
      }
      if (this.rowInfo.finalStatus === '8') {
        this.$message({
          type: 'error',
          message: '部分入库/已入库状态无法选择投片'
        })
        return
      }
      this.isDisable = false
      this.substrateFindList()
      this.rowInfo.createTime = this.rowInfo.createTime.substring(0, 10)
      this.addDialogVisible = true
      this.activeTabIndex = 0
      this.checkList = []
      this.rowInfo.decisionRuleId = this.rowInfo.decideId
      if (this.rowInfo.decisionRuleId === '' || this.rowInfo.decisionRuleId === null || this.rowInfo.decisionRuleId === undefined) {
        this.rowInfo.decisionRuleId = 1
      }
      let pointName = ''
      for (const item of this.decisionRuleList) {
        if (item.id === this.rowInfo.decisionRuleId) {
          pointName = item.name
          break
        }
      }
      for (let i = 0; i < this.anotherlist.length; i++) {
        var data = {
          operation: this.anotherlist[i].operation,
          waferId: this.anotherlist[i].waferId,
          laserMark: this.anotherlist[i].laserMark,
          boxNo: this.anotherlist[i].boxNo,
          swr: this.anotherlist[i].swr,
          visualLevelCode: this.anotherlist[i].visualLevelCode,
          wdAvr: this.anotherlist[i].wdAvr,
          wdStd: this.anotherlist[i].wdStd,
          iiAvr: this.anotherlist[i].iiAvr,
          iiStd: this.anotherlist[i].iiStd,
          isSelected: this.anotherlist[i].recommend === 1 ? true : this.anotherlist[i].isSelected,
          isAcceptSlice: this.anotherlist[i].recommend === 1 ? true : this.anotherlist[i].isAcceptSlices,
          type: this.anotherlist[i].type,
          point: pointName,
          remark: this.anotherlist[i].remark,
          sign: this.anotherlist[i].sign,
          circle: this.anotherlist[i].circle
        }
        if (data.operation === 1) {
          this.isDisable = true
        }
        this.checkList.push(data)
      }
    },
    // 衬底投片 基本信息/Wafer信息
    tabClick(index) {
      this.activeTabIndex = index
      // if (index === 1 && this.checkList.length > 0) {
      //   this.anotherlist = []
      //   for (let i = 0; i < this.checkList.length; i++) {
      //     var data = this.checkList[i]
      //     this.anotherlist.push(data)
      //   }
      // }
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
    clearAll() {
      this.beginDate = ''
      this.endDate = ''
      this.runId = ''
      this.machineValue = ''
      this.statusValue = ''
      this.furnaceValue = ''
      this.pageNum = 1
      this.fetchData()
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
        mCode: this.machineValue,
        stoveCode: this.furnaceValue,
        status: this.statusValue
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      alternativeSlice(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        this.waferTol = 0
        this.anotherlist = []
        if (this.list.length > 0) {
          this.$refs.listTabel.setCurrentRow(this.list[0])
        }
      })
    },
    updateWaferZX() {
      let pointName = ''
      for (const item of this.decisionRuleList) {
        if (item.id === this.rowInfo.decisionRuleId) {
          pointName = item.name
          break
        }
      }
      this.checkList = []
      for (let i = 0; i < this.anotherlist.length; i++) {
        var data = {
          waferId: this.anotherlist[i].waferId,
          laserMark: this.anotherlist[i].laserMark,
          boxNo: this.anotherlist[i].boxNo,
          swr: this.anotherlist[i].swr,
          visualLevelCode: this.anotherlist[i].visualLevelCode,
          wdAvr: this.anotherlist[i].wdAvr,
          wdStd: this.anotherlist[i].wdStd,
          iiAvr: this.anotherlist[i].iiAvr,
          isSelected: this.anotherlist[i].isSelected,
          isAcceptSlice: this.anotherlist[i].isAcceptSlices,
          type: this.anotherlist[i].type,
          point: pointName,
          remark: this.anotherlist[i].remark,
          sign: this.anotherlist[i].sign,
          circle: this.anotherlist[i].circle
        }
        this.checkList.push(data)
      }
      for (let i = 0; i < this.checkList.length; i++) {
        this.resetYanZhengpian(this.checkList[i])
      }
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
    submitForm() {
      if (this.rowInfo.decisionRuleId === '' || this.rowInfo.decisionRuleId === undefined) {
        this.$message({
          type: 'error',
          message: '请选择判定指向!'
        })
        return
      }
      this.dataList = []
      this.selectList = []
      let flag = false
      let flag1 = false
      for (let i = 0; i < this.checkList.length; i++) {
        if (this.checkList[i].isSelected) {
          this.dataList[this.dataList.length] = {
            isAcceptSlice: this.checkList[i].isAcceptSlice ? '1' : '0',
            type: this.checkList[i].type,
            waferId: this.checkList[i].waferId,
            remark: this.checkList[i].remark,
            circle: this.checkList[i].circle
          }
          if (this.checkList[i].isAcceptSlice) {
            this.selectList.push({
              waferId: this.checkList[i].waferId,
              laserMark: this.checkList[i].laserMark,
              index: i + 1
            })
          }
          if (this.checkList[i].type === null || this.checkList[i].type === '' || this.checkList[i].type === undefined) {
            flag1 = true
          }
          if (this.checkList[i].isAcceptSlice === null || this.checkList[i].isAcceptSlice === undefined) {
            flag = true
          }
        }
      }
      let num = 0
      let circle = 0
      if (this.rowInfo.decisionRuleId === 1) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].isAcceptSlice) {
            num = num + 1
          }
          if (this.checkList[i].sign === 1) {
            circle = circle + 1
          }
        }
        // if (num !== circle) {
        //   this.$message({
        //     type: 'error',
        //     message: '每一圈必须选择一个验证片'
        //   })
        //   return
        // }
      } else if (this.rowInfo.decisionRuleId === 2) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].isAcceptSlice) {
            num = num + 1
          }
          if (this.checkList[i].sign === 1) {
            circle = circle + 1
          }
        }
        // if (circle % 2 === 0) {
        //   if (num !== circle / 2) {
        //     this.$message({
        //       type: 'error',
        //       message: '每两圈必须选择一个验证片'
        //     })
        //     return
        //   }
        // } else {
        //   if (num !== parseInt(circle / 2) + 1) {
        //     this.$message({
        //       type: 'error',
        //       message: '每两圈必须选择一个验证片'
        //     })
        //     return
        //   }
        // }
      } else if (this.rowInfo.decisionRuleId === 3) {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].isAcceptSlice) {
            num = num + 1
          }
          if (this.checkList[i].sign === 1) {
            circle = circle + 1
          }
        }
        // if (circle % 4 === 0) {
        //   if (num !== circle / 4) {
        //     this.$message({
        //       type: 'error',
        //       message: '每四圈必须选择一个验证片'
        //     })
        //     return
        //   }
        // } else {
        //   if (num !== parseInt(circle / 4) + 1) {
        //     this.$message({
        //       type: 'error',
        //       message: '每四圈必须选择一个验证片'
        //     })
        //     return
        //   }
        // }
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: '已选择的投片类型不能为空!'
        })
        return
      }
      if (this.dataList.length === 0 || flag) {
        // this.isDisabled = false
        // this.$message({
        //   type: 'error',
        //   message: '请选择需要投片的验证片!'
        // })
        // return
        this.checkDialogVisible = true
      } else {
        this.checkDialogVisible = true
      }
    },
    submit() {
      this.isDisabled = true
      const params = {
        runId: this.rowInfo.runId,
        decisionRuleId: this.rowInfo.decisionRuleId,
        list: this.dataList
      }
      chooseAdd(params).then(res => {
        this.isDisabled = false
        if (res.code === 0) {
          this.checkDialogVisible = false
          this.addDialogVisible = false
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.handleSearch()
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      }, res => {
        this.isDisabled = false
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
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    tableRowClassColor({ row, rowIndex }) {
      if (row.operation === 1) {
        return 'set_blue'
      } else if (row.sign === 1) {
        return 'set_yellow'
      }
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
          return false
        }
      })
    },
    // 关闭1
    handleClose1() {
      this.$confirm('关闭后若有未保存的信息将丢失，确认关闭？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addDialogVisible = false
      }).catch(() => {
        this.addDialogVisible = true
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该站点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id
        }
        remove(param).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum = this.pageNum - 1
            }
            this.fetchData()
          }
        })
      })
    }
  }
}

