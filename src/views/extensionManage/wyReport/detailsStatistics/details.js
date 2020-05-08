
import PageHeaderLayout from '@/components/PageHeaderLayout'
import { queryList, platterList, stoveFind, selectConfigList, insertDetailConfig, updateDetailConfig, deleteDetailConfig, updateSequence } from '@/api/extensionManage/wyReport/detailsStatistics'
import { machineList } from '@/api/extensionManage/wyBasicInfoManage/mocvdInfo' // 机台查询
import Sortable from 'sortablejs'
export default {
  components: { PageHeaderLayout },
  data() {
    return {
      listLoading: false,
      isVisual: false,
      addDialogVisible: false,
      tableKey: 0,
      configTableType: 0,
      list: [],
      configList: [],
      tableType: [
        { id: 0, name: 'Std' },
        { id: 1, name: '波长' },
        { id: 2, name: '等级' },
        { id: 3, name: '目检' },
        { id: 4, name: 'PL_II' },
        { id: 5, name: 'PL_THICK' },
        { id: 6, name: 'COW_IV' },
        { id: 7, name: 'COW_VF1' },
        { id: 8, name: 'COW_ESD200' },
        { id: 9, name: 'COW_ESD400' }
      ],
      searchKey: {
        runId: '',
        platterNo: '',
        jt: '',
        lch: ''
      },
      machineList: [],
      platterList: [],
      tableColunms: [],
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      isActive: 0,
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
      stoveList: []
    }
  },
  mounted() {
    this.fetchData()
    this.setTableColunms()
    this.platterListFun()
    this.stoveFindFun()
    this.findMachineList()
  },
  methods: {
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.padding-dialog .el-table__body-wrapper tbody')
      console.log(tbody)
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.configList.splice(oldIndex, 1)[0]
          _this.configList.splice(newIndex, 0, currRow)
          if (newIndex !== oldIndex) {
            _this.updateSequenceFun()
          }
        }
      })
    },
    updateSequenceFun() {
      const param = []
      this.configList.map((item, index) => {
        param.push({
          sequence: index,
          id: item.id
        })
      })
      updateSequence(param).then(res => {
        this.$message({
          type: 'success',
          message: '顺序调整成功!'
        })
      })
    },
    // 大盘查询
    platterListFun() {
      platterList().then(res => {
        this.platterList = res.data
      })
    },
    // 炉次查询
    stoveFindFun() {
      stoveFind().then(res => {
        this.stoveList = res.data
      })
    },
    // 机台查询
    findMachineList() {
      machineList().then(res => {
        this.machineList = res.data
      })
    },
    // 机台查询
    findSelectConfigList() {
      selectConfigList({ type: this.configTableType }).then(res => {
        res.data.map(item => {
          item['isEdit'] = false
        })
        this.configList = res.data
        this.rowDrop()
      })
    },
    cellStyle(row) {
      let styles = ''
      switch (row.columnIndex) {
        case 2 : styles = `background: ${row.row.color1}`
          break
        case 3 : styles = `background: ${row.row.color2}`
          break
        case 4 : styles = `background: ${row.row.color3}`
          break
        case 5 : styles = `background: ${row.row.color4}`
          break
        case 6 : styles = `background: ${row.row.color5}`
          break
        case 7 : styles = `background: ${row.row.color6}`
          break
        case 8 : styles = `background: ${row.row.color7}`
          break
        case 9 : styles = `background: ${row.row.color8}`
          break
        case 10 : styles = `background: ${row.row.color9}`
          break
        case 11 : styles = `background: ${row.row.color10}`
          break
        case 12 : styles = `background: ${row.row.color11}`
          break
        case 13 : styles = `background: ${row.row.color12}`
          break
        case 14 : styles = `background: ${row.row.color13}`
          break
        case 15 : styles = `background: ${row.row.color14}`
          break
        case 16 : styles = `background: ${row.row.color15}`
          break
        case 17 : styles = `background: ${row.row.color16}`
          break
        case 18 : styles = `background: ${row.row.color17}`
          break
        case 19 : styles = `background: ${row.row.color18}`
          break
        case 20 : styles = `background: ${row.row.color19}`
          break
        case 21 : styles = `background: ${row.row.color20}`
          break
        case 22 : styles = `background: ${row.row.color21}`
          break
        case 23 : styles = `background: ${row.row.color22}`
          break
        case 24 : styles = `background: ${row.row.color23}`
          break
        case 25 : styles = `background: ${row.row.color24}`
          break
        case 26 : styles = `background: ${row.row.color25}`
          break
        case 27 : styles = `background: ${row.row.color26}`
          break
        case 28 : styles = `background: ${row.row.color27}`
          break
        case 29 : styles = `background: ${row.row.color28}`
          break
        case 30 : styles = `background: ${row.row.color29}`
          break
        case 31 : styles = `background: ${row.row.color30}`
          break
        case 32 : styles = `background: ${row.row.color31}`
          break
        case 33 : styles = `background: ${row.row.color32}`
          break
        case 34 : styles = `background: ${row.row.color33}`
          break
        case 35 : styles = `background: ${row.row.color34}`
          break
        case 36 : styles = `background: ${row.row.color34}`
          break
        case 37 : styles = `background: ${row.row.color36}`
          break
        case 38 : styles = `background: ${row.row.color37}`
          break
        case 39 : styles = `background: ${row.row.color38}`
          break
        case 40 : styles = `background: ${row.row.color39}`
          break
        case 41 : styles = `background: ${row.row.color40}`
          break
        case 42 : styles = `background: ${row.row.color41}`
          break
        case 43 : styles = `background: ${row.row.color42}`
          break
        case 44 : styles = `background: ${row.row.color43}`
          break
        case 45 : styles = `background: ${row.row.color44}`
          break
        case 46 : styles = `background: ${row.row.color45}`
          break
        case 47 : styles = `background: ${row.row.color46}`
          break
        case 48 : styles = `background: ${row.row.color47}`
          break
        case 49 : styles = `background: ${row.row.color48}`
          break
        case 50 : styles = `background: ${row.row.color49}`
          break
        case 51 : styles = `background: ${row.row.color50}`
          break
        case 52 : styles = `background: ${row.row.color51}`
          break
        case 53 : styles = `background: ${row.row.color52}`
          break
        case 54 : styles = `background: ${row.row.color53}`
          break
        case 55 : styles = `background: ${row.row.color54}`
          break
      }
      return styles
    },
    setTableColunms() {
      for (let i = 1; i <= 54; i++) {
        this.tableColunms.push({
          thName: i.toString(),
          thKey: 'column' + i,
          inventoryKey: 'inventoryValue' + i
        })
      }
      console.log(this.tableColunms)
    },
    navClick(index) {
      this.isActive = index
      this.fetchData()
    },
    configClose() {
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
    // 配置
    handleConfig() {
      this.addDialogVisible = true
      this.findSelectConfigList()
    },
    tableTypeChange(tableType) {
      this.findSelectConfigList()
      if (tableType === 2 || tableType === 3) {
        this.isVisual = true
      } else {
        this.isVisual = false
      }
    },
    // 新增配置
    addNewConfig() {
      this.configList.push({
        isEdit: true,
        minVal: '',
        maxVal: '',
        color: '#009494',
        sequence: this.configList.length,
        id: 0
      })
      console.log(this.configList)
      const _this = this
      setTimeout(function() {
        _this.$refs.newfac.bodyWrapper.scrollTop = _this.$refs.newfac.bodyWrapper.scrollHeight + 40
      }, 100)
    },
    handleEdit(row) {
      row.isEdit = true
    },
    insertDetailConfigFun(row) {
      const params = {
        sequence: row.sequence,
        color: row.color,
        fieldType: this.configTableType
      }
      if (this.configTableType === 2) {
        params['judgementLevel'] = row.judgementLevel
      }
      if (this.configTableType === 3) {
        params['visualId'] = row.visualId
      }
      if (this.configTableType !== 2 && this.configTableType !== 3) {
        params['minVal'] = row.minVal
        params['maxVal'] = row.maxVal
      }
      insertDetailConfig(params).then(res => {
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.findSelectConfigList()
      })
    },
    editDetailConfigFun(row) {
      const params = {
        color: row.color,
        fieldType: this.configTableType,
        id: row.id
      }
      if (this.configTableType === 2) {
        params['judgementLevel'] = row.judgementLevel
      }
      if (this.configTableType === 3) {
        params['visualId'] = row.visualId
      }
      if (this.configTableType !== 2 && this.configTableType !== 3) {
        params['minVal'] = row.minVal
        params['maxVal'] = row.maxVal
      }
      updateDetailConfig(params).then(res => {
        this.$message({
          type: 'success',
          message: '编辑成功!'
        })
        this.findSelectConfigList()
      })
    },
    handleCancel() {
      this.findSelectConfigList()
    },
    handleSaveVisual(row) {
      row.isEdit = false
      this.insertDetailConfigFun(row)
    },
    handleSave(row) {
      if (parseFloat(row.minVal) > parseFloat(row.maxVal)) {
        this.$message({
          type: 'error',
          message: '下限值不能大于上限值!'
        })
        return
      }
      if (row.minVal.toString().trim().length === 0 || row.maxVal.toString().trim().length === 0) {
        this.$message({
          type: 'error',
          message: '上下限值不能为空!'
        })
        return
      }
      const min = []
      const max = []
      const minAndMax = []
      const notCurrentArr = []
      this.configList.map(item => {
        if (item.id !== row.id) {
          notCurrentArr.push(item)
          min.push(parseFloat(item.minVal))
          max.push(parseFloat(item.maxVal))
        }
        minAndMax.push(parseFloat(item.minVal) + '' + parseFloat(item.maxVal))
      })
      if (Array.from(new Set(minAndMax)).length !== this.configList.length) {
        this.$message({
          type: 'error',
          message: '上下限值不能存在交集!'
        })
        return
      }
      let flag = false
      notCurrentArr.map(item => {
        if (row.minVal > item.minVal && row.minVal < item.maxVal) {
          flag = true
        }
        if (row.maxVal > item.minVal && row.maxVal < item.maxVal) {
          flag = true
        }
        if (row.minVal === item.minVal && row.maxVal > item.maxVal) {
          flag = true
        }
        if (row.maxVal === item.maxVal && row.minVal < item.minVal) {
          flag = true
        }
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: '上下限值不能存在交集!'
        })
        return
      }
      // 已有最大组的最大 < 输入的最小值 < 已有最小组的最小
      // if (parseFloat(row.minVal) < Math.max.apply(null, max) && parseFloat(row.minVal) > Math.min.apply(null, min)) {
      //   this.$message({
      //     type: 'error',
      //     message: '上下限值不能存在交集!'
      //   })
      //   return
      // }
      // if (parseFloat(row.maxVal) < Math.max.apply(null, max) && parseFloat(row.maxVal) > Math.min.apply(null, min)) {
      //   this.$message({
      //     type: 'error',
      //     message: '上下限值不能存在交集!'
      //   })
      //   return
      // }
      if (row.id === 0) {
        this.insertDetailConfigFun(row)
      } else {
        this.editDetailConfigFun(row)
      }
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestParams = {
          id: row.id
        }
        if (row.id !== 0) {
          deleteDetailConfig(requestParams).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.findSelectConfigList()
          })
        } else {
          this.configList.splice(index, 1)
        }
      }).catch(() => {
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearAll() {
      this.pageSize = 12
      this.searchKey.sclx = ''
      this.searchKey.cdgy = ''
      this.searchKey.jt = ''
      this.searchKey.lch = ''
      this.searchKey.runId = ''
      this.searchKey.platterNo = ''
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
        type: this.isActive,
        runId: this.searchKey.runId,
        platterId: this.searchKey.platterNo,
        machineId: this.searchKey.jt,
        stoveId: this.searchKey.lch,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      queryList(requestParams).then(res => {
        this.list = res.data.list
        this.tableKey++
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    exportAll() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/wyReportController/variousDetailsExport?type=${this.isActive}&runId=${this.searchKey.runId}&platterId=${this.searchKey.platterNo}&machineId=${this.searchKey.jt}&stoveId=${this.searchKey.lch}&startTime=${startTime}&endTime=${endTime}`)
    }
  }
}

