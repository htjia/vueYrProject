
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findOutgoingRule, findPickWafer, findPickRule, outgoingSave, ckOutbillTypeFind } from '@/api/chipManage/extensionStorageManage/outStorage'
import { findKctzWaferList, insertKctz, findOutList, findDetailList, findOrderList } from '@/api/chipStoreManage/chipOutStorage'
import { findCustomer, findById } from '@/api/orderManage/custormization'
import { findFieldSelectList } from '@/api/chipStoreManage/chipPutInStorage'
import { printLabel, printOutBill } from '@/api/chipManage/extensionStorageManage/outStorageSelect'
import orderDia from '../../orderManage/orderDia'
import custormizatoinDia from '../../orderManage/custormizatoinDia'
const formTheadStore = [
  {
    thName: '包号',
    thKey: 'boxNo',
    width: 130
  },
  {
    thName: '项次号',
    thKey: 'sequence',
    width: 100
  },
  { thName: 'WaferID', thKey: 'code', width: 200 },
  { thName: 'TapeNo', thKey: 'tapeNo', width: 180 },
  { thName: '柜位', thKey: 'arkName', width: 100 },
  { thName: '入库类型', thKey: 'storeType', width: 100 },
  { thName: '芯片产地', thKey: 'product', width: 100 },
  { thName: '状态', thKey: 'status', width: 100 },
  { thName: '客户', thKey: 'customer', width: 100 },
  { thName: '产品型号', thKey: 'taskModel', width: 100 },
  {
    thName: '光色',
    thKey: 'color',
    width: 70
  },
  {
    thName: '型号',
    thKey: 'model',
    width: 70
  },
  {
    thName: '工艺代码',
    thKey: 'craft',
    width: 75
  },
  {
    thName: '电极代码',
    thKey: 'electrode',
    width: 75
  },
  { thName: '入库时间', thKey: 'createTime', width: 100 },
  { thName: '初次入库日期', thKey: 'initTime', width: 130 },
  {
    thName: '测试时间',
    thKey: 'testTime',
    width: 150
  },
  {
    thName: '外延尺寸',
    thKey: 'size',
    width: 80
  },
  {
    thName: '外观等级',
    thKey: 'classify',
    width: 80
  },
  {
    thName: '测试机台',
    thKey: 'machine',
    width: 80
  },
  {
    thName: '标签名称',
    thKey: 'label',
    width: 100
  },
  {
    thName: 'Mapping图',
    thKey: 'mapping',
    width: 100
  },
  {
    thName: '亮度代码',
    thKey: 'brightCode',
    width: 80
  },
  {
    thName: '波长代码',
    thKey: 'waveCode',
    width: 80
  },
  {
    thName: '电压代码',
    thKey: 'voltageCode',
    width: 80
  },
  {
    thName: '集中度代码',
    thKey: 'concentCode',
    width: 80
  },
  {
    thName: '综合等级代码',
    thKey: 'compreCode',
    width: 120
  },
  {
    thName: '颗粒数',
    thKey: 'sliceCount',
    width: 80
  },
  {
    thName: '研磨厚度',
    thKey: 'grind',
    width: 80
  },
  {
    thName: '归一亮度',
    thKey: 'normaCode',
    width: 80
  },
  {
    thName: 'ESD测试电压(正向)',
    thKey: 'esdElec',
    width: 140
  },
  {
    thName: 'ESD测试电压(反向)',
    thKey: 'esdElecReverse',
    width: 140
  },
  {
    thName: '测试电流(mA)',
    thKey: 'electricity',
    width: 100
  }
]
const formTheadStoreParams = [
  {
    thName: 'WLD_MIN',
    thKey: 'wldMin',
    width: 90
  },
  {
    thName: 'WLD_AVG',
    thKey: 'wldAvg',
    width: 90
  },
  {
    thName: 'WLD_MAX',
    thKey: 'wldMax',
    width: 90
  },
  {
    thName: 'WLD_STD',
    thKey: 'wldStd',
    width: 90
  },
  {
    thName: 'WLP_MIN',
    thKey: 'wlpMin',
    width: 90
  },
  {
    thName: 'WLP_AVG',
    thKey: 'wlpAvg',
    width: 90
  },
  {
    thName: 'WLP_MAX',
    thKey: 'wlpMax',
    width: 90
  },
  {
    thName: 'WLP_STD',
    thKey: 'wlpStd',
    width: 90
  },
  {
    thName: 'WLC_MIN',
    thKey: 'wlcMin',
    width: 90
  },
  {
    thName: 'WLC_AVG',
    thKey: 'wlcAvg',
    width: 90
  },
  {
    thName: 'WLC_MAX',
    thKey: 'wlcMax',
    width: 90
  },
  {
    thName: 'WLC_STD',
    thKey: 'wlcStd',
    width: 90
  },
  {
    thName: 'LOP1_MIN',
    thKey: 'lopMin',
    width: 90
  },
  {
    thName: 'LOP1_AVG',
    thKey: 'lopAvg',
    width: 90
  },
  {
    thName: 'LOP1_MAX',
    thKey: 'lopMax',
    width: 90
  },
  {
    thName: 'LOP1_STD',
    thKey: 'lopStd',
    width: 90
  },
  {
    thName: 'VF1_MIN',
    thKey: 'vf1Min',
    width: 90
  },
  {
    thName: 'VF1_AVG',
    thKey: 'vf1Avg',
    width: 90
  },
  {
    thName: 'VF1_MAX',
    thKey: 'vf1Max',
    width: 90
  },
  {
    thName: 'VF1_STD',
    thKey: 'vf1Std',
    width: 100
  },
  {
    thName: 'VF2_MIN',
    thKey: 'vf2Min',
    width: 90
  },
  {
    thName: 'VF2_AVG',
    thKey: 'vf2Avg',
    width: 90
  },
  {
    thName: 'VF2_MAX',
    thKey: 'vf2Max',
    width: 90
  },
  {
    thName: 'VF2_STD',
    thKey: 'vf2Std',
    width: 90
  },
  {
    thName: 'VF3_MIN',
    thKey: 'vf3Min',
    width: 90
  },
  {
    thName: 'VF3_AVG',
    thKey: 'vf3Avg',
    width: 90
  },
  {
    thName: 'VF3_MAX',
    thKey: 'vf3Max',
    width: 90
  },
  {
    thName: 'VF3_STD',
    thKey: 'vf3Std',
    width: 90
  },
  {
    thName: 'VF4_MIN',
    thKey: 'vf4Min',
    width: 90
  },
  {
    thName: 'VF4_AVG',
    thKey: 'vf4Avg',
    width: 90
  },
  {
    thName: 'VF4_MAX',
    thKey: 'vf4Max',
    width: 90
  },
  {
    thName: 'VF4_STD',
    thKey: 'vf4Std',
    width: 90
  },
  {
    thName: 'IR_MIN',
    thKey: 'irMin',
    width: 90
  },
  {
    thName: 'IR_AVG',
    thKey: 'irAvg',
    width: 90
  },
  {
    thName: 'IR_MAX',
    thKey: 'irMax',
    width: 90
  },
  {
    thName: 'IR_STD',
    thKey: 'irStd',
    width: 90
  },
  {
    thName: 'VZ1_MIN',
    thKey: 'vzMin',
    width: 90
  },
  {
    thName: 'VZ1_AVG',
    thKey: 'vzAvg',
    width: 90
  },
  {
    thName: 'VZ1_MAX',
    thKey: 'vzMax',
    width: 90
  },
  {
    thName: 'VZ1_STD',
    thKey: 'vzStd',
    width: 90
  },
  {
    thName: 'HW1均值',
    thKey: 'hwAvg',
    width: 90
  },
  {
    thName: '综合良率',
    thKey: 'compreYield',
    width: 90
  },
  {
    thName: 'VF1良率',
    thKey: 'vf1Yield',
    width: 90
  },
  {
    thName: 'VF2良率',
    thKey: 'vf2Yield',
    width: 90
  },
  {
    thName: 'VF3良率',
    thKey: 'vf3Yield',
    width: 90
  },
  {
    thName: 'VF4良率',
    thKey: 'vf4Yield',
    width: 90
  },
  {
    thName: 'IR良率',
    thKey: 'irYield',
    width: 90
  },
  {
    thName: 'DVF良率',
    thKey: 'dvfYield',
    width: 90
  },
  {
    thName: 'WLD良率',
    thKey: 'wldYield',
    width: 90
  },
  {
    thName: 'WLP良率',
    thKey: 'wlpYield',
    width: 90
  },
  {
    thName: 'WLC良率',
    thKey: 'wlcYield',
    width: 90
  },
  {
    thName: 'VZ良率',
    thKey: 'vzYield',
    width: 90
  },
  {
    thName: 'IV良率',
    thKey: 'ivYield',
    width: 90
  },
  {
    thName: 'EDS_IR_A良率',
    thKey: 'irEsdAYield',
    width: 100
  },
  {
    thName: 'WLD_5nm良率',
    thKey: 'wldNm5Yield',
    width: 110
  },
  {
    thName: 'WLP_5nm良率',
    thKey: 'wlpNm5Yield',
    width: 100
  }
]
const formTheadfStore = [
  {
    thName: '包号',
    thKey: 'boxNo',
    width: 130
  },
  {
    thName: '项次号',
    thKey: 'sequence',
    width: 100
  },
  { thName: 'ChipNo', thKey: 'code', width: 200 },
  { thName: 'TapeNo', thKey: 'tapeNo', width: 180 },
  { thName: '柜位', thKey: 'arkName', width: 100 },
  { thName: '芯片产地', thKey: 'product', width: 100 },
  { thName: '入库类型', thKey: 'storeType', width: 100 },
  { thName: '入库时间', thKey: 'createTime', width: 100 },
  { thName: '初次入库日期', thKey: 'initTime', width: 130 },
  { thName: '状态', thKey: 'status', width: 100 },
  { thName: '客户', thKey: 'customer', width: 100 },
  {
    thName: '产品型号',
    thKey: 'taskModel',
    width: 120
  },
  {
    thName: '光色',
    thKey: 'color',
    width: 70
  },
  {
    thName: '型号',
    thKey: 'model',
    width: 70
  },
  {
    thName: '工艺代码',
    thKey: 'craft',
    width: 75
  },
  {
    thName: '电极代码',
    thKey: 'electrode',
    width: 75
  },
  {
    thName: '下Bin时间',
    thKey: 'binTime',
    width: 150
  },
  {
    thName: 'Bin类型',
    thKey: 'binType',
    width: 100
  },
  {
    thName: '外观等级',
    thKey: 'classify',
    width: 80
  },
  {
    thName: '机台号',
    thKey: 'machine',
    width: 70
  },
  {
    thName: '标签名称',
    thKey: 'label',
    width: 100
  },
  {
    thName: '亮度代码',
    thKey: 'brightCode',
    width: 100
  },
  {
    thName: '波长代码',
    thKey: 'waveCode',
    width: 100
  },
  {
    thName: '电压代码',
    thKey: 'voltageCode',
    width: 100
  },
  {
    thName: '颗粒计数',
    thKey: 'sliceCount',
    width: 80
  },
  {
    thName: '研磨厚度',
    thKey: 'grind',
    width: 100
  },
  {
    thName: 'ESD测试电压(正向)',
    thKey: 'esdElec',
    width: 140
  },
  {
    thName: 'ESD测试电压(反向)',
    thKey: 'esdElecReverse',
    width: 140
  },
  {
    thName: '测试电流(mA)',
    thKey: 'electricity',
    width: 100
  }
]
const formTheadfStoreParams = [
  {
    thName: 'WLD_MIN',
    thKey: 'wldMin',
    width: 90
  },
  {
    thName: 'WLD_AVG',
    thKey: 'wldAvg',
    width: 90
  },
  {
    thName: 'WLD_MAX',
    thKey: 'wldMax',
    width: 90
  },
  {
    thName: 'WLD_STD',
    thKey: 'wldStd',
    width: 90
  },
  {
    thName: 'WLP_MIN',
    thKey: 'wlpMin',
    width: 90
  },
  {
    thName: 'WLP_AVG',
    thKey: 'wlpAvg',
    width: 90
  },
  {
    thName: 'WLP_MAX',
    thKey: 'wlpMax',
    width: 90
  },
  {
    thName: 'WLP_STD',
    thKey: 'wlpStd',
    width: 90
  },
  {
    thName: 'WLC_MIN',
    thKey: 'wlcMin',
    width: 90
  },
  {
    thName: 'WLC_AVG',
    thKey: 'wlcAvg',
    width: 90
  },
  {
    thName: 'WLC_MAX',
    thKey: 'wlcMax',
    width: 90
  },
  {
    thName: 'WLC_STD',
    thKey: 'wlcStd',
    width: 90
  },
  {
    thName: 'VF1_MIN',
    thKey: 'vf1Min',
    width: 90
  },
  {
    thName: 'VF1_AVG',
    thKey: 'vf1Avg',
    width: 90
  },
  {
    thName: 'VF1_MAX',
    thKey: 'vf1Max',
    width: 90
  },
  {
    thName: 'VF1_STD',
    thKey: 'vf1Std',
    width: 90
  },
  {
    thName: 'IR_MIN',
    thKey: 'irMin',
    width: 90
  },
  {
    thName: 'IR_AVG',
    thKey: 'irAvg',
    width: 90
  },
  {
    thName: 'IR_MAX',
    thKey: 'irMax',
    width: 90
  },
  {
    thName: 'IR_STD',
    thKey: 'irStd',
    width: 90
  },
  {
    thName: 'VZ1_MIN',
    thKey: 'vzMin',
    width: 90
  },
  {
    thName: 'VZ1_AVG',
    thKey: 'vzAvg',
    width: 90
  },
  {
    thName: 'VZ1_MAX',
    thKey: 'vzMax',
    width: 90
  },
  {
    thName: 'VZ1_STD',
    thKey: 'vzStd',
    width: 90
  },
  {
    thName: 'LOP1_MIN',
    thKey: 'lopMin',
    width: 90
  },
  {
    thName: 'LOP1_AVG',
    thKey: 'lopAvg',
    width: 90
  },
  {
    thName: 'LOP1_MAX',
    thKey: 'lopMax',
    width: 90
  },
  {
    thName: 'LOP1_STD',
    thKey: 'lopStd',
    width: 90
  }
]
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, custormizatoinDia, orderDia },
  data() {
    return {
      listLoading: false,
      recordDialogVisible: false,
      selectedDialogVisible: false,
      adjustmentDialogVisible: false,
      kzhDialogVisible: false,
      metalDialogVisible: false,
      notBastic: false,
      searchKeys: {
        ddbh: '',
        ddlx: '',
        ddzt: '',
        khmc: ''
      },
      orderNo: '',
      orderType: '',
      customer: '',
      tableKey1: '',
      tableKey2: '',
      custormForm: '',
      waferNo: '',
      isActive: 0,
      recordTimeRadio: 1,
      count: 0,
      waferTol: 0,
      sliceType: 0,
      activeTabIndex: 0,
      formTheadStore: formTheadStore,
      formTheadStoreParams: formTheadStoreParams,
      formTheadfStore: formTheadfStore,
      formTheadfStoreParams: formTheadfStoreParams,
      countDisabled: false,
      waferTotalNum: 24,
      abnormalList: [{}],
      detailList: [{}],
      receiveList: [{}],
      selectedRunRow: {},
      model: '',
      list: [],
      recordList: [],
      waferList: [],
      printData: [],
      pickRuleList: [],
      customerList: [],
      specialList: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 15,
      pageNum: 1,
      recordPageSize: 12,
      recordPageNum: 1,
      recordTotalPage: 0,
      totalPage: 0,
      beginDate: Date.now(),
      endDate: Date.now(),
      beginRecordDate: '',
      endRecordDate: '',
      pickerRecordOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endRecordDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerRecordOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginRecordDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
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
      timeRadio: 0,
      tableKey: 0,
      ruleName: '',
      version: '',
      contentList: [],
      orderOptions: [
        { id: 0, name: '出库' },
        { id: 1, name: '备货' },
        { id: 2, name: '返回产线' }
      ],
      orderTypeOptions: [
        { id: 0, name: '销售出库' },
        { id: 1, name: 'PC调出' },
        { id: 2, name: '库存调整' }
      ],
      statusOptions: [
        { id: 1, name: '待接收' },
        { id: 2, name: '出货中' },
        { id: 3, name: '已完成' },
        { id: 4, name: '备货完成' },
        { id: 7, name: '挑片中' }
      ],
      customerOptions: [],
      reservedFields: [],
      auditOptions: [
        { id: 0, name: '待挑片' },
        { id: 1, name: '待审核' },
        { id: 2, name: '审核通过' },
        { id: 3, name: '审核不通过' },
        { id: 4, name: '取消' }
      ],
      adjustmentForm: {
        checked: false,
        rule: '',
        versions: '',
        wafers: '',
        khmc: '',
        num: '',
        outType: '',
        remark: ''
      },
      rules: {
        rule: [{ required: true, message: '请选择挑片规则', trigger: 'blur' }],
        khmc: [{ required: true, message: '请选择客户名称', trigger: 'blur' }],
        num: [{ required: true, message: '请输入挑片数量', trigger: 'blur' }],
        wafers: [{ required: true, message: '请输入WaferId', trigger: 'blur' }],
        outType: [{ required: true, message: '请选择出库类型', trigger: 'blur' }]
      },
      currentId: '',
      row: '',
      isRow: '',
      orderTitle: '',
      disabled: ''
    }
  },
  computed: {
    chipCount() {
      let total = 0
      this.waferList.map(item => { total += parseFloat(item.kCount) })
      return total.toFixed(3)
    }
  },
  mounted() {
    this.fetchData()
    this.findCustomerFun()
    this.findPickRuleFun()
    this.ckOutbillTypeFindFun()
    this.findReservedFieldList()
  },
  methods: {
    viewDetail(row) {
      this.row = row
      this.isRow = 2
      this.orderTitle = '查看订单'
      this.metalDialogVisible = true
      this.disabled = true
    },
    dialogFalse(val) {
      this.metalDialogVisible = false
    },
    watchCustorm(ruleId) {
      const requestParams = {
        ruleId
      }
      findById(requestParams).then(res => {
        this.custormForm = res.data
        this.tableKey = Math.random()
        this.kzhDialogVisible = true
      })
    },
    rowStyle({ row }) {
      if (row.priority) {
        return 'background: rgb(248, 218, 218)'
      }
    },
    // 开始挑片
    handleStartSelect(row) {
      this.$router.push({ path: '/chipStoreManage/splitPackage', query: { orderNo: row.orderNo, id: row.id, sliceType: row.pattern }})
    },
    navClick(index) {
      if (index === 1 && this.recordList.length !== 0) {
        this.findWafer(this.selectedRunRow.id)
      }
      this.isActive = index
    },
    findWafer(id) {
      const params = {
        id,
        sliceType: this.selectedRunRow.sliceType,
        pageNum: 1,
        pageSize: 100000
      }
      findDetailList(params).then(res => {
        this.waferList = res.data.list
      })
    },
    viewSplitDetail(row) {
      this.$router.push({ path: '/chipStoreManage/splitPackage', query: { orderNo: row.orderNo, id: row.orderId, sliceType: row.sliceType, outStorageId: row.id, boxNum: row.boxNum, outNum: row.outNum, outOrder: row.outNo }})
    },

    handleView(row) {
      this.$router.push({ path: '/chipStoreManage/splitPackage', query: { orderNo: row.orderNo, id: row.orderId, sliceType: row.sliceType, view: 1, outStorageId: row.id, boxNum: row.boxNum, outNum: row.outNum, outOrder: row.outNo }})
    },
    submitInsertKctz() {
      const details = []
      this.waferList.map(wafer => {
        details.push({
          detailId: wafer.id,
          taskModel: wafer.taskModel
        })
      })
      const params = {
        creator: sessionStorage.getItem('User-Id'),
        sliceType: this.sliceType,
        details
      }
      insertKctz(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.adjustmentDialogVisible = false
      })
    },
    findKctzWaferListFun() {
      if (this.waferList.filter(item => { return item.code === this.waferNo }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前片号已存在!'
        })
        this.waferNo = ''
        return false
      }
      const params = {
        code: this.waferNo,
        sliceType: this.sliceType
      }
      findKctzWaferList(params).then(res => {
        if (res.data.length === 0) {
          this.$message({
            type: 'error',
            message: '未检索到wafer信息，请检查后重试!'
          })
        }
        res.data.map(item => {
          if (item.status === 0) {
            item.status = '在库'
          } else if (item.status === 1) {
            item.status = '备库'
          } else if (item.status === 2) {
            item.status = '出库'
          } else if (item.status === 3) {
            item.status = '退库'
          } else if (item.status === 4) {
            item.status = '返工'
          } else if (item.status === 5) {
            item.status = '待查'
          }
        })
        this.waferList = [...res.data, ...this.waferList]
        this.waferNo = ''
      }).catch(() => {
        this.waferNo = ''
      })
    },
    // 获取预留字段
    findReservedFieldList() {
      findFieldSelectList().then(res => {
        this.reservedFields = res.data
      })
    },
    // 导出
    handleExport() {
      let columnEn = ''
      let columnCn = ''
      if (this.selectedRunRow.sliceType === 0) {
        for (const item of this.formTheadStore) {
          if (columnCn === '') {
            columnCn = item.thName
          } else {
            columnCn = columnCn + ',' + item.thName
          }
          if (columnEn === '') {
            columnEn = item.thKey
          } else {
            columnEn = columnEn + ',' + item.thKey
          }
        }
        this.reservedFields.map(item => {
          columnCn = columnCn + ',' + item.name
          columnEn = columnEn + ',' + item.code
        })
        this.formTheadStoreParams.map(item => {
          columnCn = columnCn + ',' + item.thName
          columnEn = columnEn + ',' + item.thKey
        })
      } else {
        for (const item of this.formTheadfStore) {
          if (columnCn === '') {
            columnCn = item.thName
          } else {
            columnCn = columnCn + ',' + item.thName
          }
          if (columnEn === '') {
            columnEn = item.thKey
          } else {
            columnEn = columnEn + ',' + item.thKey
          }
        }
        this.reservedFields.map(item => {
          columnCn = columnCn + ',' + item.name
          columnEn = columnEn + ',' + item.code
        })
        this.formTheadfStoreParams.map(item => {
          columnCn = columnCn + ',' + item.thName
          columnEn = columnEn + ',' + item.thKey
        })
      }
      window.open(process.env.BASE_API + `/xpOutgoing/findExportList?id=${this.selectedRunRow.id}&sliceType=${this.selectedRunRow.sliceType}&headerCn=${columnCn}&headerEn=${columnEn}`)
    },
    recordRowClick(row) {
      this.selectedRunRow = row
      this.sliceType = row.sliceType
      this.waferTol = row.pickNum
    },
    // 每页数量改变
    recordSizeChange(recordPageSize) {
      this.recordPageSize = recordPageSize
      this.viewRecord()
    },
    // 当前页数改变
    recordCurrentChange(recordPageNum) {
      this.recordPageNum = recordPageNum
      this.viewRecord()
    },
    // 出库记录
    viewRecord() {
      this.isActive = 0
      const params = {
        orderNo: this.orderNo,
        orderType: this.orderType,
        customer: this.customer,
        timeType: this.recordTimeRadio,
        startTime: this.beginRecordDate === '' ? '' : this.formatDate(this.beginRecordDate),
        endTime: this.endRecordDate === '' ? '' : this.formatDate(this.endRecordDate),
        pageNum: this.recordPageNum,
        pageSize: this.recordPageSize
      }
      findOutList(params).then(res => {
        this.recordDialogVisible = true
        this.recordList = res.data.list
        this.recordTotalPage = parseInt(res.data.total)
        this.waferTol = this.recordList[0].pickNum
        this.selectedRunRow = this.recordList[0]
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.recordList[0])
        }, 200)
      })
    },
    handleCloseDialog() {
      this.orderNo = ''
      this.orderType = ''
      this.customer = ''
      this.recordTimeRadio = 0
      this.beginRecordDate = ''
      this.endRecordDate = ''
    },
    handleDialogSearch() {
      this.pageNum = 1
      this.viewRecord()
    },
    clearDialogSearch() {
      this.orderNo = ''
      this.orderType = ''
      this.customer = ''
      this.recordTimeRadio = 0
      this.beginRecordDate = ''
      this.endRecordDate = ''
      this.viewRecord()
    },
    tabClick(index) {
      this.activeTabIndex = index
      // this.configuring = false
      // this.fetchData()
    },
    // 库存调出
    handleStorageOut() {
      this.waferList = []
      this.selectedDialogVisible = true
    },
    submitadSelectedType() {
      this.adjustmentDialogVisible = true
      setTimeout(() => {
        this.$refs.scanInput.focus()
      })
    },
    // 单据类型
    ckOutbillTypeFindFun() {
      ckOutbillTypeFind({}).then(res => {
        this.processOptions = res.data
      })
    },
    // 客户
    findCustomerFun() {
      findCustomer({}).then(res => {
        this.customerList = res.data
      })
    },
    // 挑片规则
    findPickRuleFun() {
      findPickRule({}).then(res => {
        this.pickRuleList = res.data
      })
    },
    adjustment() {
      this.adjustmentDialogVisible = true
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
    clearSearch() {
      this.beginDate = Date.now()
      this.endDate = Date.now()
      this.searchKeys.ddbh = ''
      this.searchKeys.ddlx = ''
      this.searchKeys.ddzt = ''
      this.searchKeys.khmc = ''
      this.timeRadio = 0
      this.handleSearch()
    },
    // 异常原因合并行
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        return {
          rowspan: 12,
          colspan: 1
        }
      }
    },
    // 单击异常详情信息
    detailRowClick(row) {
      this.$refs.detailTable.toggleRowSelection(row)
    },
    // 异常提交
    abnormalSubmit() {
      this.abnormalReportDialog = false
    },
    // 接片
    handleReceive() {
      this.receiveDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputJp.focus()
      }, 100)
    },
    handleReceiveInput() {
      this.receiveList.push({})
    },
    deleteItem(index) {
      this.$confirm('确认删除该信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.receiveList.splice(index, 1)
      })
    },
    // 接片确认
    handleReceiveDialog() {
      console.log(1)
    },
    // 传片
    handleTransmit() {
      this.transmitDialogVisible = true
      setTimeout(() => {
        this.$refs.importInputCp.focus()
      }, 100)
    },
    // 传片确认
    handleTransmitDialog() {
      console.log(1)
    },
    // 拆批数据
    batchDate() {
      this.batchDialogVisible = true
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
      const requestParams = {
        isck: 'sdf',
        orderNo: this.searchKeys.ddbh,
        orderType: this.searchKeys.ddlx, // 订单类型
        timeType: this.timeRadio,
        customerId: this.searchKeys.khmc,
        status: this.searchKeys.ddzt,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      findOrderList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        this.selectedRunRow = this.list[0]
        setTimeout(() => {
          this.$refs.billTable.setCurrentRow(this.list[0])
        }, 200)
      })
    },
    // 单击异常信息
    rowClick(row) {
      this.selectedRunRow = row
    },
    handlePrint() {
      printOutBill({ id: this.selectedRunRow.id }).then(res => {
        this.printData = []
        for (var i in res.data) {
          this.printData.push({
            boxNo: i,
            wafers: res.data[ i ]
          })
        }
        console.log(this.printData)
        this.printDialogVisible = true
      })
    },
    printSwitch() {
      this.$print(this.$refs.print)
    },
    handleBoxPrint() {
      // 打印出库盒标签
      printLabel({ id: this.selectedRunRow.id, module: 'scOutgoing' }).then(res => {
        this.$message({
          type: 'success',
          message: '标签正在打印中，请稍候！'
        })
      })
    },
    // 挑片规则
    viewRules(row) {
      if (row.rules === '特殊挑片') {
        this.detailDialogVisible = true
        findPickWafer({ id: row.id }).then(res => {
          this.specialList = res.data
        })
      } else {
        this.rulesDialogVisible = true
        findOutgoingRule({ id: row.id }).then(res => {
          this.ruleName = res.data[0].name
          this.version = res.data[0].version
          this.contentList = res.data[0].contentList
        })
      }
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
      this.selectedDialogVisible = false
      this.sliceType = 0
      this.waferList = []
      this.adjustmentForm.checked = false
      this.adjustmentForm.rule = ''
      this.adjustmentForm.versions = ''
      this.adjustmentForm.wafers = ''
      this.adjustmentForm.khmc = ''
      this.adjustmentForm.num = ''
      this.adjustmentForm.outType = ''
      this.adjustmentForm.remark = ''
    },
    // 设置版本
    ruleChange(val) {
      console.log(val)
      this.pickRuleList.map(item => {
        if (item.id === val) {
          this.adjustmentForm.versions = item.version
          this.count = item.count
        }
      })
    },
    checkboxChange(data) {
      this.countDisabled = data
      this.adjustmentForm.num = 0
    },
    getNum() {
      if (this.adjustmentForm.wafers === '') {
        return
      }
      const arr = this.adjustmentForm.wafers.split(/\n/)
      this.adjustmentForm.num = arr.length
    },
    // 库存调整提交
    submitadjustmentForm(formName) {
      if (this.adjustmentForm.checked) {
        if (this.adjustmentForm.wafers === '') {
          this.$message({
            type: 'error',
            message: '请输入需要手动挑片的WaferId!'
          })
          return false
        }
      } else {
        if (this.adjustmentForm.rule === '') {
          this.$message({
            type: 'error',
            message: '请选择挑片规则!'
          })
          return false
        }
        if (this.adjustmentForm.num > this.count) {
          this.$message({
            type: 'error',
            message: '挑片数量不能大于库存数量!'
          })
          return false
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            creator: sessionStorage.getItem('User-Id'),
            customer: this.adjustmentForm.khmc,
            orderType: 3,
            pickNo: this.adjustmentForm.num,
            remark: this.adjustmentForm.remark,
            ruleIds: this.adjustmentForm.checked ? '' : this.adjustmentForm.rule,
            status: 2,
            type: this.adjustmentForm.outType,
            waferIds: this.adjustmentForm.checked ? this.adjustmentForm.wafers.split(/\n/).join(',') : ''
          }
          console.log(params)
          outgoingSave(params).then(res => {
            this.adjustmentDialogVisible = false
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      this.notBastic = row.isbastic === 1
      this.currentId = row.id
      this.siteForm.siteType = row.type
      this.siteForm.siteName = row.name
      this.siteForm.siteStatus = row.status
      this.editDialogVisible = true
    }
  }
}

