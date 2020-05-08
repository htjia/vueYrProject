
import Chart from '@/components/Charts'
import { showWeeks, getMonthDateRange } from '@/utils'
import { sAndRCompared, comprehensiveTable } from '@/api/extensionManage/wyReport/productionReport/index'
export default {
  components: {
    Chart
  },
  props: ['extension', 'screenObj'],
  data() {
    const colors4 = ['#009494', '#5268a5', '#fcb586', '#8e99b1']
    return {
      isChart: true,
      structureTypeList: [],
      productId: [], // 产品类型
      substrateTypeId: [], // 衬底类型
      colorId: [], // 光色名称
      colorSeries: [], // 光色系列
      measureId: '', // 尺寸
      manyLevel: '', // 等级
      convert: false, // 是否折合
      month: '', // 月时间
      weekDate: '', // 周时间
      startTime: '', // 周起始时间
      endTime: '', // 周结束时间
      craftId: [],
      chartParams: {
        dataType: 0,
        productId: [], // 产品类型
        substrateTypeId: [], // 衬底类型
        colorId: [], // 光色名称
        colorSeries: [], // 光色系列
        measureId: '', // 尺寸
        manyLevel: '', // 等级
        convert: false, // 是否折合
        month: '', // 月时间
        startTime: '', // 周起始时间
        craftId: [],
        endTime: '' // 周结束时间
      },
      productList: {
        dataType: 0,
        productId: [], // 产品类型
        substrateTypeId: [], // 衬底类型
        colorId: [], // 光色名称
        colorSeries: [], // 光色系列
        measureId: '', // 尺寸
        convert: false, // 是否折合
        month: '', // 月时间
        startTime: '', // 周起始时间
        craftId: [],
        endTime: '' // 周结束时间
      },
      listLoading: false,
      tableList: [],
      objData: {},
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = new Date(this.endTime).getTime()
          if (endDateVal) {
            return time.getTime() > endDateVal
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = new Date(this.startTime).getTime()
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      option: {
        color: colors4,
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var str = ''
            str += `<div>${params[0].name}</div>`
            for (var i = 0; i < params.length; i++) {
              str += `
              <span style="
              display:inline-block;
              margin-right:5px;
              border-radius:10px;
              width:10px;
              background:${params[i].color};
              height:10px;">
              </span>
              <span>${params[i].seriesName}</span>:
              <span>${params[i].data}片<br/>`
            }
            return str
          }
        },
        grid: {
          width: 'auto',
          left: 0,
          right: 50,
          bottom: 0,
          containLabel: true
        },
        legend: {
          data: ['前三周', '前两周', '前一周', '本周'],
          itemHeight: 8,
          top: '25'
        },
        xAxis: {
          name: '机台',
          show: true,
          type: 'category',
          axisTick: {
            alignWidthLabel: true
          },
          data: []
        },
        yAxis: [
          {
            type: 'value',
            name: '数量（片）/占比（%）',
            min: 0,
            nameTextStyle: {
              padding: [0, 0, 0, 120]
            },
            position: 'left',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            show: true,
            start: 0,
            end: 30,
            height: 14,
            bottom: 0
          }
        ],
        series: [
          {
            name: '前三周',
            type: 'bar',
            barWidth: 20,
            label: {
              show: true,
              position: 'top'
            },
            data: []
          },
          {
            name: '前两周',
            type: 'bar',
            barWidth: 20,
            label: {
              show: true,
              position: 'top'
            },
            data: []
          },
          {
            name: '前一周',
            type: 'bar',
            barWidth: 20,
            label: {
              show: true,
              position: 'top'
            },
            data: []
          },
          {
            name: '本周',
            type: 'bar',
            barWidth: 20,
            label: {
              show: true,
              position: 'top'
            },
            data: []
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    extension(val) {
      this.init()
    },
    convert(val) {
      console.log(val)
    },
    productId(val) {
      const list = []
      val.length && val.map(i => {
        list.push(this.screenObj.productOptions.find(_ => _.id === i))
      })
    }
  },
  methods: {
    // 初始化筛选条件
    init() {
      this.convert = false
      this.productId = []
      this.substrateTypeId = []
      this.colorSeries = []
      this.colorId = []
      this.manyLevel = ''
      this.measureId = ''
      const MM = (new Date().getMonth() + 1) > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
      this.month = new Date().getFullYear() + '-' + MM
      this.changeMonth(this.month)
      const obj = {
        dataType: this.extension,
        startTime: this.startTime,
        convert: this.convert,
        endTime: this.endTime,
        substrateTypeId: this.substrateTypeId,
        colorSeries: this.colorSeries,
        colorId: this.colorId,
        craftId: this.craftId,
        measureId: this.measureId
      }
      if (this.isChart) {
        obj.manyLevel = ''
        obj.month = this.month
        this.chartParams.dataType = obj.dataType
        this.chartParams.productId = this.productId
        this.chartParams.substrateTypeId = obj.substrateTypeId
        this.chartParams.colorSeries = obj.colorSeries
        this.chartParams.colorId = obj.colorId
        this.chartParams.craftId = obj.craftId
        this.chartParams.manyLevel = obj.manyLevel
        this.chartParams.convert = obj.convert
        this.chartParams.measureId = obj.measureId
        this.chartParams.month = obj.month
        this.chartParams.startTime = obj.startTime
        this.chartParams.endTime = obj.endTime
        const newObj = { ...this.chartParams }
        newObj.colorSeries = this.chartParams.colorSeries.toString()
        newObj.substrateTypeId = this.chartParams.substrateTypeId.toString()
        newObj.colorId = this.chartParams.colorId.toString()
        newObj.craftId = this.chartParams.craftId.toString()
        newObj.measureId = this.chartParams.measureId.toString()
        delete newObj.productId
        this.sAndRCompared(newObj)
      } else {
        comprehensiveTable(obj).then(res => {
          this.tableList = res.data
          this.listLoading = false
        })
      }
    },
    // 修改当前选择的产品
    changeProduct(val) {
      if (val) {
        const list = this.screenObj.productOptions.filter(_ => val.indexOf(_.id) > -1)
        this.measureId = ''
        this.colorId = []
        this.craftId = []
        const params = {
          measureId: [],
          colorId: [],
          craftId: [],
          productId: val
        }
        list.map(_ => {
          params['measureId'].indexOf(_.measureId) === -1 ? params['measureId'].push(_.measureId) : params['measureId']
          params['colorId'].indexOf(_.colorId) === -1 ? params['colorId'].push(_.colorId) : params['colorId']
          params['craftId'].indexOf(_.craftId) === -1 ? params['craftId'].push(_.craftId) : params['craftId']
        })
        if (this.isChart) {
          this.chartParams = params
          this.chartParams.month = this.month
          this.chartParams.convert = this.convert
          this.chartParams.productId = this.productId
          this.chartParams.substrateTypeId = this.substrateTypeId
          this.chartParams.colorSeries = this.colorSeries
          this.chartParams.manyLevel = this.manyLevel
          this.chartParams.startTime = this.startTime
          this.chartParams.endTime = this.endTime
          this.chartParams.dataType = this.extension
        } else {
          this.productList = params
          this.productList.convert = this.convert
          this.productList.productId = this.productId
          this.productList.substrateTypeId = this.substrateTypeId
          this.productList.colorSeries = this.colorSeries
          this.productList.startTime = this.startTime
          this.productList.endTime = this.endTime
          this.productList.dataType = this.extension
        }
      }
    },
    // 月筛选
    changeMonth(val) {
      const year = val.split('-')[0]
      const month = val.split('-')[1]
      this.weekDate = ''
      this.startTime = getMonthDateRange(year, month).start
      this.endTime = getMonthDateRange(year, month).end
    },
    // 周筛选
    changeWeek() {
      const a = this.$refs.weekval.displayValue.split(' ')
      this.startTime = showWeeks(a[0], a[2]).split(' ')[0]
      this.endTime = showWeeks(a[0], a[2]).split(' ')[1]
      this.month = ''
    },
    // 查询数据
    sAndRCompared(params) {
      sAndRCompared(params).then(res => {
        if (params.month) {
          this.option.legend.data = ['第一周', '第二周', '第三周', '第四周']
          this.option.series[0].name = '第一周'
          this.option.series[1].name = '第二周'
          this.option.series[2].name = '第三周'
          this.option.series[3].name = '第四周'
        } else {
          this.option.legend.data = ['前三周', '前两周', '前一周', '本周']
          this.option.series[0].name = '前三周'
          this.option.series[1].name = '前两周'
          this.option.series[2].name = '前一周'
          this.option.series[3].name = '本周'
        }
        this.objData = res.data
        this.option.xAxis.data = this.objData.machine
        this.option.series[0].data = this.objData.weekThree
        this.option.series[1].data = this.objData.weekTwo
        this.option.series[2].data = this.objData.weekOne
        this.option.series[3].data = this.objData.weekFour
      })
    },
    // 获取光色名称
    findColorType(val) {
      if (val) {
        this.structureTypeList = val.length ? (this.screenObj.structureTypeList.filter(item => val.indexOf(item.series) > -1)) : this.screenObj.structureTypeList
      }
      this.colorId = []
    },
    // 修改尺寸获取当前选择的产品
    changeMeasure(val) {
      this.changFunc()
    },
    // 筛选互斥方法
    changFunc() {
      this.productId = []
      if (this.isChart) {
        this.chartParams.convert = this.convert
        this.chartParams.substrateTypeId = this.substrateTypeId
        this.chartParams.colorSeries = this.colorSeries
        this.chartParams.manyLevel = this.manyLevel
        this.chartParams.startTime = this.startTime
        this.chartParams.endTime = this.endTime
        this.chartParams.measureId = this.measureId
        this.chartParams.colorId = this.colorId
        this.chartParams.craftId = this.craftId
        this.chartParams.productId = this.productId
        this.chartParams.month = this.month
        this.chartParams.dataType = this.extension
      } else {
        this.productList.convert = this.convert
        this.productList.substrateTypeId = this.substrateTypeId
        this.productList.colorSeries = this.colorSeries
        this.productList.startTime = this.startTime
        this.productList.endTime = this.endTime
        this.productList.measureId = this.measureId
        this.productList.colorId = this.colorId
        this.productList.craftId = this.craftId
        this.productList.productId = this.productId
        this.productList.dataType = this.extension
      }
    },
    // 切换视图
    changeIsChart() {
      this.isChart = !this.isChart
      if (this.isChart) {
        console.log(this.chartParams)

        this.convert = this.chartParams.convert
        this.substrateTypeId = this.chartParams.substrateTypeId
        this.colorSeries = this.chartParams.colorSeries
        this.manyLevel = this.chartParams.manyLevel
        this.startTime = this.chartParams.startTime
        this.endTime = this.chartParams.endTime
        this.measureId = this.chartParams.productId.length ? '' : this.chartParams.measureId
        this.colorId = this.chartParams.productId.length ? [] : this.chartParams.colorId
        this.craftId = this.chartParams.productId.length ? [] : this.chartParams.craftId
        this.productId = this.chartParams.productId
        this.month = this.chartParams.month
        this.extension = this.chartParams.dataType
      } else {
        this.productList = { ...this.chartParams }
      }
      this.fetchData()
    },
    // 重置第一批数据的筛选结果
    clearCondition() {
      this.init()
    },
    // 查询第一批数据的筛选结果
    fetchData() {
      let obj = {
        dataType: this.extension,
        startTime: this.startTime,
        convert: this.convert,
        endTime: this.endTime,
        substrateTypeId: this.substrateTypeId,
        colorSeries: this.colorSeries,
        measureId: this.measureId,
        colorId: this.colorId,
        craftId: this.craftId,
        productId: this.productId
      }
      if (this.isChart) {
        obj.manyLevel = this.manyLevel
        this.chartParams.dataType = obj.dataType
        this.chartParams.startTime = obj.startTime
        this.chartParams.convert = obj.convert
        this.chartParams.endTime = obj.endTime
        this.chartParams.substrateTypeId = obj.substrateTypeId
        this.chartParams.colorSeries = obj.colorSeries
        this.chartParams.manyLevel = obj.manyLevel
        this.chartParams.month = this.month
        const newObj = { ...this.chartParams }
        newObj.measureId = this.chartParams.measureId.toString()
        newObj.colorId = this.chartParams.colorId.toString()
        newObj.craftId = this.chartParams.craftId.toString()
        newObj.productId = this.chartParams.productId.toString()
        newObj.colorSeries = this.chartParams.colorSeries.toString()
        newObj.substrateTypeId = this.chartParams.substrateTypeId.toString()
        this.sAndRCompared(newObj)
      } else {
        obj = { ...this.chartParams }
        this.productList.dataType = obj.dataType
        this.productList.startTime = obj.startTime
        this.productList.convert = obj.convert
        this.productList.endTime = obj.endTime
        this.productList.substrateTypeId = obj.substrateTypeId
        this.productList.colorSeries = obj.colorSeries
        const newObj = { ...this.productList }
        newObj.measureId = this.productList.measureId.toString()
        newObj.colorId = this.productList.colorId.toString()
        newObj.craftId = this.productList.craftId.toString()
        newObj.productId = this.productList.productId.toString()
        newObj.colorSeries = this.productList.colorSeries.toString()
        newObj.substrateTypeId = this.productList.substrateTypeId.toString()
        this.listLoading = true
        comprehensiveTable(newObj).then(res => {
          this.tableList = res.data
          this.listLoading = false
        })
      }
    },
    // 导出
    exportExcel() {
      window.open(process.env.BASE_API + `/wyReportController/comprehensiveTableExport?dataType=${this.extension}&exportType=1&startTime=${this.startTime}&endTime=${this.endTime}&convert=${this.convert}&colorId=${this.productList.colorId.toString()}&measureId=${this.productList.measureId.toString()}&substrateTypeId=${this.productList.substrateTypeId.toString()}`)
    }
  }
}
