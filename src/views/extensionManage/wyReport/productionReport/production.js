
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  getProductType,
  findSubstrateMeasureList,
  findStructureType,
  genreFindList,
  findProduceType,
  machineList,
  levelQuery,
  yrWyStructureSeries,
  cdfindList
} from '@/api/extensionManage/wyReport/productionReport/index'
import { findController } from '@/api/visualInspection'
import First from './first/index'
import Second from './second/index'
import Third from './third/index'
import Forth from './forth/index'
import Fifth from './fifth/index'
import Sixth from './sixth/index'
import Seventh from './seventh/index'
import Eighth from './eighth/index'
import Chart from '@/components/Charts'
export default {
  components: {
    PageHeaderLayout,
    HeaderSearchAdd,
    Chart,
    First,
    Second,
    Third,
    Forth,
    Fifth,
    Sixth,
    Seventh,
    Eighth
  },
  data() {
    return {
      extension: 0, // 全局绑定
      extensionOptions: [
        {
          id: 0,
          code: '生产数据'
        },
        {
          id: 1,
          code: '入库数据'
        }
      ], // 全局数据
      // 所有图表的筛选条件
      screenObj: {
        // 产品类型
        productOptions: [],
        // 衬底尺寸
        measureList: [],
        // 光色名称
        structureTypeList: [],
        // 衬底类型
        typeList: [],
        // 生产类型
        produceTypeList: [],
        // 衬底工艺
        cdfindListOption: [],
        // 光色系列
        colorType: [],
        visualList: [],
        // 是否铝氮
        isLD: [
          {
            id: 0,
            code: '是'
          }, {
            id: 1,
            code: '不是'
          }
        ],
        // 等级
        level: [
          {
            id: 'S',
            name: 'S'
          }, {
            id: 'F',
            name: 'F'
          }, {
            id: 'T',
            name: 'T'
          }, {
            id: 'R',
            name: 'R'
          }
        ],
        // 等级
        levelWeek: [
          {
            id: 'S',
            name: 'S'
          }, {
            id: 'S,F',
            name: 'F'
          }, {
            id: 'S,F,T',
            name: 'T'
          }, {
            id: 'R',
            name: 'R'
          }
        ],
        // 机台
        machineList: [],
        // 目检结果
        levelList: [],
        // 统计参数
        paramsList: [
          {
            id: 0,
            name: 'std'
          }, {
            id: 1,
            name: 'wld良率'
          }, {
            id: 2,
            name: 'wlp良率'
          }
        ]
      },

      anotherLists: [] // 本月产量统计数据
    }
  },
  created() {
    this.getProductType()
    this.findSubstrateMeasureList()
    this.findStructureTypeFun()
    this.fetchTypeList()
    this.cdfindList()
    this.findProduceTypeFun()
    this.levelQuery()
    this.machineListFun()
    this.yrWyStructureSeries()
    this.findController()
  },
  methods: {
    // 获取产品类型列表
    getProductType() {
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      getProductType(params).then(res => {
        res.data.length && res.data.map((_, index) => {
          _.id = index
        })
        this.screenObj.productOptions = res.data
      })
    },
    // 衬底尺寸
    findSubstrateMeasureList() {
      findSubstrateMeasureList().then(res => {
        this.screenObj.measureList = res.data
      })
    },
    // 结构类型
    findStructureTypeFun() {
      findStructureType(this.params).then(res => {
        this.screenObj.structureTypeList = res.data
      })
    },
    // 查询衬底类型
    fetchTypeList() {
      genreFindList({}).then(res => {
        console.log(res.data)
        this.screenObj.typeList = res.data
      })
    },
    // 查询衬底类型
    cdfindList() {
      cdfindList().then(res => {
        this.screenObj.cdfindListOption = res.data
      })
    },
    // 生产类型查询
    findProduceTypeFun() {
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      findProduceType(params).then(res => {
        this.screenObj.produceTypeList = res.data.list
      })
    },
    // 目捡等级
    levelQuery() {
      const params = {
        pageNum: 1,
        pageSize: 10000000,
        status: 0
      }
      levelQuery(params).then(res => {
        this.screenObj.levelList = res.data.list
      })
    },
    // 获取列表
    findController() {
      findController().then(res => {
        this.screenObj.visualList = res.data
      })
    },
    // 获取外延机台
    machineListFun() {
      machineList().then(res => {
        this.screenObj.machineList = res.data
      })
    },
    // 获取光色系列
    yrWyStructureSeries() {
      yrWyStructureSeries({}).then(res => {
        this.screenObj.colorType = res.data
      })
    },
    // 全局导出
    exportDate() {
      this.$printChart(this.$refs.chart, { 'notPrint': '.el-button, .input-item, .el-form' })
      this.addDialogVisible = true
    }
  }
}

