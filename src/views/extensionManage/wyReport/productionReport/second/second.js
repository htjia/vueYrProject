
import Chart from '@/components/Charts'
import { showWeeks, numFormat, getMonthDateRange } from '@/utils'
import { comprehensiveChart, comprehensiveTable } from '@/api/extensionManage/wyReport/productionReport/index'
export default {
  components: {
    Chart
  },
  props: ['extension', 'screenObj'],
  data() {
    const colors2 = ['#009494', '#5268a5', '#fcb586', '#8e99b1']
    return {
      isChart: true, // 是否图表
      month: '', // 月时间
      weekDate: '', // 周时间
      colorId: [], // 光色名称
      measureId: null, // 尺寸
      convert: false, // 是否折合
      substrateTypeId: [], // 衬底类型
      startTime: '', // 周起始时间
      endTime: '', // 周结束时间
      chartParams: {
        month: '', // 月时间
        startTime: '', // 周起始时间
        endTime: '' // 周结束时间
      },
      listLoading: false,
      tableList: [],
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endTimeVal = new Date(this.endTime).getTime()
          if (endTimeVal) {
            return time.getTime() > endTimeVal
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const startTimeVal = new Date(this.startTime).getTime()
          if (startTimeVal) {
            return time.getTime() < startTimeVal
          }
        }
      },
      objData: {},
      option: {
        color: colors2,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '20%',
          top: '15%',
          itemGap: 30,
          padding: 5,
          itemHeight: 8,
          itemWidth: 8,
          data: ['S', 'F', 'T', 'R']
        },
        series: [
          {
            name: '综合判定结果统计',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '60%'],
            center: ['30%', '50%'],
            label: {
              normal: {
                position: 'outside',
                formatter: '{c}'
              }
            },
            labelLine: {
              normal: {
                show: true,
                smooth: 0.2,
                length: 2
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
    init(clear) {
      this.convert = false
      this.colorId = []
      this.measureId = ''
      this.substrateTypeId = []
      const MM = (new Date().getMonth() + 1) > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
      this.month = new Date().getFullYear() + '-' + MM
      this.changeMonth(this.month)
      const obj = {
        dataType: this.extension,
        startTime: this.startTime,
        endTime: this.endTime
      }
      if (this.isChart) {
        obj.month = this.month ? this.month : null
        this.chartParams.dataType = obj.dataType
        this.chartParams.startTime = obj.startTime
        this.chartParams.endTime = obj.endTime
        this.chartParams.month = obj.month
        this.comprehensiveChart(this.chartParams)
      } else {
        obj.convert = this.convert ? this.convert : null
        obj.colorId = this.colorId.length ? this.colorId.join(',') : null
        obj.measureId = this.measureId ? this.measureId : null
        obj.substrateTypeId = this.substrateTypeId.length ? this.substrateTypeId.join(',') : null
        this.listLoading = false
        comprehensiveTable(obj).then(res => {
          this.tableList = res.data
          this.listLoading = false
        })
      }
    },
    // 查询数据
    comprehensiveChart(params) {
      comprehensiveChart(params).then(res => {
        this.objData = res.data
        res.data.level[0]['selected'] = true
        this.option.series[0].data = res.data.level
        console.log(this.option.series[0].data)
        let num = 0
        this.option.series[0].data.map(_ => {
          if (_.name !== 'R') {
            num += _.value
          }
        })
        this.objData.yieldRatio = res.data.yieldRatio ? res.data.yieldRatio : '0.00%'
        this.objData['fuctorNum'] = numFormat(num)
        this.objData.yield = numFormat(res.data.yield)
        this.objData.planNum = numFormat(res.data.planNum)
      })
    },
    // 周筛选
    changeWeek() {
      const a = this.$refs.weekval.displayValue.split(' ')
      this.startTime = showWeeks(a[0], a[2]).split(' ')[0]
      this.endTime = showWeeks(a[0], a[2]).split(' ')[1]
      this.month = ''
      this.chartParams = {
        startTime: this.startTime,
        endTime: this.endTime,
        month: this.month,
        dataType: this.extension
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
    // 切换视图
    changeIsChart() {
      this.isChart = !this.isChart
      if (this.isChart) {
        this.startTime = this.chartParams.startTime
        this.endTime = this.chartParams.endTime
      } else {
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
        startTime: this.startTime ? this.startTime : null,
        endTime: this.endTime ? this.endTime : null,
        convert: this.convert ? this.convert : null
      }
      if (this.isChart) {
        obj.month = this.month
        this.chartParams = { ...obj }
        this.comprehensiveChart(this.chartParams)
      } else {
        obj.colorId = this.colorId.length ? this.colorId.join(',') : null
        obj.measureId = this.measureId ? this.measureId : null
        obj.substrateTypeId = this.substrateTypeId.length ? this.substrateTypeId.join(',') : null
        this.listLoading = false
        comprehensiveTable(obj).then(res => {
          this.tableList = res.data
          this.listLoading = false
        })
      }
    },
    // 导出
    exportExcel() {
      window.open(process.env.BASE_API + `/wyReportController/comprehensiveTableExport?dataType=${this.extension}&startTime=${this.startTime}&exportType=0&endTime=${this.endTime}&convert=${this.convert}&colorId=${this.colorId.join(',')}&measureId=${this.measureId}&substrateTypeId=${this.substrateTypeId.join(',')}`)
    }
  }
}
