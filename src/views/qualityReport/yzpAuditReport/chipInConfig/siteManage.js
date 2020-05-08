
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { selectFp, selectYp } from '@/api/baobiao/chipInConfig'
import Chart from '@/components/Charts'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      listLoading: false,
      isChart: true,
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
      list: [
        {
          name: '方片',
          types: '已检总片数',
          typs: '已检总片数',
          datalist: {},
          total: 132
        },
        {
          name: '方片',
          types: '不良片数',
          typs: '不良片数',
          datalist: {},
          total: 132
        },
        {
          name: '方片',
          types: '已检批次',
          typs: '已检批次',
          datalist: {},
          total: 132
        },
        {
          name: '方片',
          types: '规格不符',
          typs: '不良批次',
          datalist: {},
          total: 132
        },
        {
          name: '方片',
          types: '亮度偏',
          typs: '不良批次',
          datalist: {},
          total: 132
        },
        {
          name: '方片',
          types: '外观不良漏检',
          typs: '不良批次',
          datalist: {},
          total: 132
        },
        {
          name: '方片',
          types: '数量不符',
          typs: '不良批次',
          datalist: {},
          total: 132
        },
        {
          name: '方片',
          types: '其他',
          typs: '不良批次',
          datalist: {},
          total: 132
        },
        {
          name: '方片',
          types: '总计',
          typs: '不良批次',
          datalist: {},
          total: 132
        },
        {
          name: '方片',
          types: '批次检验合格率',
          typs: '批次检验合格率',
          datalist: {},
          total: 132
        },
        {
          name: '圆片',
          types: '已检总片数',
          typs: '已检总片数',
          datalist: {},
          total: 132
        },
        {
          name: '圆片',
          types: '不良片数',
          typs: '不良片数',
          datalist: {},
          total: 132
        },
        {
          name: '圆片',
          types: '已检批次',
          typs: '已检批次',
          datalist: {},
          total: 132
        },
        {
          name: '圆片',
          types: '外观不良漏检',
          typs: '不良批次',
          datalist: {},
          total: 132
        },
        {
          name: '圆片',
          types: '数量不符',
          typs: '不良批次',
          datalist: {},
          total: 132
        },
        {
          name: '圆片',
          types: 'Mapping图与实物不符',
          typs: '不良批次',
          datalist: {},
          total: 132
        },
        {
          name: '圆片',
          types: '其他',
          typs: '不良批次',
          datalist: {},
          total: 132
        },
        {
          name: '圆片',
          types: '总计',
          typs: '不良批次',
          datalist: {},
          total: 132
        },
        {
          name: '圆片',
          types: '批次检验合格率',
          typs: '批次检验合格率',
          datalist: {},
          total: 132
        }
      ],
      dateList: [],
      options: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['方片', '圆片'],
          icon: 'rect'
        },
        grid: {
          top: 40,
          left: '3%',
          right: '4%',
          bottom: 40,
          containLbel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          boundarGap: false,
          data: []
        },
        series: [
          {
            name: '方片',
            type: 'line',
            itemStyle: {
              color: '#5268a5'
            },
            data: []
          },
          {
            name: '圆片',
            type: 'line',
            itemStyle: {
              color: '#fcb586'
            },
            data: []
          }
        ]
      },
      options1: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: 40,
          left: '3%',
          right: '4%',
          bottom: 40
        },
        legend: {
          data: ['规格不符', '亮度偏', '外观不良漏检', '数量不符', '其他']
        },
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        series: [
          {
            name: '规格不符',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            data: []
          },
          {
            name: '亮度偏',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            data: []
          },
          {
            name: '外观不良漏检',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            data: []
          },
          {
            name: '数量不符',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            data: []
          },
          {
            name: '其他',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            data: []
          }
        ]
      },
      options2: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: 40,
          left: '3%',
          right: '4%',
          bottom: 40,
          containLbel: true
        },
        legend: {
          data: ['外观不良漏检', '数量不符', 'Mapping图与实物不符', '其他']
        },
        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '外观不良漏检',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            data: []
          },
          {
            name: '数量不符',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            data: []
          },
          {
            name: 'Mapping图与实物不符',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            data: []
          },
          {
            name: '其他',
            type: 'bar',
            barMaxWidth: 20,
            barMinHeight: 5,
            data: []
          }
        ]
      },
      fpList: [],
      ypList: [],
      beginDate: this.getSevenFormatDate(),
      endDate: this.getNowFormatDates()
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    changeIsChart() {
      this.isChart = !this.isChart
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    importExcel() {
      window.open(process.env.BASE_API + '/xpIncomingTest/export?startTime=' + this.formatDate(this.beginDate) + '&endTime=' + this.formatDate(this.endDate), '_blank')
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
    clearAll() {
      this.beginDate = this.getSevenFormatDate()
      this.endDate = this.getNowFormatDates()
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      this.dateList = []
      selectFp(params).then(res => {
        this.fpList = res.data
        const checknum = []
        const datali = []
        const ldp = []
        const wgbl = []
        const slbf = []
        const qtBatch = []
        const ggbf = []
        for (let i = 0; i < this.fpList.length; i++) {
          this.dateList.push(this.fpList[i].createTime)
          if (i !== this.fpList.length - 1) {
            datali.push(this.fpList[i].createTime)
          }
          ldp.push(this.fpList[i].ldp)
          wgbl.push(this.fpList[i].wgbl)
          slbf.push(this.fpList[i].slbf)
          qtBatch.push(this.fpList[i].qtBatch)
          ggbf.push(this.fpList[i].ggbf)
          checknum.push(this.fpList[i].checknum)
        }
        this.options.xAxis.data = datali
        this.options1.xAxis[0].data = datali
        this.options2.xAxis[0].data = datali
        this.options.series[0].data = checknum
        this.options1.series[0].data = ggbf
        this.options1.series[1].data = ldp
        this.options1.series[2].data = wgbl
        this.options1.series[3].data = slbf
        this.options1.series[4].data = qtBatch
        for (let x = 0; x < 10; x++) {
          this.list[x].datalist = {}
          for (let y = 0; y < this.dateList.length; y++) {
            this.list[x].datalist[this.dateList[y]] = this.fpList[y]
          }
        }
        selectYp(params).then(res => {
          this.ypList = res.data
          const checknum = []
          const wgbl = []
          const slbf = []
          const mappingbad = []
          const qtBatch = []
          for (let i = 0; i < this.ypList.length; i++) {
            wgbl.push(this.ypList[i].wgbl)
            slbf.push(this.ypList[i].slbf)
            mappingbad.push(this.ypList[i].mappingbad)
            qtBatch.push(this.ypList[i].qtBatch)
            checknum.push(this.ypList[i].checknum)
          }
          this.options.series[1].data = checknum
          this.options2.series[0].data = wgbl
          this.options2.series[1].data = slbf
          this.options2.series[2].data = mappingbad
          this.options2.series[3].data = qtBatch
          console.log(this.options2)
          for (let x = 10; x < this.list.length; x++) {
            this.list[x].datalist = {}
            for (let y = 0; y < this.dateList.length; y++) {
              this.list[x].datalist[this.dateList[y]] = this.ypList[y]
            }
          }
          this.listLoading = false
        })
      })
    },
    tableRowClassColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        if (rowIndex < 3 || (rowIndex > 8 && rowIndex < 13) || rowIndex === 18) {
          return 'getwidht'
        }
      }
    },
    headerclass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return 'headerset'
      }
      if (columnIndex === 2) {
        return 'headersetto'
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.name === '方片') {
          if (row.types === '已检总片数') {
            return {
              rowspan: 10,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (row.name === '圆片') {
          if (row.types === '已检总片数') {
            return {
              rowspan: 9,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      } else if (columnIndex === 1) {
        if (rowIndex < 3 || (rowIndex > 8 && rowIndex < 13) || rowIndex === 18) {
          return [1, 2]
        }
        if (rowIndex === 3) {
          return {
            rowspan: 6,
            colspan: 1
          }
        } else if (rowIndex === 13) {
          return {
            rowspan: 5,
            colspan: 1
          }
        } else if (rowIndex > 3 && rowIndex < 18 && rowIndex !== 9 && rowIndex !== 10 && rowIndex !== 11 && rowIndex !== 12) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else if (columnIndex === 2) {
        if (rowIndex < 3 || (rowIndex > 8 && rowIndex < 13) || rowIndex === 18) {
          return [0, 0]
        }
      }
    }
  }
}

