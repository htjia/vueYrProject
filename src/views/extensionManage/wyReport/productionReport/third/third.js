
import Chart from '@/components/Charts'
import { showWeeks, getMonthDateRange } from '@/utils'
import { productTypeStatisticsChart, productTypeStatisticsTable } from '@/api/extensionManage/wyReport/productionReport/index'
export default {
  components: {
    Chart
  },
  props: ['extension', 'screenObj'],
  data() {
    const colors3 = ['#009494']
    return {
      isChart: true,
      structureTypeList: [],
      productTypeId: [], // 生产类型
      substrateTypeId: [], // 衬底类型
      colorId: [], // 光色名称
      colorSeries: [], // 光色系列
      craftId: [], // 衬底工艺
      measureId: '', // 尺寸
      aln: '', // 是否铝氮
      convert: false, // 是否折合
      month: '', // 月时间
      weekDate: '', // 周时间
      startTime: '', // 周起始时间
      endTime: '', // 周结束时间
      chartParams: {
        dataType: 0,
        productTypeId: [], // 生产类型
        substrateTypeId: [], // 衬底类型
        colorId: [], // 光色名称
        colorSeries: [], // 光色系列
        craftId: [], // 衬底工艺
        measureId: '', // 尺寸
        aln: '', // 是否铝氮
        convert: false, // 是否折合
        month: '', // 月时间
        startTime: '', // 周起始时间
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
        color: colors3,
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
          left: 5,
          right: 50,
          bottom: 0,
          containLabel: true
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
            name: '产量（片）',
            min: 0,
            position: 'left',
            nameTextStyle: {
              padding: [0, 0, 0, 60]
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '产量',
            barWidth: 24,
            type: 'bar',
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
    }
  },
  methods: {
    // 初始化筛选条件
    init() {
      this.convert = false
      this.productTypeId = []
      this.substrateTypeId = []
      this.colorSeries = []
      this.colorSeries = []
      this.colorId = []
      this.craftId = []
      this.measureId = ''
      this.aln = ''
      const MM = (new Date().getMonth() + 1) > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
      this.month = new Date().getFullYear() + '-' + MM
      this.changeMonth(this.month)
      const obj = {
        dataType: this.extension,
        startTime: this.startTime,
        convert: this.convert,
        endTime: this.endTime,
        productTypeId: this.productTypeId.length ? this.productTypeId.toString() : null,
        substrateTypeId: this.substrateTypeId.length ? this.substrateTypeId.toString() : null,
        colorSeries: this.colorSeries.length ? this.colorSeries.toString() : null,
        colorId: this.colorId.length ? this.colorId.toString() : null,
        craftId: this.craftId.length ? this.craftId.toString() : null,
        measureId: this.measureId ? this.measureId : null,
        aln: this.aln
      }
      if (this.isChart) {
        obj.month = this.month
        this.chartParams.dataType = obj.dataType
        this.chartParams.productTypeId = obj.productTypeId
        this.chartParams.substrateTypeId = obj.substrateTypeId
        this.chartParams.colorId = obj.colorId
        this.chartParams.craftId = obj.craftId
        this.chartParams.colorSeries = obj.colorSeries
        this.chartParams.convert = obj.convert
        this.chartParams.measureId = obj.measureId
        this.chartParams.aln = obj.aln
        this.chartParams.month = obj.month
        this.chartParams.startTime = obj.startTime
        this.chartParams.endTime = obj.endTime
        this.productTypeStatisticsChart(this.chartParams)
      } else {
        this.listLoading = false
        productTypeStatisticsTable(obj).then(res => {
          this.tableList = res.data
          this.listLoading = false
        })
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
    productTypeStatisticsChart(params) {
      productTypeStatisticsChart(params).then(res => {
        this.objData = res.data
        this.option.xAxis.data = this.objData.machineCodes
        this.option.series[0].data = this.objData.yields
      })
    },
    // 获取光色名称
    findColorType(val) {
      if (val) {
        this.structureTypeList = val.length ? (this.screenObj.structureTypeList.filter(item => val.indexOf(item.series) > -1)) : this.screenObj.structureTypeList
      }
      this.colorId = []
    },
    // 切换视图
    changeIsChart() {
      this.isChart = !this.isChart

      if (this.isChart) {
        this.dataType = this.chartParams.dataType
        this.productTypeId = this.chartParams.productTypeId
        this.substrateTypeId = this.chartParams.substrateTypeId
        this.colorId = this.chartParams.colorId
        this.craftId = this.chartParams.craftId
        this.colorSeries = this.chartParams.colorSeries
        this.convert = this.chartParams.convert
        this.measureId = this.chartParams.measureId
        this.aln = this.chartParams.aln
        this.month = this.chartParams.month
        this.startTime = this.chartParams.startTime
        this.endTime = this.chartParams.endTime
      } else {
        this.chartParams.dataType = this.dataType
        this.chartParams.productTypeId = this.productTypeId
        this.chartParams.substrateTypeId = this.substrateTypeId
        this.chartParams.colorId = this.colorId
        this.chartParams.craftId = this.craftId
        this.chartParams.colorSeries = this.colorSeries
        this.chartParams.convert = this.convert
        this.chartParams.measureId = this.measureId
        this.chartParams.aln = this.aln
        this.chartParams.month = this.month
        this.chartParams.startTime = this.startTime
        this.chartParams.endTime = this.endTime
      }

      console.log(this.chartParams.productTypeId)
      this.fetchData()
    },
    // 重置第一批数据的筛选结果
    clearCondition() {
      this.init()
    },
    // 查询第一批数据的筛选结果
    fetchData() {
      const obj = {
        dataType: this.extension,
        startTime: this.startTime,
        convert: this.convert,
        endTime: this.endTime,
        productTypeId: this.productTypeId.length ? this.productTypeId.toString() : null,
        substrateTypeId: this.substrateTypeId.length ? this.substrateTypeId.toString() : null,
        colorSeries: this.colorSeries.length ? this.colorSeries.toString() : null,
        colorId: this.colorId.length ? this.colorId.toString() : null,
        craftId: this.craftId.length ? this.craftId.toString() : null,
        measureId: this.measureId ? this.measureId : null,
        aln: this.aln
      }
      if (this.isChart) {
        obj.month = this.month
        this.chartParams.dataType = obj.dataType
        this.chartParams.productTypeId = obj.productTypeId
        this.chartParams.substrateTypeId = obj.substrateTypeId
        this.chartParams.colorId = obj.colorId
        this.chartParams.craftId = obj.craftId
        this.chartParams.colorSeries = obj.colorSeries
        this.chartParams.convert = obj.convert
        this.chartParams.measureId = obj.measureId
        this.chartParams.aln = obj.aln
        this.chartParams.month = obj.month
        this.chartParams.startTime = obj.startTime
        this.chartParams.endTime = obj.endTime
        this.productTypeStatisticsChart(this.chartParams)
      } else {
        this.listLoading = false
        productTypeStatisticsTable(obj).then(res => {
          const Arr = ['total', 'date']
          this.screenObj.machineList.map(_ => {
            Arr.push(_.code)
          })
          res.data.length && res.data.map(_ => {
            Arr.map(item => {
              _[item] = _[item] ? _[item] : 0
            })
          })
          this.tableList = res.data
          this.listLoading = false
        })
      }
    },

    // 导出
    exportExcel() {
      const arr = ['日期']
      this.screenObj.machineList.map(_ => {
        arr.push(_.code)
      })
      arr.push('合计')
      window.open(process.env.BASE_API + `/wyReportController/productTypeStatisticsTableExport?cols=${arr.toString()}&dataType=${this.extension}&productTypeId=${this.productTypeId.toString()}&substrateTypeId=${this.substrateTypeId.toString()}&colorSeries=${this.colorSeries.toString()}&colorId=${this.colorId.toString()}&measureId=${this.measureId}&craftId=${this.craftId.toString()}&aln=${this.aln} &month=${this.month}&startTime=${this.startTime}&endTime=${this.endTime}&convert=${this.convert}`)
    }
  }
}
