
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findWarehous, findWaferInfo, userList, findWaferInfoForStorage, findWaferRunGroup, matfindList, autoCheck, audit, settingQuery, updateWaferNoraml, removeWafer, submitBaofei, findPrintList, reverseAduit, queryAcceptRuleList } from '@/api/extensionManage/warehousingManage/warehousing'
const defaultFormThead = [
  {
    thName: '导入时间',
    thKey: 'name'
  },
  {
    thName: '镭刻号',
    thKey: 'status'
  }
]
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      selectTheadVisble: false,
      checkDialogVisible: false,
      notBastic: false,
      list: [],
      defaultFormThead: [],
      formThead: defaultFormThead,
      // checkboxVal: defaultFormThead,
      checkboxVal: [
        '导入时间',
        '镭刻号'
      ],
      theadOptions: [],
      formTheadOptions: [],
      checkList: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
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
      },
      userOptions: [],
      currentId: '',
      isActive: 0,
      waferTol: 0,
      rowInfo: null,
      waferId: '',
      code: '',
      type: '',
      creater: '',
      checker: '',
      printNuM: 0,
      typeList: [
        {
          id: 0,
          name: '正常'
        },
        {
          id: 1,
          name: '报废'
        }
      ],
      userListOption: [],
      anotherList: [],
      anotherLists: [],
      anotherList1: [],
      codeNo: '',
      modelType: 0,
      modelCreater: sessionStorage.getItem('Admin-Token'),
      modelTime: this.getNowFormatDate(),
      modelRemark: '',
      innerVisible: false,
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      waferList: [],
      selectList: [],
      selectAll: false,
      chanceAll: false,
      treeList: [],
      machineOptions: [],
      waferRunId: '',
      waferwafeId: '',
      waferMathine: '',
      waferBeginDate: '',
      waferEndDate: '',
      waferCheckType: '',
      waferTypes: '',
      removeList: [],
      removeALL: false,
      checkVisible: false,
      isCheckNuLL: true,
      isCheckLevel: true,
      ifCheck: false,
      isCheck: false,
      checkStr: '',
      checkErrorList: [],
      editionTypeSelectOptions: [],
      colIndex: [],
      colErrorIndex: [],
      normalSelectList: [],
      unSelectList: [],
      addDialogVisible: false,
      addDialogVisible1: false,
      fanDialogVisible: false,
      chaDialogVisible: false,
      HandleDialogVisible: false,
      checkReason: false,
      printVisible: false,
      printDialogVisible: false,
      errorTotal: 0,
      printList: [],
      printDate: '',
      checkerType: '',
      checkerList: [
        {
          id: 0,
          name: '待审核'
        },
        {
          id: 1,
          name: '通过'
        },
        {
          id: 2,
          name: '不通过'
        }
      ],
      checkerName: '',
      checkerTime: '',
      checkerTypes: '',
      remarkFan: '',
      modelRemarks: '',
      ruleInfoName: '',
      showCheckList: [
        { grade: 'R', key: {}},
        { grade: 'S' },
        { grade: 'F' },
        { grade: 'T8' },
        { grade: 'T7' },
        { grade: 'T6' },
        { grade: 'T5' },
        { grade: 'T4' },
        { grade: 'T3' },
        { grade: 'T2' },
        { grade: 'T1' }
      ]
    }
  },
  mounted() {
    this.fetchData()
    this.userLists()
  },
  methods: {
    userLists() {
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      userList(params).then(res => {
        this.userListOption = res.data.list
      })
    },
    searchWafer() {
      this.findWaferInfoForStorage()
      this.findWaferRunGroup()
    },
    settingQuery() {
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      settingQuery(params).then(res => {
        this.editionTypeSelectOptions = res.data.list
      })
    },
    findWaferInfoForStorage() {
      const params = {
        runId: this.waferRunId,
        machineIds: this.waferMathine,
        waferId: this.waferwafeId,
        startTime: this.formatDate(this.waferBeginDate),
        endTime: this.formatDate(this.waferEndDate),
        waferType: this.waferCheckType,
        status: this.modelType
      }
      if (this.waferBeginDate === '') {
        params.startTime = ''
      }
      if (this.waferEndDate === '') {
        params.endTime = ''
      }
      findWaferInfoForStorage(params).then(res => {
        if (this.anotherLists.length > 0) {
          this.waferList = []
          for (let x = 0; x < res.data.length; x++) {
            let flag = true
            for (let i = 0; i < this.anotherLists.length; i++) {
              if (res.data[x].id === this.anotherLists[i].id) {
                flag = false
                break
              }
            }
            if (flag) {
              this.waferList.push(res.data[x])
            }
          }
        } else {
          this.waferList = res.data
        }
        for (let i = 0; i < this.anotherLists.length; i++) {
          for (let x = 0; x < this.waferList.length; x++) {
            if (this.waferList[x].id === this.anotherLists[i].id) {
              this.$refs.multipleTables.toggleRowSelection(this.waferList[x])
            }
          }
        }
      })
    },
    findWaferRunGroup() {
      const params = {
        runId: this.waferRunId,
        machineIds: this.waferMathine,
        waferId: this.waferwafeId,
        startTime: this.formatDate(this.waferBeginDate),
        endTime: this.formatDate(this.waferEndDate),
        waferType: this.waferCheckType,
        status: this.modelType
      }
      if (this.waferBeginDate === '') {
        params.startTime = ''
      }
      if (this.waferEndDate === '') {
        params.endTime = ''
      }
      findWaferRunGroup(params).then(res => {
        this.data2 = []
        this.treeList = res.data
        for (let i = 0; i < res.data.length; i++) {
          const datalist = []
          for (let x = 0; x < res.data[i].runList.length; x++) {
            datalist[datalist.length] = {
              id: x,
              label: res.data[i].runList[x]
            }
          }
          this.data2.push(
            {
              id: res.data[i].runId,
              label: res.data[i].runId,
              children: datalist
            }
          )
        }
      })
    },
    getNowFormatDate() {
      var today = new Date()
      return this.formatDate(today.getTime())
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    findWaferInfo() {
      const params = {
        id: this.rowInfo.id,
        waferId: this.waferId
      }
      findWaferInfo(params).then(res => {
        this.anotherList = res.data
        this.waferTol = res.data.length
        this.anotherList1 = []
        this.anotherLists = []
        this.colIndex = []
        this.colErrorIndex = []
        let firstErrorIndex = -1
        let lastErrorIndex = -1
        let firstIndex = -1
        let lastIndex = -1
        let lastId = -1
        let statu = 0
        for (let i = 0; i < this.anotherList.length; i++) {
          this.anotherList[i].isSelected = false
          this.anotherList1.push(this.anotherList[i])
          this.anotherLists.push(this.anotherList[i])
          if (i === 0) {
            firstIndex = i
            lastIndex = i
            firstErrorIndex = i
            lastErrorIndex = i
          } else {
            if (lastId !== this.anotherList[i].runId) {
              lastIndex = i
            } else if (i === this.anotherList.length - 1 && lastId === this.anotherList[i].runId) {
              lastIndex = i
            }
            if (firstIndex !== lastIndex) {
              this.colIndex.push({ firstIndex: firstIndex, lastIndex: lastIndex })
              firstIndex = i
            }
            if (statu !== 2 && this.anotherList[i].status === 2) {
              firstErrorIndex = i
            }
            if (statu === 2 && this.anotherList[i].status !== 2) {
              lastErrorIndex = i
              this.colErrorIndex.push({ firstIndex: firstErrorIndex, lastIndex: lastErrorIndex })
              firstErrorIndex = i
            }
            if (statu === 2 && this.anotherList[i].status === 2 && i === this.anotherList.length - 1) {
              lastErrorIndex = i
              this.colErrorIndex.push({ firstIndex: firstErrorIndex, lastIndex: lastErrorIndex })
            }
          }
          statu = this.anotherList[i].status
          lastId = this.anotherList[i].runId
        }
        console.log(this.colErrorIndex)
      })
    },
    addNew(row) {
      this.isCheck = false
      this.addDialogVisible = true
      this.modelCreater = row.creator
      this.modelTime = row.createTime
      this.checkStr = ''
      this.ifCheck = false
      this.rowInfo = row
      this.codeNo = row.code
      this.modelType = row.type
      this.modelTime = row.createTime
      this.modelRemark = row.auditRemark
      this.modelTime = row.createTime
      this.checkerName = sessionStorage.getItem('Admin-Token')
      this.checkerTime = this.getNowFormatDate()
      this.checkerTypes = '待审核'
      this.findWaferInfo()
    },
    addNew1(row) {
      this.addDialogVisible1 = true
      this.rowInfo = row
      this.codeNo = row.code
      this.modelCreater = row.creator
      this.modelTime = row.createTime
      this.modelType = row.type
      this.modelTime = row.createTime
      this.modelRemark = row.auditRemark
      this.modelTime = row.createTime
      this.checkerName = sessionStorage.getItem('Admin-Token')
      this.checkerTime = this.getNowFormatDate()
      this.checkerTypes = '待审核'
      this.findWaferInfo()
    },
    fanNew(row) {
      this.fanDialogVisible = true
      this.modelRemarks = ''
      this.ifCheck = false
      this.rowInfo = row
      this.codeNo = row.code
      this.modelCreater = row.creator
      this.modelTime = row.createTime
      this.modelType = row.type
      this.modelTime = row.createTime
      this.modelRemark = row.auditRemark
      this.modelTime = row.createTime
      this.checkerName = row.auditor
      this.checkerTime = row.auditTime
      if (row.status === 0) {
        this.checkerTypes = '待审核'
      } else if (row.status === 1) {
        this.checkerTypes = '通过'
      } else if (row.status === 2) {
        this.checkerTypes = '不通过'
      } else if (row.status === 3) {
        this.checkerTypes = '草稿'
      }
      this.remarkFan = ''
      this.findWaferInfo()
    },
    chaNew(row) {
      this.chaDialogVisible = true
      this.ifCheck = false
      this.rowInfo = row
      this.codeNo = row.code
      this.modelCreater = row.creator
      this.modelTime = row.createTime
      this.modelType = row.type
      this.modelTime = row.createTime
      this.modelRemark = row.auditRemark
      this.modelTime = row.createTime
      this.checkerName = row.auditor
      this.checkerTime = row.auditTime
      if (row.status === 0) {
        this.checkerTypes = '待审核'
      } else if (row.status === 1) {
        this.checkerTypes = '通过'
      } else if (row.status === 2) {
        this.checkerTypes = '不通过'
      } else if (row.status === 3) {
        this.checkerTypes = '草稿'
      }
      this.remarkFan = ''
      this.findWaferInfo()
    },
    matfindList() {
      matfindList().then(res => {
        this.machineOptions = res.data
      })
    },
    deleteSelect() {
      for (let i = 0; i < this.removeList.length; i++) {
        for (let x = 0; x < this.anotherLists.length; x++) {
          if (this.anotherLists[x].id === this.removeList[i].id) {
            this.anotherLists.splice(x, 1)
          }
        }
      }
      this.removeALL = false
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ((columnIndex === 0 || columnIndex === 1) && this.colIndex.length > 0) {
        let isCheck = 0
        let setI = -1
        for (let i = 0; i < this.colIndex.length; i++) {
          if (this.colIndex[i].firstIndex === rowIndex) {
            isCheck = 1
            setI = i
            break
          } else if (this.colIndex[i].firstIndex < rowIndex && this.colIndex[i].lastIndex >= rowIndex) {
            isCheck = 2
            break
          }
        }
        if (isCheck === 1) {
          return {
            rowspan: this.colIndex[setI].lastIndex + 1 - this.colIndex[setI].firstIndex,
            colspan: 1
          }
        } else if (isCheck === 2) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    objectSpanMethods({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4 && this.colErrorIndex.length > 0) {
        let isCheck = 0
        let setI = -1
        for (let i = 0; i < this.colErrorIndex.length; i++) {
          if (this.colErrorIndex[i].firstIndex === rowIndex) {
            isCheck = 1
            setI = i
            break
          } else if (this.colErrorIndex[i].firstIndex < rowIndex && this.colErrorIndex[i].lastIndex >= rowIndex) {
            isCheck = 2
            break
          }
        }
        if (isCheck === 1) {
          return {
            rowspan: this.colErrorIndex[setI].lastIndex + 1 - this.colErrorIndex[setI].firstIndex,
            colspan: 1
          }
        } else if (isCheck === 2) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    normalUpdateSelect(data) {
      this.normalSelectList = []
      let runId = -1
      for (const item of data) {
        if (item.runId !== runId) {
          this.normalSelectList.push(item.runId)
          runId = item.runId
        }
      }
    },
    deleteRunId() {
      for (const item of this.normalSelectList) {
        for (let i = 0; i < this.anotherList1.length; i++) {
          if (item === this.anotherList1[i].runId) {
            this.anotherList1.splice(i, 1)
            i = i - 1
          }
        }
      }
      this.colIndex = []
      let firstIndex = -1
      let lastIndex = -1
      let lastId = -1
      for (let i = 0; i < this.anotherList1.length; i++) {
        if (i === 0) {
          firstIndex = i
          lastIndex = i
        } else {
          if (lastId !== this.anotherList1[i].runId) {
            lastIndex = i
          } else if (i === this.anotherList1.length - 1 && lastId === this.anotherList1[i].runId) {
            lastIndex = i
          }
          if (firstIndex !== lastIndex) {
            this.colIndex.push({ firstIndex: firstIndex, lastIndex: lastIndex })
            firstIndex = i
          }
        }
        lastId = this.anotherList1[i].runId
      }
    },
    saveUpdateNormal() {
      const ids = []
      for (const item of this.anotherList) {
        let flag = true
        for (const items of this.anotherList1) {
          if (item.id === items.id) {
            flag = false
            break
          }
        }
        if (flag) {
          ids.push(item.id)
        }
      }
      updateWaferNoraml({ ids: ids.join() }).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.editDialogVisible = false
          this.fetchData()
        }
      })
    },
    showList() {
      this.innerVisible = true
      this.waferRunId = ''
      this.waferwafeId = ''
      this.waferMathine = ''
      this.waferBeginDate = ''
      this.waferEndDate = ''
      this.waferCheckType = ''
      this.waferTypes = ''
      this.settingQuery()
      this.findWaferInfoForStorage()
      this.findWaferRunGroup()
      this.matfindList()
    },
    // 单据信息/Wafer信息切换
    navClick(index) {
      this.isActive = index
    },
    handleSelectionChange(data) {
      this.selectList = data
    },
    handleSelectionChanges(data) {
      this.removeList = data
    },
    toggleSelectionRemove() {
      if (this.removeALL) {
        for (let y = 0; y < this.anotherLists.length; y++) {
          this.$refs.multipleTable.toggleRowSelection(this.anotherLists[y])
        }
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    toggleSelection() {
      if (this.selectAll) {
        this.chanceAll = false
        const list = []
        for (let i = 0; i < this.treeList.length; i++) {
          list[list.length] = {
            id: this.treeList[i].runId,
            label: this.treeList[i].runId
          }
          for (let y = 0; y < this.treeList[i].runList.length; y++) {
            for (let x = 0; x < this.waferList.length; x++) {
              if (this.waferList[x].runId === this.treeList[i].runList[y]) {
                this.$refs.multipleTables.toggleRowSelection(this.waferList[x])
              }
            }
          }
        }
        this.$refs.tree.setCheckedNodes(list)
      } else {
        this.$refs.multipleTables.clearSelection()
        this.$refs.tree.setCheckedKeys([])
      }
      // this.$refs.multipleTables.toggleRowSelection(row)
    },
    toggleSelectionReset() {
      if (this.chanceAll) {
        this.selectAll = false
        this.$refs.tree.setCheckedKeys([])
        this.$refs.multipleTables.clearSelection()
      }
    },
    openIsCheck() {
      if (this.anotherLists.length > 0) {
        this.checkVisible = true
        this.isCheckNuLL = true
        this.isCheckLevel = true
      } else {
        this.$message({
          type: 'error',
          message: '请先添加入库审核列表!'
        })
      }
    },
    closeCheck() {
      this.checkVisible = false
    },
    startCheck() {
      if (this.isCheckNuLL || this.isCheckLevel) {
        for (let i = 0; i < this.anotherLists.length; i++) {
          this.anotherLists[i].rowNum = i + 1
        }
        const requestParams = {
          wafers: this.anotherLists,
          nullCheck: this.isCheckNuLL,
          levelCheck: this.isCheckLevel
        }
        autoCheck(requestParams).then(res => {
          this.isCheck = true
          this.checkerTypes = res.data.status ? '通过' : '不通过'
          this.ifCheck = res.data.status
          this.checkStr = res.data.error
          this.checkErrorList = res.data.rows
          this.checkList = res.data.ids
        })
      } else {
        this.$message({
          type: 'error',
          message: '请先选择要检查的项目!'
        })
      }
    },
    tableRowClassName({ row, rowIndex }) {
      let flag = false
      for (const item of this.checkErrorList) {
        if (item - 1 === rowIndex) {
          flag = true
          break
        }
      }
      if (flag) {
        return 'set_green'
      }
    },
    clearCondition() {
      this.waferId = ''
      this.code = ''
      this.type = ''
      this.checkerType = ''
      this.creater = ''
      this.checker = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearch()
    },
    // 单击单据信息
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
      this.findWaferInfo()
    },
    // 双击单据信息
    cellDblclick(row, column, cell, event) {
      this.rowInfo = row
      this.findWaferInfo()
      this.isActive = 1
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
    cloaseAndAdd() {
      this.innerVisible = false
      for (let x = 0; x < this.waferList.length; x++) {
        let flag = true
        for (let i = 0; i < this.anotherLists.length; i++) {
          if (this.waferList[x].id === this.anotherLists[i].id) {
            flag = false
            break
          }
        }
        if (flag) {
          this.anotherLists.push(this.waferList[x])
        }
      }
    },
    chanceList() {
      this.innerVisible = false
      this.selectList = []
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        code: this.code,
        type: this.type,
        creator: this.creater,
        auditor: this.checker,
        status: this.checkerType,
        waferId: this.waferId,
        isAduit: 1
      }
      if (this.checkerType !== '') {
        requestParams.status = this.checkerType
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      findWarehous(requestParams).then(res => {
        this.list = res.data.list
        this.anotherList = []
        this.waferTol = 0
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        if (this.list.length > 0) {
          this.$refs.listTabel.setCurrentRow(this.list[0])
          // this.handleCurrentChange(this.list[0])
        }
      })
    },
    selectData() {
      const selected = this.$refs.tree.getCheckedNodes()
      this.$refs.multipleTables.clearSelection()
      for (const items of selected) {
        for (let x = 0; x < this.waferList.length; x++) {
          if (this.waferList[x].runId === items.label) {
            this.$refs.multipleTables.toggleRowSelection(this.waferList[x])
          }
        }
      }
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm() {
      if (this.anotherLists.length === 0) {
        this.$message({
          type: 'error',
          message: '请先添加入库审核列表!'
        })
        return
      }
      if (!this.isCheck) {
        this.$message({
          type: 'error',
          message: '请先自动检查通过后，再提交!'
        })
        return
      }
      // const datalist = []
      // for (let i = 0; i < this.anotherLists.length; i++) {
      //   datalist.push({ id: this.anotherLists[i].id })
      // }
      const params = {
        auditor: sessionStorage.getItem('User-Id'),
        details: this.checkList,
        auditResult: this.checkStr,
        status: this.ifCheck ? 1 : 2,
        id: this.rowInfo.id,
        auditTime: this.getNowFormatDate(),
        auditRemark: this.modelRemark
      }
      audit(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.addDialogVisible = false
          this.baofeiDialogVisible = false
          this.fetchData()
        }
      })
    },
    // 添加提交
    submitForm1(type) {
      if (this.anotherLists.length === 0) {
        this.$message({
          type: 'error',
          message: '请先添加入库审核列表!'
        })
        return
      }
      // const datalist = []
      // for (let i = 0; i < this.anotherLists.length; i++) {
      //   datalist.push({ id: this.anotherLists[i].id })
      // }
      const params = {
        auditor: sessionStorage.getItem('User-Id'),
        details: this.checkList,
        auditResult: this.checkStr,
        status: type,
        id: this.rowInfo.id,
        auditTime: this.getNowFormatDate(),
        auditRemark: this.modelRemark
      }
      audit(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.addDialogVisible1 = false
          this.baofeiDialogVisible = false
          this.fetchData()
        }
      })
    },
    // 取消
    resetForm() {
      this.addDialogVisible = false
      this.fanDialogVisible = false
      this.chaDialogVisible = false
    },
    // 编辑
    handleEdit(row) {
      this.editDialogVisible = true
      this.rowInfo = row
      this.findWaferInfo()
    },
    findMather(row) {
      this.ruleInfoName = row.accName
      const params = {
        normId: row.accNormId
      }
      queryAcceptRuleList(params).then(res => {
        if (res.code === 0) {
          this.showCheckList = [
            { grade: 'R', key: {}},
            { grade: 'S' },
            { grade: 'F' },
            { grade: 'T8' },
            { grade: 'T7' },
            { grade: 'T6' },
            { grade: 'T5' },
            { grade: 'T4' },
            { grade: 'T3' },
            { grade: 'T2' },
            { grade: 'T1' }
          ]
          for (const item of res.data) {
            this.showCheckList[0].key[item.field] = '1'
            if (item.grade.toLowerCase() === 's') {
              this.showCheckList[1][item.field] = item.val
            } else if (item.grade.toLowerCase() === 'r') {
              this.showCheckList[0][item.field] = item.val
            } else if (item.grade.toLowerCase() === 'f') {
              this.showCheckList[2][item.field] = item.val
            } else if (item.grade.toLowerCase() === 't8') {
              this.showCheckList[3][item.field] = item.val
            } else if (item.grade.toLowerCase() === 't7') {
              this.showCheckList[4][item.field] = item.val
            } else if (item.grade.toLowerCase() === 't6') {
              this.showCheckList[5][item.field] = item.val
            } else if (item.grade.toLowerCase() === 't5') {
              this.showCheckList[6][item.field] = item.val
            } else if (item.grade.toLowerCase() === 't4') {
              this.showCheckList[7][item.field] = item.val
            } else if (item.grade.toLowerCase() === 't3') {
              this.showCheckList[8][item.field] = item.val
            } else if (item.grade.toLowerCase() === 't2') {
              this.showCheckList[9][item.field] = item.val
            } else if (item.grade.toLowerCase() === 't1') {
              this.showCheckList[10][item.field] = item.val
            }
          }
          this.checkDialogVisible = true
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该入库单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeWafer(row.id).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum = this.pageNum - 1
            }
            this.fetchData()
          }
        })
      })
    },
    submitBaofei(row) {
      this.$confirm('确定是否提交该入库单信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        submitBaofei({ id: row.id }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
            this.fetchData()
          }
        })
      })
    },
    changemodelType() {
      if (this.anotherLists.length > 0) {
        this.$confirm('切换数据单类型会清空入库明细列表，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.checkErrorList = []
          this.anotherLists = []
          this.checkstr = ''
        }, () => {
          if (this.modelType === 0) {
            this.modelType = 1
          } else {
            this.modelType = 0
          }
          this.checkErrorList = []
          this.checkstr = ''
        })
      }
    },
    handleBaofei(row) {
      this.baofeiDialogVisible = true
      this.ifCheck = true
      this.rowInfo = row
      this.codeNo = row.code
      this.modelType = row.type
      this.modelTime = row.createTime
      this.modelRemark = row.auditRemark
      this.findWaferInfo()
    },
    handelRow(row) {
      this.HandleDialogVisible = true
      this.rowInfo = row
      this.errorTotal = 0
      this.findWaferInfo()
    },
    showReason() {
      this.checkReason = true
    },
    findPrintList() {
      if (this.rowInfo !== null && this.rowInfo.id !== null) {
        this.printDialogVisible = true
        this.printDate = ''
        var date = new Date()
        var y = 1900 + date.getYear()
        var m = '0' + (date.getMonth() + 1)
        var d = '0' + date.getDate()
        var myddy = date.getDay()// 获取存储当前日期
        var weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        this.printDate = y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length) + ' ' + weekday[myddy]
        findPrintList({ id: this.rowInfo.id }).then(res => {
          this.printList = res.data
          this.printNuM = 0
          for (const item of this.printList) {
            this.printNuM = this.printNuM + item.warehous
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择要打印的入库单!'
        })
      }
    },
    removeError() {
      for (let i = 0; i < this.anotherList1.length; i++) {
        if (this.anotherList1[i].isSelected) {
          this.anotherList1.splice(i, 1)
          i = i - 1
        }
      }
      this.colIndex = []
      let firstErrorIndex = -1
      let lastErrorIndex = -1
      let statu = 0
      for (let i = 0; i < this.anotherList1.length; i++) {
        if (i === 0) {
          firstErrorIndex = i
          lastErrorIndex = i
        } else {
          if (statu !== 2 && this.anotherList[i].status === 2) {
            firstErrorIndex = i
          }
          if (statu === 2 && this.anotherList[i].status !== 2) {
            lastErrorIndex = i
            this.colErrorIndex.push({ firstIndex: firstErrorIndex, lastIndex: lastErrorIndex })
            firstErrorIndex = i
          }
          if (statu === 2 && this.anotherList[i].status === 2 && i === this.anotherList.length - 1) {
            lastErrorIndex = i
            this.colErrorIndex.push({ firstIndex: firstErrorIndex, lastIndex: lastErrorIndex })
          }
        }
        statu = this.anotherList1[i].status
      }
      this.errorTotal = 0
    },
    selectTrue(row) {
      this.errorTotal = 0
      for (let i = 0; i < this.anotherList1.length; i++) {
        if (this.anotherList1[i].isSelected) {
          this.errorTotal = this.errorTotal + 1
        }
      }
    },
    saveError() {
      const ids = []
      for (const item of this.anotherList) {
        let flag = true
        for (const items of this.anotherList1) {
          if (item.id === items.id) {
            flag = false
            break
          }
        }
        if (flag) {
          ids.push(item.id)
        }
      }
      if (ids.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要处理的列表!'
        })
        return
      }
      updateWaferNoraml({ ids: ids.join() }).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '处理成功!'
          })
          this.HandleDialogVisible = false
          this.fetchData()
        }
      })
    },
    printDiv() {
      this.printDialogVisible = false
      this.$print(this.$refs.print)
    },
    reverseAduit() {
      if (this.modelRemarks === '') {
        this.$message({
          type: 'error',
          message: '请填写反审原因!'
        })
        return
      }
      const params = {
        id: this.rowInfo.id,
        reverseReason: this.modelRemarks
      }
      reverseAduit(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fanDialogVisible = false
          this.fetchData()
        }
      })
    },
    importExcel() {
      if (this.rowInfo !== null && this.rowInfo.id !== null) {
        window.open(process.env.BASE_API + '/wyWarehous/exportExcel?id=' + this.rowInfo.id, '_blank')
      } else {
        this.$message({
          type: 'error',
          message: '请选择要导出的入库单!'
        })
      }
    }
  }
}

