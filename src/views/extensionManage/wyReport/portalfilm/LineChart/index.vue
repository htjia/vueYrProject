<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
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
      type: Array,
      default: function() {
        return []
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
          trigger: 'axis'
        },
        legend: {
          data: ['1#', '2#', '3#'],
          y: '0'
        },
        grid: {
          top: '2%',
          left: '3%',
          right: '3%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: {
          show: true,
          axisLabel: {
            // interval: 0,
            // rotate: 70
          },
          axisTick: {
            length: 0
          },
          type: 'category',
          boundaryGap: false,
          data: []
          // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'line',
            data: [122, 132, 500, 56, 90, 230, 210]
          }
        ]
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
    initChart() {
      this.options.xAxis.data = []
      this.datas.map((item, index) => {
        this.options.xAxis.data.push(index + 1)
      })
      this.options.series[0].data = this.datas
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption(this.options)
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
