
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findRunInfo, decide, matfindList, substrateFindList, findWafer, findField, query, calculate, mandatory, undoCalculate, undoDecide, findColorList, findModelList, findCowTable } from '@/api/extensionManage/synthesizeJudgment/synthesizeJudgment'
const furnaceList = [
  {
    thName: 'COW数据',
    thKey: 'isCow',
    width: 100
  },
  {
    thName: '判定结果',
    thKey: 'isDecide',
    width: 100
  },
  {
    thName: '状态',
    thKey: 'status',
    width: 100
  },
  {
    thName: 'RunID',
    thKey: 'runId',
    width: 120
  },
  {
    thName: 'Recipe Name',
    thKey: 'recipeName',
    width: 120
  },
  {
    thName: '铝氮ID',
    thKey: 'alnId',
    width: 120
  },
  {
    thName: 'PM炉次',
    thKey: 'pm',
    width: 90
  },
  {
    thName: '设备事件',
    thKey: 'equipment',
    width: 100
  },
  {
    thName: '工艺事件',
    thKey: 'craft',
    width: 100
  },
  {
    thName: '结论',
    thKey: 'reasult',
    width: 100
  },
  {
    thName: '结构类型',
    thKey: 'structureType',
    width: 90
  },
  {
    thName: '衬底类型',
    thKey: 'substrateType',
    width: 90
  },
  {
    thName: '生产类型',
    thKey: 'produceType',
    width: 90
  },
  {
    thName: '机台',
    thKey: 'machine',
    width: 80
  },
  {
    thName: '炉次',
    thKey: 'stove',
    width: 80
  },
  {
    thName: '目标波长',
    thKey: 'wavelength',
    width: 90
  },
  {
    thName: 'Yield_5nm',
    thKey: 'yield5',
    width: 100
  },
  {
    thName: 'Yield_8nm',
    thKey: 'yield8',
    width: 100
  },
  {
    thName: 'Platter_No',
    thKey: 'platterNo',
    width: 110
  },
  {
    thName: '使用次数',
    thKey: 'platterTotal',
    width: 90
  },
  {
    thName: '开始时间',
    thKey: 'startTime',
    width: 150
  },
  {
    thName: '结束时间',
    thKey: 'endTime',
    width: 150
  },
  {
    thName: '待机时间(m)',
    thKey: 'standbyTime',
    width: 100
  },
  {
    thName: '运行时间(h:m)',
    thKey: 'runTime',
    width: 100
  },
  {
    thName: '放片人',
    thKey: 'creator',
    width: 100
  },
  {
    thName: '取片人',
    thKey: 'taker',
    width: 100
  },
  {
    thName: '调整人',
    thKey: 'adjusts',
    width: 100
  },
  {
    thName: '待机原因',
    thKey: 'standbyReason',
    width: 100
  },
  {
    thName: '备注',
    thKey: 'remark',
    width: 100
  },
  {
    thName: '判定指向',
    thKey: 'decide',
    width: 100
  },
  {
    thName: '投片数量',
    thKey: 'tpnum',
    width: 90
  },
  {
    thName: '验证数量',
    thKey: 'yznum',
    width: 90
  },
  {
    thName: '剩余数量',
    thKey: 'synum',
    width: 90
  },
  {
    thName: '可放置数',
    thKey: 'fznum',
    width: 90
  },
  {
    thName: '是否混片',
    thKey: 'hybrid',
    width: 100
  },
  {
    thName: '判定规则',
    thKey: 'ruleName',
    width: 100
  },
  {
    thName: '尺寸',
    thKey: 'measure',
    width: 100
  }
]
const waferTitleList = [
  {
    id: 0,
    label: '操作',
    disabled: true,
    children: [
      {
        id: 101,
        disabled: true,
        label: '序号'
      },
      {
        id: 102,
        disabled: true,
        label: '状态'
      },
      {
        id: 103,
        disabled: true,
        label: 'RunID'
      },
      {
        id: 104,
        disabled: true,
        label: 'WaferID'
      }
    ]
  },
  {
    id: 1,
    label: '基础数据',
    disabled: true,
    children: [
      {
        id: 13,
        disabled: true,
        label: '衬底工艺'
      },
      {
        id: 14,
        disabled: true,
        label: '衬底厂家'
      },
      {
        id: 15,
        disabled: true,
        label: '镭刻号'
      },
      {
        id: 16,
        disabled: true,
        label: '目检'
      },
      {
        id: 17,
        disabled: true,
        label: '铝氮ID'
      }
    ]
  },
  {
    id: 2,
    label: 'XRD',
    children: [
      {
        id: 21,
        label: '002'
      },
      {
        id: 22,
        label: '102'
      },
      {
        id: 23,
        label: 'QB Th.'
      },
      {
        id: 24,
        label: 'QW Th.'
      },
      {
        id: 25,
        label: 'Period'
      },
      {
        id: 26,
        label: 'In %'
      },
      {
        id: 27,
        label: 'AlGaN Th.'
      },
      {
        id: 28,
        label: 'Al %'
      },
      {
        id: 29,
        label: '测试机台'
      }
    ]
  },
  {
    id: 3,
    label: 'PL',
    children: [
      {
        id: 31,
        label: 'Wp'
      },
      {
        id: 32,
        label: 'Wp_Std'
      },
      {
        id: 33,
        label: 'Wd'
      },
      {
        id: 34,
        label: 'Wd Std'
      },
      {
        id: 35,
        label: 'FWHM'
      },
      {
        id: 36,
        label: 'FWHW Std'
      },
      {
        id: 37,
        label: 'PL Int.'
      },
      {
        id: 38,
        label: 'PL Int. Std'
      },
      {
        id: 39,
        label: 'I.I.'
      },
      {
        id: 310,
        label: 'I.I. Std'
      },
      {
        id: 311,
        label: 'PDavr'
      },
      {
        id: 312,
        label: 'PD Std'
      },
      {
        id: 313,
        label: 'TH'
      },
      {
        id: 314,
        label: 'TH Std'
      },
      {
        id: 315,
        label: 'Ref.'
      },
      {
        id: 316,
        label: 'Ref. Std'
      },
      {
        id: 317,
        label: 'Bow'
      },
      {
        id: 318,
        label: '测试机台'
      }
    ]
  },
  {
    id: 4,
    label: 'Napson',
    children: [
      {
        id: 41,
        label: 'sheet'
      },
      {
        id: 42,
        label: 'Std'
      }
    ]
  },
  {
    id: 5,
    label: 'EL',
    children: [
      {
        id: 51,
        label: 'VF1'
      },
      {
        id: 52,
        label: 'VF2'
      },
      {
        id: 53,
        label: 'VF3'
      },
      {
        id: 54,
        label: 'VF4'
      },
      {
        id: 55,
        label: 'VZ1'
      },
      {
        id: 56,
        label: 'VZ2'
      },
      {
        id: 57,
        label: 'IR'
      },
      {
        id: 58,
        label: 'LOP1'
      },
      {
        id: 59,
        label: 'WLP1'
      },
      {
        id: 510,
        label: 'WLD1'
      },
      {
        id: 513,
        label: 'HW'
      },
      // {
      //   id: 511,
      //   label: 'WLC1'
      // },
      {
        id: 512,
        label: 'LOP(460)'
      },
      {
        id: 514,
        label: '测试机台'
      }
    ]
  },
  {
    id: 6,
    label: 'COW',
    children: [
      {
        id: 61,
        label: '批次号'
      },
      {
        id: 62,
        label: 'WaferID'
      },
      {
        id: 63,
        label: '测试时间'
      },
      {
        id: 64,
        label: 'IV均值'
      },
      {
        id: 65,
        label: 'VF1均值'
      },
      {
        id: 650,
        label: 'VF1_ESD_A均值'
      },
      {
        id: 651,
        label: 'VF1_ESD_A差值'
      },
      {
        id: 66,
        label: 'VZ均值'
      },
      {
        id: 67,
        label: '蓝移'
      },
      {
        id: 68,
        label: 'K值'
      },
      {
        id: 69,
        label: 'ESD去坏(200V)'
      },
      {
        id: 610,
        label: 'ESD去坏(400V)'
      },
      {
        id: 611,
        label: 'ESD去坏(50V)'
      },
      {
        id: 612,
        label: 'ESD去坏(500V)'
      },
      {
        id: 613,
        label: 'ESD去坏(300V)'
      },
      {
        id: 614,
        label: 'ESD去坏(人体1000)'
      },
      {
        id: 615,
        label: 'ESD去坏(人体2000)'
      },
      {
        id: 617,
        label: 'ESD去坏(人体4000)'
      },
      {
        id: 618,
        label: 'Thyristor良率'
      },
      {
        id: 619,
        label: 'Thyristor坏点数'
      },
      {
        id: 620,
        label: 'DVF均值'
      },
      {
        id: 621,
        label: '综合良率'
      },
      {
        id: 622,
        label: 'VF1良率'
      },
      {
        id: 623,
        label: 'VF3良率'
      },
      {
        id: 624,
        label: 'WLD1良率'
      },
      {
        id: 625,
        label: 'IR良率'
      },
      {
        id: 652,
        label: 'IR_ESD_A良率'
      },
      {
        id: 626,
        label: 'VZ良率'
      },
      {
        id: 627,
        label: 'IV良率'
      },
      {
        id: 628,
        label: 'VF4良率'
      },
      {
        id: 629,
        label: 'VF2均值'
      },
      {
        id: 630,
        label: 'VF3均值'
      },
      {
        id: 630,
        label: 'VF4均值'
      },
      {
        id: 632,
        label: 'WLD1均值'
      },
      {
        id: 633,
        label: 'WLD1_STD'
      },
      {
        id: 634,
        label: 'WLP1均值'
      },
      {
        id: 635,
        label: 'HW1'
      },
      {
        id: 636,
        label: 'WLD2均值'
      },
      {
        id: 637,
        label: 'WLD2_STD'
      },
      {
        id: 638,
        label: 'HW2'
      },
      {
        id: 639,
        label: 'wlp2均值'
      },
      {
        id: 640,
        label: 'IR均值'
      },
      {
        id: 641,
        label: 'PL_WP'
      },
      {
        id: 642,
        label: 'PL_WD'
      },
      {
        id: 643,
        label: 'PL_WD_STD'
      },
      {
        id: 644,
        label: 'PL.I.I'
      },
      {
        id: 645,
        label: '总数'
      },
      {
        id: 646,
        label: '坏点数'
      },
      {
        id: 647,
        label: '导入时间'
      },
      {
        id: 648,
        label: '机台'
      }
    ]
  },
  {
    id: 8,
    label: '其他',
    children: [
      {
        id: 81,
        label: '投片'
      },
      {
        id: 82,
        label: '验证片'
      },
      {
        id: 83,
        label: '圈(1为最外圈)'
      },
      {
        id: 84,
        label: '目标波长'
      },
      {
        id: 85,
        label: '尺寸'
      }
    ]
  },
  {
    id: 7,
    label: '等级判定',
    children: [
      {
        id: 71,
        label: '预估COW波长'
      }
    ]
  }
]
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  directives: {
    'el-loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          /**
          * scrollHeight 获取元素内容高度(只读)
          * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
          * clientHeight 读取元素的可见高度(只读)
          * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
          * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
          */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value(1)
          } else if (this.scrollTop === 0) {
            // binding.value(2)
            console.log(123)
          }
        })
      }
    }
  },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      selectTheadVisble: false,
      selectTheadVisble1: false,
      setNumDialogVisable: false,
      notBastic: false,
      waferTol: 0,
      waferNum: 54,
      list: [],
      list1: [],
      selectedRunIndex: 0,
      defaultFormThead: [],
      formThead: furnaceList,
      formThead1: furnaceList,
      treeSelect: [101, 102, 11, 12, 13, 14, 15, 16, 17, 2, 3, 4, 5, 6, 7, 8],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      operateList: [
        {
          thName: '序号',
          thKey: 'index',
          width: 55
        },
        {
          thName: '状态',
          thKey: 'status',
          width: 70
        },
        {
          thName: 'RunID',
          thKey: 'runId',
          width: 115
        },
        {
          thName: 'WaferID',
          thKey: 'waferId',
          width: 130
        }
      ],
      operateBaseList: [
        {
          thName: '序号',
          thKey: 'index',
          width: 55
        },
        {
          thName: '状态',
          thKey: 'status',
          width: 70
        },
        {
          thName: 'RunID',
          thKey: 'runId',
          width: 115
        },
        {
          thName: 'WaferID',
          thKey: 'waferId',
          width: 130
        }
      ],
      baseInfoList: [
        {
          thName: '衬底工艺',
          thKey: 'substateType',
          width: 80
        },
        {
          thName: '衬底厂家',
          thKey: 'supplier',
          width: 90
        },
        {
          thName: '镭刻号',
          thKey: 'laserMark',
          width: 120
        },
        {
          thName: '目检',
          thKey: 'mjdj',
          width: 70
        },
        {
          thName: '铝氮ID',
          thKey: 'alnId',
          width: 130
        }
      ],
      baseInfoBaseList: [
        {
          thName: '衬底工艺',
          thKey: 'substateType',
          width: 80
        },
        {
          thName: '衬底厂家',
          thKey: 'supplier',
          width: 90
        },
        {
          thName: '镭刻号',
          thKey: 'laserMark',
          width: 120
        },
        {
          thName: '目检',
          thKey: 'mjdj',
          width: 70
        },
        {
          thName: '铝氮ID',
          thKey: 'alnId',
          width: 130
        }
      ],
      XRDList: [
        {
          thName: '002',
          thKey: 'c002',
          width: 70
        },
        {
          thName: '102',
          thKey: 'c102',
          width: 70
        },
        {
          thName: 'QB Th.',
          thKey: 'qbth',
          width: 80
        },
        {
          thName: 'QW Th.',
          thKey: 'qwth',
          width: 80
        },
        {
          thName: 'Period',
          thKey: 'period',
          width: 80
        },
        {
          thName: 'In %',
          thKey: 'cin',
          width: 70
        },
        {
          thName: 'AlGaN Th.',
          thKey: 'alganTh',
          width: 80
        },
        {
          thName: 'Al %',
          thKey: 'al',
          width: 70
        },
        {
          thName: '测试机台',
          thKey: 'machineXrd',
          width: 90
        }
      ],
      XRDBaseList: [
        {
          thName: '002',
          thKey: 'c002',
          width: 70
        },
        {
          thName: '102',
          thKey: 'c102',
          width: 70
        },
        {
          thName: 'QB Th.',
          thKey: 'qbth',
          width: 80
        },
        {
          thName: 'QW Th.',
          thKey: 'qwth',
          width: 80
        },
        {
          thName: 'Period',
          thKey: 'period',
          width: 80
        },
        {
          thName: 'In %',
          thKey: 'cin',
          width: 70
        },
        {
          thName: 'AlGaN Th.',
          thKey: 'alganTh',
          width: 80
        },
        {
          thName: 'Al %',
          thKey: 'al',
          width: 70
        },
        {
          thName: '测试机台',
          thKey: 'machineXrd',
          width: 90
        }
      ],
      plList: [
        {
          thName: 'Wp',
          thKey: 'wp',
          width: 70
        },
        {
          thName: 'Wp_Std',
          thKey: 'wpStd',
          width: 70
        },
        {
          thName: 'Wd',
          thKey: 'wd',
          width: 70
        },
        {
          thName: 'Wd Std',
          thKey: 'wdStd',
          width: 70
        },
        {
          thName: 'FWHM',
          thKey: 'fwhm',
          width: 70
        },
        {
          thName: 'FWHW Std',
          thKey: 'fwhmStd',
          width: 90
        },
        {
          thName: 'PL Int.',
          thKey: 'plInt',
          width: 90
        },
        {
          thName: 'PL Int. Std',
          thKey: 'plIntStd',
          width: 90
        },
        {
          thName: 'I.I.',
          thKey: 'ii',
          width: 70
        },
        {
          thName: 'I.I. Std',
          thKey: 'iiStd',
          width: 90
        },
        {
          thName: 'PDavr',
          thKey: 'pdavr',
          width: 70
        },
        {
          thName: 'PD Std',
          thKey: 'pdstd',
          width: 70
        },
        {
          thName: 'TH',
          thKey: 'th',
          width: 70
        },
        {
          thName: 'TH Std',
          thKey: 'thStd',
          width: 70
        },
        {
          thName: 'Ref.',
          thKey: 'ref',
          width: 70
        },
        {
          thName: 'Ref. Std',
          thKey: 'refStd',
          width: 90
        },
        {
          thName: 'Bow',
          thKey: 'bow',
          width: 70
        },
        {
          thName: '测试机台',
          thKey: 'machinePl',
          width: 90
        }
      ],
      plBaseList: [
        {
          thName: 'Wp',
          thKey: 'wp',
          width: 70
        },
        {
          thName: 'Wp_Std',
          thKey: 'wpStd',
          width: 70
        },
        {
          thName: 'Wd',
          thKey: 'wd',
          width: 70
        },
        {
          thName: 'Wd Std',
          thKey: 'wdStd',
          width: 70
        },
        {
          thName: 'FWHM',
          thKey: 'fwhm',
          width: 70
        },
        {
          thName: 'FWHW Std',
          thKey: 'fwhmStd',
          width: 90
        },
        {
          thName: 'PL Int.',
          thKey: 'plInt',
          width: 90
        },
        {
          thName: 'PL Int. Std',
          thKey: 'plIntStd',
          width: 90
        },
        {
          thName: 'I.I.',
          thKey: 'ii',
          width: 70
        },
        {
          thName: 'I.I. Std',
          thKey: 'iiStd',
          width: 90
        },
        {
          thName: 'PDavr',
          thKey: 'pdavr',
          width: 70
        },
        {
          thName: 'PD Std',
          thKey: 'pdstd',
          width: 70
        },
        {
          thName: 'TH',
          thKey: 'th',
          width: 70
        },
        {
          thName: 'TH Std',
          thKey: 'thStd',
          width: 70
        },
        {
          thName: 'Ref.',
          thKey: 'ref',
          width: 70
        },
        {
          thName: 'Ref. Std',
          thKey: 'refStd',
          width: 90
        },
        {
          thName: 'Bow',
          thKey: 'bow',
          width: 70
        },
        {
          thName: '测试机台',
          thKey: 'machinePl',
          width: 90
        }
      ],
      nasponList: [
        {
          thName: 'sheet',
          thKey: 'sheet'
        },
        {
          thName: 'Std',
          thKey: 'sheet'
        }
      ],
      nasponBaseList: [
        {
          thName: 'sheet',
          thKey: 'sheet'
        },
        {
          thName: 'Std',
          thKey: 'sheet'
        }
      ],
      elList: [
        {
          thName: 'VF1',
          thKey: 'vf1',
          width: 70
        },
        {
          thName: 'VF2',
          thKey: 'vf2',
          width: 70
        },
        {
          thName: 'VF3',
          thKey: 'vf3',
          width: 70
        },
        {
          thName: 'VF4',
          thKey: 'vf4',
          width: 70
        },
        {
          thName: 'VZ1',
          thKey: 'vz1',
          width: 70
        },
        {
          thName: 'VZ2',
          thKey: 'vz2',
          width: 70
        },
        {
          thName: 'IR',
          thKey: 'ir',
          width: 70
        },
        {
          thName: 'LOP1',
          thKey: 'lop1',
          width: 70
        },
        {
          thName: 'WLP1',
          thKey: 'wlp1',
          width: 70
        },
        {
          thName: 'WLD1',
          thKey: 'wld1',
          width: 70
        },
        // {
        //   thName: 'WLC1',
        //   thKey: 'wlc1'
        // },
        {
          thName: 'HW',
          thKey: 'hw',
          width: 70
        },
        {
          thName: 'LOP(460)',
          thKey: 'lop460',
          width: 90
        },
        {
          thName: '测试机台',
          thKey: 'machineEl',
          width: 90
        }
      ],
      elBaseList: [
        {
          thName: 'VF1',
          thKey: 'vf1',
          width: 70
        },
        {
          thName: 'VF2',
          thKey: 'vf2',
          width: 70
        },
        {
          thName: 'VF3',
          thKey: 'vf3',
          width: 70
        },
        {
          thName: 'VF4',
          thKey: 'vf4',
          width: 70
        },
        {
          thName: 'VZ1',
          thKey: 'vz1',
          width: 70
        },
        {
          thName: 'VZ2',
          thKey: 'vz2',
          width: 70
        },
        {
          thName: 'IR',
          thKey: 'ir',
          width: 70
        },
        {
          thName: 'LOP1',
          thKey: 'lop1',
          width: 70
        },
        {
          thName: 'WLP1',
          thKey: 'wlp1',
          width: 70
        },
        {
          thName: 'WLD1',
          thKey: 'wld1',
          width: 70
        },
        // {
        //   thName: 'WLC1',
        //   thKey: 'wlc1'
        // },
        {
          thName: 'HW',
          thKey: 'hw',
          width: 70
        },
        {
          thName: 'LOP(460)',
          thKey: 'lop460',
          width: 90
        },
        {
          thName: '测试机台',
          thKey: 'machineEl',
          width: 90
        }
      ],
      cowList: [
        {
          thName: '批次号',
          thKey: 'lotNo',
          width: 170
        },
        {
          thName: 'WaferID',
          thKey: 'waferNo',
          width: 200
        },
        {
          thName: '测试时间',
          thKey: 'testTime',
          width: 170
        },
        {
          thName: 'IV均值',
          thKey: 'avgIv',
          width: 100
        },
        {
          thName: 'VF1均值',
          thKey: 'avgVf1',
          width: 100
        },
        {
          thName: 'VF1_ESD_A均值',
          thKey: 'vf1EsdAvg',
          width: 150
        },
        {
          thName: 'VF1_ESD_A差值',
          thKey: 'vf1EsdDiffer',
          width: 150
        },
        {
          thName: 'VZ均值',
          thKey: 'avgVz',
          width: 100
        },
        {
          thName: '蓝移',
          thKey: 'blueShift',
          width: 100
        },
        {
          thName: 'K值',
          thKey: 'valk',
          width: 100
        },
        {
          thName: 'ESD去坏(200V)',
          thKey: 'esd200',
          width: 150
        },
        {
          thName: 'ESD去坏(400V)',
          thKey: 'esd400',
          width: 150
        },
        {
          thName: 'ESD去坏(50V)',
          thKey: 'esd50',
          width: 150
        },
        {
          thName: 'ESD去坏(500V)',
          thKey: 'esd500',
          width: 150
        },
        {
          thName: 'ESD去坏(300V)',
          thKey: 'esd300',
          width: 150
        },
        {
          thName: 'ESD去坏(人体1000)',
          thKey: 'esd1000',
          width: 150
        },
        {
          thName: 'ESD去坏(人体2000)',
          thKey: 'esd2000',
          width: 150
        },
        {
          thName: 'ESD去坏(人体4000)',
          thKey: 'esd4000',
          width: 150
        },
        {
          thName: 'Thyristor良率',
          thKey: 'thyristorYield',
          width: 150
        },
        {
          thName: 'Thyristor坏点数',
          thKey: 'thyristorNum',
          width: 150
        },
        {
          thName: 'DVF均值',
          thKey: 'avgDvf',
          width: 100
        },
        {
          thName: '综合良率',
          thKey: 'yieldZh',
          width: 100
        },
        {
          thName: 'VF1良率',
          thKey: 'yieldVf1',
          width: 100
        },
        {
          thName: 'VF3良率',
          thKey: 'yieldVf3',
          width: 100
        },
        {
          thName: 'WLD1良率',
          thKey: 'yieldWld1',
          width: 100
        },
        {
          thName: 'IR良率',
          thKey: 'yieldIR',
          width: 100
        },
        {
          thName: 'IR_ESD_A良率',
          thKey: 'irEsdYield',
          width: 120
        },
        {
          thName: 'VZ良率',
          thKey: 'yieldVz',
          width: 100
        },
        {
          thName: 'IV良率',
          thKey: 'yieldIv',
          width: 100
        },
        {
          thName: 'VF4良率',
          thKey: 'yieldVf4',
          width: 100
        },
        {
          thName: 'VF2均值',
          thKey: 'avgVf2',
          width: 100
        },
        {
          thName: 'VF3均值',
          thKey: 'avgVf3',
          width: 100
        },
        {
          thName: 'VF4均值',
          thKey: 'avgVf4',
          width: 100
        },
        {
          thName: 'WLD1均值',
          thKey: 'avgWld1',
          width: 100
        },
        {
          thName: 'WLD1_STD',
          thKey: 'wld1Std',
          width: 120
        },
        {
          thName: 'WLP1均值',
          thKey: 'avgWlp1',
          width: 120
        },
        {
          thName: 'HW1',
          thKey: 'hw1',
          width: 100
        },
        {
          thName: 'WLD2均值',
          thKey: 'avgWld2',
          width: 120
        },
        {
          thName: 'WLD2_STD',
          thKey: 'wld2Std',
          width: 120
        },
        {
          thName: 'HW2',
          thKey: 'hw2',
          width: 100
        },
        {
          thName: 'wlp2均值',
          thKey: 'avgWlp2',
          width: 120
        },
        {
          thName: 'IR均值',
          thKey: 'avgIR',
          width: 100
        },
        {
          thName: 'PL_WP',
          thKey: 'plWp',
          width: 100
        },
        {
          thName: 'PL_WD',
          thKey: 'plWd',
          width: 100
        },
        {
          thName: 'PL_WD_STD',
          thKey: 'plWdStd',
          width: 120
        },
        {
          thName: 'PL.I.I',
          thKey: 'plII',
          width: 120
        },
        {
          thName: '总数',
          thKey: 'total',
          width: 100
        },
        {
          thName: '坏点数',
          thKey: 'bad',
          width: 100
        },
        {
          thName: '导入时间',
          thKey: 'importTime',
          width: 170
        },
        {
          thName: '机台',
          thKey: 'machine',
          width: 100
        }
      ],
      cowBaseList: [
        {
          thName: '批次号',
          thKey: 'lotNo',
          width: 170
        },
        {
          thName: 'WaferID',
          thKey: 'waferNo',
          width: 200
        },
        {
          thName: '测试时间',
          thKey: 'testTime',
          width: 170
        },
        {
          thName: 'IV均值',
          thKey: 'avgIv',
          width: 100
        },
        {
          thName: 'VF1均值',
          thKey: 'avgVf1',
          width: 100
        },
        {
          thName: 'VF1_ESD_A均值',
          thKey: 'vf1EsdAvg',
          width: 150
        },
        {
          thName: 'VF1_ESD_A差值',
          thKey: 'vf1EsdDiffer',
          width: 150
        },
        {
          thName: 'VZ均值',
          thKey: 'avgVz',
          width: 100
        },
        {
          thName: '蓝移',
          thKey: 'blueShift',
          width: 100
        },
        {
          thName: 'K值',
          thKey: 'valk',
          width: 100
        },
        {
          thName: 'ESD去坏(200V)',
          thKey: 'esd200',
          width: 150
        },
        {
          thName: 'ESD去坏(400V)',
          thKey: 'esd400',
          width: 150
        },
        {
          thName: 'ESD去坏(50V)',
          thKey: 'esd50',
          width: 150
        },
        {
          thName: 'ESD去坏(500V)',
          thKey: 'esd500',
          width: 150
        },
        {
          thName: 'ESD去坏(300V)',
          thKey: 'esd300',
          width: 150
        },
        {
          thName: 'ESD去坏(人体1000)',
          thKey: 'esd1000',
          width: 150
        },
        {
          thName: 'ESD去坏(人体2000)',
          thKey: 'esd2000',
          width: 150
        },
        {
          thName: 'ESD去坏(人体4000)',
          thKey: 'esd4000',
          width: 150
        },
        {
          thName: 'Thyristor良率',
          thKey: 'thyristorYield',
          width: 150
        },
        {
          thName: 'Thyristor坏点数',
          thKey: 'thyristorNum',
          width: 150
        },
        {
          thName: 'DVF均值',
          thKey: 'avgDvf',
          width: 100
        },
        {
          thName: '综合良率',
          thKey: 'yieldZh',
          width: 100
        },
        {
          thName: 'VF1良率',
          thKey: 'yieldVf1',
          width: 100
        },
        {
          thName: 'VF3良率',
          thKey: 'yieldVf3',
          width: 100
        },
        {
          thName: 'WLD1良率',
          thKey: 'yieldWld1',
          width: 100
        },
        {
          thName: 'IR良率',
          thKey: 'yieldIR',
          width: 100
        },
        {
          thName: 'VZ良率',
          thKey: 'yieldVz',
          width: 100
        },
        {
          thName: 'IV良率',
          thKey: 'yieldIv',
          width: 100
        },
        {
          thName: 'VF4良率',
          thKey: 'yieldVf4',
          width: 100
        },
        {
          thName: 'VF2均值',
          thKey: 'avgVf2',
          width: 100
        },
        {
          thName: 'VF3均值',
          thKey: 'avgVf3',
          width: 100
        },
        {
          thName: 'VF4均值',
          thKey: 'avgVf4',
          width: 100
        },
        {
          thName: 'WLD1均值',
          thKey: 'avgWld1',
          width: 100
        },
        {
          thName: 'WLD1_STD',
          thKey: 'wld1Std',
          width: 120
        },
        {
          thName: 'WLP1均值',
          thKey: 'avgWlp1',
          width: 120
        },
        {
          thName: 'HW1',
          thKey: 'hw1',
          width: 100
        },
        {
          thName: 'WLD2均值',
          thKey: 'avgWld2',
          width: 120
        },
        {
          thName: 'WLD2_STD',
          thKey: 'wld2Std',
          width: 120
        },
        {
          thName: 'HW2',
          thKey: 'hw2',
          width: 100
        },
        {
          thName: 'wlp2均值',
          thKey: 'avgWlp2',
          width: 120
        },
        {
          thName: 'IR均值',
          thKey: 'avgIR',
          width: 100
        },
        {
          thName: 'PL_WP',
          thKey: 'plWp',
          width: 100
        },
        {
          thName: 'PL_WD',
          thKey: 'plWd',
          width: 100
        },
        {
          thName: 'PL_WD_STD',
          thKey: 'plWdStd',
          width: 120
        },
        {
          thName: 'PL.I.I',
          thKey: 'plII',
          width: 120
        },
        {
          thName: '总数',
          thKey: 'total',
          width: 100
        },
        {
          thName: '坏点数',
          thKey: 'bad',
          width: 100
        },
        {
          thName: '导入时间',
          thKey: 'importTime',
          width: 170
        },
        {
          thName: '机台',
          thKey: 'machine',
          width: 100
        }
      ],
      levelList: [
        {
          thName: '预估COW波长',
          thKey: 'ygbc'
        },
        {
          thName: '综合判定',
          thKey: 'all'
        }
      ],
      levelBaseList: [
        {
          thName: '预估COW波长',
          thKey: 'ygbc'
        },
        {
          thName: '综合判定',
          thKey: 'all'
        }
      ],
      otherList: [
        {
          thName: '投片',
          thKey: 'isTp',
          width: 70
        },
        {
          thName: '验证片',
          thKey: 'isYp',
          width: 70
        },
        {
          thName: '圈（1为最外圈）',
          thKey: 'circle',
          width: 120
        },
        {
          thName: '目标波长',
          thKey: 'wavelength',
          width: 80
        },
        {
          thName: '尺寸',
          thKey: 'measure',
          width: 70
        }
      ],
      otherBaseList: [
        {
          thName: '投片',
          thKey: 'isTp',
          width: 70
        },
        {
          thName: '验证片',
          thKey: 'isYp',
          width: 70
        },
        {
          thName: '圈（1为最外圈）',
          thKey: 'circle',
          width: 120
        },
        {
          thName: '目标波长',
          thKey: 'wavelength',
          width: 80
        },
        {
          thName: '尺寸',
          thKey: 'measure',
          width: 70
        }
      ],
      checkboxVal: furnaceList,
      waferTitle: waferTitleList,
      theadOptions: furnaceList,
      formTheadOptions: furnaceList,
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      beginDate: this.getNowFormatDates(),
      endDate: this.getSevenFormatDate(),
      ruleCheck: '',
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
      isActive: 0,
      siteForm: {
        siteType: '',
        siteName: '',
        siteStatus: ''
      },
      currentId: '',
      runId: '',
      machineValue: [],
      machineOptions: [],
      substrateFindOptions: [],
      determineOptions: [
        { id: 0, name: '衬底投片' },
        { id: 1, name: '生长完成' },
        { id: 2, name: '目检完成' },
        { id: 3, name: '测试完成' },
        { id: 4, name: '目检测试完成' },
        { id: 5, name: '已送验证片' },
        { id: 6, name: '全部投片' },
        { id: 7, name: 'COW数据返回' },
        { id: 8, name: '部分入库' },
        { id: 9, name: '已入库' }
      ],
      typeOptions: [
        { id: 0, name: '可入库' },
        { id: 1, name: '待定' },
        { id: 2, name: '控制片' },
        { id: 3, name: '报废' },
        { id: 4, name: '未判定' },
        { id: 5, name: '已入库' }
      ],
      colorOptions: [],
      modelOptions: [],
      result: [],
      type: [],
      sizeType: '',
      rowInfo: null,
      checkList: [],
      showCheckList: [
        { grade: 'R', key: {}},
        { grade: 'S' },
        { grade: 'F' },
        { grade: 'T1' },
        { grade: 'T2' },
        { grade: 'T3' },
        { grade: 'T4' },
        { grade: 'T5' },
        { grade: 'T6' },
        { grade: 'T7' },
        { grade: 'T8' }
      ],
      ruleInfo: null,
      jsInfo: null,
      machineType: '',
      color: '',
      modelType: '',
      isb: false,
      isk: false,
      isb1: false,
      isk1: false,
      isr1: false,
      isc1: false,
      special: false,
      findCowTableList: [],
      qianzhiDialogVisible: false,
      qingzhiInfo: null,
      replaceStr: '',
      findFiledList: [],
      allList: [],
      allIndex: 0,
      isRun: false,
      iSdisable: false,
      orderkey: '',
      ordersc: '',
      importMap: {
        status: 1,
        runId: 2,
        waferId: 3,
        substateType: 4,
        supplier: 5,
        laserMark: 6,
        mjdj: 7,
        alnId: 8,
        c002: 9,
        c102: 10,
        qbth: 11,
        qwth: 12,
        period: 13,
        cin: 14,
        alganTh: 15,
        al: 16,
        machineXrd: 17,
        wp: 18,
        wpStd: 19,
        wd: 20,
        wdStd: 21,
        fwhm: 22,
        fwhmStd: 23,
        plInt: 24,
        plIntStd: 25,
        ii: 26,
        iiStd: 27,
        pdavr: 28,
        pdstd: 29,
        th: 30,
        thStd: 31,
        ref: 32,
        refStd: 33,
        bow: 34,
        machinePl: 35,
        vf1: 36,
        vf2: 37,
        vf3: 38,
        vf4: 39,
        vz1: 40,
        vz2: 41,
        ir: 42,
        lop1: 43,
        wlp1: 44,
        wld1: 45,
        hw: 46,
        lop460: 47,
        machineEl: 48,
        lotNo: 49,
        waferNo: 50,
        testTime: 51,
        avgIv: 52,
        avgVf1: 53,
        vf1EsdAvg: 54,
        vf1EsdDiffer: 55,
        avgVz: 56,
        blueShift: 57,
        valk: 58,
        esd200: 59,
        esd400: 60,
        esd50: 61,
        esd500: 62,
        esd300: 63,
        esd1000: 64,
        esd2000: 65,
        esd4000: 66,
        thyristorYield: 67,
        thyristorNum: 68,
        avgDvf: 69,
        yieldZh: 70,
        yieldVf1: 71,
        yieldVf3: 72,
        yieldWld1: 73,
        yieldIR: 74,
        yieldVz: 75,
        yieldIv: 76,
        yieldVf4: 77,
        avgVf2: 78,
        avgVf3: 79,
        avgVf4: 80,
        avgWld1: 81,
        wld1Std: 82,
        avgWlp1: 83,
        hw1: 84,
        avgWld2: 85,
        wld2Std: 86,
        hw2: 87,
        avgWlp2: 88,
        avgIR: 89,
        plWp: 90,
        plWd: 91,
        plWdStd: 92,
        plII: 93,
        total: 94,
        bad: 95,
        importTime: 96,
        machine: 97,
        isTp: 98,
        isYp: 99,
        wavelength: 100,
        measure: 101,
        ygbc: 102,
        allR: 103
      },
      importMaps: {},
      headerMaps: {}
    }
  },
  mounted() {
    this.beginDate = this.getSevenFormatDate()
    this.endDate = this.getNowFormatDates()
    var checkboxValzhpd = localStorage.getItem('checkboxValzhpd')
    if (checkboxValzhpd !== null && checkboxValzhpd !== undefined) {
      this.formThead = JSON.parse(checkboxValzhpd)
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
    const selected = localStorage.getItem('waferzhpd')
    if (selected !== null && selected !== undefined) {
      this.setList()
    }
    this.fetchData()
    this.matfindList()
    this.substrateFindList()
    this.findColorList()
    this.findModelList()
  },
  methods: {
    getNowFormatDates() {
      var today = new Date()
      return today
    },
    getSevenFormatDate() {
      var today = new Date()
      var SevenDayAgo = today - 86400 * 6 * 1000
      return SevenDayAgo
    },
    viewNext() {
      if ((this.pageSize * (this.pageNum - 1)) + this.selectedRunIndex + 1 === this.totalPage) {
        this.$message({
          type: 'error',
          message: '已经是最后一条数据！'
        })
        return false
      }
      if (this.selectedRunIndex === this.list.length - 1) {
        this.$message({
          type: 'success',
          message: '正在加载下一页数据...'
        })
        this.pageNum = this.pageNum + 1
        this.currentChange(this.pageNum)
        this.selectedRunIndex = -1
      }
      this.selectedRunIndex = this.selectedRunIndex + 1
      this.rowInfo = this.list[this.selectedRunIndex]
      this.findWafer()
    },
    viewPrevious() {
      if (this.selectedRunIndex === 0 && this.pageNum === 1) {
        this.$message({
          type: 'error',
          message: '已经是第一条数据！'
        })
        return false
      }
      if (this.selectedRunIndex === 0) {
        this.$message({
          type: 'success',
          message: '正在加载上一页数据...'
        })
        this.pageNum = this.pageNum - 1
        this.currentChange(this.pageNum)
        this.selectedRunIndex = this.pageSize
      }
      this.selectedRunIndex = this.selectedRunIndex - 1
      setTimeout(() => {
        this.rowInfo = this.list[this.selectedRunIndex]
        this.findWafer()
      }, 400)
    },
    loadmores(type) {
      const index = this.allIndex + 10
      if (this.allList.length >= index) {
        this.allIndex = this.allIndex + 10
      } else {
        this.allIndex = this.allList.length
      }
      this.setShowList()
    },
    setShowList() {
      if (this.allIndex > this.list1.length) {
        for (let i = this.list1.length; i < this.allIndex; i++) {
          this.list1.push(this.allList[i])
        }
      }
    },
    findColorList() {
      findColorList().then(res => {
        this.colorOptions = res.data.list
      })
    },
    findModelList() {
      findModelList().then(res => {
        this.modelOptions = res.data.list
      })
    },
    substrateFindList() {
      substrateFindList().then(res => {
        this.substrateFindOptions = res.data
      })
    },
    findQuery() {
      const requestParams = {
        pageSize: 100000,
        pageNum: 1,
        model: this.modelType,
        status: 0,
        color: this.color
      }
      query(requestParams).then(res => {
        this.checkList = res.data.list
        if (this.checkList.length > 0) {
          this.$refs.checkTabel.setCurrentRow(this.checkList[0])
          this.handleCurrentCheck(this.checkList[0])
        }
      })
    },
    handleCurrentCheck(row) {
      this.ruleInfo = row
      this.showCheckList = [
        { grade: 'R', key: {}},
        { grade: 'S' },
        { grade: 'F' },
        { grade: 'T8' },
        { grade: 'T7' },
        { grade: 'T6' },
        { grade: 'T5' },
        { grade: 'T4' },
        { grade: 'T3' },
        { grade: 'T2' },
        { grade: 'T1' }
      ]
      for (const item of row.wyNormRules) {
        this.showCheckList[0].key[item.field] = '1'
        if (item.grade.toLowerCase() === 's') {
          this.showCheckList[1][item.field] = item.val
        } else if (item.grade.toLowerCase() === 'r') {
          this.showCheckList[0][item.field] = item.val
        } else if (item.grade.toLowerCase() === 'f') {
          this.showCheckList[2][item.field] = item.val
        } else if (item.grade.toLowerCase() === 't8') {
          this.showCheckList[3][item.field] = item.val
        } else if (item.grade.toLowerCase() === 't7') {
          this.showCheckList[4][item.field] = item.val
        } else if (item.grade.toLowerCase() === 't6') {
          this.showCheckList[5][item.field] = item.val
        } else if (item.grade.toLowerCase() === 't5') {
          this.showCheckList[6][item.field] = item.val
        } else if (item.grade.toLowerCase() === 't4') {
          this.showCheckList[7][item.field] = item.val
        } else if (item.grade.toLowerCase() === 't3') {
          this.showCheckList[8][item.field] = item.val
        } else if (item.grade.toLowerCase() === 't2') {
          this.showCheckList[9][item.field] = item.val
        } else if (item.grade.toLowerCase() === 't1') {
          this.showCheckList[10][item.field] = item.val
        }
      }
    },
    openCheck() {
      this.addDialogVisible = true
      this.modelType = ''
      this.color = ''
      this.findColorList()
      this.findModelList()
      this.findQuery()
    },
    selectThead() {
      this.selectTheadVisble = !this.selectTheadVisble
    },
    selectThead1() {
      this.selectTheadVisble1 = true
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys(this.treeSelect)
      }, 200)
    },
    // Run信息/Wafer信息切换
    navClick(index) {
      this.isActive = index
      this.selectTheadVisble = false
      this.selectTheadVisble1 = false
      if (index === 0) {
        setTimeout(() => {
          this.$refs.listTabel.setCurrentRow(this.list[this.selectedRunIndex])
        }, 200)
      }
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
      localStorage.setItem('checkboxValzhpd', JSON.stringify(arr))
      this.selectTheadVisble = false
    },
    setList() {
      const selected = JSON.parse(localStorage.getItem('waferzhpd'))
      const arr = []
      const arr1 = []
      const arr2 = []
      const arr3 = []
      const arr4 = []
      const arr5 = []
      const arr6 = []
      const arr7 = []
      const arr8 = []
      this.operateBaseList.map((item) => {
        for (const items of selected) {
          if (item.thName === items.label) {
            arr.push(item)
            break
          }
        }
      })
      this.baseInfoBaseList.map((item) => {
        for (const items of selected) {
          if (item.thName === items.label) {
            arr1.push(item)
            break
          }
        }
      })
      this.XRDBaseList.map((item) => {
        for (const items of selected) {
          const ids = (items.id + '').substring(0, 1)
          if (item.thName === items.label && ids === '2') {
            arr2.push(item)
            break
          }
        }
      })
      this.plBaseList.map((item) => {
        for (const items of selected) {
          const ids = (items.id + '').substring(0, 1)
          if (item.thName === items.label && ids === '3') {
            arr3.push(item)
            break
          }
        }
      })
      this.nasponBaseList.map((item) => {
        for (const items of selected) {
          if (item.thName === items.label) {
            arr4.push(item)
            break
          }
        }
      })
      this.elBaseList.map((item) => {
        for (const items of selected) {
          const ids = (items.id + '').substring(0, 1)
          if (item.thName === items.label && ids === '5') {
            arr5.push(item)
            break
          }
        }
      })
      this.cowBaseList.map((item) => {
        for (const items of selected) {
          if (item.thName === items.label) {
            arr6.push(item)
            break
          }
        }
      })
      this.levelBaseList.map((item) => {
        for (const items of selected) {
          if (item.thName === items.label) {
            arr7.push(item)
            break
          }
        }
      })
      this.otherBaseList.map((item) => {
        for (const items of selected) {
          if (item.thName === items.label) {
            arr8.push(item)
            break
          }
        }
      })
      this.treeSelect = []
      for (const items of selected) {
        this.treeSelect.push(items.id)
      }
      this.operateList = arr
      this.baseInfoList = arr1
      this.XRDList = arr2
      this.plList = arr3
      this.nasponList = arr4
      this.elList = arr5
      this.cowList = arr6
      this.levelList = arr7
      this.otherList = arr8
    },
    submitOption1() {
      const selected = this.$refs.tree.getCheckedNodes()
      localStorage.setItem('waferzhpd', JSON.stringify(selected))
      this.setList()
      this.selectTheadVisble1 = false
    },
    matfindList() {
      matfindList().then(res => {
        this.machineOptions = res.data
      })
    },
    decide(type) {
      if (this.rowInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择炉次信息!'
        })
        return
      }
      if (this.rowInfo.isCow !== 2) {
        this.$message({
          type: 'error',
          message: '当前炉次未计算!'
        })
        return
      }
      if (type === 1 && this.rowInfo.isDecide !== 4) {
        this.$message({
          type: 'error',
          message: '当前炉次不可判定为待定!'
        })
        return
      }
      if (type === 0 && this.rowInfo.isDecide !== 4 && this.rowInfo.isDecide !== 1) {
        this.$message({
          type: 'error',
          message: '当前炉次不可判定为可入库!'
        })
        return
      }
      if (type === 2 && this.rowInfo.isDecide !== 4 && this.rowInfo.isDecide !== 1) {
        this.$message({
          type: 'error',
          message: '当前炉次不可判定为控制片!'
        })
        return
      }
      const params = {
        id: this.rowInfo.id,
        status: type
      }
      if (this.iSdisable || this.listLoading) {
        return
      }
      this.iSdisable = true
      this.listLoading = true
      decide(params).then(res => {
        this.listLoading = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '判定成功!'
          })
          this.jsInfo = this.rowInfo
          this.fetchData()
        }
        this.iSdisable = false
      }, () => {
        this.iSdisable = false
        this.listLoading = false
      })
    },
    findWafer() {
      const params = {
        id: this.rowInfo.id
      }
      findWafer(params).then(res => {
        this.allList = res.data.data
        for (let i = 0; i < this.allList.length; i++) {
          for (const item of this.XRDList) {
            if (this.allList[i][item.thKey] === 0) {
              this.allList[i][item.thKey] = ''
            } else if (this.allList[i][item.thKey] !== null && item.thKey !== 'machineXrd') {
              this.allList[i][item.thKey] = this.allList[i][item.thKey].toFixed(2)
            }
          }
          for (const item of this.plList) {
            if (this.allList[i][item.thKey] === 0) {
              this.allList[i][item.thKey] = ''
            } else if (this.allList[i][item.thKey] !== null && item.thKey !== 'machinePl') {
              this.allList[i][item.thKey] = this.allList[i][item.thKey].toFixed(2)
            }
          }
          for (const item of this.elList) {
            if (this.allList[i][item.thKey] === 0) {
              this.allList[i][item.thKey] = ''
            } else if (this.allList[i][item.thKey] !== null && item.thKey !== 'machineEl') {
              this.allList[i][item.thKey] = this.allList[i][item.thKey].toFixed(2)
            }
          }
          if (this.allList[i].avgVf1 === 0) {
            this.allList[i].avgVf1 = ''
          } else if (this.allList[i].avgVf1 !== null) {
            this.allList[i].avgVf1 = this.allList[i].avgVf1.toFixed(3)
          }
          if (this.allList[i].avgVf2 === 0) {
            this.allList[i].avgVf2 = ''
          } else if (this.allList[i].avgVf2 !== null) {
            this.allList[i].avgVf2 = this.allList[i].avgVf2.toFixed(3)
          }
          if (this.allList[i].avgVf3 === 0) {
            this.allList[i].avgVf3 = ''
          } else if (this.allList[i].avgVf3 !== null) {
            this.allList[i].avgVf3 = this.allList[i].avgVf3.toFixed(3)
          }
          if (this.allList[i].avgVf4 === 0) {
            this.allList[i].avgVf4 = ''
          } else if (this.allList[i].avgVf4 !== null) {
            this.allList[i].avgVf4 = this.allList[i].avgVf4.toFixed(3)
          }
          if (this.allList[i].avgDvf === 0) {
            this.allList[i].avgDvf = ''
          } else if (this.allList[i].avgDvf !== null) {
            this.allList[i].avgDvf = this.allList[i].avgDvf.toFixed(4)
          }
          if (this.allList[i].avgIR === 0) {
            this.allList[i].avgIR = ''
          } else if (this.allList[i].avgIR !== null) {
            this.allList[i].avgIR = this.allList[i].avgIR.toFixed(4)
          }
          if (this.allList[i].esd200 === 0) {
            this.allList[i].esd200 = ''
          } else if (this.allList[i].esd200 !== null) {
            this.allList[i].esd200 = this.allList[i].esd200.toFixed(2) + '%'
          }
          if (this.allList[i].esd400 === 0) {
            this.allList[i].esd400 = ''
          } else if (this.allList[i].esd400 !== null) {
            this.allList[i].esd400 = this.allList[i].esd400.toFixed(2) + '%'
          }
          if (this.allList[i].esd50 === 0) {
            this.allList[i].esd50 = ''
          } else if (this.allList[i].esd50 !== null) {
            this.allList[i].esd50 = this.allList[i].esd50.toFixed(2) + '%'
          }
          if (this.allList[i].esd500 === 0) {
            this.allList[i].esd500 = ''
          } else if (this.allList[i].esd500 !== null) {
            this.allList[i].esd500 = this.allList[i].esd500.toFixed(2) + '%'
          }
          if (this.allList[i].esd300 === 0) {
            this.allList[i].esd300 = ''
          } else if (this.allList[i].esd300 !== null) {
            this.allList[i].esd300 = this.allList[i].esd300.toFixed(2) + '%'
          }
          if (this.allList[i].esd1000 === 0) {
            this.allList[i].esd1000 = ''
          } else if (this.allList[i].esd1000 !== null) {
            this.allList[i].esd1000 = this.allList[i].esd1000.toFixed(2) + '%'
          }
          if (this.allList[i].esd2000 === 0) {
            this.allList[i].esd2000 = ''
          } else if (this.allList[i].esd2000 !== null) {
            this.allList[i].esd2000 = this.allList[i].esd2000.toFixed(2) + '%'
          }
          if (this.allList[i].esd4000 === 0) {
            this.allList[i].esd4000 = ''
          } else if (this.allList[i].esd4000 !== null) {
            this.allList[i].esd4000 = this.allList[i].esd4000.toFixed(2) + '%'
          }
          if (this.allList[i].thyristorYield === 0) {
            this.allList[i].thyristorYield = ''
          } else if (this.allList[i].thyristorYield !== null) {
            this.allList[i].thyristorYield = this.allList[i].thyristorYield.toFixed(2) + '%'
          }
          if (this.allList[i].yieldZh === 0) {
            this.allList[i].yieldZh = ''
          } else if (this.allList[i].yieldZh !== null) {
            this.allList[i].yieldZh = this.allList[i].yieldZh.toFixed(2) + '%'
          }
          if (this.allList[i].yieldVf4 === 0) {
            this.allList[i].yieldVf4 = ''
          } else if (this.allList[i].yieldVf4 !== null) {
            this.allList[i].yieldVf4 = this.allList[i].yieldVf4.toFixed(2) + '%'
          }
          if (this.allList[i].yieldVf1 === 0) {
            this.allList[i].yieldVf1 = ''
          } else if (this.allList[i].yieldVf1 !== null) {
            this.allList[i].yieldVf1 = this.allList[i].yieldVf1.toFixed(2) + '%'
          }
          if (this.allList[i].yieldVf3 === 0) {
            this.allList[i].yieldVf3 = ''
          } else if (this.allList[i].yieldVf3 !== null) {
            this.allList[i].yieldVf3 = this.allList[i].yieldVf3.toFixed(2) + '%'
          }
          if (this.allList[i].yieldWld1 === 0) {
            this.allList[i].yieldWld1 = ''
          } else if (this.allList[i].yieldWld1 !== null) {
            this.allList[i].yieldWld1 = this.allList[i].yieldWld1.toFixed(2) + '%'
          }
          if (this.allList[i].yieldIR === 0) {
            this.allList[i].yieldIR = ''
          } else if (this.allList[i].yieldIR !== null) {
            this.allList[i].yieldIR = this.allList[i].yieldIR.toFixed(2) + '%'
          }
          if (this.allList[i].yieldVz === 0) {
            this.allList[i].yieldVz = ''
          } else if (this.allList[i].yieldVz !== null) {
            this.allList[i].yieldVz = this.allList[i].yieldVz.toFixed(2) + '%'
          }
          if (this.allList[i].yieldIv === 0) {
            this.allList[i].yieldIv = ''
          } else if (this.allList[i].yieldIv !== null) {
            this.allList[i].yieldIv = this.allList[i].yieldIv.toFixed(2) + '%'
          }
          if (this.allList[i].irEsdYield === 0) {
            this.allList[i].irEsdYield = ''
          } else if (this.allList[i].irEsdYield !== null && this.allList[i].irEsdYield !== undefined) {
            this.allList[i].irEsdYield = this.allList[i].irEsdYield.toFixed(2) + '%'
          }
          if (this.allList[i].avgIv === 0) {
            this.allList[i].avgIv = ''
          } else if (this.allList[i].avgIv !== null) {
            this.allList[i].avgIv = this.allList[i].avgIv.toFixed(2)
          }
          if (this.allList[i].avgVz === 0) {
            this.allList[i].avgVz = ''
          } else if (this.allList[i].avgVz !== null) {
            this.allList[i].avgVz = this.allList[i].avgVz.toFixed(2)
          }
          if (this.allList[i].ygbc !== null) {
            this.allList[i].ygbc = this.allList[i].ygbc.toFixed(2)
          }
          if (this.allList[i].blueShift === 0) {
            this.allList[i].blueShift = ''
          } else if (this.allList[i].blueShift !== null) {
            this.allList[i].blueShift = this.allList[i].blueShift.toFixed(2)
          }
          if (this.allList[i].thyristorNum === 0) {
            this.allList[i].thyristorNum = ''
          } else if (this.allList[i].thyristorNum !== null) {
            this.allList[i].thyristorNum = this.allList[i].thyristorNum.toFixed(2)
          }
          if (this.allList[i].avgVf1 === 0) {
            this.allList[i].avgVf1 = ''
          } else if (this.allList[i].avgWld1 !== null) {
            this.allList[i].avgWld1 = this.allList[i].avgWld1.toFixed(2)
          }
          if (this.allList[i].wld1Std === 0) {
            this.allList[i].wld1Std = ''
          } else if (this.allList[i].wld1Std !== null) {
            this.allList[i].wld1Std = this.allList[i].wld1Std.toFixed(2)
          }
          if (this.allList[i].avgWlp1 === 0) {
            this.allList[i].avgWlp1 = ''
          } else if (this.allList[i].avgWlp1 !== null) {
            this.allList[i].avgWlp1 = this.allList[i].avgWlp1.toFixed(2)
          }
          if (this.allList[i].hw1 === 0) {
            this.allList[i].hw1 = ''
          } else if (this.allList[i].hw1 !== null) {
            this.allList[i].hw1 = this.allList[i].hw1.toFixed(2)
          }
          if (this.allList[i].avgWld2 === 0) {
            this.allList[i].avgWld2 = ''
          } else if (this.allList[i].avgWld2 !== null) {
            this.allList[i].avgWld2 = this.allList[i].avgWld2.toFixed(2)
          }
          if (this.allList[i].wld2Std === 0) {
            this.allList[i].wld2Std = ''
          } else if (this.allList[i].wld2Std !== null) {
            this.allList[i].wld2Std = this.allList[i].wld2Std.toFixed(2)
          }
          if (this.allList[i].hw2 === 0) {
            this.allList[i].hw2 = ''
          } else if (this.allList[i].hw2 !== null) {
            this.allList[i].hw2 = this.allList[i].hw2.toFixed(2)
          }
          if (this.allList[i].avgWlp2 === 0) {
            this.allList[i].avgWlp2 = ''
          } else if (this.allList[i].avgWlp2 !== null) {
            this.allList[i].avgWlp2 = this.allList[i].avgWlp2.toFixed(2)
          }
          if (this.allList[i].plWp === 0) {
            this.allList[i].plWp = ''
          } else if (this.allList[i].plWp !== null) {
            this.allList[i].plWp = this.allList[i].plWp.toFixed(2)
          }
          if (this.allList[i].plWd === 0) {
            this.allList[i].plWd = ''
          } else if (this.allList[i].plWd !== null) {
            this.allList[i].plWd = this.allList[i].plWd.toFixed(2)
          }
          if (this.allList[i].plWdStd === 0) {
            this.allList[i].plWdStd = ''
          } else if (this.allList[i].plWdStd !== null) {
            this.allList[i].plWdStd = this.allList[i].plWdStd.toFixed(2)
          }
        }
        this.list1 = this.allList
        // this.allIndex = 0
        // if (this.allList.length > 20) {
        //   this.allIndex = 20
        // } else {
        //   this.allIndex = this.allList.length
        // }
        // for (let i = 0; i < this.allList.length; i++) {
        //   if (this.allIndex > i) {
        //     this.list1.push(this.allList[i])
        //   }
        // }
        this.waferTol = res.data.data.length
      })
    },
    findField() {
      this.levelBaseList = [
        {
          thName: '预估COW波长',
          thKey: 'ygbc'
        },
        {
          thName: '综合判定',
          thKey: 'all'
        }
      ]
      this.waferTitle[8].children = [
        {
          id: 71,
          label: '预估COW波长'
        },
        {
          id: 72,
          label: '综合判定'
        }
      ]
      if (this.rowInfo.ruleId !== null) {
        const params = {
          ruleId: this.rowInfo.ruleId
        }
        this.importMaps = {}
        findField(params).then(res => {
          if (res.data.length > 0) {
            let i = 3
            for (const item of res.data) {
              this.importMaps[item] = 103 + i - 2
              this.levelBaseList.push({
                thName: item,
                thKey: item
              })
              this.waferTitle[8].children.push({
                id: 7 + '' + i,
                label: item
              })
              i = i + 1
            }
            let selected = []
            try {
              selected = this.$refs.tree.getCheckedNodes()
            } catch (e) {
              console.log(e)
            }
            if (selected.length > 0) {
              const arr7 = []
              this.levelBaseList.map((item) => {
                for (const items of selected) {
                  if (item.thName === items.label) {
                    arr7.push(item)
                    break
                  }
                }
              })
              this.levelList = arr7
            } else {
              this.levelList = this.levelBaseList
            }
          }
          this.findWafer()
        })
      } else {
        this.findWafer()
      }
    },
    resetOption() {
      this.selectTheadVisble = false
      this.selectTheadVisble1 = false
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
    clearAll() {
      this.pageSize = 12
      this.runId = ''
      this.machineValue = []
      this.result = []
      this.type = []
      this.sizeType = ''
      this.beginDate = this.getSevenFormatDate()
      this.endDate = this.getNowFormatDates()
      this.isRun = false
      this.handleSearch()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        runId: this.runId,
        machineId: this.machineValue.join(),
        decide: this.result.join(),
        status: this.type.join(),
        measureId: this.sizeType,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        order: this.isRun ? '1' : '',
        sortField: this.orderkey,
        sortRule: this.ordersc
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      this.waferTol = 0
      findRunInfo(requestParams).then(res => {
        console.log(res.data.list)
        this.list = res.data.list
        if (this.list.length === 0) {
          this.list1 = []
        }
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].yield5 !== null) {
            this.list[i].yield5 = this.list[i].yield5 + '%'
          }
          if (this.list[i].yield8 !== null) {
            this.list[i].yield8 = this.list[i].yield8 + '%'
          }
        }
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
        if (this.list.length > 0) {
          if (this.isActive === 0) {
            if (this.jsInfo !== null) {
              this.$refs.listTabel.setCurrentRow(this.list[this.selectedRunIndex])
              this.jsInfo = null
            } else {
              this.$refs.listTabel.setCurrentRow(this.list[0])
            }
          }
          // this.handleCurrentChange(this.list[0])
          this.rowInfo = this.list[this.selectedRunIndex]
          this.findWafer()
        }
      })
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
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
      this.addDialogVisible = false
    },
    // 添加提交
    submitForm() {
      if (this.ruleInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择判定规则!'
        })
        return
      }
      this.addDialogVisible = false
      this.ruleCheck = this.ruleInfo.name
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
    },
    // 单击Run信息
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
      this.list.map((item, index) => {
        if (item.id === row.id) {
          this.selectedRunIndex = index
        }
      })
      console.log(this.selectedRunIndex)
      this.findField()
    },
    // 双击Run信息
    cellDblclick(row, column, cell, event) {
      this.isActive = 1
      this.rowInfo = row
      this.findField()
    },
    // 特殊计算判定
    calculateSpecial() {
      this.special = true
      calculate()
    },
    // 计算判定
    calculate() {
      this.special = false
      if (this.ruleCheck === '') {
        this.$message({
          type: 'error',
          message: '请选择判定规则!'
        })
        return
      }
      if (this.rowInfo.isCow === 2) {
        this.$message({
          type: 'error',
          message: '当前炉次已计算!'
        })
        return
      }
      if (this.rowInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择炉次信息!'
        })
        return
      }
      const param = {
        id: this.rowInfo.id,
        ruleId: this.ruleInfo.id,
        isb: this.isb,
        isk: this.isk,
        special: this.special
      }
      if (this.iSdisable || this.listLoading) {
        return
      }
      this.iSdisable = true
      this.listLoading = true
      calculate(param).then(res => {
        this.iSdisable = false
        this.listLoading = false
        if (res.code === 0 && res.data === null) {
          this.$message({
            type: 'success',
            message: '计算成功!'
          })
          this.isb = false
          this.isk = false
          this.jsInfo = this.rowInfo
          this.fetchData()
        } else if (res.data.code === -2) {
          this.$confirm(res.data.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isb = true
            this.calculate()
          }, () => {
            this.isb = false
            this.isk = false
          })
        } else if (res.data.code === -3) {
          this.$confirm(res.data.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isk = true
            this.calculate()
          }, () => {
            this.isb = false
            this.isk = false
          })
        }
        this.iSdisable = false
      }, res => {
        this.iSdisable = false
        this.listLoading = false
      })
    },
    // 强制计算判定
    mandatory() {
      if (this.ruleCheck === '') {
        this.$message({
          type: 'error',
          message: '请选择判定规则!'
        })
        return
      }
      if (this.rowInfo.isCow === 2) {
        this.$message({
          type: 'error',
          message: '当前炉次已计算!'
        })
        return
      }
      if (this.rowInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择炉次信息!'
        })
        return
      }
      const param = {
        id: this.rowInfo.id,
        ruleId: this.ruleInfo.id,
        isb: this.isb1,
        isk: this.isk1,
        isr: this.isr1,
        isc: this.isc1,
        replaceStr: this.replaceStr
      }
      if (this.iSdisable || this.listLoading) {
        return
      }
      this.iSdisable = true
      this.listLoading = true
      mandatory(param).then(res => {
        this.listLoading = false
        if (res.code === 0 && res.data === null) {
          this.$message({
            type: 'success',
            message: '计算成功!'
          })
          this.isb1 = false
          this.isk1 = false
          this.isr1 = false
          this.isc1 = false
          this.jsInfo = this.rowInfo
          this.fetchData()
        } else if (res.data.code === -2) {
          this.$confirm(res.data.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isb1 = true
            this.mandatory()
          }, () => {
            this.isb1 = false
            this.isk1 = false
            this.isr1 = false
            this.isc1 = false
          })
        } else if (res.data.code === -3) {
          this.$confirm(res.data.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isk1 = true
            this.mandatory()
          }, () => {
            this.isb1 = false
            this.isk1 = false
            this.isr1 = false
            this.isc1 = false
          })
        } else if (res.data.code === -4) {
          this.$confirm(res.data.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isc1 = true
            this.findCowTable()
          }, () => {
            this.isb1 = false
            this.isk1 = false
            this.isr1 = false
            this.isc1 = false
          })
        } else if (res.data.code === -5) {
          this.$confirm(res.data.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isr1 = true
            this.mandatory()
          }, () => {
            this.isb1 = false
            this.isk1 = false
            this.isr1 = false
            this.isc1 = false
          })
        }
        this.iSdisable = false
      }, () => {
        this.iSdisable = false
        this.listLoading = false
      })
    },
    findCowTable() {
      this.qianzhiDialogVisible = true
      const param = {
        id: this.rowInfo.id
      }
      findCowTable(param).then(res => {
        this.qingzhiInfo = null
        this.findCowTableList = []
        for (const item of res.data) {
          item.cows = ''
          this.findCowTableList.push(item)
        }
      })
    },
    // 单击Run信息
    handleCurrentChanges(row) {
      if (row === null) {
        return
      }
      this.qingzhiInfo = row
    },
    setYTD(row) {
      if (this.qingzhiInfo === null || this.qingzhiInfo.cow === 1) {
        this.$message({
          type: 'error',
          message: '请选择被替代的行!'
        })
        return
      }
      this.qingzhiInfo.cows = row.waferId
    },
    submitReplaceStr() {
      this.replaceStr = ''
      let flag = true
      let str = ''
      for (const item of this.findCowTableList) {
        if (item.cow !== 1 && item.cows === '') {
          flag = false
          break
        }
        if (item.cow !== 1) {
          if (str === '') {
            if (item.cow === 2) {
              str = item.cows + '-' + item.circle
            } else {
              str = item.cows + '-' + item.waferId
            }
          } else {
            if (item.cow === 2) {
              str = str + ',' + item.cows + '-' + item.circle
            } else {
              str = str + ',' + item.cows + '-' + item.waferId
            }
          }
        }
      }
      if (flag) {
        this.replaceStr = str
        this.qianzhiDialogVisible = false
        this.mandatory()
      } else {
        this.$message({
          type: 'error',
          message: 'COW结果不能为空!'
        })
      }
    },
    // 撤销计算
    undoCalculate() {
      if (this.rowInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择炉次信息!'
        })
        return
      }
      if (this.rowInfo.isDecide !== 4) {
        this.$message({
          type: 'error',
          message: '当前炉次不可撤销!'
        })
        return
      }
      const param = {
        id: this.rowInfo.id
      }
      if (this.iSdisable || this.listLoading) {
        return
      }
      this.iSdisable = true
      this.listLoading = true
      undoCalculate(param).then(res => {
        this.listLoading = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '撤销成功!'
          })
          this.jsInfo = this.rowInfo
          this.fetchData()
        }
        this.iSdisable = false
      }, () => {
        this.iSdisable = false
        this.listLoading = false
      })
    },
    // 撤销判定
    undoDecide() {
      if (this.rowInfo === null) {
        this.$message({
          type: 'error',
          message: '请选择炉次信息!'
        })
        return
      }
      if (this.rowInfo.isDecide === 4) {
        this.$message({
          type: 'error',
          message: '当前炉次不可撤销!'
        })
        return
      }
      const param = {
        id: this.rowInfo.id
      }
      if (this.iSdisable || this.listLoading) {
        return
      }
      this.iSdisable = true
      this.listLoading = true
      undoDecide(param).then(res => {
        this.listLoading = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '撤销成功!'
          })
          this.jsInfo = this.rowInfo
          this.fetchData()
        }
        this.iSdisable = false
      }, () => {
        this.iSdisable = false
        this.listLoading = false
      })
    },
    tableRowClassColor({ row, rowIndex }) {
      if (row.isTp === 1) {
        return 'set_yellow'
      }
    },
    tableRowClassColors({ row, column, rowIndex, columnIndex }) {
      if (row.isDecide === 1) {
        if (columnIndex === 1) {
          return 'background: #F56C6C !important;color:#fff'
        }
      }
      if (row.isCow === 1) {
        if (columnIndex === 0) {
          return 'background: #409eff !important;color:#fff'
        }
      }
    },
    importExcel() {
      let columnEn = ''
      let columnCn = ''
      if (this.isActive === 0) {
        for (const item of this.formTheadOptions) {
          if (columnCn === '') {
            columnCn = item.thName
          } else {
            columnCn = columnCn + ';' + item.thName
          }
          if (columnEn === '') {
            columnEn = item.thKey
          } else {
            columnEn = columnEn + ',' + item.thKey
          }
        }
        const order = this.isRun ? '1' : ''
        const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
        const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
        window.open(process.env.BASE_API + `/wyComprehensive/exportRun?startTime=${startTime}&endTime=${endTime}&runId=${this.runId}&machineId=${this.machineValue.join()}&decide=${this.result.join()}&status=${this.type.join()}&measureId=${this.sizeType}&columnCn=${columnCn}&columnEn=${columnEn}&order=${order}`, '_blank')
      } else {
        if (this.rowInfo === null) {
          this.$message({
            type: 'error',
            message: '请选择炉次信息!'
          })
          return
        }
        const columnNum = []
        for (const item of this.operateList) {
          if (item.thName !== '序号') {
            columnNum.push(this.importMap[item.thKey] - 1)
          }
        }
        for (const item of this.baseInfoList) {
          columnNum.push(this.importMap[item.thKey] - 1)
        }
        for (const item of this.XRDList) {
          columnNum.push(this.importMap[item.thKey] - 1)
        }
        for (const item of this.plList) {
          columnNum.push(this.importMap[item.thKey] - 1)
        }
        for (const item of this.elList) {
          columnNum.push(this.importMap[item.thKey] - 1)
        }
        for (const item of this.cowList) {
          columnNum.push(this.importMap[item.thKey] - 1)
        }
        for (const item of this.otherList) {
          columnNum.push(this.importMap[item.thKey] - 1)
        }
        for (const item of this.levelList) {
          if (item.thName === '预估COW波长') {
            if (this.importMap[item.thKey] !== undefined) {
              columnNum.push(this.importMap[item.thKey] - 1)
            }
          } else {
            if (this.importMap[item.thKey + 'R'] !== undefined) {
              columnNum.push(this.importMap[item.thKey + 'R'] - 1)
            }
          }
        }
        console.log(columnNum)
        for (const item of this.levelList) {
          if (item.thName !== '预估COW波长' && this.importMaps[item.thKey] !== undefined) {
            columnNum.push(this.importMaps[item.thKey] - 1)
          }
        }
        const str = columnNum.join()
        const reg = new RegExp('NaN,', 'g')
        const str1 = str.replace(reg, '')
        console.log(str1)
        // window.open(process.env.BASE_API + `/wyComprehensive/exportWafer?id=${this.rowInfo.id}&runId=${this.rowInfo.runId}&columnCn=${columnCn}&columnEn=${columnEn}`, '_blank')
        window.open(process.env.BASE_API + `/wyComprehensive/exportWafer?id=${this.rowInfo.id}&runId=${this.rowInfo.runId}&column=${str1}`, '_blank')
      }
    },
    importExcelwafer() {
      this.setNumDialogVisable = true
    },
    submitNumForm() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/wyComprehensive/exportMoreWafer?startTime=${startTime}&endTime=${endTime}&runId=${this.runId}&machineId=${this.machineValue.join()}&decide=${this.result.join()}&status=${this.type.join()}&row=${this.waferNum}&measureId=${this.sizeType}`, '_blank')
      this.setNumDialogVisable = false
    },
    setHeader({ row, column, rowIndex, columnIndex }) {
      let color = ''
      if (column.level === 1) {
        this.headerMaps[column.label] = column.children
      } else {
        const keys = Object.keys(this.headerMaps)
        for (const key of keys) {
          for (const item of this.headerMaps[key]) {
            if (item.label === column.label) {
              if (key === '操作' || columnIndex === 3) {
                color = ''
                break
              } else if (key === '基础数据') {
                color = 'background:#D6D6FF !important;'
                break
              } else if (key === 'XRD') {
                color = 'background:#FBDDDD !important;'
                break
              } else if (key === 'PL') {
                color = 'background:#E0FFCC !important;'
                break
              } else if (key === 'napson') {
                color = 'background:#FFFFC0 !important;'
                break
              } else if (key === 'EL') {
                if (item.label === '测试机台') {
                  if (columnIndex < 18) {
                    color = 'background:#FBDDDD !important;'
                    break
                  } else if (columnIndex < 37) {
                    color = 'background:#E0FFCC !important;'
                    break
                  } else if (columnIndex > 37) {
                    color = 'background:#99FFFF !important;'
                    break
                  }
                } else {
                  color = 'background:#99FFFF !important;'
                  break
                }
              } else if (key === 'COW') {
                color = 'background:#FAF0E6 !important;'
                break
              } else if (key === '其他') {
                color = 'background:#F2F2F2 !important;'
                break
              } else if (key === '等级判定') {
                color = 'background:#8DE9EA !important;'
                break
              }
            }
          }
        }
      }
      if (color !== '') {
        return color
      }
    },
    getSort({ column, prop, order }) {
      console.log(column, prop, order)
      // this.list = []
      this.orderkey = prop === null ? '' : prop
      this.ordersc = order === 'ascending' ? 'asc' : (order === 'descending' ? 'desc' : '')
      this.fetchData()
    },
    closeQZJS() {
      this.isb1 = false
      this.isk1 = false
      this.isr1 = false
      this.isc1 = false
      this.findCowTableList = []
      this.qianzhiDialogVisible = false
    }
  }
}

