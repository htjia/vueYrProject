
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findArkList } from '@/api/chipStoreManage/stockControl'
import { storehouseTypeList, placeOriginList } from '@/api/chipStoreManage/chipBasicSetting'
import { findFieldSelectList, findXpWareHous, findXpWareHousList, createBoxNo, insertToStore, printBoxNo, printSequence, findStorehouse, findStoreDetailList, back, findStoreCode } from '@/api/chipStoreManage/chipPutInStorage'
import Vue from 'vue'
Vue.filter('NumFormat', function(value) {
  if (!value) return ' '
  var intPart = Number(value).toFixed(0) // 获取整数部分
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})
const furnaceList = [
  {
    thName: '序号',
    thKey: 'index',
    width: 50
  },
  {
    thName: 'WaferID',
    thKey: 'code',
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
const furnacefList = [
  {
    thName: '序号',
    thKey: 'index',
    width: 50
  },
  {
    thName: 'ChipNo',
    thKey: 'binNo',
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
const furnacefList1 = [
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
const formTheadStore = [
  {
    thName: 'WaferID',
    thKey: 'code',
    width: 100
  },
  {
    thName: 'TapeNo',
    thKey: 'tapeNo',
    width: 150
  },
  {
    thName: '入库包号',
    thKey: 'boxNo',
    width: 130
  },
  {
    thName: '项次号',
    thKey: 'sequence',
    width: 100
  },
  {
    thName: '柜位',
    thKey: 'arkName',
    width: 100
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
    thName: 'ChipNo',
    thKey: 'code',
    width: 200
  },
  {
    thName: 'TapeNo',
    thKey: 'tapeNo',
    width: 200
  },
  {
    thName: '入库包号',
    thKey: 'boxNo',
    width: 130
  },
  {
    thName: '项次号',
    thKey: 'sequence',
    width: 100
  },
  {
    thName: '柜位',
    thKey: 'arkName',
    width: 100
  },
  {
    thName: '产品型号',
    thKey: 'taskModel',
    width: 120
  },
  {
    thName: '光色',
    thKey: 'color',
    width: 80
  },
  {
    thName: '型号',
    thKey: 'model',
    width: 80
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
  },
  {
    thName: '是否清洗',
    thKey: 'isClean',
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
const furnaceHasPackageList = [
  {
    thName: '序号',
    thKey: 'index',
    width: 50
  },
  {
    thName: 'WaferID',
    thKey: 'code',
    width: 100
  },
  {
    thName: 'TapeNo',
    thKey: 'tapeNo',
    width: 150
  },
  {
    thName: '入库包号',
    thKey: 'boxNo',
    width: 130
  },
  {
    thName: '项次号',
    thKey: 'sequence',
    width: 100
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
const furnacefHasPackageList = [
  {
    thName: '序号',
    thKey: 'index',
    width: 50
  },
  {
    thName: 'ChipNo',
    thKey: 'code',
    width: 100
  },
  {
    thName: 'TapeNo',
    thKey: 'tapeNo',
    width: 150
  },
  {
    thName: '入库包号',
    thKey: 'boxNo',
    width: 130
  },
  {
    thName: '项次号',
    thKey: 'sequence',
    width: 100
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
      fileYpUrl: process.env.BASE_API + '/xpStorehouse/ypImportExcel',
      fileFpUrl: process.env.BASE_API + '/xpStorehouse/fpImportExcel',
      loading: false,
      isImport: false,
      listLoading: false,
      receiptsDisabled: true,
      sendDialogVisible: false,
      recordDialogVisible: false,
      importDialogVisible: false,
      cabinetDetailShow: false,
      noVerifiedVisible: false,
      isPrint: true,
      isPrintSequence: true,
      unequal: true,
      isAppend: false,
      waferTol: 0,
      timeRadio: 1,
      chipCount: 0,
      sliceCount: 0,
      tableKey: Math.random(),
      tableKey2: Math.random(),
      sliceNum: 100,
      waferNo: '',
      receipts: '',
      sliceType: '',
      importSliceType: 0,
      maker: '',
      listNum: '',
      listNo: '',
      WaferID: '',
      productMode: '',
      placeOrigin: '',
      tipOutModel: '',
      reworkNum: '',
      waferTotal: 0,
      abnormalList: [{}],
      detailList: [{}],
      receiveList: [{}],
      selectedList: [],
      noVerified: [],
      scanList: [],
      productType: '',
      productTypeOptions: [],
      reservedFields: [],
      currentOrderData: [],
      selectedRunRow: {},
      selectedRow: {},
      model: '',
      arkId: '',
      putInStorageNo: '',
      billType: '',
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
      placeOriginList: [],
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
          id: 0,
          name: '正常片'
        },
        {
          id: 1,
          name: '报废片'
        }
      ],
      selectType: 0,
      putInTypeList: [],
      cabinetList: [],
      runSelectList: [],
      boxSelectList: [],
      recordList: [],
      currentScanItem: {},
      cabinet: '',
      lastBoxNo: '',
      lastBoxCount: '',
      selectedCode: '',
      options: [],
      formTheadStore: formTheadStore,
      formTheadStoreParams: formTheadStoreParams,
      formTheadfStore: formTheadfStore,
      formTheadfStoreParams: formTheadfStoreParams,
      selectTheadVisble: false,
      formThead: furnaceList1,
      theadOptions: furnaceList,
      furnaceHasPackageList: furnaceHasPackageList,
      furnacefHasPackageList: furnacefHasPackageList,
      checkboxVal: furnaceList,
      formTheadOptions: furnaceList,
      selectfTheadVisble: false,
      formTheadf: furnacefList1,
      theadOptionfs: furnacefList,
      checkboxfVal: furnacefList,
      formTheadfOptions: furnacefList,
      currentId: ''
    }
  },
  computed: {
    beforePackageNum() {
      if (this.lastBoxNo !== '' && this.lastBoxNo !== null) {
        return this.lastBoxNo + '(' + this.lastBoxCount + ')'
      } else {
        return ''
      }
    },
    scanCount() {
      let count = 0
      this.scanList.map(item => {
        if (this.isImport) {
          count += item.sliceCount
        } else {
          count += item.binCount
        }
      })
      return (count / 1000).toFixed(3)
    }
  },
  mounted() {
    this.findCabinetListFun()
    this.putInTime = this.getFormatDate()
    this.findReservedFieldList()
    this.getStorehouseTypeList()
    this.findPlaceOriginList()
    setTimeout(() => {
      this.$refs.importInput.focus()
    }, 100)
  },
  methods: {
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
      localStorage.setItem('yryFormThead', JSON.stringify(arr))
      this.selectTheadVisble = false
    },
    selectThead() {
      this.selectTheadVisble = !this.selectTheadVisble
    },
    submitOptionf() {
      const arr = []
      this.theadOptionfs.map((item) => {
        this.checkboxfVal.map((val) => {
          if (item.thName === val.thName) {
            arr.push(item)
          }
        })
      })
      this.formTheadf = arr
      localStorage.setItem('yrfFormThead', JSON.stringify(arr))
      this.selectfTheadVisble = false
    },
    selectTheadf() {
      this.selectfTheadVisble = !this.selectfTheadVisble
    },
    // 柜位查询
    findCabinetListFun() {
      findArkList().then(res => {
        this.cabinetList = res.data
      })
    },
    // 产地查询
    findPlaceOriginList() {
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      placeOriginList(params).then(res => {
        this.placeOriginList = res.data.list
        this.placeOrigin = res.data.list[0].name
      })
    },
    // 查询入库类型
    getStorehouseTypeList() {
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      storehouseTypeList(params).then(res => {
        this.putInTypeList = res.data.list
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
    timeChange(data) {
      console.log(data)
    },
    cabinetClick() {
      this.findCabinetListFun()
      this.cabinetDetailShow = !this.cabinetDetailShow
    },
    handleCloseDialog() {
      this.pageNum = 1
      this.pageSize = 12
      this.listNo = ''
      this.WaferID = ''
      this.receipts = ''
      this.beginDate = ''
      this.endDate = ''
      this.waferTol = 0
      this.selectedRunRow = ''
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
        status: 1,
        code: this.listNo,
        // waferId: this.WaferID,
        timeType: this.timeRadio === 1 ? 'new' : 'audit',
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        // type: this.receipts,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findXpWareHous(params).then(res => {
        this.sendDialogVisible = true
        this.isActive = 0
        this.totalPage = parseInt(res.data.total)
        this.billList = res.data.list
        this.waferTol = res.data.list.length === 0 ? 0 : this.billList[0].sliceCount
        this.selectedRunRow = this.billList[0]
        this.sliceType = this.billList[0].sliceType
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.billList[0])
        }, 200)
      })
    },
    // 单击Run信息
    rowClick(row) {
      this.waferTol = row.sliceCount
      this.selectedRunRow = row
      this.sliceType = row.sliceType
    },
    recordRowClick(row) {
      this.selectedRunRow = row
      this.sliceType = row.sliceType
      this.waferTol = row.count
    },
    // 选择按钮
    handleSelectRow(row) {
      this.selectedRow = row
      this.sliceCount = row.sliceCount
      this.findWaferFunOut(row)
      this.putInStorageNo = row.code
      this.productMode = row.taskModel
      this.tipOutModel = row.sliceType === 0 ? '圆片' : '方片'
      this.billType = row.billType === 0 ? '正常片' : '返工片'
      this.putInStorageType = row.billType === 0 ? this.putInTypeList[0].name : this.putInTypeList[1].name
      this.waferNo = ''
      this.scanList = []
      this.sendDialogVisible = false
      this.unequal = true
      this.isImport = false
    },
    rowDblclick(row, column, cell, event) {
      this.selectedRow = row
      this.sliceCount = row.sliceCount
      this.findWaferFunOut(row)
      this.putInStorageNo = row.code
      this.productMode = row.taskModel
      this.tipOutModel = row.sliceType === 0 ? '圆片' : '方片'
      this.billType = row.billType === 0 ? '正常片' : '返工片'
      this.putInStorageType = row.billType === 0 ? this.putInTypeList[0].name : this.putInTypeList[1].name
      this.scanList = []
      this.sendDialogVisible = false
      this.unequal = true
      this.isImport = false
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
    rowStyle({ row }) {
      if (row.atcive) {
        return 'background: #65ba7d'
      } else {
        return ''
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.atcive) {
        return 'background: #65ba7d'
      } else {
        return ''
      }
    },
    createBoxNoFun() {
      const params = {
        sliceType: this.sliceType,
        isCheck: false,
        list: this.scanList,
        boxNum: this.sliceNum
      }
      createBoxNo(params).then(res => {
        this.sliceCount = res.data.list.length
        this.scanList = res.data.list
        this.lastBoxNo = res.data.lastBoxNo
        this.lastBoxCount = res.data.lastBoxCount
      })
    },
    fullScan() {
      this.selectedList.map(item => {
        item.atcive = true
      })
      this.scanList = this.selectedList
      this.sliceCount = this.scanList.length
      this.tableKey = Math.random()
      this.tableKey2 = Math.random()
      this.createNewBoxNo()
    },
    handleSelectItem() {
      let hasWafer = false
      let alreadyRxist = false
      // let selectedIndex = 0
      this.selectedList.map((item, index) => {
        if (item.waferNo === this.waferNo) {
          if (item.atcive) {
            alreadyRxist = true
          }
          item.atcive = true
          this.currentScanItem = item
          hasWafer = true
          // selectedIndex = index
        }
      })
      this.waferNo = ''
      // this.tableKey = Math.random()
      // this.tableKey2 = Math.random()
      if (!hasWafer) {
        this.waferNo = ''
        this.$message({
          type: 'error',
          message: '当前Wafer与单据信息不符，请检查后重试!'
        })
        return false
      }
      if (alreadyRxist) {
        this.waferNo = ''
        this.$message({
          type: 'error',
          message: '当前Wafer已存在，请检查后重试!'
        })
        return false
      }
      this.scanList.push(this.currentScanItem)
      setTimeout(() => {
        if (this.sliceType === 0) {
          this.$refs.tableList1.$el.firstChild.firstChild.children[2].scrollTop = this.scanList.length * 40
          this.$refs.tableList1.setCurrentRow(this.scanList[this.scanList.length - 1])
        } else {
          this.$refs.tableList2.$el.firstChild.firstChild.children[2].scrollTop = this.scanList.length * 40
          this.$refs.tableList2.setCurrentRow(this.scanList[this.scanList.length - 1])
        }
      }, 100)
      this.createNewBoxNo()
    },
    createNewBoxNo() {
      if (this.sliceCount === this.scanList.length) {
        this.unequal = false
        this.createBoxNoFun()
      }
    },
    clearDialogSearch(index) {
      this.listNo = ''
      this.beginDate = ''
      this.endDate = ''
      this.timeRadio = 1
      this.pageNum = 1
      this.pageSize = 12
      this.handleDialogSearch(index)
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
      window.open(process.env.BASE_API + `/xpStorehouse/findExportList?id=${this.selectedRunRow.id}&sliceType=${this.selectedRunRow.sliceType}&headerCn=${columnCn}&headerEn=${columnEn}`)
    },
    handleImport() {
      this.importDialogVisible = true
    },
    // 送片单导出
    handleExportDialog() {
      let columnEn = 'waferNo,tapeNo'
      let columnCn = 'WaferID,TapeNo'
      if (this.selectedRunRow.sliceType === 0) {
        for (const item of this.formThead) {
          if (item.thName !== '序号') {
            columnCn = columnCn + ',' + item.thName
            columnEn = columnEn + ',' + item.thKey
          }
        }
      } else {
        columnEn = 'waferNo,tapeNo'
        columnCn = 'ChipNo,TapeNo'
        for (const item of this.formTheadf) {
          if (item.thName !== '序号') {
            columnCn = columnCn + ',' + item.thName
            columnEn = columnEn + ',' + item.thKey
          }
        }
      }
      window.open(process.env.BASE_API + `/xpWarehous/exportExcel?id=${this.selectedRunRow.id}&sliceType=${this.selectedRunRow.sliceType}&headerCn=${columnCn}&headerEn=${columnEn}`)
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
    clearSearch() {
      this.batchNum = ''
      this.process = ''
      this.beginDate = ''
      this.endDate = ''
      this.model = ''
      this.pole = ''
    },
    // Run信息/Wafer信息切换
    navClick(index, type) {
      if (index === 1) {
        if (type === 1) {
          this.findWaferFun(this.selectedRunRow.id)
        } else {
          this.findStoreHouseDetailFun(this.selectedRunRow.id)
        }
      }
      this.isActive = index
    },
    findWaferFun(id) {
      const params = {
        id,
        sliceType: this.sliceType
      }
      findXpWareHousList(params).then(res => {
        this.waferList = res.data.list
      })
    },
    findWaferFunOut(row) {
      const params = {
        id: row.id,
        sliceType: this.sliceType
      }
      findXpWareHousList(params).then(res => {
        this.selectedList = res.data.list
        this.lastBoxCount = res.data.lastBoxCount
        this.lastBoxNo = res.data.lastBoxNo
        this.arkId = res.data.arkId
      })
    },
    findWaferFunOut2(row) {
      const params = {
        id: row.id,
        sliceType: row.sliceType,
        isCheck: false,
        taskModel: row.taskModel
      }
      createBoxNo(params).then(res => {
        res.data.list.map(item => {
          item['active'] = false
        })
        this.selectedList = res.data.list
        this.lastBoxNo = res.data.lastBoxNo
        this.lastBoxCount = res.data.lastBoxCount
        this.arkId = res.data.arkId
      })
    },
    handleSearchStorageNo() {
      const params = {
        status: 1,
        code: this.putInStorageNo,
        pageNum: 1,
        pageSize: 1
      }
      findXpWareHous(params).then(res => {
        if (res.data.list.length === 0) {
          this.$message({
            type: 'error',
            message: '入库单信息有误，请检查后重试!'
          })
          this.putInStorageNo = ''
          return false
        }
        this.currentOrderData = res.data.list
        this.sliceType = this.currentOrderData[0].sliceType
        this.handleSelectRow(this.currentOrderData[0])
        setTimeout(() => {
          this.$refs.importInputJp.focus()
        }, 600)
      })
    },
    // 记录wafer
    findStoreHouseDetailFun(id) {
      const params = {
        id,
        sliceType: this.selectedRunRow.sliceType,
        pageNum: 1,
        pageSize: 10000
      }
      findStoreDetailList(params).then(res => {
        this.waferList = res.data.list
      })
    },
    handleSendBack() {
      const params = {
        id: this.selectedRow.id
      }
      this.$confirm('是否确认退回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        back(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.putInStorageNo = ''
          this.productMode = ''
          this.billType = ''
          this.tipOutModel = ''
          this.putInStorageType = ''
          this.placeOrigin = ''
          this.cabinet = ''
          this.reworkNum = ''
          this.lastBoxCount = ''
          this.putInTime = this.getFormatDate()
          this.itemType = ''
          this.putInRemark = ''
          this.options = []
          this.selectedList = []
          this.reservedFields.map(item => {
            item.fields = []
          })
        })
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
    getCode() {
      findStoreCode().then(res => {
        this.putInStorageNo = res.data
      })
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
        this.selectedList = res.data
        this.sliceCount = res.data.length
        this.scanList = []
        this.importDialogVisible = false
        this.isImport = true
        // const hasWafer = this.selectedList.filter(item => { return item.waferId === res.data[0].waferId })
        // if (hasWafer.length === 0) {
        //   this.selectedRow = {
        //     sliceType: parseInt(this.importSliceType)
        //   }
        //   this.getCode()
        //   this.tipOutModel = this.importSliceType === 0 ? '圆片' : '方片'
        //   this.billType = '正常片'
        //   this.productMode = res.data[0].taskModel
        // }
        this.selectedRow = {
          sliceType: parseInt(this.importSliceType)
        }
        this.sliceType = parseInt(this.importSliceType)
        this.getCode()
        this.tipOutModel = this.importSliceType === 0 ? '圆片' : '方片'
        this.billType = '正常片'
        this.putInStorageType = this.putInTypeList[0].name
        this.productMode = res.data[0].taskModel
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
        timeType: this.timeRadio,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findStorehouse(params).then(res => {
        this.recordDialogVisible = true
        this.recordList = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.waferTol = res.data.list.length === 0 ? 0 : this.recordList[0].count
        this.selectedRunRow = this.recordList[0]
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.recordList[0])
        }, 200)
      })
    },
    // 添加
    handleAdd() {
      this.noVerified = this.selectedList.filter(item => { return !item.atcive })
      if (this.selectedList.filter(item => { return item.atcive }).length !== this.selectedList.length) {
        this.noVerifiedVisible = true
        return false
      }
      let flag = false
      this.selectedList.map(item => {
        if (!item.tapeNo) {
          flag = true
        }
      })
      if (flag) {
        this.$message({
          type: 'error',
          message: 'tapeNo不能为空，请检查后重试!'
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
      if (this.placeOrigin === '') {
        this.$message({
          type: 'error',
          message: '请选择芯片产地!'
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
      const warehousIdArr = []
      this.reservedFields.map(item => {
        warehousIdArr.push({
          feildId: item.id,
          val: item.fields.join(',')
        })
      })
      const params = {
        arkId: this.cabinet,
        backNo: this.reworkNum,
        billNo: this.putInStorageNo,
        billType: this.selectedRow.billType,
        createTime: this.putInTime,
        creator: sessionStorage.getItem('User-Id'),
        product: this.placeOrigin,
        remark: this.putInRemark,
        resverField: JSON.stringify(warehousIdArr),
        sliceType: this.selectedRow.sliceType,
        storeType: this.putInStorageType,
        taskModel: this.productMode,
        wafers: this.scanList,
        warehousId: this.selectedRow.id
      }
      this.addSubmit(params)
    },
    addSubmit(params) {
      insertToStore(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.putInStorageNo = ''
        this.productMode = ''
        this.billType = ''
        this.tipOutModel = ''
        this.putInStorageType = ''
        this.placeOrigin = ''
        this.cabinet = ''
        this.reworkNum = ''
        this.lastBoxCount = ''
        this.putInTime = this.getFormatDate()
        this.itemType = ''
        this.putInRemark = ''
        this.options = []
        this.selectedList = []
        this.scanList = []
        this.reservedFields.map(item => {
          item.fields = []
        })
        this.isPrint = true
        this.isPrintSequence = true
        this.isAppend = false
        setTimeout(() => {
          this.$refs.importInput.focus()
        }, 100)
        if (this.isPrint) {
          printBoxNo({ id: res.data.id, module: 'xpStorehouseBoxNo' }).then(res => {})
        }
        if (this.isPrintSequence) {
          printSequence({ id: res.data.id, module: 'xpStorehouseSeq' }).then(res => {})
        }
        this.isPrint = true
        this.isAppend = false
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
    checkBoxChange(selected) {
      if (selected) {
        this.isPrint = false
        console.log(this.arkId)
        this.cabinetList.map(item => {
          if (item.id === this.arkId) {
            console.log(item.id)
            this.cabinet = item.id
          }
        })
        this.appendPackNum()
      } else {
        this.createNewBoxNo()
      }
    },
    boxPrintChange(selected) {
      if (selected) {
        this.isAppend = false
      }
    },
    sliceNumBlur() {
      if (this.sliceNum.trim() === '') {
        this.sliceNum = 100
      }
      if (this.scanList.length === 0) {
        return false
      }
      if (this.isImport) {
        this.importBoxNunBlur()
      } else {
        this.boxNunBlur()
      }
    },
    importBoxNunBlur() {
      const params = {
        boxNum: this.sliceNum,
        lastBoxNo: this.isAppend ? this.lastBoxNo : '',
        list: this.scanList,
        sliceType: parseInt(this.importSliceType),
        isCheck: false
      }
      createBoxNo(params).then(res => {
        res.data.list.map(item => {
          item['active'] = false
        })
        this.scanList = res.data.list
        this.tableKey = Math.random()
        this.tableKey2 = Math.random()
        this.lastBoxNo = res.data.lastBoxNo
        this.lastBoxCount = res.data.lastBoxCount
      })
    },
    boxNunBlur() {
      const params = {
        boxNum: this.sliceNum,
        lastBoxNo: this.isAppend ? this.lastBoxNo : '',
        list: this.scanList,
        sliceType: this.selectedRow.sliceType,
        isCheck: false,
        taskModel: this.selectedRow.taskModel
      }
      createBoxNo(params).then(res => {
        res.data.list.map(item => {
          item['active'] = false
        })
        this.scanList = res.data.list
        this.tableKey = Math.random()
        this.tableKey2 = Math.random()
        this.lastBoxNo = res.data.lastBoxNo
        this.lastBoxCount = res.data.lastBoxCount
      })
    },
    appendPackNum() {
      if (this.sliceNum.toString().trim() === '') {
        this.$message({
          type: 'error',
          message: '每包片数不能为空!'
        })
        return false
      }
      const params = {
        boxNum: this.sliceNum,
        lastBoxNo: this.lastBoxNo,
        list: this.scanList,
        sliceType: this.selectedRow.sliceType,
        isCheck: this.isAppend,
        taskModel: this.selectedRow.taskModel
      }
      createBoxNo(params).then(res => {
        res.data.list.map(item => {
          item['active'] = false
        })
        this.scanList = res.data.list
        this.tableKey = Math.random()
        this.tableKey2 = Math.random()
        this.lastBoxNo = res.data.lastBoxNo
        this.lastBoxCount = res.data.lastBoxCount
      })
    },
    printFun() {
      printBoxNo({ id: this.selectedRunRow.id, module: 'xpStorehouseBoxNo' }).then(res => {
        this.$message({
          type: 'success',
          message: '标签正在打印中，请稍候！'
        })
      })
    },
    printSequenceFun() {
      printSequence({ id: this.selectedRunRow.id, module: 'xpStorehouseSeq' }).then(res => {
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

