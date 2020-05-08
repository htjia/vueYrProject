
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findMachineUser } from '@/api/extensionManage/produceManage/movcdProduce'
import {
  findWorkshopSelect,
  findSiteSelect,
  findMachineSelect,
  findMachine,
  materialName,
  findByBatchNo,
  findAllList,
  findChangeRecord,
  saveBatchNo,
  findUnitByMaterialId,
  changeBdeleteBatchNoatchNo,
  changeBatchNo,
  saveMachine,
  saveMaterial
} from '@/api/chipManage/rawMaterialManage/rawMaterial'
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
      isActive: 0,
      workshopList: [
        {
          id: 0,
          name: '前段'
        },
        {
          id: 1,
          name: '后段'
        }
      ], // 工段
      factoryList: [], // 车间
      siteLists: [], // 站点
      machinList: [], // 机台
      materialNameOptions: [], // 材料名称
      hasBaseList: [], // 基本设备
      hasWashList: [], // 清洗/匀胶类设备
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      hisTit: '', // 更换记录名字
      tableList: [], // 主页面设备机台
      moRecordList: [],
      bottleList: [],
      machineOptions: [],
      moList1: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      machineForm: { // 查询
        section: '',
        workshopId: '',
        siteId: '',
        machineId: ''
      },
      hisMachineId: '',
      searchKeys: {
        startTime: '',
        endTime: '',
        creatorName: '',
        materialBatch: '',
        produceType: '',
        materialId: ''
      },
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.searchKeys.endTime
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.searchKeys.startTime
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      moOptions: [
        { name: '试样', id: '0' },
        { name: '量产', id: '1' }
      ],
      yuList: [
        { name: '片' },
        { name: 'run' }
      ],
      munitList: [],
      disForm: {
        materialBatch: '',
        produceType: '',
        changeNum: '',
        createTime: '',
        munit: '',
        yuval: '',
        yunit: '',
        remark: ''
      },

      mocvdForm: {
        id: '',
        materialModel: '',
        failureTime: '',
        creator: '',
        materialName: '',
        materialBatch: '',
        produceType: '',
        changeNum: '',
        createTime: '',
        materialUnit: '',
        warningVal: '',
        yuval: '',
        yuvalUnit: '',
        remark: '',
        rawId: ''
      },
      rules: {
        materialBatch: [
          { required: true, message: '请扫描或输入原材料编号', trigger: 'blur' },
          { pattern: /^[5A-Za-z0-9-\-]+$/, message: '原材料批号只能输入英文字母和数字和-', trigger: 'blur' }
        ],
        produceType: [{ required: true, message: '请选择', trigger: 'change' }],
        changeNum: [{ required: true, message: '请输入更换数量', trigger: 'blur' }],
        createTime: [{ required: true, message: '请选择', trigger: 'change' }],
        materialUnit: [{ required: true, message: '请选择', trigger: 'change' }],
        yuval: [{ required: true, message: '请输入阈值', trigger: 'blur' }],
        warningVal: [{ required: true, message: '请输入预警值', trigger: 'blur' }],
        yuvalUnit: [{ required: true, message: '请选择', trigger: 'change' }]

      },
      materialId: '',
      baseCheckList: [],
      washCheckList: [],
      baseType3List: [],
      washType3List: [],
      formList: [],
      machineUserList: [],
      runList: [],
      currentId: '',
      spanArr: [],
      contentSpanArr: [],
      tableKey: 1,
      pos: '',
      position: 0,
      dis: []
    }
  },
  mounted() {
    this.fetchData(this.machineForm)
    this.materialName()
    this.initSearch()
  },
  watch: {
    mocvdForm: {
      handler(val, oldVal) {
        if (this.$refs.mocvdForm) {
          this.$refs.mocvdForm.clearValidate()
        }
      },
      deep: true
    }
  },
  methods: {
    initSearch() {
      this.changeWork()
      this.changeFactory()
      this.changeSite()
    },
    // 根据工段获取车间
    changeWork(val) {
      findWorkshopSelect({ jsonStr: { type: val }}).then(res => {
        this.factoryList = res.data
        this.machineForm.workshopId = null
        this.machineForm.siteId = null
        this.machineForm.machineId = null
        this.changeFactory()
        this.changeSite()
      })
    },
    // 根据车间获取站点
    changeFactory(val) {
      const obj = {
        type: this.machineForm.section,
        worksShopId: val
      }
      findSiteSelect({ jsonStr: obj }).then(res => {
        this.siteLists = res.data
      })
      this.machineForm.siteId = null
      this.machineForm.machineId = null
      this.changeSite()
    },
    // 根据站点获取机台
    changeSite(val) {
      const obj = {
        type: this.machineForm.section,
        worksShopId: this.machineForm.workshopId,
        siteId: val
      }
      findMachineSelect({ jsonStr: obj }).then(res => {
        this.machinList = res.data
      })
      this.machineForm.machineId = null
    },
    // 获取管理点配置的数据（基本设备/清洗&匀胶类设备）
    handleMachine() {
      this.viewGpReplaceDialogVisible = true
      findMachine().then(res => {
        this.hasBaseList = res.data
        this.baseType3List = this.choseList(this.hasBaseList).arr
        this.baseCheckList = this.choseList(this.hasBaseList).checked
      })
      findMachine({ jsonStr: { id: 1 }}).then(res => {
        this.hasWashList = res.data
        this.washType3List = this.choseList(this.hasWashList).arr
        this.washCheckList = this.choseList(this.hasWashList).checked
      })
    },
    // 获取材料名称
    materialName() {
      const params = {
        pageNum: 1,
        pageSize: 99999999
      }
      materialName(params).then(res => {
        this.materialNameOptions = res.data.list
      })
    },
    // 重置当前筛选条件
    clearSearch() {
      this.machineForm = {
        section: '',
        workshopId: '',
        siteId: '',
        machineId: ''
      }
      this.initSearch()
      this.fetchData(this.machineForm)
    },
    // 查询筛选条件
    handleSearch() {
      this.fetchData(this.machineForm)
    },
    // 切换基本设备/清洗&匀胶类设备
    navClick(index) {
      this.isActive = index
      const obj = this.machineForm
      obj.slotNo = this.isActive ? 1 : null
      this.fetchData(obj)
    },
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
    // 获取列表信息
    fetchData(obj) {
      this.moLoading = true

      findAllList({ jsonStr: obj }).then(res => {
        res.data.map((item) => {
          item['mocvdEdit'] = false
        })
        res.data.map((itemMoList) => {
          this.cellMerge(itemMoList.circleList)
        })
        this.tableList = res.data
        this.moLoading = false
      })
    },
    openHistory(row) {
      this.hisTit = `${row.workName}-${row.siteName}-${row.machineName}原材料更换记录`
      this.viewMoReplaceDialogVisible = true
      this.hisMachineId = row.machineId
      this.viewMoReplace()
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 时间戳转yyyy-mm-dd
    formatTime(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var M = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      var H = '0' + date.getHours()
      var m = '0' + date.getMinutes()
      return y + '-' + M.substring(M.length - 2, M.length) + '-' + d.substring(d.length - 2, d.length) + ' ' + H.substring(H.length - 2, H.length) + ':' + m.substring(m.length - 2, m.length)
    },
    // 新增一行批次号
    addCLItem(row, index, table) {
      row.disabled = true
      // 判断这个批次号最多加3条
      let hasNumArr = []
      if (this.isActive) {
        const hasLocalte = table.filter(item => item.materialName === row.materialName)
        hasNumArr = hasLocalte.filter(item => item.localtion === row.localtion)
      } else {
        hasNumArr = table.filter(item => item.materialName === row.materialName)
      }
      if (hasNumArr.length === 3) {
        row.disabled = false
        this.$message({
          type: 'error',
          message: '每个材料最多可以配置3个批次号!'
        })
        return
      } else {
        saveBatchNo({ jsonStr: { rawId: row.rawId }}).then(res => {
          row.disabled = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fetchData(this.machineForm)
        })
      }
      this.cellMerge(table)
      this.tableKey++
    },
    // 删除一个批次号
    deleteReplace(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeBdeleteBatchNoatchNo({ jsonStr: { id: row.batchId }}).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fetchData(this.machineForm)
        })
      })
    },
    // 生成一个与行数相同的数组记录每一行设置的合并数
    getSpanArr(data, name1, name2) {
      this.spanArr = []
      this.contentSpanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1) // 用于存放每一行记录的合并数
          this.contentSpanArr.push(1) // 用于存放每一行记录的合并数
          this.pos = 0 // pos是spanArr的索引
          this.position = 0 // pos是spanArr的索引
        } else {
          // 如果有两个
          if (name2) {
            // 判断当前元素与上一个元素是否相同
            if (data[i][name1] === data[i - 1][name1]) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
              this.spanArr[this.pos] += 1
              this.spanArr.push(0) // 0 即表示该行不显示
              // 判断当前元素与上一个元素是否相同
              if (data[i][name2] === data[i - 1][name2]) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
                data[i]['isDelete'] = 1
                data[i - 1]['isDelete'] = 1
                this.contentSpanArr[this.position] += 1
                this.contentSpanArr.push(0) // 0 即表示该行不显示
              } else {
                this.contentSpanArr.push(1)
                this.position = i
              }
            } else {
              this.spanArr.push(1)
              this.pos = i
              this.contentSpanArr.push(1)
              this.position = i
            }
          } else {
            // 判断当前元素与上一个元素是否相同
            if (data[i][name1] === data[i - 1][name1]) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
              data[i]['isDelete'] = 1
              data[i - 1]['isDelete'] = 1
              this.spanArr[this.pos] += 1
              this.spanArr.push(0) // 0 即表示该行不显示
            } else {
              this.spanArr.push(1)
              this.pos = i
            }
          }
        }
      }
      const obj = {
        spanArr: this.spanArr,
        contentSpanArr: this.contentSpanArr
      }
      return obj
    },
    // 切换为修改材料名称
    changeNameList(item) {
      item.mocvdEdit = true
      const cache = []
      for (const i of item.circleList) {
        if (cache.find(c => c.rawId === i.rawId)) {
          continue
        } else {
          cache.push(i)
        }
      }
      item.cacheList = cache
      item.spanArr = []
      item.contentSpanArr = []
      this.merge(item.cacheList, item.spanArr)
    },
    // 材料名称的合并设置
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.isActive) {
        if (columnIndex === 0) {
          const _row = row.spanArr ? row.spanArr[rowIndex] : 1
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      }
    },
    // 批次号的合并设置
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //  清洗匀胶类设备
      if (this.isActive) {
        // 第一列
        if (columnIndex === 0) {
          const _row = row.spanArr ? row.spanArr[rowIndex] : 1
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
          // 第二列
        } else if (columnIndex === 1) {
          const _row = row.contentSpanArr ? row.contentSpanArr[rowIndex] : 1
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
        // 基础设备
      } else {
        if (columnIndex === 0) {
          const _row = row.spanArr[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      }
    },
    // 设置单元格合并
    cellMerge(table) {
      table.map((row) => {
        this.merge(table, row)
      })
    },
    merge(table, row) {
      if (!this.isActive) {
        row['spanArr'] = this.getSpanArr(table, 'materialName').spanArr
      } else {
        row['spanArr'] = this.getSpanArr(table, 'localtion', 'materialName').spanArr
        row['contentSpanArr'] = this.getSpanArr(table, 'localtion', 'materialName').contentSpanArr
      }
    },
    // 基础设备添加一个材料名称
    addMoRow(table) {
      if (table.length === 10) {
        this.$message({
          type: 'error',
          message: '最多可以加10条材料名称!'
        })
      } else {
        table.push({
          materialName: ''
        })
        this.tableKey++
      }
    },
    // 清洗的时候添加一个材料名称
    addMoItem(row, index, table) {
      const hasNumArr = table.filter(item => item.localtion === row.localtion)
      if (hasNumArr.length === 10) {
        this.$message({
          type: 'error',
          message: '最多可以加10条材料名称!'
        })
      } else {
        table.splice(index, 0, {
          materialName: '',
          localtion: row.localtion
        })
        this.washCellMerge(table)
        this.tableKey++
      }
    },
    // 设置单元格合并
    washCellMerge(table) {
      table.map((row) => {
        row['spanArr'] = this.washSpanArr(table)
      })
    },
    // item
    disableName(table, localtion) {
      const arr = []
      for (const item of table) {
        if (this.isActive && item.localtion) {
          if (localtion === item.localtion) {
            if (arr.indexOf(item.materialId) === -1) {
              arr.push(item.materialId)
            }
          }
        } else {
          arr.push(item.materialId)
        }
      }
      this.dis = arr
      // console.log(arr)
    },
    washSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1) // 用于存放每一行记录的合并数
          this.pos = 0 // pos是editSpanArr的索引
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].localtion === data[i - 1].localtion) { // 则向editSpanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
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
    deleteMoItem(row, index, table) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        table.splice(index, 1)
        this.washCellMerge(table)
        this.tableKey++
      })
    },
    // 确定添加材料
    submitMocvdEdit(item) {
      const params = []
      item.cacheList.map((row, index) => {
        if (row.materialId) {
          params.push({
            materialId: row.materialId,
            pointId: item.pointId,
            pointType: this.isActive ? 1 : 0,
            sequence: !this.isActive ? index : null,
            localtion: this.isActive ? row.localtion : null
          })
        }
      })
      saveMaterial(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          item.mocvdEdit = false
          this.fetchData(this.machineForm)
        }
      })
    },
    // 获取机台
    machineListFun() {
      findMachineSelect({}).then(res => {
        this.machineOptions = res.data
      })
    },
    // 更换
    moReplace(item, row) {
      this.materialId = row.materialId
      this.moReplaceDialogVisible = true
      this.mocvdForm.id = row.batchId
      this.mocvdForm.materialName = row.materialName
      this.mocvdForm.materialBatch = ''
      this.mocvdForm.produceType = ''
      this.mocvdForm.changeNum = ''
      this.mocvdForm.warningVal = ''
      this.mocvdForm.yuval = ''
      this.mocvdForm.yuvalUnit = ''
      this.mocvdForm.remark = ''
      this.mocvdForm.rawId = row.rawId
      this.mocvdForm.machineId = item.machineId
      setTimeout(() => {
        this.$refs.materialBatch.focus()
      }, 100)
      findChangeRecord({ jsonStr: { changeId: row.batchId }}).then(res => {
        this.mocvdForm.createTime = this.formatTime(new Date().getTime())
        if (res.data.list.length) {
          this.disForm = res.data.list[0]
          this.mocvdForm.yuval = this.disForm.ynum
          this.mocvdForm.yuvalUnit = this.disForm.yunit
        } else {
          this.disForm = {
            materialBatch: '',
            produceType: '',
            changeNum: '',
            createTime: '',
            munit: '',
            yuval: '',
            yunit: '',
            remark: ''
          }
        }
      })
    },
    // 取消更换
    restForm(formName) {
      this.moReplaceDialogVisible = false
      this.$refs.mocvdForm.resetFields()
      this.$refs.mocvdForm.clearValidate()
      this.fetchData(this.machineForm)
    },
    changeBatch(val) {
      if (val) {
        findByBatchNo({ jsonStr: { batchNo: val, materialId: this.materialId }}).then(res => {
          this.mocvdForm.materialModel = res.data.materialModel
          this.mocvdForm.failureTime = res.data.failureTime
          this.munitList = []
          switch (res.data.result) {
            case 0:
              this.mocvdForm.produceType = '1'
              findUnitByMaterialId({ materialType: res.data.materialType }).then(response => {
                this.munitList = response.data
              })
              break
            case -1:
              this.$confirm('该原材料试样结果暂无检验结论，是否试样?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.mocvdForm.produceType = '0'
              }).catch(() => {
                this.mocvdForm.produceType = ''
                this.mocvdForm.materialBatch = ''
              })
              findUnitByMaterialId({ materialType: res.data.materialType }).then(response => {
                this.munitList = response.data
              })
              break
            case 1:
              this.$alert('该原材料试样结果为不合格，无法添加！', '提示', {
                confirmButtonText: '关闭',
                type: 'warning'
              }).then(() => {
                this.mocvdForm.produceType = ''
                this.mocvdForm.materialBatch = ''
              })
              break
            case 2:
              this.$alert('批号材料信息与当前材料信息不符！', '提示', {
                confirmButtonText: '关闭',
                type: 'warning'
              }).then(() => {
                this.mocvdForm.produceType = ''
                this.mocvdForm.materialBatch = ''
              })
              break
            case 3:
              this.$alert('批号信息未找到！', '提示', {
                confirmButtonText: '关闭',
                type: 'warning'
              }).then(() => {
                this.mocvdForm.produceType = ''
                this.mocvdForm.materialBatch = ''
              })
              break
            default:
              break
          }
        })
      }
    },
    handleCancel(item) {
      this.munitList = []
      item.mocvdEdit = false
      this.fetchData(this.machineForm)
    },
    // 更换 mo 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const jsonStr = {
            id: this.mocvdForm.id,
            materialName: this.mocvdForm.materialName,
            materialModel: this.mocvdForm.materialModel,
            materialBatch: this.mocvdForm.materialBatch,
            produceType: this.mocvdForm.produceType,
            changeNum: this.mocvdForm.changeNum,
            createTime: this.mocvdForm.createTime,
            materialUnit: this.mocvdForm.materialUnit,
            yuval: this.mocvdForm.yuval,
            yuvalUnit: this.mocvdForm.yuvalUnit,
            warningVal: this.mocvdForm.warningVal,
            failureTime: this.mocvdForm.failureTime,
            remark: this.mocvdForm.remark,
            rawId: this.mocvdForm.rawId,
            machineId: this.mocvdForm.machineId,
            creator: sessionStorage.getItem('User-Id')
          }
          changeBatchNo({ jsonStr: jsonStr }).then(res => {
            this.munitList = []
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.$refs[formName].resetFields()
            this.moReplaceDialogVisible = false
            this.fetchData(this.machineForm)
          })
        }
      })
    },
    // 更换记录查看
    viewMoReplace() {
      this.machineListFun()
      this.pageNum = 1
      const params = {
        creatorName: this.searchKeys.creatorName,
        materialName: this.searchKeys.moType,
        startTime: this.searchKeys.startTime === '' ? '' : this.formatDate(this.searchKeys.startTime),
        endTime: this.searchKeys.endTime === '' ? '' : this.formatDate(this.searchKeys.endTime),
        materialBatch: this.searchKeys.materialBatch,
        produceType: this.searchKeys.produceType,
        materialId: this.searchKeys.materialId,
        machineId: this.hisMachineId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findChangeRecord({ jsonStr: params }).then(res => {
        this.moRecordList = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.viewMoReplaceDialogVisible = true
      })
    },
    // 重置更换记录的筛选按钮
    viewMoReplaceClose() {
      this.initReplaceClose()
      this.viewMoReplace()
    },
    initReplaceClose() {
      this.searchKeys.creatorName = ''
      this.searchKeys.startTime = ''
      this.searchKeys.endTime = ''
      this.searchKeys.materialBatch = ''
      this.searchKeys.produceType = ''
      this.searchKeys.materialId = ''
    },
    // 管理点配置-基本
    handleBaseCheck(data, checked) {
      this.baseCheckList = [...this.baseType3List].filter(_ => [...checked.checkedKeys].indexOf(_) > -1)
    },
    // 管理点配置-清洗
    handleWashCheck(data, checked) {
      this.washCheckList = [...this.washType3List].filter(_ => [...checked.checkedKeys].indexOf(_) > -1)
    },
    // 处理要传过去的数据
    choseList(data, arr = [], checked = []) {
      data.map(_ => {
        if (_.type === 3) {
          if (_.checked) {
            checked.push(_.id)
          }
          arr.push(_.id)
        } else {
          this.choseList(_.children, arr, checked)
        }
      })
      const obj = {
        arr: arr,
        checked: checked
      }
      return obj
    },
    // 确定传过去
    sureChecked() {
      const arr = [...this.baseCheckList, ...this.washCheckList]
      const newArr = []
      for (const i of arr) {
        newArr.push(i.split('-')[1])
      }
      saveMachine({ jsonStr: newArr + '' }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.viewGpReplaceDialogVisible = false
        this.fetchData(this.machineForm)
      })
    }
  }
}

