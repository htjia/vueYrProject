
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import Chart from '@/components/Charts'
import { findScrapByWeek } from '@/api/baobiao/bfInspectionExceptions'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      isChart: true, // 是否图表
      listLoading: false,
      pageNum: 0,
      pageSize: 10,
      totalPage: 500,
      weekDate: new Date(),
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
            boundaryGap: true,
            data: []
          }
        ],
        series: [
          {
            name: '报废率',
            type: 'line',
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
      weekday: 0,
      tableList: []
    }
  },
  mounted() {
    this.getTableChar()
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
      const resultDay = new Date(Y, M - 1, 1)
      return resultDay
    },
    // 获取上个月最后一天
    getLastMonthEndDay() {
      const today = new Date()
      const Y = today.getFullYear()
      const M = today.getMonth()
      const endDay = new Date(Y, M, 0)
      return endDay
    },
    changeIsChart() {
      this.isChart = !this.isChart
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
    searchis() {
      console.log(this.weekDate)
      this.getTableChar()
    },
    getTableChar() {
      this.listLoading = true
      this.getWeek(this.weekDate)
      const params = {
        year: this.weekDate.getFullYear(),
        week: this.weekday
      }
      findScrapByWeek(params).then(res => {
        this.tableList = res.data
        const datas = []
        const rates = []
        for (const item of res.data) {
          datas.push(item.week)
          rates.push(parseFloat(item.rate.substring(0, item.rate.length - 1)))
        }
        this.options.xAxis[0].data = datas
        this.options.series[0].data = rates
        this.listLoading = false
      })
    },
    getInfo() {
      this.getTableChar()
    },
    sizeChange() {},
    currentChange() {},
    handleSearch() {
      this.getInfo()
    },
    jumpAny() {
      sessionStorage.setItem('weekday', this.weekDate.getFullYear() + '-' + this.weekday)
      this.$router.push({ path: '/qualityReport/fqcAndOqcReport/svInspectionExceptionsfx' })
    },
    importExcel() {
      window.open(process.env.BASE_API + '/zlVisualScrapController/exportScrapByWeek?year=' + this.weekDate.getFullYear() + '&week=' + this.weekday, '_blank')
    }
  }
}

