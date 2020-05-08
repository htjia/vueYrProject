
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findWarehous, findWaferInfo, userList, findWaferInfoForStorage, findWaferRunGroup, matfindList, autoCheck, insertNew, settingQuery, updateWaferNoraml, removeWafer, submitBaofei, updateBaofei, findPrintList, findWarehousCode } from '@/api/extensionManage/warehousingManage/warehousing'
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
      notBastic: false,
      list: [],
      defaultFormThead: [],
      formThead: defaultFormThead,
      // checkboxVal: defaultFormThead,
      checkboxVal: [
        '导入时间',
        '镭刻号'
      ],
      spanArr: [],
      pos: 0,
      theadOptions: [],
      formTheadOptions: [],
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
      checkStr: '',
      checkErrorList: [],
      editionTypeSelectOptions: [],
      colIndex: [],
      colErrorIndex: [],
      normalSelectList: [],
      unSelectList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      baofeiDialogVisible: false,
      HandleDialogVisible: false,
      checkReason: false,
      printVisible: false,
      printDialogVisible: false,
      errorTotal: 0,
      printList: [],
      printDate: '',
      isDisabled: false,
      newanotherLists: []
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
        if (this.addDialogVisible) {
          if (this.newanotherLists.length > 0) {
            this.waferList = []
            for (let x = 0; x < res.data.length; x++) {
              let flag = true
              for (let i = 0; i < this.newanotherLists.length; i++) {
                if (res.data[x].id === this.newanotherLists[i].id) {
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
          for (let i = 0; i < this.newanotherLists.length; i++) {
            for (let x = 0; x < this.waferList.length; x++) {
              if (this.waferList[x].id === this.newanotherLists[i].id) {
                this.$refs.multipleTables.toggleRowSelection(this.waferList[x])
              }
            }
          }
        } else {
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
              label: res.data[i].runList[x],
              disabled: false
            }
          }
          this.data2.push(
            {
              id: res.data[i].measure,
              label: res.data[i].measure,
              children: datalist,
              disabled: false
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
              lastErrorIndex = i - 1
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
          var data = {
            isSelected: this.anotherList[i].isSelected,
            statu: this.anotherList[i].status,
            lastId: this.anotherList[i].runId,
            status: this.anotherList[i].status,
            id: this.anotherList[i].id,
            rowNum: this.anotherList[i].rowNum,
            runId: this.anotherList[i].runId,
            waferId: this.anotherList[i].waferId,
            substateType: this.anotherList[i].substateType,
            supplier: this.anotherList[i].supplier,
            laserMark: this.anotherList[i].laserMark,
            mjdj: this.anotherList[i].mjdj,
            plWd: this.anotherList[i].plWd,
            plWdStd: this.anotherList[i].plWdStd,
            plII: this.anotherList[i].plII,
            PLIIStd: this.anotherList[i].PLIIStd,
            plPd: this.anotherList[i].plPd,
            plRef: this.anotherList[i].plRef,
            lop460: this.anotherList[i].lop460,
            comprehensive: this.anotherList[i].comprehensive,
            esd200: this.anotherList[i].esd200,
            esd50: this.anotherList[i].esd50,
            yieldZh: this.anotherList[i].yieldZh,
            vf1Yield: this.anotherList[i].vf1Yield,
            irYield: this.anotherList[i].irYield,
            vzYield: this.anotherList[i].vzYield,
            vf1: this.anotherList[i].vf1,
            vf2: this.anotherList[i].vf2,
            wld1: this.anotherList[i].wld1,
            lr: this.anotherList[i].lr,
            vz: this.anotherList[i].vz,
            lv: this.anotherList[i].lv,
            wld: this.anotherList[i].wld,
            cow: this.anotherList[i].cow,
            esd400: this.anotherList[i].esd400,
            yzType: this.anotherList[i].yzType,
            produceType: this.anotherList[i].produceType,
            Recipe_Name: this.anotherList[i].Recipe_Name,
            hw: this.anotherList[i].hw,
            BS: this.anotherList[i].BS,
            visualReason: this.anotherList[i].visualReason,
            color: this.anotherList[i].color,
            SUB: this.anotherList[i].SUB,
            machine: this.anotherList[i].machine,
            esd500: this.anotherList[i].esd500,
            esd300: this.anotherList[i].esd300,
            bow: this.anotherList[i].bow,
            PLINT_STD: this.anotherList[i].PLINT_STD,
            Avg_Vf4: this.anotherList[i].Avg_Vf4,
            thyristor: this.anotherList[i].thyristor
          }
          this.anotherList1.push(data)
          this.anotherLists.push(data)
        }
        this.getSpanArr(this.anotherList1)
        console.log(this.colErrorIndex)
      })
    },
    addNew() {
      this.addDialogVisible = true
      this.ifCheck = false
      this.modelRemark = ''
      this.checkStr = ''
      this.modelType = 0
      this.newanotherLists = []
      this.checkErrorList = []
      // for (let i = 0; i < this.anotherList.length; i++) {
      //   this.anotherLists.push(this.anotherList[i])
      // }
      findWarehousCode().then(res => {
        this.codeNo = res.data.code
        this.modelTime = new Date(res.data.createTime)
      })
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
    deleteSelects() {
      for (let i = 0; i < this.removeList.length; i++) {
        for (let x = 0; x < this.newanotherLists.length; x++) {
          if (this.newanotherLists[x].id === this.removeList[i].id) {
            this.newanotherLists.splice(x, 1)
          }
        }
      }
      this.removeALL = false
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
          if (data[i].runId === data[i - 1].runId) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
            this.spanArr[this.pos] += 1
            this.spanArr.push(0) // 0 即表示该行不显示
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
      console.log(this.spanArr)
      return this.spanArr
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    objectSpanMethods({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        const _row = this.anotherList1.length
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if ((columnIndex === 0 || columnIndex === 1) && this.colIndex.length > 0) {
    //     let isCheck = 0
    //     let setI = -1
    //     for (let i = 0; i < this.colIndex.length; i++) {
    //       if (this.colIndex[i].firstIndex === rowIndex) {
    //         isCheck = 1
    //         setI = i
    //         break
    //       } else if (this.colIndex[i].firstIndex < rowIndex && this.colIndex[i].lastIndex >= rowIndex) {
    //         isCheck = 2
    //         break
    //       }
    //     }
    //     if (isCheck === 1) {
    //       return {
    //         rowspan: this.colIndex[setI].lastIndex + 1 - this.colIndex[setI].firstIndex,
    //         colspan: 1
    //       }
    //     } else if (isCheck === 2) {
    //       return {
    //         rowspan: 0,
    //         colspan: 0
    //       }
    //     }
    //   }
    // },
    // objectSpanMethods({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 4 && this.colErrorIndex.length > 0) {
    //     let isCheck = 0
    //     let setI = -1
    //     for (let i = 0; i < this.colErrorIndex.length; i++) {
    //       if (this.colErrorIndex[i].firstIndex === rowIndex) {
    //         isCheck = 1
    //         setI = i
    //         break
    //       } else if (this.colErrorIndex[i].firstIndex < rowIndex && this.colErrorIndex[i].lastIndex >= rowIndex) {
    //         isCheck = 2
    //         break
    //       }
    //     }
    //     if (isCheck === 1) {
    //       if (this.colErrorIndex[setI].lastIndex !== this.colErrorIndex[setI].firstIndex) {
    //         return {
    //           rowspan: this.colErrorIndex[setI].lastIndex + 1 - this.colErrorIndex[setI].firstIndex,
    //           colspan: 1
    //         }
    //       }
    //     } else if (isCheck === 2) {
    //       return {
    //         rowspan: 0,
    //         colspan: 0
    //       }
    //     }
    //   }
    // },
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
            lastIndex = i - 1
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
          ids.push(item.detailId)
        }
      }
      // if (ids.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择要修改的行!'
      //   })
      //   return
      // }
      this.isDisabled = true
      updateWaferNoraml({ ids: ids.length === 0 ? '' : ids.join(), id: this.rowInfo.id }).then(res => {
        this.isDisabled = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.editDialogVisible = false
          this.fetchData()
        }
      }, res => {
        this.isDisabled = false
      })
    },
    showList() {
      this.innerVisible = true
      this.waferRunId = ''
      this.waferwafeId = ''
      this.waferMathine = ''
      var today = new Date()
      var yesterday = today.setTime(today.getTime() - 24 * 60 * 60 * 1000)
      this.waferBeginDate = yesterday
      this.waferEndDate = new Date()
      this.waferCheckType = ''
      this.waferTypes = ''
      this.settingQuery()
      this.findWaferInfoForStorage()
      this.findWaferRunGroup()
      this.matfindList()
    },
    selectData() {
      const selected = this.$refs.tree.getCheckedNodes()
      this.$refs.multipleTables.clearSelection()
      for (const items of selected) {
        for (let x = 0; x < this.waferList.length; x++) {
          if (this.waferList[x].runId === items.label) {
            this.$refs.multipleTables.toggleRowSelection([{ row: this.waferList[x], selected: true }])
          }
        }
        for (let i = 0; i < this.data2.length; i++) {
          let flag = false
          for (let y = 0; y < this.data2[i].children.length; y++) {
            if (this.data2[i].children[y].label === items.label) {
              flag = false
              break
            } else {
              flag = true
            }
          }
          this.data2[i].disabled = flag
          for (let y = 0; y < this.data2[i].children.length; y++) {
            this.data2[i].children[y].disabled = flag
          }
        }
      }
      if (selected.length === 0) {
        for (let i = 0; i < this.data2.length; i++) {
          for (let y = 0; y < this.data2[i].children.length; y++) {
            this.data2[i].children[y].disabled = false
          }
          this.data2[i].disabled = false
        }
      }
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
            id: this.treeList[i].measure,
            label: this.treeList[i].measure
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
      this.checkStr = ''
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
    openIsChecks() {
      this.checkStr = ''
      if (this.newanotherLists.length > 0) {
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
        if (this.addDialogVisible) {
          for (let i = 0; i < this.newanotherLists.length; i++) {
            this.newanotherLists[i].rowNum = i + 1
          }
          const requestParams = {
            wafers: this.newanotherLists,
            nullCheck: this.isCheckNuLL,
            levelCheck: this.isCheckLevel
          }
          autoCheck(requestParams).then(res => {
            this.ifCheck = res.data.status
            this.checkStr = res.data.error
            this.checkErrorList = res.data.rows
          })
        } else {
          for (let i = 0; i < this.anotherLists.length; i++) {
            this.anotherLists[i].rowNum = i + 1
          }
          const requestParams = {
            wafers: this.anotherLists,
            nullCheck: this.isCheckNuLL,
            levelCheck: this.isCheckLevel
          }
          autoCheck(requestParams).then(res => {
            this.ifCheck = res.data.status
            this.checkStr = res.data.error
            this.checkErrorList = res.data.rows
          })
        }
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
      if (this.addDialogVisible) {
        for (let x = 0; x < this.selectList.length; x++) {
          let flag = true
          for (let i = 0; i < this.newanotherLists.length; i++) {
            if (this.selectList[x].id === this.newanotherLists[i].id) {
              flag = false
              break
            }
          }
          if (flag) {
            this.newanotherLists.push(this.selectList[x])
          }
        }
      } else {
        for (let x = 0; x < this.selectList.length; x++) {
          let flag = true
          for (let i = 0; i < this.anotherLists.length; i++) {
            if (this.selectList[x].id === this.anotherLists[i].id) {
              flag = false
              break
            }
          }
          if (flag) {
            this.anotherLists.push(this.selectList[x])
          }
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
        waferId: this.waferId
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      findWarehous(requestParams).then(res => {
        this.list = res.data.list
        this.waferTol = 0
        this.anotherList = []
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        if (this.list.length > 0) {
          this.$refs.listTabel.setCurrentRow(this.list[0])
          // this.handleCurrentChange(this.list[0])
        }
      })
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    updateBaofei() {
      // if (this.anotherLists.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '请先添加入库审核列表!'
      //   })
      //   return
      // }
      if (!this.ifCheck && this.modelType === 0) {
        this.$message({
          type: 'error',
          message: '请先自动检查通过后，再提交!'
        })
        return
      }
      this.isDisabled = true
      const datalist = []
      for (let i = 0; i < this.anotherLists.length; i++) {
        datalist.push({ waferId: this.anotherLists[i].waferId })
      }
      const params = {
        code: this.codeNo,
        creator: sessionStorage.getItem('User-Id'),
        remark: this.modelRemark,
        type: this.modelType,
        createTime: this.modelTime,
        id: this.rowInfo.id,
        status: this.rowInfo.status,
        details: datalist
      }
      updateBaofei(params).then(res => {
        this.isDisabled = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.addDialogVisible = false
          this.baofeiDialogVisible = false
          this.fetchData()
        }
      }, res => {
        this.isDisabled = false
      })
    },
    // 添加提交
    submitForm() {
      const datalist = []
      if (this.addDialogVisible) {
        if (this.newanotherLists.length === 0) {
          this.$message({
            type: 'error',
            message: '请先添加入库审核列表!'
          })
          return
        }
        for (let i = 0; i < this.newanotherLists.length; i++) {
          datalist.push({ waferId: this.newanotherLists[i].waferId })
        }
      } else {
        if (this.anotherLists.length === 0) {
          this.$message({
            type: 'error',
            message: '请先添加入库审核列表!'
          })
          return
        }
        for (let i = 0; i < this.anotherLists.length; i++) {
          datalist.push({ waferId: this.anotherLists[i].waferId })
        }
      }
      if (!this.ifCheck && this.modelType === 0) {
        this.$message({
          type: 'error',
          message: '请先自动检查通过后，再提交!'
        })
        return
      }
      this.isDisabled = true
      const params = {
        code: this.codeNo,
        creator: sessionStorage.getItem('User-Id'),
        remark: this.modelRemark,
        type: this.modelType,
        createTime: this.formatDate(this.modelTime),
        details: datalist
      }
      insertNew(params).then(res => {
        this.isDisabled = false
        if (res.code === 0) {
          if (res.data !== null && res.data !== '') {
            this.$message({
              type: 'success',
              message: '操作成功! 单号：' + this.codeNo + '重名，现已变更为新单号：' + res.data
            })
          } else {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
          this.addDialogVisible = false
          this.baofeiDialogVisible = false
          this.fetchData()
        }
      }, res => {
        this.isDisabled = false
      })
    },
    // 取消
    resetForm() {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.baofeiDialogVisible = false
      this.HandleDialogVisible = false
      this.checkReason = false
      this.printVisible = false
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
      if (this.newanotherLists.length > 0) {
        this.$confirm('切换数据单类型会清空入库明细列表，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.checkErrorList = []
          this.newanotherLists = []
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
      this.modelTime = new Date(row.createTime)
      this.modelRemark = row.remark
      this.findWaferInfo()
    },
    // 编辑
    handleEdit(row) {
      this.editDialogVisible = true
      this.rowInfo = row
      this.codeNo = row.code
      this.modelType = row.type
      this.modelTime = new Date(row.createTime)
      this.modelRemark = row.remark
      this.findWaferInfo()
    },
    handelRow(row) {
      this.HandleDialogVisible = true
      this.rowInfo = row
      this.errorTotal = 0
      this.findWaferInfo()
    },
    handleStrageups(index) {
      // this.removeLists.push(this.anotherList1[index])
      this.anotherList1.splice(index, 1)
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
            lastErrorIndex = i - 1
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
          ids.push(item.detailId)
        }
      }
      if (ids.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要处理的列表!'
        })
        return
      }
      this.isDisabled = true
      updateWaferNoraml({ ids: ids.join(), id: this.rowInfo.id }).then(res => {
        this.isDisabled = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '处理成功!'
          })
          this.HandleDialogVisible = false
          this.fetchData()
        }
      }, res => {
        this.isDisabled = false
      })
    },
    printDiv() {
      this.printDialogVisible = false
      this.$print(this.$refs.print)
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

