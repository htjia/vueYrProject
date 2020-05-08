
import PageHeaderLayout from '@/components/PageHeaderLayout'
import LineChart from './LineChart'
import { findProduceType, findSubstrateType } from '@/api/extensionManage/wyReport/STDStatistics'
import { machineList } from '@/api/extensionManage/wyBasicInfoManage/mocvdInfo' // 机台查询
import { ckStorehouseTypeFind } from '@/api/chipManage/extensionStorageManage/inventoryInquiry'
import { findStructureType, findSubstrateMeasureList } from '@/api/extensionManage/wyReport/productionReport/index'
import { substrateFindList } from '@/api/processManagement/chipManage'
import { queryChartData, queryTableData, queryZzChartData } from '@/api/extensionManage/wyReport/portalfilm'
export default {
  components: { PageHeaderLayout, LineChart },
  computed: {
    titalParams() {
      let tital = ''
      if (this.searchKey.cotOrCow === 1) {
        tital = this.cotParams.find(i => i.id === this.searchKey.params).label
      } else {
        tital = this.cowParams.find(i => i.id === this.searchKey.params).label
      }
      return tital
    }
  },
  data() {
    return {
      listLoading: false,
      chartLoading: false,
      notBastic: false,
      showTable: false,
      hourRow: null,
      firstIndexSelect: -1,
      list: [],
      machineList: [],
      waferIds: [],
      selectedRow: [],
      zzOptions: [],
      options: [],
      produceTypeList: [],
      substrateType: [],
      colorList: [],
      storehouseType: [],
      measureList: [],
      substrateFindOptions: [],
      cotOrCowList: [
        { id: 1, name: 'COT' },
        { id: 0, name: 'COW' }
      ],
      paramsList: [],
      cowParams: [
        { id: 'avg_iv', disabled: false, label: 'IV均值' },
        { id: 'avg_vf1', disabled: false, label: 'VF1均值' },
        { id: 'vf1_esd_avg', disabled: false, label: 'VF1_ESD_A均值' },
        { id: 'vf1_esd_differ', disabled: false, label: 'VF1_ESD差值' },
        { id: 'avg_vz', disabled: false, label: 'VZ均值' },
        { id: 'blue_shift', disabled: false, label: '蓝移' },
        { id: 'valk', disabled: false, label: 'K值' },
        { id: 'esd_200', disabled: false, label: 'ESD去坏(200V)' },
        { id: 'esd_400', disabled: false, label: 'ESD去坏(400V)' },
        { id: 'esd_50', disabled: false, label: 'ESD去坏(50V)' },
        { id: 'esd_500', disabled: false, label: 'ESD去坏(500V)' },
        { id: 'esd_300', disabled: false, label: 'ESD去坏(300V)' },
        { id: 'esd_1000', disabled: false, label: 'ESD去坏(1000V)' },
        { id: 'esd_2000', disabled: false, label: 'ESD去坏(2000V)' },
        { id: 'esd_4000', disabled: false, label: 'ESD去坏(4000V)' },
        { id: 'yield_thyristor', disabled: false, label: 'Thyristor良率' },
        { id: 'num_thyristor', disabled: false, label: 'Thyristor坏点数' },
        { id: 'avg_dvf', disabled: false, label: 'DVF均值' },
        { id: 'yield_zh', disabled: false, label: '综合良率' },
        { id: 'yield_vf1', disabled: false, label: 'VF1良率' },
        { id: 'yield_vf3', disabled: false, label: 'VF3良率' },
        { id: 'yield_wld1', disabled: false, label: 'WLD1良率' },
        { id: 'yield_ir', disabled: false, label: 'IR良率' },
        { id: 'yield_vz', disabled: false, label: 'VZ良率' },
        { id: 'yield_iv', disabled: false, label: 'IV良率' },
        { id: 'yield_vf4', disabled: false, label: 'VF4良率' },
        { id: 'avg_vf2', disabled: false, label: 'VF2均值' },
        { id: 'avg_vf3', disabled: false, label: 'VF3均值' },
        { id: 'avg_vf4', disabled: false, label: 'VF4均值' },
        { id: 'avg_wld1', disabled: false, label: 'WLD1均值' },
        { id: 'wld1_std', disabled: false, label: 'WLD1_STD' },
        { id: 'avg_wlp1', disabled: false, label: 'WLP1均值' },
        { id: 'hw1', disabled: false, label: 'HW1' },
        { id: 'avg_wld2', disabled: false, label: 'WLD2均值' },
        { id: 'wld2_std', disabled: false, label: 'WLD2_STD' },
        { id: 'hw2', disabled: false, label: 'HW2' },
        { id: 'avg_wlp2', disabled: false, label: 'wlp2均值' },
        { id: 'avg_ir', disabled: false, label: 'IR均值' },
        { id: 'pl_wp', disabled: false, label: 'PL_WP' },
        { id: 'pl_wd', disabled: false, label: 'PL_WD' },
        { id: 'pl_wd_std', disabled: false, label: 'PL_WD_STD' },
        { id: 'pl_ii', disabled: false, label: 'PL.I.I' },
        { id: 'ir_esd_yield', disabled: false, label: 'IR_ESD_A良率' },
        { id: 'vf1_esd_yield', disabled: false, label: 'VF1_ESD良率' }
      ],
      cotParams: [
        { id: 'iv_svr', disabled: false, label: 'IV均值', percent: 0 },
        { id: 'vf1_svr', disabled: false, label: 'VF1均值', percent: 0 },
        { id: 'vz_svr', disabled: false, label: 'VZ均值', percent: 0 },
        { id: 'thyristor_yield', disabled: false, label: 'Thyristor良率', percent: 1 },
        { id: 'thyristor_bad', disabled: false, label: 'Thyristor坏点', percent: 0 },
        { id: 'compre_yield', disabled: false, label: '综合良率', percent: 1 },
        { id: 'product_yield', disabled: false, label: '生产良率', percent: 1 },
        { id: 'vf1_yield', disabled: false, label: 'VF1良率', percent: 1 },
        { id: 'vf3_yield', disabled: false, label: 'VF3良率', percent: 1 },
        { id: 'vf4_yield', disabled: false, label: 'VF4良率', percent: 1 },
        { id: 'wld1_yield', disabled: false, label: 'WLD1良率', percent: 1 },
        { id: 'wlp1_yield', disabled: false, label: 'WLP1良率', percent: 1 },
        { id: 'ir_yield', disabled: false, label: 'IR良率', percent: 1 },
        { id: 'ir_esd_yield', disabled: false, label: 'IR_ESD_A良率', percent: 1 },
        { id: 'vz_yield', disabled: false, label: 'VZ良率', percent: 1 },
        { id: 'iv_yield', disabled: false, label: 'IV良率', percent: 1 },
        { id: 'vf2_svr', disabled: false, label: 'VF2均值', percent: 0 },
        { id: 'vf3_svr', disabled: false, label: 'VF3均值', percent: 0 },
        { id: 'vf4_svr', disabled: false, label: 'VF4均值', percent: 0 },
        { id: 'wld1_svr', disabled: false, label: 'WLD1均值', percent: 0 },
        { id: 'wld1_std', disabled: false, label: 'WLD1_STD', percent: 0 },
        { id: 'wlp1_svr', disabled: false, label: 'WLP1均值', percent: 0 },
        { id: 'hw1', disabled: false, label: 'HW1', percent: 0 },
        { id: 'wld2_svr', disabled: false, label: 'WLD2均值', percent: 0 },
        { id: 'bs', disabled: false, label: 'BS', percent: 0 },
        { id: 'ir_svr', disabled: false, label: 'IR均值', percent: 0 }
      ],
      searchKey: {
        rklx: '',
        size: '',
        gsmc: '',
        machine: [],
        cotOrCow: 0,
        params: 'avg_iv',
        yzbx: '',
        month: ''
      },
      inMakSearchKey: {
        rklx: '',
        size: '',
        gsmc: '',
        yzbx: '',
        month: ''
      },
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
      }
    }
  },
  mounted() {
    this.substrateFindListFun()
    this.findSubstrateMeasureListFun()
    this.findStructureTypeFun()
    this.ckStorehouseTypeFindFun()
    this.findMachineList()
    this.initSelection()
    this.queryChartDataFun()
    this.queryZzChartDataFun()
  },
  methods: {
    initSelection() {
      this.paramsList = this.cowParams
      this.inMakSearchKey.month = this.formatDate()
      this.searchKey.month = this.formatDate()
    },
    // 单击异常信息
    rowClick(row) {
      this.selectedRunRow = row
    },
    cellClick(row, column, cell, event) {
      console.log(row)
      console.log(column)
      if (column.className === 'el-table-column--selection') {
        this.$refs.runTable.toggleRowSelection([{ row: row, selected: true }])
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
    // 统计设置
    handleSwitch() {
      this.showTable = !this.showTable
      this.listLoading = true
      if (this.showTable) {
        this.queryTableDataFun()
      }
      this.listLoading = false
    },
    // 统计设置确定
    handleSetSelectTable() {
      console.log(this.list)
      console.log(this.selectedRow)
      this.list.map(item => {
        if (this.selectedRow.indexOf(item) === -1) {
          this.waferIds.push(item.waferId)
        }
      })
      console.log(this.waferIds)
      // 根据取消的wafer查询图表
      this.queryChartDataFun()
      this.showTable = false
    },
    cotOrCowChange(id) {
      this.paramsList = id ? this.cotParams : this.cowParams
      this.searchKey.params = id ? 'iv_svr' : 'avg_iv'
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
    // 机台查询
    findMachineList() {
      machineList().then(res => {
        this.machineList = res.data
      })
    },
    // 生产类型查询
    findProduceTypeFun() {
      findProduceType(this.params).then(res => {
        this.produceTypeList = res.data
      })
    },
    // 衬底工艺查询
    findSubstrateTypeFun() {
      findSubstrateType(this.params).then(res => {
        this.substrateType = res.data
      })
    },
    formatDate() {
      var date = new Date()
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      return y + '-' + m.substring(m.length - 2, m.length)
    },
    clearAll() {
      this.searchKey.rklx = ''
      this.searchKey.gsmc = ''
      this.searchKey.size = ''
      this.searchKey.machine = ''
      this.searchKey.cotOrCow = 0
      this.searchKey.machine = []
      this.searchKey.params = 'avg_iv'
      this.searchKey.yzbx = ''
      this.searchKey.month = this.formatDate()
      this.handleRkSearch()
    },
    handleRkSearch() {
      if (this.showTable) {
        this.queryTableDataFun()
      } else {
        this.queryChartDataFun()
      }
    },
    // 查询入库图表
    queryChartDataFun() {
      this.listLoading = true
      const requestParams = {
        warehousingType: this.searchKey.rklx,
        colorId: this.searchKey.gsmc,
        sizeId: this.searchKey.size,
        editionTypeId: this.searchKey.yzbx,
        machineIds: this.searchKey.machine.join(','),
        type: this.searchKey.cotOrCow,
        param: this.searchKey.params,
        waferIds: this.waferIds.join(','),
        month: this.searchKey.month
      }
      if (this.searchKey.cotOrCow === 1) {
        const percent = this.cotParams.find(i => i.id === this.searchKey.params).percent
        requestParams.percent = percent
      }
      queryChartData(requestParams).then(res => {
        this.listLoading = false
        this.options = res.data
        this.waferIds = []
      })
    },
    queryTableDataFun() {
      const requestParams = {
        warehousingType: this.searchKey.rklx,
        colorId: this.searchKey.gsmc,
        sizeId: this.searchKey.size,
        editionTypeId: this.searchKey.yzbx,
        machineIds: this.searchKey.machine.join(','),
        type: this.searchKey.cotOrCow,
        param: this.searchKey.params,
        month: this.searchKey.month
      }
      console.log(requestParams)
      this.listLoading = true
      queryTableData(requestParams).then(res => {
        this.listLoading = false
        this.list = res.data
        setTimeout(() => {
          this.list.map(item => {
            item.selected = true
            this.$refs.runTable.toggleRowSelection([{ row: item, selected: true }])
          })
        }, 200)
      })
    },
    queryZzChartDataFun() {
      const requestParams = {
        warehousingType: this.inMakSearchKey.rklx,
        colorId: this.inMakSearchKey.gsmc,
        sizeId: this.inMakSearchKey.size,
        editionTypeId: this.inMakSearchKey.yzbx,
        month: this.inMakSearchKey.month
      }
      this.chartLoading = true
      console.log(requestParams)
      queryZzChartData(requestParams).then(res => {
        this.chartLoading = false
        this.zzOptions = res.data
      })
    },
    clearZz() {
      this.inMakSearchKey.rklx = ''
      this.inMakSearchKey.gsmc = ''
      this.inMakSearchKey.size = ''
      this.inMakSearchKey.yzbx = ''
      this.inMakSearchKey.month = this.formatDate()
      this.queryZzChartDataFun()
    }
  }
}

