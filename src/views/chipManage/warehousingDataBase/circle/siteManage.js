
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { productList } from '@/api/chipManage/abnormalManage/productionAbnormal'
import { findLists } from '@/api/chipBasicInfoManage/machineInfo'
import { findYp, insertYp, findYpCodeExits, updateYp, deleteYp, deleteYpRecord, logList, insertBatchYp } from '@/api/chipManage/warehousingDataBase/base'
import { queryLists } from '@/api/chipBasicInfoManage/codeManage/appearanceClassification'
import { findSubstrateMeasureList } from '@/api/chipManage/abnormalManage/reworkManage'
import { getExceptionCode } from '@/api/chipManage/rearSiteManage/visualInspectionInfo'
const furnaceList = [
  {
    thName: '序号',
    thKey: 'index',
    width: 50
  },
  {
    thName: 'WaferID',
    thKey: 'waferNo',
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
    thName: '导入时间',
    thKey: 'importTime',
    width: 150
  },
  {
    thName: '外延尺寸',
    thKey: 'measrue',
    width: 80
  },
  {
    thName: '外观等级',
    thKey: 'classify',
    width: 80
  },
  {
    thName: 'Wafer来源',
    thKey: 'source',
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
  },
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
const furnaceList1 = [
  {
    thName: '序号',
    thKey: 'index',
    width: 50
  },
  {
    thName: 'WaferID',
    thKey: 'waferNo',
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
    thName: '导入时间',
    thKey: 'importTime',
    width: 150
  },
  {
    thName: '外延尺寸',
    thKey: 'measrue',
    width: 80
  },
  {
    thName: '外观等级',
    thKey: 'classify',
    width: 80
  },
  {
    thName: 'Wafer来源',
    thKey: 'source',
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
  },
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
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const valuecheck = (rule, value, callback) => {
      if (value === null) {
        value = ''
      }
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('参数不能为空'))
      } else {
        const v = parseFloat(value)
        let length1 = 0
        if (value.indexOf('.') > -1) {
          length1 = (value + '').substring((value + '').indexOf('.') + 1).length
        }
        if (v + '' !== value) {
          callback(new Error('参数输入不正确'))
        } else if (v > 10000 || v < 0 || length1.length > 4) {
          callback(new Error('数字应在0~10000之间或者小数点保留四位小数'))
        } else {
          callback()
        }
      }
    }
    const valuecheck1 = (rule, value, callback) => {
      if (value === null) {
        value = ''
      }
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('颗粒数不能为空'))
      } else {
        const num = new RegExp('^-?\\d+$')
        if (!num.test(value)) {
          callback(new Error('颗粒数必须为正整数'))
        } else if (parseInt(value) < 0) {
          callback(new Error('颗粒数必须为正整数'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      productLists: [],
      list: [],
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
      productModel: '',
      chipNo: '',
      tapeNo: '',
      machineInfo: '',
      timeRadio: 0,
      machineList: [],
      exceptionCode: [],
      dialogForm: {
        waferNo: '',
        tapeNo: '',
        taskModel: '',
        sliceCount: '',
        electricity: '',
        testTime: '',
        measrue: '',
        importTime: '',
        machine: '',
        classify: '',
        wldMin: '',
        wldAvg: '',
        wldMax: '',
        wldStd: '',
        ivMin: '',
        ivAvg: '',
        ivMax: '',
        ivStd: '',
        vf1Min: '',
        vf1Avg: '',
        vf1Max: '',
        vf1Std: '',
        vf2Avg: '',
        vf2Max: '',
        vf2Min: '',
        vf2Std: '',
        vf3Avg: '',
        vf3Max: '',
        vf3Min: '',
        vf3Std: '',
        vf4Avg: '',
        vf4Max: '',
        vf4Min: '',
        vf4Std: '',
        irMin: '',
        irAvg: '',
        irMax: '',
        irStd: '',
        vzMin: '',
        vzAvg: '',
        vzMax: '',
        vzStd: '',
        wlpMin: '',
        wlpAvg: '',
        wlpMax: '',
        wlpStd: '',
        wlcMin: '',
        wlcAvg: '',
        wlcMax: '',
        wlcStd: '',
        hwAvg: '',
        compreYield: '',
        vf1Yield: '',
        vf2Yield: '',
        vf3Yield: '',
        vf4Yield: '',
        irYield: '',
        ivYield: '',
        dvfYield: '',
        wldYield: '',
        wlpYield: '',
        wlcYield: '',
        vzYield: '',
        irEsdAYield: '',
        wldNm5Yield: '',
        wlpNm5Yield: ''
      },
      rules: {
        waferNo: [{ required: true, message: '请输入WaferID', trigger: 'blur' }],
        taskModel: [{ required: true, message: '请选择产品型号', trigger: 'blur' }],
        tapeNo: [{ required: true, message: '请输入TapeNo', trigger: 'blur' }],
        sliceCount: [{ required: true, validator: valuecheck1, trigger: 'blur' }],
        electricity: [{ required: true, message: '请输入测试电流', trigger: 'blur' }],
        machine: [{ required: true, message: '请输入机台号', trigger: 'blur' }],
        classify: [{ required: true, message: '请选择品质等级', trigger: 'blur' }],
        testTime: [{ required: true, message: '请选择测试时间', trigger: 'blur' }],
        measrue: [{ required: true, message: '请选择外延尺寸', trigger: 'blur' }],
        importTime: [{ required: true, message: '请选择导入时间', trigger: 'blur' }],
        esdElec: [{ required: true, message: '请输入ESD测试电流', trigger: 'blur' }],
        grind: [{ required: true, message: '请输入研磨厚度', trigger: 'blur' }],
        wldMin: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wldAvg: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wldMax: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wldStd: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        ivMin: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        ivAvg: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        ivMax: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        ivStd: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf1Min: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf1Avg: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf1Max: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf1Std: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf2Min: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf2Avg: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf2Max: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf2Std: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf3Min: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf3Avg: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf3Max: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf3Std: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf4Min: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf4Avg: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf4Max: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf4Std: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        irMin: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        irAvg: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        irMax: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        irStd: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vzMin: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vzAvg: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vzMax: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vzStd: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wlpMin: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wlpAvg: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wlpMax: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wlpStd: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wlcMin: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wlcAvg: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wlcMax: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wlcStd: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        hwAvg: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        compreYield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf1Yield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf2Yield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf3Yield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vf4Yield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        irYield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        ivYield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        dvfYield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wldYield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wlpYield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wlcYield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        vzYield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        irEsdAYield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wldNm5Yield: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        wlpNm5Yield: [{ required: true, validator: valuecheck, trigger: 'blur' }]
      },
      fileUrl: process.env.BASE_API + '/xpRkData/ypImportExcel',
      addDialogVisible: false,
      editDialogVisible: false,
      loading: false,
      logDialogVisible: false,
      logbeginDate: '',
      logendDate: '',
      fileName: '',
      optName: '',
      logList: [],
      logpageSize: 12,
      logpageNum: 1,
      logtotalPage: 0,
      ycmsList: [],
      logpickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.logendDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          }
        }
      },
      logpickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.logbeginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      measureList: [],
      selectTheadVisble: false,
      formThead: furnaceList1,
      theadOptions: furnaceList,
      checkboxVal: furnaceList,
      formTheadOptions: furnaceList
    }
  },
  mounted() {
    var fpkVallowerbindata = localStorage.getItem('ypkVallowerbindata')
    if (fpkVallowerbindata !== null && fpkVallowerbindata !== undefined) {
      this.formThead = JSON.parse(fpkVallowerbindata)
      const arr = []
      this.theadOptions.map((item) => {
        this.formThead.map((val) => {
          if (item.thName === val.thName) {
            arr.push(item)
          }
        })
      })
      this.checkboxVal = arr
    }
    this.fetchData()
    this.productList()
    this.findLists()
    this.ycmslists()
    this.findSubstrateMeasureList()
    this.getExceptionCodeFun()
  },
  methods: {
    getExceptionCodeFun() {
      getExceptionCode({}).then(res => {
        this.exceptionCode = res.data
        this.exceptionCode.splice(0, 0, { label: 'A', options: [{ id: 0, code: 'A', name: '正品' }] })
      })
    },
    // 查询
    findSubstrateMeasureList() {
      findSubstrateMeasureList().then(res => {
        this.measureList = res.data
      })
    },
    submitOption() {
      const arr = []
      this.theadOptions.map((item) => {
        this.checkboxVal.map((val) => {
          if (item.thName === val.thName) {
            arr.push(item)
          }
        })
      })
      this.formThead = arr
      localStorage.setItem('ypkVallowerbindata', JSON.stringify(arr))
      this.selectTheadVisble = false
    },
    selectThead() {
      this.selectTheadVisble = !this.selectTheadVisble
    },
    openLog() {
      this.logDialogVisible = true
      this.logpageNum = 1
      this.logpageSize = 12
      this.fileName = ''
      this.optName = ''
      this.logbeginDate = ''
      this.logendDate = ''
      this.findLog()
    },
    // 每页数量改变
    logsizeChange(pageSize) {
      this.logpageSize = pageSize
      this.findLog()
    },
    // 当前页数改变
    logcurrentChange(pageNum) {
      this.logpageNum = pageNum
      this.findLog()
    },
    handleSearchLog() {
      this.logpageNum = 1
      this.findLog()
    },
    findLog() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.logpageSize,
        pageNum: this.logpageNum,
        startTime: this.formatDate(this.logbeginDate),
        endTime: this.formatDate(this.logendDate),
        route: 'xpRkData',
        operatorName: this.optName,
        fileName: this.fileName,
        type: 0
      }
      if (this.logbeginDate === '') {
        requestParams.startTime = ''
      }
      if (this.logendDate === '') {
        requestParams.endTime = ''
      }
      logList(requestParams).then(res => {
        this.logList = res.data.list
        this.logtotalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    handleClearLog() {
      this.logpageSize = 12
      this.logpageNum = 1
      this.logbeginDate = ''
      this.logendDate = ''
      this.optName = ''
      this.fileName = ''
      this.findLog()
    },
    setReprot(row) {
      this.$confirm('撤销后wafer将全部删除，是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteYpRecord({ id: row.id }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '撤销成功!'
            })
            this.findLog()
            this.fetchData()
          }
        })
      })
    },
    beforeUpload(file) {
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 100MB!',
          type: 'error'
        })
        this.loading = false
      }
      return isLt2M
    },
    onSuccess(res, file, fileList) {
      this.loading = false
      if (res.code !== 0) {
        this.$message({
          type: 'error',
          message: res.message
        })
      } else {
        if (res.message === '') {
          const parmas = {
            userId: sessionStorage.getItem('User-Id'),
            fileName: res.data.fileName,
            list: res.data.list
          }
          insertBatchYp(parmas).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '导入成功！'
              })
              this.fetchData()
            }
          })
        } else {
          this.$confirm(res.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const parmas = {
              userId: sessionStorage.getItem('User-Id'),
              fileName: res.data.fileName,
              list: res.data.list
            }
            insertBatchYp(parmas).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '导入成功！'
                })
                this.fetchData()
              }
            })
          })
        }
      }
    },
    onError() {
      this.$message({
        type: 'error',
        message: '上传失败，请重试！'
      })
      this.loading = false
    },
    // 查询
    productList() {
      productList().then(res => {
        this.productLists = res.data
      })
    },
    ycmslists() {
      const params = {
        pageNum: 1,
        pageSize: 100000,
        classifyCode: '',
        detailCode: '',
        isShow: 1
      }
      queryLists(params).then(res => {
        this.ycmsList = res.data.list
        this.ycmsList.splice(0, 0, { id: 0, code: 'A' })
      })
    },
    findLists() {
      findLists().then(res => {
        this.machineList = res.data.list
      })
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
    // 时间戳转yyyy-mm-dd
    formatDates(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      var h = '0' + date.getHours()
      var s = '0' + date.getMinutes()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length) + ' ' + h.substring(h.length - 2, h.length) + ':' + s.substring(s.length - 2, s.length) + ':00'
    },
    // 单击单据信息
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
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
    // 查询
    fetchData() {
      this.rowInfo = null
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        waferNo: this.chipNo,
        tapeNo: this.tapeNo,
        taskModel: this.productModel,
        machine: this.machineInfo,
        timeType: this.timeRadio === 0 ? 'bin' : 'imp'
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      findYp(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    clearCondition() {
      this.chipNo = ''
      this.tapeNo = ''
      this.productModel = ''
      this.timeRadio = 0
      this.machineInfo = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearch()
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.editDialogVisible = false
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    addDialog() {
      this.dialogForm = {
        waferNo: '',
        tapeNo: '',
        taskModel: '',
        sliceCount: '',
        electricity: '',
        testTime: '',
        measrue: '',
        importTime: '',
        machine: '',
        classify: '',
        wldMin: '',
        wldAvg: '',
        wldMax: '',
        wldStd: '',
        ivMin: '',
        ivAvg: '',
        ivMax: '',
        ivStd: '',
        vf1Min: '',
        vf1Avg: '',
        vf1Max: '',
        vf1Std: '',
        vf2Avg: '',
        vf2Max: '',
        vf2Min: '',
        vf2Std: '',
        vf3Avg: '',
        vf3Max: '',
        vf3Min: '',
        vf3Std: '',
        vf4Avg: '',
        vf4Max: '',
        vf4Min: '',
        vf4Std: '',
        irMin: '',
        irAvg: '',
        irMax: '',
        irStd: '',
        vzMin: '',
        vzAvg: '',
        vzMax: '',
        vzStd: '',
        wlpMin: '',
        wlpAvg: '',
        wlpMax: '',
        wlpStd: '',
        wlcMin: '',
        wlcAvg: '',
        wlcMax: '',
        wlcStd: '',
        hwAvg: '',
        compreYield: '',
        vf1Yield: '',
        vf2Yield: '',
        vf3Yield: '',
        vf4Yield: '',
        irYield: '',
        ivYield: '',
        dvfYield: '',
        wldYield: '',
        wlpYield: '',
        wlcYield: '',
        vzYield: '',
        irEsdAYield: '',
        wldNm5Yield: '',
        wlpNm5Yield: ''
      }
      this.addDialogVisible = true
    },
    addDialogs() {
      if (this.rowInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择参照行!'
        })
        return
      }
      this.dialogForm = {
        waferNo: this.rowInfo.waferNo,
        tapeNo: this.rowInfo.tapeNo === null ? '' : this.rowInfo.tapeNo,
        taskModel: this.rowInfo.taskModel === null ? '' : this.rowInfo.taskModel,
        sliceCount: this.rowInfo.sliceCount === null ? '' : this.rowInfo.sliceCount,
        electricity: this.rowInfo.electricity === null ? '' : this.rowInfo.electricity,
        machine: this.rowInfo.machine === null ? '' : this.rowInfo.machine,
        classify: this.rowInfo.classify === null ? '' : this.rowInfo.classify,
        esdElec: this.rowInfo.esdElec === null ? '' : this.rowInfo.esdElec,
        grind: this.rowInfo.grind === null ? '' : this.rowInfo.grind,
        importTime: '',
        wldMin: this.rowInfo.wldMin,
        wldAvg: this.rowInfo.wldAvg,
        wldMax: this.rowInfo.wldMax,
        wldStd: this.rowInfo.wldStd,
        ivMin: this.rowInfo.lopMin,
        ivAvg: this.rowInfo.lopAvg,
        ivMax: this.rowInfo.lopMax,
        ivStd: this.rowInfo.lopStd,
        vf1Min: this.rowInfo.vf1Min,
        vf1Avg: this.rowInfo.vf1Avg,
        vf1Max: this.rowInfo.vf1Max,
        vf1Std: this.rowInfo.vf1Std,
        vf2Avg: this.rowInfo.vf2Avg,
        vf2Max: this.rowInfo.vf2Max,
        vf2Min: this.rowInfo.vf2Min,
        vf2Std: this.rowInfo.vf2Std,
        vf3Avg: this.rowInfo.vf3Avg,
        vf3Max: this.rowInfo.vf3Max,
        vf3Min: this.rowInfo.vf3Min,
        vf3Std: this.rowInfo.vf3Std,
        vf4Avg: this.rowInfo.vf4Avg,
        vf4Max: this.rowInfo.vf4Max,
        vf4Min: this.rowInfo.vf4Min,
        vf4Std: this.rowInfo.vf4Std,
        irMin: this.rowInfo.irMin,
        irAvg: this.rowInfo.irAvg,
        irMax: this.rowInfo.irMax,
        irStd: this.rowInfo.irStd,
        vzMin: this.rowInfo.vzMin,
        vzAvg: this.rowInfo.vzAvg,
        vzMax: this.rowInfo.vzMax,
        vzStd: this.rowInfo.vzStd,
        wlpMin: this.rowInfo.wlpMin,
        wlpAvg: this.rowInfo.wlpAvg,
        wlpMax: this.rowInfo.wlpMax,
        wlpStd: this.rowInfo.wlpStd,
        wlcMin: this.rowInfo.wlcMin,
        wlcAvg: this.rowInfo.wlcAvg,
        wlcMax: this.rowInfo.wlcMax,
        wlcStd: this.rowInfo.wlcStd,
        testTime: '',
        measrue: this.rowInfo.measrue === null ? '' : this.rowInfo.measrue,
        hwAvg: this.rowInfo.hwAvg,
        compreYield: this.rowInfo.compreYield,
        vf1Yield: this.rowInfo.vf1Yield,
        vf2Yield: this.rowInfo.vf2Yield,
        vf3Yield: this.rowInfo.vf3Yield,
        vf4Yield: this.rowInfo.vf4Yield,
        irYield: this.rowInfo.irYield,
        ivYield: this.rowInfo.ivYield,
        dvfYield: this.rowInfo.dvfYield,
        wldYield: this.rowInfo.wldYield,
        wlpYield: this.rowInfo.wlpYield,
        wlcYield: this.rowInfo.wlcYield,
        vzYield: this.rowInfo.vzYield,
        irEsdAYield: this.rowInfo.irEsdAYield,
        wldNm5Yield: this.rowInfo.wldNm5Yield,
        wlpNm5Yield: this.rowInfo.wlpNm5Yield
      }
      this.addDialogVisible = true
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          findYpCodeExits({
            code: this.dialogForm.waferNo
          }).then(res => {
            if (res.code === 0) {
              if (res.data !== null) {
                this.$confirm(this.dialogForm.waferNo + '已存在，是否覆盖wafer信息?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  var params = {
                    waferNo: this.dialogForm.waferNo,
                    testTime: this.formatDates(this.dialogForm.testTime),
                    classify: this.dialogForm.classify,
                    electricity: this.dialogForm.electricity,
                    electrode: this.dialogForm.electrode,
                    id: res.data,
                    importTime: this.formatDates(this.dialogForm.importTime),
                    esdElec: this.dialogForm.esdElec,
                    grind: this.dialogForm.grind,
                    irAvg: this.dialogForm.irAvg,
                    irMax: this.dialogForm.irMax,
                    irMin: this.dialogForm.irMin,
                    irStd: this.dialogForm.irStd,
                    lopAvg: this.dialogForm.ivAvg,
                    lopMax: this.dialogForm.ivMax,
                    lopMin: this.dialogForm.ivMin,
                    lopStd: this.dialogForm.ivStd,
                    machine: this.dialogForm.machine,
                    record: this.dialogForm.record,
                    sliceCount: this.dialogForm.sliceCount,
                    source: this.dialogForm.source,
                    taskModel: this.dialogForm.taskModel,
                    vf1Avg: this.dialogForm.vf1Avg,
                    vf1Max: this.dialogForm.vf1Max,
                    vf1Min: this.dialogForm.vf1Min,
                    vf1Std: this.dialogForm.vf1Std,
                    vf2Avg: this.dialogForm.vf2Avg,
                    vf2Max: this.dialogForm.vf2Max,
                    vf2Min: this.dialogForm.vf2Min,
                    vf2Std: this.dialogForm.vf2Std,
                    vf3Avg: this.dialogForm.vf3Avg,
                    vf3Max: this.dialogForm.vf3Max,
                    vf3Min: this.dialogForm.vf3Min,
                    vf3Std: this.dialogForm.vf3Std,
                    vf4Avg: this.dialogForm.vf4Avg,
                    vf4Max: this.dialogForm.vf4Max,
                    vf4Min: this.dialogForm.vf4Min,
                    vf4Std: this.dialogForm.vf4Std,
                    vzAvg: this.dialogForm.vzAvg,
                    vzMax: this.dialogForm.vzMax,
                    vzMin: this.dialogForm.vzMin,
                    vzStd: this.dialogForm.vzStd,
                    wlcAvg: this.dialogForm.wlcAvg,
                    wlcMax: this.dialogForm.wlcMax,
                    wlcMin: this.dialogForm.wlcMin,
                    wlcStd: this.dialogForm.wlcStd,
                    wldAvg: this.dialogForm.wldAvg,
                    wldMax: this.dialogForm.wldMax,
                    wldMin: this.dialogForm.wldMin,
                    wldStd: this.dialogForm.wldStd,
                    wlpAvg: this.dialogForm.wlpAvg,
                    wlpMax: this.dialogForm.wlpMax,
                    wlpMin: this.dialogForm.wlpMin,
                    wlpStd: this.dialogForm.wlpStd,
                    measrue: this.dialogForm.measrue,
                    hwAvg: this.dialogForm.hwAvg,
                    compreYield: this.dialogForm.compreYield,
                    vf1Yield: this.dialogForm.vf1Yield,
                    vf2Yield: this.dialogForm.vf2Yield,
                    vf3Yield: this.dialogForm.vf3Yield,
                    vf4Yield: this.dialogForm.vf4Yield,
                    irYield: this.dialogForm.irYield,
                    ivYield: this.dialogForm.ivYield,
                    dvfYield: this.dialogForm.dvfYield,
                    wldYield: this.dialogForm.wldYield,
                    wlpYield: this.dialogForm.wlpYield,
                    wlcYield: this.dialogForm.wlcYield,
                    vzYield: this.dialogForm.vzYield,
                    irEsdAYield: this.dialogForm.irEsdAYield,
                    wldNm5Yield: this.dialogForm.wldNm5Yield,
                    wlpNm5Yield: this.dialogForm.wlpNm5Yield
                  }
                  updateYp(params).then(res => {
                    if (res.code === 0) {
                      this.$message({
                        type: 'success',
                        message: '添加成功!'
                      })
                      this.$refs[formName].resetFields()
                      this.addDialogVisible = false
                      this.fetchData()
                    }
                  })
                })
              } else {
                const params = {
                  waferNo: this.dialogForm.waferNo,
                  testTime: this.formatDates(this.dialogForm.testTime),
                  classify: this.dialogForm.classify,
                  electricity: this.dialogForm.electricity,
                  electrode: this.dialogForm.electrode,
                  importTime: this.formatDates(this.dialogForm.importTime),
                  esdElec: this.dialogForm.esdElec,
                  grind: this.dialogForm.grind,
                  irAvg: this.dialogForm.irAvg,
                  irMax: this.dialogForm.irMax,
                  irMin: this.dialogForm.irMin,
                  irStd: this.dialogForm.irStd,
                  lopAvg: this.dialogForm.ivAvg,
                  lopMax: this.dialogForm.ivMax,
                  lopMin: this.dialogForm.ivMin,
                  lopStd: this.dialogForm.ivStd,
                  machine: this.dialogForm.machine,
                  record: this.dialogForm.record,
                  sliceCount: this.dialogForm.sliceCount,
                  source: this.dialogForm.source,
                  taskModel: this.dialogForm.taskModel,
                  vf1Avg: this.dialogForm.vf1Avg,
                  vf1Max: this.dialogForm.vf1Max,
                  vf1Min: this.dialogForm.vf1Min,
                  vf1Std: this.dialogForm.vf1Std,
                  vf2Avg: this.dialogForm.vf2Avg,
                  vf2Max: this.dialogForm.vf2Max,
                  vf2Min: this.dialogForm.vf2Min,
                  vf2Std: this.dialogForm.vf2Std,
                  vf3Avg: this.dialogForm.vf3Avg,
                  vf3Max: this.dialogForm.vf3Max,
                  vf3Min: this.dialogForm.vf3Min,
                  vf3Std: this.dialogForm.vf3Std,
                  vf4Avg: this.dialogForm.vf4Avg,
                  vf4Max: this.dialogForm.vf4Max,
                  vf4Min: this.dialogForm.vf4Min,
                  vf4Std: this.dialogForm.vf4Std,
                  vzAvg: this.dialogForm.vzAvg,
                  vzMax: this.dialogForm.vzMax,
                  vzMin: this.dialogForm.vzMin,
                  vzStd: this.dialogForm.vzStd,
                  wlcAvg: this.dialogForm.wlcAvg,
                  wlcMax: this.dialogForm.wlcMax,
                  wlcMin: this.dialogForm.wlcMin,
                  wlcStd: this.dialogForm.wlcStd,
                  wldAvg: this.dialogForm.wldAvg,
                  wldMax: this.dialogForm.wldMax,
                  wldMin: this.dialogForm.wldMin,
                  wldStd: this.dialogForm.wldStd,
                  wlpAvg: this.dialogForm.wlpAvg,
                  wlpMax: this.dialogForm.wlpMax,
                  wlpMin: this.dialogForm.wlpMin,
                  wlpStd: this.dialogForm.wlpStd,
                  measrue: this.dialogForm.measrue,
                  hwAvg: this.dialogForm.hwAvg,
                  compreYield: this.dialogForm.compreYield,
                  vf1Yield: this.dialogForm.vf1Yield,
                  vf2Yield: this.dialogForm.vf2Yield,
                  vf3Yield: this.dialogForm.vf3Yield,
                  vf4Yield: this.dialogForm.vf4Yield,
                  irYield: this.dialogForm.irYield,
                  ivYield: this.dialogForm.ivYield,
                  dvfYield: this.dialogForm.dvfYield,
                  wldYield: this.dialogForm.wldYield,
                  wlpYield: this.dialogForm.wlpYield,
                  wlcYield: this.dialogForm.wlcYield,
                  vzYield: this.dialogForm.vzYield,
                  irEsdAYield: this.dialogForm.irEsdAYield,
                  wldNm5Yield: this.dialogForm.wldNm5Yield,
                  wlpNm5Yield: this.dialogForm.wlpNm5Yield
                }
                insertYp(params).then(res => {
                  if (res.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '添加成功!'
                    })
                    this.$refs[formName].resetFields()
                    this.addDialogVisible = false
                    this.fetchData()
                  }
                })
              }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = {
            waferNo: this.dialogForm.waferNo,
            testTime: this.formatDates(this.dialogForm.testTime),
            tapeNo: this.dialogForm.tapeNo,
            classify: this.dialogForm.classify,
            electricity: this.dialogForm.electricity,
            electrode: this.dialogForm.electrode,
            id: this.rowInfo.id,
            importTime: this.formatDates(this.dialogForm.importTime),
            esdElec: this.dialogForm.esdElec,
            grind: this.dialogForm.grind,
            irAvg: this.dialogForm.irAvg,
            irMax: this.dialogForm.irMax,
            irMin: this.dialogForm.irMin,
            irStd: this.dialogForm.irStd,
            lopAvg: this.dialogForm.ivAvg,
            lopMax: this.dialogForm.ivMax,
            lopMin: this.dialogForm.ivMin,
            lopStd: this.dialogForm.ivStd,
            machine: this.dialogForm.machine,
            record: this.dialogForm.record,
            sliceCount: this.dialogForm.sliceCount,
            source: this.dialogForm.source,
            taskModel: this.dialogForm.taskModel,
            vf1Avg: this.dialogForm.vf1Avg,
            vf1Max: this.dialogForm.vf1Max,
            vf1Min: this.dialogForm.vf1Min,
            vf1Std: this.dialogForm.vf1Std,
            vf2Avg: this.dialogForm.vf2Avg,
            vf2Max: this.dialogForm.vf2Max,
            vf2Min: this.dialogForm.vf2Min,
            vf2Std: this.dialogForm.vf2Std,
            vf3Avg: this.dialogForm.vf3Avg,
            vf3Max: this.dialogForm.vf3Max,
            vf3Min: this.dialogForm.vf3Min,
            vf3Std: this.dialogForm.vf3Std,
            vf4Avg: this.dialogForm.vf4Avg,
            vf4Max: this.dialogForm.vf4Max,
            vf4Min: this.dialogForm.vf4Min,
            vf4Std: this.dialogForm.vf4Std,
            vzAvg: this.dialogForm.vzAvg,
            vzMax: this.dialogForm.vzMax,
            vzMin: this.dialogForm.vzMin,
            vzStd: this.dialogForm.vzStd,
            wlcAvg: this.dialogForm.wlcAvg,
            wlcMax: this.dialogForm.wlcMax,
            wlcMin: this.dialogForm.wlcMin,
            wlcStd: this.dialogForm.wlcStd,
            wldAvg: this.dialogForm.wldAvg,
            wldMax: this.dialogForm.wldMax,
            wldMin: this.dialogForm.wldMin,
            wldStd: this.dialogForm.wldStd,
            wlpAvg: this.dialogForm.wlpAvg,
            wlpMax: this.dialogForm.wlpMax,
            wlpMin: this.dialogForm.wlpMin,
            wlpStd: this.dialogForm.wlpStd,
            measrue: this.dialogForm.measrue,
            hwAvg: this.dialogForm.hwAvg,
            compreYield: this.dialogForm.compreYield,
            vf1Yield: this.dialogForm.vf1Yield,
            vf2Yield: this.dialogForm.vf2Yield,
            vf3Yield: this.dialogForm.vf3Yield,
            vf4Yield: this.dialogForm.vf4Yield,
            irYield: this.dialogForm.irYield,
            ivYield: this.dialogForm.ivYield,
            dvfYield: this.dialogForm.dvfYield,
            wldYield: this.dialogForm.wldYield,
            wlpYield: this.dialogForm.wlpYield,
            wlcYield: this.dialogForm.wlcYield,
            vzYield: this.dialogForm.vzYield,
            irEsdAYield: this.dialogForm.irEsdAYield,
            wldNm5Yield: this.dialogForm.wldNm5Yield,
            wlpNm5Yield: this.dialogForm.wlpNm5Yield
          }
          updateYp(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteInfo() {
      if (this.rowInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择删除行!'
        })
        return
      }
      if (this.rowInfo.status !== 0) {
        this.$message({
          type: 'error',
          message: '已入库信息无法删除!'
        })
        return
      }
      this.$confirm('删除后wafer将无法打印标签，是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteYp({ id: this.rowInfo.id }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      })
    },
    editInfo() {
      if (this.rowInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择编辑行!'
        })
        return
      }
      if (this.rowInfo.status === 2) {
        this.$message({
          type: 'error',
          message: '已入库信息无法修改!'
        })
        return
      }
      this.dialogForm = {
        waferNo: this.rowInfo.waferNo === null ? '' : this.rowInfo.waferNo,
        taskModel: this.rowInfo.taskModel === null ? '' : this.rowInfo.taskModel,
        tapeNo: this.rowInfo.tapeNo === null ? '' : this.rowInfo.tapeNo,
        sliceCount: this.rowInfo.sliceCount === null ? '' : this.rowInfo.sliceCount,
        electricity: this.rowInfo.electricity === null ? '' : this.rowInfo.electricity,
        machine: this.rowInfo.machine === null ? '' : this.rowInfo.machine,
        classify: this.rowInfo.classify === null ? '' : this.rowInfo.classify,
        testTime: this.rowInfo.testTime === null ? '' : new Date(this.rowInfo.testTime),
        importTime: this.rowInfo.importTime === null ? '' : new Date(this.rowInfo.importTime),
        esdElec: this.rowInfo.esdElec === null ? '' : this.rowInfo.esdElec,
        grind: this.rowInfo.grind === null ? '' : this.rowInfo.grind,
        wldMin: this.rowInfo.wldMin,
        wldAvg: this.rowInfo.wldAvg,
        wldMax: this.rowInfo.wldMax,
        wldStd: this.rowInfo.wldStd,
        ivMin: this.rowInfo.lopMin,
        ivAvg: this.rowInfo.lopAvg,
        ivMax: this.rowInfo.lopMax,
        ivStd: this.rowInfo.lopStd,
        vf1Min: this.rowInfo.vf1Min,
        vf1Avg: this.rowInfo.vf1Avg,
        vf1Max: this.rowInfo.vf1Max,
        vf1Std: this.rowInfo.vf1Std,
        vf2Avg: this.rowInfo.vf2Avg,
        vf2Max: this.rowInfo.vf2Max,
        vf2Min: this.rowInfo.vf2Min,
        vf2Std: this.rowInfo.vf2Std,
        vf3Avg: this.rowInfo.vf3Avg,
        vf3Max: this.rowInfo.vf3Max,
        vf3Min: this.rowInfo.vf3Min,
        vf3Std: this.rowInfo.vf3Std,
        vf4Avg: this.rowInfo.vf4Avg,
        vf4Max: this.rowInfo.vf4Max,
        vf4Min: this.rowInfo.vf4Min,
        vf4Std: this.rowInfo.vf4Std,
        irMin: this.rowInfo.irMin,
        irAvg: this.rowInfo.irAvg,
        irMax: this.rowInfo.irMax,
        irStd: this.rowInfo.irStd,
        vzMin: this.rowInfo.vzMin,
        vzAvg: this.rowInfo.vzAvg,
        vzMax: this.rowInfo.vzMax,
        vzStd: this.rowInfo.vzStd,
        wlpMin: this.rowInfo.wlpMin,
        wlpAvg: this.rowInfo.wlpAvg,
        wlpMax: this.rowInfo.wlpMax,
        wlpStd: this.rowInfo.wlpStd,
        wlcMin: this.rowInfo.wlcMin,
        wlcAvg: this.rowInfo.wlcAvg,
        wlcMax: this.rowInfo.wlcMax,
        wlcStd: this.rowInfo.wlcStd,
        measrue: this.rowInfo.measrue === null ? '' : this.rowInfo.measrue,
        hwAvg: this.rowInfo.hwAvg,
        compreYield: this.rowInfo.compreYield,
        vf1Yield: this.rowInfo.vf1Yield,
        vf2Yield: this.rowInfo.vf2Yield,
        vf3Yield: this.rowInfo.vf3Yield,
        vf4Yield: this.rowInfo.vf4Yield,
        irYield: this.rowInfo.irYield,
        ivYield: this.rowInfo.ivYield,
        dvfYield: this.rowInfo.dvfYield,
        wldYield: this.rowInfo.wldYield,
        wlpYield: this.rowInfo.wlpYield,
        wlcYield: this.rowInfo.wlcYield,
        vzYield: this.rowInfo.vzYield,
        irEsdAYield: this.rowInfo.irEsdAYield,
        nm5Yield: this.rowInfo.nm5Yield,
        wldNm5Yield: this.rowInfo.wldNm5Yield,
        wlpNm5Yield: this.rowInfo.wlpNm5Yield
      }
      this.editDialogVisible = true
    },
    importExcel() {
      let columnEn = ''
      let columnCn = ''
      for (const item of this.formThead) {
        if (item.thName !== '源文件' && item.thName !== '序号') {
          if (columnCn === '') {
            columnCn = item.thName
          } else {
            columnCn = columnCn + ',' + item.thName
          }
          if (columnEn === '') {
            columnEn = item.thKey
          } else {
            if (item.thKey === 'electrodesd') {
              columnEn = columnEn + ',electrode'
            } else {
              columnEn = columnEn + ',' + item.thKey
            }
          }
        }
      }
      if (columnCn === '') {
        this.$message({
          type: 'error',
          message: '显示列为空!'
        })
        return
      }
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/xpRkData/findYpExportList?startTime=${startTime}&endTime=${endTime}&waferNo=${this.chipNo}&taskModel=${this.productModel}&machine=${this.machineInfo}&tapeNo=${this.tapeNo}&timeType=${this.timeRadio === 0 ? 'bin' : 'imp'}&headerCn=${columnCn}&headerEn=${columnEn}`, '_blank')
    },
    download(row) {
      window.open(process.env.BASE_API + `/attachment/downByPath?path=${row.filePath}`, '_blank')
    }
  }
}

