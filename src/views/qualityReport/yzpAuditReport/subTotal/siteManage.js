
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import Chart from '@/components/Charts'
import { selects } from '@/api/baobiao/subTotal'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      isChart: true, // 是否图表
      listLoading: false,
      pageNum: 0,
      pageSize: 10,
      totalPage: 500,
      beginDate: this.getSevenFormatDate(),
      endDate: this.getNowFormatDates(),
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
      options1: {
        grid: {
          bottom: 30,
          top: 40,
          left: 60,
          right: 60
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: function(params) {
            return [
              params[0].name + ': ',
              params[0].marker + ' ' + params[0].seriesName + ' : ' + params[0].value,
              params[1].marker + ' ' + params[1].seriesName + ' : ' + params[1].value
            ].join('<br/>')
          }
        },
        legend: {
          data: ['数量', '副品占比']
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
            name: '量'
          },
          {
            type: 'value',
            scale: true,
            name: '占比',
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            itemStyle: {
              color: '#009494'
            },
            barCateGoryGap: 20,
            data: []
          },
          {
            name: '副品占比',
            type: 'line',
            yAxisIndex: 1,
            itemStyle: {
              color: '#5268a5'
            },
            data: []
          }
        ]
      },
      tableList: [],
      substrateFindOptions: [],
      model: '',
      isActive: 1
    }
  },
  mounted() {
    this.getTableChar()
  },
  methods: {
    navClick(index) {
      this.isActive = index
      this.getTableChar()
    },
    clearAll() {
      this.beginDate = this.getSevenFormatDate()
      this.endDate = this.getNowFormatDates()
      this.getTableChar()
    },
    importExcel() {
      window.open(process.env.BASE_API + '/InventoryStatisticsOfAuxiliaryProducts/export?startTime=' + this.formatDate(this.beginDate) + '&endTime=' + this.formatDate(this.endDate) + '&filmType=' + this.isActive, '_blank')
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
    getTableChar() {
      this.listLoading = true
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        filmType: this.isActive
      }
      selects(params).then(res => {
        this.tableList = res.data
        const data = []
        const rknum = []
        const fpzb = []
        for (let i = 0; i < this.tableList.length - 1; i++) {
          data.push(this.tableList[i].createTime)
          rknum.push(this.tableList[i].rknum)
          fpzb.push(this.tableList[i].fpzb)
        }
        this.options1.xAxis[0].data = data
        this.options1.series[0].data = rknum
        this.options1.series[1].data = fpzb
        this.listLoading = false
      })
    }
  }
}

