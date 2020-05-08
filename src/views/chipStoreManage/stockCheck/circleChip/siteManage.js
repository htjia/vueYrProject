
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findYpQuery, updateYpCheck, wavelength, brightness, voltage, concentration, comprehensive } from '@/api/chipStoreManage/stockCheck'
import { productList } from '@/api/fqcAndOqc/chipInStorage'
import { findSubstrateMeasureList } from '@/api/chipBasicInfoManage/grindProcessInfo'
import { getExceptionCode } from '@/api/chipManage/rearSiteManage/visualInspectionInfo'
import { findGYlList } from '@/api/pcChipCasting/pcChipCasting'
import { storehouseTypeList, placeOriginList } from '@/api/chipStoreManage/chipBasicSetting'
import { xpWarehousLabel } from '@/api/chipManage/warehousingSendManage/warehousingLabelManage'
import { findFieldSelectList } from '@/api/chipStoreManage/chipPutInStorage'
import { findArkList } from '@/api/chipStoreManage/stockControl'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      setRemarkDialogVisible: false,
      paramsSearchDialog: false,
      activeTabIndex: 0,
      totalSlice: 0,
      sliceCount: 0,
      totalParticle: 0,
      timeRadio: 1,
      waferTotalNum: 24,
      remarkForm: {
        waferId: '',
        remark: ''
      },
      searchKey: {
        bh: '',
        xch: '',
        waferID: '',
        TapeNo: '',
        cpxh: '',
        wycc: '',
        gw: '',
        sfqx: '',
        pzwg: '',
        gy: '',
        rklx: '',
        cd: '',
        bq: '',
        kczt: '',
        bcdm: '',
        lddm: '',
        dydm: '',
        jzddm: '',
        zhpddj: '',
        ymhd: '',
        csdl: '',
        gyld: '',
        WLDMINmin: '',
        WLDMINmax: '',
        WLDMAXmin: '',
        WLDMAXmax: '',
        WLDAVGmin: '',
        WLDAVGmax: '',
        WLDSTDmin: '',
        WLDSTDmax: '',
        WLPMINmin: '',
        WLPMINmax: '',
        WLPMAXmin: '',
        WLPMAXmax: '',
        WLPAVGmin: '',
        WLPAVGmax: '',
        WLPSTDmin: '',
        WLPSTDmax: '',
        WLCMINmin: '',
        WLCMINmax: '',
        WLCMAXmin: '',
        WLCMAXmax: '',
        WLCAVGmin: '',
        WLCAVGmax: '',
        WLCSTDmin: '',
        WLCSTDmax: '',
        LOP1MINmin: '',
        LOP1MINmax: '',
        LOP1MAXmin: '',
        LOP1MAXmax: '',
        LOP1AVGmin: '',
        LOP1AVGmax: '',
        LOP1STDmin: '',
        LOP1STDmax: '',
        VF1MINmin: '',
        VF1MINmax: '',
        VF1MAXmin: '',
        VF1MAXmax: '',
        VF1AVGmin: '',
        VF1AVGmax: '',
        VF1STDmin: '',
        VF1STDmax: '',
        VF2MINmin: '',
        VF2MINmax: '',
        VF2MAXmin: '',
        VF2MAXmax: '',
        VF2AVGmin: '',
        VF2AVGmax: '',
        VF2STDmin: '',
        VF2STDmax: '',
        VF3MINmin: '',
        VF3MINmax: '',
        VF3MAXmin: '',
        VF3MAXmax: '',
        VF3AVGmin: '',
        VF3AVGmax: '',
        VF3STDmin: '',
        VF3STDmax: '',
        VF4MINmin: '',
        VF4MINmax: '',
        VF4MAXmin: '',
        VF4MAXmax: '',
        VF4AVGmin: '',
        VF4AVGmax: '',
        VF4STDmin: '',
        VF4STDmax: '',
        IRMINmin: '',
        IRMINmax: '',
        IRMAXmin: '',
        IRMAXmax: '',
        IRAVGmin: '',
        IRAVGmax: '',
        IRSTDmin: '',
        IRSTDmax: '',
        VZ1MINmin: '',
        VZ1MINmax: '',
        VZ1MAXmin: '',
        VZ1MAXmax: '',
        VZ1AVGmin: '',
        VZ1AVGmax: '',
        VZ1STDmin: '',
        VZ1STDmax: '',
        HW1JZOperator: '>',
        zhlvOperator: '>',
        vf1Operator: '>',
        vf2Operator: '>',
        vf3Operator: '>',
        vf4Operator: '>',
        IROperator: '>',
        dvfOperator: '>',
        wldOperator: '>',
        wlpOperator: '>',
        wlcOperator: '>',
        vzOperator: '>',
        ivOperator: '>',
        esdIraOperator: '>',
        wld5nmOperator: '>',
        wlp5nmOperator: '>',
        HW1JZ: '',
        zhlv: '',
        vf1lv: '',
        vf2lv: '',
        vf3lv: '',
        vf4lv: '',
        IRlv: '',
        DVFlv: '',
        WLDlv: '',
        WLPlv: '',
        WLClv: '',
        VZlv: '',
        IVlv: '',
        ESDIRAlv: '',
        Wld5nmlv: '',
        Wlp5nmlv: '',
        ESDcsdyzxOperator: '>',
        ESDcsdyzx: '',
        ESDcsdyfxOperator: '>',
        ESDcsdyfx: ''
      },
      operatorOptions: [
        { id: '>', name: '>' },
        { id: '<', name: '<' },
        { id: '>=', name: '≥' },
        { id: '<=', name: '≤' },
        { id: '=', name: '=' },
        { id: '!=', name: '≠' }
      ],
      theadOptions: [
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
        { thName: '退库客户', thKey: 'retreatCustomer', width: 100 },
        { thName: '退库时间', thKey: 'retreatTime', width: 100 },
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
      ],
      theadParamsOptions: [
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
      ],
      selectedRunRow: {},
      list: [],
      cabinetList: [],
      labelList: [],
      reservedFields: [],
      wavelengthList: [],
      brightnessList: [],
      voltageList: [],
      concentrationList: [],
      comprehensiveList: [],
      productModelOptions: [],
      modelList: [],
      verifyList: [],
      substrateMeasureList: [],
      exceptionCode: [],
      putInTypeList: [],
      dataOptions: [],
      placeOriginList: [],
      storeOptions: [
        { id: 0, name: '正常' },
        { id: 1, name: '备库' },
        { id: 2, name: '出库' },
        { id: 3, name: '退回产线' },
        { id: 4, name: '返工' },
        { id: 5, name: '待查' }
      ],
      gyList: [],
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
      clearOptions: [
        {
          id: 0,
          name: '是'
        },
        {
          id: 1,
          name: '否'
        }
      ],
      currentId: ''
    }
  },
  mounted() {
    this.handleSearch()
    this.findCabinetListFun()
    this.findSubstrateMeasureListFun()
    this.productList()
    this.getExceptionCodeFun()
    this.findGYlList()
    this.findPlaceOriginList()
    this.getStorehouseTypeList()
    this.xpWarehousLabel()
    this.findReservedFieldList()
  },
  methods: {
    // 柜位查询
    findCabinetListFun() {
      findArkList().then(res => {
        this.cabinetList = res.data
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
    xpWarehousLabel() {
      const params = {
        type: this.typeas
      }
      xpWarehousLabel(params).then(res => {
        this.labelList = res.data
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
      })
    },
    // 波长代码
    findWavelengthList() {
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      wavelength(params).then(res => {
        this.wavelengthList = res.data.list
      })
    },
    // 亮度代码
    findBrightnessList() {
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      brightness(params).then(res => {
        this.brightnessList = res.data.list
      })
    },
    // 电压代码
    findVoltageList() {
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      voltage(params).then(res => {
        this.voltageList = res.data.list
      })
    },
    // 集中度代码
    findConcentrationList() {
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      concentration(params).then(res => {
        this.concentrationList = res.data.list
      })
    },
    // 综合等级代码
    findComprehensiveList() {
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      comprehensive(params).then(res => {
        this.comprehensiveList = res.data.list
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
    // 工艺
    findGYlList() {
      findGYlList().then(res => {
        this.gyList = res.data.list
      })
    },
    // 品质等级
    getExceptionCodeFun() {
      getExceptionCode({}).then(res => {
        this.exceptionCode = res.data
        this.exceptionCode.splice(0, 0, { label: 'A', options: [{ id: 0, code: 'A', name: '正品' }] })
      })
    },
    // 产品型号
    productList() {
      productList().then(res => {
        this.productModelOptions = res.data
      })
    },
    // 参数查询
    paramsSearch() {
      this.findWavelengthList()
      this.findBrightnessList()
      this.findVoltageList()
      this.findConcentrationList()
      this.findComprehensiveList()
      this.paramsSearchDialog = true
    },
    // 衬底尺寸
    findSubstrateMeasureListFun() {
      findSubstrateMeasureList({}).then(res => {
        this.substrateMeasureList = res.data
      })
    },
    clearSearch() {
      this.searchKey.bh = ''
      this.searchKey.xch = ''
      this.searchKey.waferID = ''
      this.searchKey.TapeNo = ''
      this.searchKey.cpxh = ''
      this.searchKey.wycc = ''
      this.searchKey.gw = ''
      this.searchKey.sfqx = ''
      this.searchKey.pzwg = ''
      this.searchKey.gy = ''
      this.searchKey.rklx = ''
      this.searchKey.cd = ''
      this.searchKey.bq = ''
      this.searchKey.kczt = ''
      this.searchKey.bcdm = ''
      this.searchKey.lddm = ''
      this.searchKey.dydm = ''
      this.searchKey.jzddm = ''
      this.searchKey.zhpddj = ''
      this.searchKey.ymhd = ''
      this.searchKey.csdl = ''
      this.searchKey.gyld = ''
      this.searchKey.WLDMINmin = ''
      this.searchKey.WLDMINmax = ''
      this.searchKey.WLDMAXmin = ''
      this.searchKey.WLDMAXmax = ''
      this.searchKey.WLDAVGmin = ''
      this.searchKey.WLDAVGmax = ''
      this.searchKey.WLDSTDmin = ''
      this.searchKey.WLDSTDmax = ''
      this.searchKey.WLPMINmin = ''
      this.searchKey.WLPMINmax = ''
      this.searchKey.WLPMAXmin = ''
      this.searchKey.WLPMAXmax = ''
      this.searchKey.WLPAVGmin = ''
      this.searchKey.WLPAVGmax = ''
      this.searchKey.WLPSTDmin = ''
      this.searchKey.WLPSTDmax = ''
      this.searchKey.WLCMINmin = ''
      this.searchKey.WLCMINmax = ''
      this.searchKey.WLCMAXmin = ''
      this.searchKey.WLCMAXmax = ''
      this.searchKey.WLCAVGmin = ''
      this.searchKey.WLCAVGmax = ''
      this.searchKey.WLCSTDmin = ''
      this.searchKey.WLCSTDmax = ''
      this.searchKey.LOP1MINmin = ''
      this.searchKey.LOP1MINmax = ''
      this.searchKey.LOP1MAXmin = ''
      this.searchKey.LOP1MAXmax = ''
      this.searchKey.LOP1AVGmin = ''
      this.searchKey.LOP1AVGmax = ''
      this.searchKey.LOP1STDmin = ''
      this.searchKey.LOP1STDmax = ''
      this.searchKey.VF1MINmin = ''
      this.searchKey.VF1MINmax = ''
      this.searchKey.VF1MAXmin = ''
      this.searchKey.VF1MAXmax = ''
      this.searchKey.VF1AVGmin = ''
      this.searchKey.VF1AVGmax = ''
      this.searchKey.VF1STDmin = ''
      this.searchKey.VF1STDmax = ''
      this.searchKey.VF2MINmin = ''
      this.searchKey.VF2MINmax = ''
      this.searchKey.VF2MAXmin = ''
      this.searchKey.VF2MAXmax = ''
      this.searchKey.VF2AVGmin = ''
      this.searchKey.VF2AVGmax = ''
      this.searchKey.VF2STDmin = ''
      this.searchKey.VF2STDmax = ''
      this.searchKey.VF3MINmin = ''
      this.searchKey.VF3MINmax = ''
      this.searchKey.VF3MAXmin = ''
      this.searchKey.VF3MAXmax = ''
      this.searchKey.VF3AVGmin = ''
      this.searchKey.VF3AVGmax = ''
      this.searchKey.VF3STDmin = ''
      this.searchKey.VF3STDmax = ''
      this.searchKey.VF4MINmin = ''
      this.searchKey.VF4MINmax = ''
      this.searchKey.VF4MAXmin = ''
      this.searchKey.VF4MAXmax = ''
      this.searchKey.VF4AVGmin = ''
      this.searchKey.VF4AVGmax = ''
      this.searchKey.VF4STDmin = ''
      this.searchKey.VF4STDmax = ''
      this.searchKey.IRMINmin = ''
      this.searchKey.IRMINmax = ''
      this.searchKey.IRMAXmin = ''
      this.searchKey.IRMAXmax = ''
      this.searchKey.IRAVGmin = ''
      this.searchKey.IRAVGmax = ''
      this.searchKey.IRSTDmin = ''
      this.searchKey.IRSTDmax = ''
      this.searchKey.VZ1MINmin = ''
      this.searchKey.VZ1MINmax = ''
      this.searchKey.VZ1MAXmin = ''
      this.searchKey.VZ1MAXmax = ''
      this.searchKey.VZ1AVGmin = ''
      this.searchKey.VZ1AVGmax = ''
      this.searchKey.VZ1STDmin = ''
      this.searchKey.VZ1STDmax = ''
      this.searchKey.HW1JZOperator = '<'
      this.searchKey.zhlvOperator = '<'
      this.searchKey.vf1Operator = '<'
      this.searchKey.vf2Operator = '<'
      this.searchKey.vf3Operator = '<'
      this.searchKey.vf4Operator = '<'
      this.searchKey.IROperator = '<'
      this.searchKey.dvfOperator = '<'
      this.searchKey.wldOperator = '<'
      this.searchKey.wlpOperator = '<'
      this.searchKey.wlcOperator = '<'
      this.searchKey.vzOperator = '<'
      this.searchKey.ivOperator = '<'
      this.searchKey.esdIraOperator = '<'
      this.searchKey.wld5nmOperator = '<'
      this.searchKey.wlp5nmOperator = '<'
      this.searchKey.HW1JZ = ''
      this.searchKey.zhlv = ''
      this.searchKey.vf1lv = ''
      this.searchKey.vf2lv = ''
      this.searchKey.vf3lv = ''
      this.searchKey.vf4lv = ''
      this.searchKey.IRlv = ''
      this.searchKey.DVFlv = ''
      this.searchKey.WLDlv = ''
      this.searchKey.WLPlv = ''
      this.searchKey.WLClv = ''
      this.searchKey.VZlv = ''
      this.searchKey.IVlv = ''
      this.searchKey.ESDIRAlv = ''
      this.searchKey.Wld5nmlv = ''
      this.searchKey.Wlp5nmlv = ''
      this.searchKey.ESDcsdyzxOperator = '>'
      this.searchKey.ESDcsdyzx = ''
      this.searchKey.ESDcsdyfxOperator = '>'
      this.searchKey.ESDcsdyfx = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearchParams()
    },
    // 单击Run信息
    rowClick(row) {
      this.selectedRunRow = row
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.handleSearch()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.handleSearch()
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
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      let headerCn = '包号,项次号'
      let headerEn = 'boxNo,sequence'
      this.theadOptions.map(item => {
        headerCn = headerCn + ',' + item.thName
        headerEn = headerEn + ',' + item.thKey
      })
      this.reservedFields.map(item => {
        headerCn = headerCn + ',' + item.name
        headerEn = headerEn + ',' + item.code
      })
      this.theadParamsOptions.map(item => {
        headerCn = headerCn + ',' + item.thName
        headerEn = headerEn + ',' + item.thKey
      })
      const exportParams = `?startTime=${startTime}&endTime=${endTime}&timeType=${this.timeRadio}&boxNo=${this.searchKey.bh}&sequence=${this.searchKey.xch}&code=${this.searchKey.waferID}&tapeNo=${this.searchKey.TapeNo}&taskModel=${this.searchKey.cpxh}&measure=${this.searchKey.wycc}&arkName=${this.searchKey.gw}&isClean=${this.searchKey.sfqx}&classify=${this.searchKey.pzwg}&craft=${this.searchKey.gy}&storeType=${this.searchKey.rklx}&product=${this.searchKey.cd}&label=${this.searchKey.bq}&status=${this.searchKey.kczt}&waveCode=${this.searchKey.bcdm}&brightCode=${this.searchKey.lddm}&concentCode=${this.searchKey.jzddm}&compreCode=${this.searchKey.zhpddj}&voltageCode=${this.searchKey.dydm}&grind=${this.searchKey.ymhd}&electricity=${this.searchKey.csdl}&normaCode=${this.searchKey.gyld}&startWldMin=${this.searchKey.WLDMINmin}&endWldMin=${this.searchKey.WLDMINmax}&startWldMax=${this.searchKey.WLDMAXmin}&endWldMax=${this.searchKey.WLDMAXmax}&startWldAvg=${this.searchKey.WLDAVGmin}&endWldAvg=${this.searchKey.WLDAVGmax}&startWldStd=${this.searchKey.WLDSTDmin}&endWldStd=${this.searchKey.WLDSTDmax}&startWlpMin=${this.searchKey.WLPMINmin}&endWlpMin=${this.searchKey.WLPMINmax}&startWlpMax=${this.searchKey.WLPMAXmin}&endWlpMax=${this.searchKey.WLPMAXmax}&startWlpAvg=${this.searchKey.WLPAVGmin}&endWlpAvg=${this.searchKey.WLPAVGmax}&startWlpStd=${this.searchKey.WLPSTDmin}&endWlpStd=${this.searchKey.WLPSTDmax}&startWlcMin=${this.searchKey.WLCMINmin}&endWlcMin=${this.searchKey.WLCMINmax}&startWlcMax=${this.searchKey.WLCMAXmin}&endWlcMax=${this.searchKey.WLCMAXmax}&startWlcAvg=${this.searchKey.WLCAVGmin}&endWlcAvg=${this.searchKey.WLCAVGmax}&startWlcStd=${this.searchKey.WLCSTDmin}&endWlcStd=${this.searchKey.WLCSTDmax}&startLopMin=${this.searchKey.LOP1MINmin}&endLopMin=${this.searchKey.LOP1MINmax}&startLopMax=${this.searchKey.LOP1MAXmin}&endLopMax=${this.searchKey.LOP1MAXmax}&startLopAvg=${this.searchKey.LOP1AVGmin}&endLopAvg=${this.searchKey.LOP1AVGmax}&startLopStd=${this.searchKey.LOP1STDmin}&endLopStd=${this.searchKey.LOP1STDmax}&startVf1Min=${this.searchKey.VF1MINmin}&endVf1Min=${this.searchKey.VF1MINmax}&startVf1Max=${this.searchKey.VF1MAXmin}&endVf1Max=${this.searchKey.VF1MAXmax}&startVf1Avg=${this.searchKey.VF1AVGmin}&endVf1Avg=${this.searchKey.VF1AVGmax}&startVf1Std=${this.searchKey.VF1STDmin}&endVf1Std=${this.searchKey.VF1STDmax}&startVf2Min=${this.searchKey.VF2MINmin}&endVf2Min=${this.searchKey.VF2MINmax}&startVf2Max=${this.searchKey.VF2MAXmin}&endVf2Max=${this.searchKey.VF2MAXmax}&startVf2Avg=${this.searchKey.VF2AVGmin}&endVf2Avg=${this.searchKey.VF2AVGmax}&startVf2Std=${this.searchKey.VF2STDmin}&endVf2Std=${this.searchKey.VF2STDmax}&startVf3Min=${this.searchKey.VF3MINmin}&endVf3Min=${this.searchKey.VF3MINmax}&startVf3Max=${this.searchKey.VF3MAXmin}&endVf3Max=${this.searchKey.VF3MAXmax}&startVf3Avg=${this.searchKey.VF3AVGmin}&endVf3Avg=${this.searchKey.VF3AVGmax}&startVf3Std=${this.searchKey.VF3STDmin}&endVf3Std=${this.searchKey.VF3STDmax}&startVf4Min=${this.searchKey.VF4MINmin}&endVf4Min=${this.searchKey.VF4MINmax}&startVf4Max=${this.searchKey.VF4MAXmin}&endVf4Max=${this.searchKey.VF4MAXmax}&startVf4Avg=${this.searchKey.VF4AVGmin}&endVf4Avg=${this.searchKey.VF4AVGmax}&startVf4Std=${this.searchKey.VF4STDmin}&endVf4Std=${this.searchKey.VF4STDmax}&startIrMin=${this.searchKey.IRMINmin}&endIrMin=${this.searchKey.IRMINmax}&startIrMax=${this.searchKey.IRMAXmin}&endIrMax=${this.searchKey.IRMAXmax}&startIrAvg=${this.searchKey.IRAVGmin}&endIrAvg=${this.searchKey.IRAVGmax}&startIrStd=${this.searchKey.IRSTDmin}&endIrStd=${this.searchKey.IRSTDmax}&startVzMin=${this.searchKey.VZ1MINmin}&endVzMin=${this.searchKey.VZ1MINmax}&startVzMax=${this.searchKey.VZ1MAXmin}&endVzMax=${this.searchKey.VZ1MAXmax}&startVzAvg=${this.searchKey.VZ1AVGmin}&endVzAvg=${this.searchKey.VZ1AVGmax}&startVzStd=${this.searchKey.VZ1STDmin}&endVzStd=${this.searchKey.VZ1STDmax}&hwOper=${this.searchKey.HW1JZOperator}&hwAvg=${this.searchKey.HW1JZ}&compreOper=${this.searchKey.zhlvOperator}&compreYield=${this.searchKey.zhlv}&vf1Oper=${this.searchKey.vf1Operator}&vf1Yield=${this.searchKey.vf1lv}&vf2Oper=${this.searchKey.vf2Operator}&vf2Yield=${this.searchKey.vf2lv}&vf3Oper=${this.searchKey.vf3Operator}&vf3Yield=${this.searchKey.vf3lv}&vf4Oper=${this.searchKey.vf4Operator}&vf4Yield=${this.searchKey.vf4lv}&irOper=${this.searchKey.IROperator}&irYield=${this.searchKey.IRlv}&dvfOper=${this.searchKey.dvfOperator}&dvfYield=${this.searchKey.DVFlv}&wldOper=${this.searchKey.wldOperator}&wldYield=${this.searchKey.WLDlv}&wlpOper=${this.searchKey.wlpOperator}&wlpYield=${this.searchKey.WLPlv}&wlcOper=${this.searchKey.wlcOperator}&wlcYield=${this.searchKey.WLClv}&vzOper=${this.searchKey.vzOperator}&vzYield=${this.searchKey.VZlv}&ivOper=${this.searchKey.ivOperator}&ivYield=${this.searchKey.IVlv}&irEsdOper=${this.searchKey.esdIraOperator}&irEsdYield=${this.searchKey.ESDIRAlv}&wldNmOper=${this.searchKey.wld5nmOperator}&wldNm5Yield=${this.searchKey.Wld5nmlv}&wlpNmOper=${this.searchKey.wlp5nmOperator}&wlpNm5Yield=${this.searchKey.Wlp5nmlv}&headerCn=${headerCn}&headerEn=${headerEn}`
      console.log(exportParams)
      window.open(process.env.BASE_API + '/xpStorehouse/findYpExportQuery' + exportParams)
    },
    handleSearchBth(index) {
      this.pageNum = 1
      this.handleSearch(index)
    },
    // 参数查询
    handleSearchParams() {
      this.pageNum = 1
      this.paramsSearchDialog = false
      this.handleSearch()
    },
    handleSearch() {
      this.listLoading = true
      const requestParams = {
        boxNo: this.searchKey.bh,
        sequence: this.searchKey.xch,
        code: this.searchKey.waferID,
        tapeNo: this.searchKey.TapeNo,
        taskModel: this.searchKey.cpxh,
        measure: this.searchKey.wycc,
        arkName: this.searchKey.gw,
        isClean: this.searchKey.sfqx,
        classify: this.searchKey.pzwg,
        craft: this.searchKey.gy,
        storeType: this.searchKey.rklx,
        product: this.searchKey.cd,
        label: this.searchKey.bq,
        status: this.searchKey.kczt,
        timeType: this.timeRadio,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate),
        waveCode: this.searchKey.bcdm,
        brightCode: this.searchKey.lddm,
        concentCode: this.searchKey.jzddm,
        compreCode: this.searchKey.zhpddj,
        voltageCode: this.searchKey.dydm,
        grind: this.searchKey.ymhd,
        electricity: this.searchKey.csdl,
        normaCode: this.searchKey.gyld,
        startWldMin: this.searchKey.WLDMINmin,
        endWldMin: this.searchKey.WLDMINmax,
        startWldMax: this.searchKey.WLDMAXmin,
        endWldMax: this.searchKey.WLDMAXmax,
        startWldAvg: this.searchKey.WLDAVGmin,
        endWldAvg: this.searchKey.WLDAVGmax,
        startWldStd: this.searchKey.WLDSTDmin,
        endWldStd: this.searchKey.WLDSTDmax,
        startWlpMin: this.searchKey.WLPMINmin,
        endWlpMin: this.searchKey.WLPMINmax,
        startWlpMax: this.searchKey.WLPMAXmin,
        endWlpMax: this.searchKey.WLPMAXmax,
        startWlpAvg: this.searchKey.WLPAVGmin,
        endWlpAvg: this.searchKey.WLPAVGmax,
        startWlpStd: this.searchKey.WLPSTDmin,
        endWlpStd: this.searchKey.WLPSTDmax,
        startWlcMin: this.searchKey.WLCMINmin,
        endWlcMin: this.searchKey.WLCMINmax,
        startWlcMax: this.searchKey.WLCMAXmin,
        endWlcMax: this.searchKey.WLCMAXmax,
        startWlcAvg: this.searchKey.WLCAVGmin,
        endWlcAvg: this.searchKey.WLCAVGmax,
        startWlcStd: this.searchKey.WLCSTDmin,
        endWlcStd: this.searchKey.WLCSTDmax,
        startLopMin: this.searchKey.LOP1MINmin,
        endLopMin: this.searchKey.LOP1MINmax,
        startLopMax: this.searchKey.LOP1MAXmin,
        endLopMax: this.searchKey.LOP1MAXmax,
        startLopAvg: this.searchKey.LOP1AVGmin,
        endLopAvg: this.searchKey.LOP1AVGmax,
        startLopStd: this.searchKey.LOP1STDmin,
        endLopStd: this.searchKey.LOP1STDmax,
        startVf1Min: this.searchKey.VF1MINmin,
        endVf1Min: this.searchKey.VF1MINmax,
        startVf1Max: this.searchKey.VF1MAXmin,
        endVf1Max: this.searchKey.VF1MAXmax,
        startVf1Avg: this.searchKey.VF1AVGmin,
        endVf1Avg: this.searchKey.VF1AVGmax,
        startVf1Std: this.searchKey.VF1STDmin,
        endVf1Std: this.searchKey.VF1STDmax,
        startVf2Min: this.searchKey.VF2MINmin,
        endVf2Min: this.searchKey.VF2MINmax,
        startVf2Max: this.searchKey.VF2MAXmin,
        endVf2Max: this.searchKey.VF2MAXmax,
        startVf2Avg: this.searchKey.VF2AVGmin,
        endVf2Avg: this.searchKey.VF2AVGmax,
        startVf2Std: this.searchKey.VF2STDmin,
        endVf2Std: this.searchKey.VF2STDmax,
        startVf3Min: this.searchKey.VF3MINmin,
        endVf3Min: this.searchKey.VF3MINmax,
        startVf3Max: this.searchKey.VF3MAXmin,
        endVf3Max: this.searchKey.VF3MAXmax,
        startVf3Avg: this.searchKey.VF3AVGmin,
        endVf3Avg: this.searchKey.VF3AVGmax,
        startVf3Std: this.searchKey.VF3STDmin,
        endVf3Std: this.searchKey.VF3STDmax,
        startVf4Min: this.searchKey.VF4MINmin,
        endVf4Min: this.searchKey.VF4MINmax,
        startVf4Max: this.searchKey.VF4MAXmin,
        endVf4Max: this.searchKey.VF4MAXmax,
        startVf4Avg: this.searchKey.VF4AVGmin,
        endVf4Avg: this.searchKey.VF4AVGmax,
        startVf4Std: this.searchKey.VF4STDmin,
        endVf4Std: this.searchKey.VF4STDmax,
        startIrMin: this.searchKey.IRMINmin,
        endIrMin: this.searchKey.IRMINmax,
        startIrMax: this.searchKey.IRMAXmin,
        endIrMax: this.searchKey.IRMAXmax,
        startIrAvg: this.searchKey.IRAVGmin,
        endIrAvg: this.searchKey.IRAVGmax,
        startIrStd: this.searchKey.IRSTDmin,
        endIrStd: this.searchKey.IRSTDmax,
        startVzMin: this.searchKey.VZ1MINmin,
        endVzMin: this.searchKey.VZ1MINmax,
        startVzMax: this.searchKey.VZ1MAXmin,
        endVzMax: this.searchKey.VZ1MAXmax,
        startVzAvg: this.searchKey.VZ1AVGmin,
        endVzAvg: this.searchKey.VZ1AVGmax,
        startVzStd: this.searchKey.VZ1STDmin,
        endVzStd: this.searchKey.VZ1STDmax,
        hwOper: this.searchKey.HW1JZOperator,
        hwAvg: this.searchKey.HW1JZ,
        compreOper: this.searchKey.zhlvOperator,
        compreYield: this.searchKey.zhlv,
        vf1Oper: this.searchKey.vf1Operator,
        vf1Yield: this.searchKey.vf1lv,
        vf2Oper: this.searchKey.vf2Operator,
        vf2Yield: this.searchKey.vf2lv,
        vf3Oper: this.searchKey.vf3Operator,
        vf3Yield: this.searchKey.vf3lv,
        vf4Oper: this.searchKey.vf4Operator,
        vf4Yield: this.searchKey.vf4lv,
        irOper: this.searchKey.IROperator,
        irYield: this.searchKey.IRlv,
        dvfOper: this.searchKey.dvfOperator,
        dvfYield: this.searchKey.DVFlv,
        wldOper: this.searchKey.wldOperator,
        wldYield: this.searchKey.WLDlv,
        wlpOper: this.searchKey.wlpOperator,
        wlpYield: this.searchKey.WLPlv,
        wlcOper: this.searchKey.wlcOperator,
        wlcYield: this.searchKey.WLClv,
        vzOper: this.searchKey.vzOperator,
        vzYield: this.searchKey.VZlv,
        ivOper: this.searchKey.ivOperator,
        ivYield: this.searchKey.IVlv,
        irEsdOper: this.searchKey.esdIraOperator,
        irEsdYield: this.searchKey.ESDIRAlv,
        wldNmOper: this.searchKey.wld5nmOperator,
        wldNm5Yield: this.searchKey.Wld5nmlv,
        wlpNmOper: this.searchKey.wlp5nmOperator,
        wlpNm5Yield: this.searchKey.Wlp5nmlv,
        esdElecOper: this.searchKey.ESDcsdyzxOperator,
        esdElec: this.searchKey.ESDcsdyzx,
        esdElecReverseOper: this.searchKey.ESDcsdyfxOperator,
        esdElecReverse: this.searchKey.ESDcsdyfx,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      findYpQuery(requestParams).then(res => {
        this.sliceCount = res.data.sliceCount
        res.data.pageInfo.list.map(item => {
          let statusText = ''
          switch (item.status) {
            case 0 : statusText = '正常'
              break
            case 1 : statusText = '备库'
              break
            case 2 : statusText = '出库'
              break
            case 3 : statusText = '退回产线'
              break
            case 4 : statusText = '返工'
              break
            case 5 : statusText = '待查'
              break
          }
          item.status = statusText
        })
        this.list = res.data.pageInfo.list
        this.totalPage = res.data.pageInfo.total
        this.listLoading = false
        this.selectedRunRow = this.list[0]
        setTimeout(() => {
          this.$refs.runTable.setCurrentRow(this.list[0])
        }, 200)
      })
    },
    // 关闭
    handleClose() {
      this.remarkForm.remark = ''
    },
    // 待查
    handleInvestigated() {
      if (this.selectedRunRow.status === '正常' || this.selectedRunRow.status === '待查') {
        const message = this.selectedRunRow.status === '正常' ? '是否确认修改当前wafer状态为待查？' : '是否确认恢复当前wafer状态为在库？'
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: this.selectedRunRow.id,
            status: this.selectedRunRow.status === '正常' ? 5 : 0
          }
          updateYpCheck(params).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.handleSearch()
          })
        })
      }
    }
  }
}

