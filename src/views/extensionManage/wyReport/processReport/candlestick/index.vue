<template>
  <div>
    <div :class="className" :id="id" :style="{height:height,width:width}"/>
    <el-table
      :data="datas.tableData"
      class="broad-scrollbar-table"
      element-loading-text="拼命加载中"
      height="260px"
      border
      fit>
      <el-table-column align="center" prop="machine" label="机台">
        <el-table-column align="center" prop="name" label="日期" fixed/>
      </el-table-column>
      <el-table-column v-for="item in datas.tableThead" :key="item.columnName" :label="item.columnName" align="center">
        <el-table-column v-for="child in item.children" :key="child.columnName" :label="child.columnName" :prop="child.key" min-width="180" align="center"/>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from '@/utils/resize'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    datas: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null,
      options: {
        title: {
          text: '',
          y: '5%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          width: 'auto',
          left: 20,
          right: 50,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          show: true,
          type: 'category',
          boundaryGap: true,
          axisLabel: {
            // interval: 0,
            // rotate: 70
          },
          axisTick: {
            length: 0
          },
          data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27']
        },
        yAxis: {
          min: 0,
          max: 0
        },
        series: [{
          type: 'k',
          data: [
            [20, 30, 10, 35],
            [40, 35, 30, 55],
            [33, 38, 33, 40],
            [40, 40, 32, 42]
          ]
        }]
      }
    }
  },
  watch: {
    datas: {
      handler(newValue, oldValue) {
        this.initChart()
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getMin(arr) {
      const a = []
      arr.map(item => {
        if (item.length > 0) {
          a.push(...item)
        }
      })
      return parseFloat(Math.min(...a))
    },
    getMax(arr) {
      const a = []
      arr.map(item => {
        if (item.length > 0) {
          a.push(...item)
        }
      })
      return parseFloat(Math.max(...a))
    },
    initChart() {
      this.options.title.text = this.datas.name
      this.options.xAxis.data = this.datas.runId
      this.options.series[0].data = this.datas.series
      console.log(this.getMin(this.datas.series))
      console.log(this.getMax(this.datas.series))
      this.options.yAxis.max = this.getMax(this.datas.series)
      this.options.yAxis.min = this.getMin(this.datas.series)
      const _this = this
      if (this.chart !== null) {
        this.chart.dispose()
        this.chart = null
      }
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption(this.options)
      this.chart.off('click')
      this.chart.on('click', function(e) {
        _this.$emit('arqClick', e)
      })
    },
    onResize() {
      this.chart.resize()
    },
    eConsole(param) {
      console.log(param)
    }
  }
}
</script>
