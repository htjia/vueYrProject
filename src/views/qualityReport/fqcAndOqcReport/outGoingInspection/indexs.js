
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import Chart from '@/components/Charts'
import { loadFacade, loadInStorage, loadOutStorage } from '@/api/baobiao/outGoingInspection'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      isChart: true, // 是否图表
      listLoading: false,
      pageNum: 0,
      pageSize: 10,
      totalPage: 500,
      monthDate: new Date(),
      weekDate: '',
      beginDate: '',
      endDate: '',
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
              params[1].marker + ' ' + params[1].seriesName + ' : ' + params[1].value,
              params[2].marker + ' ' + params[2].seriesName + ' : ' + params[2].value + '%'
            ].join('<br/>')
          }
        },
        legend: {
          data: []
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
            name: '片数'
          },
          {
            type: 'value',
            scale: true,
            name: '合格率',
            axisLabel: {
              formatter: '{value} %'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: []
      },
      isActive: 0,
      tableList: [],
      dataNum: 0,
      monthNum: 0,
      yearNum: 0,
      dateList: [],
      list: []
    }
  },
  mounted() {
    this.getHeader()
  },
  methods: {
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    getTable() {
      this.listLoading = true
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      if (this.isActive === 0) {
        this.tableList = [
          {
            type: '入库总片数'
          },
          {
            type: '总不良片数'
          },
          {
            type: '检验合格率'
          }
        ]
        loadInStorage(params).then(res => {
          this.list = res.data
          const datas = []
          const rates = []
          const data1 = []
          const data2 = []
          for (const item of res.data) {
            datas.push(item.date)
            data1.push(item.total)
            data2.push(item.errorNum)
            rates.push(parseFloat(item.rate.substring(0, item.rate.length - 1)))
          }
          this.options.legend.data = ['入库总片数', '总不良片数', '检验合格率']
          this.options.xAxis[0].data = datas
          this.options.series = []
          // '#5268a5', '#fcb586'
          this.options.series.push({
            name: '入库总片数',
            type: 'bar',
            stack: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            itemStyle: {
              color: '#009494'
            },
            data: data1
          })
          this.options.series.push({
            name: '总不良片数',
            type: 'bar',
            stack: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            itemStyle: {
              color: '#fcb586'
            },
            data: data2
          })
          this.options.series.push({
            name: '检验合格率',
            type: 'line',
            yAxisIndex: 1,
            itemStyle: {
              color: '#5268a5'
            },
            data: rates
          })
          this.listLoading = false
        })
      } else if (this.isActive === 1) {
        this.tableList = [
          {
            type: '抽检总片数'
          },
          {
            type: '外观误判片数'
          },
          {
            type: '检验合格率'
          }
        ]
        loadFacade(params).then(res => {
          this.list = res.data
          const datas = []
          const rates = []
          const data1 = []
          const data2 = []
          for (const item of res.data) {
            datas.push(item.date)
            data1.push(item.total)
            data2.push(item.errorNum)
            rates.push(parseFloat(item.rate.substring(0, item.rate.length - 1)))
          }
          this.options.legend.data = ['抽检总片数', '外观误判片数', '检验合格率']
          this.options.xAxis[0].data = datas
          this.options.series = []
          this.options.series.push({
            name: '抽检总片数',
            type: 'bar',
            stack: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            itemStyle: {
              color: '#009494'
            },
            data: data1
          })
          this.options.series.push({
            name: '外观误判片数',
            type: 'bar',
            stack: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            itemStyle: {
              color: '#fcb586'
            },
            data: data2
          })
          this.options.series.push({
            name: '检验合格率',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            itemStyle: {
              color: '#5268a5'
            },
            data: rates
          })
          this.listLoading = false
        })
      } else if (this.isActive === 2) {
        this.tableList = [
          {
            type: '出库总片数'
          },
          {
            type: '总不良片数'
          },
          {
            type: '检验合格率'
          }
        ]
        loadOutStorage(params).then(res => {
          this.list = res.data
          const datas = []
          const rates = []
          const data1 = []
          const data2 = []
          for (const item of res.data) {
            datas.push(item.date)
            data1.push(item.total)
            data2.push(item.errorNum)
            rates.push(parseFloat(item.rate.substring(0, item.rate.length - 1)))
          }
          this.options.legend.data = ['出库总片数', '总不良片数', '检验合格率']
          this.options.xAxis[0].data = datas
          this.options.series = []
          this.options.series.push({
            name: '出库总片数',
            type: 'bar',
            stack: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            itemStyle: {
              color: '#009494'
            },
            data: data1
          })
          this.options.series.push({
            name: '总不良片数',
            type: 'bar',
            stack: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            itemStyle: {
              color: '#fcb586'
            },
            data: data2
          })
          this.options.series.push({
            name: '检验合格率',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            itemStyle: {
              color: '#5268a5'
            },
            data: rates
          })
          this.listLoading = false
        })
      }
    },
    importExcel() {
      if (this.isActive === 0) {
        window.open(process.env.BASE_API + '/zlVisualAnalyzeController/exportInStorage?startTime=' + this.formatDate(this.beginDate) + '&endTime=' + this.formatDate(this.endDate), '_blank')
      } else if (this.isActive === 1) {
        window.open(process.env.BASE_API + '/zlVisualAnalyzeController/exportFacade?startTime=' + this.formatDate(this.beginDate) + '&endTime=' + this.formatDate(this.endDate), '_blank')
      } else if (this.isActive === 2) {
        window.open(process.env.BASE_API + '/zlVisualAnalyzeController/exportOutStorage?startTime=' + this.formatDate(this.beginDate) + '&endTime=' + this.formatDate(this.endDate), '_blank')
      }
    },
    getTableChar() {
      // const params = {}
      // demoMujianTable(params).then(res => {
      //   console.log(1)
      //   this.tableList = res.table
      //   this.options.series[0].data = res.chart
      // })
    },
    getInfo() {
      this.getTableChar()
    },
    sizeChange() {},
    currentChange() {},
    handleSearch() {
      this.getHeader()
    },
    navClick(index) {
      this.isActive = index
      this.getHeader()
    },
    monthset() {
      if (this.monthDate !== '' && this.monthDate !== null) {
        this.weekDate = ''
      }
    },
    weekset() {
      if (this.weekDate !== '' && this.weekDate !== null) {
        this.monthDate = ''
      }
    },
    getHeader() {
      if (this.monthDate !== '') {
        const year = this.monthDate.getFullYear()
        const month = this.monthDate.getMonth() + 1
        const data = new Date(year, month, 0).getDate()
        this.beginDate = new Date(year, month - 1, 1)
        this.endDate = new Date(year, month - 1, data)
        this.setDataNum(year, month, 1, data, data)
      } else {
        const year = this.weekDate.getFullYear()
        const month = this.weekDate.getMonth() + 1
        const day = this.weekDate.getDate()
        const data = new Date(year, month, 0).getDate()
        this.beginDate = new Date(year, month - 1, day)
        this.endDate = new Date(year, month - 1, day + 6)
        this.setDataNum(year, month, day, day + 6, data)
      }
      this.getTable()
    },
    setDataNum(year, month, minnum, maxnum, maxdata) {
      this.dataNum = maxnum
      this.monthNum = month
      this.yearNum = year
      this.dateList = []
      for (let i = minnum; i <= this.dataNum; i++) {
        let day = 0
        if (i > 9) {
          if (i > maxdata) {
            day = i - maxdata
            if (day < 10) {
              day = '0' + day
            }
          } else {
            day = i
          }
        } else {
          if (i > maxdata) {
            day = '0' + (i - maxdata)
          } else {
            day = '0' + i
          }
        }
        let ms = 0
        if (this.monthNum > 9) {
          if (i > maxdata) {
            ms = this.monthNum + 1
          } else {
            ms = this.monthNum
          }
        } else {
          if (i > maxdata) {
            ms = '0' + (this.monthNum + 1)
          } else {
            ms = '0' + this.monthNum
          }
        }
        this.dateList.push({
          data: i,
          label: ms + '月' + day + '日'
        })
      }
      console.log(this.dateList)
    }
  }
}

