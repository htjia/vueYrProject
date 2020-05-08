
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getList, nextProcessList, nowProcessList, update, findShopList, findSiteList, exceptQuery, findProgram, exceptConfig } from '@/api/chipManage/transitSiteConfig'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      editing: false,
      setShow: false,
      shopDisabled: true,
      siteDisabled: true,
      abnormalConfigVisible: false,
      deleteDialogVisible: false,
      configDialogVisible: false,
      commonViewChecked: false,
      configGlueDialogVisible: false,
      configPhotoetchingDialogVisible: false,
      configRoastDialogVisible: false,
      configGkjtbDialogVisible: false,
      configGlueCoatingDialogVisible: false,
      configPebDialogVisible: false,
      configEvaporationDialogVisible: false,
      configEtchDialogVisible: false,
      configFuseDialogVisible: false,
      configDepositionDialogVisible: false,
      configAnnealDialogVisible: false,
      configMicroscopyDialogVisible: false,
      spliceConfigDialogVisible: false,
      zdSubmit: false,
      checked2: true,
      checked3: true,
      activeTabIndex: 0,
      currentProcessId: '',
      beforeProcessId: '',
      afterProcessIdArr: [],
      nowProcessList: [],
      currentSiteId: '',
      copyParamsData: [],
      spliceProcessList: [],
      paramsData: [],
      programList: [],
      shopList: [],
      siteList: [],
      processOptions: [],
      multipleSelection: [],
      allProcessList: [],
      handParams: [],
      handTestParams: [],
      autoParams: [],
      autoTestParams: [],
      currentRow: {},
      list: [
        { checkList: [], site: '清洗' },
        { checkList: [], site: '腐蚀' },
        { checkList: [], site: '打胶' },
        { checkList: [], site: '去胶' },
        { checkList: [], site: '光刻' },
        { checkList: [], site: '硬烤' },
        { checkList: [], site: '光刻胶涂布' },
        { checkList: [], site: '底胶涂布' },
        { checkList: [], site: 'PEB' },
        { checkList: [], site: '蒸镀' },
        { checkList: [], site: '蚀刻' },
        { checkList: [], site: '熔合' },
        { checkList: [], site: '沉积' },
        { checkList: [], site: '退火' },
        { checkList: [], site: '去胶镜检' },
        { checkList: [], site: '光刻镜检' },
        { checkList: [], site: '腐蚀镜检' },
        { checkList: [], site: '出站前检查' }
      ],
      baseList: [{ plant: '', site: '', process: '' }],
      paramsList: [{}],
      baseInfo: [
        { name: '机台号' },
        { name: '槽号' },
        { name: '累计片数' },
        { name: '阈值' },
        { name: '操作员' },
        { name: '备注' }
      ],
      paramsInfo: [
        { name: '溶液温度（设定）℃' },
        { name: '腐蚀时间（设定）分钟' }
      ],
      // 打胶
      baseGlueInfo: [
        { name: '机台号' },
        { name: '操作员' },
        { name: '备注' }
      ],
      paramsGlueInfo: [
        { name: '程序名' }
      ],
      // 光刻
      photoetchingInfo: [
        { name: '机台号' },
        { name: '原材料' },
        { name: '累计片数' },
        { name: '阈值' },
        { name: '操作员' },
        { name: '备注' }
      ],
      // 光刻胶涂布
      photoetchingJtbInfo: [
        { name: '机台号' },
        { name: '胶管号' },
        { name: '累计片数' },
        { name: '阈值' },
        { name: '操作员' },
        { name: '备注' }
      ],
      paramsJtbInfo: [
        { name: '涂布温度（设定）℃' },
        { name: '涂布时间（设定）分钟' }
      ],
      // 底胶涂布
      djtbInfo: [
        { name: '机台号' },
        { name: '累计片数' },
        { name: '阈值' },
        { name: '操作员' },
        { name: '备注' }
      ],
      // PEB
      paramsPebInfo: [
        { name: '烘烤温度（设定）℃' },
        { name: '烘烤时间（设定）分钟' }
      ],
      // 蒸镀
      evaporationInfo: [
        { name: '机台号' },
        { name: '操作员' },
        { name: '备注' }
      ],
      paramsEvaporationInfo: [
        { name: 'Run编号' },
        { name: '蒸镀前重量（g）' }
      ],
      paramsEvaporationItoInfo: [
        { name: 'Run编号' }
      ],
      evaporationTestInfo: [
        { name: '蒸镀厚度' },
        { name: '蒸镀前重量' },
        { name: '蒸镀后重量' },
        { name: '净重量' },
        { name: '备注' }
      ],
      evaporationItoTestInfo: [
        { name: '片电阻' },
        { name: '峰值波长' },
        { name: '峰值透光度' },
        { name: '460nm透光度' },
        { name: '备注' }
      ],
      // 沉积
      depositionTestInfo: [
        { name: '膜厚' },
        { name: '折射率' }
      ],
      paramsDepositionInfo: [
        { name: '程序名' }
      ],
      // 蚀刻
      etchTestInfo: [
        { name: '蚀刻深度（13#）' },
        { name: '蚀刻深度（20#）' }
      ],
      sendInfo: [
        { name: '操作员' },
        { name: '备注' }
      ],
      // 退火
      paramsAnnealInfo: [
        { name: '退火温度（设定）℃' },
        { name: '退火时间（设定）分钟' }
      ],
      djZhengDuProcess: [],
      itoZhengDuProcess: [],
      userOptions: [],
      proceOptions: [],
      spanArr: [],
      searchKeys: {
        site: '',
        sfgz: ''
      },
      operatorOptions: [
        { name: '≥', id: 0 },
        { name: '≤', id: 1 }
      ],
      transitOptions: [
        { name: '是', id: 0 },
        { name: '否', id: 1 }
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
      },
      isDisabled: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.setShow = true
    }, 500)
    this.getZdProcessListFun()
    this.fetchData()
    this.nextProcessListFun()
  },
  methods: {
    handleSearch() {

    },
    clearSearch() {
      console.log(1)
    },
    handleEdit() {
      this.editing = true
    },
    handleCancelSubmitEdit() {
      this.fetchData()
      this.editing = false
    },
    handleSubmitEdit() {
      if (this.isDisabled) {
        return
      }
      var arr = []
      let flag = false
      let siteName = ''
      this.list.map(item => {
        if (item.handParams !== undefined) { // 编辑过
          if (item.id === 11) { // 是蒸镀站点
            item.handParams.map(handP => {
              handP.processId = this.djZhengDuProcess.join(',')
            })
            item.handTestParams.map(handP => {
              handP.processId = this.djZhengDuProcess.join(',')
            })
            item.autoParams.map(handP => {
              handP.processId = this.itoZhengDuProcess.join(',')
            })
            item.autoTestParams.map(handP => {
              handP.processId = this.itoZhengDuProcess.join(',')
            })
          }
          item.oldParams = [...item.handParams, ...this.autoParams, ...this.handTestParams, ...this.autoTestParams]
          item.oldParams.map(i => {
            i.status = i.status ? 0 : 1
          })
        }
        console.log(item.nowProcessId)
        if (item.isSplit && item.splitList.length === 0) {
          flag = true
          siteName = item.siteName
        }
        arr.push({
          id: item.id,
          isDeliver: item.isDeliver ? 1 : 0,
          isPass: item.isPass ? 1 : 0,
          isReceive: item.isReceive ? 1 : 0,
          isSplit: item.isSplit ? 1 : 0,
          isUpslice: item.isUpslice ? 1 : 0,
          isStick: item.isStick ? 1 : 0,
          isGrind: item.isGrind ? 1 : 0,
          isPolish: item.isPolish ? 1 : 0,
          isClean: item.isClean ? 1 : 0,
          // nowProcess: item.nowProcess,
          // nowProcessId: item.nowProcessId,
          // nextProcess: item.nextProcess,
          // nextProcessId: item.nextProcessId,
          splitList: item.splitList,
          params: item.handParams !== undefined ? item.oldParams : item.params
        })
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: siteName + '站点拆批工序不能为空!'
        })
        return false
      }
      this.isDisabled = true
      this.listLoading = true
      console.log(arr)
      update(arr).then(res => {
        this.isDisabled = false
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
        this.editing = false
      }, () => {
        this.listLoading = false
        this.isDisabled = false
      })
    },
    tabClick(index) {
      this.activeTabIndex = index
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
          if (data[i].shopName === data[i - 1].shopName) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
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
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        siteId: this.searchKeys.site,
        isPass: this.searchKeys.sfgz
      }
      var siteQd = []
      var siteHd = []
      getList(params).then(res => {
        res.data.map(item => {
          // this.nowProcessListFun(item)
          item.isPass = item.isPass === 1
          item.isReceive = item.isReceive === 1
          item.isUpslice = item.isUpslice === 1
          item.isDeliver = item.isDeliver === 1
          item.isStick = item.isStick === 1 // 粘片
          item.isGrind = item.isGrind === 1 // 研磨
          item.isPolish = item.isPolish === 1 // 抛光
          item.isClean = item.isClean === 1 // 清洗
          item.isSplit = item.isSplit === 1
          if (item.type === 0) {
            siteQd.push(item)
          } else {
            siteHd.push(item)
          }
        })
        this.list = [...siteQd, ...siteHd]
        this.getSpanArr(this.list)
        this.listLoading = false
      })
    },
    // 获取所有工序
    nextProcessListFun() {
      nextProcessList({}).then(res => {
        this.allProcessList = res.data
      })
    },
    // 获取对应站点的工序
    nowProcessListFun(item) {
      nowProcessList({ siteId: item.id }).then(res => {
        item.nowProcessList = res.data
      })
    },
    nextChange(row) {
      if (row.nextProcessId === row.nowProcessId) {
        row.nextProcessId = ''
        this.$message({
          type: 'error',
          message: '拆批工序不能一致!'
        })
      }
    },
    // 异常配置
    abnormalConfig() {
      const param = {
        pageNum: 1,
        pageSize: 1000
      }
      findShopList(param).then(res => {
        this.shopList = res.data.list
        this.abnormalConfigVisible = true
      })
    },
    cancelAbnormalConfig() {
      this.baseList[0].plant = ''
      this.abnormalConfigVisible = false
    },
    shopChange(shopId) {
      this.baseList[0].site = ''
      this.baseList[0].process = ''
      this.currentSiteId = ''
      this.currentProcessId = ''
      this.paramsData = []
      findSiteList({ shopId }).then(res => {
        this.siteList = res.data
        this.shopDisabled = false
      })
    },
    siteChange(siteId) {
      this.currentSiteId = siteId
      this.baseList[0].process = ''
      this.currentProcessId = ''
      this.siteDisabled = false
      this.paramsData = []
      nowProcessList({ siteId }).then(res => {
        this.processOptions = res.data
      })
    },
    handleConfigClose() {
      this.baseList[0].plant = ''
      this.baseList[0].site = ''
      this.baseList[0].process = ''
      this.currentSiteId = ''
      this.currentProcessId = ''
      this.shopDisabled = true
      this.siteDisabled = true
      this.paramsData = []
    },
    processChange(processId) {
      this.currentProcessId = processId
      this.findProgramFun()
      exceptQuery({ processId, siteId: this.currentSiteId }).then(res => {
        res.data.map(item => {
          item.params.map(paramsItem => {
            console.log(paramsItem.paramValue)
            console.log(typeof paramsItem.paramValue)
            paramsItem.min = paramsItem.paramValue === null ? 0 : parseFloat(paramsItem.paramValue.split(',')[0])
            paramsItem.max = paramsItem.paramValue === null ? 0 : parseFloat(paramsItem.paramValue.split(',')[1])
          })
        })
        this.copyParamsData = JSON.parse(JSON.stringify(res.data[0]))
        this.paramsData = res.data
        // this.copyParamsData.params.map(paramsItem => {
        //   paramsItem.min = 0
        //   paramsItem.max = 0
        // })
        // console.log(this.copyParamsData)
      })
      this.siteDisabled = false
    },
    handlePush() {
      this.copyParamsData.programId = 0
      this.paramsData.push(JSON.parse(JSON.stringify(this.copyParamsData)))
    },
    programChange(index) {
      const arr = []
      this.paramsData.map((item, i) => {
        arr.push(item.programId)
      })
      const newArr = arr.sort()
      if (this.isRepeat(newArr)) {
        this.paramsData[index].programId = 0
        this.$message({
          type: 'error',
          message: '程序名重复!'
        })
      }
    },
    isRepeat(arr) {
      let flag = false
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === arr[i + 1]) {
          flag = true
        }
      }
      return flag
    },
    deleteItem(index) {
      this.$confirm('是否确认删除该异常配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.paramsData.splice(index, 1)
      })
    },
    findProgramFun() {
      const params = {
        processId: this.currentProcessId
      }
      findProgram(params).then(res => {
        res.data.unshift({
          id: 0,
          name: '请选择'
        })
        this.programList = res.data
      })
    },
    handleCloseSplice() {
      this.beforeProcessId = ''
      this.afterProcessIdArr = []
    },
    // 拆批配置
    handleSpliceConfig(row) {
      this.currentRow = row
      this.spliceProcessList = row.splitList
      this.spliceConfigDialogVisible = true
      nowProcessList({ siteId: row.id }).then(res => {
        this.nowProcessList = res.data
      })
    },
    handlePushConfig() {
      const arr = []
      console.log(this.afterProcessIdArr)
      this.afterProcessIdArr.map(item => {
        arr.push({
          nowProcessId: this.beforeProcessId.split('#')[0],
          nowProcess: this.beforeProcessId.split('#')[1],
          nextProcessId: item.split('#')[0],
          nextProcess: item.split('#')[1],
          siteId: this.currentRow.id
        })
      })
      this.spliceProcessList = [...arr, ...this.spliceProcessList]
      this.afterProcessIdArr = []
      this.setProcessDisabled()
    },
    setProcessDisabled() {
      this.allProcessList.map(item => {
        item.disabled = false
      })
      this.spliceProcessList.map(spliceItem => {
        this.allProcessList.map(item => {
          if (parseInt(item.id) === parseInt(spliceItem.nextProcessId) && parseInt(this.beforeProcessId) === parseInt(spliceItem.nowProcessId)) {
            item.disabled = true
          }
          if (parseInt(item.id) === parseInt(this.beforeProcessId)) {
            item.disabled = true
          }
        })
      })
    },
    submitProcessConfigForm() {
      this.$confirm('是否确认保存该配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.currentRow.splitList = this.spliceProcessList
        this.spliceConfigDialogVisible = false
      })
    },
    cancelProcessSpliceSubmit() {
      this.spliceConfigDialogVisible = false
    },
    deleteConfigItem(index) {
      this.spliceProcessList.splice(index, 1)
    },
    cancelSpliceSubmit() {
      this.spliceConfigDialogVisible = false
    },
    // 过站配置
    handleConfig(row) {
      switch (row.id) {
        case 1 : this.configDialogVisible = true // 清洗
          break
        case 2 : this.configDialogVisible = true // 腐蚀
          break
        case 3 : this.configGlueDialogVisible = true // 打胶
          break
        case 4 : this.configDialogVisible = true // 去胶
          break
        case 5 : this.configPhotoetchingDialogVisible = true // 光刻
          break
        case 6 : this.configRoastDialogVisible = true // 硬烤
          break
        case 7 : this.configDialogVisible = true // 光刻胶涂布
          break
        case 8 : this.configGlueCoatingDialogVisible = true // 底胶涂布
          break
        case 9 : this.configDialogVisible = true // 显影
          break
        case 10 : this.configPebDialogVisible = true // PEB
          break
        case 11 : this.configEvaporationDialogVisible = true // 蒸镀
          break
        case 12 : this.configEtchDialogVisible = true // 蚀刻
          break
        case 13 : this.configFuseDialogVisible = true // 熔合
          break
        case 14 : this.configDepositionDialogVisible = true // 沉积
          break
        case 15 : this.configAnnealDialogVisible = true // 退火
          break
        case 16 : this.configMicroscopyDialogVisible = true // 去胶镜检
          break
        case 17 : this.configMicroscopyDialogVisible = true // 光刻镜检
          break
        case 18 : this.configMicroscopyDialogVisible = true // 腐蚀镜检
          break
        case 19 : this.configMicroscopyDialogVisible = true // 出站前检查
          break
      }
      this.getParamsData(row)
      this.currentRow = row
      this.activeTabIndex = 0
    },
    // 获取蒸镀站点的工序
    getZdProcessListFun() {
      nowProcessList({ siteId: 11 }).then(res => {
        this.proceOptions = res.data
      })
    },
    getParamsData(row) {
      // pattern 0 自动  1 手动   如果是蒸镀站点则状态为（1 电极蒸镀  0 ITO蒸镀）
      // type 0 上片  1 传片
      // paramsType 0 基础  1 参数
      this.handParams = []
      this.handTestParams = []
      this.autoParams = []
      this.autoTestParams = []
      if (row.handParams === undefined) {
        console.log(row.params)
        row.params.map(item => {
          if (typeof item.status === 'number') {
            console.log(typeof item.status)
            item.status = item.status === 0
          }
          // 自动参数
          if (item.pattern === 1 && item.type === 0 && item.paramsType === 1) {
            this.handParams.push(item)
          }
          // 手动动参数
          if (item.pattern === 0 && item.type === 0 && item.paramsType === 1) {
            this.autoParams.push(item)
          }
          // 自动测试参数
          if (item.pattern === 1 && item.type === 1 && item.paramsType === 1) {
            this.handTestParams.push(item)
          }
          // 手动测试参数
          if (item.pattern === 0 && item.type === 1 && item.paramsType === 1) {
            this.autoTestParams.push(item)
          }
        })
        // 设置蒸镀使用工序范围
        console.log(row.id, '=======id')
        if (row.id === 11) {
          this.djZhengDuProcess = []
          this.djZhengDuProcessCopy = []
          this.itoZhengDuProcess = []
          this.itoZhengDuProcessCopy = []
          this.djZhengDuProcess = this.handParams[0].processId.split(',').map(Number)
          this.djZhengDuProcessCopy = [...this.djZhengDuProcess]
          this.itoZhengDuProcess = this.autoParams[0].processId.split(',').map(Number)
          this.itoZhengDuProcessCopy = [...this.itoZhengDuProcess]
        }
      } else {
        this.djZhengDuProcess = this.djZhengDuProcessCopy
        this.itoZhengDuProcess = this.itoZhengDuProcessCopy
        this.handParams = row.handParams
        this.autoParams = row.autoParams
        this.handTestParams = row.handTestParams
        this.autoTestParams = row.autoTestParams
      }
      console.log(this.handParams)
    },
    // 复选框状态改变
    changeFun(val) {
      this.multipleSelection = val
      console.log(val)
    },
    // 站点配置提交
    submitConfigForm() {
      this.djZhengDuProcessCopy = this.djZhengDuProcess
      this.itoZhengDuProcessCopy = this.itoZhengDuProcess
      this.cancelSubmit()
    },
    cancelZdSubmit() {
      this.configEvaporationDialogVisible = false
      this.djZhengDuProcess = this.djZhengDuProcessCopy
      this.itoZhengDuProcess = this.itoZhengDuProcessCopy
    },
    // 关闭
    handleClose(formName) {
      this.currentRow.handParams = this.handParams
      this.currentRow.autoParams = this.autoParams
      this.currentRow.handTestParams = this.handTestParams
      this.currentRow.autoTestParams = this.autoTestParams
    },
    cancelSubmit() {
      this.currentRow.handParams = this.handParams
      this.currentRow.autoParams = this.autoParams
      this.currentRow.handTestParams = this.handTestParams
      this.currentRow.autoTestParams = this.autoTestParams
      this.configDialogVisible = false
      this.configGlueDialogVisible = false
      this.configPhotoetchingDialogVisible = false
      this.configRoastDialogVisible = false
      this.configGkjtbDialogVisible = false
      this.configGlueCoatingDialogVisible = false
      this.configPebDialogVisible = false
      this.configEvaporationDialogVisible = false
      this.configEtchDialogVisible = false
      this.configFuseDialogVisible = false
      this.configDepositionDialogVisible = false
      this.configAnnealDialogVisible = false
      this.configMicroscopyDialogVisible = false
    },
    // 添加提交
    submitForm(formName) {
      var arr = []
      var flag = false
      var flagParams = false
      this.paramsData.map(item => {
        if (item.programId === 0) {
          flag = true
        }
        var params = []
        item.params.map(paramsItem => {
          if (parseInt(paramsItem.min) > parseInt(paramsItem.max)) {
            flagParams = true
          }
          console.log(paramsItem.min)
          if (paramsItem.min === '' || paramsItem.max === '') {
            flagParams = true
          }
          if (parseInt(paramsItem.min) === parseInt(paramsItem.max)) {
            flagParams = true
          }
          params.push({
            paramCnName: paramsItem.paramCnName,
            paramEnName: paramsItem.paramEnName,
            paramValue: paramsItem.min + ',' + paramsItem.max,
            programId: item.programId
          })
        })
        arr.push({
          programId: item.programId,
          params: params
        })
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: '程序名称不能为空!'
        })
        return false
      }
      if (flagParams) {
        this.$message({
          type: 'error',
          message: '阈值输入有误，请重试!'
        })
        return false
      }
      const params = {
        processId: this.currentProcessId,
        siteId: this.currentSiteId,
        xpExceptConfig: arr
      }
      console.log(params)
      exceptConfig(params).then(res => {
        this.baseList[0].plant = ''
        this.baseList[0].site = ''
        this.baseList[0].process = ''
        this.currentSiteId = ''
        this.currentProcessId = ''
        this.paramsData = []
        this.abnormalConfigVisible = false
        this.$message({
          type: 'success',
          message: '配置成功!'
        })
        this.fetchData()
      })
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}

