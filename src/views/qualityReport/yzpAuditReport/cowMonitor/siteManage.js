
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { productList } from '@/api/chipManage/abnormalManage/reworkManage'
import { substrateFindList } from '@/api/extensionManage/synthesizeJudgment/synthesizeJudgment'
import { selectAll } from '@/api/baobiao/cowMonitor'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateCode = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('请输入卡塞名称'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      platterCircleVisble: false,
      addDialogVisible: false,
      editDialogVisible: false,
      caseChecked: true,
      layer: '',
      list: [],
      caseList: [],
      platterList: [],
      platterCircleList: [],
      beginDate: this.getSevenFormatDate(),
      endDate: this.getNowFormatDates(),
      sizeType: '',
      substrateFindOptions: [],
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
      caseName: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      searchName: '',
      caseForm: {
        caseName: '',
        layer: ''
      },
      rules: {
        caseName: [{ required: true, validator: validateCode, trigger: 'blur' }],
        layer: [{ required: true, message: '请输入卡塞层数', trigger: 'blur' }]
      },
      model: '',
      productLists: [],
      currentId: ''
    }
  },
  mounted() {
    this.substrateFindList()
    this.productList()
    this.fetchData()
  },
  methods: {
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    getNowFormatDates() {
      var today = new Date()
      return today
    },
    getSevenFormatDate() {
      var today = new Date()
      var SevenDayAgo = today - 86400 * 6 * 1000
      return SevenDayAgo
    },
    substrateFindList() {
      substrateFindList().then(res => {
        this.substrateFindOptions = res.data
      })
    },
    importExcel() {
      let cos = ''
      if (this.model !== '' && this.model !== null) {
        const sed = this.model.split('-')[0]
        cos = sed.substring(0, sed.length - 1)
      }
      window.open(process.env.BASE_API + '/xpCowDataMonitoring/export?startTime=' + this.formatDate(this.beginDate) + '&endTime=' + this.formatDate(this.endDate) + '&productCode=' + cos + '&size=' + ((this.sizeType === '' || this.sizeType === null) ? '' : this.sizeType.substring(0, 1)), '_blank')
    },
    productList() {
      productList().then(res => {
        this.productLists = res.data
      })
    },
    clearAll() {
      this.beginDate = this.getSevenFormatDate()
      this.endDate = this.getNowFormatDates()
      this.model = ''
      this.sizeType = ''
      this.pageNum = 1
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
      this.fetchData()
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      let cos = ''
      if (this.model !== '' && this.model !== null) {
        const sed = this.model.split('-')[0]
        cos = sed.substring(0, sed.length - 1)
      }
      const params = {
        productCode: cos,
        size: (this.sizeType === '' || this.sizeType === null) ? '' : this.sizeType.substring(0, 1),
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      selectAll(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    }
  }
}

