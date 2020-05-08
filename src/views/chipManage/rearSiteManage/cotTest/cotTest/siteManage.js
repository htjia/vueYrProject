
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { machineList, findProductCode, findSubstrateMeasureList, findMachinList } from '@/api/chipManage/rearSiteManage/cowInfo'
import { findCategory, getList, mulFind } from '@/api/chipManage/rearSiteManage/cotTestData'
import { sectionSet, sectionGet, getSectionStatis, getSingleBinStatis, getMulBinStatis } from '@/api/chipManage/rearSiteManage/sectionSet'
import { isNumber } from '@/utils/dataCheck'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      SectionDialogVisible: false,
      BinDialogVisible: false,
      SectionSetDialogVisible: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      selectTheadVisble: false,
      isMulFind: false,
      activeTabIndex: 0,
      list: [],
      sectionList: [],
      vf1SectionList: [],
      irSectionList: [],
      lopSectionList: [],
      wld1SectionList: [],
      binList: [],
      vf1listLoading: false,
      irlistLoading: false,
      loplistLoading: false,
      wld1listLoading: false,
      binLoading: false,
      sectionset: {
        minval: '',
        maxval: '',
        interval: ''
      },
      setTitle: 'vf1',
      selectWaferId: '',
      sortField: '',
      sortRule: '',
      selectedNum: 0,
      selectedRow: [],
      isShowTitle: true,
      titleInfo: '隐藏',
      binTitle: [
        { thKey: 'vf1Min', thName: 'vf1_min', thWidth: 100 },
        { thKey: 'vf1Max', thName: 'vf1_max', thWidth: 100 },
        { thKey: 'vf2Min', thName: 'vf2_min', thWidth: 100 },
        { thKey: 'vf2Max', thName: 'vf2_max', thWidth: 100 },
        { thKey: 'vf3Min', thName: 'vf3_min', thWidth: 100 },
        { thKey: 'vf3Max', thName: 'vf3_max', thWidth: 100 },
        { thKey: 'vf4Min', thName: 'vf4_min', thWidth: 100 },
        { thKey: 'vf4Max', thName: 'vf4_max', thWidth: 100 },
        { thKey: 'vfdMin', thName: 'vfd_min', thWidth: 100 },
        { thKey: 'vfdMax', thName: 'vfd_max', thWidth: 100 },
        { thKey: 'vzMin', thName: 'vz_min', thWidth: 100 },
        { thKey: 'vzMax', thName: 'vz_max', thWidth: 100 },
        { thKey: 'irMin', thName: 'ir_min', thWidth: 100 },
        { thKey: 'irMax', thName: 'ir_max', thWidth: 100 },
        { thKey: 'iresdaMin', thName: 'iresda_min', thWidth: 100 },
        { thKey: 'iresdaMax', thName: 'iresda_max', thWidth: 100 },
        { thKey: 'lopMin', thName: 'lop_min', thWidth: 100 },
        { thKey: 'lopMax', thName: 'lop_max', thWidth: 100 },
        { thKey: 'wldMin', thName: 'wld_min', thWidth: 100 },
        { thKey: 'wldMax', thName: 'wld_max', thWidth: 100 },
        { thKey: 'bsMin', thName: 'bs_min', thWidth: 100 },
        { thKey: 'bsMax', thName: 'bs_max', thWidth: 100 },
        { thKey: 'dvfMin', thName: 'dvf_min', thWidth: 100 },
        { thKey: 'dvfMax', thName: 'dvf_max', thWidth: 100 },
        { thKey: 'hwMin', thName: 'hw_min', thWidth: 100 },
        { thKey: 'hwMax', thName: 'hw_max', thWidth: 100 },
        { thKey: 'wlpMin', thName: 'wlp_min', thWidth: 100 },
        { thKey: 'wlpMax', thName: 'wlp_max', thWidth: 100 },
        { thKey: 'type', thName: '类型', thWidth: 100 }
      ],
      showBinTitle: [],
      binWafers: '',
      binName: '',
      binVer: '',
      pattern: '',
      hoverRow: null,
      userOptions: [],
      machineList: [],
      productCodeList: [],
      substrateMeasureList: [],
      cowMachineList: [],
      categoryList: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      timeRadio: 0,
      beginDate: new Date(new Date().toLocaleDateString()).getTime(),
      endDate: new Date().getTime(),
      control: false,
      defaultFormThead: [],
      formThead: [],
      theadOptions: [
        // { thName: '测试类型', thKey: 'name' },
        // { thName: 'WaferID', thKey: 'waferNo' },
        { thName: 'LOP校正系数', thKey: 'lopCorrect', thWidth: 115 },
        { thName: 'VF校正系数', thKey: 'vfCorrect', thWidth: 100 },
        { thName: 'WLD校正系数', thKey: 'wldCorrect', thWidth: 115 },
        { thName: 'ESD测试电压(正向)', thKey: 'voltageF', thWidth: 160 },
        { thName: 'ESD测试电压(负向)', thKey: 'voltageR', thWidth: 160 },
        { thName: '测试电流', thKey: 'electricity', thWidth: 115 },
        { thName: '产品代码', thKey: 'productCode', thWidth: 85 },
        { thName: '测试时间', thKey: 'testTime', thWidth: 150 },
        { thName: 'Bin表名称', thKey: 'binName', thWidth: 90 },
        { thName: 'Bin表版本', thKey: 'binVersion', thWidth: 90 },
        { thName: '分Bin时间', thKey: 'binTime', thWidth: 150 },
        { thName: '入Bin', thKey: 'inBin' },
        { thName: '混合', thKey: 'blend' },
        { thName: '专案', thKey: 'special' },
        { thName: '不良', thKey: 'nogood' },
        { thName: '坏点', thKey: 'baddot' },
        { thName: 'IV均值', thKey: 'ivSvr' },
        { thName: 'VF1均值', thKey: 'vf1Svr' },
        { thName: 'VZ均值', thKey: 'vzSvr' },
        { thName: 'Thyristor良率', thKey: 'thyristorYield', thWidth: 140 },
        { thName: 'Thyristor坏点', thKey: 'thyristorBad', thWidth: 140 },
        { thName: '综合良率', thKey: 'compreYield', thWidth: 85 },
        { thName: '生产良率', thKey: 'productYield', thWidth: 85 },
        { thName: 'VF1良率', thKey: 'vf1Yield' },
        { thName: 'VF3良率', thKey: 'vf3Yield' },
        { thName: 'VF4良率', thKey: 'vf4Yield' },
        { thName: 'WLD1良率', thKey: 'wld1Yield', thWidth: 100 },
        { thName: 'WLP1良率', thKey: 'wlp1Yield', thWidth: 95 },
        { thName: 'IR良率', thKey: 'irYield' },
        { thName: 'IR_ESD_A良率', thKey: 'irEsdYield', thWidth: 130 },
        { thName: 'VZ良率', thKey: 'vzYield' },
        { thName: 'IV良率', thKey: 'ivYield' },
        { thName: 'BS良率', thKey: 'bsYield', thWidth: 95 },
        { thName: 'VF2均值', thKey: 'vf2Svr' },
        { thName: 'VF3均值', thKey: 'vf3Svr' },
        { thName: 'VF4均值', thKey: 'vf4Svr' },
        { thName: 'WLD1均值', thKey: 'wld1Svr', thWidth: 95 },
        { thName: 'WLD1_STD', thKey: 'wld1Std', thWidth: 95 },
        { thName: 'WLP1均值', thKey: 'wlp1Svr', thWidth: 95 },
        { thName: 'HW1', thKey: 'hw1' },
        { thName: 'WLD2均值', thKey: 'wld2Svr', thWidth: 95 },
        { thName: 'BS(蓝移)', thKey: 'bs', thWidth: 85 },
        { thName: 'IR均值', thKey: 'irSvr' },
        { thName: '扫描数量', thKey: 'scanNum', thWidth: 85 },
        { thName: '总测试数', thKey: 'testNum', thWidth: 85 },
        { thName: '坏点数', thKey: 'badNum', thWidth: 85 },
        { thName: '微漏电数', thKey: 'leakNum', thWidth: 85 },
        { thName: '导入时间', thKey: 'importTime', thWidth: 150 },
        { thName: '机台', thKey: 'machine' },
        { thName: '形状', thKey: 'pattern' },
        // ------------
        { thName: 'Size', thKey: 'size' },
        { thName: '测试中心异常', thKey: 'centerIsabnormal', thWidth: 150 },
        { thName: 'VF1异常占比', thKey: 'vfProportion', thWidth: 140 },
        { thName: 'IR异常占比', thKey: 'irProportion', thWidth: 140 },
        { thName: '1~144bin', thKey: 'bin1144' },
        { thName: '145~147bin', thKey: 'bin1457', thWidth: 130 },
        { thName: '148bin', thKey: 'bin148' },
        { thName: '149bin', thKey: 'bin149' }
      ],
      formTheadOptions: [
        // '测试类型',
        // 'WaferID',
        'LOP校正系数',
        'VF校正系数',
        'WLD校正系数',
        'ESD测试电压(正向)',
        'ESD测试电压(负向)',
        '测试电流',
        '产品代码',
        '测试时间',
        'Bin表名称',
        'Bin表版本',
        '分Bin时间',
        '入Bin',
        '混合',
        '专案',
        '不良',
        '坏点',
        'IV均值',
        'VF1均值',
        'VZ均值',
        'Thyristor良率',
        'Thyristor坏点',
        '综合良率',
        '生产良率',
        'VF1良率',
        'VF3良率',
        'VF4良率',
        'WLD1良率',
        'WLP1良率',
        'IR良率',
        'IR_ESD_A良率',
        'VZ良率',
        'IV良率',
        'BS良率',
        'VF2均值',
        'VF3均值',
        'VF4均值',
        'WLD1均值',
        'WLD1_STD',
        'WLP1均值',
        'HW1',
        'WLD2均值',
        'BS(蓝移)',
        'IR均值',
        '扫描数量',
        '总测试数',
        '坏点数',
        '微漏电数',
        '导入时间',
        '机台',
        '形状',
        'Size',
        '测试中心异常',
        'VF1异常占比',
        'IR异常占比',
        '1~144bin',
        '145~147bin',
        '148bin',
        '149bin'
      ],
      checkboxVal: [
        // '测试类型',
        // 'WaferID',
        'LOP校正系数',
        'VF校正系数',
        'WLD校正系数',
        'ESD测试电压(正向)',
        'ESD测试电压(负向)',
        '测试电流',
        '产品代码',
        '测试时间',
        'Bin表名称',
        'Bin表版本',
        '分Bin时间',
        '入Bin',
        '混合',
        '专案',
        '不良',
        '坏点',
        'IV均值',
        'VF1均值',
        'VZ均值',
        'Thyristor良率',
        'Thyristor坏点',
        '综合良率',
        '生产良率',
        'VF1良率',
        'VF3良率',
        'VF4良率',
        'WLD1良率',
        'WLP1良率',
        'IR良率',
        'IR_ESD_A良率',
        'VZ良率',
        'IV良率',
        'BS良率',
        'VF2均值',
        'VF3均值',
        'VF4均值',
        'WLD1均值',
        'WLD1_STD',
        'WLP1均值',
        'HW1',
        'WLD2均值',
        'BS(蓝移)',
        'IR均值',
        '扫描数量',
        '总测试数',
        '坏点数',
        '微漏电数',
        '导入时间',
        '机台',
        '形状',
        'Size',
        '测试中心异常',
        'VF1异常占比',
        'IR异常占比',
        '1~144bin',
        '145~147bin',
        '148bin',
        '149bin'
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
        LotNo: '',
        tplx: '',
        wyjt: '',
        tclx: '',
        wyph: '',
        cpdm: '',
        WaferNo: '',
        cc: '',
        cotjt: ''
      },
      processCardOptions: [
        { name: 1, id: 1 }
      ],
      tpOptions: [
        {
          id: 0,
          name: '圆片'
        },
        {
          id: 1,
          name: '方片'
        }
      ],
      machineForm: {
        code: '',
        name: '',
        remark: ''
      },
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      mulForm: {
        mulWaferID: ''
      },
      mulrules: {
        mulWaferID: [{ required: true, message: '请输入waferID', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
    this.machineListFun()
    this.findProductCodeFun()
    this.findSubstrateMeasureListFun()
    this.findMachinListFun()
    this.findCategoryFun()
    this.formThead = this.theadOptions
    this.showBinTitle = this.binTitle
    this.checkboxVal = localStorage.getItem('cotHeaders') === null ? this.formTheadOptions : localStorage.getItem('cotHeaders').split(',')
    this.setThead(this.checkboxVal)
  },
  methods: {
    downLoadFile(url) {
      window.open(process.env.BASE_API + '/attachment/downByPath?path=' + url)
    },
    cellStyle(data) {
      if (data.row.discolorList.length > 0) {
        for (const item of data.row.discolorList) {
          if (data.column.property === item) {
            return { background: '#F56C6C !important', color: '#fff' }
          }
        }
      }
    },
    // 投片类型
    findCategoryFun() {
      findCategory({}).then(res => {
        this.categoryList = res.data
      })
    },
    // 获取外延机台
    machineListFun() {
      machineList({}).then(res => {
        this.machineList = res.data
      })
    },
    // 获取产品代码
    findProductCodeFun() {
      findProductCode({}).then(res => {
        this.productCodeList = res.data
      })
    },
    // 衬底尺寸
    findSubstrateMeasureListFun() {
      findSubstrateMeasureList({}).then(res => {
        this.substrateMeasureList = res.data
      })
    },
    // 获取cot机台
    findMachinListFun() {
      const params = {
        pageNum: 1,
        pageSize: 1000,
        siteId: 28
      }
      findMachinList(params).then(res => {
        this.cowMachineList = res.data.list
      })
    },
    setThead(checkboxVal) {
      var arr = []
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val) {
            arr.push(item)
          }
        })
      })
      this.formThead = arr
    },
    selectThead() {
      this.selectTheadVisble = !this.selectTheadVisble
    },
    submitOption() {
      const arr = []
      console.log(this.checkboxVal)
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val) {
            arr.push(item)
          }
        })
      })
      localStorage.setItem('cotHeaders', this.checkboxVal)
      this.formThead = arr
      this.selectTheadVisble = false
    },
    resetOption() {
      this.selectTheadVisble = false
    },
    labelHead(h, { column, index }) {
      const l = column.label.length
      const f = 13 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.minWidth = l < 6 ? 100 : f * l // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      if (column.label.includes('时')) {
        column.width = 150
      }
      if (column.label.includes('测试中心')) {
        column.width = 100
      }
      // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h('div', { class: 'table-head', style: { width: '100%' }}, [column.label])
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    // 重置
    clearSearch() {
      this.searchKeys.LotNo = ''
      this.searchKeys.tplx = ''
      this.searchKeys.wyjt = ''
      this.searchKeys.tclx = ''
      this.searchKeys.xh = ''
      this.searchKeys.wyph = ''
      this.searchKeys.cpdm = ''
      this.searchKeys.WaferNo = ''
      this.searchKeys.cc = ''
      this.searchKeys.cotjt = ''
      this.beginDate = new Date(new Date().toLocaleDateString()).getTime()
      this.endDate = new Date().getTime()
      this.handleSearch()
    },
    tabClick(index) {
      this.activeTabIndex = index
    },
    // 每页数量改变timeRadio
    sizeChange(pageSize) {
      this.pageSize = pageSize
      if (this.isMulFind) {
        this.mulWaferFind()
      } else {
        this.fetchData()
      }
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      if (this.isMulFind) {
        this.mulWaferFind()
      } else {
        this.fetchData()
      }
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      var h = '0' + date.getHours()
      var s = '0' + date.getMinutes()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length) + ' ' + h.substring(h.length - 2, h.length) + ':' + s.substring(s.length - 2, s.length)
    },
    exportExcel() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      let colCn = '测试类型;WaferID'
      let colEn = 'categoryName,waferNo'
      this.formThead.map(item => {
        colCn += ';' + item.thName
        colEn += ',' + item.thKey
      })
      if (this.isMulFind) {
        this.mulForm.mulWaferID = this.mulForm.mulWaferID.replace(/\n/g, ',').replace(/\r\n/g, ',').replace(/\r/g, ',')
        window.open(process.env.BASE_API + `/xpCotDeliver/mulFindExport?mulWaferId=${this.mulForm.mulWaferID}&columnEn=${colEn}&columnCn=${colCn}`)
        this.mulForm.mulWaferID = this.mulForm.mulWaferID.replace(/,/g, '\n')
      } else {
        window.open(process.env.BASE_API + `/xpCotDeliver/export?batchNo=${this.searchKeys.LotNo}&timeType=${this.timeRadio}&productCode=${this.searchKeys.cpdm}&categoryId=${this.searchKeys.tclx}&machineCot=${this.searchKeys.cotjt}&machineWy=${this.searchKeys.wyjt}&startTime=${startTime}&endTime=${endTime}&waferNo=${this.searchKeys.WaferNo}&pattern=${this.searchKeys.tplx}&measure=${this.searchKeys.cc}&columnEn=${colEn}&columnCn=${colCn}`)
      }
    },
    ExportBinStatis() {
      let colCn = 'BIN;数量;百分比'
      this.binTitle.map(item => {
        colCn += ';' + item.thName
      })
      this.binWafers = this.binWafers.replace(/\n/g, ',').replace(/\r\n/g, ',').replace(/\r/g, ',')
      window.open(process.env.BASE_API + `/xpSectionSet/exportBinStatis?waferIds=${this.binWafers}&binName=${this.binName}&binVer=${this.binVer}&pattern=${this.pattern}&columnCn=${colCn}`)
      this.binWafers = this.binWafers.replace(/,/g, '\n')
    },
    sortChange(data) {
      if (data.order === 'ascending') {
        this.sortRule = 'ASC' // 升
      } else if (data.order === 'descending') {
        this.sortRule = 'DESC' // 降
      } else {
        this.sortRule = ''
      }
      if (data.prop === null) {
        this.sortField = ''
      } else {
        this.sortField = data.prop
      }
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      this.isMulFind = false
      const params = {
        sortField: this.sortField,
        sortRule: this.sortRule,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        batchNo: this.searchKeys.LotNo,
        waferNo: this.searchKeys.WaferNo,
        waferId: this.searchKeys.wyph,
        pattern: this.searchKeys.tplx,
        measure: this.searchKeys.cc,
        machineWy: this.searchKeys.wyjt,
        machineCot: this.searchKeys.cotjt,
        categoryId: this.searchKeys.tclx,
        productCode: this.searchKeys.cpdm,
        // waferId: this.pageSize,
        timeType: this.timeRadio,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      getList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 解析区间设置
    getSetValue(title) {
      this.sectionset.minval = ''
      this.sectionset.maxval = ''
      this.sectionset.interval = ''
      this.sectionList.splice(0, this.sectionList.length)
      const params = {
        param: title
      }
      sectionGet(params).then(res => {
        if (res.code === 0 && res.data !== null) {
          var strs = res.data.split(',')
          for (var i = 0, ilen = strs.length; i < ilen; i++) {
            this.sectionList.push({ sectionValue: strs[i] })
          }
        }
      })
    },

    // vf1设置
    vf1Set() {
      this.SectionSetDialogVisible = true
      this.setTitle = 'vf1'
      this.getSetValue(this.setTitle)
    },
    // lop设置
    lopSet() {
      this.SectionSetDialogVisible = true
      this.setTitle = 'lop'
      this.getSetValue(this.setTitle)
    },
    // ir设置
    irSet() {
      this.SectionSetDialogVisible = true
      this.setTitle = 'ir'
      this.getSetValue(this.setTitle)
    },
    // wld1设置
    wld1Set() {
      this.SectionSetDialogVisible = true
      this.setTitle = 'wld1'
      this.getSetValue(this.setTitle)
    },
    // 得到各参数的区间分布数据
    getsectionValue(param) {
      const params1 = {
        param: param,
        waferId: this.selectedRow[0].waferNo
      }
      getSectionStatis(params1).then(res => {
        if (res.code === 0 && res.data !== null) {
          res.data.map(item => {
            item.start = item.start === -99999 ? '-∞' : item.start
            item.end = item.end === 99999 ? '+∞' : item.end
            item.percent = item.percent.toFixed(2) + '%'
          })
          if (param === 'vf1') {
            this.vf1SectionList = res.data
          } else if (param === 'ir') {
            this.irSectionList = res.data
          } else if (param === 'lop') {
            this.lopSectionList = res.data
          } else if (param === 'wld1') {
            this.wld1SectionList = res.data
          }
        }
        if (param === 'vf1') {
          this.vf1listLoading = false
        } else if (param === 'ir') {
          this.irlistLoading = false
        } else if (param === 'lop') {
          this.loplistLoading = false
        } else if (param === 'wld1') {
          this.wld1listLoading = false
        }
      })
    },
    // 得到Bin分布
    getSingleBinValue() {
      const params1 = {
        waferId: this.selectedRow[0].waferNo
      }
      getSingleBinStatis(params1).then(res => {
        if (res.code === 0 && res.data !== null) {
          res.data.map(item => {
            item.start = item.start.toFixed(0)
            item.percent = item.percent.toFixed(2) + '%'
            switch (item.type) {
              case 0: item.type = '正常'
                break
              case 1: item.type = '专案'
                break
              case 2: item.type = '混合'
                break
              case 3: item.type = '坏点'
                break
              case 5: item.type = 'AOI'
                break
              default:item.type = '未知'
            }
          })
          this.binList = res.data
          this.binLoading = false
        } else {
          this.binLoading = false
        }
      })
    },
    // 区间分布
    SectionStatisClick() {
      if (this.selectedRow.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择WaferID!'
        })
        return
      }
      if (this.selectedRow.length > 1) {
        this.$message({
          type: 'error',
          message: '区间分布只能选择一个WaferID!'
        })
        return
      }
      this.SectionDialogVisible = true
      this.vf1listLoading = true
      this.irlistLoading = true
      this.loplistLoading = true
      this.wld1listLoading = true
      this.binLoading = true
      this.getsectionValue('vf1')
      this.getsectionValue('ir')
      this.getsectionValue('lop')
      this.getsectionValue('wld1')
      this.getSingleBinValue()
    },
    // BIN分布
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
    cellClick(row, column, cell, event) {
      if (column.className === 'el-table-column--selection') {
        this.$refs.runTable.toggleRowSelection([{ row: row, selected: true }])
      }
    },
    BinStatisClick() {
      this.binList = []
      if (this.selectedNum === 0) {
        this.$message({
          type: 'error',
          message: '请选择WaferID!'
        })
        return false
      }
      var binName = ''
      var binver = ''
      var pattern = ''
      var wafers = ''
      for (let i = 0, ilen = this.selectedRow.length; i < ilen; i++) {
        if (i === 0) {
          binName = this.selectedRow[0].binName
          binver = this.selectedRow[0].binVersion
          wafers = this.selectedRow[0].waferNo
          pattern = this.selectedRow[0].pattern
        } else {
          if (this.selectedRow[i].binName !== binName || this.selectedRow[i].binVersion !== binver ||
            this.selectedRow[i].pattern !== pattern) {
            this.$message({
              type: 'error',
              message: '选择的WaferID Bin表名称或版本或形状不一致!'
            })
            return false
          }
          wafers = wafers + ',' + this.selectedRow[i].waferNo
        }
      }
      this.BinDialogVisible = true
      this.binLoading = true
      this.binWafers = wafers
      this.binName = binName
      this.binVer = binver
      this.pattern = pattern
      const params = {
        binName: binName,
        binVer: binver,
        pattern: pattern,
        waferIds: wafers
      }
      getMulBinStatis(params).then(res => {
        if (res.code === 0 && res.data !== null) {
          this.binList = res.data
        }
        this.binLoading = false
      })
    },
    ShowBinTitle() {
      if (this.isShowTitle) {
        this.showBinTitle = []
        this.titleInfo = '显示'
        this.isShowTitle = false
      } else {
        this.showBinTitle = this.binTitle
        this.titleInfo = '隐藏'
        this.isShowTitle = true
      }
    },
    // 生产范围
    CreatSection() {
      if (!isNumber(this.sectionset.minval)) {
        this.$message({
          type: 'error',
          message: '最小值输入的不是数字!'
        })
        return
      }
      if (!isNumber(this.sectionset.maxval)) {
        this.$message({
          type: 'error',
          message: '最大值输入的不是数字!'
        })
        return
      }
      if (!isNumber(this.sectionset.interval)) {
        this.$message({
          type: 'error',
          message: '间隔值输入的不是数字!'
        })
        return
      }
      if (parseFloat(this.sectionset.minval) >= parseFloat(this.sectionset.maxval)) {
        this.$message({
          type: 'error',
          message: '最大值必须大于最小值!'
        })
        return
      }
      if ((parseFloat(this.sectionset.maxval) - parseFloat(this.sectionset.minval)) <= parseFloat(this.sectionset.interval)) {
        this.$message({
          type: 'error',
          message: '间隔值不能大于最大值与最小值的差值!'
        })
        return
      }
      this.sectionList.splice(0, this.sectionList.length)
      this.sectionList.push({ sectionValue: this.sectionset.minval })
      var curValue = this.sectionset.minval
      while (parseFloat(this.sectionset.maxval) > parseFloat(curValue) + parseFloat(this.sectionset.interval)) {
        curValue = parseFloat(curValue) + parseFloat(this.sectionset.interval)
        this.sectionList.push({ sectionValue: curValue.toFixed(2) })
      }
      if (curValue.toFixed(5) !== parseFloat(this.sectionset.maxval).toFixed(5)) {
        this.sectionList.push({ sectionValue: this.sectionset.maxval })
      }
    },
    // 插入
    handleInsert(row, index, num) {
      const insertData = {
        sectionValue: ''
      }
      this.sectionList.splice(index, 0, insertData)
    },
    // 删除
    handleDelete(index, num) {
      this.sectionList.splice(index, 1)
    },
    // 添加
    handlePush(index) {
      this.sectionList.push({ sectionValue: '' })
    },
    // 设置范围确定
    SectionSetOK() {
      var setValue = ''
      if (this.sectionList.length > 0) {
        var beforValue = this.sectionList[0].sectionValue
        if (!isNumber(beforValue)) {
          this.$message({
            type: 'error',
            message: '第1个值不是数字!'
          })
          return
        }
        setValue = beforValue
        for (var i = 1, len = this.sectionList.length; i < len; i++) {
          if (!isNumber(this.sectionList[i].sectionValue)) {
            this.$message({
              type: 'error',
              message: '第' + (i + 1) + '个值不是数字!'
            })
            return
          }
          if (parseFloat(this.sectionList[i].sectionValue) <= parseFloat(beforValue)) {
            this.$message({
              type: 'error',
              message: '第' + i + '个值不能大于等于 第' + (i + 1) + '个值!'
            })
            return
          }
          beforValue = this.sectionList[i].sectionValue
          setValue += ',' + beforValue
        }
      }
      if (this.setTitle === 'vf1') {
        this.vf1listLoading = true
      } else if (this.setTitle === 'ir') {
        this.irlistLoading = true
      } else if (this.setTitle === 'lop') {
        this.loplistLoading = true
      } else if (this.setTitle === 'wld1') {
        this.wld1listLoading = true
      }

      const params = {
        param: this.setTitle,
        value: setValue
      }
      sectionSet(params).then(res => {
        if (res.code === 0) {
          const params1 = {
            param: this.setTitle,
            waferId: this.selectWaferId
          }
          getSectionStatis(params1).then(res => {
            if (res.code === 0 && res.data !== null) {
              res.data.map(item => {
                item.start = item.start === -99999 ? '-∞' : item.start
                item.end = item.end === 99999 ? '+∞' : item.end
                item.percent = item.percent.toFixed(2) + '%'
              })
              if (this.setTitle === 'vf1') {
                this.vf1SectionList = res.data
              } else if (this.setTitle === 'ir') {
                this.irSectionList = res.data
              } else if (this.setTitle === 'lop') {
                this.lopSectionList = res.data
              } else if (this.setTitle === 'wld1') {
                this.wld1SectionList = res.data
              }
            }
            if (this.setTitle === 'vf1') {
              this.vf1listLoading = false
            } else if (this.setTitle === 'ir') {
              this.irlistLoading = false
            } else if (this.setTitle === 'lop') {
              this.loplistLoading = false
            } else if (this.setTitle === 'wld1') {
              this.wld1listLoading = false
            }
          })
        }
      })

      this.SectionSetDialogVisible = false
    },
    // 选择某一行
    handleCurrentChange(row) {
      this.selectWaferId = row.waferNo
    },
    // 选择多行
    selectionChange(data) {
      this.selectedNum = data.length
      this.selectedRow = data
    },
    // 批量查询
    mulSearchClick() {
      this.dialogVisible = true
    },
    resetForm(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 批量查询
    mulWaferFind() {
      this.listLoading = true
      this.isMulFind = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        mulWaferId: this.mulForm.mulWaferID
      }
      mulFind(params).then(res => {
        res.data.list.map((item) => {
          if (item.unFind === 0) {
            item.inBin = item.inBin + '%'
            item.blend = item.blend + '%'
            item.special = item.special + '%'
            item.nogood = item.nogood + '%'
            item.baddot = item.baddot + '%'
            item.vf1Yield = item.vf1Yield + '%'
            item.vf3Yield = item.vf3Yield + '%'
            item.vf4Yield = item.vf4Yield + '%'
            item.vzYield = item.vzYield + '%'
            item.wlp1Yield = item.wlp1Yield + '%'
            item.wld1Yield = item.wld1Yield + '%'
            item.thyristorYield = item.thyristorYield + '%'
            item.productYield = item.productYield + '%'
            item.ivYield = item.ivYield + '%'
            item.irYield = item.irYield + '%'
            item.irEsdYield = item.irEsdYield + '%'
            item.compreYield = item.compreYield + '%'
            item.lopCorrect = item.isJiaozheng === 0 ? item.lopCorrect : item.lopCorrect + '(1)'
          }
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        this.dialogVisible = false
      })
    },
    // 批量查询提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.mulWaferFind()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClose() {
      this.SectionDialogVisible = false
      this.SectionSetDialogVisible = false
      this.BinDialogVisible = false
    },
    // 批量下载
    mulDownFile() {
      if (this.list.length === 0) {
        this.$message({
          type: 'error',
          message: '列表中尚未数据，请查询后再下载!'
        })
      }
      let wafers = this.list[0].waferNo
      for (let i = 1, ilen = this.list.length; i < ilen; i++) {
        wafers += ',' + this.list[i].waferNo
      }
      console.log(wafers)
      window.open(process.env.BASE_API + `/xpCotDeliver/mulDown?wafers=${wafers}`)
    },
    tableRowClassColor({ row, column, rowIndex, columnIndex }) {
      if (!row.discolorList) {
        return 'background: #fff'
      }
      for (let i = 0, ilen = row.discolorList.length; i < ilen; i++) {
        console.log(this.formThead.findIndex(_ => _.thKey === row.discolorList[i]))
        if (row.discolorList[i] && columnIndex === (this.formThead.findIndex(_ => _.thKey === row.discolorList[i]) + 4)) {
          console.log(rowIndex)
          return 'background: #FA4632; color: #fff'
        } else {
          return 'background: #fff'
        }
      }
    }
  }
}

