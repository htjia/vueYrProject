
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import Chart from '@/components/Charts'
import { substrateFindList } from '@/api/extensionManage/synthesizeJudgment/synthesizeJudgment'
import { findDataByDay, findDataByWeek, findReason, findData, findDataByMachine } from '@/api/baobiao/svInspectionExceptions'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      isChart: true, // 是否图表
      listLoading: false,
      pageNum: 0,
      pageSize: 10,
      totalPage: 500,
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
        grid: {
          bottom: 30,
          right: 60,
          top: 40,
          left: 60
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: function(params) {
            return [
              params[0].name + ' : ',
              params[0].marker + ' ' + params[0].seriesName + ' : ' + params[0].value,
              params[1].marker + ' ' + params[1].seriesName + ' : ' + params[1].value + '%'
            ].join('<br/>')
          }
        },
        legend: {
          data: ['生产数量', '比例']
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: '数量'
          },
          {
            type: 'value',
            scale: true,
            name: '比例',
            axisLabel: {
              formatter: '{value} %'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '生产数量',
            type: 'bar',
            barWidth: 20,
            data: []
          },
          {
            name: '比例',
            type: 'line',
            yAxisIndex: 1,
            itemStyle: {
              color: '#009494'
            },
            data: []
          }
        ]
      },
      options1: {
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
            axisTick: {
              show: true,
              inside: true,
              length: 5,
              lineStyle: {
                color: 'rgb(174, 174, 174)'
              }
            },
            axisLabel: {
              formatter: '{value} %'
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
            name: '比例',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            itemStyle: {
              color: '#009494'
            },
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
      options2: {
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
            axisTick: {
              show: true,
              inside: true,
              length: 5,
              lineStyle: {
                color: 'rgb(174, 174, 174)'
              }
            },
            axisLabel: {
              formatter: '{value} %'
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
            name: '比例',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            itemStyle: {
              color: '#009494'
            },
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
      substrateFindOptions: [],
      substrate: '',
      reason: '',
      reasonName: '',
      reasonLists: [],
      weekDate: new Date(),
      isActive: 0,
      isRun: 0,
      weekday: 0,
      chartHeight: '0px'
    }
  },
  mounted() {
    this.reasonQuery()
    this.substrateFindList()
    const docu = document.getElementById('bottomhi')
    this.chartHeight = (docu.clientHeight - 72) + 'px'
  },
  methods: {
    navClick(index) {
      this.isActive = index
    },
    substrateFindList() {
      substrateFindList().then(res => {
        this.substrateFindOptions = res.data
      })
    },
    reasonQuery() {
      findReason().then(res => {
        this.reasonLists = res.data
        this.reason = res.data[0].id
        this.reasonName = res.data[0].name
        this.getInfo()
      })
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
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
      return resultDay
    },
    // 获取上个月最后一天
    getLastMonthEndDay() {
      const today = new Date()
      const Y = today.getFullYear()
      const M = today.getMonth()
      const endDay = new Date(Y, M + 1, 0)
      return endDay
    },
    changeIsChart() {
      this.isChart = !this.isChart
      this.getInfo()
    },
    getTableChar() {
      this.listLoading = true
      const year = this.weekDate.getFullYear()
      const month = this.weekDate.getMonth()
      const weekday = this.weekDate.getDay() || 7
      const params = {
        reasonId: this.reason,
        startTime: this.formatDate(new Date(year, month, (this.weekDate.getDate() - weekday + 1))),
        endTime: this.formatDate(new Date(year, month, (this.weekDate.getDate() - weekday + 1) + 6)),
        convert: this.isRun ? '1' : '0',
        measure: this.substrate
      }
      findDataByDay(params).then(res => {
        const datas = []
        const rates = []
        for (const item of res.data) {
          datas.push(item.date)
          rates.push(parseFloat(item.rate))
        }
        this.options1.xAxis[0].data = datas
        this.options1.series[0].data = rates
        this.listLoading = false
      })
      findDataByMachine(params).then(res => {
        const datas = []
        const data1 = []
        const data2 = []
        for (const item of res.data) {
          datas.push(item.machine)
          data1.push(item.num)
          data2.push(item.rate)
        }
        this.options.xAxis[0].data = datas
        this.options.series = []
        this.options.series.push({
          name: '生产数量',
          type: 'bar',
          barMaxWidth: 20,
          barMinHeight: 5,
          itemStyle: {
            color: '#009494'
          },
          data: data1
        })
        this.options.series.push({
          name: '比例',
          type: 'line',
          yAxisIndex: 1,
          itemStyle: {
            color: '#5268a5'
          },
          data: data2
        })
        this.listLoading = false
      })
      this.getWeek(this.weekDate)
      const params1 = {
        reasonId: this.reason,
        year: this.weekDate.getFullYear(),
        week: this.weekday,
        convert: this.isRun ? '1' : '0',
        measure: this.substrate
      }
      findDataByWeek(params1).then(res => {
        const datas = []
        const rates = []
        for (const item of res.data) {
          datas.push(item.date)
          rates.push(parseFloat(item.rate))
        }
        this.options2.xAxis[0].data = datas
        this.options2.series[0].data = rates
        this.listLoading = false
      })
    },
    getWeek(wek) {
      let firstDay = new Date(wek.getFullYear(), 0, 1)
      const dayweek = firstDay.getDay()
      let spendDay = 1
      if (wek.getFullYear() === firstDay.getFullYear()) {
        if (dayweek !== 0) {
          spendDay = 7 - dayweek + 1
        }
      } else {
        spendDay = 7 - dayweek
      }
      firstDay = new Date(wek.getFullYear(), 0, spendDay)
      const d = Math.ceil((wek.valueOf() - firstDay.valueOf()) / 86400000)
      const result = Math.ceil(d / 7)
      this.weekday = result + 1
    },
    getTable() {
      this.listLoading = true
      const year = this.weekDate.getFullYear()
      const month = this.weekDate.getMonth()
      const weekday = this.weekDate.getDay() || 7
      const params = {
        reasonId: this.reason,
        startTime: this.formatDate(new Date(year, month, (this.weekDate.getDate() - weekday + 1))),
        endTime: this.formatDate(new Date(year, month, (this.weekDate.getDate() - weekday + 1) + 6)),
        convert: this.isRun ? '1' : '0',
        measure: this.substrate
      }
      findData(params).then(res => {
        this.tableList = res.data
        this.listLoading = false
      })
    },
    getInfo() {
      if (this.isChart) {
        this.getTableChar()
      } else {
        this.getTable()
      }
    },
    sizeChange() {},
    currentChange() {},
    handleSearch() {
      this.getReasonName()
      this.getInfo()
    },
    getReasonName() {
      for (const item of this.reasonLists) {
        if (item.id === this.reason) {
          this.reasonName = item.name
          break
        }
      }
    },
    importExcel() {
      const year = this.weekDate.getFullYear()
      const month = this.weekDate.getMonth()
      const day = this.weekDate.getDate()
      window.open(process.env.BASE_API + '/zlVisualAbnormalController/export?startTime=' + this.formatDate(new Date(year, month, day)) + '&endTime=' + this.formatDate(new Date(year, month, day + 6)) + '&reasonId=' +
      this.reason + '&convert=' + (this.isRun ? '1' : '0') + '&measure=' + this.substrate, '_blank')
    }
  }
}

