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
          trigger: 'axis'
        },
        legend: {
          data: ['1#', '2#', '3#'],
          y: '10%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
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
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '1#',
            type: 'line',
            data: [null, 132, 500, null, 90, 230, 210]
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
      const legendData = []
      this.datas.series.map((item) => {
        legendData.push(item.name)
      })
      this.options.legend.data = legendData
      this.options.xAxis.data = this.datas.time
      this.options.title.text = this.datas.name
      this.options.series = this.datas.series
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
