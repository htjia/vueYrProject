
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { matfindList, getRunList, furnacefindAll, getWaferInfo, save, reset, findResetList } from '@/api/processEvents'
export default {
  filters: {
    valueFilter(value) {
      if (value !== null) {
        value = value + ''
        if (value === '0') {
          return ''
        } else {
          return value
        }
      } else {
        return ''
      }
    }
  },
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      selectTheadVisble: false,
      resetDialogVisable: false,
      notBastic: false,
      list: [],
      resetList: [],
      defaultFormThead: [],
      // checkboxVal: defaultFormThead,
      checkboxVal: [
        '导入时间',
        '镭刻号'
      ],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      beginDate: this.getNowFormatDates(),
      endDate: this.getSevenFormatDate(),
      multipleSelection: [],
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
      isActive: 0,
      currentId: '',
      machineOptions: [],
      furnaceOptions: [],
      machineValue: [],
      furnaceValue: [],
      runId: '',
      waferTol: 0,
      rowInfo: null,
      anotherpageSize: 9999999,
      anotherpageNum: 1,
      anothertotalPage: 0,
      orderkey: '',
      ordersc: '',
      anotherlist: [],
      labelList: []
    }
  },
  mounted() {
    this.beginDate = this.getSevenFormatDate()
    this.endDate = this.getNowFormatDates()
    this.matfindList()
    this.furnacefindAll()
  },
  methods: {
    getNowFormatDates() {
      var today = new Date()
      return today
    },
    getSevenFormatDate() {
      var today = new Date()
      var SevenDayAgo = today - 86400 * 6 * 1000
      return SevenDayAgo
    },
    matfindList() {
      matfindList().then(res => {
        this.machineOptions = res.data
        this.fetchData()
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
    // Run信息/Wafer信息切换
    navClick(index) {
      this.isActive = index
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    tableRowClassColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'background: #fff'
      }
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
      this.pageSize = 12
      this.runId = ''
      this.machineValue = []
      this.furnaceValue = []
      this.beginDate = this.getSevenFormatDate()
      this.endDate = this.getNowFormatDates()
      this.handleSearch()
    },
    handleExport() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/wyCraftEvent/export?runId=${this.runId}&machineId=${this.machineValue.join()}&stoveCode=${this.furnaceValue.join()}&startTime=${startTime}&endTime=${endTime}`)
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
        stoveCode: this.furnaceValue.join(),
        sortField: this.orderkey,
        sortRule: this.ordersc
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      getRunList(requestParams).then(res => {
        this.list = []
        this.anotherlist = []
        this.waferTol = 0
        for (let i = 0; i < res.data.list.length; i++) {
          res.data.list[i].isChecked = false
          this.list.push(res.data.list[i])
        }
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        if (this.list.length > 0) {
          this.$refs.listTabel.setCurrentRow(this.list[0])
        }
      })
    },
    // 添加
    handleAdd() {
      this.siteForm.siteType = ''
      this.siteForm.siteName = ''
      this.siteForm.siteStatus = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 单击Run信息
    handleCurrentChange(row) {
      // this.selectbillNo = row.machineCode
      if (row === null) {
        return
      }
      this.rowInfo = row
      this.anotherlist = []
      this.anotherpageSize = 1
      this.anotherpageNum = 12
      this.findInfo()
    },
    // 双击Run信息
    cellDblclick(row, column, cell, event) {
      this.isActive = 1
      this.rowInfo = row
      this.anotherlist = []
      this.anotherpageSize = 1
      this.anotherpageNum = 12
      this.findInfo()
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    findInfo() {
      const requestParams = {
        runId: this.rowInfo.run_id,
        pageSize: 100000,
        pageNum: 1
      }
      getWaferInfo(requestParams).then(res => {
        this.anotherlist = res.data.pageInfo.list
        this.waferTol = res.data.pageInfo.total
        this.labelList = res.data.label
      })
    },
    handleEdit(row) {
      row.isChecked = true
    },
    cancelt(row) {
      this.fetchData()
    },
    handleSave(row) {
      if ((row.gysj === null || row.gysj.trim().length === 0) && (row.sbsj === null || row.sbsj.trim().length === 0) && (row.jl === null || row.jl.trim().length === 0)) {
        this.$message({
          type: 'error',
          message: '设备事件、工艺事件和结论不能全部为空!'
        })
        return
      }
      // if (row.sbsj.trim().length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '工艺事件不能为空!'
      //   })
      //   return
      // }
      const requestParams = {
        craft: this.rowInfo.gysj,
        equipment: this.rowInfo.sbsj,
        id: this.rowInfo.id,
        runId: this.rowInfo.runNum_id,
        reasult: this.rowInfo.jl
      }
      save(requestParams).then(res => {
        if (res.code === 0) {
          row.isChecked = false
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.fetchData()
        }
      })
    },
    getSort({ column, prop, order }) {
      console.log(column, prop, order)
      // this.list = []
      this.orderkey = prop === null ? '' : prop
      this.ordersc = order === 'ascending' ? 'asc' : (order === 'descending' ? 'desc' : '')
      this.fetchData()
    },
    handleReset() {
      let ids = ''
      if (this.multipleSelection.length > 0) {
        let flag = false
        const lists = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].id !== this.resetList[i].id) {
            flag = true
            break
          }
          lists.push(this.multipleSelection[i].id)
        }
        if (flag || this.multipleSelection[0].id !== this.resetList[0].id) {
          this.$message({
            type: 'error',
            message: '请从第一行开始选择连续RunID!'
          })
          return
        }
        ids = lists.join()
      }
      this.$confirm('是否确定重置PM炉次?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestParams = {
          runId: this.rowInfo.runNum_id,
          ids: ids
        }
        reset(requestParams).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
            this.resetDialogVisable = false
            this.fetchData()
          }
        })
      })
    },
    openReset(row) {
      this.rowInfo = row
      this.resetDialogVisable = true
      this.multipleSelection = []
      this.resetList = []
      const requestParams = {
        runId: this.rowInfo.run_id
      }
      findResetList(requestParams).then(res => {
        this.resetList = res.data
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      for (const item of this.resetList) {
        for (const items of val) {
          if (item.id === items.id) {
            this.multipleSelection.push(item)
            break
          }
        }
      }
    }
  }
}

