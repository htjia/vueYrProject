
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { siteList } from '@/api/processManagement/siteManage'
import { findSubstrateMeasureList, waitList, hasList, customerList, productList, gyFlowCardFind, submitWrok, reworkNo, findProcessAndModel, fetchCardInfo } from '@/api/chipManage/abnormalManage/reworkManage'
import { printLabel } from '@/api/pcChipCasting/pcChipCasting'
import Cookies from 'js-cookie'
import Sortable from 'sortablejs'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      addDialogVisible1: false,
      printDialogVisible: false,
      list: [],
      isActive: 0,
      userLists: [],
      measureList: [],
      productLists: [],
      flowList: [],
      batchNo: '',
      productModel: '',
      size: '',
      creator: '',
      reworkFlowCardId: '',
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
      beginDate1: '',
      endDate1: '',
      pickerOptionsStart1: {
        disabledDate: (time) => {
          const endDateVal = this.endDate1
          if (endDateVal) {
            return time.getTime() > endDateVal
          }
        }
      },
      pickerOptionsEnd1: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate1
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      infoList: [],
      backList: [],
      chipList: [],
      multipleSelection: [],
      isOpen: true,
      rowInfo: null,
      crrentCode: '',
      currentCardType: '',
      currentCardName: '',
      currentCraft: '',
      currentCraftId: '',
      currentRemark: '',
      currentStatus: '',
      currentCreateTime: '',
      currentUpdateTime: '',
      currentCreator: '',
      currentModifier: '',
      innerVisible: false,
      currentModelList: [],
      forepartSiteOptions: [],
      endSiteOptions: [],
      dialogList: [],
      dialogEndList: [],
      rowInfos: null,
      isShowMenu: {
        'xpproductionManage-back-printlabel': false
      }
    }
  },
  mounted() {
    var _this = this
    setTimeout(function() {
      const roleInfo = sessionStorage.getItem('roleInfo')
      if (roleInfo !== undefined && roleInfo !== null) {
        const roleList = JSON.parse(roleInfo)
        for (const item of roleList) {
          if (item.path === 'xpproductionManage') {
            for (const items of item.children) {
              if (items.path === 'abnormalManage') {
                for (const citems of items.children) {
                  if (citems.path === 'reworkManage') {
                    const menus = citems.funIds.split(',')
                    for (const menu of menus) {
                      _this.isShowMenu[menu] = true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }, 500)
    const isbackready = Cookies.get('isbackready')
    if (isbackready !== null && isbackready !== '' && isbackready !== undefined) {
      this.isActive = 1
      Cookies.remove('isbackready')
    }
    this.fetchData()
    this.gyFlowCardFind()
    this.findSubstrateMeasureList()
    this.productList()
    this.customerList()
  },
  methods: {
    gyFlowCardFind() {
      gyFlowCardFind().then(res => {
        this.flowList = res.data.list
      })
    },
    // 查询
    findSubstrateMeasureList() {
      findSubstrateMeasureList().then(res => {
        this.measureList = res.data
      })
    },
    // 查询
    productList() {
      productList().then(res => {
        this.productLists = res.data
      })
    },
    // 查询
    customerList() {
      customerList().then(res => {
        this.userLists = res.data.list
      })
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
    clearAll() {
      this.pageNum = 1
      this.batchNo = ''
      this.productModel = ''
      this.size = ''
      this.creator = ''
      this.reworkFlowCardId = ''
      this.beginDate = ''
      this.beginDate1 = ''
      this.endDate = ''
      this.endDate1 = ''
      this.fetchData()
    },
    tipOut() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择需要返工的数据!'
        })
        return
      }
      if (!this.isOpen) {
        this.$message({
          type: 'error',
          message: '提交返工类型选择不一致!'
        })
        return
      }
      if (this.multipleSelection.length > 24) {
        this.$message({
          type: 'error',
          message: '选择片数大于24片!'
        })
        return
      }
      this.addDialogVisible1 = true
      const params = {
        batchNo: this.multipleSelection[0].batchNo
      }
      this.infoList = []
      this.backList = []
      this.chipList = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.chipList.push({
          index: i + 1,
          id: this.multipleSelection[i].id,
          laserMark: this.multipleSelection[i].laserMark,
          waferNo: this.multipleSelection[i].waferNo
        })
      }
      if (this.multipleSelection.length < 24) {
        for (let i = this.multipleSelection.length; i < 24; i++) {
          this.chipList.push({
            index: i + 1,
            id: '',
            laserMark: '',
            waferNo: ''
          })
        }
      }
      this.findProcessAndModel(this.multipleSelection[0].reworkFlowCardId, this.multipleSelection[0].initialFlowCardId)
      reworkNo(params).then(res => {
        this.infoList.push({
          num: this.multipleSelection.length,
          batchNo: res.data,
          productModel: this.multipleSelection[0].productModel,
          craft: this.multipleSelection[0].craft,
          initialFlowCardId: this.multipleSelection[0].initialFlowCardId
        })
      })
      const _this = this
      setTimeout(function() {
        _this.rowDrop()
      }, 1000)
    },
    // 上移
    handleUp(index) {
      if (index > 0) {
        const upDate = this.chipList[index - 1]
        this.chipList.splice(index - 1, 1)
        this.chipList.splice(index, 0, upDate)
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    // 下移
    handleDown(index) {
      if ((index + 1) === this.chipList.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else {
        const downDate = this.chipList[index + 1]
        this.chipList.splice(index + 1, 1)
        this.chipList.splice(index, 0, downDate)
      }
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.left .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.chipList.splice(oldIndex, 1)[0]
          _this.chipList.splice(newIndex, 0, currRow)
        }
      })
    },
    findProcessAndModel(reworkFlowCardId, initialFlowCardId) {
      if (reworkFlowCardId !== null) {
        const params = {
          id: reworkFlowCardId
        }
        findProcessAndModel(params).then(res => {
          this.backList = res.data.processList
        })
      }
      if (initialFlowCardId !== null) {
        const paramss = {
          id: initialFlowCardId
        }
        findProcessAndModel(paramss).then(res => {
          res.data.processList.map((item) => {
            if (item.type !== 0) {
              this.backList.push(item)
            }
          })
        })
      }
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
    // 查询
    fetchData() {
      this.listLoading = true
      if (this.isActive === 0) {
        const params = {
          pageNum: 1,
          pageSize: 100000,
          startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
          endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
          submitTimeStart: this.beginDate1 === '' ? '' : this.formatDate(this.beginDate1),
          submitTimeEnd: this.endDate1 === '' ? '' : this.formatDate(this.endDate1),
          productModel: this.productModel,
          batchNo: this.batchNo,
          size: this.size,
          creator: this.creator,
          reworkFlowCardId: this.reworkFlowCardId
        }
        waitList(params).then(res => {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      } else {
        const params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
          endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
          submitTimeStart: this.beginDate1 === '' ? '' : this.formatDate(this.beginDate1),
          submitTimeEnd: this.endDate1 === '' ? '' : this.formatDate(this.endDate1),
          productModel: this.productModel,
          batchNo: this.batchNo,
          size: this.size,
          creator: this.creator,
          reworkFlowCardId: this.reworkFlowCardId
        }
        hasList(params).then(res => {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        })
      }
    },
    // Run信息/Wafer信息切换
    navClick(index) {
      this.isActive = index
      this.fetchData()
    },
    // 添加
    handleAdd(row) {
      this.addDialogVisible = true
      this.infoList = []
      this.backList = []
      this.chipList = []
      this.rowInfos = row
      if (row.reworkFlowCard === '--') {
        this.infoList.push({
          num: row.details.length,
          batchNo: row.batchNo,
          productModel: row.productModel,
          craft: row.craft,
          reworkProcess: row.reworkProcess
        })
      } else {
        this.infoList.push({
          num: row.details.length,
          batchNo: row.batchNo,
          productModel: row.productModel,
          craft: row.craft
        })
        this.findProcessAndModel(row.reworkFlowCardId, row.initialFlowCardId)
      }

      this.chipList = row.details
    },
    prints() {
      this.$print(this.$refs.prints)
      // this.printDialogVisible = true
    },
    printDiv() {
      this.printDialogVisible = false
      this.$print(this.$refs.print)
    },
    submitWrok() {
      const list = []
      for (let i = 0; i < this.chipList.length; i++) {
        if (this.chipList[i].id !== '') {
          list.push({
            serialNum: i + 1,
            id: this.chipList[i].id,
            waferNo: this.chipList[i].waferNo,
            initialFlowCardId: this.infoList[0].initialFlowCardId
          })
        }
      }
      if (list.length === 0) {
        this.$message({
          type: 'error',
          message: '没有需要返工的芯片!'
        })
        return
      }
      const param = {
        batchNo: this.infoList[0].batchNo,
        creator: sessionStorage.getItem('User-Id'),
        details: list
      }
      submitWrok(param).then(res => {
        this.$message({
          type: 'success',
          message: '提交成功!'
        })
        this.addDialogVisible1 = false
        this.fetchData()
      })
    },
    printLabel() {
      const lists = []
      for (const item of this.chipList) {
        const list = []
        list.push({ key: 'waferNo', value: item.waferNo })
        lists.push(list)
      }
      const params = {
        module: 'backwafer',
        contents: lists
      }
      printLabel(params).then(res => {
        this.$message({
          type: 'success',
          message: '标签正在打印中，请稍候！'
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      const vl = this.multipleSelection[0]
      if (this.multipleSelection.length > 1) {
        for (let i = 1; i < this.multipleSelection.length; i++) {
          if (vl.productModel !== this.multipleSelection[i].productModel || vl.size !== this.multipleSelection[i].size || vl.craft !== this.multipleSelection[i].craft || vl.initialFlowCardId !== this.multipleSelection[i].initialFlowCardId) {
            this.isOpen = false
            break
          }
        }
      } else {
        this.isOpen = true
      }
      if (!this.isOpen) {
        this.$message({
          type: 'error',
          message: '提交返工类型选择不一致!'
        })
      }
      if (this.multipleSelection.length > 24) {
        this.$message({
          type: 'error',
          message: '选择片数大于24片!'
        })
      }
    },
    // 弹框内查看按钮
    handleReview(row) {
      this.getForepartSiteList()
      this.getEndSiteList()
      this.rowInfo = row
      const requestParams = {
        pageNum: 1,
        pageSize: 100000
      }
      gyFlowCardFind(requestParams).then(res => {
        for (const item of res.data.list) {
          if (item.id === this.rowInfo.reworkFlowCardId) {
            this.crrentCode = item.code
            this.currentCardType = item.type
            this.currentCardName = item.name
            this.currentCraft = item.craftName
            this.currentCraftId = item.craftId
            this.currentRemark = item.remark
            this.currentStatus = item.status
            this.currentCreateTime = item.createTime
            this.currentUpdateTime = item.lastUpdateTime
            this.currentCreator = item.creator
            this.currentModifier = item.modifier
            break
          }
        }
      })
      this.dialogEndList = []
      this.dialogList = []
      this.getProceCodeModel(row.reworkFlowCardId, row.initialFlowCardId)
      this.innerVisible = true
    },
    deleteXP(index) {
      this.chipList.splice(index, 1)
    },
    // 复制流程卡请求型号
    getProceCodeModel(id, initialFlowCardId) {
      if (id !== null) {
        const requestParams = {
          id
        }
        fetchCardInfo(requestParams).then(res => {
          var arr = []
          res.data.modelList.map((item) => {
            if (item !== null) {
              arr.push({
                color: item.color,
                modelName: item.modelList
              })
            }
          })
          this.currentModelList = arr
          this.setCopyProce(res.data.processList)
        })
      }
      if (initialFlowCardId !== null) {
        const requestParamss = {
          id: initialFlowCardId
        }
        fetchCardInfo(requestParamss).then(res => {
          this.setCopyProceend(res.data.processList)
        })
      }
    },
    setCopyProce(data) {
      const firstProce = []
      const endProce = []
      data.map((item) => {
        if (item.type === 0) {
          firstProce.push(item)
        } else {
          endProce.push(item)
        }
      })
      this.dialogList = firstProce
      // this.dialogEndList = endProce
    },
    setCopyProceend(data) {
      const firstProce = []
      const endProce = []
      data.map((item) => {
        if (item.type === 0) {
          firstProce.push(item)
        } else {
          endProce.push(item)
        }
      })
      // this.dialogList = firstProce
      this.dialogEndList = endProce
    },
    // 所有前段站点
    getForepartSiteList() {
      const requestParams = {
        type: 0,
        status: 0,
        pageSize: 1000,
        pageNum: 1
      }
      siteList(requestParams).then(res => {
        this.forepartSiteOptions = res.data.list
      })
    },
    // 所有后段站点
    getEndSiteList() {
      const requestParams = {
        type: 1,
        status: 0,
        pageSize: 1000,
        pageNum: 1
      }
      siteList(requestParams).then(res => {
        this.endSiteOptions = res.data.list
      })
    }
  }
}

