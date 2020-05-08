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
        <el-table-column v-for="child in item.children" :key="child.columnName" :label="child.columnName" :prop="child.key" align="center" min-width="180"/>
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
          // name: 'runId',
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
          data: ['1#', '2#', '3#', '4#', '5#', '6#', '7#', '8#', '9#', '10#', '11#', '12#', '13#', '14#', '15#', '16#', '17#']
        },
        yAxis: [
          {
            type: 'value',
            // name: '分钟',
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
      const obj = {
        type: 'bar',
        barMaxWidth: '24',
        barMinHeight: 5,
        barCategoryGap: '10%',
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
      const legendData = []
      this.datas.series.map((item) => {
        legendData.push(item.name)
        item = Object.assign(item, obj)
      })
      this.options.legend.data = legendData
      this.options.title.text = this.datas.name
      this.options.xAxis.data = this.datas.runId
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
