
import Chart from '@/components/Charts'
import { showWeeks, getMonthDateRange } from '@/utils'
import { getMjHead, visualInspectionResultChart, visualInspectionResultTable } from '@/api/extensionManage/wyReport/productionReport/index'
export default {
  components: {
    Chart
  },
  props: ['extension', 'screenObj'],
  data() {
    const colors4 = ['#009494', '#5268a5', '#fcb586', '#8e99b1']
    return {
      isChart: true,
      measureId: '', // 尺寸
      visualResult: '', // 目检结果
      machineId: '', // 机台
      convert: false, // 是否折合
      month: '', // 月时间
      weekDate: '', // 周时间
      startTime: '', // 周起始时间
      endTime: '', // 周结束时间
      chartParams: {
        measureId: '', // 尺寸
        visualResult: '', // 目检结果
        convert: false, // 是否折合
        month: '', // 月时间
        startTime: '', // 周起始时间
        endTime: '' // 周结束时间
      },
      listLoading: false,
      tableList: [],
      tableHead: [], // 表头信息
      objData: {},
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
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
              <span>${params[i].data}%<br/>`
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
          data: ['优', '良', '次', '差'],
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
            barWidth: '24',
            name: '占比',
            min: 0,
            max: 100,
            nameTextStyle: {
              padding: [0, 0, 0, 30]
            },
            position: 'left',
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '优',
            type: 'bar',
            barWidth: '24',
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
            name: '良',
            type: 'bar',
            barWidth: '24',
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
            name: '次',
            type: 'bar',
            barWidth: '24',
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
            name: '差',
            type: 'bar',
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
      this.visualResult = ''
      this.measureId = ''
      this.machineId = ''
      this.pageNum = 1
      this.pageSize = 15
      const MM = (new Date().getMonth() + 1) > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
      this.month = new Date().getFullYear() + '-' + MM
      this.changeMonth(this.month)
      const obj = {
        dataType: this.extension,
        convert: this.convert,
        startTime: this.startTime,
        endTime: this.endTime,
        measureId: this.measureId
      }
      if (this.isChart) {
        obj.visualResult = this.visualResult
        obj.month = this.month
        this.chartParams = { ...obj }
        this.visualInspectionResultChart(this.chartParams)
      } else {
        obj.machineId = this.machineId
        obj.pageNum = this.pageNum
        obj.pageSize = this.pageSize
        visualInspectionResultTable(obj).then(res => {
          this.tableList = res.data.list
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
    visualInspectionResultChart(params) {
      let obj = {}
      obj = { ...this.chartParams }
      obj.visualResult = this.chartParams.visualResult
      visualInspectionResultChart(obj).then(res => {
        this.objData = res.data
        if (this.objData) {
          const list = []
          this.screenObj.visualList.map(_ => {
            if (list.indexOf(_.name) === -1) {
              list.push(_.name)
            }
          })
          this.option.legend.data = list
          this.option.xAxis.data = this.objData.machine
          this.option.series[0].name = this.option.legend.data[0]
          this.option.series[1].name = this.option.legend.data[1]
          this.option.series[2].name = this.option.legend.data[2]
          this.option.series[3].name = this.option.legend.data[3]
          this.option.series[0].data = this.objData.excellent
          this.option.series[1].data = this.objData.good
          this.option.series[2].data = this.objData.middle
          this.option.series[3].data = this.objData.bad
        }
      })
    },
    // 切换视图
    changeIsChart() {
      this.isChart = !this.isChart
      if (this.isChart) {
        this.month = this.chartParams.month
        this.startTime = this.chartParams.startTime
        this.endTime = this.chartParams.endTime
        this.measureId = this.chartParams.measureId
        this.visualResult = this.chartParams.visualResult
        this.convert = this.chartParams.convert
        this.visualResult = this.chartParams.visualResult
      } else {
        this.chartParams.month = this.month
        this.chartParams.startTime = this.startTime
        this.chartParams.endTime = this.endTime
        this.chartParams.visualResult = this.visualResult
        this.machineId = ''
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
        convert: this.convert,
        startTime: this.startTime,
        endTime: this.endTime,
        measureId: this.measureId
      }
      if (this.isChart) {
        obj.month = this.month
        obj.visualResult = this.visualResult
        this.chartParams = { ...obj }
        this.visualInspectionResultChart(this.chartParams)
      } else {
        getMjHead().then(res => {
          // 处理动态表头数据
          // const tagList = []
          // res.data.map(_ => {
          //   const tag = _.split('(')[0]
          //   if (tagList.indexOf(tag) === -1) tagList.push(tag)
          // })
          // const realTagList = tagList.map(name => ({ name, children: [] }))
          // for (const i in realTagList) {
          //   const mes = res.data.filter(_ => _.split('(')[0] === realTagList[i].name)
          //   if (mes) realTagList[i].children.push.apply(realTagList[i].children, mes.map(_ => _.slice(_.indexOf('(') + 1, _.indexOf(')'))))
          // }
          this.tableHead = res.data
        })
        this.getTableList(obj)
      }
    },
    // 获取当前表格数据
    getTableList(obj) {
      this.listLoading = false
      obj.pageNum = this.pageNum
      obj.pageSize = this.pageSize
      obj.machineId = this.machineId
      visualInspectionResultTable(obj).then(res => {
        this.tableList = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
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
    // 导出
    exportExcel() {
      window.open(process.env.BASE_API + `/wyReportController/visualInspectionResultTableExport?dataType=${this.extension}&convert=${this.convert}&startTime=${this.startTime}&endTime=${this.endTime}&measureId=${this.measureId}&machineId=${this.machineId}&month=${this.month}`)
    }
  }
}
