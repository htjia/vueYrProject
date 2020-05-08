
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
// import { siteList } from '@/api/processManagement/siteManage'
import { findWyWareHous, findPutInTypeList, findPutInCode,
  findRunList, findBoxList, insert, findRecordList, findStoreHouseDetail, printLabel
} from '@/api/chipManage/extensionStorageManage/putInStorage'
import { findTaskModelList, findYgParamsList } from '@/api/chipBasicInfoManage/labelManage'
import { xpWarehousLabel, printLabelMapping } from '@/api/chipManage/warehousingSendManage/warehousingLabelManage'
import { findArkList } from '@/api/chipStoreManage/stockControl'
import { findOrderList, findCustomerList, findOutCode, findSubPackList, findAllWaferByRule, findWaferByRule, insertXsfb, findFbDetailGroup, findFbDetailList,
  findOutgoingId, deleteBox, deleteBoxWafer, updateNewBox, converWafer, printOutBill, finishXsfb, remove } from '@/api/chipStoreManage/chipOutStorage'
import { findFieldSelectList } from '@/api/chipStoreManage/chipPutInStorage'
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
const boxWaferTheadStore = [
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
const boxWaferfTheadStore = [
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
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  computed: {
    sliceTotal() {
      let total = 0
      this.packageList.map(item => { total += parseInt(item.count) })
      return total
    },
    kTotal() {
      let total = 0
      this.packageList.map(item => { total += parseFloat(item.outCount) })
      return total.toFixed(3)
    },
    binCount() {
      try {
        let num = 0
        this.selectedRow.map(item => {
          num += parseFloat(item.kCount)
        })
        return num.toFixed(3)
      // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  },
  data() {
    return {
      fileYpUrl: process.env.BASE_API + '/xpOutgoing/ypImportExcel',
      fileFpUrl: process.env.BASE_API + '/xpOutgoing/fpImportExcel',
      loading: false,
      isAll: false,
      isPrint: true,
      isDisabled: false,
      printDivShow: false,
      listLoading: false,
      receiptsDisabled: true,
      waferDialogVisible: false,
      recordDialogVisible: false,
      boxWaferDialogVisible: false,
      selectExchangeDialogVisible: false,
      printDialogVisible: false,
      formTheadStore: formTheadStore,
      formTheadStoreParams: formTheadStoreParams,
      formTheadfStore: formTheadfStore,
      formTheadfStoreParams: formTheadfStoreParams,
      boxWaferfTheadStore: boxWaferfTheadStore,
      boxWaferTheadStore: boxWaferTheadStore,
      isPrintOrder: false,
      waferTol: 0,
      sliceTypeName: '',
      receipts: '',
      selectedBoxWafer: null,
      outStorageId: '',
      remark: '',
      maker: '',
      searchNum: '',
      sequence: '',
      boxNo: '',
      boxNoh: '',
      arkId: '',
      arkIdh: '',
      sequenceh: '',
      searchNumh: '',
      beginDateh: '',
      endDateh: '',
      listNum: '',
      listNo: '',
      WaferID: '',
      waferTotal: 0,
      arkList: [],
      boxWaferSelectedArr: [],
      dialogList: [],
      boxWaferList: [],
      packageList: [],
      reservedFields: [],
      selectedRunRow: {},
      selectedRow: [],
      selectedPackRow: '',
      selectedBox: '',
      model: '',
      putInStorageNo: '',
      putInStorageType: '',
      itemType: '',
      putInTime: '',
      putInRemark: '',
      pole: '',
      isActive: 0,
      list: [],
      copyList: [],
      billList: [],
      waferList: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      selectOptions: [],
      productsList: [],
      isshouyg: false,
      siteForm: {
        selects: '',
        products: '',
        ygid: ''
      },
      rules: {
        selects: [{ required: true, message: '请选择打印标签', trigger: 'change' }],
        products: [{ required: true, message: '请选择产品型号', trigger: 'change' }],
        ygid: [{ required: true, message: '请选择品名', trigger: 'change' }]
      },
      yglist: [],
      furnaceList: [
        {
          thName: 'ChipNo',
          thKey: 'chipNO',
          width: 100
        },
        {
          thName: 'TapeNo',
          thKey: 'tapeNo',
          width: 150
        },
        {
          thName: '产品型号',
          thKey: 'taskModel',
          width: 120
        },
        { thName: '初次入库日期', thKey: 'taskModel', width: 140 },
        { thName: '入库日期', thKey: 'taskModel', width: 120 },
        { thName: '标签', thKey: 'taskModel', width: 120 },
        { thName: '状态', thKey: 'taskModel', width: 120 },
        { thName: '客户', thKey: 'taskModel', width: 120 },
        { thName: '柜位', thKey: 'taskModel', width: 120 },
        { thName: '研磨厚度', thKey: 'taskModel', width: 120 },
        {
          thName: '数量',
          thKey: 'binCount',
          width: 80
        },
        { thName: '测试电流', thKey: 'taskModel', width: 120 },
        {
          thName: '是否清洗',
          thKey: 'isClean',
          width: 100
        },
        {
          thName: 'ESD测试电流',
          thKey: 'esdElec',
          width: 120
        },
        {
          thName: '外观品质',
          thKey: 'classify',
          width: 100
        },
        {
          thName: '工艺',
          thKey: 'craft',
          width: 80
        },
        {
          thName: '入库类型',
          thKey: 'color',
          width: 80
        },
        {
          thName: '芯片产地',
          thKey: 'model',
          width: 80
        },
        {
          thName: '波长代码',
          thKey: 'size',
          width: 100
        },
        {
          thName: '亮度代码',
          thKey: 'quality',
          width: 100
        },
        {
          thName: '集中度代码',
          thKey: 'quality',
          width: 100
        },
        {
          thName: 'WLD_MIN',
          thKey: 'wldMin',
          width: 120
        },
        {
          thName: 'WLD_AVG',
          thKey: 'wldAvg',
          width: 120
        },
        {
          thName: 'WLD_MAX',
          thKey: 'wldMax',
          width: 120
        },
        {
          thName: 'WLD_STD',
          thKey: 'wldStd',
          width: 120
        },
        {
          thName: 'WLP_MIN',
          thKey: 'wlpMin',
          width: 100
        },
        {
          thName: 'WLP_AVG',
          thKey: 'wlpAvg',
          width: 100
        },
        {
          thName: 'WLP_MAX',
          thKey: 'wlpMax',
          width: 100
        },
        {
          thName: 'WLP_STD',
          thKey: 'wlpStd',
          width: 100
        },
        {
          thName: 'WLC_MIN',
          thKey: 'wlcMin',
          width: 100
        },
        {
          thName: 'WLC_AVG',
          thKey: 'wlcAvg',
          width: 100
        },
        {
          thName: 'WLC_MAX',
          thKey: 'wlcMax',
          width: 100
        },
        {
          thName: 'WLC_STD',
          thKey: 'wlcStd',
          width: 100
        },
        {
          thName: 'VF1_MIN',
          thKey: 'vf1Min',
          width: 100
        },
        {
          thName: 'VF1_AVG',
          thKey: 'vf1Avg',
          width: 100
        },
        {
          thName: 'VF1_MAX',
          thKey: 'vf1Max',
          width: 100
        },
        {
          thName: 'VF1_STD',
          thKey: 'vf1Std',
          width: 100
        },
        {
          thName: 'IR_MIN',
          thKey: 'irMin',
          width: 100
        },
        {
          thName: 'IR_AVG',
          thKey: 'irAvg',
          width: 100
        },
        {
          thName: 'IR_MAX',
          thKey: 'irMax',
          width: 100
        },
        {
          thName: 'IR_STD',
          thKey: 'irStd',
          width: 100
        },
        {
          thName: 'VZ1_MIN',
          thKey: 'vzMin',
          width: 100
        },
        {
          thName: 'VZ1_AVG',
          thKey: 'vzAvg',
          width: 100
        },
        {
          thName: 'VZ1_MAX',
          thKey: 'vzMax',
          width: 100
        },
        {
          thName: 'VZ1_STD',
          thKey: 'vzStd',
          width: 100
        },
        {
          thName: 'LOP1_MIN',
          thKey: 'lopMin',
          width: 100
        },
        {
          thName: 'LOP1_AVG',
          thKey: 'lopAvg',
          width: 100
        },
        {
          thName: 'LOP1_MAX',
          thKey: 'lopMax',
          width: 100
        },
        {
          thName: 'LOP1_STD',
          thKey: 'lopStd',
          width: 100
        }
      ],
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
      pickerOptionsStarth: {
        disabledDate: (time) => {
          const endDateVal = this.endDateh
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEndh: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDateh
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      receiptsOptions: [
        {
          id: 0,
          name: '正常片'
        },
        {
          id: 1,
          name: '报废片'
        }
      ],
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
          name: '是'
        },
        {
          id: 1,
          name: '否'
        }
      ],
      selectType: 0,
      putInTypeList: [],
      cabinetList: [],
      runSelectList: [],
      boxSelectList: [],
      recordList: [],
      cabinet: '',
      selectedCode: '',
      boxOrRun: [
        { id: 0, name: 'RUN ID' },
        { id: 1, name: 'BOX ID' }
      ],
      customerTypeList: [],
      orderOptions: [
        { id: 0, name: '出库' },
        { id: 1, name: '备货' },
        { id: 2, name: '返回产线' }
      ],
      orderNo: '',
      orderType: '',
      outNo: '',
      customer: '',
      modelName: '',
      ruleName: '',
      deliveryDate: '',
      orderNum: '',
      outNum: '',
      ckNum: '',
      numRule: '',
      pattern: '',
      boxNum: 40,
      outCode: '',
      startTime: '',
      endTime: '',
      paramsList: [],
      tableHead: [],
      allWaferList: [],
      boxSelectedArr: [],
      customerId: 0,
      dialogPrintList: [{
      }],
      currentId: '',
      hourRow: null,
      firstIndexSelect: -1
    }
  },
  created() {
    this.findCustomerListFun()
  },
  mounted() {
    this.isDisabled = parseInt(this.$route.query.view) === 1
    this.outStorageId = this.$route.query.outStorageId
    this.boxNum = this.$route.query.boxNum === undefined ? 40 : this.$route.query.boxNum
    this.fetchData()
    this.findOutCodeFun()
    this.findCabinetListFun()
    this.findSubPackListFun()
    this.findReservedFieldList()
    if (this.$route.query.outStorageId === undefined) {
      this.findOutgoingIdFun()
    } else {
      this.findFbDetailGroupFun(this.outStorageId)
    }
  },
  methods: {
    selectAll(selection) {
      if (selection.length === 0) {
        if (this.isAll) {
          this.handleViewWaferDetail()
        }
        this.viewWaferByRuleFun(this.selectedPackRow)
      }
    },
    hoverCall(row, column, cell, event) {
      console.log(row)
      if (event.buttons !== 1) {
        this.hourRow = row
      } else {
        if (event.which === 1) {
          if (this.hourRow !== null && this.hourRow !== row) {
            for (let i = 0; i < this.allWaferList.length; i++) {
              if (this.allWaferList[i] === this.hourRow) {
                this.firstIndexSelect = i
                break
              }
            }
            this.$refs.waferTable.toggleRowSelection([{ row: this.hourRow, selected: true }])
            this.hourRow = null
          }
          let x = this.firstIndexSelect
          for (let i = 0; i < this.allWaferList.length; i++) {
            if (this.selectedRow[0].id === this.allWaferList[i].id && x <= i) {
              x = i
            }
            if (x < i && x !== -1) {
              this.$refs.waferTable.toggleRowSelection([{ row: this.allWaferList[i], selected: true }])
            }
            if (row.id === this.allWaferList[i].id) {
              break
            }
          }
          this.$refs.waferTable.toggleRowSelection([{ row: row, selected: true }])
          // if (!row.selected) {
          //   this.$refs.waferTable.toggleRowSelection([{ row: row, selected: true }])
          //   row.selected = true
          //   return false
          // } else {
          //   this.$refs.waferTable.toggleRowSelection([{ row: row, selected: false }])
          //   row.selected = false
          // }
        }
      }
    },
    // 完成挑片 请确认已经完成了所有的挑片分包动作！
    finishSelect() {
      console.log(parseFloat(this.kTotal) > parseFloat(this.outNum))
      if (this.numRule === '不超请领单' && parseFloat(this.kTotal) > parseFloat(this.outNum)) {
        this.$message({
          type: 'error',
          message: '已选颗粒数不能大于出货数量'
        })
        return false
      }
      this.$confirm('请确认已经完成了所有的挑片分包动作！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: this.outStorageId,
          orderId: this.$route.query.id,
          orderType: this.orderType
        }
        finishXsfb(params).then(res => {
          this.$router.push({ path: '/chipStoreManage/chipOutStorage' })
        })
      })
    },
    handlePrintOutOrder() {
      const packsArr = []
      this.boxSelectedArr.map(item => {
        packsArr.push(item.box)
      })
      const params = {
        id: this.outStorageId,
        sliceType: this.$route.query.sliceType,
        packs: packsArr.join(',')
      }
      printOutBill(params).then(res => {
        // const arr = []
        // for (const key in res.data) {
        //   console.log(key)
        //   arr.push({
        //     title: key,
        //     dataList: res.data[key].list,
        //     total: `（ 包号: ${res.data[key].total.box}    合计颗粒数: ${res.data[key].total.sliceCount}     合计片数: ${res.data[key].total.count}）`
        //   })
        // }
        // console.log(arr)
        this.dialogPrintList = res.data
        this.printDivShow = true
        setTimeout(() => {
          this.$print(this.$refs.print)
          this.printDivShow = false
        })
      })
    },
    // 微调换片
    handleExchange() {
      if (this.selectedBoxWafer === null) {
        this.$message({
          type: 'error',
          message: '请选择需要换片的行!'
        })
      }
      const params = {
        orderId: this.$route.query.id,
        outgoingId: this.outStorageId,
        arkId: this.arkIdh,
        boxNo: this.boxNoh,
        count: this.searchNumh,
        sequence: this.sequenceh,
        sliceType: this.$route.query.sliceType,
        startTime: this.beginDateh === '' ? '' : this.formatDate(this.beginDateh),
        endTime: this.endDateh === '' ? '' : this.formatDate(this.endDateh),
        ruleWhere: this.selectedBox.rule,
        pack: this.selectedBox.sub
      }
      findWaferByRule(params).then(res => {
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
        this.allWaferList = res.data
        this.selectExchangeDialogVisible = true
      })
    },
    // 确认换片
    selectWafer(row) {
      const params = {
        id: this.selectedBoxWafer.id,
        waferId: row.id
      }
      converWafer(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.selectExchangeDialogVisible = false
        this.viewBoxWafer(this.selectedBox)
      })
    },
    handleExportWafer() {
      let columnEn = ''
      let columnCn = ''
      if (this.pattern === 0) {
        for (const item of this.boxWaferTheadStore) {
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
        this.formTheadStoreParams.map(item => {
          columnCn = columnCn + ',' + item.thName
          columnEn = columnEn + ',' + item.thKey
        })
      } else {
        for (const item of this.boxWaferfTheadStore) {
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
        this.formTheadfStoreParams.map(item => {
          columnCn = columnCn + ',' + item.thName
          columnEn = columnEn + ',' + item.thKey
        })
      }
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/xpOutgoing/findExportList?startTime=${startTime}&endTime=${endTime}&pack=${this.selectedBox.box}&id=${this.outStorageId}&sliceType=${this.pattern}&boxNo=${this.boxNo}&sequence=${this.sequence}&arkId=${this.arkId}&count=${this.searchNum}&headerCn=${columnCn}&headerEn=${columnEn}`)
    },
    boxWaferSelectionChange(data) {
      this.boxWaferSelectedArr = data
      console.log(this.boxWaferSelectedArr)
    },
    // 分为新包
    handleUpdateNewBox() {
      const boxWaferSelectedArr = this.$refs.boxWaferTable.selection
      const idsArr = []
      boxWaferSelectedArr.map(item => {
        idsArr.push(item.id)
      })
      updateNewBox({ ids: idsArr.join(',') }).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.findFbDetailGroupFun(this.outStorageId)
        this.viewBoxWafer(this.selectedBox)
      })
    },
    handleDelete(id) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBoxWafer({ id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.viewBoxWafer(this.selectedBox)
          this.findFbDetailGroupFun(this.outStorageId)
        })
      })
    },
    findOutgoingIdFun() {
      findOutgoingId({ orderId: this.$route.query.id }).then(res => {
        this.outStorageId = res.data
        console.log(this.outStorageId, '-===============-------3434-=======')
        if (this.outStorageId !== null) {
          this.findFbDetailGroupFun(this.outStorageId)
        }
      })
    },
    // 查看已分包wafer
    viewBoxWafer(row) {
      this.selectedBox = row
      const params = {
        id: this.outStorageId,
        pack: row.box,
        boxNo: this.boxNo,
        sequence: this.sequence,
        arkId: this.arkId,
        count: this.searchNum,
        sliceType: this.$route.query.sliceType,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      findFbDetailList(params).then(res => {
        this.boxWaferList = res.data
        if (res.data.length !== 0) {
          this.selectedBoxWafer = this.boxWaferList[0]
          this.$refs.boxWaferTable.setCurrentRow(this.boxWaferList[0])
        } else {
          this.navClick(1)
        }
      })
      this.boxWaferDialogVisible = true
    },
    boxSelectionChange(data) {
      this.boxSelectedArr = data
    },
    // 开始分包
    handleStartSplit() {
      if (this.boxNum === '') {
        this.$message({
          type: 'error',
          message: '每包数量不能为空!'
        })
        return false
      }
      let flag = false
      this.list.map(item => {
        if (item.sliceNum !== 0) {
          flag = true
        }
      })
      if (!flag) {
        this.$message({
          type: 'error',
          message: '请先选择Wafer!'
        })
        return false
      }
      const details = []
      let kCount = 0
      this.list.map(item => {
        kCount += parseFloat(item.sliceCount)
        if (item.wafersId.length > 0) {
          item.wafersId.map(wafer => {
            details.push({
              detailId: wafer,
              sub: item.pack
            })
          })
        }
      })
      console.log(this.kTotal, '=================分包后的total==========')
      console.log(kCount, '=================分包前的total==========')
      if (this.numRule === '不超请领单' && (kCount + parseFloat(this.kTotal)) > parseFloat(this.outNum)) {
        this.$message({
          type: 'error',
          message: '已选颗粒数不能大于出货数量'
        })
        return false
      }
      const params = {
        id: this.outStorageId,
        pickNum: this.outNum, // 出库数量
        orderId: this.$route.query.id, // 订单id
        customer: this.customer, // 客户
        outType: this.orderType, // 0出库，1备库
        taskModel: this.modelName, // 产品型号
        creator: sessionStorage.getItem('User-Id'),
        sliceType: this.pattern,
        boxNum: this.boxNum, // 每包数量
        details
      }
      this.listLoading = true
      insertXsfb(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.outStorageId = res.data.id
        this.navClick(1)
        this.listLoading = false
        this.clearAllNum()
      })
    },
    // 分包明细
    findFbDetailGroupFun(id) {
      const params = {
        id,
        sliceType: this.$route.query.sliceType
      }
      findFbDetailGroup(params).then(res => {
        this.packageList = res.data
      })
    },
    deltetSelected() {
      this.$confirm('是否确认删除已选项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const boxs = []
        this.boxSelectedArr.map(item => {
          boxs.push(item.box)
        })
        const params = {
          id: this.outStorageId,
          boxs: boxs.join(',')
        }
        deleteBox(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.navClick(1)
        })
      })
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
    // 分档查询
    findSubPackListFun() {
      this.listLoading = true
      findSubPackList({ id: this.$route.query.id, sliceType: this.$route.query.sliceType, outgoingId: this.outStorageId }).then(res => {
        res.data.list.map(item => {
          item.sliceNum = 0
          item.sliceCount = 0
          item.wafersId = []
          const keys = Object.keys(item)
          for (const key of keys) {
            if (key !== 'rule') {
              if ((item[key] + '').indexOf('-') > -1 || (item[key] + '').indexOf('～') > -1) {
                item[key] = item[key].replace(/=/g, '')
              }
            }
          }
        })
        this.listLoading = false
        this.list = res.data.list
        this.tableHead = res.data.params
      })
    },
    // 出库单号查询
    findOutCodeFun() {
      findOutCode().then(res => {
        this.outCode = res.data
        if (this.$route.query.outOrder !== undefined) {
          this.outCode = this.$route.query.outOrder
        }
      })
    },
    // 客户
    findCustomerListFun() {
      findCustomerList({}).then(res => {
        this.customerTypeList = res.data
      })
    },
    fetchData() {
      const requestParams = {
        id: this.$route.query.id,
        pageSize: 1,
        pageNum: 1
      }
      findOrderList(requestParams).then(res => {
        this.orderNo = res.data.list[0].orderNo
        this.orderType = res.data.list[0].orderType
        this.outNo = res.data.list[0].outNo
        this.customer = res.data.list[0].customerName
        this.modelName = res.data.list[0].modelName
        this.ruleName = res.data.list[0].ruleName
        this.deliveryDate = res.data.list[0].deliveryDate
        this.orderNum = res.data.list[0].orderNum
        this.ckNum = res.data.list[0].ckNum
        this.outNum = this.$route.query.outNum === undefined ? res.data.list[0].outNum : this.$route.query.outNum
        this.remark = res.data.list[0].remark
        this.numRule = res.data.list[0].numRule
        this.pattern = res.data.list[0].pattern
        this.sliceTypeName = res.data.list[0].pattern === 0 ? '圆片' : '方片'
        this.startTime = res.data.list[0].startTime
        this.endTime = res.data.list[0].endTime
        this.paramsList = res.data.list[0].outList
        console.log(typeof this.pattern)
      })
    },
    // 柜位查询
    findCabinetListFun() {
      findArkList().then(res => {
        this.arkList = res.data
      })
    },
    handleViewWaferDetail() {
      this.isAll = true
      const subs = []
      this.list.map(item => {
        subs.push({
          pack: item.pack,
          rule: item.rule,
          count: item.count
        })
      })
      const params = {
        arkId: this.arkId,
        boxNo: this.boxNo,
        count: this.searchNum,
        sequence: this.sequence,
        sliceType: this.$route.query.sliceType,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        subs
      }
      findAllWaferByRule(params).then(res => {
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
        this.allWaferList = res.data
        this.waferDialogVisible = true
        this.setSelection()
      })
    },
    setSelection(index) {
      let selectedRowIds = []
      if (index === 1) { // 单行
        selectedRowIds = this.selectedPackRow.wafersId
      } else { // 全部
        this.list.map(item => {
          selectedRowIds = [...item.wafersId, ...selectedRowIds]
        })
      }
      setTimeout(() => {
        this.$refs.waferTable.clearSelection()
      }, 200)
      if (selectedRowIds.length > 0) {
        console.log(12313)
        setTimeout(() => {
          this.allWaferList.map(wafer => {
            selectedRowIds.map(id => {
              if (wafer.id === parseInt(id)) {
                this.$refs.waferTable.toggleRowSelection([{ row: wafer, selected: true }])
              }
            })
          })
        }, 500)
      }
    },
    handleReSplit() {
      this.$confirm('确定后，将会重置已分包wafer，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove({ id: this.outStorageId }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.packageList = []
            if (this.$route.query.outStorageId === undefined) {
              this.findOutgoingIdFun()
            }
            this.navClick(0)
          }
        })
      })
    },
    // 单行选wafer
    viewWaferByRuleFun(row) {
      setTimeout(() => {
        this.selectedRow = []
      }, 100)
      this.selectedPackRow = row
      this.currentPack = row.pack
      this.isAll = false
      console.log(row.rule)
      const params = {
        arkId: this.arkId,
        boxNo: this.boxNo,
        count: this.searchNum,
        sequence: this.sequence,
        sliceType: this.$route.query.sliceType,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        ruleWhere: row.rule,
        orderId: this.$route.query.id,
        outgoingId: this.outStorageId,
        pack: row.pack
      }
      findWaferByRule(params).then(res => {
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
        this.allWaferList = res.data
        this.waferDialogVisible = true
        this.setSelection(1)
      })
    },
    selectionChange(data) {
      // this.selectedNum = data.length
      this.selectedRow = data
      // console.log(this.selectedRow)
    },
    clearAllNum() {
      this.list.map(listItem => {
        listItem.sliceNum = 0
        listItem.sliceCount = 0
        listItem.wafersId = []
      })
    },
    // 锁定wafer
    handleLockingWafer() {
      // isAll-查看全部wafer锁定
      if (this.isAll) {
        this.clearAllNum()
      } else { // 逐片查看wafer锁定
        this.list.map(listItem => {
          if (listItem.pack === this.currentPack) {
            listItem.sliceNum = 0
            listItem.sliceCount = 0
            listItem.wafersId = []
          }
        })
      }
      const selectedIds = []
      let num = 0
      let pack = 0
      this.selectedRow.map(selectedItem => {
        selectedIds.push(selectedItem.id)
        this.list.map(listItem => {
          if (pack !== selectedItem.subpackage) {
            num = 0
            pack = selectedItem.subpackage
          }
          if (listItem.pack === selectedItem.subpackage) {
            listItem.sliceNum++
            num += selectedItem.kCount
            listItem.sliceCount = num.toFixed(3)
            listItem.wafersId.push(selectedItem.id)
          }
        })
      })
      this.waferDialogVisible = false
    },
    findPutInTypeListFun() {
      findPutInTypeList({}).then(res => {
        this.putInTypeList = res.data
      })
    },
    handleCloseDialog() {
      this.pageNum = 1
      this.pageSize = 15
      this.boxNo = ''
      this.sequence = ''
      this.arkId = ''
      this.beginDate = ''
      this.endDate = ''
      this.searchNum = ''
      this.boxNoh = ''
      this.sequenceh = ''
      this.arkIdh = ''
      this.beginDateh = ''
      this.endDateh = ''
      this.searchNumh = ''
    },
    // 清空列表
    clearList() {
      this.$confirm('是否清空已选Wafer列表?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list = []
        this.copyList = []
      })
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
    handleSelect() {
      const params = {
        code: this.listNo,
        waferId: this.WaferID,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        type: this.receipts,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findWyWareHous(params).then(res => {
        this.sendDialogVisible = true
        this.isActive = 0
        this.totalPage = parseInt(res.data.total)
        this.billList = res.data.list
        this.waferTol = this.billList[0].wafer
        this.selectedRunRow = this.billList[0]
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.billList[0])
        }, 200)
      })
    },
    // 单击Run信息
    rowClick(row) {
      this.waferTol = row.wafer
      this.selectedRunRow = row
    },
    recordRowClick(row) {
      this.selectedRunRow = row
      this.waferTol = row.count
    },
    // 获取单号
    findPutInCodeFun() {
      findPutInCode({}).then(res => {
        this.putInStorageNo = res.data
      })
    },
    setInputValue(row) {
      this.receiptsDisabled = true
      this.listNum = row.code
      this.maker = row.creator
      this.itemType = row.type
      findRunList({ id: row.id }).then(res => {
        this.runSelectList = res.data
        this.options = this.runSelectList
      })
      findBoxList({ id: row.id }).then(res => {
        this.boxSelectList = res.data
      })
    },
    boxOrRunChange(val) {
      if (this.list.length !== 0) {
        this.$confirm('是否确认切换？切换后列表数据将会清空！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (val === 0) {
            this.options = this.runSelectList
          } else {
            this.options = this.boxSelectList
          }
          this.selectedCode = ''
          this.list = []
          this.copyList = []
        }).catch(() => {
          this.selectType = val === 0 ? 1 : 0
        })
      }
      if (val === 0) {
        this.options = this.runSelectList
      } else {
        this.options = this.boxSelectList
      }
      this.selectedCode = ''
    },
    handleCloseSendDialog() {

    },
    handleDialogSearch(index) {
      this.pageNum = 1
      if (index === 1) {
        this.handleSelect()
      } else {
        this.viewRecord()
      }
    },
    clearDialogSearch(index) {
      this.boxNo = ''
      this.sequence = ''
      this.beginDate = ''
      this.endDate = ''
      this.arkId = ''
      this.searchNum = ''
      if (index === 1) {
        this.viewBoxWafer(this.selectedBox)
      } else if (index === 2) {
        if (this.isAll) {
          this.handleViewWaferDetail()
        } else {
          this.viewWaferByRuleFun(this.selectedPackRow)
        }
      }
    },
    clearExchangeSearch() {
      this.boxNo = ''
      this.sequence = ''
      this.beginDate = ''
      this.endDate = ''
      this.arkId = ''
      this.searchNum = ''
      this.handleExchange()
    },
    // 导出
    handleExport() {
      window.open(process.env.BASE_API + `/ckStorehouse/exportExcel?id=${this.selectedRunRow.id}&waferId=${this.WaferID}`)
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
    // 对象数组克隆
    deepClone(obj) {
      const newObj = Array.isArray(obj) ? [] : {}
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            newObj[key] = (obj && typeof obj[key] === 'object') ? this.deepClone(obj[key]) : obj[key]
          }
        }
      }
      return newObj
    },
    handleSearch() {
      console.log(123)
    },
    deltetItem(index) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.splice(index, 1)
      })
    },
    clearSearch() {
      this.batchNum = ''
      this.process = ''
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.pole = ''
    },
    // Run信息/Wafer信息切换
    navClick(index) {
      if (this.outStorageId === '' || this.outStorageId === null) {
        return false
      }
      if (index === 1) {
        this.findFbDetailGroupFun(this.outStorageId)
      } else {
        this.findSubPackListFun()
      }
      this.isActive = index
    },
    // 记录wafer
    findStoreHouseDetailFun(id) {
      const params = {
        id,
        waferId: this.WaferID,
        pageNum: 1,
        pageSize: 10000
      }
      findStoreHouseDetail(params).then(res => {
        this.waferList = res.data.list
      })
    },
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
        this.viewBoxWafer(this.selectedBox)
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
      this.isActive = 0
      const params = {
        billNo: this.listNo,
        waferId: this.WaferID,
        billType: this.receipts,
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
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.recordList[0])
        }, 200)
      })
    },
    // 添加
    handleAdd() {
      if (this.itemType === '') {
        this.$message({
          type: 'error',
          message: '请选择单据类型!'
        })
        return false
      }
      if (this.putInTime === '') {
        this.$message({
          type: 'error',
          message: '请选择入库时间!'
        })
        return false
      }
      if (this.putInStorageType === '') {
        this.$message({
          type: 'error',
          message: '请选择入库类型!'
        })
        return false
      }
      if (this.cabinet === '') {
        this.$message({
          type: 'error',
          message: '请选择入库柜位!'
        })
        return false
      }
      this.copyList.map(item => {
        item['arkId'] = this.cabinet
      })
      const params = {
        billNo: this.putInStorageNo,
        billType: this.itemType,
        createTime: this.putInTime,
        creator: sessionStorage.getItem('User-Id'),
        remark: this.putInRemark,
        sendNo: this.listNum,
        type: this.putInStorageType,
        wafers: this.copyList
      }
      if (this.list.length < this.waferTotal) {
        this.$confirm('当前送片单存在尚未入库的Wafer! 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.addSubmit(params)
        })
      } else {
        this.addSubmit(params)
      }
    },
    addSubmit(params) {
      insert(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.putInStorageNo = ''
        this.putInTime = this.getFormatDate()
        this.itemType = ''
        this.putInRemark = ''
        this.listNum = ''
        this.cabinet = ''
        this.selectedCode = ''
        this.putInStorageType = ''
        this.options = []
        this.list = []
        this.copyList = []
        this.findPutInCodeFun()
        if (this.isPrint) {
          printLabel({ id: res.data.id, module: 'ckStorehouse' }).then(res => {})
        }
        if (res.data.code && !res.data.repeatRuns) {
          this.$alert(`入库单号重复已修改为${res.data.code}`, '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }
        if (res.data.repeatRuns && !res.data.code) {
          this.$alert(res.data.repeatRuns, '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          })
        }
        if (res.data.repeatRuns && res.data.code) {
          this.$alert(res.data.repeatRuns + `;入库单号重复已修改为${res.data.code}！`, '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          })
        }
      })
    },
    printFun() {
      printLabel({ id: this.selectedRunRow.id, module: 'ckStorehouse' }).then(res => {
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
    },
    // 关闭
    handleCloses(formName) {
      this.$refs[formName].resetFields()
    },
    handlePrintlaber() {
      this.siteForm = {
        selects: '',
        products: '',
        ygid: ''
      }
      this.isshouyg = false
      this.xpWarehousLabel()
      this.printDialogVisible = true
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            creator: sessionStorage.getItem('User-Id'),
            labelId: this.siteForm.selects,
            type: 0,
            pnId: this.isshouyg ? this.siteForm.ygid : null,
            wafers: [],
            way: '1'
          }
          printLabelMapping(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.printDialogVisible = false
              this.$refs[formName].resetFields()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加
    startPrints() {
      if (this.siteForm.selects !== '') {
        for (const item of this.selectOptions) {
          if (this.siteForm.selects === item.id) {
            this.siteForm.products = ''
            this.siteForm.ygid = ''
            this.customerId = item.customer
            if (item.customerName === '亿光') {
              this.isshouyg = true
              this.ygfind()
            } else {
              this.isshouyg = false
            }
            break
          }
        }
      }
    },
    // 查询
    ygfind() {
      const params = {
        customerId: this.customerId
      }
      findTaskModelList(params).then(res => {
        this.productsList = res.data.data
      })
    },
    // 查询
    ygfinds() {
      this.siteForm.ygid = ''
      const params = {
        customerId: this.customerId,
        modelId: this.siteForm.products
      }
      findYgParamsList(params).then(res => {
        this.yglist = res.data.data
      })
    },
    xpWarehousLabel() {
      this.listLoading = true
      const params = {
        name: '',
        customer: ''
      }
      xpWarehousLabel(params).then(res => {
        this.selectOptions = res.data
        this.listLoading = false
      })
    },
    // 取消
    resetForm(formName) {
      this.printDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}

