
import PageHeaderLayout from '@/components/PageHeaderLayout'
import { ckStorehouseTypeFind } from '@/api/chipManage/extensionStorageManage/inventoryInquiry'
import { findStructureType, findSubstrateMeasureList } from '@/api/extensionManage/wyReport/productionReport/index'
import { substrateFindList } from '@/api/processManagement/chipManage'
import { queryParams } from '@/api/extensionManage/wyReport/dailyWarehousing'
import { findlevelList } from '@/api/chipManage/extensionStorageManage/inventoryInquiry'
import { formatDate, deepCopy } from '@/utils'
export default {
  components: { PageHeaderLayout },
  data() {
    // 判断参数的最小值
    const validateParamsMin = (rule, value, cb) => {
      const val = this.paramsForm.paramsList[rule.field.split('.')[1]].minVal
      const maxVal = this.paramsForm.paramsList[rule.field.split('.')[1]].maxVal
      if (maxVal !== '' && maxVal !== null && (val === '' || val === null)) {
        cb(new Error('请输入'))
      }
      if (maxVal !== '' && maxVal !== null) {
        if (+maxVal < +val) {
          cb(new Error('不能大于最大参数'))
        } else {
          cb()
        }
      } else {
        cb()
      }
    }
    // 判断参数的最大值
    const validateParamsMax = (rule, value, cb) => {
      const val = this.paramsForm.paramsList[rule.field.split('.')[1]].maxVal
      const minVal = this.paramsForm.paramsList[rule.field.split('.')[1]].minVal
      if (minVal !== '' && minVal !== null && (val === '' || val === null)) {
        cb(new Error('请输入'))
      }
      if (minVal !== '') {
        // 如果存在最小值,判断最小值不能大于最大值
        if (+minVal > +val) {
          cb(new Error('不能小于最小参数'))
        } else {
          cb()
        }
      } else {
        cb()
      }
    }
    // table判断参数的最小值
    const validateTableMin = (rule, value, cb) => {
      const minVal = this.tableForm.list[rule.field.split('.')[1]].rowMin
      const maxVal = this.tableForm.list[rule.field.split('.')[1]].rowMax
      if (minVal === '') {
        cb(new Error('请输入'))
      } else if (maxVal !== '') {
        if (+maxVal < +minVal) {
          cb(new Error('不能大于最大参数'))
        } else {
          this.tableForm.list.map((item, index) => {
            if (+index !== +rule.field.split('.')[1] && index !== this.tableForm.list.length - 1) {
              if (item.rowMin !== '' && item.rowMax !== '') {
                if (+item.rowMin <= +minVal && +item.rowMax > +minVal) {
                  cb(new Error('与已有参数冲突'))
                }
              }
            }
          })
          cb()
        }
      } else {
        cb()
      }
    }
    // table判断参数的最大值
    const validateTableMax = (rule, value, cb) => {
      const maxVal = this.tableForm.list[rule.field.split('.')[1]].rowMax
      const minVal = this.tableForm.list[rule.field.split('.')[1]].rowMin
      if (maxVal === '') {
        cb(new Error('请输入'))
      } else if (minVal !== '') {
        // 如果存在最小值,判断最小值不能大于最大值
        if (+minVal > +maxVal) {
          cb(new Error('不能小于最小参数'))
        } else {
          this.tableForm.list.map((item, index) => {
            if (+index !== +rule.field.split('.')[1] && index !== this.tableForm.list.length - 1) {
              if (item.rowMin !== '' && item.rowMax !== '') {
                if (+item.rowMin < +maxVal && +item.rowMax > +maxVal) {
                  cb(new Error('与已有参数冲突'))
                }
                if (+item.rowMin >= +minVal && +item.rowMax <= +maxVal) {
                  cb(new Error('与已有参数冲突'))
                }
              }
            }
          })
          cb()
        }
      } else {
        cb()
      }
    }
    // 表头参数验证最小值
    const validateColMin = (rule, value, cb) => {
      const minVal = this.tableColForm.tableHeader[rule.field.split('.')[1]].min
      const maxVal = this.tableColForm.tableHeader[rule.field.split('.')[1]].max
      if (minVal === '') {
        cb(new Error('请输入'))
      } else if (maxVal !== '') {
        if (+maxVal < +minVal) {
          cb(new Error('不能大于最大参数'))
        } else {
          this.tableColForm.tableHeader.map((item, index) => {
            if (+index !== +rule.field.split('.')[1]) {
              if (item.min !== '' && item.max !== '') {
                if (+item.min <= +minVal && +item.max > +minVal) {
                  cb(new Error('与已有参数冲突'))
                }
              }
            }
          })
          cb()
        }
      } else {
        cb()
      }
    }
    // 表头参数验证最大值
    const validateColMax = (rule, value, cb) => {
      const minVal = this.tableColForm.tableHeader[rule.field.split('.')[1]].min
      const maxVal = this.tableColForm.tableHeader[rule.field.split('.')[1]].max
      if (maxVal === '') {
        cb(new Error('请输入'))
      } else if (minVal !== '') {
        // 如果存在最小值,判断最小值不能大于最大值
        if (+minVal > +maxVal) {
          cb(new Error('不能小于最小参数'))
        } else {
          this.tableColForm.tableHeader.map((item, index) => {
            if (+index !== +rule.field.split('.')[1]) {
              if (item.min !== '' && item.max !== '') {
                if (+item.min < +maxVal && +item.max > +maxVal) {
                  cb(new Error('与已有参数冲突'))
                }
                if (+item.min >= +minVal && +item.max <= +maxVal) {
                  cb(new Error('与已有参数冲突'))
                }
              }
            }
          })
          cb()
        }
      } else {
        cb()
      }
    }
    const validateVisual = (rule, value, cb) => {
      const val = this.paramsForm.paramsList[rule.field.split('.')[1]].minVal
      if (val === '') {
        cb(new Error('请选择'))
      } else {
        cb()
      }
    }
    const validateCol = (rule, value, cb) => {
      const val = this.tableColForm.headerParams.split('@')[0]
      console.log(val)
      this.paramsForm.paramsList.map(item => {
        if (item.id === val) {
          cb(new Error('与参数字段冲突'))
        }
      })
      cb()
    }
    const validateRow = (rule, value, cb) => {
      const val = this.tableColForm.rowParams.split('@')[0]
      const colVal = this.tableColForm.headerParams.split('@')[0]
      console.log(val)
      this.paramsForm.paramsList.map(item => {
        if (item.id === val) {
          cb(new Error('与参数字段冲突'))
        }
      })
      if (val === colVal) {
        cb(new Error('与列参数冲突'))
      }
      cb()
    }
    return {
      listLoading: false,
      notBastic: false,
      isParams: false,
      newParam: '',
      total: '',
      okNum: '',
      okNumYield: '',
      ngNum: '',
      ngNumYield: '',
      storehouseType: [],
      sizeList: [
        { id: 1 }
      ],
      tableForm: {
        list: [
          { rowMin: '', rowMax: '', column1: '', column2: '', column3: '', column4: '', column5: '', column6: '', column7: '', column8: '', column9: '', column10: '', column11: '' },
          { rowMin: '', rowMax: '', column1: '', column2: '', column3: '', column4: '', column5: '', column6: '', column7: '', column8: '', column9: '', column10: '', column11: '' },
          { rowMin: '', rowMax: '', column1: '', column2: '', column3: '', column4: '', column5: '', column6: '', column7: '', column8: '', column9: '', column10: '', column11: '' },
          { rowMin: '', rowMax: '', column1: '', column2: '', column3: '', column4: '', column5: '', column6: '', column7: '', column8: '', column9: '', column10: '', column11: '' },
          { rowMin: '', rowMax: '', column1: '', column2: '', column3: '', column4: '', column5: '', column6: '', column7: '', column8: '', column9: '', column10: '', column11: '' }
        ]
      },
      initFormList: [
        { rowMin: '', rowMax: '', column1: '', column2: '', column3: '', column4: '', column5: '', column6: '', column7: '', column8: '', column9: '', column10: '', column11: '' },
        { rowMin: '', rowMax: '', column1: '', column2: '', column3: '', column4: '', column5: '', column6: '', column7: '', column8: '', column9: '', column10: '', column11: '' },
        { rowMin: '', rowMax: '', column1: '', column2: '', column3: '', column4: '', column5: '', column6: '', column7: '', column8: '', column9: '', column10: '', column11: '' },
        { rowMin: '', rowMax: '', column1: '', column2: '', column3: '', column4: '', column5: '', column6: '', column7: '', column8: '', column9: '', column10: '', column11: '' },
        { rowMin: '', rowMax: '', column1: '', column2: '', column3: '', column4: '', column5: '', column6: '', column7: '', column8: '', column9: '', column10: '', column11: '' }
      ],
      tableColForm: {
        tableHeader: [
          { min: '', max: '' },
          { min: '', max: '' },
          { min: '', max: '' },
          { min: '', max: '' }
        ],
        headerParams: 'wavelength@5',
        rowParams: 'lop460@4'
      },
      initTableHeader: [
        { min: '', max: '' },
        { min: '', max: '' },
        { min: '', max: '' },
        { min: '', max: '' }
      ],
      machineList: [],
      produceTypeList: [],
      substrateType: [],
      colorList: [],
      measureList: [],
      substrateFindOptions: [],
      levelList: [],
      searchKey: {
        rklx: '',
        size: '',
        gsmc: '',
        yzbx: ''
      },
      pageSize: 15,
      tableKey: 1,
      totalPage: 0,
      beginDate: new Date(),
      endDate: new Date(),
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() < endDateVal - 86400 * 180 * 1000 || time.getTime() > endDateVal
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
      paramsForm: {
        paramsList: [
          {
            minVal: '',
            maxVal: '',
            name: 'VF1',
            id: 'avg_vf1',
            type: 0,
            paramCategory: 0 // 区间参--0   区间参带%--1   范围参--2   选项参--3
          },
          {
            minVal: '',
            maxVal: '',
            name: 'VF1 Yield',
            id: 'yield_vf1',
            type: 0,
            paramCategory: 1 // 区间参--0   区间参带%--1   范围参--2   选项参--3
          },
          {
            minVal: '',
            maxVal: '',
            name: 'VZ Yield',
            id: 'yield_vz',
            type: 0,
            paramCategory: 1
          },
          {
            minVal: '',
            maxVal: '',
            name: 'ESD(200)Yield',
            id: 'esd_200',
            type: 0,
            paramCategory: 1
          },
          {
            minVal: '',
            maxVal: '',
            name: 'IR Yield',
            id: 'yield_ir',
            type: 0,
            paramCategory: 1
          },
          {
            minVal: '',
            maxVal: '',
            name: '目检',
            id: 'name',
            type: 2,
            paramCategory: 2
          }
        ]
      },
      headerParameter: [
        {
          name: 'PL_WD',
          paramCategory: 0,
          type: 1,
          id: 'wd'
        },
        {
          name: 'PL.I.I',
          paramCategory: 0,
          type: 1,
          id: 'ii'
        },
        {
          name: 'PL.I.I.STD',
          paramCategory: 0,
          type: 1,
          id: 'ii_std'
        },
        {
          name: 'PL_PD',
          paramCategory: 0,
          type: 1,
          id: 'pdavr'
        },
        {
          name: 'PL_Ref',
          paramCategory: 0,
          type: 1,
          id: 'ref'
        },
        {
          name: 'LOP(460)',
          paramCategory: 0,
          type: 4,
          id: 'lop460'
        },
        {
          name: 'ESD去坏(50V)',
          paramCategory: 0,
          type: 0,
          id: 'esd_50'
        },
        {
          name: '综合良率',
          paramCategory: 1,
          type: 0,
          id: 'yield_zh'
        },
        {
          name: 'VF2',
          paramCategory: 0,
          type: 0,
          id: 'avg_vf2'
        },
        {
          name: 'WLD1',
          paramCategory: 0,
          type: 5,
          id: 'wld1'
        },
        {
          name: 'IR',
          paramCategory: 0,
          type: 0,
          id: 'avg_ir'
        },
        {
          name: 'VZ',
          paramCategory: 0,
          type: 0,
          id: 'avg_vz'
        },
        {
          name: 'IV',
          paramCategory: 0,
          type: 0,
          id: 'avg_iv'
        },
        {
          name: 'WLD(PL-COW)',
          paramCategory: 0,
          type: 0,
          id: 'valk'
        },
        {
          name: '预估COW波长',
          paramCategory: 0,
          type: 5,
          id: 'wavelength'
        },
        {
          name: 'ESD(400)',
          paramCategory: 0,
          type: 0,
          id: 'esd_400'
        },
        {
          name: 'HW',
          paramCategory: 0,
          type: 4,
          id: 'hw'
        },
        {
          name: 'B.S',
          paramCategory: 0,
          type: 0,
          id: 'blue_shift'
        },
        {
          name: 'BOW',
          paramCategory: 0,
          type: 1,
          id: 'bow'
        },
        {
          name: 'PLINT_SID',
          paramCategory: 0,
          type: 1,
          id: 'pl_int_std'
        }
      ],
      rowParameter: [
        {
          name: 'PL_WD',
          paramCategory: 0,
          type: 1,
          id: 'wd'
        },
        {
          name: 'PL.I.I',
          paramCategory: 0,
          type: 1,
          id: 'ii'
        },
        {
          name: 'PL.I.I.STD',
          paramCategory: 0,
          type: 1,
          id: 'ii_std'
        },
        {
          name: 'PL_PD',
          paramCategory: 0,
          type: 1,
          id: 'pdavr'
        },
        {
          name: 'PL_Ref',
          paramCategory: 0,
          type: 1,
          id: 'ref'
        },
        {
          name: 'LOP(460)',
          paramCategory: 0,
          type: 4,
          id: 'lop460'
        },
        {
          name: 'ESD去坏(50V)',
          paramCategory: 0,
          type: 0,
          id: 'esd_50'
        },
        {
          name: '综合良率',
          paramCategory: 1,
          type: 0,
          id: 'yield_zh'
        },
        {
          name: 'VF2',
          paramCategory: 0,
          type: 0,
          id: 'avg_vf2'
        },
        {
          name: 'WLD1',
          paramCategory: 0,
          type: 5,
          id: 'wld1'
        },
        {
          name: 'IR',
          paramCategory: 0,
          type: 0,
          id: 'avg_ir'
        },
        {
          name: 'VZ',
          paramCategory: 0,
          type: 0,
          id: 'avg_vz'
        },
        {
          name: 'IV',
          paramCategory: 0,
          type: 0,
          id: 'avg_iv'
        },
        {
          name: 'WLD(PL-COW)',
          paramCategory: 0,
          type: 0,
          id: 'valk'
        },
        {
          name: '预估COW波长',
          paramCategory: 0,
          type: 5,
          id: 'wavelength'
        },
        {
          name: 'ESD(400)',
          paramCategory: 0,
          type: 0,
          id: 'esd_400'
        },
        {
          name: 'HW',
          paramCategory: 0,
          type: 4,
          id: 'hw'
        },
        {
          name: 'B.S',
          paramCategory: 0,
          type: 0,
          id: 'blue_shift'
        },
        {
          name: 'BOW',
          paramCategory: 0,
          type: 1,
          id: 'bow'
        },
        {
          name: 'PLINT_SID',
          paramCategory: 0,
          type: 1,
          id: 'pl_int_std'
        }
      ],
      parameter: [
        {
          name: 'PL_WD',
          paramCategory: 0,
          type: 1,
          id: 'wd'
        },
        {
          name: 'PL.I.I',
          paramCategory: 0,
          type: 1,
          id: 'ii'
        },
        {
          name: 'PL.I.I.STD',
          paramCategory: 0,
          type: 1,
          id: 'ii_std'
        },
        {
          name: 'PL_PD',
          paramCategory: 0,
          type: 1,
          id: 'pdavr'
        },
        {
          name: 'PL_Ref',
          paramCategory: 0,
          type: 1,
          id: 'ref'
        },
        {
          name: 'LOP(460)',
          paramCategory: 0,
          type: 4,
          id: 'lop460'
        },
        {
          name: 'ESD去坏(50V)',
          paramCategory: 0,
          type: 0,
          id: 'esd_50'
        },
        {
          name: '综合良率',
          paramCategory: 1,
          type: 0,
          id: 'yield_zh'
        },
        {
          name: 'VF2',
          paramCategory: 0,
          type: 0,
          id: 'avg_vf2'
        },
        {
          name: 'WLD1',
          paramCategory: 0,
          type: 5,
          id: 'wld1'
        },
        {
          name: 'IR',
          paramCategory: 0,
          type: 0,
          id: 'avg_ir'
        },
        {
          name: 'VZ',
          paramCategory: 0,
          type: 0,
          id: 'avg_vz'
        },
        {
          name: 'IV',
          paramCategory: 0,
          type: 0,
          id: 'avg_iv'
        },
        {
          name: 'WLD(PL-COW)',
          paramCategory: 0,
          type: 0,
          id: 'valk'
        },
        {
          name: '预估COW波长',
          paramCategory: 0,
          type: 5,
          id: 'wavelength'
        },
        {
          name: 'ESD(400)',
          paramCategory: 0,
          type: 0,
          id: 'esd_400'
        },
        {
          name: 'HW',
          paramCategory: 0,
          type: 4,
          id: 'hw'
        },
        {
          name: 'B.S',
          paramCategory: 0,
          type: 0,
          id: 'blue_shift'
        },
        {
          name: 'BOW',
          paramCategory: 0,
          type: 1,
          id: 'bow'
        },
        {
          name: 'PLINT_SID',
          paramCategory: 0,
          type: 1,
          id: 'pl_int_std'
        },
        {
          name: '综合判定',
          paramCategory: 3,
          type: 3,
          id: 'result'
        }
      ],
      rules: {
        visual: [{ required: true, validator: validateVisual, trigger: 'blur' }],
        params_minVal: [{ required: true, validator: validateParamsMin, trigger: 'blur' }],
        params_maxVal: [{ required: true, validator: validateParamsMax, trigger: 'blur' }]
      },
      tableFormRules: {
        params_minVal: [{ required: true, validator: validateTableMin, trigger: 'blur' }],
        params_maxVal: [{ required: true, validator: validateTableMax, trigger: 'blur' }]
      },
      tableColRules: {
        params_minVal: [{ required: true, validator: validateColMin, trigger: 'blur' }],
        params_maxVal: [{ required: true, validator: validateColMax, trigger: 'blur' }],
        header: [{ required: true, validator: validateCol, trigger: 'blur' }],
        row: [{ required: true, validator: validateRow, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.findSubstrateMeasureListFun()
    this.substrateFindListFun()
    this.findStructureTypeFun()
    this.ckStorehouseTypeFindFun()
    this.initParamsList()
    this.findlevelListFun()
  },
  methods: {
    // 目检等级
    findlevelListFun() {
      const params = {
        pageNum: 1,
        pageSize: 10000,
        status: 0
      }
      findlevelList(params).then(res => {
        this.levelList = res.data.list
      })
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
    // 入库类型查询
    ckStorehouseTypeFindFun() {
      ckStorehouseTypeFind({ pageNum: 1, pageSize: 1000 }).then(res => {
        this.storehouseType = res.data
      })
    },
    addTableCol() {
      this.tableColForm.tableHeader.push({ min: '', max: '' })
      this.tableKey++
    },
    deleteTableCol(index) {
      this.tableColForm.tableHeader.splice(index, 1)
      this.tableKey++
    },
    deleteTableRow(index) {
      this.tableForm.list.splice(index, 1)
      this.tableKey++
    },
    addTableRow(index) {
      this.tableForm.list.splice(-1, 0, { rowMin: '', rowMax: '', column1: '', column2: '', column3: '', column4: '', column5: '', column6: '', column7: '', column8: '', column9: '', colunm10: '', colunm11: '' })
      this.tableKey++
    },
    // 范围区间赋值
    changeVal(item, index) {
      if (item.paramCategory) {
        this.$set(this.paramsForm.paramsList[index], 'maxVal', this.paramsForm.paramsList[index].maxVal)
      }
    },
    // 删除动态参数
    deleteParams(index, item) {
      this.paramsForm.paramsList.splice(index, 1)
      this.parameter.find(i => i.id === item.id).disabled = false
    },
    // 选择生成参数
    selectParamsChange(val) {
      const obj = this.parameter.find(i => i.id === val)
      obj.disabled = true
      if (val === 'result') {
        this.paramsForm.paramsList.push({
          minVal: 's',
          maxVal: '',
          id: obj.id,
          type: obj.type,
          name: obj.name,
          paramCategory: obj.paramCategory
        })
      } else {
        this.paramsForm.paramsList.push({
          minVal: '',
          maxVal: '',
          id: obj.id,
          type: obj.type,
          name: obj.name,
          paramCategory: obj.paramCategory
        })
      }
      this.newParam = ''
      this.isParams = false
    },
    // 初始换动态参数
    initParamsList() {
      console.log(JSON.parse(sessionStorage.getItem('YrStaticParams')))
      const params = JSON.parse(sessionStorage.getItem('YrStaticParams'))
      const rowList = [{ rowMin: '', rowMax: '' }, { rowMin: '', rowMax: '' }, { rowMin: '', rowMax: '' }, { rowMin: '', rowMax: '' }, { rowMin: '', rowMax: '' }]
      if (JSON.parse(sessionStorage.getItem('YrStaticParams'))) {
        this.paramsForm.paramsList = params.paramsList
        params.rowList.map((item, index) => {
          rowList[index]['rowMin'] = item.rowMin
          rowList[index]['rowMax'] = item.rowMax
        })
        this.tableForm.list = rowList
        this.tableColForm.tableHeader = params.colList
        this.tableColForm.headerParams = params.headerParams
        this.tableColForm.rowParams = params.rowParams
        this.searchKey.rklx = params.warehousingType
        this.searchKey.gsmc = params.colorId
        this.searchKey.size = params.sizeId
        this.searchKey.yzbx = params.editionTypeId
      }
    },
    // 添加动态参数
    addHandleParams() {
      this.isParams = true
    },
    handleSearch() {
      this.$refs.paramsForm.validate((valid) => {
        if (valid) {
          this.$refs.tableColForm.validate((valid) => {
            if (valid) {
              this.$refs.tableForm.validate((valid) => {
                if (valid) {
                  this.fetchData()
                }
              })
            }
          })
        }
      })
    },
    setParams(index) {
      const parameters = [] // 参数范围设置
      const headerParam = [] // 表头参数
      const rowParams = [] // table左侧参数
      this.paramsForm.paramsList.map(item => {
        if (item.paramCategory === 2) { // 目检
          if (item.minVal) {
            parameters.push({
              max: '',
              min: '',
              val: `<= '${item.minVal}'`,
              type: item.type,
              paramName: item.id
            })
          } else {
            parameters.push({
              max: '',
              min: '',
              val: '',
              type: item.type,
              paramName: item.id
            })
          }
        } else if (item.paramCategory === 3) {
          parameters.push({
            max: '',
            min: '',
            val: ` = '${item.minVal}'`,
            type: item.type,
            paramName: item.id
          })
        } else {
          parameters.push({
            max: item.maxVal,
            min: item.minVal,
            val: '',
            type: item.type,
            paramName: item.id
          })
        }
      })
      // 表头参数组装
      this.tableColForm.tableHeader.map(item => {
        headerParam.push(`${item.min}-${item.max}`)
      })
      // table左侧参数组装
      this.tableForm.list.map(item => {
        rowParams.push(`${item.rowMin}-${item.rowMax}`)
      })
      rowParams.pop()
      const params = {
        warehousingType: this.searchKey.rklx,
        colorId: this.searchKey.gsmc,
        sizeId: this.searchKey.size,
        editionTypeId: this.searchKey.yzbx,
        parameters,
        startTime: formatDate(this.beginDate),
        endTime: formatDate(this.endDate),
        colData: {
          type: this.tableColForm.headerParams.split('@')[1],
          param: this.tableColForm.headerParams.split('@')[0],
          data: headerParam
        },
        rowData: {
          type: this.tableColForm.rowParams.split('@')[1],
          param: this.tableColForm.rowParams.split('@')[0],
          data: rowParams
        }
      }
      if (index === 1) {
        let rowName = ''
        let colName = ''
        this.headerParameter.map(item => {
          if (item.id === this.tableColForm.headerParams.split('@')[0]) {
            colName = item.name
          }
        })
        this.rowParameter.map(item => {
          if (item.id === this.tableColForm.rowParams.split('@')[0]) {
            rowName = item.name
          }
        })
        const selectStr = colName + '-' + rowName
        const titleArr = [...headerParam]
        titleArr.push('高亮占比')
        params.title = [selectStr, ...titleArr].join()
      }
      return params
    },
    fetchData() {
      const params = this.setParams()
      const staticParams = {
        paramsList: this.paramsForm.paramsList.slice(0, 6),
        rowList: this.tableForm.list.slice(0, 5),
        colList: this.tableColForm.tableHeader.slice(0, 4),
        headerParams: this.tableColForm.headerParams,
        rowParams: this.tableColForm.rowParams,
        warehousingType: this.searchKey.rklx,
        colorId: this.searchKey.gsmc,
        sizeId: this.searchKey.size,
        editionTypeId: this.searchKey.yzbx
      }
      queryParams(params).then(res => {
        this.seorageObj(staticParams)
        this.total = res.data.total
        this.okNum = res.data.satisfyNum
        this.okNumYield = res.data.satisfyNumRatio
        this.ngNum = res.data.ng
        this.ngNumYield = res.data.ngRatio
        this.tableForm.list = res.data.tableData
      })
    },
    exportAll() {
      const params = this.setParams(1)
      window.open(process.env.BASE_API + `/WyReportProductManagement/warehousingDistributionExport?param=${encodeURIComponent(JSON.stringify(params))}`)
    },
    seorageObj(obj) {
      const checkedIdStr = JSON.stringify(obj)
      sessionStorage.setItem('YrStaticParams', checkedIdStr)
    },
    setParameter() {
      this.parameter.map(item => {
        item.disabled = false
      })
    },
    clearAll() {
      this.searchKey.rklx = ''
      this.searchKey.gsmc = ''
      this.searchKey.size = ''
      this.searchKey.yzbx = ''
      this.beginDate = new Date()
      this.endDate = new Date()
      this.initParamsList()
      this.setParameter()
      this.tableForm.list = deepCopy(this.initFormList)
      this.tableColForm.tableHeader = deepCopy(this.initTableHeader)
      this.tableColForm.headerParams = 'wavelength@5'
      this.tableColForm.rowParams = 'lop460@4'
      this.total = ''
      this.okNum = ''
      this.okNumYield = ''
      this.ngNum = ''
      this.ngNumYield = ''
    }
  }
}

