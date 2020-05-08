
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getList, updateRemark, findModelList, findVerifyList, findSubstrateMeasureList, findlevelList,
  findSubstrateTypeList, findProduceTypeList, ckStorehouseTypeFind } from '@/api/chipManage/extensionStorageManage/inventoryInquiry'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      setRemarkDialogVisible: false,
      activeTabIndex: 0,
      tableKey: 0,
      waferTotalNum: 24,
      remarkForm: {
        waferId: '',
        remark: ''
      },
      searchKey: {
        runId: '',
        gw: '',
        lkh: '',
        tplx: '',
        kczt: '',
        ck: '',
        waferId: '',
        hh: '',
        yzbx: '',
        cc: '',
        qy: '',
        subType: '',
        mj: '',
        plWdMin: '',
        plWdMax: '',
        plilMin: '',
        plilMax: '',
        plRepMin: '',
        plRepMax: '',
        subcom: '',
        zhpd: '',
        stdMin: '',
        stdMax: '',
        plPdMin: '',
        plPdMax: '',
        lopMin: '',
        lopMax: '',
        esd200Min: '',
        esd200Max: '',
        esd50Min: '',
        esd50Max: '',
        zhllMin: '',
        zhllMax: '',
        irYieldMin: '',
        irYieldMax: '',
        vf1Min: '',
        vf1Max: '',
        vf2Min: '',
        vf2Max: '',
        wld1Min: '',
        wld2Max: '',
        vzMin: '',
        vzMax: '',
        vfYieldMin: '',
        vfYieldMax: '',
        vzYieldMin: '',
        vzYieldMax: '',
        irMin: '',
        irMax: '',
        ivMin: '',
        ivMax: '',
        cd: '',
        sclx: '',
        plCowMin: '',
        plCowMax: '',
        yCowMin: '',
        yCowMax: ''
      },
      selectedRunRow: {},
      list: [],
      modelList: [],
      verifyList: [],
      substrateMeasureList: [],
      substrateTypeList: [],
      produceTypeList: [],
      storehouseTypeList: [],
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
          name: '正常片'
        },
        {
          id: 1,
          name: '报废片'
        }
      ],
      dataOptions: [
        {
          id: 0,
          name: '本部'
        },
        {
          id: 1,
          name: '外部导入'
        }
      ],
      storeOptions: [
        { id: 0, name: '在库' },
        { id: -1, name: '入库' },
        { id: 1, name: '备库' },
        { id: 2, name: '出库' },
        { id: 3, name: '生产退库' },
        { id: 4, name: '出库退库' }
      ],
      currentId: ''
    }
  },
  mounted() {
    this.handleSearch(1)
    this.findModelListFun()
    this.findVerifyListFun()
    this.findSubstrateMeasureListFun()
    this.findlevelListFun()
    this.findSubstrateTypeListFun()
    this.findProduceTypeListFun()
    this.ckStorehouseTypeFindFun()
  },
  methods: {
    // PC投片型号
    findModelListFun() {
      findModelList({}).then(res => {
        this.modelList = res.data
      })
    },
    // 验证版型
    findVerifyListFun() {
      const params = {
        pageNum: 1,
        pageSize: 10000,
        status: 0
      }
      findVerifyList(params).then(res => {
        this.verifyList = res.data.list
      })
    },
    // 衬底尺寸
    findSubstrateMeasureListFun() {
      findSubstrateMeasureList({}).then(res => {
        this.substrateMeasureList = res.data
      })
    },
    // 目检等级
    findlevelListFun() {
      const params = {
        pageNum: 1,
        pageSize: 10000,
        status: 0
      }
      findlevelList(params).then(res => {
        this.levelList = res.data.list
      })
    },
    // 衬底类型
    findSubstrateTypeListFun() {
      findSubstrateTypeList({}).then(res => {
        this.substrateTypeList = res.data
      })
    },
    // 生产类型
    findProduceTypeListFun() {
      findProduceTypeList({}).then(res => {
        console.log(res.data)
        this.produceTypeList = res.data
      })
    },
    // 入库类型（产地）
    ckStorehouseTypeFindFun() {
      ckStorehouseTypeFind({}).then(res => {
        this.storehouseTypeList = res.data
      })
    },
    clearSearch(index) {
      if (index === 1) {
        this.searchKey.runId = ''
        this.searchKey.gw = ''
        this.searchKey.lkh = ''
        this.searchKey.tplx = ''
        this.searchKey.kczt = ''
        this.searchKey.ck = ''
        this.searchKey.waferId = ''
        this.searchKey.hh = ''
        this.searchKey.yzbx = ''
        this.searchKey.cc = ''
        this.searchKey.qy = ''
        this.beginDate = ''
        this.endDate = ''
      } else if (index === 2) {
        this.searchKey.subType = ''
        this.searchKey.mj = []
        this.searchKey.plWdMin = ''
        this.searchKey.plWdMax = ''
        this.searchKey.plilMin = ''
        this.searchKey.plilMax = ''
        this.searchKey.plRepMin = ''
        this.searchKey.plRepMax = ''
        this.searchKey.subcom = ''
        this.searchKey.zhpd = ''
        this.searchKey.stdMin = ''
        this.searchKey.stdMax = ''
        this.searchKey.plPdMin = ''
        this.searchKey.plPdMax = ''
        this.searchKey.lopMin = ''
        this.searchKey.lopMax = ''
      } else if (index === 3) {
        this.searchKey.esd200Min = ''
        this.searchKey.esd200Max = ''
        this.searchKey.esd50Min = ''
        this.searchKey.esd50Max = ''
        this.searchKey.zhllMin = ''
        this.searchKey.zhllMax = ''
        this.searchKey.irYieldMin = ''
        this.searchKey.irYieldMax = ''
        this.searchKey.vf1Min = ''
        this.searchKey.vf1Max = ''
        this.searchKey.vf2Min = ''
        this.searchKey.vf2Max = ''
        this.searchKey.wld1Min = ''
        this.searchKey.wld2Max = ''
        this.searchKey.vzMin = ''
        this.searchKey.vzMax = ''
        this.searchKey.vfYieldMin = ''
        this.searchKey.vfYieldMax = ''
        this.searchKey.vzYieldMin = ''
        this.searchKey.vzYieldMax = ''
        this.searchKey.irMin = ''
        this.searchKey.irMax = ''
        this.searchKey.ivMin = ''
        this.searchKey.ivMax = ''
      } else {
        this.searchKey.cd = ''
        this.searchKey.sclx = ''
        this.searchKey.plCowMin = ''
        this.searchKey.plCowMax = ''
        this.searchKey.yCowMin = ''
        this.searchKey.yCowMax = ''
      }
      this.pageNum = 1
      this.handleSearch(index)
    },
    tabClick(index) {
      this.pageNum = 1
      this.pageSize = 15
      this.activeTabIndex = index
      switch (index) {
        case 0 : this.handleSearch(1)
          break
        case 1 : this.handleSearch(2)
          break
        case 2 : this.handleSearch(3)
          break
        case 3 : this.handleSearch(4)
          break
      }
      this.tableKey = Math.random()
    },
    // 单击Run信息
    rowClick(row) {
      this.selectedRunRow = row
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      switch (this.activeTabIndex) {
        case 0 : this.handleSearch(1)
          break
        case 1 : this.handleSearch(2)
          break
        case 2 : this.handleSearch(3)
          break
        case 3 : this.handleSearch(4)
          break
      }
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      switch (this.activeTabIndex) {
        case 0 : this.handleSearch(1)
          break
        case 1 : this.handleSearch(2)
          break
        case 2 : this.handleSearch(3)
          break
        case 3 : this.handleSearch(4)
          break
      }
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 导出
    handleExport() {
      let exportParams = ''
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      const inspection = this.searchKey.mj === '' ? '' : this.searchKey.mj.join(',')
      const headerCn = 'RunID;WaferID;柜位;盒号;片位;衬底工艺;衬底厂家;镭刻号;目检;尺寸;单据类型;数据源;入库日期;产地;PL_WD;PL_WD_STD;PL.I.I;PL.I.I.Std;PL_PD;PL_Ref;LOP(460);综合判定;ESD(200);ESD去坏(50V);综合良率;VF1 Yield;Ir Yield;VZ Yield;VF1;VF2;VF3;WLD1;Ir;VZ;IV;WLD(PL-COW);预估COW波长;ESD(400);验证版型;生产类型;IR<0.2 yield;Recipe_Name;外延盒号;HW;B.S;目检原因;光色;衬底类型;机台;ESD去坏（500V）;ESD去坏（300V）;BOW;PLINT_STD;Avg_Vf4;Thyristor良率;库存状态'
      const headerEn = 'runId,waferId,arkName,boxNo,sequence,subType,supplier,laserMark,inspection,size,billType,sourceType,createTime,storeType,plWd,plWtd,plIi,plIiStd,plPd,plRef,lop460,judge,esd200v,esd50v,yield,vf1Yield,lrYield,vzYield,vf1,vf2,vf3,wld,lr,vz,iv,kVal,cowWd,esd400,yzType,product,yieldIr02,recipe,wyBoxNo,hw1,bs,visualReason,color,sub,machine,esd500,esd300,bow,plintStd,avgVf4,thyristor,status'
      if (this.activeTabIndex === 0) {
      // &taskModel=${this.searchKey.tplx}
        exportParams = `?runId=${this.searchKey.runId}&waferId=${this.searchKey.waferId}&laserMark=${this.searchKey.lkh}&arkName=${this.searchKey.gw}&boxNo=${this.searchKey.hh}&type=${this.searchKey.qy}&billType=${this.searchKey.ck}&status=${this.searchKey.kczt}&yzType=${this.searchKey.yzbx}&size=${this.searchKey.cc}&startTime=${startTime}&endTime=${endTime}&headerCn=${headerCn}&headerEn=${headerEn}`
      } else if (this.activeTabIndex === 1) {
        exportParams = `?subType=${this.searchKey.subType}&inspection=${inspection}&startPlWd=${this.searchKey.plWdMax}&startPlIi=${this.searchKey.plilMin}&endPlIi=${this.searchKey.plWdMax}&startPlRef=${this.searchKey.plRepMin}&endPlRef=${this.searchKey.plRepMax}&subCom=${this.searchKey.subcom}&judge=${this.searchKey.zhpd}&startPlWdStd=${this.searchKey.stdMin}&endPlWdStd=${this.searchKey.stdMax}&startPlPd=${this.searchKey.plPdMin}&endPlPd=${this.searchKey.plPdMax}&startLop460=${this.searchKey.lopMin}&endLop460=${this.searchKey.lopMax}&headerCn=${headerCn}&headerEn=${headerEn}`
      } else if (this.activeTabIndex === 2) {
        exportParams = `?startEsd200v=${this.searchKey.esd200Min}&endEsd200v=${this.searchKey.esd200Max}&startEsd50v=${this.searchKey.esd50Min}&endEsd50v=${this.searchKey.esd50Max}&startYield=${this.searchKey.zhllMin}&endYield=${this.searchKey.zhllMax}&startVf1=${this.searchKey.vf1Min}&endVf1=${this.searchKey.vf1Max}&startVf2=${this.searchKey.vf2Min}&endVf2=${this.searchKey.vf2Max}&startWld=${this.searchKey.wld1Min}&endWld=${this.searchKey.wld2Max}&startVz=${this.searchKey.vzMin}&endVz=${this.searchKey.vzMax}&startVf1Yield=${this.searchKey.vfYieldMin}&endVf1Yield=${this.searchKey.vfYieldMax}&startVzYield=${this.searchKey.vzYieldMin}&endVzYield=${this.searchKey.vzYieldMax}&startLr=${this.searchKey.irMin}&endLr=${this.searchKey.irMax}&startIv=${this.searchKey.ivMin}&endIv=${this.searchKey.ivMax}&headerCn=${headerCn}&headerEn=${headerEn}`
      } else {
        exportParams = `?origin=${this.searchKey.cd}&product=${this.searchKey.sclx}&startKVal=${this.searchKey.plCowMin}&endKVal=${this.searchKey.plCowMax}&startCowWd=${this.searchKey.yCowMin}&endCowWd=${this.searchKey.yCowMax}&headerCn=${headerCn}&headerEn=${headerEn}`
      }
      window.open(process.env.BASE_API + '/ckStorehouse/exportStoreWafer' + exportParams)
    },
    handleSearchBth(index) {
      this.pageNum = 1
      this.handleSearch(index)
    },
    handleSearch(index) {
      this.listLoading = true
      let requestParams = {}
      if (index === 1) {
        requestParams = {
          runId: this.searchKey.runId,
          waferId: this.searchKey.waferId,
          laserMark: this.searchKey.lkh,
          arkName: this.searchKey.gw,
          boxNo: this.searchKey.hh,
          // taskModel: this.searchKey.tplx,
          type: this.searchKey.qy,
          billType: this.searchKey.ck,
          status: this.searchKey.kczt,
          yzType: this.searchKey.yzbx,
          size: this.searchKey.cc,
          startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
          endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      } else if (index === 2) {
        requestParams = {
          subType: this.searchKey.subType,
          inspection: this.searchKey.mj === '' ? '' : this.searchKey.mj.join(','),
          startPlWd: this.searchKey.plWdMin,
          endPlWd: this.searchKey.plWdMax,
          startPlIi: this.searchKey.plilMin,
          endPlIi: this.searchKey.plilMax,
          startPlRef: this.searchKey.plRepMin,
          endPlRef: this.searchKey.plRepMax,
          subCom: this.searchKey.subcom,
          judge: this.searchKey.zhpd,
          startPlWdStd: this.searchKey.stdMin,
          endPlWdStd: this.searchKey.stdMax,
          startPlPd: this.searchKey.plPdMin,
          endPlPd: this.searchKey.plPdMax,
          startLop460: this.searchKey.lopMin,
          endLop460: this.searchKey.lopMax,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      } else if (index === 3) {
        requestParams = {
          startEsd200v: this.searchKey.esd200Min,
          endEsd200v: this.searchKey.esd200Max,
          startEsd50v: this.searchKey.esd50Min,
          endEsd50v: this.searchKey.esd50Max,
          // 综合良率
          startYield: this.searchKey.zhllMin,
          endYield: this.searchKey.zhllMax,
          startVf1: this.searchKey.vf1Min,
          endVf1: this.searchKey.vf1Max,
          startVf2: this.searchKey.vf2Min,
          endVf2: this.searchKey.vf2Max,
          startWld: this.searchKey.wld1Min,
          endWld: this.searchKey.wld2Max,
          startVz: this.searchKey.vzMin,
          endVz: this.searchKey.vzMax,
          startVf1Yield: this.searchKey.vfYieldMin,
          endVf1Yield: this.searchKey.vfYieldMax,
          startVzYield: this.searchKey.vzYieldMin,
          endVzYield: this.searchKey.vzYieldMax,
          // IR
          startLr: this.searchKey.irMin,
          endLr: this.searchKey.irMax,
          startIv: this.searchKey.ivMin,
          endIv: this.searchKey.ivMax,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      } else {
        requestParams = {
          // 产地 searchKey.cd
          origin: this.searchKey.cd,
          product: this.searchKey.sclx,
          startKVal: this.searchKey.plCowMin,
          endKVal: this.searchKey.plCowMax,
          startCowWd: this.searchKey.yCowMin,
          endCowWd: this.searchKey.yCowMax,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }
      getList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = res.data.total
        this.listLoading = false
        this.selectedRunRow = this.list[0]
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.list[0])
        }, 200)
      })
    },
    // 设置备注
    handleSetRemark() {
      this.setRemarkDialogVisible = true
      this.remarkForm.waferId = this.selectedRunRow.waferId
    },
    // 添加
    handleAdd() {
      this.siteForm.siteType = ''
      this.siteForm.siteName = ''
      this.siteForm.siteStatus = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose() {
      this.remarkForm.remark = ''
    },
    // 添加提交
    submitForm(formName) {
      if (this.remarkForm.remark === '') {
        this.$message({
          type: 'error',
          message: '请输入备注信息!'
        })
        return false
      }
      const params = {
        id: this.selectedRunRow.id,
        remark: this.remarkForm.remark
      }
      updateRemark(params).then(res => {
        this.$message({
          type: 'success',
          message: '设置成功!'
        })
        this.setRemarkDialogVisible = false
        switch (this.activeTabIndex) {
          case 0 : this.handleSearch(1)
            break
          case 1 : this.handleSearch(2)
            break
          case 2 : this.handleSearch(3)
            break
          case 3 : this.handleSearch(4)
            break
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.setRemarkDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}

