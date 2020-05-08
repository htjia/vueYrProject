
import Chart from '@/components/Charts'
import { showWeeks, getMonthDateRange } from '@/utils'
import { wyParamStatisticalChart, yieldWeek } from '@/api/extensionManage/wyReport/productionReport/index'
export default {
  components: {
    Chart
  },
  props: ['extension', 'screenObj'],
  data() {
    const colors4 = ['#009494', '#5268a5', '#fcb586', '#8e99b1']
    return {
      isChart: true,
      name: '',
      structureTypeList: [],
      colorSeries: [], // 光色系列
      colorId: [], // 光色名称
      paramType: 0, // 统计参数
      ruleForm: {
        standardValue: '2' // 良率标准值
      },
      rules: {
        standardValue: [{ required: true, message: '请输入对比值', trigger: 'blur' }]
      },
      month: '', // 月时间
      weekDate: '', // 周时间
      startTime: '', // 周起始时间
      endTime: '', // 周结束时间
      chartParams: {
        structureTypeList: [],
        colorSeries: [], // 光色系列
        colorId: [], // 光色名称
        paramType: 0, // 统计参数
        standardValue: '2',
        month: '', // 月时间
        startTime: '', // 周起始时间
        endTime: '' // 周结束时间
      },
      listLoading: false,
      tableList: [],
      objData: {},
      objData1: {},
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
        title: {
          text: '按外延参数统计入库量',
          left: '40%',
          top: 20
        },
        color: colors4,
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var str = ''
            str += `<div>${params[0].name}</div>`
            for (var i = 0; i < params.length; i++) {
              if (i > 1) {
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
                <span>${params[i].data}%<br/>`
              } else {
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
            }
            return str
          }
        },
        grid: {
          width: 'auto',
          left: 0,
          right: 10,
          bottom: 20,
          containLabel: true
        },
        legend: {
          data: ['STD<2', 'STD>2', '良率'],
          itemHeight: 8,
          right: 100,
          top: '25'
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
            name: '片数',
            min: 0,
            position: 'left',
            nameTextStyle: {
              padding: [0, 0, 0, 30]
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '百分比',
            min: 0,
            max: 100,
            position: 'right',
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: 'STD<2',
            type: 'bar',
            barWidth: 24,
            stack: 'aa',
            label: {
              show: true,
              position: 'inside'
            },
            itemStyle: {
              normal: {
                label: {
                  show: true
                }
              }
            },
            data: []
          },
          {
            name: 'STD>2',
            type: 'bar',
            barWidth: 24,
            stack: 'aa',
            label: {
              show: true,
              position: 'inside'
            },
            itemStyle: {
              normal: {
                label: {
                  show: true
                }
              }
            },
            data: []
          },
          {
            name: '良率',
            type: 'line',
            symbolSize: 8,
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      option1: {
        title: {
          text: '良率周对比',
          left: '45%',
          top: 20
        },
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
                <span>${params[i].data}%<br/>`
            }
            return str
          }
        },
        grid: {
          width: 'auto',
          left: 0,
          right: 50,
          bottom: 20,
          containLabel: true
        },
        legend: {
          data: ['前三周', '前两周', '前一周', '本周'],
          itemHeight: 8,
          right: 20,
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
            nameTextStyle: {
              padding: [0, 0, 0, 120]
            },
            min: 0,
            max: 100,
            position: 'left',
            boundaryGap: '20%',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            show: false,
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
    }
  },
  methods: {
    // 初始化筛选条件
    init() {
      this.$refs.ruleForm.resetFields()
      this.colorSeries = []
      this.colorId = []
      this.paramType = 0
      this.ruleForm.standardValue = '2'
      const MM = (new Date().getMonth() + 1) > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
      this.month = new Date().getFullYear() + '-' + MM
      this.changeMonth(this.month)
      this.fetchData()
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
    // 外延参数统计入库量图表
    wyParamStatisticalChart(params) {
      wyParamStatisticalChart(params).then(res => {
        this.objData = res.data
        if (this.objData) {
          this.option.xAxis.data = this.objData.machine
          this.option.series[1].data = this.objData.firstNum
          this.option.series[0].data = this.objData.secondNum
          this.option.series[2].data = this.objData.yield
          this.tableList = this.objData.table
        }
      })
    },
    // 良率周
    yieldWeek(params) {
      yieldWeek(params).then(res => {
        this.objData1 = res.data
        if (this.objData1) {
          this.option1.xAxis.data = this.objData1.machine
          this.option1.series[0].data = this.objData1.weekThree
          this.option1.series[1].data = this.objData1.weekTwo
          this.option1.series[2].data = this.objData1.weekOne
          this.option1.series[3].data = this.objData1.weekFour
          this.option1.dataZoom[0].show = this.option1.xAxis.data.length > 5
        }
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
        this.structureTypeList = this.chartParams.structureTypeList
        this.colorSeries = this.chartParams.colorSeries
        this.colorId = this.chartParams.colorId
        this.paramType = this.chartParams.paramType
        this.standardValue = this.chartParams.standardValue
        this.month = this.chartParams.month
        this.startTime = this.chartParams.startTime
        this.endTime = this.chartParams.endTime
      } else {
        this.chartParams.structureTypeList = this.structureTypeList
        this.chartParams.colorSeries = this.colorSeries
        this.chartParams.colorId = this.colorId
        this.chartParams.paramType = this.paramType
        this.chartParams.standardValue = this.standardValue
        this.chartParams.month = this.month
        this.chartParams.startTime = this.startTime
        this.chartParams.endTime = this.endTime
      }
      if (this.extension) {
        this.fetchData()
      }
    },
    // 重置第一批数据的筛选结果
    clearCondition() {
      this.init()
    },
    // 查询第一批数据的筛选结果
    fetchData() {
      const obj = {
        colorSeries: this.colorSeries,
        colorId: this.colorId,
        standardValue: this.ruleForm.standardValue,
        paramType: this.paramType,
        month: this.month,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const name = this.screenObj.paramsList.find(i => i.id === this.paramType).name
          this.option.legend.data[0] = (name === 'std') ? name + '<' + this.ruleForm.standardValue : name + '<' + this.ruleForm.standardValue + 'nm'
          this.option.legend.data[1] = (name === 'std') ? name + '>' + this.ruleForm.standardValue : name + '>' + this.ruleForm.standardValue + 'nm'
          this.option.series[0].name = this.option.legend.data[0]
          this.option.series[1].name = this.option.legend.data[1]
          if (this.isChart) {
            this.chartParams = { ...obj }
          }
          const newobj = { ...obj }
          newobj.colorSeries = obj.colorSeries.toString()
          newobj.colorId = obj.colorId.toString()
          // this.name = name + (this.paramType === 0 ? ('<' + this.ruleForm.standardValue) : (' (' + this.ruleForm.standardValue + 'nm)')) + ' 良率'
          this.wyParamStatisticalChart(newobj)
          this.yieldWeek(newobj)
        } else {
          this.option.series[0].data = []
          this.option1.series[0].data = []
          return false
        }
      })
    },
    // 导出
    exportExcel() {
      window.open(process.env.BASE_API + `/wyReportController/wyParamStatisticalExport?paramType=${this.paramType}&startTime=${this.startTime}&endTime=${this.endTime}&colorId=${this.colorId.join(',')}&colorSeries=${this.colorSeries.join(',')}&standardValue=${this.ruleForm.standardValue}`)
    }
  }
}
