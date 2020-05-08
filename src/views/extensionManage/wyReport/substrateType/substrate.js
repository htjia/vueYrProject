
import PageHeaderLayout from '@/components/PageHeaderLayout'
import { queryList, findSupplier } from '@/api/extensionManage/wyReport/substrateType'
import { machineList } from '@/api/extensionManage/wyBasicInfoManage/mocvdInfo' // 机台查询
export default {
  components: { PageHeaderLayout },
  data() {
    return {
      listLoading: false,
      list: [],
      supplier: [],
      theadData: [],
      month: this.getFormatDate(),
      machine: [],
      machineList: []
    }
  },
  mounted() {
    this.fetchData()
    this.findMachineList()
    this.findSupplierFun()
  },
  methods: {
    // 机台查询
    findMachineList() {
      machineList().then(res => {
        this.machineList = res.data
      })
    },
    // 厂家查询
    findSupplierFun() {
      findSupplier().then(res => {
        res.data.map(item => {
          this.theadData.push({
            thName: item,
            thKey: item.toLowerCase()
          })
        })
      })
    },
    getFormatDate() {
      var date = new Date()
      var month = date.getMonth() + 1
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      var currentDate = date.getFullYear() + '-' + month
      return currentDate
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
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
        month: this.month,
        machineId: this.machine.join(',')
      }
      queryList(requestParams).then(res => {
        this.list = res.data
        this.listLoading = false
      })
    },
    exportAll() {
      window.open(process.env.BASE_API + `/wyReportController/exportSubstrate?month=${this.month}&machineId=${this.machine.join(',')}`)
    }
  }
}

