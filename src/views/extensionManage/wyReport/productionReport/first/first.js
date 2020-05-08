
import Chart from '@/components/Charts'
import { currentMonthYield } from '@/api/extensionManage/wyReport/productionReport/index'
export default {
  components: {
    Chart
  },
  props: ['extension', 'screenObj'],
  data() {
    const colors = ['#009494', '#5268a5', '#fcb586']
    return {
      isChart: true,
      productId: [], // 产品类型
      measureId: '', // 尺寸
      colorId: [], // 光色名称
      craftId: [], // 衬底工艺
      convert: false, // 是否折合
      month: '', // 日期
      listLoading: false,
      planArray: [],
      tableList: [], // 切换视图的表格数据
      chartParams: { // 图表的筛选条件
        productId: [],
        measureId: '', // 尺寸
        colorId: [], // 光色名称
        craftId: [], // 衬底工艺
        convert: false, // 是否折合
        month: '', // 日期,
        dataType: 0
      },
      // 当前生产的idlist
      productList: {
        productId: [],
        measureId: [], // 尺寸
        colorId: [], // 光色名称
        craftId: [], // 衬底工艺
        convert: false, // 是否折合
        month: '', // 日期,
        dataType: 0
      },
      option1: {
        color: colors,
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          width: 'auto',
          left: 0,
          right: 5,
          bottom: 0,
          containLabel: true
        },
        legend: {
          data: ['日产量', '累计产出', '计划产出'],
          itemHeight: 8,
          top: 25
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWidthLabel: true
          },
          data: []
        },
        yAxis: [
          {
            type: 'value',
            name: '日产量（片）',
            min: 0,
            splitNumber: 6,
            position: 'left',
            nameTextStyle: {
              padding: [0, 0, 0, 60]
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '月产量（片）',
            min: 0,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: 'transparent'
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '月产量（片）',
            min: 0,
            position: 'right',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '日产量',
            type: 'bar',
            label: {
              show: true,
              position: 'top'
            },
            data: []
          },
          {
            name: '累计产出',
            type: 'line',
            symbolSize: 8,
            yAxisIndex: 2,
            data: []
          }, {
            name: '计划产出',
            type: 'line',
            yAxisIndex: 2,
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
    }
  },
  methods: {
    init() {
      this.productId = []
      this.measureId = ''
      this.colorId = []
      this.craftId = []
      this.convert = false
      const MM = (new Date().getMonth() + 1) > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
      this.month = new Date().getFullYear() + '-' + MM
      const obj = {
        dataType: this.extension,
        productId: this.productId,
        measureId: this.measureId,
        colorId: this.colorId,
        craftId: this.craftId,
        convert: this.convert,
        month: this.month
      }
      if (this.isChart) {
        this.chartParams.dataType = obj.dataType
        this.chartParams.productId = obj.productId
        this.chartParams.measureId = obj.measureId
        this.chartParams.colorId = obj.colorId
        this.chartParams.craftId = obj.craftId
        this.chartParams.convert = obj.convert
        this.chartParams.month = obj.month
        this.currentMonthYield(this.chartParams)
      } else {
        const params = {}
        params.dataType = this.dataType = obj.dataType
        params.productId = this.productId = obj.productId
        params.measureId = this.measureId = obj.measureId
        params.colorId = this.colorId = obj.colorId
        params.craftId = this.craftId = obj.craftId
        params.convert = this.convert = obj.convert
        params.month = this.month = obj.month
        this.currentMonthYield(params)
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
          this.chartParams.convert = this.convert
          this.chartParams.productId = this.productId
          this.chartParams.month = this.month
          this.chartParams.dataType = this.extension
        } else {
          this.productList = params
          this.productList.convert = this.convert
          this.productList.productId = this.productId
          this.productList.month = this.month
          this.productList.dataType = this.extension
        }
      }
    },
    // 修改尺寸获取当前选择的产品
    changeMeasure(val) {
      this.changFunc()
    },
    // 筛选互斥方法
    changFunc() {
      this.productId = []
      if (this.isChart) {
        this.chartParams.measureId = this.measureId
        this.chartParams.colorId = this.colorId
        this.chartParams.craftId = this.craftId
        this.chartParams.productId = this.productId
        this.chartParams.convert = this.convert
        this.chartParams.month = this.month
        this.chartParams.dataType = this.extension
      } else {
        this.productList.measureId = this.measureId
        this.productList.colorId = this.colorId
        this.productList.craftId = this.craftId
        this.productList.productId = this.productId
        this.productList.convert = this.convert
        this.productList.month = this.month
        this.productList.dataType = this.extension
      }
    },
    // 查询数据
    currentMonthYield(params) {
      const obj = { ...params }
      obj.colorId = params.colorId.toString()
      obj.craftId = params.craftId.toString()
      obj.measureId = params.productId.length ? params.measureId.toString() : params.measureId
      delete obj.productId
      this.listLoading = true
      currentMonthYield(obj).then(res => {
        const planNum = res.data.chart.planNum
        const timeArray = res.data.chart.timeArray
        const num = planNum / timeArray.length
        const _this = this
        const arr = []
        for (let i = 0; i < timeArray.length; i++) {
          arr[i] = num + num * i
        }
        arr[arr.length - 1] = planNum
        this.planArray = arr
        this.option1.series[0].name = this.option1.legend.data[0] = (this.extension === 0 ? '日产量' : '日入库量')
        this.option1.series[1].name = this.option1.legend.data[1] = (this.extension === 0 ? '累计产量' : '累计入库量')
        this.option1.series[2].name = this.option1.legend.data[2] = (this.extension === 0 ? '计划产量' : '计划入库量')
        this.option1.yAxis[0].name = (this.extension === 0 ? '日产量（片）' : '日入库量（片）')
        this.option1.yAxis[2].name = this.option1.yAxis[1].name = (this.extension === 0 ? '月产量（片）' : '月入库量（片）')
        this.option1.series[0].data = res.data.chart.dailyOutPut
        this.option1.series[1].data = res.data.chart.cumulativeOutPut
        this.option1.series[2].data = this.planArray
        this.option1.xAxis.data = timeArray
        this.option1.series[2].symbolSize = function(value, params) {
          if (_this.planArray[params.dataIndex] === res.data.chart.planNum) {
            params.symbolSize = 8
          } else {
            params.symbolSize = 0
          }
          return params.symbolSize
        }
        this.option1.tooltip.formatter = function(params) {
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
            <span>${i !== 2 ? params[i].data : planNum}片<br/>`
          }
          return str
        }
        const Arr = ['total', 'date']
        this.screenObj.machineList.map(_ => {
          Arr.push(_.code)
        })
        res.data.table.length && res.data.table.map(_ => {
          Arr.map(item => {
            _[item] = _[item] ? _[item] : 0
          })
        })
        this.tableList = res.data.table
        this.listLoading = false
      })
    },
    // 切换视图
    changeIsChart() {
      this.isChart = !this.isChart
      this.productId = this.chartParams.productId
      this.measureId = this.productId.length ? '' : this.chartParams.measureId
      this.colorId = this.productId.length ? [] : this.chartParams.colorId
      this.craftId = this.productId.length ? [] : this.chartParams.craftId
      this.convert = this.chartParams.convert
      this.month = this.chartParams.month
      this.productList = { ...this.chartParams }
      this.fetchData()
    },
    // 重置第一批数据的筛选结果
    clearCondition() {
      this.init()
    },
    // 查询第一批数据的筛选结果
    fetchData() {
      let obj = {}
      if (this.isChart) {
        // this.chartParams.dataType = this.extension
        // this.chartParams.productId = this.productId
        this.chartParams.convert = this.convert
        this.chartParams.month = this.month
        // this.chartParams.colorId = this.productId.length ? [] : this.colorId
        // this.chartParams.craftId = this.productId.length ? [] : this.craftId
        // this.chartParams.measureId = this.productId.length ? '' : this.measureId
        obj = { ...this.chartParams }
        obj.colorId = this.chartParams.colorId.toString()
        obj.craftId = this.chartParams.craftId.toString()
        obj.measureId = this.chartParams.measureId.toString()
      } else {
        // this.productList.dataType = this.extension
        // this.productList.productId = this.productId
        this.productList.convert = this.convert
        this.productList.month = this.month
        // this.productList.colorId = this.productId.length ? [] : this.colorId
        // this.productList.craftId = this.productId.length ? [] : this.craftId
        // this.productList.measureId = this.productId.length ? '' : this.measureId
        obj = { ...this.productList }
        obj.colorId = this.productList.colorId.toString()
        obj.craftId = this.productList.craftId.toString()
        obj.measureId = this.productList.measureId.toString()
      }
      console.log(obj)

      this.currentMonthYield(obj)
    },
    // 导出为excl
    exportExcel() {
      const arr = ['日期']
      this.screenObj.machineList.map(_ => {
        arr.push(_.code)
      })
      arr.push('合计')
      const colEn = arr.join(',')
      window.open(process.env.BASE_API + `/wyReportController/currentMonthYieldExport?dataType=${this.extension}&convert=${this.convert}&month=${this.month}&craftId=${this.productList.craftId.toString()}&measureId=${this.productList.measureId.toString()}&colorId=${this.productList.colorId.toString()}&colEn=${colEn}`)
    }
  }
}

