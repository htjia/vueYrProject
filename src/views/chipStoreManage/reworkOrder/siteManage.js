
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
// import { siteList } from '@/api/processManagement/siteManage'
import { findWyWareHous, findWyWareHousList, findPutInTypeList, findCabinetList, findPutInCode,
  findRunList, findBoxList, insert, findRecordList, findStoreHouseDetail, printLabel
} from '@/api/chipManage/extensionStorageManage/putInStorage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      fileUrl: process.env.BASE_API + '/ckStorehouse/importExcel',
      loading: false,
      listLoading: false,
      receiptsDisabled: true,
      sendDialogVisible: false,
      recordDialogVisible: false,
      isPrint: true,
      waferTol: 0,
      receipts: '',
      maker: '',
      listNum: '',
      listNo: '',
      WaferID: '',
      waferTotal: 0,
      abnormalList: [{}],
      detailList: [{}],
      receiveList: [{}],
      selectedRunRow: {},
      selectedRow: {},
      model: '',
      putInStorageNo: '',
      putInStorageType: '',
      itemType: '',
      putInTime: '',
      putInRemark: '',
      pole: '',
      isActive: 0,
      list: [],
      copyList: [],
      billList: [],
      waferList: [],
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
      receiptsOptions: [
        {
          id: 0,
          name: '正常片'
        },
        {
          id: 1,
          name: '报废片'
        }
      ],
      processOptions: [
        {
          id: 0,
          name: '工序1'
        },
        {
          id: 1,
          name: '工序2'
        }
      ],
      poleOptions: [
        {
          id: 0,
          name: '是'
        },
        {
          id: 1,
          name: '否'
        }
      ],
      selectType: 0,
      putInTypeList: [],
      cabinetList: [],
      runSelectList: [],
      boxSelectList: [],
      recordList: [],
      cabinet: '',
      selectedCode: '',
      boxOrRun: [
        { id: 0, name: 'RUN ID' },
        { id: 1, name: 'BOX ID' }
      ],
      options: [],
      currentId: ''
    }
  },
  mounted() {
    this.findPutInCodeFun()
    this.findPutInTypeListFun()
    this.findCabinetListFun()
    this.putInTime = this.getFormatDate()
  },
  methods: {
    findPutInTypeListFun() {
      findPutInTypeList({}).then(res => {
        this.putInTypeList = res.data
      })
    },
    findCabinetListFun() {
      findCabinetList({}).then(res => {
        this.cabinetList = res.data
      })
    },
    handleCloseDialog() {
      this.pageNum = 1
      this.pageSize = 15
      this.listNo = ''
      this.WaferID = ''
      this.receipts = ''
      this.beginDate = ''
      this.endDate = ''
      this.waferTol = 0
    },
    // 清空列表
    clearList() {
      this.$confirm('是否清空已选Wafer列表?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list = []
        this.copyList = []
      })
    },
    getFormatDate() {
      var date = new Date()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentDate = date.getFullYear() + '-' + month + '-' + strDate
      return currentDate
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    handleSelect() {
      const params = {
        code: this.listNo,
        waferId: this.WaferID,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        type: this.receipts,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findWyWareHous(params).then(res => {
        this.sendDialogVisible = true
        this.isActive = 0
        this.totalPage = parseInt(res.data.total)
        this.billList = res.data.list
        this.waferTol = this.billList[0].wafer
        this.selectedRunRow = this.billList[0]
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.billList[0])
        }, 200)
      })
    },
    // 单击Run信息
    rowClick(row) {
      this.waferTol = row.wafer
      this.selectedRunRow = row
    },
    recordRowClick(row) {
      this.selectedRunRow = row
      this.waferTol = row.count
    },
    // 选择按钮
    handleSelectRow(row) {
      this.waferTotal = row.wafer
      this.selectedRow = row
      this.setInputValue(row)
      this.sendDialogVisible = false
      this.selectType = 0
    },
    rowDblclick(row, column, cell, event) {
      this.selectedRow = row
      this.setInputValue(row)
      this.sendDialogVisible = false
    },
    // 获取单号
    findPutInCodeFun() {
      findPutInCode({}).then(res => {
        this.putInStorageNo = res.data
      })
    },
    setInputValue(row) {
      this.receiptsDisabled = true
      this.listNum = row.code
      this.maker = row.creator
      this.itemType = row.type
      findRunList({ id: row.id }).then(res => {
        this.runSelectList = res.data
        this.options = this.runSelectList
      })
      findBoxList({ id: row.id }).then(res => {
        this.boxSelectList = res.data
      })
    },
    boxOrRunChange(val) {
      if (this.list.length !== 0) {
        this.$confirm('是否确认切换？切换后列表数据将会清空！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (val === 0) {
            this.options = this.runSelectList
          } else {
            this.options = this.boxSelectList
          }
          this.selectedCode = ''
          this.list = []
          this.copyList = []
        }).catch(() => {
          this.selectType = val === 0 ? 1 : 0
        })
      }
      if (val === 0) {
        this.options = this.runSelectList
      } else {
        this.options = this.boxSelectList
      }
      this.selectedCode = ''
    },
    handleCloseSendDialog() {

    },
    handleDialogSearch(index) {
      this.pageNum = 1
      if (index === 1) {
        this.handleSelect()
      } else {
        this.viewRecord()
      }
    },
    clearDialogSearch() {
      this.listNo = ''
      this.WaferID = ''
      this.beginDate = ''
      this.endDate = ''
      this.receipts = ''
    },
    // 导出
    handleExport() {
      window.open(process.env.BASE_API + `/ckStorehouse/exportExcel?id=${this.selectedRunRow.id}&waferId=${this.WaferID}`)
    },
    // 送片单导出
    handleExportDialog() {
      window.open(process.env.BASE_API + `/ckStorehouse/exportWyWaferExcel?id=${this.selectedRunRow.id}&waferId=${this.WaferID}`)
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.handleSelect()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.handleSelect()
    },
    // 对象数组克隆
    deepClone(obj) {
      const newObj = Array.isArray(obj) ? [] : {}
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            newObj[key] = (obj && typeof obj[key] === 'object') ? this.deepClone(obj[key]) : obj[key]
          }
        }
      }
      return newObj
    },
    handleSearch() {
      if (this.listNum === '') {
        this.$message({
          message: '请先选择送片单!',
          type: 'error'
        })
        return false
      }
      if (this.selectedCode === '') {
        this.$message({
          message: '请先选择RUNID / BOXID !',
          type: 'error'
        })
        return false
      }
      let params = {}
      if (this.selectType === 0) {
        params = {
          id: this.selectedRow.id,
          runId: this.selectedCode
        }
      } else {
        params = {
          id: this.selectedRow.id,
          boxNo: this.selectedCode
        }
      }
      findWyWareHousList(params).then(res => {
        const hasWafer = this.list.filter(item => { return item.waferId === res.data[0].waferId })
        if (hasWafer.length === 0) {
          const resData = this.deepClone(res.data)
          this.copyList = [...resData, ...this.copyList]
          console.log(this.copyList)
          res.data.map(item => {
            item.esd200v = item.esd200v === '' ? '' : parseFloat(item.esd200v).toFixed(2) + '%'
            item.esd50v = item.esd50v === '' ? '' : parseFloat(item.esd50v).toFixed(2) + '%'
            item.esd500 = item.esd500 === '' ? '' : parseFloat(item.esd500).toFixed(2) + '%'
            item.esd300 = item.esd300 === '' ? '' : parseFloat(item.esd300).toFixed(2) + '%'
            item.plWd = item.plWd === '' ? '' : parseFloat(item.plWd).toFixed(2)
            item.plWtd = item.plWtd === '' ? '' : parseFloat(item.plWtd).toFixed(2)
            item.plIi = item.plIi === '' ? '' : parseFloat(item.plIi).toFixed(2)
            item.plIiStd = item.plIiStd === '' ? '' : parseFloat(item.plIiStd).toFixed(2)
            item.plPd = item.plPd === '' ? '' : parseFloat(item.plPd).toFixed(2)
            item.plRef = item.plRef === '' ? '' : parseFloat(item.plRef).toFixed(2)
            item.lop460 = item.lop460 === '' ? '' : parseFloat(item.lop460).toFixed(2)
            item.vf1 = item.vf1 === '' ? '' : parseFloat(item.vf1).toFixed(3)
            item.vf2 = item.vf2 === '' ? '' : parseFloat(item.vf2).toFixed(3)
            item.vf3 = item.vf3 === '' ? '' : parseFloat(item.vf3).toFixed(3)
            item.wld = item.wld === '' ? '' : parseFloat(item.wld).toFixed(2)
            item.lr = item.lr === '' ? '' : parseFloat(item.lr).toFixed(2)
            item.vz = item.vz === '' ? '' : parseFloat(item.vz).toFixed(2)
            item.iv = item.iv === '' ? '' : parseFloat(item.iv).toFixed(4)
            item.kVal = item.kVal === '' ? '' : parseFloat(item.kVal).toFixed(2)
            item.cowWd = item.cowWd === '' ? '' : parseFloat(item.cowWd).toFixed(2)
            item.hw1 = item.hw1 === '' ? '' : parseFloat(item.hw1).toFixed(2)
            item.bow = item.bow === '' ? '' : parseFloat(item.bow).toFixed(2)
            item.plintStd = item.plintStd === '' ? '' : parseFloat(item.plintStd).toFixed(2)
            item.avgVf4 = item.avgVf4 === '' ? '' : parseFloat(item.avgVf4).toFixed(3)
            item.yield = item.yield === '' ? '' : parseFloat(item.yield).toFixed(2) + '%'
            item.vf1Yield = item.vf1Yield === '' ? '' : parseFloat(item.vf1Yield).toFixed(2) + '%'
            item.lrYield = item.lrYield === '' ? '' : parseFloat(item.lrYield).toFixed(2) + '%'
            item.vzYield = item.vzYield === '' ? '' : parseFloat(item.vzYield).toFixed(2) + '%'
            item.esd400 = item.esd400 === '' ? '' : parseFloat(item.esd400).toFixed(2) + '%'
            item.yieldIr02 = item.yieldIr02 === '' ? '' : parseFloat(item.yieldIr02).toFixed(2) + '%'
            item.thyristor = item.thyristor === '' ? '' : parseFloat(item.thyristor).toFixed(2) + '%'
          })
          const list = [...res.data, ...this.list]
          this.list = list
          console.log(this.list)
        }
      })
    },
    clearSearch() {
      this.batchNum = ''
      this.process = ''
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.pole = ''
    },
    // Run信息/Wafer信息切换
    navClick(index, type) {
      if (index === 1) {
        if (type === 1) {
          this.findWaferFun(this.selectedRunRow.id)
        } else {
          this.findStoreHouseDetailFun(this.selectedRunRow.id)
        }
      }
      this.isActive = index
    },
    findWaferFun(id) {
      const params = {
        id
      }
      findWyWareHousList(params).then(res => {
        res.data.map(item => {
          item.esd200v = item.esd200v === '' ? '' : parseFloat(item.esd200v).toFixed(2) + '%'
          item.esd50v = item.esd50v === '' ? '' : parseFloat(item.esd50v).toFixed(2) + '%'
          item.esd500 = item.esd500 === '' ? '' : parseFloat(item.esd500).toFixed(2) + '%'
          item.esd300 = item.esd300 === '' ? '' : parseFloat(item.esd300).toFixed(2) + '%'
          item.plWd = item.plWd === '' ? '' : parseFloat(item.plWd).toFixed(2)
          item.plWtd = item.plWtd === '' ? '' : parseFloat(item.plWtd).toFixed(2)
          item.plIi = item.plIi === '' ? '' : parseFloat(item.plIi).toFixed(2)
          item.plIiStd = item.plIiStd === '' ? '' : parseFloat(item.plIiStd).toFixed(2)
          item.plPd = item.plPd === '' ? '' : parseFloat(item.plPd).toFixed(2)
          item.plRef = item.plRef === '' ? '' : parseFloat(item.plRef).toFixed(2)
          item.lop460 = item.lop460 === '' ? '' : parseFloat(item.lop460).toFixed(2)
          item.vf1 = item.vf1 === '' ? '' : parseFloat(item.vf1).toFixed(3)
          item.vf2 = item.vf2 === '' ? '' : parseFloat(item.vf2).toFixed(3)
          item.vf3 = item.vf3 === '' ? '' : parseFloat(item.vf3).toFixed(3)
          item.wld = item.wld === '' ? '' : parseFloat(item.wld).toFixed(2)
          item.lr = item.lr === '' ? '' : parseFloat(item.lr).toFixed(2)
          item.vz = item.vz === '' ? '' : parseFloat(item.vz).toFixed(2)
          item.iv = item.iv === '' ? '' : parseFloat(item.iv).toFixed(4)
          item.kVal = item.kVal === '' ? '' : parseFloat(item.kVal).toFixed(2)
          item.cowWd = item.cowWd === '' ? '' : parseFloat(item.cowWd).toFixed(2)
          item.hw1 = item.hw1 === '' ? '' : parseFloat(item.hw1).toFixed(2)
          item.bow = item.bow === '' ? '' : parseFloat(item.bow).toFixed(2)
          item.plintStd = item.plintStd === '' ? '' : parseFloat(item.plintStd).toFixed(2)
          item.avgVf4 = item.avgVf4 === '' ? '' : parseFloat(item.avgVf4).toFixed(3)
          item.yield = item.yield === '' ? '' : parseFloat(item.yield).toFixed(2) + '%'
          item.vf1Yield = item.vf1Yield === '' ? '' : parseFloat(item.vf1Yield).toFixed(2) + '%'
          item.lrYield = item.lrYield === '' ? '' : parseFloat(item.lrYield).toFixed(2) + '%'
          item.vzYield = item.vzYield === '' ? '' : parseFloat(item.vzYield).toFixed(2) + '%'
          item.esd400 = item.esd400 === '' ? '' : parseFloat(item.esd400).toFixed(2) + '%'
          item.yieldIr02 = item.yieldIr02 === '' ? '' : parseFloat(item.yieldIr02).toFixed(2) + '%'
          item.thyristor = item.thyristor === '' ? '' : parseFloat(item.thyristor).toFixed(2) + '%'
        })
        this.waferList = res.data
      })
    },
    // 记录wafer
    findStoreHouseDetailFun(id) {
      const params = {
        id,
        waferId: this.WaferID,
        pageNum: 1,
        pageSize: 10000
      }
      findStoreHouseDetail(params).then(res => {
        this.waferList = res.data.list
      })
    },
    // 导入
    beforeUpload(file) {
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 10MB!',
          type: 'error'
        })
        this.loading = false
      }
      return isLt2M
    },
    onSuccess(res, file, fileList) {
      console.log(res)
      this.loading = false
      if (res.code !== 0) {
        this.$message({
          type: 'error',
          message: res.message
        })
      } else {
        this.$message({
          type: 'success',
          message: '数据导入成功'
        })
        this.receiptsDisabled = false
        const hasWafer = this.list.filter(item => { return item.waferId === res.data.waferList[0].waferId })
        if (hasWafer.length === 0) {
          const resData = this.deepClone(res.data.waferList)
          this.copyList = resData
          res.data.waferList.map(item => {
            item.esd200v = item.esd200v === '' ? '' : parseFloat(item.esd200v).toFixed(2) + '%'
            item.esd50v = item.esd50v === '' ? '' : parseFloat(item.esd50v).toFixed(2) + '%'
            item.esd500 = item.esd500 === '' ? '' : parseFloat(item.esd500).toFixed(2) + '%'
            item.esd300 = item.esd300 === '' ? '' : parseFloat(item.esd300).toFixed(2) + '%'
            item.plWd = item.plWd === '' ? '' : parseFloat(item.plWd).toFixed(2)
            item.plWtd = item.plWtd === '' ? '' : parseFloat(item.plWtd).toFixed(2)
            item.plIi = item.plIi === '' ? '' : parseFloat(item.plIi).toFixed(2)
            item.plIiStd = item.plIiStd === '' ? '' : parseFloat(item.plIiStd).toFixed(2)
            item.plPd = item.plPd === '' ? '' : parseFloat(item.plPd).toFixed(2)
            item.plRef = item.plRef === '' ? '' : parseFloat(item.plRef).toFixed(2)
            item.lop460 = item.lop460 === '' ? '' : parseFloat(item.lop460).toFixed(2)
            item.vf1 = item.vf1 === '' ? '' : parseFloat(item.vf1).toFixed(3)
            item.vf2 = item.vf2 === '' ? '' : parseFloat(item.vf2).toFixed(3)
            item.vf3 = item.vf3 === '' ? '' : parseFloat(item.vf3).toFixed(3)
            item.wld = item.wld === '' ? '' : parseFloat(item.wld).toFixed(2)
            item.lr = item.lr === '' ? '' : parseFloat(item.lr).toFixed(2)
            item.vz = item.vz === '' ? '' : parseFloat(item.vz).toFixed(2)
            item.iv = item.iv === '' ? '' : parseFloat(item.iv).toFixed(4)
            item.kVal = item.kVal === '' ? '' : parseFloat(item.kVal).toFixed(2)
            item.cowWd = item.cowWd === '' ? '' : parseFloat(item.cowWd).toFixed(2)
            item.hw1 = item.hw1 === '' ? '' : parseFloat(item.hw1).toFixed(2)
            item.bow = item.bow === '' ? '' : parseFloat(item.bow).toFixed(2)
            item.plintStd = item.plintStd === '' ? '' : parseFloat(item.plintStd).toFixed(2)
            item.avgVf4 = item.avgVf4 === '' ? '' : parseFloat(item.avgVf4).toFixed(3)
            item.yield = item.yield === '' ? '' : parseFloat(item.yield).toFixed(2) + '%'
            item.vf1Yield = item.vf1Yield === '' ? '' : parseFloat(item.vf1Yield).toFixed(2) + '%'
            item.lrYield = item.lrYield === '' ? '' : parseFloat(item.lrYield).toFixed(2) + '%'
            item.vzYield = item.vzYield === '' ? '' : parseFloat(item.vzYield).toFixed(2) + '%'
            item.esd400 = item.esd400 === '' ? '' : parseFloat(item.esd400).toFixed(2) + '%'
            item.yieldIr02 = item.yieldIr02 === '' ? '' : parseFloat(item.yieldIr02).toFixed(2) + '%'
            item.thyristor = item.thyristor === '' ? '' : parseFloat(item.thyristor).toFixed(2) + '%'
          })
          this.list = res.data.waferList
        }
        this.options = res.data.runList
        this.runSelectList = res.data.runList
        this.boxSelectList = res.data.boxList
      }
    },
    onError() {
      this.$message({
        type: 'error',
        message: '数据导入失败，请重试！'
      })
      this.loading = false
    },
    // 每页数量改变
    recordSizeChange(pageSize) {
      this.pageSize = pageSize
      this.viewRecord()
    },
    // 当前页数改变
    recordCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.viewRecord()
    },
    // 记录
    viewRecord() {
      this.isActive = 0
      const params = {
        billNo: this.listNo,
        waferId: this.WaferID,
        billType: this.receipts,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findRecordList(params).then(res => {
        this.recordDialogVisible = true
        this.recordList = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.waferTol = this.recordList[0].count
        this.selectedRunRow = this.recordList[0]
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.recordList[0])
        }, 200)
      })
    },
    // 添加
    handleAdd() {
      if (this.itemType === '') {
        this.$message({
          type: 'error',
          message: '请选择单据类型!'
        })
        return false
      }
      if (this.putInTime === '') {
        this.$message({
          type: 'error',
          message: '请选择入库时间!'
        })
        return false
      }
      if (this.putInStorageType === '') {
        this.$message({
          type: 'error',
          message: '请选择入库类型!'
        })
        return false
      }
      if (this.cabinet === '') {
        this.$message({
          type: 'error',
          message: '请选择入库柜位!'
        })
        return false
      }
      this.copyList.map(item => {
        item['arkId'] = this.cabinet
      })
      const params = {
        billNo: this.putInStorageNo,
        billType: this.itemType,
        createTime: this.putInTime,
        creator: sessionStorage.getItem('User-Id'),
        remark: this.putInRemark,
        sendNo: this.listNum,
        type: this.putInStorageType,
        wafers: this.copyList
      }
      if (this.list.length < this.waferTotal) {
        this.$confirm('当前送片单存在尚未入库的Wafer! 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addSubmit(params)
        })
      } else {
        this.addSubmit(params)
      }
    },
    addSubmit(params) {
      insert(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.putInStorageNo = ''
        this.putInTime = this.getFormatDate()
        this.itemType = ''
        this.putInRemark = ''
        this.listNum = ''
        this.cabinet = ''
        this.selectedCode = ''
        this.putInStorageType = ''
        this.options = []
        this.list = []
        this.copyList = []
        this.findPutInCodeFun()
        if (this.isPrint) {
          printLabel({ id: res.data.id, module: 'ckStorehouse' }).then(res => {})
        }
        if (res.data.code && !res.data.repeatRuns) {
          this.$alert(`入库单号重复已修改为${res.data.code}`, '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }
        if (res.data.repeatRuns && !res.data.code) {
          this.$alert(res.data.repeatRuns, '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          })
        }
        if (res.data.repeatRuns && res.data.code) {
          this.$alert(res.data.repeatRuns + `;入库单号重复已修改为${res.data.code}！`, '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          })
        }
      })
    },
    printFun() {
      printLabel({ id: this.selectedRunRow.id, module: 'ckStorehouse' }).then(res => {
        this.$message({
          type: 'success',
          message: '标签正在打印中，请稍候！'
        })
      })
    },
    // 关闭
    handleClose() {
      this.jBatchNum = ''
      this.cBatchNum = ''
      this.sBatchNum = ''
      this.jProcess = ''
      this.cProcess = ''
      this.sProcess = ''
      this.jRemark = ''
      this.sRemark = ''
      this.cRemark = ''
    }
  }
}

