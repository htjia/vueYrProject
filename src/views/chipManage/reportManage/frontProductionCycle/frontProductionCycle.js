import Chart from '@/components/Charts'
import PageHeaderLayout from '@/components/PageHeaderLayout'
import { earlyProductionCycle } from '@/api/extensionManage/wyReport/stockDivision'
import { findController } from '@/api/extensionManage/wyBasicInfoManage/substrateBasicInfo/chipInfo'
import { findStructureType } from '@/api/extensionManage/wyReport/productionReport/index'
export default {
  components: { PageHeaderLayout, Chart },
  data() {
    return {
      listLoading: false,
      showChart: true,
      list: [],
      colorList: [],
      colors: [],
      reasons: [],
      tableColumn: [],
      standbyReasonOptions: [],
      productionBaseList: [
        {
          id: 1,
          name: '马鞍山'
        }
      ],
      searchKey: {
        month: this.formatDate(),
        productionBase: 1,
        colorSeries: '',
        color: []
      },
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['出片数量', '周期（天）']
        },
        grid: {
          top: '6%',
          left: '1%',
          right: '1%',
          bottom: '0',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量'
          },
          {
            type: 'value',
            name: '天数'
          }
        ],
        series: [
          {
            barMaxWidth: '25',
            barMinHeight: 5,
            color: '#009494',
            name: '出片数量',
            type: 'bar',
            data: []
          },
          {
            name: '周期（天）',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
      }
    }
  },
  mounted() {
    this.fetchData()
    // this.findControllerFun()
    this.findStructureTypeFun()
  },
  methods: {
    formatDate() {
      var date = new Date()
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      return y + '-' + m.substring(m.length - 2, m.length)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        warehousingType: this.searchKey.productionBase,
        color: this.searchKey.color.join(),
        month: this.searchKey.month
      }
      earlyProductionCycle(requestParams).then(res => {
        this.list = res.data
        const xAxisData = []
        const sliceNumData = []
        const cycle = []
        res.data.map(item => {
          xAxisData.push(item.date)
          sliceNumData.push(item.sliceNum)
          cycle.push(item.cycle)
        })
        this.option.xAxis[0].data = xAxisData
        this.option.series[0].data = sliceNumData
        this.option.series[1].data = cycle
        this.listLoading = false
      })
    },
    // 光色查询
    findStructureTypeFun() {
      findStructureType().then(res => {
        this.colors = res.data
      })
    },
    // 获取光色系列
    findControllerFun() {
      findController().then(res => {
        this.colorList = res.data
      })
    },
    clearAll() {
      this.searchKey.productionBase = 1
      this.searchKey.month = this.formatDate()
      this.searchKey.colorSeries = ''
      this.searchKey.color = []
      this.fetchData()
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
      window.open(process.env.BASE_API + `/XpReportProductManagement/earlyProductionCycleExport?warehousingType=${this.searchKey.productionBase}&color=${this.searchKey.color.join()}&month=${this.searchKey.month}`)
    },
    handleSwitch() {
      this.showChart = !this.showChart
      this.option.grid.bottom = Math.random()
    }
  }
}

