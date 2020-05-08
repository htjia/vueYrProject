
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { siteList } from '@/api/processManagement/siteManage'
import { barCode } from '@/api/chipBasicInfoManage/grindInfo'
import { scFactoryList, scCategoryList, scElectrodeList, findBackWafer, findColorList, findModelList, findGYlList, gyFlowCardFind, scProductModel, scProduceTaskFind, xpWarehousLabel,
  findBatchAndBillNo, findWaitBill, findWaitWafer, save, findBatchManager, updateBatchNo, wygg, fetchCardInfo, printLabel, findWafer, checkPattern } from '@/api/pcChipCasting/pcChipCasting'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validate = (rule, value, callback) => {
      const num = new RegExp('^-?\\d+$')
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('输入不能为空'))
      } else {
        if (!num.test(value)) {
          callback(new Error('输入必须为正整数'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      innerVisible: false,
      logDialogVisible: false,
      ckDialogVisible: false,
      ckDialogVisible1: false,
      yzpDialogVisible: false,
      setDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      dcinfo: null,
      userOptions: [],
      anotherlistlog: [],
      flowallready: [],
      logrowInfo: null,
      showRealNamelog: '',
      machineForm: {
        yzpMin: '',
        yzpMax: '',
        otherMin: '',
        otherMax: ''
      },
      rules: {
        yzpMin: [{ required: true, validator: validate, trigger: 'blur' }],
        yzpMax: [{ required: true, validator: validate, trigger: 'blur' }],
        otherMin: [{ required: true, validator: validate, trigger: 'blur' }],
        otherMax: [{ required: true, validator: validate, trigger: 'blur' }]
      },
      isSpan: false,
      startNo: '',
      factory: '',
      factoryName: '',
      factoryCnName: '',
      typesName: '',
      types: '',
      color: '',
      models: '',
      processCard: '',
      oldprocesscard: '',
      orderNo: '',
      technology: '',
      electrode: '',
      typeas: '',
      urgent: '',
      ldunit: '',
      isPrintTab: true,
      isPrintCard: true,
      remark: '',
      oldstartNo: '',
      chipNo: '', // 工艺信息
      mesaSize: '',
      electrodes: '',
      cuttingPath: '',
      standardOutput: '',
      specification: '',
      backPlating: '',
      chipTechnology: '',
      evaporationElectrode: '',
      grind: '',
      cuttingTechnology: '',
      cowTestConditions: '',
      cotTestConditions: '',
      cotTest: '',
      isCOTTest: false,
      isMj: false,
      isMapping: false,
      factoryList: [],
      categoryList: [],
      electrodeList: [],
      colorList: [],
      modelList: [],
      gyList: [],
      wyggList: [],
      cardList: [],
      typeList: [
        {
          id: 0,
          name: '圆片'
        },
        {
          id: 1,
          name: '方片'
        }
      ],
      urgentList: [
        {
          id: 0,
          name: '正常'
        },
        {
          id: 1,
          name: '加急'
        }
      ],
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
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      status: '',
      jsd: '',
      sigleNo: '',
      productNo: '',
      tpType: '',
      logList: [],
      ckisActive: 0,
      yzpisActive: 0,
      ckwaferTol: 0,
      yzpwaferTol: 0,
      yzpsigleNo: '',
      cksigleNo: '',
      labelList: [],
      labelStr: '',
      showLists: [],
      rowInfo: null,
      anotherlist: [],
      showRealName: '',
      rowInfos: null,
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
      currentModelList: [],
      forepartSiteOptions: [],
      endSiteOptions: [],
      dialogList: [],
      dialogEndList: [],
      imgVisible: false,
      labelUrl: '',
      titleList: [],
      beachList: [],
      codeList: {},
      productList: [],
      product: '',
      currentCardName1: '',
      currentCardType1: '',
      dialogList1: [],
      dialogEndList1: [],
      titleList1: [],
      beachLists: [],
      printRowInfo: null,
      printAgainList: null,
      polishingPly: null,
      backInfo: null,
      logogisActive: 0
    }
  },
  mounted() {
    this.getForepartSiteList()
    this.getEndSiteList()
    this.findFlowCards()
    this.scFactoryList()
    this.scCategoryList()
    this.scElectrodeList()
    this.findColorModelList()
    this.findGYlList()
    this.gyFlowCardFind()
    this.xpWarehousLabel()
    this.wygg()
    this.productLists()
  },
  methods: {
    handleImg(row) {
      this.imgVisible = true
      this.labelUrl = '/images/' + row.labelUrl
    },
    setNum() {
      this.setDialogVisible = true
      findBatchManager().then(res => {
        this.machineForm = {
          yzpMin: res.data.verifyStartNo,
          yzpMax: res.data.verifyEndNo,
          otherMin: res.data.otherStartNo,
          otherMax: res.data.otherEndNo
        }
      })
    },
    wygg() {
      wygg().then(res => {
        this.wyggList = res.data.list
      })
    },
    setSpan() {
      this.isSpan = !this.isSpan
    },
    tableRowClassColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 13) {
        return {
          background: '#fff'
        }
      }
    },
    tableRowClassColors({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 15) {
        return {
          background: '#fff'
        }
      }
    },
    printLCagain(row) {
      const params = {
        id: row.id
      }
      this.printRowInfo = row
      findWafer(params).then(res => {
        this.$message({
          type: 'success',
          message: '加载中请稍后!'
        })
        this.printAgainList = res.data
        const codes = []
        for (const pri of res.data) {
          for (const items of pri.detailList) {
            codes.push(items.waferNo)
          }
        }
        barCode(codes).then(res => {
          this.imglist = res.data
          this.beachLists = []
          let num = 0
          for (const prints of this.printAgainList) {
            const titleList = []
            const printList1 = []
            const printList = []
            titleList.push({
              startNo: prints.batchNo,
              models: this.printRowInfo.model,
              num: prints.detailList.length,
              craft: this.printRowInfo.craft,
              remark: this.printRowInfo.remark
            })
            for (const wafer of prints.detailList) {
              const data = {
                wafersNo: wafer.waferNo,
                img: this.imglist[num],
                laserMark: wafer.laserMark,
                batchNo: prints.batchNo.substring(9, prints.batchNo.length - 3),
                visualLevels: wafer.inspection
              }
              if (printList.length < 12) {
                printList.push(data)
              } else {
                printList1.push(data)
              }
              num = num + 1
            }
            this.beachLists.push({
              printList: printList,
              printList1: printList1,
              titleList: titleList
            })
          }
          const requestParams = {
            pageNum: 1,
            pageSize: 100000
          }
          gyFlowCardFind(requestParams).then(res => {
            for (const item of res.data.list) {
              if (item.id === this.printRowInfo.flowCardId) {
                this.currentCardType1 = item.type
                this.currentCardName1 = item.name
                break
              }
            }
            const requestParams = {
              id: this.printRowInfo.flowCardId
            }
            fetchCardInfo(requestParams).then(res => {
              const firstProce = []
              const endProce = []
              res.data.processList.map((item) => {
                if (item.type === 0) {
                  firstProce.push(item)
                } else {
                  endProce.push(item)
                }
              })
              this.dialogList1 = firstProce
              this.dialogEndList1 = endProce
              setTimeout(() => {
                const head_str = '<html><head><title></title></head><body>'
                const foot_str = '</body></html>'
                const new_str = document.getElementById('printDivs').innerHTML
                const newWind = window.open('打印窗口', '_blank')
                newWind.document.write(head_str + new_str + foot_str)
                newWind.document.close()
                newWind.print()
                newWind.close()
              }, 500)
            })
          })
        })
      })
    },
    printLabelagain(row) {
      const params = {
        id: row.id
      }
      findWafer(params).then(res => {
        const conetnt = []
        const conetnt1 = []
        const conetnt2 = []
        for (const item of res.data) {
          conetnt1.push([{ key: 'batchNo', value: item.batchNo }])
          conetnt2.push([{ key: 'batchNo', value: item.batchNo }])
          for (let x = 0; x < item.detailList.length; x++) {
            conetnt.push([
              { key: 'wafer', value: item.detailList[x].waferNo },
              { key: 'index', value: x + 1 },
              { key: 'batchNo', value: item.batchNo }
            ])
          }
        }
        for (const imtes of conetnt2) {
          conetnt1.push(imtes)
        }
        const paramslist = {
          module: 'pcProductTask',
          contents: conetnt1
        }
        printLabel(paramslist).then(res => {
          console.log(123)
        })
        this.printWafers(conetnt)
        this.$message({
          type: 'success',
          message: '正在准备打印!'
        })
      })
    },
    selectWafer() {
      if (this.backInfo !== null) {
        this.$message({
          type: 'error',
          message: '退回单据无法选择wafer!'
        })
        return
      }
      this.backInfo = null
      if (this.chipNo === '') {
        this.$message({
          type: 'error',
          message: '未找到相应产品型号，无法投片!'
        })
        return
      }
      if (this.color === '') {
        this.$message({
          type: 'error',
          message: '请选择光色!'
        })
        return
      }
      if (this.models === '') {
        this.$message({
          type: 'error',
          message: '请选择型号!'
        })
        return
      }
      if (this.technology === '') {
        this.$message({
          type: 'error',
          message: '请选择工艺!'
        })
        return
      }
      if (this.electrode === '') {
        this.$message({
          type: 'error',
          message: '请选择电极!'
        })
        return
      }
      if (this.types === '') {
        this.$message({
          type: 'error',
          message: '请选择类别!'
        })
        return
      }
      if (this.factory === '') {
        this.$message({
          type: 'error',
          message: '请选择尺寸!'
        })
        return
      }
      if (this.processCard === '') {
        this.$message({
          type: 'error',
          message: '请选择流程卡!'
        })
        return
      }
      if (this.typeas === '') {
        this.$message({
          type: 'error',
          message: '请选择类型!'
        })
        return
      }
      if (this.urgent === '') {
        this.$message({
          type: 'error',
          message: '请选择紧急度!'
        })
        return
      }
      if (this.labelStr === '') {
        this.$message({
          type: 'error',
          message: '请选择入库标签!'
        })
        return
      }
      this.pageSize = 12
      this.pageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.sigleNo = ''
      this.ckisActive = 0
      this.showLists = []
      this.anotherlist = []
      this.ckDialogVisible1 = true
      this.getChangeFlow()
      this.showList()
    },
    printLabel(str) {
      const params = {
        module: 'pcProductTask',
        contents: [
          [
            { key: 'batchNo', value: str }
          ],
          [
            { key: 'batchNo', value: str }
          ]
        ]
      }
      printLabel(params).then(res => {
        console.log(123)
      })
    },
    printWafers(contents) {
      setTimeout(() => {
        const params = {
          module: 'pcProductTaskwafer',
          contents: contents
        }
        printLabel(params).then(res => {
          console.log(123)
        })
      }, 3000)
    },
    importDBF() {
      if (this.backInfo !== null) {
        window.open(process.env.BASE_API + `/scProduceTask/exportWafer?billId=${this.dcinfo.ids}&id=${this.dcinfo.id}&category=${this.dcinfo.category}&origin=${this.dcinfo.origin}&color=${this.dcinfo.color}&model=${this.dcinfo.model}&craft=${this.dcinfo.craft}&electrode=${this.dcinfo.electrode}&batchNo=${this.dcinfo.batchNo}`)
      } else {
        if (this.chipNo === '') {
          this.$message({
            type: 'error',
            message: '未找到相应产品型号!'
          })
          return
        }
        if (this.list.length === 0) {
          this.$message({
            type: 'error',
            message: '请先添加wafer信息!'
          })
          return
        }
        window.open(process.env.BASE_API + `/scProduceTask/exportWafer?billId=&id=${this.rowInfo.id}&category=${this.typesName}&origin=${this.factoryName}&color=${this.color}&model=${this.models}&craft=${this.technology}&electrode=${this.electrode}&batchNo=${this.startNo}`)
      }
    },
    importLog() {
      if (this.logogisActive === 0) {
        const requestParams = {
          startTime: this.formatDate(this.beginDate),
          endTime: this.formatDate(this.endDate),
          billNo: this.sigleNo,
          model: this.productNo,
          categoryId: this.tpType,
          priority: this.jsd
        }
        if (this.beginDate === '') {
          requestParams.startTime = ''
        }
        if (this.endDate === '') {
          requestParams.endTime = ''
        }
        window.open(process.env.BASE_API + `/scProduceTask/exportRecord?billNo=${requestParams.billNo}&model=${requestParams.model}&categoryId=${requestParams.categoryId}&priority=${requestParams.priority}&startTime=${requestParams.startTime}&endTime=${requestParams.endTime}`)
      } else {
        window.open(process.env.BASE_API + `/scProduceTask/exportWafer?billId=${this.dcinfo.ids}&id=${this.dcinfo.id}&category=${this.dcinfo.category}&origin=${this.dcinfo.origin}&color=${this.dcinfo.color}&model=${this.dcinfo.model}&craft=${this.dcinfo.craft}&electrode=${this.dcinfo.electrode}&batchNo=${this.dcinfo.batchNo}`)
      }
    },
    showClear() {
      this.pageSize = 12
      this.pageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.sigleNo = ''
      this.showList()
    },
    handleSearchList() {
      this.pageNum = 1
      this.showList()
    },
    navClick(type) {
      this.ckisActive = type
    },
    navClicklog(type) {
      this.logogisActive = type
    },
    findWaitWafer(row) {
      const params = {
        batchNo: this.startNo,
        id: row.id,
        category: this.typesName,
        origin: this.factoryName,
        color: this.color,
        model: this.models,
        craft: this.technology,
        electrode: this.electrode
      }
      findWaitWafer(params).then(res => {
        this.anotherlist = res.data
      }, () => {
        if (this.ckDialogVisible) {
          this.ckDialogVisible = false
        }
      })
    },
    findWaitWafers(row) {
      const params = {
        batchNo: this.startNo,
        id: row.id,
        category: this.typesName,
        origin: this.factoryName,
        color: this.color,
        model: this.models,
        craft: this.technology,
        electrode: this.electrode
      }
      findWaitWafer(params).then(res => {
        this.anotherlist = res.data
      }, () => {
        if (this.ckDialogVisible) {
          this.ckDialogVisible = false
        }
      })
    },
    selectThisList(row) {
      this.rowInfo = row
      this.findWaitWafers(row)
      const params = {
        batchNo: this.startNo,
        id: row.id,
        category: this.typesName,
        origin: this.factoryName,
        color: this.color,
        model: this.models,
        craft: this.technology,
        electrode: this.electrode
      }
      findWaitWafer(params).then(res => {
        this.list = []
        this.codeList = {}
        const codes = []
        for (let i = 0; i < res.data.length; i++) {
          if (this.showRealName === '验证片') {
            res.data[i].wafersNo = res.data[i].waferNo
            res.data[i].visualLevels = res.data[i].visual
            codes.push(res.data[i].waferId)
          } else {
            res.data[i].wafersNo = res.data[i].waferNo
            res.data[i].visualLevels = res.data[i].visualLevel
            codes.push(res.data[i].waferNo)
          }
          this.list.push(res.data[i])
          if (this.codeList[res.data[i].batchNo] === undefined) {
            this.codeList[res.data[i].batchNo] = 1
          } else {
            this.codeList[res.data[i].batchNo] = this.codeList[res.data[i].batchNo] + 1
          }
        }
        barCode(codes).then(res => {
          this.imglist = res.data
          this.beachList = []
          const keys = Object.keys(this.codeList)
          for (const key of keys) {
            let datas = {}
            const printList1 = []
            const printList = []
            const printWaferList = []
            const titleList = []
            titleList.push({
              startNo: key,
              models: this.product,
              num: this.codeList[key],
              craft: this.technology,
              remark: this.remark
            })
            for (let i = 0; i < this.list.length; i++) {
              let data = {}
              if (key === this.list[i].batchNo) {
                data = {
                  wafersNo: this.list[i].wafersNo,
                  img: this.imglist[i],
                  laserMark: this.list[i].laserMark,
                  batchNo: this.list[i].batchNo.substring(9, this.list[i].batchNo.length - 3),
                  visualLevels: this.list[i].visualLevels,
                  batNo: this.list[i].batchNo
                }
                printWaferList.push(data)
                if (printList.length < 12) {
                  printList.push(data)
                } else {
                  printList1.push(data)
                }
              }
            }
            datas = {
              printList: printList,
              printList1: printList1,
              printWaferList: printWaferList,
              titleList: titleList
            }
            this.beachList.push(datas)
          }
          console.log(this.beachList)
        })
      })
      this.ckDialogVisible = false
    },
    showList() {
      this.showLists = []
      const params = {
        category: this.showRealName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        billNo: this.sigleNo,
        measure: this.factoryCnName
      }
      if (this.beginDate === '') {
        params.startTime = ''
      }
      if (this.endDate === '') {
        params.endTime = ''
      }
      findWaitBill(params).then(res => {
        if (res.data.list.length === 0) {
          this.ckDialogVisible = true
        }
        this.showLists = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.rowInfo = null
        if (this.showLists.length > 0) {
          // this.$refs.listTabel.setCurrentRow(this.showLists[0])
          const params = {
            batchNo: this.startNo,
            id: this.showLists[0].id,
            category: this.typesName,
            origin: this.factoryName,
            color: this.color,
            model: this.models,
            craft: this.technology,
            electrode: this.electrode
          }
          findWaitWafer(params).then(res => {
            this.anotherlist = res.data
            this.ckDialogVisible = true
            setTimeout(() => {
              this.$refs.listTabel.setCurrentRow(this.showLists[0])
            }, 500)
          }, () => {
            if (this.ckDialogVisible) {
              this.ckDialogVisible = false
            }
          })
        }
      })
    },
    productLists() {
      const param = {
        code: '',
        pageNum: 1,
        pageSize: 10000
      }
      scProductModel(param).then(res => {
        this.productList = []
        for (const item of res.data.list) {
          if (item.status === 0) {
            this.productList.push(item)
          }
        }
      })
    },
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
      this.findWaitWafer(this.rowInfo)
    },
    xpWarehousLabel() {
      const params = {
        type: this.typeas
      }
      xpWarehousLabel(params).then(res => {
        this.labelList = res.data
      })
    },
    scFactoryList() {
      scFactoryList().then(res => {
        this.factoryList = res.data.list
      })
    },
    scCategoryList() {
      scCategoryList().then(res => {
        this.categoryList = res.data.list
      })
    },
    scElectrodeList() {
      scElectrodeList().then(res => {
        this.electrodeList = res.data.list
      })
    },
    findColorModelList() {
      findColorList().then(res => {
        this.colorList = res.data
      })
      findModelList().then(res => {
        this.modelList = res.data
      })
    },
    findGYlList() {
      findGYlList().then(res => {
        this.gyList = res.data.list
      })
    },
    gyFlowCardFind() {
      gyFlowCardFind().then(res => {
        this.cardList = res.data.list
      })
    },
    getChangeFlow() {
      // this.findFlowCard()
    },
    getNoAndCodes() {
      for (const item of this.productList) {
        if (item.code === this.product) {
          this.electrode = item.dj
          this.color = item.gs
          this.models = item.xh
          this.technology = item.gy
          this.polishingPly = item.polishingPly
          break
        }
      }
      this.getNoAndCode()
    },
    getNoAndCodex() {
      for (const factory of this.factoryList) {
        if (factory.id === this.factory) {
          this.factoryName = factory.code
          this.factoryCnName = factory.name
          break
        }
      }
      for (const category of this.categoryList) {
        if (category.id === this.types) {
          this.typesName = category.code
          this.showRealName = category.name
          break
        }
      }
      this.getNoAndCode()
    },
    inputBlur() {
      if (this.list.length > 0) {
        if (this.backInfo === null) {
          this.selectThisList(this.rowInfo)
        } else {
          this.findbacks()
        }
      }
    },
    findbacks() {
      this.listLoading = true
      const params = {
        id: this.backInfo.id,
        batchNo: this.startNo === '' ? null : this.startNo
      }
      findBackWafer(params).then(res => {
        this.list = []
        if (res.data.length === 0) {
          this.$message({
            type: 'error',
            message: '该单据没有wafer数据，无法编辑!'
          })
          this.listLoading = false
          this.backInfo = null
          this.startNo = ''
          this.product = ''
          this.factory = ''
          this.types = ''
          this.color = ''
          this.models = ''
          this.processCard = ''
          this.orderNo = ''
          this.technology = ''
          this.electrode = ''
          this.typeas = ''
          this.urgent = ''
          this.isPrintTab = true
          this.isPrintCard = true
          this.ldunit = ''
          this.remark = ''
          this.chipNo = ''
          this.mesaSize = ''
          this.electrodes = ''
          this.cuttingPath = ''
          this.standardOutput = ''
          this.specification = ''
          this.backPlating = ''
          this.chipTechnology = ''
          this.evaporationElectrode = ''
          this.grind = ''
          this.cuttingTechnology = ''
          this.cowTestConditions = ''
          this.cotTestConditions = ''
          this.cotTest = ''
          this.labelStr = ''
          this.isCOTTest = false
          this.isMj = false
          this.isMapping = false
          return
        }
        if (this.startNo === '') {
          this.startNo = res.data[0].batchNo
        }
        if (this.oldstartNo === '') {
          this.oldstartNo = res.data[0].batchNo
        }
        this.codeList = {}
        const codes = []
        for (let i = 0; i < res.data.length; i++) {
          if (this.showRealName === '验证片') {
            res.data[i].wafersNo = res.data[i].waferNo
            res.data[i].visualLevels = res.data[i].visual
            codes.push(res.data[i].waferId)
          } else {
            res.data[i].wafersNo = res.data[i].waferNo
            res.data[i].visualLevels = res.data[i].visualLevel
            codes.push(res.data[i].waferNo)
          }
          this.list.push(res.data[i])
          if (this.codeList[res.data[i].batchNo] === undefined) {
            this.codeList[res.data[i].batchNo] = 1
          } else {
            this.codeList[res.data[i].batchNo] = this.codeList[res.data[i].batchNo] + 1
          }
        }
        barCode(codes).then(res => {
          this.listLoading = false
          this.imglist = res.data
          this.beachList = []
          const keys = Object.keys(this.codeList)
          for (const key of keys) {
            let datas = {}
            const printList1 = []
            const printList = []
            const printWaferList = []
            const titleList = []
            titleList.push({
              startNo: key,
              models: this.product,
              num: this.codeList[key],
              craft: this.technology,
              remark: this.remark
            })
            for (let i = 0; i < this.list.length; i++) {
              let data = {}
              if (key === this.list[i].batchNo) {
                data = {
                  wafersNo: this.list[i].wafersNo,
                  img: this.imglist[i],
                  laserMark: this.list[i].laserMark,
                  batchNo: this.list[i].batchNo.substring(9, this.list[i].batchNo.length - 3),
                  visualLevels: this.list[i].visualLevels,
                  batNo: this.list[i].batchNo
                }
                printWaferList.push(data)
                if (printList.length < 12) {
                  printList.push(data)
                } else {
                  printList1.push(data)
                }
              }
            }
            datas = {
              printList: printList,
              printList1: printList1,
              printWaferList: printWaferList,
              titleList: titleList
            }
            this.beachList.push(datas)
          }
        })
      }, () => {
        if (this.ckDialogVisible) {
          this.ckDialogVisible = false
        }
      })
    },
    getNoAndCode() {
      if (this.color !== '' && this.models !== '' && this.technology !== '' && this.electrode !== '' && this.types !== '' && this.factory !== '') {
        const code = this.color + this.models + this.technology + '-' + this.electrode
        const param = {
          code: code
        }
        scProductModel(param).then(res => {
          if (res.data.list.length > 0) {
            this.chipNo = res.data.list[0].model
            this.mesaSize = res.data.list[0].measure
            this.electrodes = res.data.list[0].electrode
            this.cuttingPath = res.data.list[0].cuttingWay
            this.standardOutput = res.data.list[0].standardOutput
            for (const item of this.wyggList) {
              if (res.data.list[0].specification === item.id) {
                res.data.list[0].specificationName = item.name
                break
              }
            }
            this.specification = res.data.list[0].specificationName
            this.backPlating = res.data.list[0].backPlating === 1 ? '有' : '无'
            this.chipTechnology = res.data.list[0].chipCraftName
            this.evaporationElectrode = res.data.list[0].electrodeCraft
            this.grind = res.data.list[0].grindPly
            this.cuttingTechnology = res.data.list[0].cuttiongName
            this.cowTestConditions = res.data.list[0].cowTest
            this.cotTestConditions = res.data.list[0].currentTest
            this.cotTest = res.data.list[0].cotTest
            this.isCOTTest = res.data.list[0].cotEsd === 1
            this.isMj = res.data.list[0].visual === 1
            this.isMapping = res.data.list[0].mapping === 1
            this.ldunit = res.data.list[0].ldunit
            this.processCard = ''
            if (res.data.list[0].flowCardId !== '' && res.data.list[0].flowCardId !== null && res.data.list[0].flowCardId !== undefined) {
              this.processCard = res.data.list[0].flowCardId
              this.findFlowCard()
            }
          } else {
            this.$message({
              type: 'error',
              message: '未找到相应产品型号，无法投片!'
            })
            this.chipNo = ''
            this.mesaSize = ''
            this.electrodes = ''
            this.cuttingPath = ''
            this.standardOutput = ''
            this.specification = ''
            this.backPlating = ''
            this.chipTechnology = ''
            this.evaporationElectrode = ''
            this.grind = ''
            this.cuttingTechnology = ''
            this.cowTestConditions = ''
            this.cotTestConditions = ''
            this.cotTest = ''
            this.ldunit = ''
            this.isCOTTest = false
            this.isMj = false
            this.isMapping = false
          }
          for (const factory of this.factoryList) {
            if (factory.id === this.factory) {
              this.factoryName = factory.code
              this.factoryCnName = factory.name
              break
            }
          }
          for (const category of this.categoryList) {
            if (category.id === this.types) {
              this.typesName = category.code
              this.showRealName = category.name
              break
            }
          }
          if (this.backInfo === null) {
            this.list = []
          }
          const params = {
            category: this.typesName,
            origin: this.factoryName,
            color: this.color,
            model: this.models,
            craft: this.technology,
            electrode: this.electrode
          }
          findBatchAndBillNo(params).then(res => {
            if (res.message === '') {
              if (this.backInfo !== null) {
                if (this.startNo !== '') {
                  this.startNo = res.data.batchNo
                }
                if (this.startNo === '') {
                  this.orderNo = this.backInfo.billNo
                  this.product = this.backInfo.model
                  this.factory = this.backInfo.factoryId
                  this.types = this.backInfo.categoryId
                  this.typeas = this.backInfo.pattern
                  this.urgent = this.backInfo.priority
                  this.processCard = this.backInfo.flowCardId
                  this.labelStr = this.backInfo.labelId
                  this.remark = this.backInfo.remark
                }
                if (this.processCard !== null && this.processCard !== '' && this.oldprocesscard !== this.processCard) {
                  if (this.oldprocesscard === '') {
                    this.oldprocesscard = this.backInfo.flowCardId
                  }
                  this.findFlowCard()
                  if (this.list.length === 0) {
                    this.findbacks()
                  }
                } else {
                  if (this.startNo === '' || this.list.length === 0 || (this.list.length > 0 && this.startNo !== this.list[0].batchNo)) {
                    this.findbacks()
                  }
                }
              } else {
                this.startNo = res.data.batchNo
                this.orderNo = res.data.billNo
              }
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
              this.list = []
              this.startNo = ''
              this.factory = ''
              this.types = ''
              this.color = ''
              this.models = ''
              this.processCard = ''
              this.orderNo = ''
              this.technology = ''
              this.electrode = ''
              this.typeas = ''
              this.urgent = ''
              this.isPrintTab = true
              this.isPrintCard = true
              this.ldunit = ''
              this.remark = ''
              this.chipNo = ''
              this.mesaSize = ''
              this.electrodes = ''
              this.cuttingPath = ''
              this.standardOutput = ''
              this.specification = ''
              this.backPlating = ''
              this.chipTechnology = ''
              this.evaporationElectrode = ''
              this.grind = ''
              this.cuttingTechnology = ''
              this.cowTestConditions = ''
              this.cotTestConditions = ''
              this.cotTest = ''
              this.labelStr = ''
              this.isCOTTest = false
              this.isMj = false
              this.isMapping = false
            }
          })
        })
      }
    },
    showLog() {
      this.pageSize = 12
      this.pageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.sigleNo = ''
      this.productNo = ''
      this.tpType = ''
      this.sigleNo = ''
      this.jsd = ''
      this.showRealNamelog = ''
      this.logrowInfo = null
      this.logDialogVisible = true
      this.logogisActive = 0
      this.tpLog()
    },
    handleSearchLog() {
      this.pageNum = 1
      this.tpLog()
    },
    tpLogClear() {
      this.pageSize = 12
      this.pageNum = 1
      this.beginDate = ''
      this.endDate = ''
      this.sigleNo = ''
      this.productNo = ''
      this.tpType = ''
      this.sigleNo = ''
      this.jsd = ''
      this.tpLog()
    },
    tpLog() {
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        billNo: this.sigleNo,
        model: this.productNo,
        categoryId: this.tpType,
        priority: this.jsd
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      scProduceTaskFind(requestParams).then(res => {
        this.logList = res.data.list
        this.totalPage = parseInt(res.data.total)
        if (this.logList.length > 0) {
          setTimeout(() => {
            this.$refs.listTabels.setCurrentRow(this.logList[0])
          }, 500)
        }
      })
    },
    handleCurrentChanges(row) {
      if (row === null) {
        return
      }
      this.logrowInfo = row
      let typesName = ''
      for (const category of this.categoryList) {
        if (category.id === row.categoryId) {
          typesName = category.code
          this.showRealNamelog = category.name
          break
        }
      }
      let factoryName = ''
      let gs = ''
      let xh = ''
      let gy = ''
      let dj = ''
      for (const item of this.productList) {
        if (item.code === row.model) {
          dj = item.dj
          gs = item.gs
          xh = item.xh
          gy = item.gy
          this.polishingPly = item.polishingPly
          break
        }
      }
      for (const factory of this.factoryList) {
        if (factory.id === row.factoryId) {
          factoryName = factory.code
          break
        }
      }
      const parmasd = {
        id: row.id
      }
      findBackWafer(parmasd).then(res => {
        this.anotherlistlog = res.data
        const params = {
          batchNo: res.data[0].batchNo,
          id: row.billId,
          ids: row.id,
          category: typesName,
          origin: factoryName,
          color: gs,
          model: xh,
          craft: gy,
          electrode: dj
        }
        this.dcinfo = params
      })
    },
    handleAdd() {
      if (this.chipNo === '') {
        this.$message({
          type: 'error',
          message: '未找到相应产品型号，无法投片!'
        })
        return
      }
      if (this.list.length > 0) {
        let params = {}
        if (this.backInfo !== null) {
          params = {
            id: this.backInfo.id,
            firstBatchNo: this.backInfo !== null ? this.oldstartNo : null,
            batchNo: this.startNo,
            billId: this.backInfo.billId,
            category: this.typesName,
            categoryId: this.types,
            color: this.color,
            craft: this.technology,
            creator: sessionStorage.getItem('User-Id'),
            electrode: this.electrode,
            factoryId: this.factory,
            flowcardId: this.processCard,
            isPreview: this.isPrintTab ? '1' : '0',
            isPrint: this.isPrintCard ? '1' : '0',
            labelId: this.labelStr,
            model: this.models,
            origin: this.factoryName,
            pattern: this.typeas,
            priority: this.urgent,
            remark: this.remark,
            castBillNo: this.backInfo.castBillNo,
            billNo: this.backInfo.billNo,
            taskModel: this.color + this.models + this.technology + '-' + this.electrode,
            factoryName: this.factoryCnName,
            categoryName: this.showRealName
          }
        } else {
          params = {
            batchNo: this.startNo,
            firstBatchNo: null,
            billId: this.rowInfo.id,
            category: this.typesName,
            categoryId: this.types,
            color: this.color,
            craft: this.technology,
            creator: sessionStorage.getItem('User-Id'),
            electrode: this.electrode,
            factoryId: this.factory,
            flowcardId: this.processCard,
            isPreview: this.isPrintTab ? '1' : '0',
            isPrint: this.isPrintCard ? '1' : '0',
            labelId: this.labelStr,
            model: this.models,
            origin: this.factoryName,
            pattern: this.typeas,
            priority: this.urgent,
            remark: this.remark,
            castBillNo: this.showRealName !== '验证片' ? this.rowInfo.orderNo : this.rowInfo.billNo,
            taskModel: this.color + this.models + this.technology + '-' + this.electrode,
            factoryName: this.factoryCnName,
            categoryName: this.showRealName
          }
        }
        save(params).then(res => {
          this.backInfo = null
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            if (this.isPrintCard) {
              // this.titleList = []
              // this.titleList.push({
              //   startNo: this.startNo,
              //   models: this.product,
              //   num: this.list.length,
              //   craft: this.currentCraft,
              //   remark: this.remark
              // })
              const head_str = '<html><head><title></title></head><body>'
              const foot_str = '</body></html>'
              const new_str = document.getElementById('printDiv').innerHTML
              const newWind = window.open('打印窗口', '_blank')
              newWind.document.write(head_str + new_str + foot_str)
              newWind.document.close()
              this.list = []
              this.startNo = ''
              this.factory = ''
              this.types = ''
              this.color = ''
              this.models = ''
              this.processCard = ''
              this.orderNo = ''
              this.technology = ''
              this.electrode = ''
              this.typeas = ''
              this.urgent = ''
              this.isPrintTab = true
              this.isPrintCard = true
              this.ldunit = ''
              this.remark = ''
              this.chipNo = ''
              this.mesaSize = ''
              this.product = ''
              this.electrodes = ''
              this.cuttingPath = ''
              this.standardOutput = ''
              this.specification = ''
              this.backPlating = ''
              this.chipTechnology = ''
              this.evaporationElectrode = ''
              this.grind = ''
              this.cuttingTechnology = ''
              this.cowTestConditions = ''
              this.cotTestConditions = ''
              this.cotTest = ''
              this.labelStr = ''
              this.isCOTTest = false
              this.isMj = false
              this.isMapping = false
              newWind.print()
              newWind.close()
              // this.$print(this.$refs.print)
            }
            if (this.isPrintTab) {
              this.$message({
                type: 'success',
                message: '正在准备打印!'
              })
              const keys = Object.keys(this.codeList)
              const conetnt1 = []
              const conetnt2 = []
              const conetnt = []
              for (let i = 0; i < keys.length; i++) {
                conetnt1.push([{ key: 'batchNo', value: keys[i] }])
                conetnt2.push([{ key: 'batchNo', value: keys[i] }])
                for (let x = 0; x < this.beachList[i].printWaferList.length; x++) {
                  conetnt.push([
                    { key: 'wafer', value: this.beachList[i].printWaferList[x].wafersNo },
                    { key: 'index', value: x + 1 },
                    { key: 'batchNo', value: this.beachList[i].printWaferList[x].batNo }
                  ])
                }
              }
              for (const imtes of conetnt2) {
                conetnt1.push(imtes)
              }
              this.printWafers(conetnt)
              const paramslist = {
                module: 'pcProductTask',
                contents: conetnt1
              }
              printLabel(paramslist).then(res => {
                console.log(123)
              })
              this.beachList = []
            }
            this.list = []
            this.startNo = ''
            this.factory = ''
            this.types = ''
            this.color = ''
            this.models = ''
            this.processCard = ''
            this.orderNo = ''
            this.technology = ''
            this.electrode = ''
            this.typeas = ''
            this.urgent = ''
            this.isPrintTab = true
            this.isPrintCard = true
            this.ldunit = ''
            this.remark = ''
            this.chipNo = ''
            this.mesaSize = ''
            this.product = ''
            this.electrodes = ''
            this.cuttingPath = ''
            this.standardOutput = ''
            this.specification = ''
            this.backPlating = ''
            this.chipTechnology = ''
            this.evaporationElectrode = ''
            this.grind = ''
            this.cuttingTechnology = ''
            this.cowTestConditions = ''
            this.cotTestConditions = ''
            this.cotTest = ''
            this.labelStr = ''
            this.isCOTTest = false
            this.isMj = false
            this.isMapping = false
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请先添加wafer信息!'
        })
      }
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
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.tpLog()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.tpLog()
    },
    // 每页数量改变
    cksizeChange(pageSize) {
      this.pageSize = pageSize
      this.showList()
    },
    // 当前页数改变
    ckcurrentChange(pageNum) {
      this.pageNum = pageNum
      this.showList()
    },
    // 添加提交
    setsubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (parseInt(this.machineForm.yzpMax) < parseInt(this.machineForm.yzpMin)) {
            this.$message({
              type: 'error',
              message: '验证片起始号不能小于结束号!'
            })
            return
          }
          if (parseInt(this.machineForm.yzpMax) >= parseInt(this.machineForm.otherMin)) {
            this.$message({
              type: 'error',
              message: '其他片起始号不能小于验证片结束号!'
            })
            return
          }
          if (parseInt(this.machineForm.otherMax) < parseInt(this.machineForm.otherMin)) {
            this.$message({
              type: 'error',
              message: '其他片起始号不能小于结束号!'
            })
            return
          }
          const params = {
            verifyStartNo: this.machineForm.yzpMin,
            verifyEndNo: this.machineForm.yzpMax,
            otherStartNo: this.machineForm.otherMin,
            otherEndNo: this.machineForm.otherMax
          }
          updateBatchNo(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.setDialogVisible = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
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
    },
    // 弹框内查看按钮
    handleReview(row) {
      this.rowInfos = row
      const requestParams = {
        pageNum: 1,
        pageSize: 100000
      }
      gyFlowCardFind(requestParams).then(res => {
        for (const item of res.data.list) {
          if (item.id === this.rowInfos.flowCardId) {
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
      this.getProceCodeModel(row.flowCardId)
      this.innerVisible = true
    },
    findFlowCards() {
      const requestParams = {
        pageNum: 1,
        pageSize: 100000
      }
      gyFlowCardFind(requestParams).then(res => {
        this.flowallready = res.data.list
      })
    },
    findFlowCard() {
      if (this.processCard !== null && this.processCard !== '') {
        for (const item of this.flowallready) {
          if (item.id === this.processCard) {
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
        this.getProceCodeModel(this.processCard)
        setTimeout(() => {
          this.inputBlur()
        }, 500)
      }
    },
    // 复制流程卡请求型号
    getProceCodeModel(id) {
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
    edits(row) {
      // if (this.anotherlistlog.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '该单据没有wafer数据，无法编辑!'
      //   })
      //   return
      // }
      this.handleCurrentChanges(row)
      this.startNo = ''
      this.oldstartNo = ''
      this.oldprocesscard = ''
      this.backInfo = row
      this.product = this.backInfo.model
      this.factory = this.backInfo.factoryId
      this.types = this.backInfo.categoryId
      this.typeas = this.backInfo.pattern
      this.urgent = this.backInfo.priority
      this.processCard = this.backInfo.flowCardId
      this.labelStr = this.backInfo.labelId
      this.remark = this.backInfo.remark
      for (const category of this.categoryList) {
        if (category.id === this.types) {
          this.typesName = category.code
          this.showRealName = category.name
          break
        }
      }
      this.getNoAndCodes()
      // const requestParams = {
      //   id: row.id
      // }
      // findBackWafer(requestParams).then(res => {
      //   this.list = res.data
      //   // this.startNo = this.list[0].batchNo
      //   // this.orderNo = this.backInfo.billNo
      // })
      this.logDialogVisible = false
    },
    changeEdit() {
      this.backInfo = null
      this.list = []
      this.oldstartNo = ''
      this.startNo = ''
      this.factory = ''
      this.types = ''
      this.color = ''
      this.models = ''
      this.processCard = ''
      this.orderNo = ''
      this.technology = ''
      this.electrode = ''
      this.typeas = ''
      this.urgent = ''
      this.isPrintTab = true
      this.isPrintCard = true
      this.ldunit = ''
      this.remark = ''
      this.chipNo = ''
      this.mesaSize = ''
      this.product = ''
      this.electrodes = ''
      this.cuttingPath = ''
      this.standardOutput = ''
      this.specification = ''
      this.backPlating = ''
      this.chipTechnology = ''
      this.evaporationElectrode = ''
      this.grind = ''
      this.cuttingTechnology = ''
      this.cowTestConditions = ''
      this.cotTestConditions = ''
      this.cotTest = ''
      this.labelStr = ''
      this.isCOTTest = false
      this.isMj = false
      this.isMapping = false
    },
    changepx() {
      if (this.logrowInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择要切换的单据!'
        })
        return
      }
      const params = {
        id: this.logrowInfo.id,
        pattern: this.logrowInfo.pattern === 1 ? 0 : 1
      }
      let str = '注意，此操作风险较大，请慎重处理。是否确认将此任务单的投产片型切为方片?'
      if (this.logrowInfo.pattern === 1) {
        str = '注意，此操作风险较大，请慎重处理。是否确认将此任务单的投产片型切为圆片?'
      }
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkPattern(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '切换成功!'
            })
            this.tpLog()
          }
        })
      })
    }
  }
}

