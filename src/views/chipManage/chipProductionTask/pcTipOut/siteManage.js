
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { siteList } from '@/api/processManagement/siteManage'
import { fetchCardInfo, fetchList, craftList } from '@/api/processManagement/proceCardManage'
import { getList, accept, info, cateGoryFind, getElectrode, backThe } from '@/api/chipManage/pcTipOut'
import { fetchColorList } from '@/api/processManagement/proceCardManage'
import { findMachineUser } from '@/api/chipManage/rearSiteManage/tensileTest'
import { findProductCode } from '@/api/chipManage/rearSiteManage/cowInfo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      siveDialogVisible: false,
      viewTagDialogVisible: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      viewDeatilDialogVisible: false,
      selectTheadVisble: false,
      timeRadio: '0',
      activeTabIndex: 0,
      addIndex: 0,
      box: 5,
      waferTotalNum: 121,
      labelUrl: '',
      currentBatchNo: '',
      list: [],
      colorList: [],
      endList: [],
      leftList: [],
      rightList: [],
      modelList: [],
      detailList: [],
      forepartSiteOptions: [],
      endSiteOptions: [],
      selectedRow: {},
      currentProceCard: {},
      waferTol: 0,
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      finishBeginDate: '',
      endDate: '',
      finishEndDate: '',
      crrentCode: '',
      currentCraftId: '',
      crrentCopyId: '',
      currentCardType: '',
      currentCardName: '',
      currentCraft: '',
      currentRemark: '',
      currentStatus: '',
      currentCreateTime: '',
      currentUpdateTime: '',
      currentCreator: '',
      currentModifier: '',
      currentModelList: [],
      dialogList: [],
      dialogEndList: [],
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
      searchKeys: {
        rwdh: '',
        lck: '',
        tplx: '',
        gs: '',
        dj: '',
        cpxh: '',
        tpr: '',
        jjd: '',
        bx: '',
        gy: ''
      },
      processCardOptions: [
        { name: 1, id: 1 }
      ],
      colorOptions: [],
      castPieceTypeOptions: [],
      electrodeOptions: [],
      modelOptions: [
        { name: '圆片', id: 0 },
        { name: '方片', id: 1 }
      ],
      emergencyOptions: [
        { name: '加急', id: 1 },
        { name: '正常', id: 0 }
      ],
      degreeOptions: [],
      craftOptions: [],
      userOptions: [],
      productCodeList: [],
      electrodeList: [],
      theadOptions: [
        { thName: '芯片型号', thKey: 'model' },
        { thName: '芯片尺寸', thKey: 'measure' },
        { thName: '电极', thKey: 'electrode' },
        { thName: '切割道', thKey: 'cuttingWay' },
        { thName: '标准产出', thKey: 'standardOutput' },
        { thName: '外延规格', thKey: 'specification' },
        { thName: '背镀', thKey: 'backPlating' },
        { thName: '芯片工艺', thKey: 'chipCraft' },
        { thName: '电极工艺', thKey: 'electrodeCraft' },
        { thName: '研磨厚度', thKey: 'grindPly' },
        { thName: '切割工艺', thKey: 'cutCraft' },
        { thName: 'COW测试条件', thKey: 'cowTest' },
        { thName: 'COT电流测试条件', thKey: 'currentTest' },
        { thName: 'COT测试档', thKey: 'cotTest' },
        { thName: 'COT亮度单位', thKey: 'ldunit' },
        { thName: 'COT ESD是否全测', thKey: 'cotEsd' },
        { thName: 'COT IR测试条件', thKey: 'cotIr' },
        { thName: '目检吸边', thKey: 'visual' },
        { thName: 'TAPNO', thKey: 'tapno' },
        { thName: 'Mapping图', thKey: 'mapping' },
        { thName: '投片时间', thKey: 'throwTime' },
        { thName: '投片人', thKey: 'throwPeople' }
      ],
      formThead: [],
      formTheadOptions: [
        '芯片型号',
        '芯片尺寸',
        '电极',
        '切割道',
        '标准产出',
        '外延规格',
        '背镀',
        '芯片工艺',
        '电极工艺',
        '研磨厚度',
        '切割工艺',
        'COW测试条件',
        'COT电流测试条件',
        'COT测试档',
        'COT亮度单位',
        'COT ESD是否全测',
        'COT IR测试条件',
        '目检吸边',
        'TAPNO',
        'Mapping图',
        '投片时间',
        '投片人'
      ],
      checkboxVal: [
        '芯片型号',
        '芯片尺寸',
        '电极',
        '切割道',
        '标准产出',
        '外延规格',
        '背镀',
        '芯片工艺',
        '电极工艺',
        '研磨厚度',
        '切割工艺',
        'COW测试条件',
        'COT电流测试条件',
        'COT测试档',
        'COT亮度单位',
        'COT ESD是否全测',
        'COT IR测试条件',
        '目检吸边',
        'TAPNO',
        'Mapping图',
        '投片时间',
        '投片人'
      ],
      machineForm: {
        code: '',
        name: '',
        remark: ''
      },
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  computed: {
    totalNum() {
      let num = 0
      this.leftList.map(item => {
        num += item.throwNum
      })
      return num
    }
  },
  mounted() {
    this.fetchData()
    this.getProceCard()
    this.cateGoryFindFun()
    this.getCraftList()
    this.getColorList()
    this.getElectrodeList()
    this.findProductCodeFun()
    this.findMachineUserFun()
    this.formThead = this.theadOptions
    this.checkboxVal = localStorage.getItem('pcTipHeaders') === null ? this.formTheadOptions : localStorage.getItem('pcTipHeaders').split(',')
    this.setThead(this.checkboxVal)
  },
  methods: {
    // 返工单号预览
    viewFgProgress() {

    },
    // 获取产品码
    findProductCodeFun() {
      findProductCode({}).then(res => {
        this.productCodeList = res.data
      })
    },
    viewTag(url) {
      this.labelUrl = '/images/' + url
      this.viewTagDialogVisible = true
    },
    // 所有工艺
    getCraftList() {
      const requestParams = {
        pageSize: 1000,
        pageNum: 1
      }
      craftList(requestParams).then(res => {
        this.craftOptions = res.data.list
      })
    },
    // 人员
    findMachineUserFun() {
      findMachineUser({ pageSize: 1000, pageNum: 1 }).then(res => {
        this.userOptions = res.data.list
      })
    },
    // 获取电极
    getElectrodeList() {
      getElectrode({}).then(res => {
        this.electrodeList = res.data
      })
    },
    // 获取光色
    getColorList() {
      fetchColorList({}).then(res => {
        this.colorList = res.data
      })
    },
    // 获取投片类型
    cateGoryFindFun() {
      cateGoryFind({}).then(res => {
        this.castPieceTypeOptions = res.data
      })
    },
    viewDetailCard(id) {
      console.log(123)
      this.processCardOptions.map(item => {
        if (item.id === parseInt(id)) {
          this.crrentCopyId = item.id
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
          this.getProceCodeModel(id)
        }
      })
    },
    // 复制流程卡请求型号
    getProceCodeModel(id) {
      console.log(id)
      const requestParams = {
        id
      }
      fetchCardInfo(requestParams).then(res => {
        var arr = []
        if (res.data.modelList[0] !== null) {
          res.data.modelList.map((item) => {
            arr.push({
              color: item.color,
              modelName: item.modelList
            })
          })
        }
        this.currentModelList = arr
        this.setCopyProce(res.data.processList)
      })
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
      this.dialogEndList = endProce
      this.siveDialogVisible = true
    },
    // 获取流程卡
    getProceCard() {
      const params = {
        pageNum: 1,
        pageSize: 1000
      }
      fetchList(params).then(res => {
        this.processCardOptions = res.data.list
      })
    },
    setThead(checkboxVal) {
      var arr = []
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val) {
            arr.push(item)
          }
        })
      })
      this.formThead = arr
    },
    selectThead() {
      this.selectTheadVisble = !this.selectTheadVisble
    },
    submitOption() {
      const arr = []
      console.log(this.checkboxVal)
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val) {
            arr.push(item)
          }
        })
      })
      localStorage.setItem('pcTipHeaders', this.checkboxVal)
      this.formThead = arr
      this.selectTheadVisble = false
    },
    resetOption() {
      this.selectTheadVisble = false
    },
    labelHead(h, { column, index }) {
      const l = column.label.length
      const f = 16 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.minWidth = l < 6 ? 120 : f * l // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h('div', { class: 'table-head', style: { width: '100%' }}, [column.label])
    },
    handleAccept(row) {
      this.$confirm('是否确认接收此生产任务单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestParams = {
          orderNo: row.orderNo,
          recipient: sessionStorage.getItem('User-Id')
        }
        accept(requestParams).then(res => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      })
    },
    leftRowClick(row) {
      this.selectedRow = row
      this.waferTotalNum = row.throwNum
      this.currentBatchNo = row.batchNo
      this.rightList = row.sliceInfo
    },
    viewDeatil(row) {
      console.log(row)
      this.detailList = []
      this.detailList[0] = row
      console.log(this.detailList)
      const requestParams = {
        orderNo: row.orderNo
      }
      info(requestParams).then(res => {
        this.viewDeatilDialogVisible = true
        this.leftList = res.data.batchInfo
        if (this.leftList.length !== 0) {
          this.rightList = res.data.batchInfo[0].sliceInfo
          this.currentBatchNo = res.data.batchInfo[0].batchNo
          this.waferTotalNum = res.data.batchInfo[0].throwNum
          setTimeout(() => {
            this.$refs.leftTable.setCurrentRow(this.leftList[0])
          }, 500)
        } else {
          this.rightList = []
        }
      })
    },
    // 重置
    clearSearch() {
      this.searchKeys.rwdh = ''
      this.searchKeys.lck = ''
      this.searchKeys.tplx = ''
      this.searchKeys.gs = ''
      this.searchKeys.dj = ''
      this.searchKeys.cpxh = ''
      this.searchKeys.tpr = ''
      this.searchKeys.bx = ''
      this.searchKeys.jjd = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearch()
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
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    tabClick(index) {
      this.activeTabIndex = index
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
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderNo: this.searchKeys.rwdh,
        flowCard: this.searchKeys.lck,
        throwType: this.searchKeys.tplx,
        lightColor: this.searchKeys.gs,
        pole: this.searchKeys.dj,
        throwTimeStart: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        throwTimeEnd: this.endDate === '' ? '' : this.formatDate(this.endDate),
        productType: this.searchKeys.cpxh,
        throwPeople: this.searchKeys.tpr,
        editionType: this.searchKeys.bx,
        emergency: this.searchKeys.jjd,
        technology: this.searchKeys.gy
      }
      getList(params).then(res => {
        res.data.list.map(item => {
          item.mapping = item.mapping === '0' ? '否' : '是'
          item.cotEsd = item.cotEsd === '0' ? '否' : '是'
          item.visual = item.cotEsd === '0' ? '吸边' : '不吸边'
          item.backPlating = item.backPlating === '0' ? '无' : '有'
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      this.machineForm.code = ''
      this.machineForm.name = ''
      this.machineForm.remark = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
    },
    handleBack(row) {
      this.$confirm('是否确认退回此生产任务单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestParams = {
          orderNo: row.orderNo,
          recipient: sessionStorage.getItem('User-Id')
        }
        backThe(requestParams).then(res => {
          this.fetchData()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      })
    }
  }
}

