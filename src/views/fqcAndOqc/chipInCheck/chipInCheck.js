
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findList, findWafer, productList, findAbnormal, findNormByState, ypAutoCheck, fpAutoCheck, audit, reverseAduit } from '@/api/fqcAndOqc/chipInStorage'
import { cateGoryFind } from '@/api/chipManage/pcTipOut'
import { getToken } from '@/utils/auth'
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
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      examineDialogVisible: false,
      testDialogVisible: false,
      finishAudit: false,
      list: [{}],
      filmNum: [],
      packSelect: [],
      filmNumOptions: [
        {
          id: 1,
          name: '123123'
        }
      ],
      packDecideOptions: [
        {
          id: 1,
          name: '123123'
        }
      ],
      detailList: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      dialogTitle: '',
      beginDate: '',
      endDate: '',
      autoRule: '',
      ruleId: '',
      reverseReason: '',
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
      isActive: 0,
      waferTol: 0,
      outDecide: 0,
      packDecide: 0,
      billTypeOptions: [
        {
          id: 0,
          name: '正常'
        },
        {
          id: 1,
          name: '返工'
        }
      ],
      productModelOptions: [],
      taskStatusOptions: [
        { id: 0, name: '待审核' },
        { id: 1, name: '通过' },
        { id: 2, name: '不通过' }
      ],
      putInStoreOptions: [
        { id: 1, name: '方片' },
        { id: 0, name: '圆片' }
      ],
      tipOutOptions: [],
      searchKeys: {
        dh: '',
        ph: '',
        djlx: '',
        cpxh: '',
        rwzt: '',
        rklx: '',
        tplx: []
      },
      viewForm: {
        rkdh: '',
        djlx: '',
        rkpx: '',
        cpxh: '',
        zfp: '',
        zdr: '',
        zdsj: '',
        shr: '',
        shsj: '',
        remark: ''
      },
      rules: {
        sybh: [{ required: true, message: '请输入试样编号', trigger: 'blur' }]
      },
      resultData: '',
      outResultData: '',
      abnormalIds: [],
      selectedRow: '',
      isAbnormal: false,
      showSubmitBtn: true,
      auditStaus: 0,
      currentId: '',
      selectTheadVisble: false,
      formThead: furnaceList1,
      theadOptions: furnaceList,
      checkboxVal: furnaceList,
      formTheadOptions: furnaceList,
      selectfTheadVisble: false,
      formTheadf: furnacefList1,
      theadOptionfs: furnacefList,
      checkboxfVal: furnacefList,
      formTheadfOptions: furnacefList
    }
  },
  mounted() {
    this.fetchData()
    this.productList()
    this.cateGoryFindFun()
    this.findAbnormalFun()
  },
  methods: {
    handleExport() {
      let columnEn = ''
      let columnCn = ''
      if (this.selectedRow.sliceType === 0) {
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
              columnEn = columnEn + ',' + item.thKey
            }
          }
        }
      } else {
        columnEn = 'waferNo,TapeNo'
        columnCn = 'ChipNo,tapeNo'
        for (const item of this.formTheadf) {
          if (item.thName !== '源文件' && item.thName !== '序号') {
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
        }
      }
      window.open(process.env.BASE_API + `/xpWarehous/exportExcel?id=${this.selectedRow.id}&sliceType=${this.selectedRow.sliceType}&waferNo=${this.searchKeys.ph}&headerCn=${columnCn}&headerEn=${columnEn}`)
    },
    getCurrentTime() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      return year + '-' + month + '-' + day
    },
    rowStyle({ row }) {
      if (row.status === 2) {
        return 'background: #E6A23C'
      } else {
        return ''
      }
    },
    submitForm() {
      const params = {
        remark: this.viewForm.remark,
        auditResult: this.outResultData,
        auditTime: this.getCurrentTime(),
        auditor: sessionStorage.getItem('User-Id'),
        id: this.selectedRow.id,
        status: this.isAbnormal ? 2 : 1 // 1通过 2不通过
      }
      if (this.isAbnormal) {
        const details = []
        this.abnormalIds.map(item => {
          details.push({
            id: item
          })
        })
        params.details = details
      }
      console.log(params, '---------------------params')
      audit(params).then(res => {
        this.examineDialogVisible = false
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.fetchData()
      })
    },
    // 通过
    handlePass() {
      if (this.selectedRow.sliceType === 0) {
        this.ypAutoCheckSubmitFun()
      } else {
        this.fpAutoCheckSubmitFun()
      }
      this.auditStaus = 1
      this.testDialogVisible = false
    },
    // 不通过
    handleNoPass() {
      if (this.outDecide === 1 && this.filmNum.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择异常片号!'
        })
        return false
      }
      if (this.packDecide === 1 && this.packSelect.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择包装缺陷类型!'
        })
        return false
      }
      if (this.selectedRow.sliceType === 0) {
        this.ypAutoCheckSubmitFun()
      } else {
        this.fpAutoCheckSubmitFun()
      }
      this.auditStaus = 2
      this.testDialogVisible = false
    },
    // 圆片判定
    ypAutoCheckSubmitFun() {
      const params = {
        id: this.selectedRow.id,
        facade: this.outDecide === 0 ? 'OK' : 'NG',
        faceWafer: this.filmNum.join(','),
        packReason: this.packSelect.join(','),
        pack: this.packDecide === 0 ? 'OK' : 'NG',
        rule: this.ruleId,
        model: this.selectedRow.model
      }
      ypAutoCheck(params).then(res => {
        this.outResultData = res.data.result
        this.abnormalIds = res.data.ids
        this.isAbnormal = !res.data.status
      })
    },
    // 方片判定
    fpAutoCheckSubmitFun() {
      const params = {
        id: this.selectedRow.id,
        facade: this.outDecide === 0 ? 'OK' : 'NG',
        faceWafer: this.filmNum.join(','),
        packReason: this.packSelect.join(','),
        pack: this.packDecide === 0 ? 'OK' : 'NG',
        taskModel: this.selectedRow.taskModel,
        model: this.selectedRow.model
      }
      fpAutoCheck(params).then(res => {
        this.outResultData = res.data.result
        this.abnormalIds = res.data.ids
        this.isAbnormal = !res.data.status
      })
    },
    decideChange(val) {
      if (this.packDecide === 0 && this.outDecide === 0 && !this.isAbnormal) {
        this.showSubmitBtn = true
      } else {
        this.showSubmitBtn = false
      }
    },
    findAbnormalFun() {
      findAbnormal({}).then(res => {
        this.packDecideOptions = res.data
      })
    },
    // 获取投片类型
    cateGoryFindFun() {
      cateGoryFind({}).then(res => {
        this.tipOutOptions = res.data
      })
    },
    // 产品型号
    productList() {
      productList().then(res => {
        this.productModelOptions = res.data
      })
    },
    selectChange(data) {
      console.log(data)
    },
    // 判定弹窗关闭
    handleCloseAudit() {
      this.finishAudit = false
      this.outDecide = 0
      this.packDecide = 0
      this.filmNum = []
      this.packSelect = []
      this.resultData = ''
    },
    // 自动审核
    autoTest() {
      if (this.selectedRow.sliceType === 0) {
        this.ypAutoCheckFun()
      } else {
        this.fpAutoCheckFun()
      }
      this.finishAudit = true
    },
    // 圆片自动判定
    ypAutoCheckFun() {
      const params = {
        id: this.selectedRow.id,
        rule: this.ruleId,
        model: this.selectedRow.model
      }
      ypAutoCheck(params).then(res => {
        this.resultData = res.data.result
        this.isAbnormal = !res.data.status
        this.decideChange()
      })
    },
    // 方片回测判定
    fpAutoCheckFun() {
      const params = {
        id: this.selectedRow.id,
        taskModel: this.selectedRow.taskModel,
        model: this.selectedRow.model
      }
      fpAutoCheck(params).then(res => {
        this.resultData = res.data.result
        this.isAbnormal = !res.data.status
        this.decideChange()
      })
    },
    rowClick(row) {
      this.waferTol = row.sliceCount
      this.selectedRow = row
    },
    navClick(index) {
      this.isActive = index
      if (this.list.length !== 0) {
        const params = {
          id: this.selectedRow.id,
          sliceType: this.selectedRow.sliceType,
          waferNo: this.searchKeys.ph
        }
        findWafer(params).then(res => {
          this.detailList = res.data.list
        })
      }
    },
    handleTest() {
      this.testDialogVisible = true
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
      if (this.isActive === 1) {
        this.navClick(1)
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
    fetchData() {
      this.listLoading = true
      const params = {
        code: this.searchKeys.dh,
        waferNo: this.searchKeys.ph,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        billType: this.searchKeys.djlx,
        taskModel: this.searchKeys.cpxh,
        status: this.searchKeys.rwzt,
        sliceType: this.searchKeys.rklx,
        category: this.searchKeys.tplx.join(','),
        timeType: this.timeRadio === 0 ? 'new' : 'audit',
        pageNum: this.pageNum,
        pageSize: this.pageSize
        // sliceType: this.searchKeys.djlx,
        // model: this.searchKeys.cpxh,
        // color: this.searchKeys.cpxh,
      }
      findList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        if (res.data.list.length !== 0) {
          this.$refs.billTable.setCurrentRow(this.list[0])
          this.selectedRow = this.list[0]
          this.waferTol = this.list[0].sliceCount
        }
        this.listLoading = false
      })
    },
    clearSearch() {
      this.searchKeys.dh = ''
      this.searchKeys.ph = ''
      this.searchKeys.djlx = ''
      this.searchKeys.cpxh = ''
      this.searchKeys.rwzt = ''
      this.searchKeys.rklx = ''
      this.searchKeys.tplx = []
      this.endDate = ''
      this.beginDate = ''
      this.timeRadio = 0
      this.handleSearch()
    },
    handleClose() {
      this.reverseReason = ''
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 获取判定规则
    findNormByStateFun(row) {
      const params = {
        type: row.quality === '正品' ? 0 : 1
      }
      console.log(params)
      findNormByState(params).then(res => {
        this.autoRule = res.data.name
        this.ruleId = res.data.id
      })
    },
    // 反审
    handleRaudit() {
      this.$confirm('是否进入反审处理流程？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: this.selectedRow.id,
          reverseReason: this.reverseReason
        }
        reverseAduit(params).then(res => {
          this.examineDialogVisible = false
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fetchData()
        })
      })
    },
    handleExamine(row) {
      this.auditStaus = row.status
      this.outResultData = row.auditResult
      this.viewForm.rkdh = row.code
      this.viewForm.djlx = row.billType === 0 ? '正常' : '返工'
      this.viewForm.rkpx = row.sliceType === 0 ? '圆片' : '方片'
      this.viewForm.cpxh = row.taskModel
      this.viewForm.zfp = row.quality
      this.viewForm.zdr = row.creatorName
      this.viewForm.zdsj = row.createTime
      this.viewForm.remark = row.remark
      if (row.status === 0) {
        this.viewForm.shr = getToken()
        this.viewForm.shsj = this.getCurrentTime()
      } else {
        this.viewForm.shr = row.auditorName
        this.viewForm.shsj = row.auditTime
      }
      if (row.sliceType === 0) {
        this.findNormByStateFun(row)
      }
      const params = {
        id: row.id,
        sliceType: row.sliceType
      }
      findWafer(params).then(res => {
        this.detailList = res.data.list
        this.filmNumOptions = res.data.list
      })
      this.examineDialogVisible = true
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
      localStorage.setItem('rkkVallowerbindata', JSON.stringify(arr))
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
      localStorage.setItem('rkfkVallowerbindata', JSON.stringify(arr))
      this.selectfTheadVisble = false
    },
    selectTheadf() {
      this.selectfTheadVisble = !this.selectfTheadVisble
    }
  }
}

