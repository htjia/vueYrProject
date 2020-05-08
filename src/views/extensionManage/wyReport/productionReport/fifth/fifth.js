
import Chart from '@/components/Charts'
import { showWeeks, getMonthDateRange } from '@/utils'
import { colorSizeQualified, colorSizeQualifiedTable } from '@/api/extensionManage/wyReport/productionReport/index'
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
      measureId: '', // 尺寸
      colorId: '', // 光色名称
      colorSeries: '', // 光色系列
      manyLevel: '', // 等级
      convert: false, // 是否折合
      month: '', // 月时间
      weekDate: '', // 周时间
      startTime: '', // 周起始时间
      endTime: '', // 周结束时间
      validationFilm: '', // 验证片
      machineId: '', // 机台
      chartParams: {
        measureId: '', // 尺寸
        colorId: '', // 光色名称
        colorSeries: '', // 光色系列
        manyLevel: '', // 等级
        convert: false, // 是否折合
        month: '', // 月时间
        weekDate: '', // 周时间
        startTime: '', // 周起始时间
        endTime: '', // 周结束时间
        validationFilm: '' // 验证片
      },
      listLoading: false,
      tableList: [],
      objData: {},
      spanArr: [],
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
          data: ['S', 'F', 'T', 'R'],
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
        series: [
          {
            name: 'S',
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
                  formatter: '{a}',
                  show: true
                }
              }
            },
            data: []
          },
          {
            name: 'F',
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
                  formatter: '{a}',
                  show: true
                }
              }
            },
            data: []
          },
          {
            name: 'T',
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
                  formatter: '{a}',
                  show: true
                }
              }
            },
            data: []
          },
          {
            name: 'R',
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
                  formatter: '{a}',
                  show: true
                }
              }
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
      this.colorSeries = []
      this.colorId = []
      this.colorId = []
      this.manyLevel = ''
      this.measureId = ''
      this.validationFilm = ''
      const MM = (new Date().getMonth() + 1) > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
      this.month = new Date().getFullYear() + '-' + MM
      this.changeMonth(this.month)
      const obj = {
        dataType: this.extension,
        startTime: this.startTime,
        endTime: this.endTime
      }
      if (this.isChart) {
        obj.manyLevel = this.manyLevel
        obj.convert = this.convert
        obj.colorSeries = this.colorSeries
        obj.colorId = this.colorId
        obj.month = this.month
        obj.measureId = this.measureId
        obj.validationFilm = this.validationFilm
        this.chartParams = { ...obj }
        this.colorSizeQualified(this.chartParams)
      } else {
        obj.machineId = this.machineId
        this.listLoading = false
        this.colorSizeQualifiedTable(obj)
      }
    },
    // 生成一个与行数相同的数组记录每一行设置的合并数
    getSpanArr(data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1) // 用于存放每一行记录的合并数
          this.pos = 0 // pos是spanArr的索引
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].measure === data[i - 1].measure) { // 则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１
            this.spanArr[this.pos] += 1
            this.spanArr.push(0) // 0 即表示该行不显示
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
      return this.spanArr
    },
    // 合并列
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === this.tableList.length - 1 || rowIndex === this.tableList.length - 2 || rowIndex === this.tableList.length - 3) {
          return [1, 2]
        }
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      } else if (columnIndex === 1) {
        if (rowIndex === this.tableList.length - 1 || rowIndex === this.tableList.length - 2 || rowIndex === this.tableList.length - 3) {
          return [0, 0]
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
    colorSizeQualified(params) {
      let obj = {}
      obj = { ...this.chartParams }
      obj.colorId = this.chartParams.colorId.toString()
      obj.colorSeries = this.chartParams.colorSeries.toString()
      colorSizeQualified(obj).then(res => {
        this.objData = res.data
        this.option.xAxis.data = this.objData.machine
        this.option.series[0].data = this.objData.S
        this.option.series[1].data = this.objData.F
        this.option.series[2].data = this.objData.T
        this.option.series[3].data = this.objData.R
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
        this.month = this.chartParams.month
        this.startTime = this.chartParams.startTime
        this.endTime = this.chartParams.endTime
      } else {
        this.chartParams.month = this.month
        this.chartParams.startTime = this.startTime
        this.chartParams.endTime = this.endTime
      }
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
        endTime: this.endTime
        // 还有一个验证片
      }
      if (this.isChart) {
        obj.convert = this.convert
        obj.colorSeries = this.colorSeries
        obj.colorId = this.colorId
        obj.measureId = this.measureId
        obj.manyLevel = this.manyLevel
        obj.month = this.month
        obj.validationFilm = this.validationFilm
        this.chartParams = { ...obj }
        let newObj = {}
        newObj = { ...this.chartParams }
        newObj.colorSeries = this.chartParams.colorSeries.toString()
        newObj.colorId = this.chartParams.colorId.toString()
        this.colorSizeQualified(newObj)
      } else {
        obj.machineId = this.machineId
        this.listLoading = false
        this.colorSizeQualifiedTable(obj)
        // 列表数据还没有接口
      }
    },
    colorSizeQualifiedTable(obj) {
      colorSizeQualifiedTable(obj).then(res => {
        this.tableList = res.data
        this.getSpanArr(res.data)
        this.listLoading = false
      })
    },
    // 导出
    exportExcel() {
      window.open(process.env.BASE_API + `/wyReportController/colorSizeQualifiedTableExport?dataType=${this.extension}&startTime=${this.startTime}&endTime=${this.endTime}&machineId=${this.machineId}`)
    }
  }
}
