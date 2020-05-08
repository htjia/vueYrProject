
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findMachineUser } from '@/api/extensionManage/produceManage/movcdProduce'
import { machineList } from '@/api/extensionManage/wyBasicInfoManage/mocvdInfo' // 机台查询
import { findMoList, insert, findRunList, findOldInfo, findBottleList, moRecordList, insertMoRecord } from '@/api/extensionManage/stockManage/moSource'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      moLoading: false,
      mocvd1Edit: false,
      listLoading: false,
      moReplaceDialogVisible: false,
      viewMoReplaceDialogVisible: false,
      viewGpReplaceDialogVisible: false,
      notBastic: false,
      list: [],
      machineList: [],
      moRecordList: [],
      bottleList: [],
      machineOptions: [],
      moList1: [],
      beginDate: '',
      endDate: '',
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      searchKeys: {
        sbbh: '',
        moType: '',
        gph: '',
        cj: '',
        ypzl: '',
        jt: ''
      },
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
      moOptions: [
        { name: '三甲基镓' },
        { name: '三乙基镓' },
        { name: '三甲基铟' },
        { name: '三甲基铝' },
        { name: '二茂镁' }
      ],
      mocvdForm: {
        qgph: '',
        qmz: '',
        qrunid: '',
        qcj: '',
        qyz: '',
        qghr: '',
        qremark: '',
        hgph: '',
        hmz: '',
        hxmz: '',
        hrunid: '',
        hcj: '',
        hyz: '',
        hxyz: '',
        sybfb: '',
        hremark: ''
      },
      tableData1: [{}],
      machineUserList: [],
      runList: [],
      currentId: '',
      spanArr: '',
      tableKey: 1,
      pos: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.viewMoReplace()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.viewMoReplace()
    },
    // 查询机台操作人
    findMachineUserFun(machineId) {
      const params = {
        machineId
      }
      findMachineUser(params).then(res => {
        this.machineUserList = res.data
      })
    },
    fetchData() {
      this.moLoading = true
      findMoList({}).then(res => {
        if (res.code === 0) {
          res.data.map((item) => {
            item['mocvdEdit'] = false
          })
          res.data.map((itemMoList) => {
            this.cellMerge(itemMoList.moList)
          })
          console.log(res.data)
          this.machineList = res.data
          this.moLoading = false
        }
      })
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 生成一个与行数相同的数组记录每一行设置的合并数
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1) // 用于存放每一行记录的合并数
          this.pos = 0 // pos是spanArr的索引
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].moName === data[i - 1].moName) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
            this.spanArr[this.pos] += 1
            this.spanArr.push(0) // 0 即表示该行不显示
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
      return this.spanArr
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = row.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 设置单元格合并
    cellMerge(table) {
      table.map((row) => {
        row['spanArr'] = this.getSpanArr(table)
      })
    },
    addMoRow(table) {
      let emptyNum = 0
      table.map((item) => {
        if (item.moName === '') {
          emptyNum++
        }
      })
      if (emptyNum !== 0) {
        this.$message({
          type: 'error',
          message: '请先选择MO源类型!'
        })
      } else {
        table.push({
          meta: '',
          moName: ''
        })
        this.cellMerge(table)
        this.tableKey++
      }
    },
    addMoItem(row, index, table) {
      if (row.meta === '') {
        this.$message({
          type: 'error',
          message: '请先选择MO源类型!'
        })
        return
      }
      const hasNumArr = table.filter(item => item.moName === row.moName)
      if (hasNumArr.length === 2) {
        this.$message({
          type: 'error',
          message: '单个MO源最多配置2瓶!'
        })
        return
      }
      var num = 1
      table.forEach((item, index) => {
        if (item.moName === row.moName) {
          num++
        }
      })
      table.splice(index, 0, {
        moName: row.moName,
        meta: row.moName + num
      })
      this.cellMerge(table)
      this.tableKey++
    },
    deleteMoItem(row, index, table) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        table.splice(index, 1)
        this.cellMerge(table)
        this.tableKey++
      })
    },
    submitMocvdEdit(item) {
      let emptyNum = 0
      const params = []
      item.moList.map((row) => {
        if (row.moName === '' || row.meta === '') {
          emptyNum++
        }
        params.push({
          id: row.id,
          machineId: item.machineId,
          meta: row.meta,
          moName: row.moName
        })
      })
      if (emptyNum !== 0) {
        this.$message({
          type: 'error',
          message: 'MO源配置不能为空!'
        })
      } else {
        insert(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            item.mocvdEdit = false
            this.fetchData()
          }
        })
      }
    },
    // 获取机台
    machineListFun() {
      machineList({}).then(res => {
        this.machineOptions = res.data
      })
    },
    // 更换 mo
    moReplace(item, row) {
      this.mocvdForm.qgph = ''
      this.mocvdForm.qmz = ''
      this.mocvdForm.qrunid = ''
      this.mocvdForm.qcj = ''
      this.mocvdForm.qyz = ''
      this.mocvdForm.qghr = ''
      this.mocvdForm.qremark = ''
      this.mocvdForm.hgph = ''
      this.mocvdForm.hmz = ''
      this.mocvdForm.hxmz = ''
      this.mocvdForm.hrunid = ''
      this.mocvdForm.hcj = ''
      this.mocvdForm.hyz = ''
      this.mocvdForm.hxyz = ''
      this.mocvdForm.sybfb = ''
      this.mocvdForm.hremark = ''
      this.currentId = row.id
      this.moReplaceDialogVisible = true
      this.findMachineUserFun(item.machineId)
      findRunList({ machineId: item.machineId }).then(res => {
        this.runList = res.data
      })
      findOldInfo({ id: row.id }).then(res => {
        if (res.data !== null) {
          this.mocvdForm.hgph = res.data.oldBottleNo
          this.mocvdForm.hcj = res.data.oldManufacturer
          this.mocvdForm.hrunid = res.data.oldRunId
          this.mocvdForm.hyz = res.data.sourceWeight
          this.mocvdForm.hmz = res.data.totalWeight
        }
      })
    },
    handleCancel(item) {
      item.mocvdEdit = false
      this.fetchData()
    },
    moNameChange(row, table) {
      const hasNumArr = table.filter(item => item.moName === row.moName)
      if (hasNumArr.length > 1) {
        this.$message({
          type: 'error',
          message: 'MO源类型已存在!'
        })
        row.moName = ''
        row.meta = ''
        return
      }
      var num = 0
      table.forEach((item, index) => {
        if (item.moName === row.moName) {
          num++
        }
      })
      row.meta = row.moName + num
    },
    // 更换 mo 提交
    submitForm() {
      const params = {
        moConfigId: this.currentId,
        newBottleNo: this.mocvdForm.qgph, // 新钢瓶号
        newManufacturer: this.mocvdForm.qcj, // 新厂家
        newRemark: this.mocvdForm.qremark, // 新备注
        newRunId: this.mocvdForm.qrunid, // 新Run_id
        newSourceWeight: this.mocvdForm.qyz, // 新瓶源重
        newTotalWeight: this.mocvdForm.qmz, // 新瓶毛重
        oldBottleNo: this.mocvdForm.hgph, // 旧钢瓶号
        oldManufacturer: this.mocvdForm.hcj, // 旧厂家
        oldRemark: this.mocvdForm.hremark, // 旧备注
        oldRunId: this.mocvdForm.hrunid, // 旧Run_id
        oldSourceWeight: this.mocvdForm.hxyz, // 旧瓶源重
        oldTotalWeight: this.mocvdForm.hxmz, // 旧瓶毛重
        operator: this.mocvdForm.qghr, // 操作人
        percent: this.mocvdForm.sybfb, // 剩余百分比
        sourceWeight: this.mocvdForm.hyz,
        totalWeight: this.mocvdForm.hmz
      }
      insertMoRecord(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.moReplaceDialogVisible = false
        this.fetchData()
      })
    },
    // 换下源重更改
    sourceWeightChange(val) {
      if (this.mocvdForm.hyz !== '' && val) {
        this.mocvdForm.hxyz = ((this.mocvdForm.hyz - this.mocvdForm.hmz) + parseFloat(val)).toFixed(2)
        if (this.mocvdForm.qyz !== '') {
          this.mocvdForm.sybfb = (((this.mocvdForm.hxyz / parseFloat(this.mocvdForm.qyz)).toFixed(2)) * 100).toFixed(0)
        } else {
          this.mocvdForm.sybfb = ''
        }
      } else {
        this.mocvdForm.hxyz = ''
        this.mocvdForm.sybfb = ''
      }
    },
    // 毛重更改
    newTotalWeightChange(val) {
      this.mocvdForm.qmz = (val.match(/^\d*(\.?\d{0,10})/g)[0]) || null
    },
    newSoruceChange(val) {
      this.mocvdForm.qyz = (val.match(/^\d*(\.?\d{0,10})/g)[0]) || null
    },
    oldSoruceInputChange(val) {
      this.mocvdForm.hxmz = (val.match(/^\d*(\.?\d{0,2})/g)[0]) || null
    },
    // 源重更改
    newSoruceWeightChange(val) {
      // console.log(this.mocvdForm.hxyz, 'hhhhhhhhhhhhhhhhhxyz-----')
      // console.log(val, 'vvvvvvvvvvvvvvvvval-----')
      if (this.mocvdForm.hxyz !== '' && val) {
        this.mocvdForm.sybfb = ((this.mocvdForm.hxyz / parseFloat(val)) * 100).toFixed(2)
      } else {
        this.mocvdForm.sybfb = ''
      }
    },
    handleMoExport() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/wyMoConfig/exportMoRecord?machine=${this.searchKeys.sbbh}&moName=${this.searchKeys.moType}&startTime=${startTime}&endTime=${endTime}`)
    },
    // mo源更换记录查看
    viewMoReplace() {
      this.machineListFun()
      this.pageNum = 1
      const params = {
        machine: this.searchKeys.sbbh,
        moName: this.searchKeys.moType,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      moRecordList(params).then(res => {
        this.moRecordList = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.viewMoReplaceDialogVisible = true
      })
    },
    viewMoReplaceClose() {
      this.searchKeys.sbbh = ''
      this.searchKeys.moType = ''
      this.beginDate = ''
      this.endDate = ''
      // this.viewMoReplace()
    },
    viewGpReplaceClose() {
      this.searchKeys.gph = ''
      this.searchKeys.cj = ''
      this.searchKeys.ypzl = ''
      this.searchKeys.jt = ''
      // this.viewGpReplaceFun()
    },
    handleExport() {
      window.open(process.env.BASE_API + `/wyMoConfig/exportBottleRecord?newBatche=${this.searchKeys.gph}&newManufacturer=${this.searchKeys.cj}&moName=${this.searchKeys.ypzl}&machineId=${this.searchKeys.jt}`)
    },
    // 钢瓶更换记录查看
    viewGpReplaceFun() {
      this.machineListFun()
      const params = {
        newBatche: this.searchKeys.gph,
        newManufacturer: this.searchKeys.cj,
        moName: this.searchKeys.ypzl,
        machineId: this.searchKeys.jt
      }
      findBottleList(params).then(res => {
        this.bottleList = res.data
        this.viewGpReplaceDialogVisible = true
      })
    }
  }
}

