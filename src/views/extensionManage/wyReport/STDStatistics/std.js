
import PageHeaderLayout from '@/components/PageHeaderLayout'
import { queryAll, findProduceType, findSubstrateType } from '@/api/extensionManage/wyReport/STDStatistics'
import { machineList } from '@/api/extensionManage/wyBasicInfoManage/mocvdInfo' // 机台查询
export default {
  components: { PageHeaderLayout },
  data() {
    return {
      listLoading: false,
      notBastic: false,
      list: [],
      machineList: [],
      produceTypeList: [],
      substrateType: [],
      searchKey: {
        sclx: '',
        jt: '',
        cdgy: ''
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
    this.fetchData()
    this.findProduceTypeFun()
    this.findSubstrateTypeFun()
    this.findMachineList()
  },
  methods: {
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
    clearAll() {
      this.pageSize = 15
      this.searchKey.sclx = ''
      this.searchKey.cdgy = ''
      this.searchKey.jt = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearch()
    },
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
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        productType: this.searchKey.sclx,
        substrateId: this.searchKey.cdgy,
        machineId: this.searchKey.jt
      }
      queryAll(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    exportAll() {
      console.log(12123)
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/wyReportController/stdGreaterThan4Export?productType=${this.searchKey.sclx}&substrateId=${this.searchKey.cdgy}&machineId=${this.searchKey.jt}&startTime=${startTime}&endTime=${endTime}`)
    }
  }
}

