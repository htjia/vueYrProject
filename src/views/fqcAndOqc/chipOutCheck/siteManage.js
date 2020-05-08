
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findProductCode } from '@/api/chipManage/rearSiteManage/cowInfo'
import { findOptions, findCustomer } from '@/api/orderManage/custormization'
import { findFieldSelectList } from '@/api/chipStoreManage/chipPutInStorage'
import { findAuditList, findDetailList, findCheckResultList, insertCheckResult, audit, findFbSelect, findGroupSubPackParams, deleteCheckResult } from '@/api/fqcAndOqc/chipOutStorage'
import custormizatoinDia from '../../orderManage/custormizatoinDia'
const formTheadStore = [
  { thName: 'WaferID', thKey: 'code', width: 200 },
  { thName: 'TapeNo', thKey: 'tapeNo', width: 180 },
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
  { thName: 'ChipNo', thKey: 'code', width: 200 },
  { thName: 'TapeNo', thKey: 'tapeNo', width: 180 },
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
import { findFbDetailList } from '@/api/chipStoreManage/chipOutStorage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, custormizatoinDia },
  data() {
    return {
      siveDialogVisible: false,
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      viewProgressVisible: false,
      selectTheadVisble: false,
      productionDataVisible: false,
      kzhDialogVisible: false,
      examineDialogVisible: false,
      viewDetailDialogVisible: false,
      showMoreParamsVisable: false,
      isSubmit: false,
      isView: false,
      formTheadStore: formTheadStore,
      formTheadStoreParams: formTheadStoreParams,
      formTheadfStore: formTheadfStore,
      formTheadfStoreParams: formTheadfStoreParams,
      outParamList: [],
      paramList: [],
      boxWaferList: [],
      custormizationList: [],
      waferList: [],
      recordList: [],
      pageDialogNum: 1,
      pageDialogSize: 15,
      tableKey: 0,
      tableKey2: 0,
      totalDialogPage: 0,
      reverseReason: '',
      waferNo: '',
      selectedBox: '',
      auditStaus: '',
      sliceType: '',
      selectedRunRow: {},
      outResultData: '',
      reservedFields: [],
      deleteBoxs: [],
      deleteWaferIds: [],
      custormForm: {},
      customerList: [],
      sliceTypeList: [
        { id: 0, name: '圆片' },
        { id: 1, name: '方片' }
      ],
      statusOptions: [
        { id: 1, name: '待审核' },
        { id: 4, name: '审核中' },
        { id: 2, name: '通过' },
        { id: 3, name: '不通过' }
      ],
      list: [{ status: 0 }],
      viewForm: {
        khmc: '',
        ddh: '',
        ckdh: '',
        cpxh: '',
        px: '',
        bs: '',
        ckslp: '',
        ckslk: '',
        ckr: '',
        cksj: '',
        shr: '',
        shsj: '',
        remark: ''
      },
      boxNo: '',
      waferTol: 0,
      timeRadio: 1,
      wgRadio: 0,
      bzRadio: 0,
      gcRadio: 0,
      isActive: 0,
      activeTabIndex: 0,
      addIndex: 0,
      paramsKey: 0,
      selectedRow: {},
      boxNoOptions: [],
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
      crrentCode: '',
      currentCraftId: '',
      crrentCopyId: '',
      currentCardType: '',
      currentCardName: '',
      currentCraft: '',
      currentRemark: '',
      currentCreateTime: '',
      currentUpdateTime: '',
      currentCreator: '',
      currentModifier: '',
      currentModelList: [],
      dialogList: [],
      dialogEndList: [],
      sliceList: [],
      sliceListStart: [],
      sliceListEnd: [],
      modelList: [],
      endList: [],
      forepartSiteOptions: [],
      processOptions: [],
      endSiteOptions: [],
      detailList: [{}],
      detailRow: {},
      scheduleList: [],
      userOptions: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      alreadyNum: 0,
      checkCount: 0,
      firstCheckCount: 0,
      beginDate: '',
      finishBeginDate: '',
      endDate: '',
      finishEndDate: '',
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
        ddbh: '',
        ckdh: '',
        kzh: '',
        khmc: '',
        px: '',
        cpxh: '',
        status: '',
        sczt: '',
        waferNo: '',
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
    this.getCustormization()
    this.findCustomer()
    this.findProductCodeFun()
    this.findReservedFieldList()
    this.fetchData()
  },
  computed: {
    // checkCount() {
    //   let num = 0
    //   this.recordList.map(item => {
    //     num += item.checkCount
    //   })
    //   return num
    // },
    chipCount() {
      let num = 0
      this.boxWaferList.map(item => {
        num += parseInt(item.binCount)
      })
      return num
    }
  },
  methods: {
    setAlreadyNum() {
      this.alreadyNum = 0
      this.boxWaferList.map(item => {
        if (item.lastItemAllActive) {
          this.alreadyNum++
        }
      })
      this.checkCount += this.alreadyNum
    },
    // 审核确定
    submitForm(index) {
      if (index !== 3) { // 审核完成 '', 确定 4
        this.isSubmit = true
        this.boxFocus(index)
      } else { // 反审
        const params = {
          remark: this.viewForm.remark,
          id: this.selectedRunRow.id,
          status: index,
          auditor: sessionStorage.getItem('User-Id'),
          auditResult: this.reverseReason
        }
        audit(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.examineDialogVisible = false
          this.fetchData()
        })
      }
    },
    // 显示更多参数
    showMoreParams() {
      this.showMoreParamsVisable = true
    },
    // 一键全扫
    fullScan() {
      this.boxWaferList.map(item => {
        if (!item.active && !item.lastActive) {
          item.lastItemAllActive = true
        }
      })
      this.boxWaferList.map(item => {
        item.active = true
      })
      this.tableKey = Math.random()
      this.tableKey2 = Math.random()
      this.boxNoOptions.map(item => {
        if (item.box === this.boxNo && !item.isAllScan) {
          item['isAllScan'] = true
          this.setAlreadyNum()
        }
      })
    },
    handleSelectItem() {
      let hasWafer = false
      let selectedIndex = 0
      let alreadyRxist = false
      this.boxWaferList.map((item, index) => {
        if (item.code === this.waferNo) {
          if (item.active) {
            alreadyRxist = true
          }
          item.active = true
          selectedIndex = index
          item.lastActive = true
          hasWafer = true
        }
      })
      this.tableKey = Math.random()
      this.tableKey2 = Math.random()
      if (!hasWafer) {
        this.$message({
          type: 'error',
          message: '当前Wafer不存在，请检查后重试!'
        })
        this.gcRadio = 1
        return false
      }
      if (alreadyRxist) {
        this.$message({
          type: 'error',
          message: '当前Wafer已存在，请检查后重试!'
        })
        return false
      }
      this.checkCount++
      setTimeout(() => {
        this.waferNo = ''
      })
      setTimeout(() => {
        console.log(this.$refs.tableList)
        this.$refs.tableList.bodyWrapper.scrollTop = selectedIndex * 37
      }, 500)
    },
    rowStyle({ row }) {
      if (row.active) {
        return 'background: #65ba7d'
      } else {
        return ''
      }
    },
    orderRowStyle({ row }) {
      if (row.priority) {
        return 'background: rgb(248, 218, 218)'
      }
    },
    boxFocus(index) {
      if (this.auditStaus === '不通过' || this.auditStaus === '通过') {
        return false
      }
      const checkArr = this.boxWaferList.filter(item => { return item.active })
      const lastCheckArr = this.boxWaferList.filter(item => { return item.lastActive })
      this.deleteBoxs.push(this.selectedBox)
      console.log(this.deleteBoxs)
      if (lastCheckArr.length !== 0) {
        lastCheckArr.map(item => {
          this.deleteWaferIds.push(item.id)
        })
      }
      const wafers = []
      checkArr.map(item => {
        wafers.push(item.id)
      })
      const reason = []
      if (this.wgRadio === 1) {
        reason.push('外观')
      }
      if (this.bzRadio === 1) {
        reason.push('包装')
      }
      if (this.gcRadio === 1) {
        reason.push('光参')
      }
      const params = {
        box: this.selectedBox,
        checkCount: checkArr.length,
        outgoingId: this.selectedRunRow.id,
        reason: reason.join(','),
        status: reason.length > 0 ? 3 : 2,
        wafers
      }
      insertCheckResult(params).then(res => {
        if (index === 4 || index === '' || index === 3) {
          const params = {
            remark: this.viewForm.remark,
            id: this.selectedRunRow.id,
            status: index,
            auditor: sessionStorage.getItem('User-Id')
          }
          if (index === '') {
            this.$confirm('是否确认审核完成?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              audit(params).then(res => {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                this.examineDialogVisible = false
                this.fetchData()
              })
            })
          } else {
            audit(params).then(res => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.examineDialogVisible = false
              this.fetchData()
            })
          }
        }
      })
    },
    cancelSubmit() {
      // this.deleteBoxAddWafers()
      this.fetchData()
      this.examineDialogVisible = false
    },
    deleteBoxAddWafers() {
      console.log(this.deleteBoxs)
      const params = {
        id: this.selectedRunRow.id,
        boxs: Array.from(new Set(this.deleteBoxs)).join(','),
        waferIds: Array.from(new Set(this.deleteWaferIds)).join(',')
      }
      deleteCheckResult(params).then(res => {})
      // if (Array.from(new Set(this.deleteWaferIds)).length > 0) {}
    },
    boxChange(box, index) {
      this.boxNoOptions.map(item => {
        if (item.box === this.boxNo) {
          this.getParams(item.pack)
        }
      })
      this.selectedBox = box
      this.findRecord()
      const params = {
        id: this.selectedRunRow.id,
        pack: box,
        sliceType: this.sliceType
      }
      findFbDetailList(params).then(res => {
        if (index !== 1) {
          res.data.map(item => {
            if (item.ckStatus === 2 || item.ckStatus === 3) {
              item.active = true
            }
          })
        } else {
          // if (this.auditStaus === '审核中') {  }
          res.data.map(item => {
            if (item.ckStatus === 2 || item.ckStatus === 3) {
              item.active = true
            }
          })
        }
        this.tableKey = Math.random()
        this.tableKey2 = Math.random()
        this.boxWaferList = res.data
        // this.setAlreadyNum()
      })
    },
    findRecord() {
      const params = {
        id: this.selectedRunRow.id,
        box: this.selectedBox,
        pageNum: 1,
        pageSize: 1000
      }
      findCheckResultList(params).then(res => {
        if (res.data.list.length > 0) {
          const reason = res.data.list[0].reason.split(',')
          this.wgRadio = reason.includes('外观') ? 1 : 0
          this.bzRadio = reason.includes('包装') ? 1 : 0
          this.gcRadio = reason.includes('光参') ? 1 : 0
        } else {
          this.wgRadio = 0
          this.bzRadio = 0
          this.gcRadio = 0
        }
      })
    },
    // 包号查询
    findFbDetailGroupFun(index) {
      const params = {
        id: this.selectedRunRow.id,
        sliceType: this.selectedRunRow.pattern
      }
      findFbSelect(params).then(res => {
        this.boxNoOptions = res.data
        this.boxNo = res.data[0].box
        this.boxChange(res.data[0].box, index)
      })
    },
    getParams(pack) {
      const params = {
        pack,
        outgoingId: this.selectedRunRow.id
      }
      findGroupSubPackParams(params).then(res => {
        this.paramList = res.data
        if (this.paramList.length !== 0) {
          this.outParamList = this.paramList.slice(0, 3)
        }
      })
    },
    // 检验记录
    viewDetail(row) {
      const params = {
        id: row.id,
        pageNum: this.pageDialogNum,
        pageSize: this.pageDialogSize
      }
      findCheckResultList(params).then(res => {
        this.totalDialogPage = res.data.total
        this.recordList = res.data.list
      })
      this.viewDetailDialogVisible = true
    },
    // 每页数量改变
    recordSizeChange(pageSize) {
      this.pageDialogSize = pageSize
      this.viewDetail(this.selectedRunRow)
    },
    // 当前页数改变
    recordCurrentChange(pageNum) {
      this.pageDialogNum = pageNum
      this.viewDetail(this.selectedRunRow)
    },
    // Run信息/Wafer信息切换
    navClick(index) {
      if (index === 1 && this.list.length !== 0) {
        this.findWafer()
      }
      this.isActive = index
    },
    findWafer() {
      const params = {
        id: this.selectedRunRow.id,
        sliceType: this.selectedRunRow.pattern,
        pageNum: 1,
        pageSize: 1000000
      }
      findDetailList(params).then(res => {
        this.waferList = res.data.list
      })
    },
    setDisable() {
      if (this.boxWaferList.length === 0) {
        return true
      } else {
        if (this.wgRadio === 1 || this.bzRadio === 1 || this.gcRadio === 1) {
          return false
        } else {
          if (this.selectedRunRow.applyCount > this.checkCount) {
            return true
          }
        }
      }
    },
    // 开始审核
    handleExamine(row, index) {
      this.deleteBoxs = []
      this.deleteWaferIds = []
      if (index !== 1) {
        this.isView = true
      } else {
        this.isView = false
      }
      this.isSubmit = false
      this.checkCount = row.checkCount
      this.firstCheckCount = row.checkCount
      this.selectedRunRow = row
      if (row.status === '待审核') {
        this.wgRadio = 0
        this.bzRadio = 0
        this.gcRadio = 0
      }
      this.auditStaus = row.status
      this.outResultData = row.auditResult
      this.viewForm.khmc = row.customer
      this.viewForm.ddh = row.orderNo
      this.viewForm.ckdh = row.outNo
      this.viewForm.cpxh = row.modelName
      this.viewForm.px = row.pattern === 0 ? '圆片' : '方片'
      this.viewForm.bs = row.box
      this.viewForm.ckslp = row.count
      this.viewForm.ckslk = row.outCount
      this.viewForm.ckr = row.creator
      this.viewForm.cksj = row.createTime
      this.viewForm.shr = row.auditor
      this.viewForm.shsj = row.auditTime
      this.viewForm.remark = row.remark
      this.examineDialogVisible = true
      this.findFbDetailGroupFun(index)
    },
    // 获取预留字段
    findReservedFieldList() {
      findFieldSelectList().then(res => {
        this.reservedFields = res.data
      })
    },
    // 导出
    handleExport() {
      if (this.isActive === 0) {
        const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
        const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
        window.open(process.env.BASE_API + `/xpOutgoing/exportAuditList?startTime=${startTime}&endTime=${endTime}&timeType=${this.timeRadio}&status=${this.searchKeys.status}&produceModel=${this.searchKeys.cpxh}&pattern=${this.searchKeys.px}&customerId=${this.searchKeys.khmc}&orderNo=${this.searchKeys.ddbh}&outNo=${this.searchKeys.ckdh}&ruleId=${this.searchKeys.kzh}`)
      }
      let columnEn = ''
      let columnCn = ''
      if (this.selectedRunRow.pattern === 0) {
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
      window.open(process.env.BASE_API + `/xpOutgoing/findExportList?id=${this.selectedRunRow.id}&sliceType=${this.selectedRunRow.pattern}&headerCn=${columnCn}&headerEn=${columnEn}`)
    },
    watchCustorm(ruleName) {
      const requestParams = {
        name: ruleName,
        pageSize: 1,
        pageNum: 1
      }
      findOptions(requestParams).then(res => {
        this.custormForm = res.data.list[0]
        this.kzhDialogVisible = true
      })
    },
    // 获取客户信息
    findCustomer() {
      findCustomer().then((res) => {
        this.customerList = res.data
      })
    },
    // 客制化规则
    getCustormization() {
      const requestParams = {
        pageSize: 10000,
        pageNum: 1
      }
      findOptions(requestParams).then(res => {
        this.custormizationList = res.data.list
      })
    },
    // 获取产品代码
    findProductCodeFun() {
      findProductCode({}).then(res => {
        this.productCodeList = res.data
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
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
      this.searchKeys.ddbh = ''
      this.searchKeys.ckdh = ''
      this.searchKeys.kzh = ''
      this.searchKeys.khmc = ''
      this.searchKeys.px = ''
      this.searchKeys.cpxh = ''
      this.searchKeys.status = ''
      this.searchKeys.sczt = ''
      this.searchKeys.waferNo = ''
      this.searchKeys.dqgx = null
      this.searchKeys.sffg = ''
      this.searchKeys.dqclr = ''
      this.beginDate = ''
      this.finishBeginDate = ''
      this.finishEndDate = ''
      this.endDate = ''
      this.handleSearch()
    },
    productionDataClose() {
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
        orderNo: this.searchKeys.ddbh,
        outNo: this.searchKeys.ckdh,
        ruleId: this.searchKeys.kzh,
        customerId: this.searchKeys.khmc,
        pattern: this.searchKeys.px,
        produceModel: this.searchKeys.cpxh,
        status: this.searchKeys.status,
        timeType: this.timeRadio,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      findAuditList(params).then(res => {
        this.listLoading = false
        this.list = res.data.list
        if (res.data.list.length !== 0) {
          this.waferTol = res.data.list[0].count
          this.$refs.billTable.setCurrentRow(this.list[0])
          this.selectedRunRow = this.list[0]
          this.sliceType = this.list[0].pattern
        } else {
          this.waferTol = 0
        }
        this.totalPage = parseInt(res.data.total)
      })
    },
    rowClick(row) {
      this.selectedRunRow = row
      this.waferTol = row.count
      this.sliceType = row.pattern
    },
    // 关闭
    handleClose(formName) {
      if (!this.isSubmit && !this.isView) {
        console.log(123123)
        this.deleteBoxAddWafers()
      }
      setTimeout(() => {
        this.fetchData()
      }, 100)
      this.waferNo = ''
    }
  }
}

