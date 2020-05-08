
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { proceList } from '@/api/processManagement/proceManage'
import { siteList } from '@/api/processManagement/siteManage'
import { cateGoryFind } from '@/api/chipManage/pcTipOut'
import { getList, getInfo, getInfoFromBatch, productData, pause, expectStop } from '@/api/chipManage/progressTracking'
import { fetchCardInfo, craftList, fetchList } from '@/api/processManagement/proceCardManage'
import { findProductCode } from '@/api/chipManage/rearSiteManage/cowInfo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      siveDialogVisible: false,
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      viewProgressVisible: false,
      selectTheadVisble: false,
      productionDataVisible: false,
      activeTabIndex: 0,
      addIndex: 0,
      paramsKey: 0,
      selectedRow: {},
      selectedList: [],
      craftOptions: [],
      productCodeList: [],
      accept: [],
      deliver: [],
      upSlice: [],
      paramsList: [],
      params: [],
      files: [],
      testParams: [],
      castPieceTypeOptions: [],
      currentBatchNo: '',
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
      list: [],
      sliceList: [],
      sliceListAll: [],
      sliceListStart: [],
      sliceListEnd: [],
      modelList: [],
      endList: [],
      forepartSiteOptions: [],
      tableObj: {},
      isActive: 0,
      tableCNlist: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一'],
      processOptions: [],
      endSiteOptions: [],
      detailList: [{}],
      detailRow: {},
      scheduleList: [],
      userOptions: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      finishBeginDate: '',
      endDate: '',
      finishEndDate: '',
      keyobj: [],
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
      finishPickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.finishEndDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      finishPickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.finishBeginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      searchKeys: {
        ph: '',
        lkh: '',
        tplx: '',
        dqzd: null,
        jjd: '',
        gylx: '',
        sczt: '',
        waferNo: '',
        cpxh: '',
        dqgx: null,
        sffg: '',
        dqclr: ''
      },
      processCardOptions: [],
      emergencyOptions: [
        { name: '加急', id: 1 },
        { name: '正常', id: 0 }
      ],
      reworkOptions: [
        { name: '是', id: 1 },
        { name: '否', id: 0 }
      ],
      theadOptions: [
        { thName: '数量', thKey: 'nowNum' },
        { thName: '投片时间', thKey: 'throwTime' },
        { thName: '投片人', thKey: 'throwPeople' },
        { thName: '操作员', thKey: 'operator' },
        { thName: '接片时间', thKey: 'receiveTime' },
        { thName: '下一站点', thKey: 'nextSite' },
        { thName: '下一工序', thKey: 'nextProcess' },
        { thName: '是否返工单', thKey: 'isRemakeText' },
        { thName: '累计生产时长(H)', thKey: 'totalTime' },
        { thName: '生产状态', thKey: 'status' },
        { thName: '入库时间', thKey: 'inputTime' }
      ],
      formThead: [],
      formTheadParams: [],
      formTheadUpParams: [],
      formTheadCParams: [],
      formTheadOptions: [
        '数量',
        '投片时间',
        '投片人',
        '操作员',
        '接片时间',
        '下一站点',
        '下一工序',
        '是否返工单',
        '累计生产时长(H)',
        '生产状态',
        '入库时间'
      ],
      checkboxVal: [
        '数量',
        '投片时间',
        '投片人',
        '操作员',
        '接片时间',
        '下一站点',
        '下一工序',
        '是否返工单',
        '累计生产时长(H)',
        '生产状态',
        '入库时间'
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
  mounted() {
    this.getProceCard()
    this.fetchData()
    this.getCraftList()
    this.cateGoryFindFun()
    this.getForepartSiteList()
    this.findProductCodeFun()
    this.formThead = this.theadOptions
    this.checkboxVal = localStorage.getItem('progressHeaders') === null ? this.formTheadOptions : localStorage.getItem('progressHeaders').split(',')
    this.setThead(this.checkboxVal)
  },
  methods: {
    viewDetailCard(id) {
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
    rowStyle({ row }) {
      if (row.flag === '0') {
        return 'background: rgb(222, 249, 241)'
      } else if (row.flag === '1') { // 当前站点
        return 'background: rgb(159, 236, 236); fontWeight: bold'
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
    // 获取投片类型
    cateGoryFindFun() {
      cateGoryFind({}).then(res => {
        this.castPieceTypeOptions = res.data
      })
    },
    // 获取产品代码
    findProductCodeFun() {
      findProductCode({}).then(res => {
        this.productCodeList = res.data
      })
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
    // 所有前段站点
    getForepartSiteList() {
      const requestParams = {
        status: 0,
        pageSize: 1000,
        pageNum: 1
      }
      siteList(requestParams).then(res => {
        this.forepartSiteOptions = res.data.list
      })
    },
    siteChange(nameAddSiteId) {
      if (nameAddSiteId !== null) {
        this.searchKeys.dqgx = null
        const requestParams = {
          siteId: nameAddSiteId.split('#')[1],
          pageNum: 1,
          pageSize: 10000,
          status: 0
        }
        proceList(requestParams).then(res => {
          this.processOptions = res.data.list
        })
      } else {
        this.processOptions = []
        this.searchKeys.dqgx = null
      }
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
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val) {
            arr.push(item)
          }
        })
      })
      localStorage.setItem('progressHeaders', this.checkboxVal)
      this.formThead = arr
      this.selectTheadVisble = false
    },
    resetOption() {
      this.selectTheadVisble = false
    },
    // 重置
    clearSearch() {
      this.searchKeys.ph = ''
      this.searchKeys.lkh = ''
      this.searchKeys.dqzd = null
      this.searchKeys.jjd = ''
      this.searchKeys.tplx = ''
      this.searchKeys.gylx = ''
      this.searchKeys.sczt = ''
      this.searchKeys.waferNo = ''
      this.searchKeys.cpxh = ''
      this.searchKeys.dqgx = null
      this.searchKeys.sffg = ''
      this.searchKeys.dqclr = ''
      this.beginDate = ''
      this.finishBeginDate = ''
      this.finishEndDate = ''
      this.endDate = ''
      this.handleSearch()
    },
    labelHead(h, { column, index }) {
      const l = column.label.length
      const f = 20 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.width = l < 3 ? 80 : f * l // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      if (column.label.includes('时') || column.label.includes('工序')) {
        column.width = 150
      }
      // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h('div', { class: 'table-head', style: { width: '100%' }}, [column.label])
    },
    mergeObject(item) {
      // 创建映射
      /* eslint-disable */
      var map = item.reduce((p, c) => [p[c.paramsCode] = p[c.paramsCode] || 0, p[c.paramsCode] += ',' + c.val, p][2], {})
      // 获取映射结果
      var arrayFilted = Object.keys(map).map(key => [{ paramsCode: key, val: map[key].substr(2) }][0])
      return arrayFilted
    },
    mergeObjectName(item) {
      // 创建映射
      /* eslint-disable */
      var map = item.reduce((p, c) => [p[c.paramsName] = p[c.paramsName] || 0, p[c.paramsName] = c.paramsCode, p][2], {})
      // 获取映射结果
      var arrayFilted = Object.keys(map).map(key => [{ thName: key, thKey: map[key] }][0])
      return arrayFilted
    },
    viewProductionData(row) {
      this.detailRow = row
      const params = {
        batchNo: this.selectedRow.batchNo,
        siteId: row.siteId,
        processId: row.processId,
        flowSteps: row.flowSteps,
        flowcardId: row.flowcardId,
        version: row.version,
        steps: row.steps
      }
      productData(params).then(res => {
        this.accept = res.data.accept
        this.deliver = res.data.deliver
        this.upSlice = res.data.upSlice
        // pattern 0 自动  1 手动
        // type 0 上片  1 传片
        // paramsType 0 基础  1 参数
        // status 0 启用  1 禁用
        const params = res.data.params.filter(item => { return (item.paramsType === 1 && item.type === 0) })
        const upParams = res.data.params.filter(item => { return (item.paramsType === 0 && item.type === 0) })
        const cParams = res.data.params.filter(item => { return (item.paramsType === 1 && item.type === 1) })
        // 获取合并val 值的参数
        this.paramsList = this.mergeObject(params)
        const upParamsList = this.mergeObject(upParams)
        const cParamsList = this.mergeObject(cParams)
        // 参数的行数
        if (this.paramsList.length !== 0) {
          var mun = this.paramsList[0].val.split(',').length
          for (var i = 0; i < mun; i++) {
            var objs = {}
            this.paramsList.map(item => {
              var key = item.paramsCode
              var val = item.val.split(',')[i] // 底i个参数值放到this.params数组的第i位
              objs[key] = val
            })
            this.params[i] = objs
          }
        } else {
          this.params = []
        }
        this.paramsKey++
        // 获取参数动态表头
        this.formTheadParams = this.mergeObjectName(params)
        // 获取上片参数动态表头
        this.formTheadUpParams = this.mergeObjectName(upParams)
        // 获取传片参数动态表头
        this.formTheadCParams = this.mergeObjectName(cParams)
        if (upParamsList.length !== 0) {
          var upNun = upParamsList[0].val.split(',').length
          for (var j = 0; j < upNun; j++) {
            upParamsList.map(item => {
              var key = item.paramsCode
              var val = item.val.split(',')[j] // 底i个参数值放到this.params数组的第i位
              this.upSlice[j][key] = val
            })
          }
        }
        if (cParamsList.length !== 0) {
          var cNun = cParamsList[0].val.split(',').length
          for (var k = 0; k < cNun; k++) {
            var cObjs = {}
            cParamsList.map(item => {
              var key = item.paramsCode
              var val = item.val.split(',')[k] // 底i个参数值放到this.params数组的第i位
              cObjs[key] = val
            })
            this.testParams[k] = cObjs
          }
        } else {
          this.testParams = []
        }
        this.files = res.data.files
      })
      this.productionDataVisible = true
    },
    setParamsList(data) {
      var arr = []
      data.forEach((item, index) => {
        if (arr.indexOf(item.paramsName)) {
          arr.push(item.paramsName)
        }
      })
    },
    download(row) {
      window.open(process.env.BASE_API + `/xp-produceTrack/down?id=${row.id}&siteId=${this.detailRow.siteId}&batchNo=${this.selectedRow.batchNo}&processId=${this.detailRow.processId}`)
    },
    downloadAll() {
      window.open(process.env.BASE_API + `/xp-produceTrack/down?siteId=${this.detailRow.siteId}&batchNo=${this.selectedRow.batchNo}&processId=${this.detailRow.processId}`)
    },
    // 查看返工批次
    viewFgProgress(batch) {
      console.log(batch)
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        batchNo: batch,
      }
      getList(params).then(res => {
        this.viewProgress(res.data.list[0])
      })
    },
    // 查看详情
    viewProgress(row) {
      this.currentBatchNo = row.batchNo
      this.selectedRow = row
      this.selectedList = []
      this.selectedList.push(row)
      this.isActive = 0
      getInfo({ batchNo: row.batchNo }).then(res => {
        this.tableObj = res.data
        this.keyobj = Object.keys(res.data)
        for (const keys of this.keyobj) {
          res.data[keys].map(item => {
            var timeArr = []
            var upTimeArr = []
            var deliverTimeArr = []
            var peopleArr = []
            var upPeopleArr = []
            var deliverPeopleArr = []
            var remarkArr = []
            var upRemarkArr = []
            var deliverRemarkArr = []
            var upNumArr = []
            var deliverNumArr = []
            item.received.map(sub => {
              if (sub !== null) {
                timeArr.push(sub.doTime)
                peopleArr.push(sub.doPeople)
                if (sub.remark !== '') {
                  remarkArr.push(sub.remark)
                }
                item['receivedTime'] = timeArr.join(',')
                item['receivedPeople'] = peopleArr.join(',')
                item['receivedRemark'] = remarkArr.join(',')
              }
            })
            item.upSlice.map(sub => {
              if (sub !== null) {
                upTimeArr.push(sub.doTime)
                upPeopleArr.push(sub.doPeople)
                upNumArr.push(sub.num)
                if (sub.remark !== '') {
                  upRemarkArr.push(sub.remark)
                }
                item['upTime'] = upTimeArr.join(',')
                item['upPeople'] = upPeopleArr.join(',')
                item['upRemark'] = upRemarkArr.join(',')
                item['upNewNum'] = upNumArr.reduce((total,item) => total = parseInt(total + '') + parseInt(item + ''))
              }
            })
            item.deliver.map(sub => {
              if (sub !== null) {
                deliverTimeArr.push(sub.doTime)
                deliverPeopleArr.push(sub.doPeople)
                deliverNumArr.push(sub.num)
                if (sub.remark !== '') {
                  deliverRemarkArr.push(sub.remark)
                }
                item['deliverTime'] = deliverTimeArr.join(',')
                item['deliverPeople'] = deliverPeopleArr.join(',')
                item['deliverRemark'] = deliverRemarkArr.join(',')
                item['deliverNewNum'] = deliverNumArr.reduce((total,item) => total = parseInt(total + '') + parseInt(item + ''))
              }
            })
          })
          res.data[keys].map(item => {
            item.deliverNum = item.deliverNum === 0 ? '' : item.deliverNum
            item.upNum = item.upNum === 0 ? '' : item.upNum
            item.upNum = item.upNum === '0' ? '' : item.upNum
            item.upNum = item.upNum === null ? '' : item.upNum
            item.deliverNum = item.deliverNum === 0 ? '' : item.deliverNum
            item.deliverNum = item.deliverNum === '0' ? '' : item.deliverNum
            item.deliverNum = item.deliverNum === null ? '' : item.deliverNum
          })
        }
        this.isActive = this.keyobj[this.keyobj.length - 1]
        this.scheduleList = this.tableObj[this.isActive]
        getInfoFromBatch({ batchNoList: row.batchNo }).then(res => {
          this.sliceListAll = res.data.batchInfo[0].detail
          this.sliceList = []
          if (this.sliceListAll[this.isActive] !== undefined) {
            this.sliceList = this.sliceListAll[this.isActive]
          }
        })
        this.viewProgressVisible = true
      })
    },
    navClick(type) {
      if (this.isActive !== type) {
        this.isActive = type
        this.scheduleList = this.tableObj[this.isActive]
        this.sliceList = []
        if (this.sliceListAll[this.isActive] !== undefined) {
          this.sliceList = this.sliceListAll[this.isActive]
        }
      }
    },
    productionDataClose() {
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
        batchNo: this.searchKeys.ph,
        laserMark: this.searchKeys.lkh,
        throwtype: this.searchKeys.tplx,
        nowSite: this.searchKeys.dqzd === null ? '' : this.searchKeys.dqzd.split('#')[0],
        priority: this.searchKeys.jjd,
        productType: this.searchKeys.cpxh,
        waferNo: this.searchKeys.waferNo,
        craft: this.searchKeys.gylx,
        nowProcess: this.searchKeys.dqgx === null ? '' : this.searchKeys.dqgx.split('#')[0],
        isRework: this.searchKeys.sffg,
        throwStartTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        throwEndTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      getList(params).then(res => {
        res.data.list.map(item => {
          item.isRemakeText = item.isRemake === 0 ? '否' : '是'
          item.nowNum = item.nowNum + '/' + item.maxNum
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 暂停
    handleStop(batchNo, type) {
      const msg = type === 0 ? '暂停后当前批次无法继续传接片，是否确认?' : '是否确认恢复当前批次?'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          batchNo,
          type
        }
        pause(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fetchData()
        })
      })
    },
    // 预约暂停
    handleExpectStop(row, status) {
      const msg = status === 0 ? '暂停后当前工序无法继续传接片，是否确认?' : '是否确认恢复当前工序?'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          batchNo: this.currentBatchNo,
          siteId: row.siteId,
          processId: row.processId,
          status
        }
        expectStop(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          row.expectStop = status === 0 ? 1 : 0
        })
      })
    },
    // 关闭
    handleClose(formName) {
      // this.$refs[formName].resetFields()
    }
  }
}

