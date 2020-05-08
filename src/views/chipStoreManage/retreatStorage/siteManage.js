
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findArkList } from '@/api/chipStoreManage/stockControl'
import { findOutWafer, findCode, findBackhouseType, findRecordList, findRecordWafer, insert, printBoxNo, printSequence } from '@/api/chipStoreManage/retreatStorage'
import { findFieldSelectList } from '@/api/chipStoreManage/chipPutInStorage'
import { getToken } from '@/utils/auth'
const formTheadStore = [
  { thName: 'WaferID', thKey: 'code', width: 200 },
  { thName: 'TapeNo', thKey: 'tapeNo', width: 180 },
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
const formTheadfStore = [
  { thName: 'ChipNo', thKey: 'code', width: 200 },
  { thName: 'TapeNo', thKey: 'tapeNo', width: 180 },
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
const formTheadRecprdStore = [
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
  { thName: '状态', thKey: 'status', width: 100 },
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
const formTheadfRecprdStore = [
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
  { thName: '入库时间', thKey: 'createTime', width: 100 },
  { thName: '初次入库日期', thKey: 'initTime', width: 130 },
  { thName: '状态', thKey: 'status', width: 100 },
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
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      fileYpUrl: process.env.BASE_API + '/xpBackhouse/ypImportExcel',
      fileFpUrl: process.env.BASE_API + '/xpBackhouse/fpImportExcel',
      loading: false,
      listLoading: false,
      isImport: false,
      receiptsDisabled: true,
      sendDialogVisible: false,
      recordDialogVisible: false,
      importDialogVisible: false,
      cabinetDetailShow: false,
      isPrint: true,
      isPrintSequence: true,
      formTheadStore: formTheadStore,
      formTheadStoreParams: formTheadStoreParams,
      formTheadRecprdStore: formTheadRecprdStore,
      formTheadfRecprdStore: formTheadfRecprdStore,
      formTheadfStore: formTheadfStore,
      formTheadfStoreParams: formTheadfStoreParams,
      waferTol: 0,
      timeRadio: 0,
      sliceCount: 0,
      sliceNum: 100,
      tableKey: 0,
      tableKey2: 0,
      receipts: '',
      remark: '',
      maker: '',
      listNum: '',
      listNo: '',
      WaferID: '',
      waferTotal: 0,
      selectedRunRow: {},
      selectedRow: {},
      model: '',
      backStorageNo: '',
      outStorageNo: '',
      putInStorageType: '',
      itemType: '',
      putInTime: '',
      putInRemark: '',
      pole: '',
      isActive: 0,
      list: [],
      recordWaferList: [],
      reservedFields: [],
      backhouseType: [],
      billList: [],
      waferList: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      retreatDate: '',
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
      receiptsOptions: [
        {
          id: 1,
          name: '方片'
        },
        {
          id: 0,
          name: '圆片'
        }
      ],
      importSliceType: 0,
      selectType: 0,
      backType: 1,
      putInTypeList: [],
      cabinetList: [],
      runSelectList: [],
      boxSelectList: [],
      recordList: [],
      cabinet: '',
      sliceType: 1,
      selectedCode: '',
      boxOrRun: [
        { id: 0, name: 'RUN ID' },
        { id: 1, name: 'BOX ID' }
      ],
      waferNo: '',
      options: [],
      currentId: ''
    }
  },
  mounted() {
    this.maker = getToken()
    this.findCodeFun() // 获取单号
    this.findBackhouseTypeFun() // 退库类型
    this.findCabinetListFun() // 柜位查询
    this.findReservedFieldList() // 获取预留字段
    this.putInTime = this.getFormatDate()
  },
  computed: {
    chipCount() {
      let total = 0
      this.list.map(item => { total += parseFloat(item.kCount) })
      return total.toFixed(3)
    }
  },
  methods: {
    handleImport() {
      this.importDialogVisible = true
    },
    // 获取预留字段
    findReservedFieldList() {
      findFieldSelectList().then(res => {
        res.data.map(item => {
          item['fields'] = []
        })
        this.reservedFields = res.data
      })
    },
    cabinetClick() {
      this.findCabinetListFun()
      this.cabinetDetailShow = !this.cabinetDetailShow
    },
    navClick(index) {
      if (index === 1 && this.recordList.length !== 0) {
        this.findWaferFun()
      }
      this.isActive = index
    },
    findWaferFun() {
      const params = {
        sliceType: this.selectedRunRow.sliceType,
        id: this.selectedRunRow.id
      }
      findRecordWafer(params).then(res => {
        this.recordWaferList = res.data
      })
    },
    handleSearch() {
      const params = {
        sliceType: this.sliceType,
        code: this.outStorageNo
      }
      findOutWafer(params).then(res => {
        this.outStorageNo = ''
        this.list = res.data
        this.isImport = false
      })
    },
    handleSelectItem() {
      setTimeout(() => {
        this.waferNo = ''
      }, 500)
      if (this.waferNo === '') {
        return false
      }
      if (this.backType === 2) {
        this.pushToList()
      } else {
        if (this.list.length === 0) {
          this.$message({
            type: 'error',
            message: '请先扫描出库单号!'
          })
          return false
        }
        this.setSelectRow()
      }
    },
    pushToList() {
      console.log(this.list.filter(item => {
        return item.code === this.waferNo
      }).length)
      if (this.list.filter(item => { return item.code === this.waferNo }).length > 0) {
        this.$message({
          type: 'error',
          message: '当前片号已存在!'
        })
        return false
      }
      const params = {
        sliceType: this.sliceType,
        code: this.waferNo
      }
      findOutWafer(params).then(res => {
        if (res.data.length === 0) {
          this.$message({
            type: 'error',
            message: '未查询到当前Wafer信息，请检查后重试!'
          })
          return false
        }
        res.data[0]['atcive'] = true
        this.list.unshift(res.data[0])
      })
    },
    fullScan() {
      this.list.map(item => {
        item['atcive'] = true
      })
      this.tableKey = Math.random()
      this.tableKey2 = Math.random()
    },
    rowStyle({ row }) {
      if (row.atcive) {
        return 'background: #65ba7d'
      } else {
        return ''
      }
    },
    backTypeChange() {
      this.list = []
    },
    setSelectRow() {
      let hasWafer = false
      let alreadyRxist = false
      this.list.map(item => {
        if (item.code === this.waferNo) {
          if (item.atcive) {
            alreadyRxist = true
          }
          item.atcive = true
          hasWafer = true
        }
      })
      this.tableKey = Math.random()
      this.tableKey2 = Math.random()
      if (!hasWafer) {
        this.$message({
          type: 'error',
          message: '当前Wafer与单据信息不符，请检查后重试!'
        })
        return false
      }
      if (alreadyRxist) {
        this.$message({
          type: 'error',
          message: '当前Wafer已存在，请检查后重试!'
        })
        return false
      }
      this.isImport = false
    },
    // 柜位查询
    findCabinetListFun() {
      findArkList().then(res => {
        this.cabinetList = res.data
      })
    },
    // 退库类型
    findBackhouseTypeFun() {
      findBackhouseType({}).then(res => {
        this.backhouseType = res.data
      })
    },
    // 获取单号
    findCodeFun() {
      findCode({}).then(res => {
        this.backStorageNo = res.data
      })
    },
    handleCloseDialog() {
      this.pageNum = 1
      this.pageSize = 15
      this.listNo = ''
      this.WaferID = ''
      this.receipts = ''
      this.beginDate = ''
      this.endDate = ''
      this.waferTol = 0
    },
    getFormatDate() {
      var date = new Date()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentDate = date.getFullYear() + '-' + month + '-' + strDate
      return currentDate
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 单击Run信息
    rowClick(row) {
      this.waferTol = row.wafer
      this.selectedRunRow = row
    },
    recordRowClick(row) {
      this.selectedRunRow = row
      this.waferTol = row.count
      this.sliceType = row.sliceType
    },
    // 选择按钮
    handleSelectRow(row) {
      this.waferTotal = row.wafer
      this.selectedRow = row
      this.sendDialogVisible = false
      this.selectType = 0
    },
    rowDblclick(row, column, cell, event) {
      this.selectedRow = row
      this.sendDialogVisible = false
    },
    handleDialogSearch(index) {
      this.pageNum = 1
      if (index === 1) {
        this.handleSelect()
      } else {
        this.viewRecord()
      }
    },
    clearDialogSearch() {
      this.listNo = ''
      this.WaferID = ''
      this.beginDate = ''
      this.endDate = ''
      this.receipts = ''
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
      window.open(process.env.BASE_API + `/xpBackhouse/findExportDetail?id=${this.selectedRunRow.id}&sliceType=${this.selectedRunRow.sliceType}&headerCn=${columnCn}&headerEn=${columnEn}`)
    },
    // 送片单导出
    handleExportDialog() {
      window.open(process.env.BASE_API + `/ckStorehouse/exportWyWaferExcel?id=${this.selectedRunRow.id}&waferId=${this.WaferID}`)
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.handleSelect()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.handleSelect()
    },
    clearSearch() {
      this.batchNum = ''
      this.process = ''
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.pole = ''
    },
    // 记录wafer
    // findStoreHouseDetailFun(id) {
    //   const params = {
    //     id,
    //     waferId: this.WaferID,
    //     pageNum: 1,
    //     pageSize: 10000
    //   }
    //   findStoreHouseDetail(params).then(res => {
    //     this.waferList = res.data.list
    //   })
    // },
    // 导入
    beforeUpload(file) {
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 10MB!',
          type: 'error'
        })
        this.loading = false
      }
      return isLt2M
    },
    onSuccess(res, file, fileList) {
      console.log(res)
      this.loading = false
      if (res.code !== 0) {
        this.$message({
          type: 'error',
          message: res.message
        })
      } else {
        this.$message({
          type: 'success',
          message: '数据导入成功'
        })
        this.isImport = true
        this.backType = 1
        this.importDialogVisible = false
        const hasWafer = this.list.filter(item => { return item.waferId === res.data[0].waferId })
        if (hasWafer.length === 0) {
          this.sliceType = this.importSliceType
          this.list = res.data
        }
      }
    },
    onError() {
      this.$message({
        type: 'error',
        message: '数据导入失败，请重试！'
      })
      this.loading = false
    },
    // 每页数量改变
    recordSizeChange(pageSize) {
      this.pageSize = pageSize
      this.viewRecord()
    },
    // 当前页数改变
    recordCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.viewRecord()
    },
    // 记录
    viewRecord() {
      // this.isActive = 0
      const params = {
        billNo: this.listNo,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findRecordList(params).then(res => {
        this.recordDialogVisible = true
        this.recordList = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.waferTol = this.recordList[0].count
        this.selectedRunRow = this.recordList[0]
        this.sliceType = this.recordList[0].sliceType
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.recordList[0])
        }, 200)
      })
    },
    // 完成退库
    handleRetreat() {
      if (this.cabinet === '') {
        this.$message({
          type: 'error',
          message: '请选择入库柜位!'
        })
        return false
      }
      const params = {
        billNo: this.backStorageNo, // 单号
        sliceType: this.sliceType, // 退款类型 0圆片 1方片
        backType: this.backType, // 退库方式
        creator: sessionStorage.getItem('User-Id'), // 制单人
        createTime: this.putInTime, // 制单日期
        remark: this.remark, // 备注
        arkId: this.cabinet, // 柜位
        boxNum: this.sliceNum, // 每包片数
        newType: this.isImport ? 1 : 0, // 0新增，1导入
        wafers: this.list
      }
      this.addSubmit(params)
    },
    addSubmit(params) {
      insert(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.putInTime = this.getFormatDate()
        this.list = []
        this.sliceNum = 100
        this.cabinet = ''
        this.backType = 1
        this.sliceType = 1
        this.remark = ''
        this.findCodeFun()
        if (this.isPrint) {
          printBoxNo({ id: res.data.id, module: 'xpBackhouseBox' }).then(res => {})
        }
        if (this.isPrintSequence) {
          printSequence({ id: res.data.id, module: 'xpBackhouseSeq' }).then(res => {})
        }
        this.backStorageNo = ''
        this.outStorageNo = ''
        setTimeout(() => {
          this.isPrint = true
          this.isPrintSequence = true
        }, 500)
      })
    },
    printBoxFun() {
      printBoxNo({ id: this.selectedRunRow.id, module: 'xpBackhouseBox' }).then(res => {
        this.$message({
          type: 'success',
          message: '标签正在打印中，请稍候！'
        })
      })
    },
    printSeqFun() {
      printSequence({ id: this.selectedRunRow.id, module: 'xpBackhouseSeq' }).then(res => {
        this.$message({
          type: 'success',
          message: '标签正在打印中，请稍候！'
        })
      })
    },
    // 关闭
    handleClose() {
      this.jBatchNum = ''
      this.cBatchNum = ''
      this.sBatchNum = ''
      this.jProcess = ''
      this.cProcess = ''
      this.sProcess = ''
      this.jRemark = ''
      this.sRemark = ''
      this.cRemark = ''
    }
  }
}

