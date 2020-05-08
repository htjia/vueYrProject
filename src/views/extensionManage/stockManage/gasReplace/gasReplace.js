
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  findGasList,
  gasSwitch,
  updateGasSource,
  update,
  gasRecordList
} from '@/api/extensionManage/stockManage/gasReplace'
import { machineList } from '@/api/extensionManage/wyBasicInfoManage/mocvdInfo' // 机台查询
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      gesReplaceDialogVisible: false,
      sih4Top: false,
      configuring: false,
      determine: false,
      switchDialogVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      notBastic: false,
      gasConfigId: '',
      gasLocation: '',
      aBatchId: '',
      aBatchId1: '',
      aBatchId2: '',
      bBatchId1: '',
      bBatchId2: '',
      bBatchId: '',
      aDeviceId: '',
      bDeviceId: '',
      switchH2params: {},
      formTitle: '',
      h2Active: 'a',
      NH3Active: 'a',
      sih4TopActive: 'a',
      sih4BottomActive: 'a',
      chq1Switch: '0',
      chq2Switch: '0',
      chq1Nh3Switch: '0',
      chq2Nh3Switch: '0',
      N2chq1Switch: '0',
      N2chq2Switch: '0',
      hSwitch: '0',
      NH3hSwitch: '0',
      N2hSwitch: '0',
      sih4hSwitch: '0',
      batchA: '',
      batchB: '',
      batchA1: '',
      batchA2: '',
      batchB1: '',
      batchB2: '',
      batchNH3A: '',
      batchNH3B: '',
      chq1: '',
      N2chq1: '',
      NH3chq1: '',
      chq2: '',
      N2chq2: '',
      NH3chq2: '',
      vmb1: '',
      N2vmb1: '',
      NH3vmb1: '',
      vmb2: '',
      N2vmb2: '',
      sih4vmb1: '',
      sih4vmb2: '',
      NH3vmb2: '',
      list: [],
      hours: [],
      minutes: [],
      recordList: [],
      machineList: [], // 机台
      H2vmbList1: [],
      H2vmbList2: [],
      N2vmbList1: [],
      N2vmbList2: [],
      NH3vmbList1: [],
      NH3vmbList2: [],
      sih4vmbList1: [],
      sih4vmbList2: [],
      H2vmbValueList1: [],
      N2vmbValueList1: [],
      NH3vmbValueList1: [],
      sih4vmbValueList1: [],
      H2vmbValueList2: [],
      N2vmbValueList2: [],
      NH3vmbValueList2: [],
      sih4vmbValueList2: [],
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
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
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
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
      },
      options: [
        {
          value: '0',
          label: '请选择'
        },
        {
          value: '1',
          label: '选项一'
        },
        {
          value: '2',
          label: '选项二'
        },
        {
          value: '3',
          label: '选项三'
        }
      ],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      siteOptions: [
        {
          id: 0,
          name: '前段'
        },
        {
          id: 1,
          name: '后段'
        }
      ],
      siteSelectOptions: [
        {
          id: '',
          name: '全部'
        },
        {
          id: 0,
          name: '前段站点'
        },
        {
          id: 1,
          name: '后段站点'
        }
      ],
      siteStatusOptions: [
        {
          id: 0,
          name: '启用'
        },
        {
          id: 1,
          name: '停用'
        }
      ],
      userOptions: [],
      ruleForm: {
        date1: '',
        date2: '',
        hours: '',
        minutes: ''
      },
      searchKeys: {
        pch: ''
      },
      rules: {
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ]
      },
      hintText: '',
      activeTabIndex: 0,
      tableKey: 0,
      currentId: ''
    }
  },
  mounted() {
    this.hours = []
    this.minutes = []
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        this.hours.push({
          name: '0' + i
        })
        this.minutes.push({
          name: '0' + i
        })
      } else if (i > 9 && i < 24) {
        this.hours.push({
          name: '' + i
        })
        this.minutes.push({
          name: '' + i
        })
      } else {
        this.minutes.push({
          name: '' + i
        })
      }
    }
    this.machineListFun()
    this.fetchData()
  },
  // computed: {
  //   hStatus() {
  //     return this.hSwitch === '0' ? '已开启' : '已关闭'
  //   }
  // },
  methods: {
    // 获取机台
    machineListFun() {
      machineList({}).then(res => {
        this.machineList = res.data
      })
    },
    // 更换记录关闭
    gesReplaceDialogClose() {
      this.searchKeys.pch = ''
      this.beginDate = ''
      this.endDate = ''
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 清除搜索
    clearSearch() {
      this.beginDate = ''
      this.endDate = ''
      this.searchKeys.pch = ''
    },
    // 查看气体更换记录
    gesReplaceRecord() {
      const params = {
        gas: this.activeTabIndex,
        newBatch: this.searchKeys.pch,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        pageNum: '',
        pageSize: ''
      }
      gasRecordList(params).then(res => {
        this.recordList = res.data.list
        this.totalPage = res.data.total
      })
      this.tableKey++
      this.gesReplaceDialogVisible = true
    },
    // 气体配置
    handleConfig() {
      this.configuring = true
    },
    // 保存配置
    submitConfig() {
      var machineListA = []
      var machineListB = []
      this.H2vmbList1.map((item) => {
        machineListA.push({
          machineId: item.machineId
        })
      })
      this.H2vmbList2.map((item) => {
        machineListB.push({
          machineId: item.machineId
        })
      })
      const params = {
        id: this.gasConfigId,
        gasType: this.activeTabIndex,
        // name: '氢气管理',
        deviceList: [
          {
            id: this.aDeviceId,
            purifierStatus: parseInt(this.chq1Switch),
            hstatus: parseInt(this.hSwitch),
            machineList: machineListA
          },
          {
            id: this.bDeviceId,
            purifierStatus: parseInt(this.chq2Switch),
            hstatus: parseInt(this.hSwitch),
            machineList: machineListB
          }
        ]
      }
      if (this.activeTabIndex === 0) {
        params.name = '氢气管理'
      }
      if (this.activeTabIndex === 1) {
        params.name = '氨气管理'
      }
      if (this.activeTabIndex === 2) {
        params.name = '氮气管理'
      }
      update(params).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.configuring = false
        this.fetchData()
      })
    },
    // 取消配置
    cancelConfig() {
      this.fetchData()
      this.configuring = false
    },
    addItem(num) {
      if (num === 1) {
        this.H2vmbList1.push({ machineId: '' })
      } else {
        this.H2vmbList2.push({ machineId: '' })
      }
    },
    NH3AddItem(num) {
      if (num === 1) {
        this.NH3vmbList1.push(0)
      } else {
        this.NH3vmbList2.push(0)
      }
    },
    N2AddItem(num) {
      if (num === 1) {
        this.N2vmbList1.push(0)
      } else {
        this.N2vmbList2.push(0)
      }
    },
    sih4AddItem(num) {
      if (num === 1) {
        this.sih4vmbList1.push(0)
      } else {
        this.sih4vmbList2.push(0)
      }
    },
    deleteSih4Item(index, num) {
      if (num === 1) {
        this.sih4vmbList1.splice(index, 1)
        this.sih4vmbValueList1.splice(index, 1)
      } else {
        this.sih4vmbList2.splice(index, 1)
        this.sih4vmbValueList2.splice(index, 1)
      }
    },
    deleteH2Item(index, num) {
      if (num === 1) {
        this.H2vmbList1.splice(index, 1)
        this.H2vmbValueList1.splice(index, 1)
      } else {
        this.H2vmbList2.splice(index, 1)
        this.H2vmbValueList2.splice(index, 1)
      }
    },
    deleteNH3Item(index, num) {
      if (num === 1) {
        this.NH3vmbList1.splice(index, 1)
        this.NH3vmbValueList1.splice(index, 1)
      } else {
        this.NH3vmbList2.splice(index, 1)
        this.NH3vmbValueList2.splice(index, 1)
      }
    },
    deleteN2Item(index, num) {
      if (num === 1) {
        this.N2vmbList1.splice(index, 1)
        this.N2vmbValueList1.splice(index, 1)
      } else {
        this.N2vmbList2.splice(index, 1)
        this.N2vmbValueList2.splice(index, 1)
      }
    },
    handleSwitchBatch(index) {
      var params
      if (this.activeTabIndex === 3) {
        if (index === 1) {
          params = {
            batch: this.sih4TopActive === 'a' ? this.batchB1 : this.batchA1,
            id: this.sih4TopActive === 'a' ? this.bBatchId1 : this.aBatchId1
          }
        } else {
          params = {
            batch: this.sih4BottomActive === 'a' ? this.batchB2 : this.batchA2,
            id: this.sih4BottomActive === 'a' ? this.bBatchId2 : this.aBatchId2
          }
        }
      } else {
        params = {
          batch: this.h2Active === 'a' ? this.batchB : this.batchA,
          id: this.h2Active === 'a' ? this.bBatchId : this.aBatchId
        }
      }
      if (params.batch === '') {
        this.$message({
          type: 'error',
          message: '请输入批次号!'
        })
        return false
      }
      updateGasSource(params).then(res => {
        this.$message({
          type: 'success',
          message: '更换成功!'
        })
        this.fetchData()
      })
    },
    getFormatDate() {
      var date = new Date()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentDate = date.getFullYear() + '-' + month + '-' + strDate
      return currentDate
    },
    getFormatHours() {
      var date = new Date()
      var hours = date.getHours()
      if (hours >= 0 && hours <= 9) {
        hours = '0' + hours
      } else {
        hours = '' + hours
      }
      return hours
    },
    getFormaMinutes() {
      var date = new Date()
      var minutes = date.getMinutes()
      if (minutes >= 0 && minutes <= 9) {
        minutes = '0' + minutes
      } else {
        minutes = '' + minutes
      }
      return minutes
    },
    getFormatTime() {
      var date = new Date()
      var hours = date.getHours()
      var minutes = date.getMinutes()
      var secondes = date.getSeconds()
      if (hours >= 0 && hours <= 9) {
        hours = '0' + hours
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = '0' + minutes
      }
      if (secondes >= 0 && secondes <= 9) {
        secondes = '0' + secondes
      }
      var currentDate = hours + ':' + minutes + ':' + secondes
      return currentDate
    },
    gasSwitch() {
      this.formTitle = '切换时间'
      const direction = this.h2Active === 'a' ? 'B' : 'A'
      this.hintText = '是否确认切换气体至' + direction + '侧?'
      this.switchH2params = {
        gas: this.activeTabIndex,
        gasConfigId: this.gasConfigId, // id
        gasLocation: this.gasLocation, // 第几组
        location: direction, // A / B
        newBatch: direction === 'A' ? this.batchA : this.batchB, // 批次号
        oldBatch: direction === 'B' ? this.batchA : this.batchB, // 批次号
        newId: direction === 'A' ? this.aBatchId : this.bBatchId,
        oldId: direction === 'B' ? this.aBatchId : this.bBatchId,
        // replaceTime: "string",
        statusA: parseInt(this.chq1Switch), // 纯化器 状态
        statusB: parseInt(this.chq2Switch),
        statusH: parseInt(this.hSwitch)
      }
      this.switchDialogVisible = true
      this.ruleForm.date1 = this.getFormatDate()
      this.ruleForm.date2 = this.getFormatTime()
      this.ruleForm.hours = this.getFormatHours()
      this.ruleForm.minutes = this.getFormaMinutes()
    },
    N2Switch() {
      this.switchH2params = {
        gas: this.activeTabIndex,
        gasConfigId: this.gasConfigId, // id
        statusA: parseInt(this.chq1Switch), // 纯化器 状态
        statusB: parseInt(this.chq2Switch),
        statusH: parseInt(this.hSwitch)
      }
      this.formTitle = '冲装时间'
      this.determine = true
      this.switchDialogVisible = true
      this.ruleForm.date1 = this.getFormatDate()
      this.ruleForm.date2 = this.getFormatTime()
      this.ruleForm.hours = this.getFormatHours()
      this.ruleForm.minutes = this.getFormaMinutes()
    },
    sih4Switch1() {
      this.sih4Top = true
      this.formTitle = '切换时间'
      const direction = this.sih4TopActive === 'a' ? 'B' : 'A'
      this.switchH2params = {
        gas: this.activeTabIndex,
        gasConfigId: this.gasConfigId, // id
        gasLocation: 0, // 第几组
        location: direction, // A / B
        newBatch: direction === 'A' ? this.batchA1 : this.batchB1, // 批次号
        oldBatch: direction === 'B' ? this.batchA1 : this.batchB1, // 批次号
        newId: direction === 'A' ? this.aBatchId1 : this.bBatchId1,
        oldId: direction === 'B' ? this.aBatchId1 : this.bBatchId1,
        // replaceTime: "string",
        statusA: parseInt(this.chq1Switch), // 纯化器 状态
        statusB: parseInt(this.chq2Switch),
        statusH: parseInt(this.hSwitch)
      }
      this.hintText = '是否确认切换气体至' + direction + '侧?'
      this.switchDialogVisible = true
      this.ruleForm.date1 = this.getFormatDate()
      this.ruleForm.date2 = this.getFormatTime()
      this.ruleForm.hours = this.getFormatHours()
      this.ruleForm.minutes = this.getFormaMinutes()
    },
    sih4Switch2() {
      this.formTitle = '切换时间'
      const direction = this.sih4BottomActive === 'a' ? 'B' : 'A'
      this.hintText = '是否确认切换气体至' + direction + '侧?'
      this.switchH2params = {
        gas: this.activeTabIndex,
        gasConfigId: this.gasConfigId, // id
        gasLocation: 1, // 第几组
        location: direction, // A / B
        newBatch: direction === 'A' ? this.batchA2 : this.batchB2, // 批次号
        oldBatch: direction === 'B' ? this.batchA2 : this.batchB2, // 批次号
        newId: direction === 'A' ? this.aBatchId2 : this.bBatchId2,
        oldId: direction === 'B' ? this.aBatchId2 : this.bBatchId2,
        // replaceTime: "string",
        statusA: parseInt(this.chq1Switch), // 纯化器 状态
        statusB: parseInt(this.chq2Switch),
        statusH: parseInt(this.hSwitch)
      }
      this.switchDialogVisible = true
      this.ruleForm.date1 = this.getFormatDate()
      this.ruleForm.date2 = this.getFormatTime()
      this.ruleForm.hours = this.getFormatHours()
      this.ruleForm.minutes = this.getFormaMinutes()
    },
    handleSwitch() {
      this.determine = true
    },
    switchDialogClose() {
      this.determine = false
      this.sih4Top = false
      this.ruleForm.date1 = ''
      this.ruleForm.date2 = ''
      this.ruleForm.hours = ''
      this.ruleForm.minutes = ''
    },
    handleSwitchSubmit(formName) {
      this.switchH2params.replaceTime = this.ruleForm.date1 + ' ' + this.ruleForm.hours + ':' + this.ruleForm.minutes
      gasSwitch(this.switchH2params).then(res => {
        if (this.activeTabIndex === 2) {
          this.$message({
            type: 'success',
            message: '冲装成功!'
          })
        } else {
          this.$message({
            type: 'success',
            message: '切换成功!'
          })
        }
        this.fetchData()
        this.switchDialogVisible = false
      })
    },
    dateToStr(date) {
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      return year + '-' + month + '-' + day
    },
    dateToHoursStr(date) {
      var hours = date.getHours()
      var minutes = date.getMinutes()
      var seconds = date.getSeconds()
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      return hours + ':' + minutes + ':' + seconds
    },
    tabClick(index) {
      this.activeTabIndex = index
      this.configuring = false
      this.fetchData()
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.gesReplaceRecord()
    },
    handleSearch() {
      this.pageNum = 1
      this.gesReplaceRecord()
    },
    hSwitchChange(val) {
      var name = ''
      if (val === '1') {
        name = '关闭'
      } else {
        name = '开启'
      }
      this.$confirm(`是否确认${name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.hSwitch = val
      }).catch(() => {
        this.hSwitch = val === '1' ? '0' : '1'
      })
    },
    chq1SwitchChange(val) {
      var name = ''
      if (val === '1') {
        name = '关闭'
      } else {
        name = '开启'
      }
      this.$confirm(`是否确认${name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.chq1Switch = val
      }).catch(() => {
        this.chq1Switch = val === '1' ? '0' : '1'
      })
    },
    chq2SwitchChange(val) {
      var name = ''
      if (val === '1') {
        name = '关闭'
      } else {
        name = '开启'
      }
      this.$confirm(`是否确认${name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.chq2Switch = val
      }).catch(() => {
        this.chq2Switch = val === '1' ? '0' : '1'
      })
    },
    // 查询
    fetchData() {
      const requestParams = {
        gasType: this.activeTabIndex
      }
      findGasList(requestParams).then(res => {
        this.aDeviceId = res.data[0].deviceList[0].id
        this.bDeviceId = res.data[0].deviceList[1].id
        this.gasConfigId = res.data[0].id
        this.gasLocation = res.data[0].sourceList[0].grouping
        if (this.activeTabIndex !== 3) {
          this.h2Active = res.data[0].sourceList[0].status === 0 ? 'a' : 'b'
          this.batchA = res.data[0].sourceList[0].batch
          this.batchB = res.data[0].sourceList[1].batch
          this.vmb1 = res.data[0].deviceList[0].vmb
          this.vmb2 = res.data[0].deviceList[1].vmb
          this.chq1 = res.data[0].deviceList[0].purifier
          this.chq2 = res.data[0].deviceList[1].purifier
          this.chq1Switch = res.data[0].deviceList[0].purifierStatus.toString()
          this.chq2Switch = res.data[0].deviceList[1].purifierStatus.toString()
          this.hSwitch = res.data[0].deviceList[0].hstatus.toString()
          this.aBatchId = res.data[0].sourceList[0].id
          this.bBatchId = res.data[0].sourceList[1].id
          this.H2vmbList1 = res.data[0].deviceList[0].machineList
          this.H2vmbList2 = res.data[0].deviceList[1].machineList
        }
        if (this.activeTabIndex === 3) {
          this.batchA1 = res.data[0].sourceList[0].batch
          this.batchB1 = res.data[0].sourceList[1].batch
          this.batchA2 = res.data[0].sourceList[2].batch
          this.batchB2 = res.data[0].sourceList[3].batch
          this.aBatchId1 = res.data[0].sourceList[0].id
          this.bBatchId1 = res.data[0].sourceList[1].id
          this.aBatchId2 = res.data[0].sourceList[2].id
          this.bBatchId2 = res.data[0].sourceList[3].id
          this.sih4TopActive = res.data[0].sourceList[0].status === 0 ? 'a' : 'b'
          this.sih4BottomActive = res.data[0].sourceList[2].status === 0 ? 'a' : 'b'
          this.hSwitch = res.data[0].deviceList[0].hstatus.toString()
          if (res.data[0].deviceList.length !== 0) {
            this.vmb1 = res.data[0].deviceList[0].vmb
            this.vmb2 = res.data[0].deviceList[1].vmb
            this.H2vmbList1 = res.data[0].deviceList[0].machineList
            this.H2vmbList2 = res.data[0].deviceList[1].machineList
          } else {
            this.vmb1 = ''
            this.vmb2 = ''
            this.H2vmbList1 = []
            this.H2vmbList2 = []
          }
        }
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
          console.log(params)
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
    }
  }
}

