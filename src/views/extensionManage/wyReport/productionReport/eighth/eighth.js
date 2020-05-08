
import Chart from '@/components/Charts'
import { showWeeks, getMonthDateRange } from '@/utils'
import { lightIntensityDate, lightIntensityMachine, lightIntensityRun, lightIntensityTable } from '@/api/extensionManage/wyReport/productionReport/index'
export default {
  components: {
    Chart
  },
  props: ['extension', 'screenObj'],
  data() {
    return {
      isChart: true,
      colorSeries: [], // 光色系列
      colorId: [], // 光色名称
      measureId: '', // 尺寸
      machineId: '', // 机台
      month: '', // 月时间
      weekDate: '', // 周时间
      startTime: '', // 周起始时间
      endTime: '', // 周结束时间
      structureTypeList: [], // 光色名称（筛选后的）
      chartParams: {
        colorSeries: [], // 光色系列
        colorId: [], // 光色名称
        measureId: '', // 尺寸
        machineId: '',
        month: '', // 月时间
        startTime: '', // 周起始时间
        endTime: '' // 周结束时间
      },
      listLoading: false,
      tableList: [],
      objData: {},
      day: '',
      pageNum: 1,
      pageSize: 15,
      totalPage: '',
      spanArr: [],
      position: 0,
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
          text: '按日期查看光强',
          left: '45%',
          top: 25
        },
        color: '#009494',
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          width: 'auto',
          left: 0,
          right: 10,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          name: '日期',
          type: 'category',
          axisTick: {
            alignWidthLabel: true
          },
          data: []
        },
        yAxis: [
          {
            type: 'value',
            name: 'PL_I.I',
            nameTextStyle: {
              padding: [0, 0, 0, 30]
            },
            min: 0,
            position: 'left',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: 'PL_I.I',
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
          }
        ]
      },
      option1: {
        title: {
          text: '按机台查看光强',
          left: '45%',
          top: 25
        },
        color: '#5268a5',
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          width: 'auto',
          left: 0,
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
            name: 'PL_I.I',
            min: 0,
            nameTextStyle: {
              padding: [0, 0, 0, 30]
            },
            position: 'left',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: 'PL_I.I',
            type: 'bar',
            barWidth: 20,
            label: {
              show: true,
              position: 'top'
            },
            data: []
          }
        ]
      },
      option2: {
        title: {
          text: '按Run次查看光强',
          left: '45%',
          top: 25
        },
        color: '#fcb586',
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          width: 'auto',
          left: 0,
          right: 50,
          bottom: 20,
          containLabel: true
        },

        xAxis: {
          name: 'Run次',
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
            name: 'PL_I.I',
            min: 0,
            nameTextStyle: {
              padding: [0, 0, 0, 30]
            },
            position: 'left',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: 'PL_I.I',
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
    machineId(val) {
      console.log(val)
    }

  },
  methods: {
    // 初始化筛选条件
    init() {
      this.colorSeries = []
      this.colorId = []
      this.measureId = ''
      const MM = (new Date().getMonth() + 1) > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
      this.month = new Date().getFullYear() + '-' + MM
      this.machineId = this.chartParams.machineId
      this.changeMonth(this.month)
      const obj = {
        dataType: this.extension,
        colorSeries: this.colorSeries,
        colorId: this.colorId,
        measureId: this.measureId,
        startTime: this.startTime,
        endTime: this.endTime
      }
      obj.month = this.month
      this.chartParams = { ...obj }
      this.chartParams.machineId = this.machineId
      if (this.isChart) {
        this.lightIntensityDate(this.chartParams)
      } else {
        this.getTable()
      }
    },
    // 生成一个与行数相同的数组记录每一行设置的合并数
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1) // 用于存放每一行记录的合并数
          this.position = 0 // pos是spanArr的索引
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].machineCode === data[i - 1].machineCode) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
            this.spanArr[this.position] += 1
            this.spanArr.push(0) // 0 即表示该行不显示
          } else {
            this.spanArr.push(1)
            this.position = i
          }
        }
      }
      return this.spanArr
    },
    // 合并列
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
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
    // 按日期查看光强
    lightIntensityDate(params) {
      const newObj = { ...params }
      newObj.colorSeries = params.colorSeries.toString()
      newObj.colorId = params.colorId.toString()
      lightIntensityDate(newObj).then(res => {
        this.objData = res.data
        this.option.xAxis.data = this.objData.time
        this.option.series[0].data = this.objData.plIi
        this.arqClick(0, this.objData.time[0])
      })
    },
    // 切换视图
    changeIsChart() {
      this.isChart = !this.isChart
      if (this.isChart) {
        this.colorSeries = this.chartParams.colorSeries
        this.colorId = this.chartParams.colorId
        this.measureId = this.chartParams.measureId
        this.month = this.chartParams.month
        this.startTime = this.chartParams.startTime
        this.endTime = this.chartParams.endTime
        this.ajtClick(0, this.option1.xAxis.data[0])
      } else {
        this.chartParams.colorSeries = this.colorSeries
        this.chartParams.colorId = this.colorId
        this.chartParams.measureId = this.measureId
        this.chartParams.month = this.month
        this.chartParams.startTime = this.startTime
        this.chartParams.endTime = this.endTime
      }
      this.chartParams.machineId = this.machineId
      this.getTable()
    },
    // 获取表格数据
    getTable() {
      const params = {
        colorSeries: this.colorSeries.join(','),
        colorId: this.colorId.join(','),
        measureId: this.measureId,
        machineId: this.machineId,
        startTime: this.startTime,
        endTime: this.endTime,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.listLoading = true
      lightIntensityTable(params).then(res => {
        this.tableList = res.data.list
        this.getSpanArr(res.data.list)
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 获取光色名称
    findColorType(val) {
      if (val) {
        this.structureTypeList = val.length ? (this.screenObj.structureTypeList.filter(item => val.indexOf(item.series) > -1)) : this.screenObj.structureTypeList
      }
      this.colorId = []
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.getTable()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.getTable()
    },
    // 点击第一个柱状图获得第二个柱状图的值
    arqClick(e, val) {
      const obj = {
        colorSeries: this.colorSeries.join(','),
        colorId: this.colorId.join(','),
        measureId: this.measureId,
        day: e ? (this.chartParams.month + '-' + e.name) : (this.chartParams.month + '-' + val)
      }
      this.day = obj.day
      lightIntensityMachine(obj).then(res => {
        this.option1.xAxis.data = res.data.machine
        this.option1.series[0].data = res.data.plIi
        this.ajtClick(0, res.data.machine[0])
      })
    },
    // 点击第二个柱状拿到第三个
    ajtClick(e, val) {
      const obj = {
        colorSeries: this.colorSeries.join(','),
        colorId: this.colorId.join(','),
        measureId: this.measureId,
        day: this.day,
        machineId: e ? e.name : val
      }
      this.machineId = obj.machineId
      lightIntensityRun(obj).then(res => {
        this.option2.xAxis.data = res.data.runId
        this.option2.series[0].data = res.data.plIi
        if (this.option2.series[0].data.length > 10) {
          this.option2.dataZoom = [
            {
              type: 'slider',
              show: true,
              start: 0,
              end: 10,
              height: 14,
              bottom: 0
            }
          ]
        }
      })
    },
    // 重置第一批数据的筛选结果
    clearCondition() {
      this.init()
    },
    // 查询第一批数据的筛选结果
    fetchData() {
      const obj = {
        dataType: this.extension,
        colorSeries: this.colorSeries.join(','),
        colorId: this.colorId.join(','),
        measureId: this.measureId,
        startTime: this.startTime,
        endTime: this.endTime
      }
      if (this.isChart) {
        obj.month = this.month
        this.lightIntensityDate(obj)
      } else {
        console.log(this.chartParams.machineId)

        this.getTable()
      }
    },
    exportExcel() {
      window.open(process.env.BASE_API + `/wyReportController/lightIntensityTableExport?dataType=${this.extension}&startTime=${this.startTime}&endTime=${this.endTime}&machineId=${this.machineId}&colorId=${this.colorId.join(',')}&measureId=${this.measureId}&colorSeries=${this.colorSeries.join(',')}`)
    }
  }
}
