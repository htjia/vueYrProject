
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { machineList, findProductCode, findSubstrateMeasureList, findCategoryList, getCowList, findMachinList, mulFind } from '@/api/chipManage/rearSiteManage/cowInfo'
import { downByPath } from '@/api/chipManage/rearSiteManage/inciseOverSite'
import { fetchColorList } from '@/api/processManagement/proceCardManage'
import { getElectrode } from '@/api/chipManage/pcTipOut'
import { craftList } from '@/api/processManagement/proceCardManage'
import { findModelList } from '@/api/chipManage/rearSiteManage/tensileTest'
import $ from 'jquery'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      selectTheadVisble: false,
      downFileVisble: false,
      isMulFind: false,
      activeTabIndex: 0,
      list: [],
      fileList: [],
      userOptions: [],
      colorList: [],
      electrodeList: [],
      substrateFindOptions: [],
      substrateMeasureList: [],
      craftOptions: [],
      machineList: [],
      productCodeList: [],
      modelList: [],
      categoryList: [],
      cowMachineList: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      timeRadio: 0,
      sortRule: '',
      sortField: '',
      beginDate: new Date(new Date().toLocaleDateString()).getTime(),
      endDate: new Date().getTime(),
      control: false,
      defaultFormThead: [],
      formThead: [],
      theadOptions: [
        { thName: '测试时间', thKey: 'testTime', thWidth: 150 },
        { thName: 'IV均值', thKey: 'avgIv', thWidth: 100 },
        { thName: 'VF1均值', thKey: 'avgVf1', thWidth: 100 },
        { thName: 'VF1_ESD_A均值', thKey: 'vf1EsdAvg', thWidth: 150 },
        { thName: 'VF1_ESD差值', thKey: 'vf1EsdDiffer', thWidth: 130 },
        { thName: 'VZ均值', thKey: 'avgVz', thWidth: 80 },
        { thName: '蓝移', thKey: 'blueShift', thWidth: 80 },
        { thName: 'K值', thKey: 'valk', thWidth: 80 },
        { thName: 'ESD去坏(200V)', thKey: 'esd200', thWidth: 140 },
        { thName: 'ESD去坏(400V)', thKey: 'esd400', thWidth: 140 },
        { thName: 'ESD去坏(50V)', thKey: 'esd50', thWidth: 140 },
        { thName: 'ESD去坏(500V)', thKey: 'esd500', thWidth: 140 },
        { thName: 'ESD去坏(300V)', thKey: 'esd300', thWidth: 140 },
        { thName: 'ESD去坏(人体1000)', thKey: 'esd1000', thWidth: 170 },
        { thName: 'ESD去坏(人体2000)', thKey: 'esd2000', thWidth: 170 },
        { thName: 'ESD去坏(人体4000)', thKey: 'esd4000', thWidth: 170 },
        { thName: 'Thyristor良率', thKey: 'yieldThyristor', thWidth: 150 },
        { thName: 'Thyristor坏点数', thKey: 'numThyristor', thWidth: 170 },
        { thName: 'DVF均值', thKey: 'avgDvf', thWidth: 100 },
        { thName: '综合良率', thKey: 'yieldZh', thWidth: 100 },
        { thName: 'VF1良率', thKey: 'yieldVf1', thWidth: 100 },
        { thName: 'VF3良率', thKey: 'yieldVf3', thWidth: 100 },
        { thName: 'WLD1良率', thKey: 'yieldWld1', thWidth: 100 },
        { thName: 'IR良率', thKey: 'yieldIr', thWidth: 100 },
        { thName: 'VZ良率', thKey: 'yieldVz', thWidth: 100 },
        { thName: 'IV良率', thKey: 'yieldIv', thWidth: 100 },
        { thName: 'VF4良率', thKey: 'yieldVf4', thWidth: 100 },
        { thName: 'VF2均值', thKey: 'avgVf2', thWidth: 100 },
        { thName: 'VF3均值', thKey: 'avgVf3', thWidth: 100 },
        { thName: 'VF4均值', thKey: 'avgVf4', thWidth: 100 },
        { thName: 'WLD1均值', thKey: 'avgWld1', thWidth: 100 },
        { thName: 'WLD1_STD', thKey: 'wld1Std', thWidth: 120 },
        { thName: 'WLP1均值', thKey: 'avgWlp1', thWidth: 100 },
        { thName: 'HW1', thKey: 'hw1', thWidth: 100 },
        { thName: 'WLD2均值', thKey: 'avgWld2', thWidth: 100 },
        { thName: 'WLD2_STD', thKey: 'wld2Std', thWidth: 120 },
        { thName: 'HW2', thKey: 'hw2', thWidth: 100 },
        { thName: 'wlp2均值', thKey: 'avgWlp2', thWidth: 100 },
        { thName: 'IR均值', thKey: 'avgIr', thWidth: 100 },
        { thName: 'PL_WP', thKey: 'plWp', thWidth: 100 },
        { thName: 'PL_WD', thKey: 'plWd', thWidth: 100 },
        { thName: 'PL_WD_STD', thKey: 'plWdStd', thWidth: 120 },
        { thName: 'PL.I.I', thKey: 'plIi', thWidth: 120 },
        { thName: '总数', thKey: 'total', thWidth: 100 },
        { thName: '坏点数', thKey: 'bad', thWidth: 100 },
        { thName: '导入时间', thKey: 'importTime', thWidth: 150 },
        { thName: '机台', thKey: 'machine', thWidth: 80 },
        { thName: 'IR坏点坐标', thKey: 'irBadPoint', thWidth: 110 },
        { thName: '控制片', thKey: 'isControl', thWidth: 100 },
        { thName: 'Size', thKey: 'size', thWidth: 100 },
        { thName: '异常备注', thKey: 'abnormalRemarks', thWidth: 100 },
        { thName: 'IR_ESD_A良率', thKey: 'yieldIrEsdA', thWidth: 130 },
        { thName: 'VF1_ESD良率', thKey: 'yieldVf1Esd', thWidth: 120 }
      ],
      formTheadOptions: [
        '测试时间',
        'IV均值',
        'VF1均值',
        'VF1_ESD_A均值',
        'VF1_ESD差值',
        'VZ均值',
        '蓝移',
        'K值',
        'ESD去坏(200V)',
        'ESD去坏(400V)',
        'ESD去坏(50V)',
        'ESD去坏(500V)',
        'ESD去坏(300V)',
        'ESD去坏(人体1000)',
        'ESD去坏(人体2000)',
        'ESD去坏(人体4000)',
        'Thyristor良率',
        'Thyristor坏点数',
        'DVF均值',
        '综合良率',
        'VF1良率',
        'VF3良率',
        'WLD1良率',
        'IR良率',
        'VZ良率',
        'IV良率',
        'VF4良率',
        'VF2均值',
        'VF3均值',
        'VF4均值',
        'WLD1均值',
        'WLD1_STD',
        'WLP1均值',
        'HW1',
        'WLD2均值',
        'WLD2_STD',
        'HW2',
        'wlp2均值',
        'IR均值',
        'PL_WP',
        'PL_WD',
        'PL_WD_STD',
        'PL.I.I',
        '总数',
        '坏点数',
        '导入时间',
        '机台',
        'IR坏点坐标',
        '控制片',
        'Size',
        '异常备注',
        'IR_ESD_A良率',
        'VF1_ESD良率'
      ],
      checkboxVal: [
        '测试时间',
        'IV均值',
        'VF1均值',
        'VF1_ESD_A均值',
        'VF1_ESD差值',
        'VZ均值',
        '蓝移',
        'K值',
        'ESD去坏(200V)',
        'ESD去坏(400V)',
        'ESD去坏(50V)',
        'ESD去坏(500V)',
        'ESD去坏(300V)',
        'ESD去坏(人体1000)',
        'ESD去坏(人体2000)',
        'ESD去坏(人体4000)',
        'Thyristor良率',
        'Thyristor坏点数',
        'DVF均值',
        '综合良率',
        'VF1良率',
        'VF3良率',
        'WLD1良率',
        'IR良率',
        'VZ良率',
        'IV良率',
        'VF4良率',
        'VF2均值',
        'VF3均值',
        'VF4均值',
        'WLD1均值',
        'WLD1_STD',
        'WLP1均值',
        'HW1',
        'WLD2均值',
        'WLD2_STD',
        'HW2',
        'wlp2均值',
        'IR均值',
        'PL_WP',
        'PL_WD',
        'PL_WD_STD',
        'PL.I.I',
        '总数',
        '坏点数',
        '导入时间',
        '机台',
        'IR坏点坐标',
        '控制片',
        'Size',
        '异常备注',
        'IR_ESD_A良率',
        'VF1_ESD良率'
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
        wyjt: [],
        cpdm: [],
        gs: [],
        bx: [],
        gy: [],
        dj: [],
        cslx: [],
        WaferNo: '',
        cc: '',
        cowjt: [],
        pdjg: ''
      },
      processCardOptions: [
        { name: 1, id: 1 }
      ],
      resultOptions: [
        { name: '未判定', id: 0 },
        { name: 'YES', id: 1 },
        { name: 'NO', id: 2 }
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
      mulWaferID: '',
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
    this.findCategoryListFun()
    this.findMachinListFun()
    this.getColorList()
    this.getElectrodeList()
    this.getCraftList()
    this.findModelListFun()
    this.formThead = this.theadOptions
    this.checkboxVal = localStorage.getItem('cowHeaders') === null ? this.formTheadOptions : localStorage.getItem('cowHeaders').split(',')
    this.setThead(this.checkboxVal)
    setTimeout(() => {
      $('.el-date-picker__editor-wrap:last-child input').attr('placeholder', '时间')
    }, 500)
  },
  methods: {
    // 型号
    findModelListFun() {
      findModelList({}).then(res => {
        this.modelList = res.data
      })
    },
    // 获取光色
    getColorList() {
      fetchColorList({}).then(res => {
        this.colorList = res.data
      })
    },
    // 获取电极
    getElectrodeList() {
      getElectrode({}).then(res => {
        this.electrodeList = res.data
      })
    },
    // 所有工艺
    getCraftList() {
      const requestParams = {
        pageSize: 1000,
        pageNum: 1
      }
      craftList(requestParams).then(res => {
        this.craftOptions = res.data.list
      })
    },
    cellStyle(data) {
      if (data.row.colorFields) {
        for (const item of data.row.colorFields) {
          if (data.column.property === item) {
            return { background: '#F56C6C !important', color: '#fff' }
          }
        }
      }
    },
    exportExcel() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      const isControl = this.control ? 1 : 0
      const colCnArr = []
      const colEnArr = []
      this.formThead.map(item => {
        colCnArr.push(item.thName)
        colEnArr.push(item.thKey)
      })
      colCnArr.unshift('判定结果,测试类型,批次号,WaferID')
      colEnArr.unshift('decisionResults,testType,lotNo,waferNo')
      const colCn = colCnArr.join(',')
      const colEn = colEnArr.join(',')
      let exportUrl = ''
      if (this.isMulFind) {
        this.mulWaferID = this.mulWaferID.replace(/\n/g, ',').replace(/\r\n/g, ',').replace(/\r/g, ',')
        exportUrl = `/xp-cow-test/mulFindExport?mulWaferId=${this.mulWaferID}&columnEn=${colEn}&columnCn=${colCn}`
        this.mulWaferID = this.mulWaferID.replace(/,/g, '\n')
      } else if (this.timeRadio === 0) {
        exportUrl = `/xp-cow-test/export-data?lotNo=${this.searchKeys.LotNo}&isControl=${isControl}&editionType=${this.searchKeys.bx.join(',')}&color=${this.searchKeys.gs.join(',')}&craft=${this.searchKeys.gy.join(',')}&cowMachineCode=${this.searchKeys.cowjt.join(',')}&electrode=${this.searchKeys.dj.join(',')}&size=${this.searchKeys.cc}&waferNo=${this.searchKeys.WaferNo}&decisionResults=${this.searchKeys.pdjg}&testType=${this.searchKeys.cslx.join(',')}&wyMachineId=${this.searchKeys.wyjt.join(',')}&productCode=${this.searchKeys.cpdm.join(',')}&importTimeStart=${startTime}&importTimeEnd=${endTime}&colCn=${colCn}&colEn=${colEn}`
      } else {
        exportUrl = `/xp-cow-test/export-data?lotNo=${this.searchKeys.LotNo}&isControl=${isControl}&editionType=${this.searchKeys.bx.join(',')}&color=${this.searchKeys.gs.join(',')}&craft=${this.searchKeys.gy.join(',')}&cowMachineCode=${this.searchKeys.cowjt.join(',')}&electrode=${this.searchKeys.dj.join(',')}&size=${this.searchKeys.cc}&waferNo=${this.searchKeys.WaferNo}&decisionResults=${this.searchKeys.pdjg}&testType=${this.searchKeys.cslx.join(',')}&wyMachineId=${this.searchKeys.wyjt.join(',')}&productCode=${this.searchKeys.cpdm.join(',')}&testTimeStart=${startTime}&testTimeEnd=${endTime}&colCn=${colCn}&colEn=${colEn}`
      }
      console.log(exportUrl)
      window.open(process.env.BASE_API + exportUrl)
    },
    downLoadFile(url) {
      if (url === null) {
        this.$message({
          type: 'error',
          message: '附件不存在!'
        })
        return false
      }
      downByPath({ path: url }).then(res => {
        window.open(process.env.BASE_API + '/attachment/downByPath?path=' + url)
      })
    },
    downLoad(row) {
      this.fileList = row.files
      this.downFileVisble = true
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
    // 获取cow机台
    findMachinListFun() {
      const params = {
        pageNum: 1,
        pageSize: 1000,
        siteId: 20
      }
      findMachinList(params).then(res => {
        this.cowMachineList = res.data.list
      })
    },
    // 测试类型
    findCategoryListFun() {
      findCategoryList({}).then(res => {
        this.categoryList = res.data
      })
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
      localStorage.setItem('cowHeaders', this.checkboxVal)
      this.formThead = arr
      this.selectTheadVisble = false
    },
    resetOption() {
      this.selectTheadVisble = false
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
    // labelHead(h, { column, index }) {
    //   // const l = column.label.length
    //   // const f = 30 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
    //   column.minWidth = 190 // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
    //   // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
    //   return h('div', { class: 'table-head', style: { width: '100%'  }}, [column.label])
    // },
    labelHead(h, { column, index }) {
      const l = column.label.length
      const f = 12 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.minWidth = l < 6 ? 100 : f * l // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      if (column.label.includes('时')) {
        column.width = 150
      }
      if (column.label.includes('坐标')) {
        column.width = 280
      }
      // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h('div', { class: 'table-head', style: { width: '100%' }}, [column.label])
    },
    // 重置
    clearSearch() {
      this.searchKeys.LotNo = ''
      this.searchKeys.wyjt = []
      this.searchKeys.cpdm = []
      this.searchKeys.gs = []
      this.searchKeys.bx = []
      this.searchKeys.gy = []
      this.searchKeys.dj = []
      this.searchKeys.cslx = []
      this.searchKeys.WaferNo = ''
      this.searchKeys.cc = ''
      this.searchKeys.cowjt = []
      this.searchKeys.pdjg = ''
      this.beginDate = new Date(new Date().toLocaleDateString()).getTime()
      this.endDate = new Date().getTime()
      this.handleSearch()
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    tabClick(index) {
      this.activeTabIndex = index
    },
    // 每页数量改变
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
    toLowerLine(str) {
      var temp = str.replace(/[A-Z]/g, function(match) {
        return '_' + match.toLowerCase()
      })
      if (temp.slice(0, 1) === '_') { // 如果首字母是大写，执行replace时会多一个_，这里需要去掉
        temp = temp.slice(1)
      }
      return temp
    },
    sortChange(data) {
      console.log(data)
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
        this.sortField = this.toLowerLine(data.prop)
        if (data.prop === 'esd200') {
          this.sortField = 'esd_200'
        }
        if (data.prop === 'esd400') {
          this.sortField = 'esd_400'
        }
        if (data.prop === 'esd50') {
          this.sortField = 'esd_50'
        }
        if (data.prop === 'esd500') {
          this.sortField = 'esd_500'
        }
        if (data.prop === 'esd300') {
          this.sortField = 'esd_300'
        }
        if (data.prop === 'esd1000') {
          this.sortField = 'esd_1000'
        }
        if (data.prop === 'esd2000') {
          this.sortField = 'esd_2000'
        }
        if (data.prop === 'esd4000') {
          this.sortField = 'esd_4000'
        }
      }
      this.fetchData()
      console.log(data.prop)
      console.log(this.sortField)
    },
    // 查询
    fetchData() {
      this.isMulFind = false
      this.listLoading = true
      const params = {
        sortField: this.sortField,
        sortRule: this.sortRule,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        lotNo: this.searchKeys.LotNo,
        wyMachineId: this.searchKeys.wyjt.join(','),
        productCode: this.searchKeys.cpdm.join(','),
        testType: this.searchKeys.cslx.join(','),
        decisionResults: this.searchKeys.pdjg,
        waferNo: this.searchKeys.WaferNo,
        size: this.searchKeys.cc,
        cowMachineCode: this.searchKeys.cowjt.join(','),
        isControl: this.control ? 1 : 0,
        electrode: this.searchKeys.dj.join(','),
        craft: this.searchKeys.gy.join(','),
        color: this.searchKeys.gs.join(','),
        editionType: this.searchKeys.bx.join(',')
      }
      if (this.timeRadio === 0) {
        params.importTimeStart = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
        params.importTimeEnd = this.endDate === '' ? '' : this.formatDate(this.endDate)
      } else {
        params.testTimeStart = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
        params.testTimeEnd = this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      getCowList(params).then(res => {
        res.data.list.map(item => {
          item.isControl = item.isControl === 0 ? '否' : '是'
          item.esd200 = item.esd200 === null ? '' : item.esd200.toFixed(2) + '%'
          item.esd400 = item.esd400 === null ? '' : item.esd400.toFixed(2) + '%'
          item.esd50 = item.esd50 === null ? '' : item.esd50.toFixed(2) + '%'
          item.esd500 = item.esd500 === null ? '' : item.esd500.toFixed(2) + '%'
          item.esd300 = item.esd300 === null ? '' : item.esd300.toFixed(2) + '%'
          item.esd1000 = item.esd1000 === null ? '' : item.esd1000.toFixed(2) + '%'
          item.esd2000 = item.esd2000 === null ? '' : item.esd2000.toFixed(2) + '%'
          item.esd4000 = item.esd4000 === null ? '' : item.esd4000.toFixed(2) + '%'
          item.yieldThyristor = item.yieldThyristor === null ? '' : item.yieldThyristor.toFixed(2) + '%'
          item.yieldZh = item.yieldZh === null ? '' : item.yieldZh.toFixed(2) + '%'
          item.yieldVf1 = item.yieldVf1 === null ? '' : item.yieldVf1.toFixed(2) + '%'
          item.yieldVf3 = item.yieldVf3 === null ? '' : item.yieldVf3.toFixed(2) + '%'
          item.yieldWld1 = item.yieldWld1 === null ? '' : item.yieldWld1.toFixed(2) + '%'
          item.yieldVf4 = item.yieldVf4 === null ? '' : item.yieldVf4.toFixed(2) + '%'
          item.yieldIr = item.yieldIr === null ? '' : item.yieldIr.toFixed(2) + '%'
          item.yieldIv = item.yieldIv === null ? '' : item.yieldIv.toFixed(2) + '%'
          item.yieldVz = item.yieldVz === null ? '' : item.yieldVz.toFixed(2) + '%'
          item.yieldIrEsdA = item.yieldIrEsdA === null ? '' : item.yieldIrEsdA.toFixed(2) + '%'
          item.yieldVf1Esd = item.yieldVf1Esd === null ? '' : item.yieldVf1Esd.toFixed(2) + '%'
          item.avgIv = item.avgIv === null ? '' : item.avgIv.toFixed(2)
          item.avgVf1 = item.avgVf1 === null ? '' : item.avgVf1.toFixed(3)
          item.avgVf2 = item.avgVf2 === null ? '' : item.avgVf2.toFixed(3)
          item.avgVf3 = item.avgVf3 === null ? '' : item.avgVf3.toFixed(3)
          item.avgVf4 = item.avgVf4 === null ? '' : item.avgVf4.toFixed(3)
          item.avgVz = item.avgVz === null ? '' : item.avgVz.toFixed(2)
          item.valk = item.valk === null ? '' : item.valk.toFixed(2)
          item.avgWld1 = item.avgWld1 === null ? '' : item.avgWld1.toFixed(2)
          item.wld1Std = item.wld1Std === null ? '' : item.wld1Std.toFixed(2)
          item.avgWlp1 = item.avgWlp1 === null ? '' : item.avgWlp1.toFixed(2)
          item.hw1 = item.hw1 === null ? '' : item.hw1.toFixed(2)
          item.avgWld2 = item.avgWld2 === null ? '' : item.avgWld2.toFixed(2)
          item.wld2Std = item.wld2Std === null ? '' : item.wld2Std.toFixed(2)
          item.hw2 = item.hw2 === null ? '' : item.hw2.toFixed(2)
          item.avgWlp2 = item.avgWlp2 === null ? '' : item.avgWlp2.toFixed(2)
          item.plWp = item.plWp === null ? '' : item.plWp.toFixed(2)
          item.plWd = item.plWd === null ? '' : item.plWd.toFixed(2)
          item.plIi = item.plIi === null ? '' : item.plIi.toFixed(2)
          item.avgDvf = item.avgDvf === null ? '' : item.avgDvf.toFixed(4)
          item.avgIr = item.avgIr === null ? '' : item.avgIr.toFixed(4)
        })
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
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 批量查询弹出界面
    mulSearchClick() {
      this.dialogVisible = true
    },
    // 批量查询
    mulWaferFind() {
      this.isMulFind = true
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        mulWaferId: this.mulWaferID
      }
      mulFind(params).then(res => {
        res.data.list.map(item => {
          item.isControl = item.isControl === 0 ? '否' : '是'
          item.esd200 = item.esd200 === null ? '' : item.esd200.toFixed(2) + '%'
          item.esd400 = item.esd400 === null ? '' : item.esd400.toFixed(2) + '%'
          item.esd50 = item.esd50 === null ? '' : item.esd50.toFixed(2) + '%'
          item.esd500 = item.esd500 === null ? '' : item.esd500.toFixed(2) + '%'
          item.esd300 = item.esd300 === null ? '' : item.esd300.toFixed(2) + '%'
          item.esd1000 = item.esd1000 === null ? '' : item.esd1000.toFixed(2) + '%'
          item.esd2000 = item.esd2000 === null ? '' : item.esd2000.toFixed(2) + '%'
          item.esd4000 = item.esd4000 === null ? '' : item.esd4000.toFixed(2) + '%'
          item.yieldThyristor = item.yieldThyristor === null ? '' : item.yieldThyristor.toFixed(2) + '%'
          item.yieldZh = item.yieldZh === null ? '' : item.yieldZh.toFixed(2) + '%'
          item.yieldVf1 = item.yieldVf1 === null ? '' : item.yieldVf1.toFixed(2) + '%'
          item.yieldVf3 = item.yieldVf3 === null ? '' : item.yieldVf3.toFixed(2) + '%'
          item.yieldWld1 = item.yieldWld1 === null ? '' : item.yieldWld1.toFixed(2) + '%'
          item.yieldVf4 = item.yieldVf4 === null ? '' : item.yieldVf4.toFixed(2) + '%'
          item.yieldIr = item.yieldIr === null ? '' : item.yieldIr.toFixed(2) + '%'
          item.yieldIv = item.yieldIv === null ? '' : item.yieldIv.toFixed(2) + '%'
          item.yieldVz = item.yieldVz === null ? '' : item.yieldVz.toFixed(2) + '%'
          item.yieldIrEsdA = item.yieldIrEsdA === null ? '' : item.yieldIrEsdA.toFixed(2) + '%'
          item.yieldVf1Esd = item.yieldVf1Esd === null ? '' : item.yieldVf1Esd.toFixed(2) + '%'
          item.avgIv = item.avgIv === null ? '' : item.avgIv.toFixed(2)
          item.avgVf1 = item.avgVf1 === null ? '' : item.avgVf1.toFixed(3)
          item.avgVf2 = item.avgVf2 === null ? '' : item.avgVf2.toFixed(3)
          item.avgVf3 = item.avgVf3 === null ? '' : item.avgVf3.toFixed(3)
          item.avgVf4 = item.avgVf4 === null ? '' : item.avgVf4.toFixed(3)
          item.avgVz = item.avgVz === null ? '' : item.avgVz.toFixed(2)
          item.valk = item.valk === null ? '' : item.valk.toFixed(2)
          item.avgWld1 = item.avgWld1 === null ? '' : item.avgWld1.toFixed(2)
          item.wld1Std = item.wld1Std === null ? '' : item.wld1Std.toFixed(2)
          item.avgWlp1 = item.avgWlp1 === null ? '' : item.avgWlp1.toFixed(2)
          item.hw1 = item.hw1 === null ? '' : item.hw1.toFixed(2)
          item.avgWld2 = item.avgWld2 === null ? '' : item.avgWld2.toFixed(2)
          item.wld2Std = item.wld2Std === null ? '' : item.wld2Std.toFixed(2)
          item.hw2 = item.hw2 === null ? '' : item.hw2.toFixed(2)
          item.avgWlp2 = item.avgWlp2 === null ? '' : item.avgWlp2.toFixed(2)
          item.plWp = item.plWp === null ? '' : item.plWp.toFixed(2)
          item.plWd = item.plWd === null ? '' : item.plWd.toFixed(2)
          item.plIi = item.plIi === null ? '' : item.plIi.toFixed(2)
          item.avgDvf = item.avgDvf === null ? '' : item.avgDvf.toFixed(4)
          item.avgIr = item.avgIr === null ? '' : item.avgIr.toFixed(4)
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
          this.mulWaferID = this.mulForm.mulWaferID
          this.mulWaferFind()
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
      window.open(process.env.BASE_API + `/xp-cow-test/mulDown?wafers=${wafers}`)
    }
  }
}

