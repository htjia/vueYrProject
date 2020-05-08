/* eslint-disable no-unused-vars */

import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { machineList } from '@/api/extensionManage/wyBasicInfoManage/mocvdInfo' // 机台查询
import { genreFindList } from '@/api/extensionManage/wyBasicInfoManage/substrateInfo'
import {
  castSliceFind,
  stoveFind,
  findWafer,
  findStructureType,
  findMachineUser,
  findPlatter,
  findProduceType,
  findRecipe,
  findStandbyReason,
  findStandbyTime,
  findSubstrate,
  findJointSubstrate,
  castSliceSave,
  remove,
  takeSlice
} from '@/api/extensionManage/produceManage/movcdProduce'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateMbbc = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入目标波长'))
      } else {
        if (value === 0 || value < 0) {
          callback(new Error('目标波长必须大于0'))
        } else if (value > 99999) {
          callback(new Error('目标波长不能大于六位数'))
        } else {
          callback()
        }
      }
    }
    return {
      loading: false,
      alertDialogVisible: false,
      searchLoading: false,
      listLoading: false,
      tipOutFormChanged: false,
      getFormChanged: false,
      wafersChanged: false,
      confirmImport: false,
      selectall: true,
      isTipOut: false,
      isEdit: false,
      innerVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      selectTheadVisble: false,
      notBastic: false,
      isFinish: false,
      isDbEdit: false,
      fetchOutDisabled: false,
      abnormalDisabled: false,
      isTipOutStatus: false,
      list: [],
      selectedWafers: [],
      circles: [[], [], [], [], [], [], []],
      circleList: [],
      viewWaferList: [],
      copyViewWaferList: [],
      stoveList: [], // 炉次
      machineList: [], // 机台
      defaultFormThead: [],
      structureTypeList: [], // 结构类型
      machineUserList: [], // 机台操作人
      platterList: [], // 机台对应大盘
      copyPlatterList: [], // 机台对应大盘副本
      allPlatterList: [], // 所有大盘
      allEditPlatterList: [], // 相同尺寸的所有大盘
      recipeList: [],
      waferList: [],
      a: {
        name: ''
      },
      searchKeys: {
        runId: '',
        machine: '',
        stove: '',
        status: ''
      },
      waferTol: 0,
      isActive: 0,
      measure: '',
      abnormalPlace: '',
      typeId: '',
      siteType: '',
      siteName: '',
      siteStatus: '',
      standbyStatus: '',
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
      pickerOptionsTipStart: {
        disabledDate: (time) => {
          const endDateVal = new Date(this.getForm.alniDate).getTime()
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsGetEnd: {
        disabledDate: (time) => {
          const beginDateVal = new Date(this.tipOutForm.tipOutDate).getTime()
          if (beginDateVal) {
            return (time.getTime() + 86400000) < beginDateVal
          }
        }
      },
      statusOptions: [
        {
          id: 0,
          name: '衬底投片'
        },
        {
          id: 5,
          name: '已送验证片'
        },
        {
          id: 6,
          name: 'COW数据返回'
        },
        {
          id: 4,
          name: '报废'
        },
        {
          id: 3,
          name: '返为衬底'
        },
        {
          id: 2,
          name: '待补长'
        },
        {
          id: 1,
          name: '生长完成'
        }
      ],
      exceptionList: [
        {
          id: '',
          name: '请选择'
        },
        {
          id: 4,
          name: '报废'
        },
        {
          id: 3,
          name: '返为衬底'
        },
        {
          id: 2,
          name: '补长'
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
      oldTipOutForm: {},
      tipOutForm: {
        runId: '',
        jglx: '',
        jtbh: '',
        lcbh: '',
        fpr: '',
        dpbh: '',
        pdzx: '',
        mbbc: '',
        djsj: '',
        cdlx: '',
        sclx: '',
        tipOutDate: '',
        tipOutTime: '',
        hours: '',
        minutes: '',
        dpsycs: '',
        recipeName: '',
        djyy: '',
        tipOutEndDate: '',
        oldRunId: ''
      },
      getForm: {
        bctzr: '',
        qpr: '',
        remark: '',
        alniDate: '',
        alniTime: '',
        hours: '',
        minutes: '',
        yccl: ''
      },
      rules: {
        jglx: [{ required: true, message: '请选择结构类型', trigger: 'blur' }],
        jtbh: [{ required: true, message: '请选择机台编号', trigger: 'blur' }],
        lcbh: [{ required: true, message: '请选择炉次', trigger: 'blur' }],
        fpr: [{ required: true, message: '请选择放片人', trigger: 'blur' }],
        dpbh: [{ required: true, message: '请选择大盘编号', trigger: 'blur' }],
        pdzx: [{ required: true, message: '请选择判定指向', trigger: 'blur' }],
        mbbc: [{ required: true, validator: validateMbbc, trigger: 'blur' }],
        cdlx: [{ required: true, message: '请选择衬底类型', trigger: 'blur' }],
        sclx: [{ required: true, message: '请选择生产类型', trigger: 'blur' }],
        tipOutDate: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        tipOutTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        hours: [{ required: true, message: '请选择小时', trigger: 'blur' }],
        minutes: [{ required: true, message: '请选择分钟', trigger: 'blur' }],
        qpr: [{ required: true, message: '请选择取片人', trigger: 'change' }],
        recipeName: [{ required: true, message: '请选择或输入Recipe_Name', trigger: 'blur' }],
        endTime: [{ type: 'array', required: true, message: '请选择结束时间', trigger: 'change' }],
        bctzr: [{ required: true, message: '请选择波长调整人', trigger: 'blur' }]
      },
      leftList: [],
      rightList: [],
      setMousList: [],
      setLeftMousList: [],
      hoverRow: null,
      rightCheck: 0,
      eventWhich: 0,
      activeTabIndex: 0,
      selectedRightItem: '',
      selectedRunRow: '',
      selectedLeftItem: '',
      selectedList: [],
      wafers: [],
      typeList: [], // 衬底类型
      produceTypeList: [], // 生产类型
      standbyReasonList: [], // 待机原因
      runTime: '',
      LaserMark: '',
      boxNum: '',
      currentTime: '',
      structureTypeRunID: '',
      substrateTypeRunID: '',
      produceTypeID: '',
      machineRunID: '',
      dateRunID: '',
      stoveRunID: '',
      params: {
        pageSize: 1000,
        pageNum: 1
      },
      endTime: false,
      isLoading: false,
      isCreated: false,
      toBeSupplemented: false,
      machineSelected: true,
      currentId: '',
      hours: [],
      minutes: [],
      isShowMenu: {
        'wyproductionManage-movcdProduce-updateInfo': false
      }
    }
  },
  watch: {
    getForm: {
      handler(val, oldVal) {
        this.getFormChanged = true
      },
      deep: true
    },
    tipOutForm: {
      handler(val, oldVal) {
        this.tipOutFormChanged = true
      },
      deep: true
    },
    wafers: {
      handler(val, oldVal) {
        this.wafersChanged = true
      },
      deep: true
    }
  },
  mounted() {
    var _this = this
    setTimeout(function() {
      const roleInfo = sessionStorage.getItem('roleInfo')
      if (roleInfo !== undefined && roleInfo !== null) {
        const roleList = JSON.parse(roleInfo)
        for (const item of roleList) {
          if (item.path === 'wyproductionManage') {
            for (const items of item.children) {
              if (items.path === 'produceManage') {
                for (const citems of items.children) {
                  if (citems.path === 'movcdProduce') {
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
    this.fetchData()
    this.stoveFindFun()
    this.machineListFun()
    this.findAllPlatterFun()
    this.findStructureTypeFun() // 结构类型
    this.fetchTypeList() // 衬底类型
    this.findProduceTypeFun() // 生产类型查询
    // this.findRecipeFun() // recipe
    this.findStandbyReasonFun() // 待机原因
    this.showtime()
  },
  methods: {
    tipOutFormHoursChange() {
      if (this.getForm.alniDate !== '' && this.getForm.alniDate === this.tipOutForm.tipOutDate && this.tipOutForm.hours > this.getForm.hours) {
        this.tipOutForm.hours = this.getForm.hours
        this.$message({
          type: 'error',
          message: '开始时间不能大于结束时间!'
        })
      } else {
        this.findStandbyTime()
      }
    },
    tipOutFormMinutesChange() {
      if (this.getForm.alniDate !== '' && this.getForm.alniDate === this.tipOutForm.tipOutDate && this.tipOutForm.hours === this.getForm.hours && this.tipOutForm.minutes > this.getForm.minutes) {
        this.tipOutForm.minutes = this.getForm.minutes
        this.$message({
          type: 'error',
          message: '开始时间不能大于结束时间!'
        })
      } else {
        this.findStandbyTime()
      }
    },
    getFromHoursChange() {
      if (this.getForm.alniDate === this.tipOutForm.tipOutDate && this.tipOutForm.hours > this.getForm.hours) {
        this.getForm.hours = this.tipOutForm.hours
        this.$message({
          type: 'error',
          message: '结束时间不能小于开始时间!'
        })
      }
    },
    getFromMinutesChange() {
      if (this.getForm.alniDate === this.tipOutForm.tipOutDate && this.tipOutForm.hours === this.getForm.hours && this.tipOutForm.minutes > this.getForm.minutes) {
        this.getForm.minutes = this.tipOutForm.minutes
        this.$message({
          type: 'error',
          message: '结束时间不能小于开始时间!'
        })
      }
    },
    // Wafer 查询
    findWafer(id) {
      const params = {
        id
      }
      findWafer(params).then(res => {
        this.waferList = res.data
      })
    },
    getStatus(row) {
      if (row.cowNum > 0) {
        return 'COW数据返回'
      } else {
        if (row.giveNum > 0) {
          return '已送验证片'
        } else {
          if (row.status === 0) {
            return '衬底投片'
          } else if (row.status === 2) {
            return '待补长'
          } else {
            return '生长完成'
          }
        }
      }
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
    },
    findWaferToEdit(id) {
      const params = {
        id
      }
      findWafer(params).then(res => {
        var waferIdArr = []
        res.data.map((item) => {
          if (item.clear === 1) {
            item['down'] = true
          } else {
            item['down'] = false
          }
          waferIdArr.push(parseInt(item.waferId.substr(item.waferId.length - 2, 2)))
        })
        if (res.data.length !== 0) {
          // 根据circle排序
          this.setWaferNum(res.data[0].circleList.sort(this.compare('cricle')))
        }
        this.wafers.map((item) => {
          item.isActive = false
        })
        this.wafers.forEach((item) => {
          waferIdArr.map((waferId) => {
            if (waferId === item.name) {
              item.isActive = true
            }
          })
        })
        this.isCreated = true
        res.data.map(item => {
          item['isEnd'] = item.sign === 1
        })
        this.viewWaferList = [...res.data]
        this.leftList = res.data.concat([])
        this.selectedList = [...res.data]
        // 编辑回填衬底id，防止直接点保存衬底id为空
        this.leftList.map((item, i) => {
          item.id = item.substrateId
          item.index = i
        })
      })
    },
    // 单击Run信息
    rowClick(row) {
      this.waferTol = row.waferNum
      this.selectedRunRow = row
    },
    // 双击Run信息
    rowDblclick(row) {
      if (row.status === 1 || row.status === 3 || row.status === 4 || row.status === 5 || row.status === 6) {
        return false
      }
      if (row.status === 2) { // 补长状态
        this.fetchOutDisabled = true
        this.activeTabIndex = 0
        this.findWaferToEdit(row.id)
        this.isTipOut = true
        this.toBeSupplemented = true
        this.tipOutForm.oldRunId = row.runId
        this.getForm.qpr = '' // 取片人
        this.getForm.bctzr = '' // 波长调整人
        this.getForm.yccl = '' // 异常状态
        this.getForm.alniDate = this.getFormatDate()
        this.getForm.alniTime = this.getFormatTime()
        this.getForm.hours = this.getFormatHours()
        this.getForm.minutes = this.getFormaMinutes()
        this.getForm.remark = row.remark// 备注
        this.tipOutForm.fpr = '' // 放片人
        this.tipOutForm.jtbh = '' // 机台
        this.tipOutForm.dpbh = ''
        this.tipOutForm.dpsycs = ''
        this.tipOutForm.sclx = ''
        this.tipOutForm.recipeName = ''
        this.tipOutForm.runId = ''
        this.tipOutForm.djyy = ''
        this.tipOutForm.djsj = ''
        this.tipOutForm.tipOutDate = this.getFormatDate(1)
        this.tipOutForm.tipOutTime = this.getFormatTime()
        this.tipOutForm.hours = this.getFormatHours()
        this.tipOutForm.minutes = this.getFormaMinutes()
        this.tipOutForm.lcbh = '' // 炉次
        this.tipOutForm.jglx = '' // 结构类型
        this.tipOutForm.cdlx = '' // 衬底类型
        this.tipOutForm.mbbc = '' // 目标波长
        this.wafers.map((item) => {
          item.isActive = false
        })
      } else { // 取片
        this.isDbEdit = true
        this.fetchOutDisabled = false
        this.isTipOutStatus = false
        this.findMachineUserFun(row.machineId)
        this.findPlatterFun(row.machineId)
        this.findRecipeFun(row.machineId)
        // this.stoveRunID = row.runId.substr(9, 1)
        // this.dateRunID = row.runId.substr(5, 4)
        // this.produceTypeID = row.runId.substr(4, 1)
        // this.machineRunID = row.runId.substr(2, 2)
        // this.substrateTypeRunID = row.runId.substr(1, 1)
        // this.structureTypeRunID = row.runId.substr(0, 1)
        this.toBeSupplemented = false
        this.activeTabIndex = 0
        this.currentId = row.id
        this.tipOutForm.tipOutDate = row.createTime
        this.tipOutForm.jtbh = row.machineId // 机台
        this.machineChange(row.machineId)
        this.tipOutForm.dpbh = row.platterId
        this.tipOutForm.dpsycs = row.platterTotal
        this.tipOutForm.sclx = row.produceId
        this.tipOutForm.recipeName = row.recipeName
        this.tipOutForm.runId = row.runId
        this.tipOutForm.djyy = row.reasonId
        this.tipOutForm.djsj = row.standbyTime
        this.tipOutForm.tipOutTime = row.startTime.substr(11, 5)
        this.tipOutForm.hours = row.startTime.substr(11, 2)
        this.tipOutForm.minutes = row.startTime.substr(14, 2)
        this.tipOutForm.lcbh = row.stoveId // 炉次
        // this.stoveChange(row.stoveId)
        this.tipOutForm.jglx = row.structureId // 结构类型
        // this.structureTypeChange(row.structureId)
        this.tipOutForm.cdlx = row.substrateId // 衬底类型
        // this.substrateTypeChange(row.substrateId)
        this.tipOutForm.mbbc = row.wavelength // 目标波长
        this.getForm.qpr = '' // 取片人
        this.getForm.bctzr = '' // 波长调整人
        this.getForm.yccl = '' // 异常状态
        this.getForm.alniDate = this.getFormatDate()
        this.getForm.alniTime = this.getFormatTime()
        this.getForm.hours = this.getFormatHours()
        this.getForm.minutes = this.getFormaMinutes()
        this.getForm.remark = row.remark// 备注
        this.isTipOut = false
        this.getFormChanged = false
        this.tipOutFormChanged = false
        this.findWaferToEdit(row.id)
        this.setMeasureId()
        setTimeout(() => {
          this.tipOutForm.fpr = row.creatorId // 放片人
          const platters = []
          this.platterList.map(item => {
            if (item.measureId === row.platterMeasureId) {
              platters.push(item)
            }
          })
          this.findStandbyTimeFun()
          this.platterList = platters
          this.copyPlatterList = platters
          this.allPlatterList.map(item => {
            if (item.measureId === row.platterMeasureId) {
              this.allEditPlatterList.push(item)
            }
          })
        }, 500)
      }
      if (row.status === 1) {
        this.isFinish = true
        this.currentTime = row.endTime
        this.getForm.endTime = ['']
        this.getForm.qpr = row.takerId
        this.getForm.remark = row.remark
        this.getForm.bctzr = row.adjusts
      } else {
        this.isFinish = false
      }
      this.addDialogVisible = true
      setTimeout(() => {
        this.getFormChanged = false
        this.tipOutFormChanged = false
        this.wafersChanged = false
      }, 500)
    },
    setMeasureId() {
      this.allPlatterList.map((item) => {
        if (item.id === this.tipOutForm.dpbh) {
          this.measure = item.measureId
        }
      })
      this.typeList.map((item) => {
        if (item.id === this.tipOutForm.cdlx) {
          this.typeId = item.id
        }
      })
    },
    // 判断对象是否相等
    isObjectValueEqual(a, b) {
      var aProps = Object.getOwnPropertyNames(a)
      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]
        var propA = a[propName]
        var propB = b[propName]
        if (propA !== propB) {
          return false
        }
      }
      return true
    },
    // 修改信息
    editTipOut() {
      if (this.list.length === 0) {
        return false
      }
      if (this.getStatus(this.selectedRunRow) === 'COW数据返回' || this.getStatus(this.selectedRunRow) === '已送验证片' || this.getStatus(this.selectedRunRow) === '待补长') {
        this.$message({
          type: 'error',
          message: '当前Run状态不允许修改！'
        })
        return false
      }
      if (this.selectedRunRow.status === 0) {
        this.isTipOutStatus = true
      } else {
        this.isTipOutStatus = false
      }
      this.currentId = this.selectedRunRow.id
      this.machineSelected = false
      this.isEdit = true
      this.fetchOutDisabled = false
      this.abnormalDisabled = true
      this.activeTabIndex = 0
      this.findWaferToEdit(this.selectedRunRow.id)
      this.isTipOut = true
      this.addDialogVisible = true
      if (this.selectedRunRow.status === 2) { // 补长状态
        this.stoveRunID = ''
        this.dateRunID = ''
        this.machineRunID = ''
        this.produceTypeID = ''
        this.substrateTypeRunID = ''
        this.structureTypeRunID = ''
        this.activeTabIndex = 0
        this.isTipOut = true
        this.toBeSupplemented = true
        this.tipOutForm.oldRunId = this.selectedRunRow.runId
        this.getForm.qpr = '' // 取片人
        this.getForm.bctzr = '' // 波长调整人
        this.getForm.yccl = '' // 异常状态
        this.getForm.alniDate = this.getFormatDate()
        this.getForm.alniTime = this.getFormatTime()
        this.getForm.hours = this.getFormatHours()
        this.getForm.minutes = this.getFormaMinutes()
        this.getForm.remark = this.selectedRunRow.remark// 备注
        this.tipOutForm.fpr = '' // 放片人
        this.tipOutForm.jtbh = '' // 机台
        this.tipOutForm.dpbh = ''
        this.tipOutForm.dpsycs = ''
        this.tipOutForm.sclx = ''
        this.tipOutForm.recipeName = ''
        this.tipOutForm.runId = ''
        this.tipOutForm.djyy = ''
        this.tipOutForm.djsj = ''
        this.tipOutForm.tipOutDate = this.getFormatDate(1)
        this.tipOutForm.tipOutTime = this.getFormatTime()
        this.tipOutForm.hours = this.getFormatHours()
        this.tipOutForm.minutes = this.getFormaMinutes()
        this.tipOutForm.lcbh = '' // 炉次
        this.tipOutForm.jglx = '' // 结构类型
        this.tipOutForm.cdlx = '' // 衬底类型
        this.tipOutForm.mbbc = '' // 目标波长
        this.wafers.map((item) => {
          item.isActive = false
        })
      } else {
        this.stoveRunID = this.selectedRunRow.runId.substr(9, 1)
        this.dateRunID = this.selectedRunRow.runId.substr(5, 4)
        this.produceTypeID = this.selectedRunRow.runId.substr(4, 1)
        this.machineRunID = this.selectedRunRow.runId.substr(2, 2)
        this.substrateTypeRunID = this.selectedRunRow.runId.substr(1, 1)
        this.structureTypeRunID = this.selectedRunRow.runId.substr(0, 1)
        this.tipOutForm.tipOutDate = this.selectedRunRow.createTime
        this.tipOutForm.fpr = this.selectedRunRow.creatorId // 放片人
        this.tipOutForm.jtbh = this.selectedRunRow.machineId // 机台
        this.tipOutForm.dpbh = this.selectedRunRow.platterId
        this.tipOutForm.dpsycs = this.selectedRunRow.platterTotal
        this.tipOutForm.sclx = this.selectedRunRow.produceId
        this.tipOutForm.recipeName = this.selectedRunRow.recipeName
        this.tipOutForm.runId = this.selectedRunRow.runId
        this.tipOutForm.djyy = this.selectedRunRow.reasonId
        this.tipOutForm.djsj = this.selectedRunRow.standbyTime
        this.tipOutForm.tipOutTime = this.selectedRunRow.startTime.substr(11, 5)
        this.tipOutForm.hours = this.selectedRunRow.startTime.substr(11, 2)
        this.tipOutForm.minutes = this.selectedRunRow.startTime.substr(14, 2)
        this.tipOutForm.lcbh = this.selectedRunRow.stoveId // 炉次
        this.tipOutForm.jglx = this.selectedRunRow.structureId // 结构类型
        this.tipOutForm.cdlx = this.selectedRunRow.substrateId // 衬底类型
        // this.substrateTypeChange(this.selectedRunRow.substrateId)
        this.tipOutForm.mbbc = this.selectedRunRow.wavelength // 目标波长
        this.setMeasureId()
        this.findMachineUserFun(this.tipOutForm.jtbh)
        this.findPlatterFun(this.tipOutForm.jtbh)
        this.findRecipeFun(this.tipOutForm.jtbh)
        // this.machineChange(this.selectedRunRow.machineId)
        // this.getForm.alniDate = this.getFormatDate()
        // this.getForm.alniTime = this.getFormatTime()
        // this.getForm.alniDate = ''
        // this.getForm.alniTime = ''
        if (this.selectedRunRow.status === 0) {
          this.getForm.qpr = '' // 取片人
          this.getForm.bctzr = '' // 波长调整人
          this.getForm.yccl = '' // 异常状态
          this.getForm.alniDate = ''
          this.getForm.alniTime = ''
          this.getForm.hours = ''
          this.getForm.minutes = ''
          this.getForm.remark = ''// 备注
        } else {
          this.getForm.qpr = this.selectedRunRow.takerId // 取片人
          this.getForm.bctzr = this.selectedRunRow.adjustsId // 波长调整人
          this.getForm.yccl = this.selectedRunRow.status // 异常状态
          this.getForm.alniDate = this.selectedRunRow.endTime.substr(0, 10)
          this.getForm.alniTime = this.selectedRunRow.endTime.substr(11, 5)
          this.getForm.hours = this.selectedRunRow.endTime.substr(11, 2)
          this.getForm.minutes = this.selectedRunRow.endTime.substr(14, 2)
          this.getForm.remark = this.selectedRunRow.remark// 备注
        }
      }
      setTimeout(() => {
        this.getFormChanged = false
        this.tipOutFormChanged = false
        this.wafersChanged = false
      }, 500)
    },
    // 清除左侧
    clearAllSelected() {
      this.leftList.map((item) => {
        if (item.laserMark !== '' && item.laserMark !== null) {
          this.deleteItem(item)
        }
      })
      for (const item of this.leftList) {
        item.sequence = ''
        item.boxNo = ''
        item.laserMark = ''
        item.id = ''
        item.down = false
        this.selectedList = []
      }
      this.rightList.sort(this.sortRight())
      this.rightList.map((item, index) => {
        item['sort'] = index
      })
    },
    sortRight() {
      return function(a, b) {
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
    // 清除全部
    clearAll() {
      this.rightList = []
    },
    waferRowClick(row) {
      this.$refs.waferTable.toggleRowSelection(row)
    },
    selectionChange(data) {
      this.selectedWafers = data
    },
    // 查询衬底类型
    fetchTypeList() {
      genreFindList({}).then(res => {
        this.typeList = res.data
      })
    },
    closeInnerDialog() {
      this.setMousList = []
      this.setLeftMousList = []
      var selectedNum = 0
      this.leftList.map((item) => {
        if (item.laserMark !== '' && item.laserMark !== null) {
          selectedNum++
        }
      })
      // 如果有分配的wafer 则请求详细信息
      if (selectedNum !== 0) {
        this.importsClosure()
      }
    },
    tableRowClassColor({ row, rowIndex }) {
      for (let i = 0; i < this.setMousList.length; i++) {
        if (row.id === this.setMousList[i].id) {
          return 'set_green'
        }
      }
    },
    checkAll() {
      this.setMousList = this.rightList
    },
    hoverCall(row, column, cell, event) {
      if (event.which === 1) {
        this.$refs.rightTable.toggleRowSelection(row)
      }
    },
    // hoverCall(row, column, cell, event) {
    //   if (event.buttons === 1) {
    //     if (event.which === 1) {
    //       this.rightCheck = 1
    //       if (this.eventWhich === 0) {
    //         this.setMousList = []
    //       }
    //       if (this.hoverRow !== null && this.hoverRow.id !== row.id) {
    //         this.setMousList[this.setMousList.length] = this.hoverRow
    //         this.hoverRow = null
    //       }
    //       this.setMousList[this.setMousList.length] = row
    //       this.eventWhich = 1
    //       // this.$refs.rightList.setCurrentRow()
    //     } else {
    //       this.eventWhich = 0
    //       this.hoverRow = row
    //     }
    //   } else {
    //     this.hoverRow = row
    //   }
    // },
    leftTableRowClassColor({ row, rowIndex }) {
      for (let i = 0; i < this.setLeftMousList.length; i++) {
        if (row.waferId === this.setLeftMousList[i].waferId) {
          return 'set_green'
        }
      }
    },
    hoverLeftCall(row, column, cell, event) {
      if (event.buttons === 1) {
        if (event.which === 1) {
          this.rightCheck = 1
          if (this.eventWhich === 0) {
            this.setLeftMousList = []
          }
          if (this.hoverRow !== null && this.hoverRow.waferId !== row.waferId) {
            this.setLeftMousList[this.setLeftMousList.length] = this.hoverRow
            this.hoverRow = null
          }
          this.setLeftMousList[this.setLeftMousList.length] = row
          this.eventWhich = 1
          // this.$refs.rightList.setCurrentRow()
        } else {
          this.eventWhich = 0
          this.hoverRow = row
        }
      } else {
        this.hoverRow = row
      }
    },
    // 重置
    clearSearch() {
      this.searchKeys.status = ''
      this.searchKeys.stove = ''
      this.searchKeys.machine = ''
      this.searchKeys.runId = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearch()
    },
    // 炉次查询
    stoveFindFun() {
      stoveFind(this.params).then(res => {
        this.stoveList = res.data
      })
    },
    // 结构类型
    findStructureTypeFun() {
      findStructureType(this.params).then(res => {
        this.structureTypeList = res.data
      })
    },
    // 生产类型查询
    findProduceTypeFun() {
      findProduceType(this.params).then(res => {
        this.produceTypeList = res.data
      })
    },
    // Recipe查询
    findRecipeFun(machineId) {
      this.params.machineId = machineId
      findRecipe(this.params).then(res => {
        this.recipeList = res.data
      })
    },
    // 待机原因查询
    findStandbyReasonFun() {
      findStandbyReason(this.params).then(res => {
        this.standbyReasonList = res.data
      })
    },
    // 请求待机时长查询判断条件
    findStandbyTime() {
      if (this.tipOutForm.jtbh !== '' && this.tipOutForm.tipOutDate !== '' && this.tipOutForm.hours !== '' && this.tipOutForm.minutes !== '') {
        this.findStandbyTimeFun()
      }
    },
    oninput(e) {
      // 通过正则过滤小数点后两位
      // if (this.tipOutForm.mbbc.length > 5) {
      //   this.tipOutForm.mbbc = this.tipOutForm.mbbc.slice(0, 6)
      // }
      // e = (e.match(/^\d*(\.?\d{0,2})/g)[0]) || null
    },
    // 待机时长查询
    findStandbyTimeFun() {
      const params = {
        machineId: this.tipOutForm.jtbh,
        startTime: this.tipOutForm.tipOutDate + ' ' + this.tipOutForm.hours + ':' + this.tipOutForm.minutes
      }
      findStandbyTime(params).then(res => {
        this.tipOutForm.djsj = res.data.standbyTime < 0 ? 0 : res.data.standbyTime
        this.standbyStatus = res.data.status
        this.tipOutForm.mbbc = res.data.wavelength ? res.data.wavelength : ''
      })
    },
    // 结构类型改变
    structureTypeChange(val) {
      this.structureTypeList.map((item) => {
        if (item.id === val) {
          this.structureTypeRunID = item.code
        }
      })
      this.setRunId()
    },
    // 衬底类型改变
    substrateTypeChange(val) {
      this.typeList.map((item) => {
        if (item.id === val) {
          this.substrateTypeRunID = item.code
          this.typeId = item.id
        }
      })
      this.setRunId()
    },
    // 生产类型改变
    produceTypeChange(val) {
      this.produceTypeList.map((item) => {
        if (item.id === val) {
          this.produceTypeID = item.code
        }
      })
      this.setRunId()
    },
    // 炉次改变
    stoveChange(val) {
      this.stoveList.map((item) => {
        if (item.id === val) {
          this.stoveRunID = item.code
        }
      })
      this.setRunId()
    },
    setRunId() {
      if (
        this.stoveRunID !== '' &&
        this.dateRunID !== '' &&
        this.machineRunID !== '' &&
        this.produceTypeID !== '' &&
        this.substrateTypeRunID !== '' &&
        this.structureTypeRunID !== ''
      ) {
        this.tipOutForm.runId = this.structureTypeRunID + this.substrateTypeRunID + this.machineRunID + this.produceTypeID + this.dateRunID + this.stoveRunID
        this.leftList.map((item) => {
          item.waferId = this.tipOutForm.runId + item.waferId.substr(10, 2)
          item.id = item.substrateId
        })
        this.viewWaferList.map((item) => {
          item.waferId = this.tipOutForm.runId + item.waferId.substr(10, 2)
        })
      }
    },
    // 日期改变
    tipOutDateChange(val) {
      this.findStandbyTime()
      let month = ''
      if (parseInt(val.substr(5, 2)) > 9) {
        switch (parseInt(val.substr(5, 2))) {
          case 10 : month = 'A'
            break
          case 11 : month = 'B'
            break
          case 12 : month = 'C'
            break
        }
      } else {
        month = parseInt(val.substr(5, 2))
      }
      if (parseInt(val.substr(0, 4)) < 2020) {
        this.dateRunID = val.substr(3, 1) + month + val.substr(8, 2)
      } else {
        switch (parseInt(val.substr(2, 2))) {
          case 20 : this.dateRunID = 'A' + month + val.substr(8, 2)
            break
          case 21 : this.dateRunID = 'B' + month + val.substr(8, 2)
            break
          case 22 : this.dateRunID = 'C' + month + val.substr(8, 2)
            break
          case 23 : this.dateRunID = 'D' + month + val.substr(8, 2)
            break
          case 24 : this.dateRunID = 'E' + month + val.substr(8, 2)
            break
          case 25 : this.dateRunID = 'F' + month + val.substr(8, 2)
            break
          case 26 : this.dateRunID = 'G' + month + val.substr(8, 2)
            break
          case 27 : this.dateRunID = 'H' + month + val.substr(8, 2)
            break
          case 28 : this.dateRunID = 'I' + month + val.substr(8, 2)
            break
          case 29 : this.dateRunID = 'J' + month + val.substr(8, 2)
            break
          case 30 : this.dateRunID = 'K' + month + val.substr(8, 2)
            break
          case 31 : this.dateRunID = 'L' + month + val.substr(8, 2)
            break
          case 32 : this.dateRunID = 'M' + month + val.substr(8, 2)
            break
          case 33 : this.dateRunID = 'N' + month + val.substr(8, 2)
            break
          case 34 : this.dateRunID = 'O' + month + val.substr(8, 2)
            break
          case 35 : this.dateRunID = 'P' + month + val.substr(8, 2)
            break
          case 36 : this.dateRunID = 'Q' + month + val.substr(8, 2)
            break
          case 37 : this.dateRunID = 'R' + month + val.substr(8, 2)
            break
          case 38 : this.dateRunID = 'S' + month + val.substr(8, 2)
            break
          case 39 : this.dateRunID = 'T' + month + val.substr(8, 2)
            break
          case 40 : this.dateRunID = 'U' + month + val.substr(8, 2)
            break
          case 41 : this.dateRunID = 'V' + month + val.substr(8, 2)
            break
          case 42 : this.dateRunID = 'W' + month + val.substr(8, 2)
            break
          case 43 : this.dateRunID = 'X' + month + val.substr(8, 2)
            break
          case 44 : this.dateRunID = 'Y' + month + val.substr(8, 2)
            break
          case 45 : this.dateRunID = 'Z' + month + val.substr(8, 2)
            break
        }
      }
      if (parseInt(val.substr(0, 4)) > 2045) {
        this.dateRunID = val.substr(3, 1) + month + val.substr(8, 2)
      }
      console.log(this.dateRunID)
      this.setRunId()
      this.findStandbyTime()
    },
    selectAll() {
      this.selectall = !this.selectall
      if (this.selectall) {
        this.wafers.map((item) => {
          item.isActive = true
        })
      } else {
        this.wafers.map((item) => {
          item.isActive = false
        })
      }
    },
    // 机台编号改变
    machineChange(val) {
      this.machineList.map((item) => {
        if (item.id === val) {
          this.machineRunID = item.code
        }
      })
      this.machineSelected = false
      this.tipOutForm.fpr = ''
      this.tipOutForm.dpbh = ''
      this.tipOutForm.recipeName = ''
      this.findMachineUserFun(this.tipOutForm.jtbh)
      this.findPlatterFun(this.tipOutForm.jtbh)
      this.findRecipeFun(this.tipOutForm.jtbh)
      this.wafers.map((item) => {
        item.isActive = false
      })
      this.findStandbyTime()
      this.setRunId()
    },
    // 查询机台操作人
    findMachineUserFun(machineId) {
      const params = {
        machineId
      }
      findMachineUser(params).then(res => {
        res.data.unshift({
          userId: '',
          userName: '请选择'
        })
        this.machineUserList = res.data
      })
    },
    // 查询大盘
    findPlatterFun(id) {
      const params = {
        id
      }
      findPlatter(params).then(res => {
        this.platterList = res.data
        this.copyPlatterList = [...res.data]
      })
    },
    // 查询所有大盘
    findAllPlatterFun() {
      findPlatter({}).then(res => {
        this.allPlatterList = res.data
      })
    },
    // 大盘选中
    platterChange(val) {
      this.platterList.map((item) => {
        if (item.id === val) {
          this.circleList = item.circleList
          this.abnormalPlace = item.platterError === null ? '' : item.platterError.split(',').map(Number)
          this.measure = item.measureId
          // 设置大盘使用时间
          this.tipOutForm.dpsycs = item.platterTotal
          // 判断是否已经烘烤
          if (item.status === 1) {
            this.alertDialogVisible = true
          } else {
            // 设置尺寸对应的wafer片数
            this.setWaferNum(item.circleList)
          }
          this.rightList = []
        }
      })
    },
    handleDetermine() {
      this.setWaferNum(this.circleList)
    },
    handleCancel() {
      this.tipOutForm.dpbh = ''
      this.$message({
        type: 'info',
        message: '已取消使用'
      })
      this.alertDialogVisible = false
    },
    remoteMethod(query) {
      if (query !== '') {
        this.platterList = this.allPlatterList.filter(item => {
          return item.platterNo.indexOf(query) > -1
        })
      } else {
        this.platterList = this.copyPlatterList
      }
    },
    remoteEditMethod(query) {
      if (query !== '') {
        this.platterList = this.allEditPlatterList.filter(item => {
          return item.platterNo.indexOf(query) > -1
        })
      } else {
        this.platterList = this.copyPlatterList
      }
    },
    // 接盘搜索为空时重置
    visibleChange(flag) {
      if (!flag) {
        this.platterList = this.copyPlatterList
      }
    },
    // 设置尺寸对应的wafer片数
    setWaferNum(circleList) {
      this.wafers = []
      circleList.map(item => {
        for (var i = item.cricleStart; i < item.cricleEnd + 1; i++) {
          if (this.abnormalPlace.indexOf(i) !== -1) { // 是异常片位
            if (i === item.cricleEnd) {
              this.wafers.push({
                cricle: item.cricle,
                name: i,
                error: true,
                isActive: false,
                isEnd: true,
                isFixedEnd: true
              })
            } else {
              this.wafers.push({
                cricle: item.cricle,
                name: i,
                error: true,
                isActive: false,
                isEnd: false,
                isFixedEnd: false
              })
            }
          } else {
            if (i === item.cricleEnd) {
              this.wafers.push({
                cricle: item.cricle,
                name: i,
                error: false,
                isActive: true,
                isEnd: true,
                isFixedEnd: true
              })
            } else {
              this.wafers.push({
                cricle: item.cricle,
                name: i,
                error: false,
                isActive: true,
                isEnd: false,
                isFixedEnd: false
              })
            }
          }
        }
      })
      this.alertDialogVisible = false
    },
    // 获取机台
    machineListFun() {
      machineList({}).then(res => {
        this.machineList = res.data
      })
    },
    // 编辑衬底信息查询
    findSubstrateFun() {
      if (this.boxNum === '' && this.LaserMark === '') {
        this.$message({
          type: 'error',
          message: '请扫码或输入镭刻号或盒号!'
        })
        return false
      }
      const params = {
        boxNo: this.boxNum,
        laserMark: this.LaserMark,
        measureId: this.measure,
        typeId: this.typeId
      }
      this.searchLoading = true
      findSubstrate(params).then(res => {
        if (res.data.length !== 0) {
          this.$refs.rightTable.setCurrentRow(res.data[0])
        }
        this.rightList = res.data
        this.rightList.map((item, index) => {
          item['sort'] = index
        })
        this.boxNum = ''
        this.LaserMark = ''
        this.searchLoading = false
      }).catch(() => {
        this.boxNum = ''
        this.LaserMark = ''
        this.searchLoading = false
      })
    },
    // 导入完成
    importsClosure() {
      var idArr = []
      var notFinish = false
      var selectedNum = 0
      this.leftList.map((item) => {
        if (item.id === '') {
          idArr.push(item.waferId + '-' + null)
        } else {
          idArr.push(item.waferId + '-' + item.id)
        }
        if (item.laserMark !== '' && item.laserMark !== null) {
          selectedNum++
        } else {
          notFinish = true
        }
      })
      // if (selectedNum === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '衬底信息不能为空!'
      //   })
      //   return false
      // }
      this.confirmCompleted(idArr)
    },
    // 确认完成
    confirmCompleted(idArr) {
      const params = {
        ids: idArr.join(',')
      }
      findJointSubstrate(params).then(res => {
        this.innerVisible = false
        this.activeTabIndex = 1
        this.confirmImport = true
        setTimeout(() => {
          this.viewWaferList = res.data
        }, 500)
      })
    },
    timeStop(val) {
      if (val) {
        this.currentTime = this.getCurrentTime()
      }
    },
    // 选择laserMark
    toLeft() {
      if (this.selectedWafers.length === 0) {
        this.$message({
          type: 'error',
          message: '请先选择镭刻号!'
        })
      } else {
        this.selectedWafers.sort(function(a, b) {
          return a.sort - b.sort
        })
        this.selectedWafers.forEach((item, index) => {
          this.setItemToLeft(item)
        })
      }
    },
    setItemToLeft(selectedRightItem) {
      var delectIndex
      this.rightList.forEach((item, index) => {
        if (item.laserMark === selectedRightItem.laserMark) {
          delectIndex = index
        }
      })
      var num = 0
      var sLeftList = []
      if (this.selectedLeftItem !== '') {
        sLeftList = this.leftList.slice(this.selectedLeftItem.index)
      } else {
        sLeftList = this.leftList
      }
      // const hasLaserMarkArr = this.leftList.filter(item => item.laserMark === selectedRightItem.laserMark)
      const hasLaserMarkArr = sLeftList.filter(item => item.laserMark === selectedRightItem.laserMark)
      if (hasLaserMarkArr.length !== 0) {
        this.$message({
          type: 'error',
          message: '该衬底已导入,请勿重复操作!'
        })
        return false
      }
      for (const item of sLeftList) {
        if (item.laserMark === null || item.laserMark === '') {
          item.laserMark = selectedRightItem.laserMark
          item.id = selectedRightItem.id
          item.substrateId = selectedRightItem.id
          item.sequence = selectedRightItem.sequence
          item.boxNo = selectedRightItem.boxNo
          this.rightList.splice(delectIndex, 1)
          this.selectedList.push(selectedRightItem)
          this.$refs.rightTable.setCurrentRow(this.rightList[0])
          return
        } else {
          num++
        }
      }
      if (num > this.leftList.length || num === this.leftList.length) {
        this.$message({
          type: 'success',
          message: '已分配完成!'
        })
      }
    },
    toRight() {
      // if (this.selectedLeftItem === '') {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择要解绑的Wafer信息!'
      //   })
      // } else {
      //   if (this.selectedLeftItem.laserMark === '') {
      //     this.$message({
      //       type: 'error',
      //       message: '请先选择衬底信息!'
      //     })
      //   } else {
      //     this.deleteItem(this.selectedLeftItem)
      //     this.$refs.waferTable.setCurrentRow()
      //   }
      // }
      const newLeftMousList = Array.from(new Set(this.setLeftMousList))
      if (newLeftMousList.length === 0) {
        this.deleteItem(this.selectedLeftItem)
      } else {
        this.leftList.map((item) => {
          newLeftMousList.map(mousItem => {
            if (item.laserMark !== '') {
              if (item.laserMark === mousItem.laserMark) {
                this.deleteItem(item)
              }
            }
          })
        })
      }
      this.rightList.sort(this.sortRight())
    },
    // 上移
    handleUp(row, index) {
      if (index > 0) {
        const beforeLaserMark = this.leftList[index - 1].laserMark
        const currentLaserMark = row.laserMark
        this.leftList[index - 1].laserMark = currentLaserMark
        this.leftList[index].laserMark = beforeLaserMark
        const beforeId = this.leftList[index - 1].id
        const currentId = row.id
        this.leftList[index - 1].id = currentId
        this.leftList[index].id = beforeId
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
        const nextLaserMark = this.leftList[index + 1].laserMark
        const currentLaserMark = row.laserMark
        this.leftList[index + 1].laserMark = currentLaserMark
        this.leftList[index].laserMark = nextLaserMark
        const nextId = this.leftList[index + 1].id
        const currentId = row.id
        this.leftList[index + 1].id = currentId
        this.leftList[index].id = nextId
      }
    },
    deleteItem(row, index) {
      if (row.laserMark === '') {
        this.$message({
          type: 'error',
          message: '请先选择衬底信息!'
        })
      } else {
        var delectIndex
        var delectItem
        this.selectedList.forEach((item, index) => {
          if (item.laserMark === row.laserMark) {
            delectIndex = index
            delectItem = item
          }
        })
        this.selectedList.splice(delectIndex, 1)
        // this.rightList.push(JSON.parse(JSON.stringify(delectItem)))
        this.rightList.push({ ...delectItem })
        this.$refs.rightTable.setCurrentRow(this.rightList[0])
        row.laserMark = ''
        row.id = null
      }
      if (index === 1) {
        this.rightList.sort(this.sortRight())
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
    // subStrateCurrentChange(row) {
    //   this.selectedRightItem = row
    //   this.setMousList = []
    // },
    waferCurrentChange(row) {
      this.selectedLeftItem = row
      this.setLeftMousList = []
    },
    waferClick(item) {
      var flag = false
      if (item.error && !item.isActive) {
        this.$confirm('所选片位为异常片位，是否仍要投片？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.setWafers(item)
        })
      } else {
        flag = true
      }
      if (flag) {
        this.setWafers(item)
      }
    },
    setWafers(item) {
      item.isActive = !item.isActive
      this.circles = [[], [], [], [], [], [], []]
      for (var k = 0; k < this.wafers.length; k++) {
        if (this.wafers[k].cricle === 1 && this.wafers[k].isActive) {
          this.circles[0].push(this.wafers[k])
        }
        if (this.wafers[k].cricle === 2 && this.wafers[k].isActive) {
          this.circles[1].push(this.wafers[k])
        }
        if (this.wafers[k].cricle === 3 && this.wafers[k].isActive) {
          this.circles[2].push(this.wafers[k])
        }
        if (this.wafers[k].cricle === 4 && this.wafers[k].isActive) {
          this.circles[3].push(this.wafers[k])
        }
        if (this.wafers[k].cricle === 5 && this.wafers[k].isActive) {
          this.circles[4].push(this.wafers[k])
        }
        if (this.wafers[k].cricle === 6 && this.wafers[k].isActive) {
          this.circles[5].push(this.wafers[k])
        }
        if (this.wafers[k].cricle === 7 && this.wafers[k].isActive) {
          this.circles[6].push(this.wafers[k])
        }
      }
      this.wafers.map(item => {
        item.isEnd = false
      })
      this.wafers.forEach((item) => {
        this.circles.forEach((circleItem) => {
          if (circleItem.length !== 0) {
            if (item.name === circleItem[circleItem.length - 1].name) {
              item.isEnd = true
            }
          }
        })
      })
    },
    editSubstrateInfo() {
      this.innerVisible = true
      setTimeout(() => {
        this.$refs.waferTable.setCurrentRow(this.leftList[0])
      }, 150)
      this.$nextTick(function() {
        this.$refs.importImput.$el.querySelector('input').focus()
      })
    },
    rowStyle({ row }) {
      if (row.isEnd) {
        return 'background: #FFFFCF'
      } else {
        return ''
      }
    },
    waferStyle({ row }) {
      if (row.sign === 1) {
        return 'background: #FFFFCF'
      } else {
        return ''
      }
    },
    // 生成WaferID
    createWaferID() {
      let num = 0
      this.wafers.map((item) => {
        if (item.isActive) {
          num++
        }
      })
      if (num !== 0 && this.tipOutForm.runId !== '') { // 如果runID生成,且选了衬底位置
        this.viewWaferList = []
        this.leftList = []
        this.wafers.forEach((item) => {
          if (item.isActive) {
            var waferIndex = item.name < 10 ? '0' + (item.name) : (item.name)
            this.viewWaferList.push({
              waferId: this.tipOutForm.runId + waferIndex,
              cricle: item.cricle,
              laserMark: '',
              down: false,
              id: null,
              isEnd: item.isEnd
            })
            this.leftList.push({
              waferId: this.tipOutForm.runId + waferIndex,
              cricle: item.cricle,
              laserMark: '',
              down: false,
              id: null,
              isEnd: item.isEnd
            })
          }
        })
        this.leftList.map((item, i) => {
          item.index = i
        })
        this.copyViewWaferList = [...this.viewWaferList]
        this.activeTabIndex = 1
        this.rightList = []
        this.isCreated = true
      } else {
        this.$message({
          type: 'error',
          message: '请先完善投片信息!'
        })
        this.isCreated = false
        return false
      }
    },
    // Run信息/Wafer信息切换
    navClick(index) {
      if (index === 1 && this.list.length !== 0) {
        this.findWafer(this.selectedRunRow.id)
      }
      this.isActive = index
    },
    handleDialogClose(done) {
      if (this.isTipOut && this.tipOutFormChanged) { // 是投片且有变化则提示
        this.$confirm('数据已经发生改变，退出将不会保存，是否退出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        })
      } else if (this.isTipOut && this.wafersChanged) { // 是投片且有wafer变化则提示
        this.$confirm('数据已经发生改变，退出将不会保存，是否退出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        })
      } else if (!this.isTipOut && this.getFormChanged) { // 取片 发生改变
        this.$confirm('数据已经发生改变，退出将不会保存，是否退出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        })
      } else if (!this.isTipOut && !this.getFormChanged) { // 取片 未改变
        done()
      } else if (!this.tipOutFormChanged && this.isTipOut) { // 是投片且没变化则关闭
        done()
      }
    },
    // 衬底投片
    tipOut() {
      this.wafers.map((item) => {
        item.isActive = false
      })
      this.fetchOutDisabled = true
      this.isDbEdit = false
      this.stoveRunID = ''
      this.dateRunID = ''
      this.machineRunID = ''
      this.produceTypeID = ''
      this.substrateTypeRunID = ''
      this.structureTypeRunID = ''
      this.getForm.qpr = '' // 取片人
      this.getForm.bctzr = '' // 波长调整人
      this.getForm.yccl = '' // 异常状态
      this.getForm.alniDate = ''
      this.getForm.alniTime = ''
      this.getForm.hours = ''
      this.getForm.minutes = ''
      this.getForm.remark = ''// 备注
      this.tipOutForm.tipOutDate = ''
      this.tipOutForm.fpr = '' // 放片人
      this.tipOutForm.jtbh = '' // 机台
      this.tipOutForm.dpbh = ''
      this.tipOutForm.dpsycs = ''
      this.tipOutForm.sclx = ''
      this.tipOutForm.recipeName = ''
      this.tipOutForm.runId = ''
      this.tipOutForm.djyy = ''
      this.tipOutForm.djsj = ''
      this.tipOutForm.tipOutTime = this.getFormatTime()
      this.tipOutForm.hours = this.getFormatHours()
      this.tipOutForm.minutes = this.getFormaMinutes()
      this.tipOutForm.lcbh = '' // 炉次
      this.tipOutForm.jglx = '' // 结构类型
      this.tipOutForm.cdlx = '' // 衬底类型
      this.tipOutForm.mbbc = '' // 目标波长
      this.activeTabIndex = 0
      this.isCreated = false
      this.isTipOut = true
      this.addDialogVisible = true
      this.tipOutFormChanged = false
      this.getFormChanged = false
      this.wafers = []
      this.tipOutForm.tipOutDate = this.getFormatDate(1)
      setTimeout(() => {
        this.getFormChanged = false
        this.tipOutFormChanged = false
        this.wafersChanged = false
      }, 500)
    },
    getFormatDate(isTip) {
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
      if (isTip === 1) {
        this.tipOutDateChange(currentDate)
      }
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
    // 衬底投片 基本信息/Wafer信息
    tabClick(index) {
      if (index === 1) {
        if (this.isCreated) {
          this.activeTabIndex = index
        }
      } else {
        this.activeTabIndex = index
      }
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
        runId: this.searchKeys.runId,
        machineId: this.searchKeys.machine,
        stoveId: this.searchKeys.stove,
        status: this.searchKeys.status,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      castSliceFind(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        if (res.data.list.length !== 0) {
          this.$refs.runTable.setCurrentRow(this.list[0])
          this.selectedRunRow = this.list[0]
          this.waferTol = this.list[0].waferNum
        } else {
          this.waferTol = 0
          this.selectedRunRow = []
        }
        if (res.data.list.length === 0 || this.waferTol === 0) {
          this.waferList = []
        }
      })
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.$refs.getForm.resetFields()
      this.rightList = []
      this.leftList = []
      this.LaserMark = ''
      this.boxNum = ''
      this.fetchOutDisabled = false
      this.abnormalDisabled = false
      this.isEdit = false
      this.machineSelected = true
      this.toBeSupplemented = false
      this.isTipOut = false
      this.isCreated = false
      this.tipOutFormChanged = false
      this.getFormChanged = false
      this.getForm.qpr = '' // 取片人
      this.getForm.bctzr = '' // 波长调整人
      this.getForm.yccl = '' // 异常状态
      this.getForm.alniDate = ''
      this.getForm.alniTime = ''
      this.getForm.hours = ''
      this.getForm.minutes = ''
      this.getForm.remark = ''// 备注
      this.tipOutForm.tipOutDate = ''
      this.tipOutForm.fpr = '' // 放片人
      this.tipOutForm.jtbh = '' // 机台
      this.tipOutForm.dpbh = ''
      this.tipOutForm.dpsycs = ''
      this.tipOutForm.sclx = ''
      this.tipOutForm.recipeName = ''
      this.tipOutForm.runId = ''
      this.tipOutForm.djyy = ''
      this.tipOutForm.djsj = ''
      this.tipOutForm.tipOutTime = ''
      this.tipOutForm.hours = ''
      this.tipOutForm.minutes = ''
      this.tipOutForm.lcbh = '' // 炉次
      this.tipOutForm.jglx = '' // 结构类型
      this.tipOutForm.cdlx = '' // 衬底类型
      this.tipOutForm.mbbc = '' // 目标波长
    },
    // 添加提交
    submitForm(val, isTake) {
      this.$refs.tipOutForm.validate((valid) => {
        if (valid) {
          if (this.leftList.length === 0) {
            this.$message({
              type: 'error',
              message: '请生成WaferID!'
            })
            return
          }
          var notFinish = false
          var substrateNum = 0
          var waferList = []
          this.leftList.map((item) => {
            if (item.laserMark !== '' && item.laserMark !== null) {
              substrateNum++
            } else {
              notFinish = true
            }
            waferList.push({
              clear: item.down ? 1 : 0,
              substrateId: item.id,
              waferId: item.waferId,
              circle: item.cricle,
              sign: item.isEnd ? 1 : 0
            })
          })
          const params = {
            createTime: this.tipOutForm.tipOutDate,
            creator: this.tipOutForm.fpr, // 放片人
            machineId: this.tipOutForm.jtbh, // 机台
            // measureId: 0, // 尺寸
            // oldRunId: "string",
            platterId: this.tipOutForm.dpbh,
            isok: false,
            platterTotal: this.tipOutForm.dpsycs,
            produceId: this.tipOutForm.sclx,
            recipeName: this.tipOutForm.recipeName,
            runId: this.tipOutForm.runId,
            standbyReason: this.tipOutForm.djyy,
            standbyTime: this.tipOutForm.djsj,
            startTime: this.tipOutForm.hours + ':' + this.tipOutForm.minutes,
            status: 0,
            stoveId: this.tipOutForm.lcbh, // 炉次
            structureTypeId: this.tipOutForm.jglx, // 结构类型
            substrateTypeId: this.tipOutForm.cdlx, // 衬底类型
            wavelength: this.tipOutForm.mbbc, // 目标波长
            waferList
          }
          if (val === 1) {
            params['id'] = this.selectedRunRow.id
          }
          if (this.isEdit && !this.toBeSupplemented) {
            params['id'] = this.selectedRunRow.id
          }
          if (this.toBeSupplemented) {
            params['oldRunId'] = this.tipOutForm.oldRunId
          }
          if (this.isEdit && !this.isTipOutStatus) {
            // 修改取片信息
            this.growthCompleteSubmit()
          }
          if (notFinish) {
            this.$confirm('存在尚未填入衬底信息的Wafer，是否继续执行此操作?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.confirmAddCompleted(params, isTake)
            })
          } else {
            this.confirmAddCompleted(params, isTake)
          }
        } else {
          if (this.activeTabIndex === 1) {
            this.$message({
              type: 'error',
              message: '请完善基本信息!'
            })
          }
          return false
        }
      })
    },
    confirmAddCompleted(params, isTake) {
      this.isLoading = true
      castSliceSave(params).then(res => {
        if (res.code === 0) {
          if (res.data !== null) {
            this.$confirm(res.data, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              params.isok = true
              this.confirmAddCompleted(params, isTake)
            })
          } else {
            if (isTake !== 1) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.addDialogVisible = false
              this.fetchData()
            }
          }
        }
      })
      setTimeout(() => {
        this.isLoading = false
      }, 500)
    },
    submitStrate() {

    },
    // 生长完成
    growthComplete() {
      if (this.tipOutForm.recipeName === '' || this.tipOutForm.recipeName === null) {
        this.$message({
          type: 'error',
          message: '请选择或输入Recipe_Name!'
        })
        return false
      }
      if (this.tipOutForm.mbbc === '' || this.tipOutForm.mbbc === null) {
        this.$message({
          type: 'error',
          message: '请输入目标波长!'
        })
        return false
      }
      if (this.standbyStatus === 1 && this.tipOutForm.djyy === null) {
        this.$message({
          type: 'error',
          message: '待机时间过长，请输入待机原因!'
        })
        return
      }
      if (this.getForm.alniDate === this.tipOutForm.tipOutDate && this.getForm.hours === this.tipOutForm.hours && this.getForm.minutes < this.tipOutForm.minutes) {
        this.$message({
          type: 'error',
          message: '结束时间不能小于开始时间!'
        })
        return
      }
      if (this.getForm.alniDate === this.tipOutForm.tipOutDate && this.getForm.hours < this.tipOutForm.hours) {
        this.$message({
          type: 'error',
          message: '结束时间不能小于开始时间!'
        })
        return
      }
      this.$refs.getForm.validate((valid) => {
        if (valid) {
          var waferList = []
          var notFinish = false
          var substrateNum = 0
          this.leftList.map((item) => {
            if (item.laserMark !== '' && item.laserMark !== null) {
              substrateNum++
            } else {
              notFinish = true
            }
            waferList.push({
              clear: item.down ? 1 : 0,
              substrateId: item.id,
              waferId: item.waferId,
              circle: item.circle,
              sign: item.isEnd ? 1 : 0
            })
          })
          // 存在尚未分配的wafer
          if (notFinish) {
            this.$message({
              type: 'error',
              message: '存在尚未分配的wafer,请完善!'
            })
            return false
          }
          this.submitEditForm(1)
          // -----------------
          let msgText = ''
          if (this.getForm.yccl === 4) {
            msgText = '是否确认将当前炉次的wafer全部报废？'
          } else if (this.getForm.yccl === 3) {
            msgText = '是否确认将当前炉次的wafer 返为衬底？'
          } else {
            msgText = '是否确认将当前炉次状态设为补长?'
          }
          if (this.getForm.yccl === '') {
            this.growthCompleteSubmit()
          } else {
            this.$confirm(msgText, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.growthCompleteSubmit()
            })
          }
        } else {
          return false
        }
      })
    },
    // 编辑衬底信息保存
    submitEditForm(isTake) {
      this.submitForm(1, isTake)
    },
    growthCompleteSubmit() {
      const params = {
        castSliceId: this.currentId, // run_id
        endTime: this.getForm.alniDate + ' ' + this.getForm.hours + ':' + this.getForm.minutes, // 结束时间
        taker: this.getForm.qpr, // 取片人
        adjusts: this.getForm.bctzr, // 波长调整人
        status: this.getForm.yccl === '' ? 0 : this.getForm.yccl, // 异常状态
        remark: this.getForm.remark // 备注
      }
      takeSlice(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.addDialogVisible = false
          this.fetchData()
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
    // 删除
    handleDelete() {
      if (this.selectedRunRow.status !== 0) {
        this.$message({
          type: 'error',
          message: '该状态为非衬底投片，不可删除!'
        })
        return false
      }
      this.$confirm('此操作将永久删除该Run信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: this.selectedRunRow.id
        }
        remove(param).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum -= 1
            }
            this.fetchData()
          }
        })
      })
    }
  }
}

