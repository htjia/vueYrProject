
import PageHeaderLayout from '@/components/PageHeaderLayout'
import { findlevelList } from '@/api/chipManage/extensionStorageManage/inventoryInquiry'
import { formatDate, deepCopy } from '@/utils'
import { findStructureType, findSubstrateMeasureList } from '@/api/extensionManage/wyReport/productionReport/index'
import { substrateFindList } from '@/api/processManagement/chipManage'
import { addStrategy, queryStrategy, selectDetailEachGear, deleteStrategy, updateStrategy, inventoryDistribution } from '@/api/extensionManage/wyReport/stockDivision'
// import { machineList } from '@/api/extensionManage/wyBasicInfoManage/mocvdInfo' // 机台查询
export default {
  components: { PageHeaderLayout },
  data() {
    // 判定挡位最小值
    const validateParamsMin = (rule, value, cb) => {
      const val = this.strategyForm.gearList[rule.field.split('.')[1]][rule.field.split('.')[2]].min
      const max = this.strategyForm.gearList[rule.field.split('.')[1]][rule.field.split('.')[2]].max
      if (max !== '' && max !== null && (val === '' || val === null)) {
        cb(new Error('请输入'))
      }
      if (max !== '' && max !== null) {
        console.log(+max < +val)
        if (+max < +val) {
          cb(new Error('不能大于最大参数'))
        } else {
          cb()
        }
      } else {
        cb()
      }
    }
    // 判断挡位参数的最大值
    const validateParamsMax = (rule, value, cb) => {
      const val = this.strategyForm.gearList[rule.field.split('.')[1]][rule.field.split('.')[2]].max
      const min = this.strategyForm.gearList[rule.field.split('.')[1]][rule.field.split('.')[2]].min
      if (min !== '' && min !== null && (val === '' || val === null)) {
        cb(new Error('请输入'))
      }
      if (min !== '' && min !== null) {
        // 如果存在最小值,判断最小值不能大于最大值
        if (+min > +val) {
          cb(new Error('不能小于最小参数'))
        } else {
          cb()
        }
      } else {
        cb()
      }
    }
    // 判断异常参数的最小值
    const validatAbnormalParamsMin = (rule, value, cb) => {
      const val = this.strategyForm.abnormalReason[rule.field.split('.')[1]].min
      const maxVal = this.strategyForm.abnormalReason[rule.field.split('.')[1]].max
      if (maxVal !== '' && maxVal !== null && (val === '' || val === null)) {
        cb(new Error('请输入'))
      }
      const field = rule.field.split('.')[2]
      if (maxVal !== '' && val !== '' && maxVal !== null && val !== null) {
        if (+maxVal < +val) {
          cb(new Error('不能大于最大参数'))
        } else {
          this.strategyForm.gearList.map(item => {
            item.map(paramItem => {
              if (paramItem.min !== '' && paramItem.max !== '') {
                if (paramItem.field === field && +paramItem.min <= +val && +paramItem.max > +val) {
                  cb(new Error('与挡位参数冲突'))
                }
              }
            })
          })
          cb()
        }
      } else {
        cb()
      }
    }
    // 判断异常参数的最大值
    const validatAbnormalParamsMax = (rule, value, cb) => {
      const val = this.strategyForm.abnormalReason[rule.field.split('.')[1]].max
      const minVal = this.strategyForm.abnormalReason[rule.field.split('.')[1]].min
      if (minVal !== '' && minVal !== null && (val === '' || val === null)) {
        cb(new Error('请输入'))
      }
      const field = rule.field.split('.')[2]
      if (minVal !== '' && val !== '' && minVal !== null && val !== null) {
        // 如果存在最小值,判断最小值不能大于最大值
        if (+this.strategyForm.abnormalReason[rule.field.split('.')[1]].min > +val) {
          cb(new Error('不能小于最小参数'))
        } else {
          this.strategyForm.gearList.map(item => {
            item.map(paramItem => {
              if (paramItem.min !== '' && paramItem.max !== '') {
                if (paramItem.field === field && +paramItem.min < +val && +paramItem.max > +val) {
                  cb(new Error('与挡位参数冲突'))
                }
                if (paramItem.field === field && +paramItem.min >= +minVal && +paramItem.max <= +val) {
                  cb(new Error('与挡位参数冲突'))
                }
              }
            })
          })
          cb()
        }
      } else {
        cb()
      }
    }
    const validateVisual = (rule, value, cb) => {
      console.log(123)
      const val = this.strategyForm.abnormalReason[rule.field.split('.')[1]].min
      if (val.length !== 0) {
        this.selectedVisParams = []
        this.strategyForm.gearList.map(item => {
          this.selectedVisParams.push(...item[5].min)
        })
        const selectedArr = Array.from(new Set(this.selectedVisParams))
        selectedArr.map(item => {
          if (val.includes(item)) {
            cb(new Error('与挡位参数冲突'))
          }
        })
        cb()
      } else {
        cb()
      }
    }
    return {
      searchName: '',
      newParam: '',
      newAbnormalParam: '',
      dialogTitle: '',
      searchTitle: '',
      currentStrategyId: '',
      currentStrategyName: '',
      pos: 0,
      spanArr: [],
      selectedVisParams: [],
      currentGear: [],
      resultList: [],
      addVisable: false,
      searchVisable: false,
      isEdit: false,
      isParams: false,
      addParams: false,
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
      levelList: [],
      abnormalLevelList: [],
      searchKey: {
        color: '',
        yzbx: '',
        size: ''
      },
      strategyList: [],
      parameter: [
        {
          fieldCn: 'PL_WD',
          paramCategory: 0,
          fieldType: 1,
          field: 'wd'
        },
        {
          fieldCn: 'PL.I.I',
          paramCategory: 0,
          fieldType: 1,
          field: 'ii'
        },
        {
          fieldCn: 'PL.I.I.STD',
          paramCategory: 0,
          fieldType: 1,
          field: 'ii_std'
        },
        {
          fieldCn: 'PL_PD',
          paramCategory: 0,
          fieldType: 1,
          field: 'pdavr'
        },
        {
          fieldCn: 'PL_Ref',
          paramCategory: 0,
          fieldType: 1,
          field: 'ref'
        },
        {
          fieldCn: 'LOP(460)',
          paramCategory: 0,
          fieldType: 4,
          field: 'lop460'
        },
        {
          fieldCn: 'ESD去坏(50V)',
          paramCategory: 0,
          fieldType: 0,
          field: 'esd_50'
        },
        {
          fieldCn: '综合良率',
          paramCategory: 1,
          fieldType: 0,
          field: 'yield_zh'
        },
        {
          fieldCn: 'VF2',
          paramCategory: 0,
          fieldType: 0,
          field: 'avg_vf2'
        },
        {
          fieldCn: 'WLD1',
          paramCategory: 0,
          fieldType: 5,
          field: 'wld1'
        },
        {
          fieldCn: 'IR',
          paramCategory: 0,
          fieldType: 0,
          field: 'avg_ir'
        },
        {
          fieldCn: 'VZ',
          paramCategory: 0,
          fieldType: 0,
          field: 'avg_vz'
        },
        {
          fieldCn: 'IV',
          paramCategory: 0,
          fieldType: 0,
          field: 'avg_iv'
        },
        {
          fieldCn: 'WLD(PL-COW)',
          paramCategory: 0,
          fieldType: 0,
          field: 'valk'
        },
        {
          fieldCn: '预估COW波长',
          paramCategory: 0,
          fieldType: 5,
          field: 'wavelength'
        },
        {
          fieldCn: 'ESD(400)',
          paramCategory: 0,
          fieldType: 0,
          field: 'esd_400'
        },
        {
          fieldCn: 'HW',
          paramCategory: 0,
          fieldType: 4,
          field: 'hw'
        },
        {
          fieldCn: 'B.S',
          paramCategory: 0,
          fieldType: 0,
          field: 'blue_shift'
        },
        {
          fieldCn: 'BOW',
          paramCategory: 0,
          fieldType: 1,
          field: 'bow'
        },
        {
          fieldCn: 'PLINT_SID',
          paramCategory: 0,
          fieldType: 1,
          field: 'pl_int_std'
        }
      ],
      abnormalParameter: [
        {
          fieldCn: 'PL_WD',
          paramCategory: 0,
          fieldType: 1,
          field: 'wd'
        },
        {
          fieldCn: 'PL.I.I',
          paramCategory: 0,
          fieldType: 1,
          field: 'ii'
        },
        {
          fieldCn: 'PL.I.I.STD',
          paramCategory: 0,
          fieldType: 1,
          field: 'ii_std'
        },
        {
          fieldCn: 'PL_PD',
          paramCategory: 0,
          fieldType: 1,
          field: 'pdavr'
        },
        {
          fieldCn: 'PL_Ref',
          paramCategory: 0,
          fieldType: 1,
          field: 'ref'
        },
        {
          fieldCn: 'LOP(460)',
          paramCategory: 0,
          fieldType: 4,
          field: 'lop460'
        },
        {
          fieldCn: 'ESD去坏(50V)',
          paramCategory: 0,
          fieldType: 0,
          field: 'esd_50'
        },
        {
          fieldCn: '综合良率',
          paramCategory: 1,
          fieldType: 0,
          field: 'yield_zh'
        },
        {
          fieldCn: 'VF2',
          paramCategory: 0,
          fieldType: 0,
          field: 'avg_vf2'
        },
        {
          fieldCn: 'WLD1',
          paramCategory: 0,
          fieldType: 5,
          field: 'wld1'
        },
        {
          fieldCn: 'IR',
          paramCategory: 0,
          fieldType: 0,
          field: 'avg_ir'
        },
        {
          fieldCn: 'VZ',
          paramCategory: 0,
          fieldType: 0,
          field: 'avg_vz'
        },
        {
          fieldCn: 'IV',
          paramCategory: 0,
          fieldType: 0,
          field: 'avg_iv'
        },
        {
          fieldCn: 'WLD(PL-COW)',
          paramCategory: 0,
          fieldType: 0,
          field: 'valk'
        },
        {
          fieldCn: '预估COW波长',
          paramCategory: 0,
          fieldType: 5,
          field: 'wavelength'
        },
        {
          fieldCn: 'ESD(400)',
          paramCategory: 0,
          fieldType: 0,
          field: 'esd_400'
        },
        {
          fieldCn: 'HW',
          paramCategory: 0,
          fieldType: 4,
          field: 'hw'
        },
        {
          fieldCn: 'B.S',
          paramCategory: 0,
          fieldType: 0,
          field: 'blue_shift'
        },
        {
          fieldCn: 'BOW',
          paramCategory: 0,
          fieldType: 1,
          field: 'bow'
        },
        {
          fieldCn: 'PLINT_SID',
          paramCategory: 0,
          fieldType: 1,
          field: 'pl_int_std'
        }
      ],
      rules: {
        orderList: [{ required: true }],
        color: [{ required: true, message: '请选择光色', trigger: 'blur' }],
        size: [{ required: true, message: '请选择尺寸', trigger: 'blur' }],
        yzbx: [{ required: true, message: '请选择验证版型', trigger: 'blur' }],
        visual: [{ required: true, validator: validateVisual, trigger: 'blur' }],
        min: [{ required: true, validator: validateParamsMin, trigger: 'blur' }],
        max: [{ required: true, validator: validateParamsMax, trigger: 'blur' }],
        abnormalmin: [{ required: true, validator: validatAbnormalParamsMin, trigger: 'blur' }],
        abnormalmax: [{ required: true, validator: validatAbnormalParamsMax, trigger: 'blur' }]
      },
      remarkList: [],
      substrateFindOptions: [],
      measureList: [],
      colorList: [],
      initGearList: [
        [
          {
            min: '',
            max: '',
            fieldCn: 'WLD1',
            field: 'wld1',
            fieldType: 5,
            paramCategory: 0 // 区间参--0   区间参带%--1   范围参--2   选项参--3
          },
          {
            min: '',
            max: '',
            fieldCn: 'LOP(460)',
            field: 'lop460',
            fieldType: 4,
            paramCategory: 0
          },
          {
            min: '',
            max: '',
            fieldCn: 'STD',
            field: 'std',
            fieldType: 5,
            paramCategory: 0
          },
          {
            min: '',
            max: '',
            fieldCn: 'VF1',
            field: 'avg_vf1',
            fieldType: 0,
            paramCategory: 0
          },
          {
            min: '',
            max: '',
            fieldCn: 'IR Yield',
            field: 'yield_ir',
            fieldType: 0,
            paramCategory: 1
          },
          {
            min: [],
            max: '',
            fieldCn: '目检',
            field: 'name',
            fieldType: 2,
            paramCategory: 2
          },
          {
            min: '',
            max: '',
            fieldCn: 'ESD(200)',
            field: 'esd_200',
            fieldType: 0,
            paramCategory: 1
          }
        ]
      ],
      initGear: [
        {
          min: '',
          max: '',
          fieldCn: 'WLD1',
          field: 'wld1',
          fieldType: 5,
          paramCategory: 0 // 区间参--0   区间参带%--1   范围参--2   选项参--3
        },
        {
          min: '',
          max: '',
          fieldCn: 'LOP(460)',
          field: 'lop460',
          fieldType: 4,
          paramCategory: 0
        },
        {
          min: '',
          max: '',
          fieldCn: 'STD',
          field: 'std',
          fieldType: 5,
          paramCategory: 0
        },
        {
          min: '',
          max: '',
          fieldCn: 'VF1',
          field: 'avg_vf1',
          fieldType: 0,
          paramCategory: 0
        },
        {
          min: '',
          max: '',
          fieldCn: 'IR Yield',
          field: 'yield_ir',
          fieldType: 0,
          paramCategory: 1
        },
        {
          min: [],
          max: '',
          fieldCn: '目检',
          field: 'name',
          fieldType: 2,
          paramCategory: 2
        },
        {
          min: '',
          max: '',
          fieldCn: 'ESD(200)',
          field: 'esd_200',
          fieldType: 0,
          paramCategory: 1
        }
      ],
      initAbnormalReason: [
        {
          min: [],
          max: '',
          fieldCn: '目检',
          field: 'name',
          fieldType: 2,
          paramCategory: 2 // 区间参--0   区间参带%--1   范围参--2   选项参--3
        },
        {
          min: '',
          max: '',
          fieldCn: 'STD',
          field: 'std',
          fieldType: 5,
          paramCategory: 0
        },
        {
          min: '',
          max: '',
          fieldCn: 'VF1',
          field: 'avg_vf1',
          fieldType: 0,
          paramCategory: 0
        },
        {
          min: '',
          max: '',
          fieldCn: 'IR Yield',
          field: 'yield_ir',
          fieldType: 0,
          paramCategory: 1
        }
      ],
      strategyForm: {
        color: '',
        yzbx: '',
        size: '',
        gearList: [
          [
            {
              min: '',
              max: '',
              fieldCn: 'WLD1',
              field: 'wld1',
              fieldType: 5,
              paramCategory: 0 // 区间参--0   区间参带%--1   范围参--2   选项参--3
            },
            {
              min: '',
              max: '',
              fieldCn: 'LOP(460)',
              field: 'lop460',
              fieldType: 4,
              paramCategory: 0
            },
            {
              min: '',
              max: '',
              fieldCn: 'STD',
              field: 'std',
              fieldType: 5,
              paramCategory: 0
            },
            {
              min: '',
              max: '',
              fieldCn: 'VF1',
              field: 'avg_vf1',
              fieldType: 0,
              paramCategory: 0
            },
            {
              min: '',
              max: '',
              fieldCn: 'IR Yield',
              field: 'yield_ir',
              fieldType: 0,
              paramCategory: 1
            },
            {
              min: [],
              max: '',
              fieldCn: '目检',
              field: 'name',
              fieldType: 2,
              paramCategory: 2
            },
            {
              min: '',
              max: '',
              fieldCn: 'ESD(200)',
              field: 'esd_200',
              fieldType: 0,
              paramCategory: 1
            }
          ]
        ],
        abnormalReason: [
          {
            min: [],
            max: '',
            fieldCn: '目检',
            field: 'name',
            fieldType: 2,
            paramCategory: 2, // 区间参--0   区间参带%--1   范围参--2   选项参--3
            remark: ''
          },
          {
            min: '',
            max: '',
            fieldCn: 'STD',
            field: 'std',
            fieldType: 5,
            paramCategory: 0,
            remark: ''
          },
          {
            min: '',
            max: '',
            fieldCn: 'VF1',
            field: 'avg_vf1',
            fieldType: 0,
            paramCategory: 0,
            remark: ''
          },
          {
            min: '',
            max: '',
            fieldCn: 'IR Yield',
            field: 'yield_ir',
            fieldType: 0,
            paramCategory: 1,
            remark: ''
          }
        ]
      }
    }
  },
  mounted() {
    this.fetchData()
    this.findlevelListFun()
    this.substrateFindListFun()
    this.findSubstrateMeasureListFun()
    this.findStructureTypeFun()
  },
  methods: {
    paramsVisualChange(data) {
      console.log(data)
      const arr = [this.strategyForm.gearList[data][5]][0].min
      this.selectedVisParams.push(...arr)
      const selectedArr = Array.from(new Set(this.selectedVisParams))
      selectedArr.map(selectedItem => {
        this.abnormalLevelList.map(item => {
          if (item.name === selectedItem) {
            item.disabled = true
          }
        })
      })
    },
    // 生成一个与行数相同的数组记录每一行设置的合并数
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1) // 用于存放每一行记录的合并数
          this.pos = 0 // pos是spanArr的索引
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].item === data[i - 1].item) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
            this.spanArr[this.pos] += 1
            this.spanArr.push(0) // 0 即表示该行不显示
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
      console.log(this.spanArr)
      return this.spanArr
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    fetchData() {
      const params = {
        colorId: this.searchKey.color,
        editionTypeId: this.searchKey.yzbx,
        sizeId: this.searchKey.size
      }
      queryStrategy(params).then(res => {
        this.strategyList = res.data
      })
    },
    clearAll() {
      this.searchKey = {
        size: '',
        yzbx: '',
        color: ''
      }
      this.fetchData()
    },
    handleSearch(strategy) {
      this.currentStrategyId = strategy.id
      this.currentStrategyName = strategy.name
      this.searchVisable = true
      this.searchResult()
    },
    setGearPosition(gearPosition) {
      if (gearPosition === 'R') {
        return '异常原因分析'
      } else {
        return `综合${gearPosition}档`
      }
    },
    // 验证版型
    substrateFindListFun() {
      substrateFindList().then(res => {
        this.substrateFindOptions = res.data.list
      })
    },
    // 衬底尺寸
    findSubstrateMeasureListFun() {
      findSubstrateMeasureList().then(res => {
        this.measureList = res.data
      })
    },
    // 光色查询
    findStructureTypeFun() {
      findStructureType().then(res => {
        this.colorList = res.data
      })
    },
    // 添加挡位
    addGear() {
      const copyArr = deepCopy(this.strategyForm.gearList[0])
      copyArr.map(item => {
        if (item.fieldCn === 'name') {
          item.min = []
        } else {
          item.min = ''
          item.max = ''
        }
      })
      this.strategyForm.gearList.push(copyArr)
    },
    // 删除挡位
    deleteGear(index) {
      this.strategyForm.gearList.splice(index, 1)
    },
    // 目检等级
    findlevelListFun() {
      const params = {
        pageNum: 1,
        pageSize: 10000,
        status: 0
      }
      findlevelList(params).then(res => {
        this.levelList = res.data.list
        this.abnormalLevelList = deepCopy(res.data.list)
      })
    },
    // 添加动态参数
    addHandleParams() {
      this.isParams = true
    },
    // 添加异常参数
    addAbnormalParams() {
      this.addParams = true
    },
    // 删除动态参数
    deleteParams(index, item) {
      this.strategyForm.gearList[0].splice(index, 1)
      this.parameter.find(i => i.field === item.field).disabled = false
    },
    // 删除异常动态参数
    deleteAbnormalParams(index, item) {
      this.strategyForm.abnormalReason.splice(index, 1)
      this.abnormalParameter.find(i => i.field === item.field).disabled = false
    },
    // 选择生成参数
    selectParamsChange(val) {
      const obj = this.parameter.find(i => i.field === val)
      obj.disabled = true
      this.strategyForm.gearList[0].push({
        min: '',
        max: '',
        field: obj.field,
        fieldType: obj.fieldType,
        fieldCn: obj.fieldCn,
        paramCategory: obj.paramCategory
      })
      this.newParam = ''
      this.isParams = false
    },
    selectAbnormalParamsChange(val) {
      const obj = this.abnormalParameter.find(i => i.field === val)
      obj.disabled = true
      this.strategyForm.abnormalReason.push({
        min: '',
        max: '',
        field: obj.field,
        fieldType: obj.fieldType,
        fieldCn: obj.fieldCn,
        paramCategory: obj.paramCategory,
        remark: ''
      })
      this.newAbnormalParam = ''
      this.addParams = false
    },
    // 新建检索策略
    handleAdd(dialogTitle, item) {
      this.dialogTitle = dialogTitle
      this.addVisable = true
      if (item) {
        this.isEdit = true
        this.strategyForm.color = parseInt(item.colorId)
        this.strategyForm.yzbx = item.editionTypeId
        this.strategyForm.size = item.sizeId
        this.currentStrategyId = item.id
        this.currentGear = item.gearSplicing
        this.handleEditItem(item.id)
      } else {
        this.isEdit = false
      }
    },
    // 删除item
    handleDeleteItem(id) {
      this.$confirm('是否确定删除该策略', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStrategy({ id }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fetchData()
        })
      }).catch(() => {
      })
    },
    // 编辑item
    handleEditItem(id) {
      const list = deepCopy(this.initGearList)
      const noAbnormalGear = this.currentGear.filter(gear => gear.gearPosition !== 'R')
      for (var i = 0; i < noAbnormalGear.length - 1; i++) {
        list.push(deepCopy(this.initGear))
      }
      this.currentGear.map((gear, index) => {
        const params = {
          strategyId: id,
          gearPosition: gear.gearPosition
        }
        selectDetailEachGear(params).then(res => {
          if (gear.gearPosition !== 'R') {
            const visual = []
            this.remarkList.push(res.data[0].remark)
            res.data.map(item => {
              if (item.fieldCn === 'WLD1') {
                list[index][0].min = item.min
                list[index][0].max = item.max
              }
              if (item.fieldCn === 'LOP(460)') {
                list[index][1].min = item.min
                list[index][1].max = item.max
              }
              if (item.fieldCn === 'STD') {
                list[index][2].min = item.min
                list[index][2].max = item.max
              }
              if (item.fieldCn === 'VF1') {
                list[index][3].min = item.min
                list[index][3].max = item.max
              }
              if (item.fieldCn === 'IR Yield') {
                list[index][4].min = item.min
                list[index][4].max = item.max
              }
              if (item.fieldCn === 'ESD(200)') {
                list[index][6].min = item.min
                list[index][6].max = item.max
              }
              if (item.fieldCn === '目检') { visual.push(item.val.split("'")[1]) }
              if (item.fieldCn !== 'WLD1' && item.fieldCn !== 'LOP(460)' && item.fieldCn !== 'STD' && item.fieldCn !== 'VF1' && item.fieldCn !== 'IR Yield' && item.fieldCn !== 'ESD(200)' && item.fieldCn !== '目检') {
                list[index].push(item)
              }
            })
            list[index][5].min = visual
          } else { // 异常原因
            const visual = []
            res.data.map(item => {
              if (item.fieldCn === '目检') {
                visual.push(item.val.split("'")[1])
                this.strategyForm.abnormalReason[0].remark = item.remark
              }
              if (item.fieldCn === 'STD') {
                this.strategyForm.abnormalReason[1].min = item.min
                this.strategyForm.abnormalReason[1].max = item.max
                this.strategyForm.abnormalReason[1].remark = item.remark
              }
              if (item.fieldCn === 'VF1') {
                this.strategyForm.abnormalReason[2].min = item.min
                this.strategyForm.abnormalReason[2].max = item.max
                this.strategyForm.abnormalReason[2].remark = item.remark
              }
              if (item.fieldCn === 'IR Yield') {
                this.strategyForm.abnormalReason[3].min = item.min
                this.strategyForm.abnormalReason[3].max = item.max
                this.strategyForm.abnormalReason[3].remark = item.remark
              }
              if (item.fieldCn !== '目检' && item.fieldCn !== 'STD' && item.fieldCn !== 'VF1' && item.fieldCn !== 'IR Yield' && item.fieldCn !== '目检') {
                this.strategyForm.abnormalReason.push(item)
              }
            })
            this.strategyForm.abnormalReason[0].min = visual
          }
        })
      })
      console.log(list)
      this.$set(this.strategyForm, 'gearList', list)
    },
    dialogClose(formName) {
      this.strategyForm.color = ''
      this.strategyForm.yzbx = ''
      this.strategyForm.size = ''
      this.strategyForm.gearList = deepCopy(this.initGearList)
      this.strategyForm.abnormalReason = deepCopy(this.initAbnormalReason)
      this.$refs[formName].resetFields()
      this.selectedVisParams = []
      this.remarkList = []
      this.abnormalLevelList.map(item => { item.disabled = false })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(12312312312)
          const details = []
          let noVisual = false
          let hasParams = false
          this.strategyForm.gearList.map((gear, index) => {
            gear.map(item => {
              if (item.paramCategory === 2) { // 目检
                if (item.min.length !== 0) {
                  item.min.map(v => {
                    details.push({
                      field: item.field,
                      fieldCn: item.fieldCn,
                      fieldType: item.fieldType,
                      paramCategory: item.paramCategory,
                      gearPosition: String.fromCharCode(65 + index), // A B C R
                      max: '',
                      min: '',
                      strategyId: this.isEdit ? this.currentStrategyId : '',
                      remark: this.remarkList[index] ? this.remarkList[index] : '',
                      val: `= '${v}'`
                    })
                  })
                } else {
                  noVisual = true
                }
              } else {
                if (item.min !== '' && item.max !== '') {
                  hasParams = true
                }
                details.push({
                  field: item.field,
                  fieldCn: item.fieldCn,
                  fieldType: item.fieldType,
                  paramCategory: item.paramCategory,
                  gearPosition: String.fromCharCode(65 + index), // A B C R
                  max: item.max,
                  min: item.min,
                  strategyId: this.isEdit ? this.currentStrategyId : '',
                  remark: this.remarkList[index] ? this.remarkList[index] : '',
                  val: ''
                })
              }
            })
          })
          if (noVisual && !hasParams) {
            this.$message({
              type: 'error',
              message: '挡位参数不能为空!'
            })
            return false
          }
          this.strategyForm.abnormalReason.map(item => {
            if (item.paramCategory === 2) { // 目检
              if (item.min.length !== 0) {
                item.min.map(v => {
                  details.push({
                    field: item.field,
                    fieldCn: item.fieldCn,
                    fieldType: item.fieldType,
                    paramCategory: item.paramCategory,
                    gearPosition: 'R', // A B C R
                    max: '',
                    min: '',
                    strategyId: this.isEdit ? this.currentStrategyId : '',
                    remark: item.remark,
                    val: `= '${v}'`
                  })
                })
              }
            } else {
              details.push({
                field: item.field,
                fieldCn: item.fieldCn,
                fieldType: item.fieldType,
                paramCategory: item.paramCategory,
                gearPosition: 'R', // A B C R
                max: item.max,
                min: item.min,
                strategyId: this.isEdit ? this.currentStrategyId : '',
                remark: item.remark,
                val: ''
              })
            }
          })
          const colorName = this.colorList.filter(item => item.id === this.strategyForm.color)[0].code
          const yzbx = this.substrateFindOptions.filter(item => item.id === this.strategyForm.yzbx)[0].name
          const size = this.measureList.filter(item => item.id === this.strategyForm.size)[0].name
          const params = {
            colorId: this.strategyForm.color,
            creator: sessionStorage.getItem('User-Id'),
            details,
            editionTypeId: this.strategyForm.yzbx,
            name: `${colorName}${yzbx}检索策略-${size}在库`,
            sizeId: this.strategyForm.size
          }
          console.log(params)
          if (this.isEdit) {
            params.id = this.currentStrategyId
            updateStrategy(params).then(res => {
              this.addVisable = false
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.fetchData()
            })
          } else {
            addStrategy(params).then(res => {
              this.addVisable = false
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
              this.fetchData()
            })
          }
        }
      })
    },
    searchDialogClose() {
      this.beginDate = ''
      this.endDate = ''
    },
    handleDialogExport() {
      const startTime = this.beginDate === '' ? '' : formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : formatDate(this.endDate)
      window.open(process.env.BASE_API + `/WyReportProductManagement/inventoryDistributionExport?strategyId=${this.currentStrategyId}&startTime=${startTime}&endTime=${endTime}`)
    },
    searchResult() {
      const params = {
        startTime: this.beginDate === '' ? '' : formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : formatDate(this.endDate),
        strategyId: this.currentStrategyId
      }
      inventoryDistribution(params).then(res => {
        this.resultList = res.data.tableList
        this.getSpanArr(res.data.tableList)
        this.searchTitle = this.currentStrategyName + ' : ' + res.data.total
      })
    }
  }
}
