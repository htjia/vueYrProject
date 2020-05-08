
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { wyList, mocvdList, matfindList, furnacefindAll, cdfindList } from '@/api/extensionManage/extensionReport/extensionReport'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      selectTheadVisble: false,
      notBastic: false,
      list: [],
      defaultFormThead: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      beginDate: this.getSevenFormatDate(),
      endDate: this.getNowFormatDates(),
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
      mocvdLists: [],
      machineOptions: [],
      furnaceOptions: [],
      runId: '',
      machineValue: [],
      furnaceValue: [],
      mocvdValue: [],
      cdfindListOption: [],
      cdValue: [],
      orderkey: '',
      ordersc: '',
      titleValue: {}
    }
  },
  mounted() {
    this.fetchData()
    this.matfindList()
    this.furnacefindAll()
    this.cdfindList()
    this.mocvdList()
  },
  methods: {
    getNowFormatDate() {
      var today = new Date()
      return this.formatDate(today.getTime())
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
    cdfindList() {
      cdfindList().then(res => {
        this.cdfindListOption = res.data
      })
    },
    matfindList() {
      matfindList().then(res => {
        this.machineOptions = res.data
      })
    },
    furnacefindAll() {
      const params = {
        pageNum: 1,
        pageSize: 10000000
      }
      furnacefindAll(params).then(res => {
        this.furnaceOptions = res.data.list
      })
    },
    mocvdList() {
      mocvdList().then(res => {
        this.mocvdLists = res.data
      })
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
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
      this.beginDate = this.getSevenFormatDate()
      this.endDate = this.getNowFormatDates()
      this.runId = ''
      this.machineValue = []
      this.mocvdValue = []
      this.furnaceValue = []
      this.cdValue = []
      this.pageNum = 1
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        runId: this.runId,
        machineId: this.machineValue.join(),
        measureId: this.cdValue.join(),
        platterNo: this.mocvdValue.join(),
        stoveId: this.furnaceValue.join(),
        sortField: this.orderkey,
        sortRule: this.ordersc
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      wyList(requestParams).then(res => {
        this.titleValue = res.data.titieList
        this.list = res.data.pageInfo.list
        this.totalPage = parseInt(res.data.pageInfo.total)
        this.listLoading = false
      })
    },
    importExcel() {
      var startTime = this.formatDate(this.beginDate)
      var endTime = this.formatDate(this.endDate)
      if (this.beginDate === '') {
        startTime = ''
      }
      if (this.endDate === '') {
        endTime = ''
      }
      window.open(process.env.BASE_API + '/wyQuery/exportExcel?startTime=' + startTime + '&endTime=' +
      endTime + '&runId=' + this.runId + '&machineId=' + this.machineValue + '&measureId=' +
      this.cdValue + '&platterNo=' + this.mocvdValue + '&stoveId=' + this.furnaceValue, '_blank')
    },
    getSort({ column, prop, order }) {
      console.log(column, prop, order)
      // this.list = []
      this.orderkey = prop === null ? '' : prop
      this.ordersc = order === 'ascending' ? 'asc' : (order === 'descending' ? 'desc' : '')
      this.fetchData()
    },
    DYrenderHeader(h, { column, $index }, index) {
      if (this.titleValue.length > 0) {
        if (column.label === 'WD') {
          console.log(column.order)
          return [h('p', {}, ['WD']), h('p', {}, [this.titleValue[0].wd]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === '5nm') {
          return [h('p', {}, ['5nm']), h('p', {}, [this.titleValue[0]['5nm']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === '8nm') {
          return [h('p', {}, ['8nm']), h('p', {}, [this.titleValue[0]['8nm']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'STD') {
          return [h('p', {}, ['STD']), h('p', {}, [this.titleValue[0]['std']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'STD>2') {
          return [h('p', {}, ['STD>2']), h('p', {}, [this.titleValue[0]['std2']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === '>P30') {
          return [h('p', {}, ['>P30']), h('p', {}, [this.titleValue[0]['p30']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === '目检降档') {
          return [h('p', {}, ['目检降档']), h('p', {}, [this.titleValue[0]['p50']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'R') {
          return [h('p', {}, ['R']), h('p', {}, [this.titleValue[0]['R']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'I.I') {
          return [h('p', {}, ['I.I']), h('p', {}, [this.titleValue[0]['ii']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'Thick') {
          return [h('p', {}, ['Thick']), h('p', {}, [this.titleValue[0]['Thick']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'Bow') {
          return [h('p', {}, ['Bow']), h('p', {}, [this.titleValue[0]['BOW']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'PERIOD') {
          return [h('p', {}, ['PERIOD']), h('p', {}, [this.titleValue[0]['period']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'Al%') {
          return [h('p', {}, ['Al%']), h('p', {}, [this.titleValue[0]['AI']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'XRD_002') {
          return [h('p', {}, ['XRD_002']), h('p', {}, [this.titleValue[0]['XRD_002']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'XRD_102') {
          return [h('p', {}, ['XRD_102']), h('p', {}, [this.titleValue[0]['XRD_102']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'EL') {
          return [h('p', {}, ['EL']), h('p', {}, [this.titleValue[0]['EL']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'EL_VF4') {
          return [h('p', {}, ['EL_VF4']), h('p', {}, [this.titleValue[0]['EL_VF4']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 12px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 19px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        } else if (column.label === 'Size') {
          return [h('p', { style: 'margin-top: 25px' }, ['Size']), h('p', {}, [this.titleValue[0]['size']]),
            h('i', { class: 'el-icon-caret-top', style: 'position: absolute;top: 22px;right: 5px;color:' + (column.order === 'ascending' ? '#009494' : '#C0C4CC') + ';' }),
            h('i', { class: 'el-icon-caret-bottom', style: 'position: absolute;top: 29px;right: 5px;color:' + (column.order === 'descending' ? '#009494' : '#C0C4CC') + ';' })]
        }
      }
      // if (this.resetData.stting_params.length >= $index) {
      //   const name = this.resetData.stting_params[$index - 1].var_cn_name
      //   const value = name.split('br')
      //   return [h('p', {}, [value[0]]), h('p', {}, [value[1]])]
      // } else {
      //   return [h('p', {}, ['']), h('p', {}, [''])]
      // }
    }
  }
}

