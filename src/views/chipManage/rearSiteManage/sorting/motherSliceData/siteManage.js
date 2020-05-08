
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findPrint, findBinNo, findMachineList } from '@/api/chipManage/rearSiteManage/sorting/motherSliceData'
import Cookies from 'js-cookie'
const furnaceList = [
  {
    thName: 'WaferID',
    thKey: 'waferNo',
    width: 220
  },
  {
    thName: '状态',
    thKey: 'status',
    width: 90
  },
  {
    thName: '方片信息',
    thKey: 'mother',
    width: 100
  },
  {
    thName: '分选机台',
    thKey: 'machine',
    width: 100
  },
  {
    thName: '开始时间',
    thKey: 'startTime',
    width: 150
  },
  {
    thName: '结束时间',
    thKey: 'endTime',
    width: 150
  },
  {
    thName: '分选抓取数量',
    thKey: 'bondCount',
    width: 100
  },
  {
    thName: '分选扫描数量',
    thKey: 'sortCount',
    width: 100
  },
  {
    thName: 'COT测试数量',
    thKey: 'cotTestcount',
    width: 100
  },
  {
    thName: 'COT扫描数量',
    thKey: 'cotScancount',
    width: 100
  },
  {
    thName: '分选率',
    thKey: 'sortRate',
    width: 90
  },
  {
    thName: '合档率',
    thKey: 'packRate',
    width: 90
  },
  {
    thName: '尺寸',
    thKey: 'measure',
    width: 100
  },
  {
    thName: '文档详细',
    thKey: 'info',
    width: 100
  }
]
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      activeTabIndex: 0,
      searchName: '',
      list: [],
      userOptions: [],
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
      },
      selectTheadVisble: false,
      formThead: furnaceList,
      theadOptions: furnaceList,
      formTheadOptions: furnaceList,
      checkboxVal: furnaceList,
      statusList: [
        {
          id: 0,
          name: '分选中'
        },
        {
          id: 1,
          name: '分选完成'
        }
      ],
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      waferNo: '',
      machine: '',
      status: '',
      machineList: [],
      motherList: []
    }
  },
  mounted() {
    const motherNo = Cookies.get('motherNo')
    if (motherNo !== null && motherNo !== '' && motherNo !== undefined) {
      this.waferNo = motherNo
      Cookies.remove('motherNo')
    }
    var checkboxValmotherdata = localStorage.getItem('checkboxValmotherdata')
    if (checkboxValmotherdata !== null && checkboxValmotherdata !== undefined) {
      this.formThead = JSON.parse(checkboxValmotherdata)
      const arr = []
      this.theadOptions.map((item) => {
        this.formThead.map((val) => {
          if (item.thName === val.thName) {
            arr.push(item)
          }
        })
      })
      this.checkboxVal = arr
    }
    this.fetchData()
    this.findMachineList()
  },
  methods: {
    findMachineList() {
      findMachineList().then(res => {
        this.machineList = res.data.list
      })
    },
    selectThead() {
      this.selectTheadVisble = !this.selectTheadVisble
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    submitOption() {
      const arr = []
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val.thName) {
            arr.push(item)
          }
        })
      })
      this.formThead = arr
      localStorage.setItem('checkboxValmotherdata', JSON.stringify(arr))
      this.selectTheadVisble = false
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
    clearSearch() {
      this.beginDate = ''
      this.endDate = ''
      this.waferNo = ''
      this.machine = ''
      this.status = ''
      this.pageNum = 1
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        waferNo: this.waferNo,
        machine: this.machine,
        status: this.status
      }
      findPrint(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    findMather(row) {
      this.addDialogVisible = true
      const params = {
        binNo: row.waferNo
      }
      findBinNo(params).then(res => {
        this.motherList = res.data
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '已分选颗粒总数'
          return
        }
        if (index === 2) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ''
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    openUrl(row) {
      Cookies.set('fpNo', row.binNo)
      this.$router.push({ path: '/sorting/lowerBinData' })
    },
    download(row) {
      window.open(process.env.BASE_API + `/attachment/downByPath?path=${row.filePath}`, '_blank')
    },
    importExcel() {
      let columnEn = ''
      let columnCn = ''
      for (const item of this.formThead) {
        if (item.thName !== '方片信息' && item.thName !== '文档详细') {
          if (columnCn === '') {
            columnCn = item.thName
          } else {
            columnCn = columnCn + ';' + item.thName
          }
          if (columnEn === '') {
            columnEn = item.thKey
          } else {
            columnEn = columnEn + ',' + item.thKey
          }
        }
      }
      if (columnCn === '') {
        this.$message({
          type: 'error',
          message: '显示列为空!'
        })
        return
      }
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/xpBinMather/export?startTime=${startTime}&endTime=${endTime}&waferNo=${this.waferNo}&machine=${this.machine}&status=${this.status}&columnCn=${columnCn}&columnEn=${columnEn}`, '_blank')
    }
  }
}

