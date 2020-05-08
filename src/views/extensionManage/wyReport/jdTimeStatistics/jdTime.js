import Chart from '@/components/Charts'
import PageHeaderLayout from '@/components/PageHeaderLayout'
import { findStandbyReason } from '@/api/extensionManage/wyBasicInfoManage/substrateBasicInfo/chipInfo'
import { queryChartData } from '@/api/extensionManage/wyReport/jdTimeStatistics'

export default {
  components: { PageHeaderLayout, Chart },
  data() {
    return {
      listLoading: false,
      showChart: true,
      list: [],
      reasons: [],
      tableColumn: [],
      standbyReasonOptions: [],
      beginDate: '',
      endDate: '',
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
      option: {
        title: {
          text: '稼动时间统计表',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
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
              <span>${params[i].data}分钟<br/>`
            }
            return str
          }
        },
        grid: {
          width: 'auto',
          left: 20,
          right: 50,
          bottom: 0,
          containLabel: true
        },
        legend: {
          data: ['场务影响', '开腔维护', '设备维护', '跟换MO源'],
          itemHeight: 8,
          top: '35'
        },
        xAxis: {
          name: '机台',
          show: true,
          type: 'category',
          axisTick: {
            alignWidthLabel: true
          },
          data: ['1#', '2#', '3#', '4#', '5#', '6#', '7#', '8#', '9#', '10#', '11#', '12#', '13#', '14#', '15#', '16#', '17#']
        },
        yAxis: [
          {
            type: 'value',
            name: '分钟',
            min: 0,
            position: 'left',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '场务影响',
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
            data: [10000, 12009, 23422, 12333, 1231, 34234, 655, 2133, 4435, 12355, 23444, 2211, 34222, 2700, 0, 1567, 2567]
          },
          {
            name: '开腔维护',
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
            data: [12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000, 8855, 12000, 12000, 12000]
          },
          {
            name: '设备维护',
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
            data: [8855, 8855, 8855, 8855, 8855, 8855, 8855, 8855, 8855, 8855, 8855, 8855, 8855, 8855, 23422, 8855, 8855]
          },
          {
            name: '跟换MO源',
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
            data: [3456, 12000, 23422, 23422, 23422, 23422, 23422, 23422, 23422, 23422, 23422, 23422, 23422, 23422, 23422, 23422, 22267]
          }
        ]
      }
    }
  },
  mounted() {
    this.fetchData()
    this.findStandbyReasonFun()
  },
  methods: {
    // 待机原因查询
    findStandbyReasonFun() {
      findStandbyReason().then(res => {
        this.standbyReasonOptions = res.data.list
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
    handleSearch() {
      this.fetchData()
    },
    clearAll() {
      this.beginDate = ''
      this.endDate = ''
      this.reasons = []
      this.fetchData()
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    sum(arr) {
      let sumNum = 0
      arr.map(item => {
        sumNum += item
      })
      return sumNum
    },
    // 导出
    handleExport() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/wyReportController/exportUpTime?reasonId=${this.reasons.join(',')}&startTime=${startTime}&endTime=${endTime}`)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        reasonId: this.reasons.join(','),
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      queryChartData(requestParams).then(res => {
        const legendData = []
        const series = {
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
          }
        }
        this.list = []
        res.data.series.map(item => {
          const obj = {}
          item.data.map((data, index) => {
            obj['column' + index] = data
          })
          obj.reason = item.name
          obj.total = this.sum(item.data)
          this.list.push(obj)
          legendData.push(item.name)
          item = Object.assign(item, series)
        })
        this.option.legend.data = legendData
        this.option.xAxis.data = res.data.machine
        this.option.series = res.data.series
        this.tableColumn = []
        res.data.machine.map((item, index) => {
          this.tableColumn.push({
            thName: item,
            thKey: 'column' + index
          })
        })
      })
    },
    handleSwitch() {
      this.showChart = !this.showChart
    }
  }
}

