
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import Chart from '@/components/Charts'
import { loadVisualError, loadVisualErrorDetail } from '@/api/baobiao/visualInspectionWrongSta'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      isChart: true, // 是否图表
      listLoading: false,
      beginDate: this.getLastMonthFirstDay(),
      endDate: this.getLastMonthEndDay(),
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
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: function(params) {
            return [
              params[0].name + ' : ',
              params[0].marker + ' ' + params[0].seriesName + ' : ' + params[0].value + '%'
            ].join('<br/>')
          }
        },
        calculable: false,
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: 'rgb(174, 174, 174)',
                width: 1
              },
              show: true
            },
            axisLabel: {
              formatter: '{value} %'
            },
            axisTick: {
              show: true,
              inside: true,
              length: 5,
              lineStyle: {
                color: 'rgb(174, 174, 174)'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: [],
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgb(174, 174, 174)',
                width: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '误判率',
            type: 'bar',
            itemStyle: {
              normal: {
                color: function(params) {
                  return '#009494'
                }
              }
            },
            barMaxWidth: 20,
            barMinHeight: 5,
            data: []
          }
        ],
        // color: ['rgb(51, 169, 169)'],
        animation: true,
        animationEasing: 'ElasticInOut',
        grid: {
          x: 50,
          y: 20,
          x2: 30,
          y2: 40
        }
      },
      tableList: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      waitNum: 0,
      testNum: 0,
      errorNum: 0,
      rate: 0,
      chartHeight: '0px'
    }
  },
  mounted() {
    this.getbartab()
    const docu = document.getElementById('bottomhi')
    this.chartHeight = (docu.clientHeight - 72) + 'px'
  },
  methods: {
    getNowFormatDate() {
      var today = new Date()
      return this.formatDate(today.getTime())
    },
    getNowFormatDates() {
      var today = new Date()
      return today
    },
    getSevenFormatDate() {
      var today = new Date()
      var SevenDayAgo = today - 86400 * 6 * 1000
      return SevenDayAgo
    },
    // 获取上个月第一天
    getLastMonthFirstDay() {
      const today = new Date()
      const Y = today.getFullYear()
      const M = today.getMonth()
      const resultDay = new Date(Y, M, 1)
      // var y = 1900 + resultDay.getYear()
      // var m = '0' + (resultDay.getMonth() + 1)
      // var d = '0' + resultDay.getDate()
      return resultDay
    },
    // 获取上个月最后一天
    getLastMonthEndDay() {
      const today = new Date()
      const Y = today.getFullYear()
      const M = today.getMonth()
      const endDay = new Date(Y, M + 1, 0)
      // var y = 1900 + endDay.getYear()
      // var m = '0' + (endDay.getMonth() + 1)
      // var d = '0' + endDay.getDate()
      return endDay
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    changeIsChart() {
      this.isChart = !this.isChart
      this.getInfo()
    },
    getbartab() {
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      loadVisualError(params).then(res => {
        if (res.data.data1[0] !== null) {
          this.waitNum = res.data.data1[0].waitNum
          this.testNum = res.data.data1[0].testNum
          this.errorNum = res.data.data1[0].errorNum
          this.rate = res.data.data1[0].rate
        }
        if (res.data.data2.length !== 0) {
          const datas = []
          const rates = []
          for (const item of res.data.data2) {
            datas.push(item.date)
            rates.push(parseFloat(item.errorRate.substring(0, item.errorRate.length - 1)))
          }
          this.options.xAxis[0].data = datas
          this.options.series[0].data = rates
        }
      })
    },
    getTable() {
      this.listLoading = true
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      loadVisualErrorDetail(params).then(res => {
        this.tableList = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    getInfo() {
      if (this.isChart) {
        this.getbartab()
      } else {
        this.getTable()
      }
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
    handleSearch() {
      this.pageNum = 1
      if (!this.isChart) {
        this.getbartab()
      }
      this.getInfo()
    },
    importExcel() {
      window.open(process.env.BASE_API + '/zlVisualAnalyzeController/exportVisualErrorDetail?startTime=' + this.formatDate(this.beginDate) + '&endTime=' + this.formatDate(this.endDate), '_blank')
    }
  }
}

