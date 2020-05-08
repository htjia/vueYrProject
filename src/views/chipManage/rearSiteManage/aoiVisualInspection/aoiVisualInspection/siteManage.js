
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findProductCode, findMachinList } from '@/api/chipManage/rearSiteManage/cowInfo'
import { getList, downByPath } from '@/api/chipManage/rearSiteManage/aoiVisualInspection'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      selectTheadVisble: false,
      downFileVisble: false,
      activeTabIndex: 0,
      list: [],
      fileList: [],
      userOptions: [],
      productCodeList: [],
      cowMachineList: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      timeRadio: '0',
      beginDate: '',
      endDate: '',
      control: false,
      defaultFormThead: [],
      formThead: [],
      theadOptions: [
        { thName: '产品代码', thKey: 'products' },
        { thName: '机台编号', thKey: 'machineId' },
        { thName: '检测开始时间', thKey: 'inspStartTime' },
        { thName: '检测结束时间', thKey: 'inspEndTime' },
        { thName: 'AOI扫描总颗粒', thKey: 'aoiTotalDies' },
        { thName: 'AOI扫描OK颗粒', thKey: 'aoiOkDies' },
        { thName: 'AOI扫描NG颗粒', thKey: 'aoiNgDies' },
        { thName: 'AOI扫描OK颗粒(去除点测NG)', thKey: 'noAoiOkDies' },
        { thName: 'AOI扫描NG颗粒(去除点测NG)', thKey: 'noAoiNgDies' },
        { thName: 'AOI扫描OK颗粒(去除点测NG)/点测OK颗粒', thKey: 'noAoiYield' },
        { thName: '点测良率', thKey: 'probeTestYield' },
        { thName: '点测总颗粒', thKey: 'probeTotalDies' },
        { thName: '点测OK颗粒数', thKey: 'probeOkDies' },
        { thName: '点测NG颗数', thKey: 'probeNgDies' },
        { thName: 'AOI扫描OK颗粒/点测总颗粒数', thKey: 'aoiYieldProbe' },
        { thName: 'AOI扫描OK颗粒/AOI总颗粒数', thKey: 'aoiWaferYield' },
        { thName: 'AOI定位不良率', thKey: 'noneProbePercentage' },
        { thName: '整合良率{AOIOK颗粒数（去除电性NG）/点测总颗粒}', thKey: 'combineWafeYield' },
        { thName: '双胞', thKey: 'doubleDies' },
        { thName: '双胞不良率', thKey: 'doubleDiesYield' },
        { thName: '切割不良等严重瑕疵', thKey: 'crackDies' },
        { thName: '切割不良等严重瑕疵不良率', thKey: 'crackDiesYield' },
        { thName: '第一区（切割道）', thKey: 'region1Defect' },
        { thName: '第一区（切割道）不良率', thKey: 'region1DefectYield' },
        { thName: '第二区（P电极）', thKey: 'region2Defect' },
        { thName: '第二区（P电极）不良率', thKey: 'region2DefectYield' },
        { thName: '第三区（N电极）', thKey: 'region3Defect' },
        { thName: '第三区（N电极）不良率', thKey: 'region3DefectYield' },
        { thName: '第四区（发光区）', thKey: 'region4Defect' },
        { thName: '第四区（发光区）不良率', thKey: 'region4DefectYield' },
        { thName: '第五区（Finger）', thKey: 'region5Defect' },
        { thName: '第五区（Finger）不良率', thKey: 'region5DefectYield' },
        { thName: '第六区（Measa）', thKey: 'region6Defect' },
        { thName: '第六区（Measa）不良率', thKey: 'region6DefectYield' },
        { thName: '第七区（P电极外圈）', thKey: 'region7Defect' },
        { thName: '第七区（P电极外圈）不良率', thKey: 'region7DefectYield' }
      ],
      formTheadOptions: [
        '产品代码',
        '机台编号',
        '检测开始时间',
        '检测结束时间',
        'AOI扫描总颗粒',
        'AOI扫描OK颗粒',
        'AOI扫描NG颗粒',
        'AOI扫描OK颗粒(去除点测NG)',
        'AOI扫描NG颗粒(去除点测NG)',
        'AOI扫描OK颗粒(去除点测NG)/点测OK颗粒',
        '点测良率',
        '点测总颗粒',
        '点测OK颗粒数',
        '点测NG颗数',
        'AOI扫描OK颗粒/点测总颗粒数',
        'AOI扫描OK颗粒/AOI总颗粒数',
        'AOI定位不良率',
        '整合良率{AOIOK颗粒数（去除电性NG）/点测总颗粒}',
        '双胞',
        '双胞不良率',
        '切割不良等严重瑕疵',
        '切割不良等严重瑕疵不良率',
        '第一区（切割道）',
        '第一区（切割道）不良率',
        '第二区（P电极）',
        '第二区（P电极）不良率',
        '第三区（N电极）',
        '第三区（N电极）不良率',
        '第四区（发光区）',
        '第四区（发光区）不良率',
        '第五区（Finger）',
        '第五区（Finger）不良率',
        '第六区（Measa）',
        '第六区（Measa）不良率',
        '第七区（P电极外圈）',
        '第七区（P电极外圈）不良率'
      ],
      checkboxVal: [
        '产品代码',
        '机台编号',
        '检测开始时间',
        '检测结束时间',
        'AOI扫描总颗粒',
        'AOI扫描OK颗粒',
        'AOI扫描NG颗粒',
        'AOI扫描OK颗粒(去除点测NG)',
        'AOI扫描NG颗粒(去除点测NG)',
        'AOI扫描OK颗粒(去除点测NG)/点测OK颗粒',
        '点测良率',
        '点测总颗粒',
        '点测OK颗粒数',
        '点测NG颗数',
        'AOI扫描OK颗粒/点测总颗粒数',
        'AOI扫描OK颗粒/AOI总颗粒数',
        'AOI定位不良率',
        '整合良率{AOIOK颗粒数（去除电性NG）/点测总颗粒}',
        '双胞',
        '双胞不良率',
        '切割不良等严重瑕疵',
        '切割不良等严重瑕疵不良率',
        '第一区（切割道）',
        '第一区（切割道）不良率',
        '第二区（P电极）',
        '第二区（P电极）不良率',
        '第三区（N电极）',
        '第三区（N电极）不良率',
        '第四区（发光区）',
        '第四区（发光区）不良率',
        '第五区（Finger）',
        '第五区（Finger）不良率',
        '第六区（Measa）',
        '第六区（Measa）不良率',
        '第七区（P电极外圈）',
        '第七区（P电极外圈）不良率'
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
        ph: '',
        cpdm: '',
        jth: '',
        status: ''
      },
      statusOptions: [
        { name: '待AOI', id: 0 },
        { name: '已检验', id: 1 }
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
      }
    }
  },
  mounted() {
    this.fetchData()
    this.findProductCodeFun()
    this.findMachinListFun()
    this.formThead = this.theadOptions
    this.checkboxVal = localStorage.getItem('aoHeaders') === null ? this.formTheadOptions : localStorage.getItem('aoHeaders').split(',')
    this.setThead(this.checkboxVal)
  },
  methods: {
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
      this.fileList = row.filePaths
      this.downFileVisble = true
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
    labelHead(h, { column, index }) {
      const l = column.label.length
      const f = 16 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.minWidth = l < 7 ? 120 : f * l // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h('div', { class: 'table-head', style: { width: '100%' }}, [column.label])
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
      localStorage.setItem('aoHeaders', this.checkboxVal)
      this.formThead = arr
      this.selectTheadVisble = false
    },
    resetOption() {
      this.selectTheadVisble = false
    },
    // 获取产品代码
    findProductCodeFun() {
      findProductCode({}).then(res => {
        this.productCodeList = res.data
      })
    },
    // 获取cow机台
    findMachinListFun() {
      const params = {
        pageNum: 1,
        pageSize: 1000
      }
      findMachinList(params).then(res => {
        this.cowMachineList = res.data.list
      })
    },
    // 重置
    clearSearch() {
      this.searchKeys.ph = ''
      this.searchKeys.cpdm = ''
      this.searchKeys.jth = ''
      this.searchKeys.status = ''
      this.beginDate = ''
      this.endDate = ''
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
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
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
    exportExcel() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      const colCnArr = []
      const colEnArr = []
      this.formThead.map(item => {
        colCnArr.push(item.thName)
        colEnArr.push(item.thKey)
      })
      colCnArr.unshift('状态,片号')
      colEnArr.unshift('status,waferNo')
      const colCn = colCnArr.join(',')
      const colEn = colEnArr.join(',')
      console.log(colCn)
      console.log(colEn)
      window.open(process.env.BASE_API + `/xp-aoi/export-data?waferNo=${this.searchKeys.ph}&products=${this.searchKeys.cpdm}&machineId=${this.searchKeys.jth}&status=${this.searchKeys.status}&startTime=${startTime}&endTime=${endTime}&colEn=${colEn}`)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        waferNo: this.searchKeys.ph,
        products: this.searchKeys.cpdm,
        machineId: this.searchKeys.jth,
        status: this.searchKeys.status,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      getList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    }
  }
}

