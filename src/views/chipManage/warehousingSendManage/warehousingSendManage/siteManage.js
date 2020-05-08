
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { productList } from '@/api/fqcAndOqc/chipInStorage'
import { cateGoryFind } from '@/api/chipManage/pcTipOut'
import { printLable, findColorList, findModelList, findList, findDetail, findWaitStoreWafer, inserts, findCode, binFind, binInsert, binUpdate, binDeletes, fbFind, fbInsert, updateWafer, wagerDeletes, updateRefuseWafer } from '@/api/chipManage/warehousingSendManage/warehousingSendManage'
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
    thName: 'Wafer来源',
    thKey: 'source',
    width: 101
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
    thName: 'Wafer来源',
    thKey: 'source',
    width: 101
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
      notBastic: false,
      list: [],
      defaultFormThead: [],
      selectTheadVisble: false,
      findDialogVisible: false,
      formThead: furnaceList1,
      theadOptions: furnaceList,
      checkboxVal: furnaceList,
      formTheadOptions: furnaceList,
      selectfTheadVisble: false,
      formTheadf: furnacefList1,
      theadOptionfs: furnacefList,
      checkboxfVal: furnacefList,
      formTheadfOptions: furnacefList,
      siteType: '',
      siteName: '',
      siteStatus: '',
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
      userOptions: [],
      currentId: '',
      isActive: 0,
      waferTol: 0,
      rowInfo: {
        sliceType: 0
      },
      waferId: '',
      title: '',
      code: '',
      type: '',
      waferNo: '',
      billType: '',
      sliceType: '',
      model: '',
      color: '',
      modelList: [],
      colorList: [],
      status: '',
      creater: '',
      checker: '',
      printNuM: 0,
      productModelOptions: [],
      typeList: [
        {
          id: 0,
          name: '正常'
        },
        {
          id: 1,
          name: '返工'
        }
      ],
      typesList: [
        {
          id: 0,
          name: '圆片'
        },
        {
          id: 1,
          name: '方片'
        }
      ],
      isClean: 0,
      isCleanList: [
        {
          id: 0,
          name: '是'
        },
        {
          id: 1,
          name: '否'
        }
      ],
      statusList: [
        {
          id: 0,
          name: '待审核'
        },
        {
          id: 1,
          name: '通过'
        },
        {
          id: 2,
          name: '不通过'
        },
        {
          id: 3,
          name: '完成'
        }
      ],
      userListOption: [],
      anotherList: [],
      anotherLists: [],
      anotherList1: [],
      removeLists: [],
      codeNo: '',
      modelType: 0,
      modelCreater: sessionStorage.getItem('Admin-Token'),
      modelTime: this.getNowFormatDate(),
      modelRemark: '',
      innerVisible: false,
      multipleSelection: [],
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      waferList: [],
      selectList: [],
      selectAll: false,
      chanceAll: false,
      treeList: [],
      machineOptions: [],
      waferRunId: '',
      waferwafeId: '',
      waferMathine: '',
      waferBeginDate: '',
      waferEndDate: '',
      waferCheckType: '',
      waferTypes: '',
      removeList: [],
      removeALL: false,
      checkVisible: false,
      isCheckNuLL: true,
      isCheckLevel: true,
      ifCheck: false,
      checkStr: '',
      checkErrorList: [],
      editionTypeSelectOptions: [],
      colIndex: [],
      colErrorIndex: [],
      normalSelectList: [],
      unSelectList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      baofeiDialogVisible: false,
      HandleDialogVisible: false,
      setDialogVisible: false,
      checkReason: false,
      printVisible: false,
      printDialogVisible: false,
      errorTotal: 0,
      printList: [],
      printDate: '',
      isDisabled: false,
      platterNo: '',
      isSetActive: 0,
      ruType: 0,
      binList: [],
      binModel: '',
      binNum: '',
      products: '',
      zfp: '',
      fblist: [],
      procucts: '',
      tpType: '',
      tipOutOptions: [],
      timeRadio: 0
    }
  },
  mounted() {
    var rkkVallowerbindata = localStorage.getItem('rkkVallowerbindata')
    if (rkkVallowerbindata !== null && rkkVallowerbindata !== undefined) {
      this.formThead = JSON.parse(rkkVallowerbindata)
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
    var rkfkVallowerbindata = localStorage.getItem('rkfkVallowerbindata')
    if (rkfkVallowerbindata !== null && rkfkVallowerbindata !== undefined) {
      this.formTheadf = JSON.parse(rkfkVallowerbindata)
      const arr = []
      this.theadOptionfs.map((item) => {
        this.formTheadf.map((val) => {
          if (item.thName === val.thName) {
            arr.push(item)
          }
        })
      })
      this.checkboxfVal = arr
    }
    this.fetchData()
    this.findModelList()
    this.findColorList()
    this.productList()
    this.cateGoryFindFun()
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
    findModelList() {
      findModelList().then(res => {
        this.modelList = res.data.list
      })
    },
    findColorList() {
      findColorList().then(res => {
        this.colorList = res.data
      })
    },
    searchWafer() {
      this.findWaferInfoForStorage()
      this.findWaferRunGroup()
    },
    inputBlur(row) {
      if (this.platterNo === '') {
        return
      }
      let flag = false
      for (const item of this.anotherLists) {
        if (item.code === this.platterNo.trim()) {
          flag = true
          break
        }
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '扫描片号不可以重复添加!'
        })
        return
      }
      const params = {
        waferNo: this.platterNo,
        sliceType: this.ruType
      }
      this.platterNo = ''
      findWaitStoreWafer(params).then(res => {
        if (res.data !== null) {
          if (this.ruType === 0) {
            if (res.data.size === '' || res.data.size === null) {
              this.$message({
                type: 'error',
                message: '扫描片号尺寸不能为空!'
              })
              return
            }
            if (res.data.category === '' || res.data.category === null) {
              this.$message({
                type: 'error',
                message: '扫描片号投片类型不能为空!'
              })
              return
            }
          }
          if (res.data.fullBin === '' || res.data.fullBin === null) {
            this.$message({
              type: 'error',
              message: '扫描片号是否满BIN不能为空!'
            })
            return
          }
          if (res.data.taskModel === '' || res.data.taskModel === null) {
            this.$message({
              type: 'error',
              message: '扫描片号产品型号不能为空!'
            })
            return
          }
          if (res.data.classify === '' || res.data.classify === null) {
            this.$message({
              type: 'error',
              message: '扫描片号异常类型不能为空!'
            })
            return
          }
          if (res.data.band === '' || res.data.band === null) {
            this.$message({
              type: 'error',
              message: '扫描片号波段不能为空!'
            })
            return
          }
        }
        res.data.code = res.data.waferNo
        if (res.data !== null && this.anotherLists.length > 0) {
          if (this.ruType === 0) {
            const code1 = this.anotherLists[0].code.substring(0, 1)
            const code2 = res.data.code.substring(0, 1)
            if (this.anotherLists[0].size !== res.data.size) {
              this.$message({
                type: 'error',
                message: '扫描片号必须是相同尺寸!'
              })
              return
            }
            if (code1 !== code2) {
              this.$message({
                type: 'error',
                message: '扫描片号必须是相同投片类型!'
              })
              return
            }
          }
          if (this.anotherLists[0].fullBin !== res.data.fullBin) {
            this.$message({
              type: 'error',
              message: '扫描片号是否满BIN必须相同!'
            })
            return
          }

          if (this.anotherLists[0].taskModel.substring(0, 5) !== res.data.taskModel.substring(0, 5)) {
            this.$message({
              type: 'error',
              message: '扫描片号产品型号必须相同!'
            })
            return
          }
          // if (this.anotherLists[0].isClean !== res.data.isClean) {
          //   this.$message({
          //     type: 'error',
          //     message: '扫描片号是否清洗必须相同!'
          //   })
          //   return
          // }
          if (this.anotherLists[0].band !== res.data.band) {
            this.$message({
              type: 'error',
              message: '扫描片号波段必须相同!'
            })
            return
          }
          if (this.anotherLists[0].classify !== res.data.classify) {
            this.$message({
              type: 'error',
              message: '扫描片号异常类型必须相同!'
            })
            return
          }
        }
        this.anotherLists.push(res.data)
        const _this = this
        setTimeout(function() {
          _this.$refs.multipleTable.$el.firstElementChild.firstElementChild.children[2].scrollTop = _this.$refs.multipleTable.$el.firstElementChild.firstElementChild.children[2].scrollHeight + 40
          _this.$refs.multipleTable.setCurrentRow(_this.anotherList1[_this.anotherList1.length - 1])
        }, 100)
        if (this.anotherLists.length > 0) {
          this.products = this.anotherLists[0].taskModel
          this.zfp = this.anotherLists[0].quality
          this.finCode(this.anotherLists[0].model)
        }
      })
    },
    upinputBlur(row) {
      if (this.platterNo === '') {
        return
      }
      let flag = false
      for (const item of this.anotherList1) {
        if (item.waferNo === this.platterNo.trim()) {
          flag = true
          break
        }
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '扫描片号不可以重复添加!'
        })
        return
      }
      const params = {
        waferNo: this.platterNo,
        sliceType: this.ruType
      }
      this.platterNo = ''
      findWaitStoreWafer(params).then(res => {
        if (res.data !== null) {
          if (this.ruType === 0) {
            if (res.data.size === '' || res.data.size === null) {
              this.$message({
                type: 'error',
                message: '扫描片号尺寸不能为空!'
              })
              return
            }
            if (res.data.category === '' || res.data.category === null) {
              this.$message({
                type: 'error',
                message: '扫描片号投片类型不能为空!'
              })
              return
            }
          }
          if (res.data.fullBin === '' || res.data.fullBin === null) {
            this.$message({
              type: 'error',
              message: '扫描片号是否满BIN不能为空!'
            })
            return
          }
          if (res.data.taskModel === '' || res.data.taskModel === null) {
            this.$message({
              type: 'error',
              message: '扫描片号产品型号不能为空!'
            })
            return
          }
          if (res.data.classify === '' || res.data.classify === null) {
            this.$message({
              type: 'error',
              message: '扫描片号异常类型不能为空!'
            })
            return
          }
          if (res.data.band === '' || res.data.band === null) {
            this.$message({
              type: 'error',
              message: '扫描片号波段不能为空!'
            })
            return
          }
        }
        res.data.code = res.data.waferNo
        if (res.data !== null && this.anotherList1.length > 0) {
          if (this.ruType === 0) {
            const code1 = this.anotherList1[0].waferNo.substring(0, 1)
            const code2 = res.data.code.substring(0, 1)
            if (this.anotherList1[0].size !== res.data.size) {
              this.$message({
                type: 'error',
                message: '扫描片号必须是相同尺寸!'
              })
              return
            }
            if (code1 !== code2) {
              this.$message({
                type: 'error',
                message: '扫描片号必须是相同投片类型!'
              })
              return
            }
          }
          if (this.anotherList1[0].fullBin !== res.data.fullBin) {
            this.$message({
              type: 'error',
              message: '扫描片号是否满BIN必须相同!'
            })
            return
          }
          if (this.anotherList1[0].taskModel.substring(0, 5) !== res.data.taskModel.substring(0, 5)) {
            this.$message({
              type: 'error',
              message: '扫描片号产品型号必须相同!'
            })
            return
          }
          // if (this.anotherList1[0].isClean !== res.data.isClean) {
          //   this.$message({
          //     type: 'error',
          //     message: '扫描片号是否清洗必须相同!'
          //   })
          //   return
          // }
          if (this.anotherList1[0].band !== res.data.band) {
            this.$message({
              type: 'error',
              message: '扫描片号波段必须相同!'
            })
            return
          }
          if (this.anotherList1[0].classify !== res.data.classify) {
            this.$message({
              type: 'error',
              message: '扫描片号异常类型必须相同!'
            })
            return
          }
        }
        res.data.waferNo = res.data.code
        this.anotherList1.push(res.data)
        const _this = this
        setTimeout(function() {
          _this.$refs.multipleTable.$el.firstElementChild.firstElementChild.children[2].scrollTop = _this.$refs.multipleTable.$el.firstElementChild.firstElementChild.children[2].scrollHeight + 40
          _this.$refs.multipleTable.setCurrentRow(_this.anotherList1[_this.anotherList1.length - 1])
        }, 100)
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
    findWaferInfo() {
      const params = {
        id: this.rowInfo.id,
        sliceType: this.rowInfo.sliceType
      }
      findDetail(params).then(res => {
        this.anotherList = res.data.list
      })
    },
    findWaferInfos() {
      const params = {
        id: this.rowInfo.id,
        sliceType: this.rowInfo.sliceType
      }
      findDetail(params).then(res => {
        this.anotherList1 = res.data.list
        this.colErrorIndex = []
        let firstErrorIndex = -1
        let lastErrorIndex = -1
        let lastId = -1
        let statu = 0
        for (let i = 0; i < this.anotherList1.length; i++) {
          if (i === 0) {
            firstErrorIndex = i
            lastErrorIndex = i
          } else {
            if (statu !== 2 && this.anotherList1[i].status === 2) {
              firstErrorIndex = i
            }
            if (statu === 2 && this.anotherList1[i].status !== 2) {
              lastErrorIndex = i - 1
              this.colErrorIndex.push({ firstIndex: firstErrorIndex, lastIndex: lastErrorIndex })
              firstErrorIndex = i
            }
            if (statu === 2 && this.anotherList1[i].status === 2 && i === this.anotherList1.length - 1) {
              lastErrorIndex = i
              this.colErrorIndex.push({ firstIndex: firstErrorIndex, lastIndex: lastErrorIndex })
            }
          }
          statu = this.anotherList1[i].status
          lastId = this.anotherList1[i].runId
          console.log(lastId)
        }
      })
    },
    addNew() {
      this.addDialogVisible = true
      this.ifCheck = false
      this.ruType = 1
      this.modelType = 0
      this.isClean = 0
      this.modelRemark = ''
      this.checkStr = ''
      this.platterNo = ''
      this.anotherLists = []
      this.products = ''
      this.zfp = ''
      this.isDisabled = false
      this.modelTime = this.getNowFormatDate()
    },
    handleStrage(index) {
      this.anotherLists.splice(index, 1)
      if (this.anotherLists.length === 0) {
        this.codeNo = ''
      } else {
        this.finCode(this.anotherLists[0].model)
      }
    },
    handleStrageup(index) {
      this.anotherList1.splice(index, 1)
    },
    finCode(model) {
      const param = {
        sliceType: this.ruType,
        model: model
      }
      findCode(param).then(res => {
        this.codeNo = res.data.code
      })
    },
    deleteSelect() {
      for (let i = 0; i < this.removeList.length; i++) {
        for (let x = 0; x < this.anotherLists.length; x++) {
          if (this.anotherLists[x].id === this.removeList[i].id) {
            this.anotherLists.splice(x, 1)
          }
        }
      }
      this.removeALL = false
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ((columnIndex === 0 || columnIndex === 1) && this.colIndex.length > 0) {
        let isCheck = 0
        let setI = -1
        for (let i = 0; i < this.colIndex.length; i++) {
          if (this.colIndex[i].firstIndex === rowIndex) {
            isCheck = 1
            setI = i
            break
          } else if (this.colIndex[i].firstIndex < rowIndex && this.colIndex[i].lastIndex >= rowIndex) {
            isCheck = 2
            break
          }
        }
        if (isCheck === 1) {
          return {
            rowspan: this.colIndex[setI].lastIndex + 1 - this.colIndex[setI].firstIndex,
            colspan: 1
          }
        } else if (isCheck === 2) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    objectSpanMethods({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3 && this.colErrorIndex.length > 0) {
        let isCheck = 0
        let setI = -1
        for (let i = 0; i < this.colErrorIndex.length; i++) {
          if (this.colErrorIndex[i].firstIndex === rowIndex) {
            isCheck = 1
            setI = i
            break
          } else if (this.colErrorIndex[i].firstIndex < rowIndex && this.colErrorIndex[i].lastIndex >= rowIndex) {
            isCheck = 2
            break
          }
        }
        if (isCheck === 1) {
          if (this.colErrorIndex[setI].lastIndex !== this.colErrorIndex[setI].firstIndex) {
            return {
              rowspan: this.colErrorIndex[setI].lastIndex + 1 - this.colErrorIndex[setI].firstIndex,
              colspan: 1
            }
          }
        } else if (isCheck === 2) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    normalUpdateSelect(data) {
      this.normalSelectList = []
      let runId = -1
      for (const item of data) {
        if (item.runId !== runId) {
          this.normalSelectList.push(item.runId)
          runId = item.runId
        }
      }
    },
    deleteRunId() {
      for (const item of this.normalSelectList) {
        for (let i = 0; i < this.anotherList1.length; i++) {
          if (item === this.anotherList1[i].runId) {
            this.anotherList1.splice(i, 1)
            i = i - 1
          }
        }
      }
      this.colIndex = []
      let firstIndex = -1
      let lastIndex = -1
      let lastId = -1
      for (let i = 0; i < this.anotherList1.length; i++) {
        if (i === 0) {
          firstIndex = i
          lastIndex = i
        } else {
          if (lastId !== this.anotherList1[i].runId) {
            lastIndex = i
          } else if (i === this.anotherList1.length - 1 && lastId === this.anotherList1[i].runId) {
            lastIndex = i
          }
          if (firstIndex !== lastIndex) {
            this.colIndex.push({ firstIndex: firstIndex, lastIndex: lastIndex })
            firstIndex = i
          }
        }
        lastId = this.anotherList1[i].runId
      }
    },
    saveUpdateNormal() {
      const ids = []
      for (const item of this.anotherList1) {
        ids.push({ waferNo: item.waferNo })
      }
      if (ids.length === 0) {
        this.$message({
          type: 'error',
          message: '请添加入库送片wafer!'
        })
        return
      }
      const params = {
        details: ids,
        id: this.rowInfo.id,
        status: this.rowInfo.status === 2 ? 0 : this.rowInfo.status,
        sliceType: this.ruType,
        remark: this.modelRemark
      }
      this.isDisabled = true
      updateRefuseWafer(params).then(res => {
        this.isDisabled = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.editDialogVisible = false
          this.fetchData()
        }
      }, res => {
        this.isDisabled = false
      })
    },
    saveError() {
      const ids = []
      for (const item of this.removeLists) {
        ids.push(item.id)
      }
      if (ids.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要处理的列表!'
        })
        return
      }
      this.isDisabled = true
      updateWafer({ ids: ids.join(), id: this.rowInfo.id, status: 0 }).then(res => {
        this.isDisabled = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '处理成功!'
          })
          this.HandleDialogVisible = false
          this.fetchData()
        }
      }, res => {
        this.isDisabled = false
      })
    },
    selectData() {
      const selected = this.$refs.tree.getCheckedNodes()
      this.$refs.multipleTables.clearSelection()
      for (const items of selected) {
        for (let x = 0; x < this.waferList.length; x++) {
          if (this.waferList[x].runId === items.label) {
            this.$refs.multipleTables.toggleRowSelection(this.waferList[x])
          }
        }
      }
    },
    // 单据信息/Wafer信息切换
    navClick(index) {
      this.isActive = index
      this.selectTheadVisble = false
      this.selectfTheadVisble = false
    },
    // 单据信息/Wafer信息切换
    navTabClick(index) {
      this.isSetActive = index
    },
    handleSelectionChange(data) {
      this.selectList = data
    },
    handleSelectionChanges(data) {
      this.removeList = data
    },
    toggleSelectionRemove() {
      if (this.removeALL) {
        for (let y = 0; y < this.anotherLists.length; y++) {
          this.$refs.multipleTable.toggleRowSelection(this.anotherLists[y])
        }
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    toggleSelection() {
      if (this.selectAll) {
        this.chanceAll = false
        const list = []
        for (let i = 0; i < this.treeList.length; i++) {
          list[list.length] = {
            id: this.treeList[i].measure,
            label: this.treeList[i].measure
          }
          for (let y = 0; y < this.treeList[i].runList.length; y++) {
            for (let x = 0; x < this.waferList.length; x++) {
              if (this.waferList[x].runId === this.treeList[i].runList[y]) {
                this.$refs.multipleTables.toggleRowSelection(this.waferList[x])
              }
            }
          }
        }
        this.$refs.tree.setCheckedNodes(list)
      } else {
        this.$refs.multipleTables.clearSelection()
        this.$refs.tree.setCheckedKeys([])
      }
      // this.$refs.multipleTables.toggleRowSelection(row)
    },
    toggleSelectionReset() {
      if (this.chanceAll) {
        this.selectAll = false
        this.$refs.tree.setCheckedKeys([])
        this.$refs.multipleTables.clearSelection()
      }
    },
    openIsCheck() {
      if (this.anotherLists.length > 0) {
        this.checkVisible = true
        this.isCheckNuLL = true
        this.isCheckLevel = true
      } else {
        this.$message({
          type: 'error',
          message: '请先添加入库审核列表!'
        })
      }
    },
    tableRowClassName({ row, rowIndex }) {
      let flag = false
      for (const item of this.checkErrorList) {
        if (item - 1 === rowIndex) {
          flag = true
          break
        }
      }
      if (flag) {
        return 'set_green'
      }
    },
    clearCondition() {
      this.billType = ''
      this.sliceType = ''
      this.model = ''
      this.color = ''
      this.status = ''
      this.waferNo = ''
      this.code = ''
      this.type = ''
      this.creater = ''
      this.checker = ''
      this.beginDate = ''
      this.endDate = ''
      this.procucts = ''
      this.tpType = ''
      this.timeRadio = 0
      this.handleSearch()
    },
    // 单击单据信息
    handleCurrentChange(row) {
      if (row !== null) {
        this.rowInfo = row
        this.findWaferInfo()
      }
    },
    // 双击单据信息
    cellDblclick(row, column, cell, event) {
      this.rowInfo = row
      this.findWaferInfo()
      this.isActive = 1
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
    cloaseAndAdd() {
      this.innerVisible = false
      for (let x = 0; x < this.selectList.length; x++) {
        let flag = true
        for (let i = 0; i < this.anotherLists.length; i++) {
          if (this.selectList[x].id === this.anotherLists[i].id) {
            flag = false
            break
          }
        }
        if (flag) {
          this.anotherLists.push(this.selectList[x])
        }
      }
    },
    chanceList() {
      this.innerVisible = false
      this.selectList = []
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        code: this.code,
        waferNo: this.waferNo,
        billType: this.billType,
        sliceType: this.sliceType,
        model: this.model,
        color: this.color,
        taskModel: this.procucts,
        category: this.tpType,
        timeType: this.timeRadio === 0 ? 'new' : 'audit',
        status: this.status
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      findList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.anotherList = []
        this.listLoading = false
        if (this.list.length > 0) {
          this.$refs.listTabel.setCurrentRow(this.list[0])
          // this.handleCurrentChange(this.list[0])
        }
      })
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm() {
      console.log(this.isDisabled)
      if (this.isDisabled) {
        return
      }
      if (this.anotherLists.length === 0) {
        this.$message({
          type: 'error',
          message: '请先添加入库审核列表!'
        })
        return
      }
      this.isDisabled = true
      const datalist = []
      for (let i = 0; i < this.anotherLists.length; i++) {
        datalist.push(
          {
            status: 0,
            waferNo: this.anotherLists[i].code,
            tapeNo: this.anotherLists[i].tapeNo
          })
      }
      const params = {
        billType: this.modelType,
        code: this.codeNo,
        color: this.anotherLists[0].color,
        createTime: this.modelTime,
        creator: sessionStorage.getItem('User-Id'),
        details: datalist,
        model: this.anotherLists[0].model,
        remark: this.modelRemark,
        sliceType: this.ruType,
        band: this.anotherLists[0].band,
        classify: this.anotherLists[0].classify,
        category: this.anotherLists[0].category,
        craft: this.anotherLists[0].craft,
        fullBin: this.anotherLists[0].fullBin,
        isClean: this.isClean === 0 ? '是' : '否',
        quality: this.anotherLists[0].quality,
        size: this.anotherLists[0].size,
        taskModel: this.anotherLists[0].taskModel,
        status: 0
      }
      inserts(params).then(res => {
        if (res.code === 0) {
          if (res.data !== null && res.data !== '') {
            this.$message({
              type: 'success',
              message: '操作成功! 单号：' + this.codeNo + '重名，现已变更为新单号：' + res.data
            })
          } else {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
          this.addDialogVisible = false
          this.baofeiDialogVisible = false
          var _this = this
          setTimeout(function() {
            _this.isDisabled = false
          }, 1000)
          this.fetchData()
        }
      }, res => {
        this.isDisabled = false
      })
    },
    // 取消
    resetForm() {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.baofeiDialogVisible = false
      this.HandleDialogVisible = false
      this.checkReason = false
      this.printVisible = false
    },
    // 编辑
    handleEdit(row) {
      if (row.status === 0) {
        this.title = '修改'
      } else {
        this.title = '处理'
      }
      this.isDisabled = false
      this.editDialogVisible = true
      this.rowInfo = row
      this.codeNo = row.code
      this.modelType = row.billType
      this.ruType = row.sliceType
      this.products = row.taskModel
      this.zfp = row.quality
      this.isClean = row.isClean === '是' ? 0 : 1
      this.modelCreater = row.creatorName
      this.modelTime = row.createTime
      this.modelRemark = row.remark
      this.findWaferInfos()
    },
    // 编辑
    handleFind(row) {
      this.isDisabled = false
      this.findDialogVisible = true
      this.rowInfo = row
      this.codeNo = row.code
      this.modelType = row.billType
      this.ruType = row.sliceType
      this.products = row.taskModel
      this.zfp = row.quality
      this.isClean = row.isClean === '是' ? 0 : 1
      this.modelCreater = row.creatorName
      this.modelTime = row.createTime
      this.modelRemark = row.remark
      this.findWaferInfos()
    },
    // 编辑
    // handleEdit(row) {
    //   this.editDialogVisible = true
    //   this.rowInfo = row
    //   this.removeLists = []
    //   this.findWaferInfos()
    // },
    handleUpdateNum(index) {
      this.removeLists.push(this.anotherList1[index])
      this.anotherList1.splice(index, 1)
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该单据信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        wagerDeletes(row).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum = this.pageNum - 1
            }
            this.fetchData()
          }
        })
      })
    },
    changemodelType() {
      if (this.anotherLists.length > 0) {
        this.$confirm('切换数据单类型会清空入库明细列表，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.checkErrorList = []
          this.anotherLists = []
          this.checkstr = ''
          this.products = ''
          this.zfp = ''
        }, () => {
          if (this.modelType === 0) {
            this.modelType = 1
          } else {
            this.modelType = 0
          }
          this.checkErrorList = []
          this.checkstr = ''
        })
      }
    },
    changemodelTypes() {
      if (this.anotherLists.length > 0) {
        this.$confirm('切换入库片型会清空入库明细列表，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.checkErrorList = []
          this.anotherLists = []
          this.checkstr = ''
          this.products = ''
          this.zfp = ''
        }, () => {
          if (this.ruType === 0) {
            this.ruType = 1
          } else {
            this.ruType = 0
          }
          this.checkErrorList = []
          this.checkstr = ''
        })
      }
    },
    handelRow(row) {
      this.HandleDialogVisible = true
      this.rowInfo = row
      this.errorTotal = 0
      this.removeLists = []
      this.multipleSelection = []
      this.findWaferInfos()
    },
    showReason() {
      this.checkReason = true
    },
    findPrintList() {
      if (this.rowInfo !== null && this.rowInfo.id !== null) {
        const params = { code: this.rowInfo.code, sliceCount: this.rowInfo.sliceCount, binCount: this.rowInfo.chipCount, remark: this.rowInfo.remark, creatorName: this.rowInfo.creatorName, module: 'xpWareHous' }
        printLable(params).then(res => {
          this.$message({
            type: 'success',
            message: '已提交打印!'
          })
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择要打印的入库单!'
        })
      }
    },
    handleStrageups(index) {
      this.removeLists.push(this.anotherList1[index])
      this.anotherList1.splice(index, 1)
    },
    removeError() {
      const removei = []
      for (let i = 0; i < this.anotherList1.length; i++) {
        for (const remove of this.multipleSelection) {
          if (remove.id === this.anotherList1[i].id) {
            removei.push(i)
            this.removeLists.push(this.anotherList1[i])
          }
        }
      }
      // this.$refs.deleteref.clearSelection()
      // this.errorTotal = 0
      // for (const item of removei) {
      //   this.anotherList1.splice(item, 1)
      // }
    },
    handleSelectionChangeall(val) {
      this.multipleSelection = val
    },
    selectTrue(row) {
      this.errorTotal = 0
      for (let i = 0; i < this.anotherList1.length; i++) {
        if (this.anotherList1[i].isSelected) {
          this.errorTotal = this.errorTotal + 1
        }
      }
    },
    printDiv() {
      this.printDialogVisible = false
      this.$print(this.$refs.print)
    },
    importExcel() {
      let columnEn = ''
      let columnCn = ''
      if (this.rowInfo !== null && this.rowInfo.id !== null) {
        if (this.rowInfo.sliceType === 0) {
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
        window.open(process.env.BASE_API + '/xpWarehous/exportExcel?id=' + this.rowInfo.id + '&sliceType=' + this.rowInfo.sliceType + '&headerCn=' + columnCn + '&headerEn=' + columnEn, '_blank')
      } else {
        this.$message({
          type: 'error',
          message: '请选择要导出的入库单!'
        })
      }
    },
    setRK() {
      this.setDialogVisible = true
      this.isSetActive = 0
      this.binFind()
      this.fbFind()
    },
    binFind() {
      binFind().then(res => {
        this.binList = res.data
      })
    },
    fbFind() {
      fbFind().then(res => {
        this.fblist = res.data
      })
    },
    handleBinSave(row) {
      if (this.binModel === '') {
        this.$message({
          type: 'error',
          message: '请选择型号!'
        })
        return
      }
      if (this.binNum === '') {
        this.$message({
          type: 'error',
          message: '请输入理论颗粒!'
        })
        return
      }
      const param = {
        model: this.binModel,
        particlesNo: this.binNum
      }
      binInsert(param).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.binModel = ''
          this.binNum = ''
          this.binFind()
        }
      })
    },
    handleBinEdit(row) {
      const param = {
        id: row.id,
        model: row.model,
        particlesNo: row.particlesNo
      }
      binUpdate(param).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.setRK()
        }
      })
    },
    // 删除按钮
    handleBinDelete(row) {
      this.$confirm('此操作将永久删除当前信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        binDeletes(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.setRK()
          }
        })
      })
    },
    addItem() {
      const index = this.fblist.length + 1
      this.fblist.push({
        band: '波段' + index,
        maxval: '',
        minval: ''
      })
    },
    deleteItem(index) {
      this.fblist.splice(index, 1)
    },
    saveFB() {
      let flag = false
      let flag1 = false
      for (const item of this.fblist) {
        if (item.minval === '' || item.maxval === '') {
          flag = true
          break
        }
        if (parseInt(item.minval) >= parseInt(item.maxval)) {
          flag1 = true
          break
        }
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '最大值或最小值不能为空!'
        })
        return
      }
      if (flag1) {
        this.$message({
          type: 'error',
          message: '最大值必须大于最小值!'
        })
        return
      }
      fbInsert(this.fblist).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.setDialogVisible = false
        }
      })
    }
  }
}

