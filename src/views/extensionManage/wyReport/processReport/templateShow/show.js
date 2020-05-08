
import PageHeaderLayout from '@/components/PageHeaderLayout'
import { findProduceType } from '@/api/extensionManage/wyBasicInfoManage/substrateBasicInfo/chipInfo'
import { findSubstrateMeasureList } from '@/api/chipBasicInfoManage/grindProcessInfo'
import { findStructureType } from '@/api/extensionManage/produceManage/movcdProduce'
import { machineList } from '@/api/extensionManage/wyBasicInfoManage/mocvdInfo' // 机台查询
import { substrateFindList } from '@/api/processManagement/chipManage'
import { processReportDisplay } from '@/api/extensionManage/wyReport/processReport'
import ScatterChart from '../scatter'
import CircleScatter from '../circleScatter'
import StackedBar from '../stackedBar'
import StackedLine from '../stackedLine'
import Candlestick from '../candlestick'
export default {
  components: {
    PageHeaderLayout,
    '0': ScatterChart,
    '1': CircleScatter,
    '2': Candlestick,
    '3': StackedBar,
    '4': StackedLine
  },
  watch: {
    addForm: {
      handler(val, oldVal) {
        this.materialDialogChange = true
      },
      deep: true
    }
  },
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      chartList: [],
      sizeOptions: [],
      produceTypeList: [],
      structureTypeList: [],
      machineListOption: [],
      substrateFindOptions: [],
      optionData: {
        runId: ['123123123123', '123123123123', '123123123123', '123123123123', '', '23423423423423', '23423423423423', '23423423423423', '23423423423423'],
        series: [
          {
            name: 'wd',
            data: [170, 160, 180, 190, '', 180, 500, 100, 200],
            position: 'left'
          },
          {
            name: 'wd-std',
            data: [180, 170, 190, 199, '', 190, 510, 110, 210],
            position: 'right'
          }
        ]
      },
      totalPage: 0,
      templateName: '',
      beginDate: '',
      endDate: '',
      chartType: '',
      searchKeys: {
        sclx: [],
        size: '',
        jglx: '',
        jt: [],
        yzbx: '',
        zq: '',
        zqs: ''
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
      productOptions: [
        { id: 0, name: '待接收' },
        { id: 1, name: '试样中' },
        { id: 2, name: '试样完成' }
      ],
      chartTypeOptions: [
        { id: 0, name: '工艺视图' },
        { id: 1, name: 'COW/COT视图' }
      ],
      isShowMenu: {
        'process-report-handle': false
      }
    }
  },
  // process-report-handle
  mounted() {
    var _this = this
    setTimeout(function() {
      const roleInfo = sessionStorage.getItem('roleInfo')
      if (roleInfo !== undefined && roleInfo !== null) {
        const roleList = JSON.parse(roleInfo)
        for (const item of roleList) {
          if (item.path === 'wyproductionManage') {
            for (const items of item.children) {
              if (items.path === 'wyReport') {
                for (const citems of items.children) {
                  if (citems.path === 'processReport') {
                    citems.children.map(process => {
                      if (process.path === 'templateShow') {
                        const menus = process.funIds.split(',')
                        for (const menu of menus) {
                          _this.isShowMenu[menu] = true
                        }
                      }
                    })
                  }
                }
              }
            }
          }
        }
      }
    }, 500)
    // this.searchKeys.sclx = sessionStorage.getItem('wybbsclx') === null ? '' : sessionStorage.getItem('wybbsclx')
    // this.searchKeys.size = sessionStorage.getItem('wybbsize') === null ? '' : sessionStorage.getItem('wybbsize')
    // this.searchKeys.jglx = sessionStorage.getItem('wybbjglx') === null ? '' : sessionStorage.getItem('wybbjglx')
    // this.searchKeys.jt = sessionStorage.getItem('wybbjt') === null ? '' : sessionStorage.getItem('wybbjt').split(',').map(Number)
    // this.searchKeys.yzbx = sessionStorage.getItem('wybbyzbx') === null ? '' : sessionStorage.getItem('wybbyzbx')
    // this.endDate = sessionStorage.getItem('wybbendDate') === null ? '' : sessionStorage.getItem('wybbendDate')
    // this.searchKeys.zq = sessionStorage.getItem('wybbzq') === null ? '' : sessionStorage.getItem('wybbzq')
    // this.searchKeys.zqs = sessionStorage.getItem('wybbzqs') === null ? '' : sessionStorage.getItem('wybbzqs')
    this.findProduceTypeFun() // 生产类型查询
    this.findSubstrateMeasureList() // 尺寸
    this.findStructureTypeFun() // 结构类型
    this.findMachineList() // 机台
    this.substrateFindListFun() // 验证版型
    this.templateName = this.$route.query.name
  },
  methods: {
    // 生产图表
    handleCreate() {
      const params = {
        id: this.$route.query.id,
        productTypeId: this.searchKeys.sclx.join(','),
        measureId: this.searchKeys.size,
        structureId: this.searchKeys.jglx,
        machineId: this.searchKeys.jt.join(','),
        editionTypeId: this.searchKeys.yzbx,
        closingDate: this.endDate,
        cycle: this.searchKeys.zq,
        cycleNum: this.searchKeys.zqs
      }
      this.listLoading = true
      processReportDisplay(params).then(res => {
        this.chartList = res.data
        this.listLoading = false
      })
    },
    // 验证版型
    substrateFindListFun() {
      substrateFindList().then(res => {
        this.substrateFindOptions = res.data.list
      })
    },
    findMachineList() {
      machineList().then(res => {
        this.machineListOption = res.data
      })
    },
    // 结构类型
    findStructureTypeFun() {
      findStructureType(this.params).then(res => {
        this.structureTypeList = res.data
      })
    },
    findProduceTypeFun() {
      findProduceType().then(res => {
        this.produceTypeList = res.data.list
      })
    },
    // 衬底尺寸
    findSubstrateMeasureList() {
      findSubstrateMeasureList().then(res => {
        this.sizeOptions = res.data
      })
    },
    handleAdd() {
      if (this.chartType === '') {
        this.$message({
          type: 'error',
          message: '请选择新增的视图类型!'
        })
        return false
      }
      // sessionStorage.setItem('wybbsclx', this.searchKeys.sclx)
      // sessionStorage.setItem('wybbsize', this.searchKeys.size)
      // sessionStorage.setItem('wybbjglx', this.searchKeys.jglx)
      // sessionStorage.setItem('wybbjt', this.searchKeys.jt)
      // sessionStorage.setItem('wybbyzbx', this.searchKeys.yzbx)
      // sessionStorage.setItem('wybbendDate', this.endDate)
      // sessionStorage.setItem('wybbzq', this.searchKeys.zq)
      // sessionStorage.setItem('wybbzqs', this.searchKeys.zqs)
      this.$router.push({ path: '/wyReport/templateCreate', query: { id: this.$route.query.id, type: this.chartType, name: this.$route.query.name }})
    },
    handleSearch() {

    },
    handleExport() {
      this.$printChart(this.$refs.print, { 'notPrint': '.el-table' })
    },
    clearSearch() {
      this.searchKeys = {
        sclx: [],
        size: '',
        jglx: '',
        jt: [],
        yzbx: '',
        zq: '',
        zqs: ''
      }
    }
  }
}

