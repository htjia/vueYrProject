<template>
  <div>
    <div style="margin-top:15px">
      <el-radio-group v-model="radio" class="margin-right">
        <el-radio :label="0">X轴方向画线</el-radio>
        <el-radio :label="1">Y轴方向画线</el-radio>
      </el-radio-group>
      <el-button type="primary" size="mini" @click="clearLine()"><svg-icon icon-class="clear"/> 清空画线</el-button>
    </div>
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
      radio: 0,
      options: {
        title: {
          text: '',
          y: '5%'
        },
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: 'cross'
          // },
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
              <span>${params[i].data}<br/>`
              if (params[i].data === '') {
                return ''
              }
            }
            return str
          }
        },
        legend: {
          data: ['Wd', 'Wd_std'],
          itemHeight: 8,
          top: '35'
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
          boundaryGap: false,
          axisLabel: {
            // interval: 0,
            // rotate: 70,
            formatter: function(value, index) {
              // 格式化成月/日，只在第一个刻度显示年份
              const date = value.split('-')
              return date[0]
            }
          },
          axisTick: {
            length: 0
          },
          data: []
        },
        yAxis: [
          {
            name: '',
            type: 'value'
          },
          {
            name: '',
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            type: 'scatter',
            symbolSize: 20
          },
          {
            type: 'scatter',
            symbolSize: 20,
            yAxisIndex: 1
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
      const obj = {
        type: 'scatter',
        symbolSize: 5
      }
      const arrdata = []
      this.datas.series.map((item, index) => {
        item.data.map(i => {
          if (i !== '' && i !== null) {
            arrdata.push(i)
          }
        })
        legendData.push(item.name)
        item = Object.assign(item, obj)
      })
      const min = Math.min(...arrdata)
      const max = Math.max(...arrdata)
      this.options.yAxis[0]['min'] = min
      this.options.yAxis[0].max = max
      this.options.legend.data = legendData
      this.options.title.text = this.datas.name
      const datas = []
      for (let i = 0; i < this.datas.runId.length; i++) {
        datas.push(this.datas.runId[i] + '-' + i)
      }
      this.options.xAxis.data = datas
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
        let data = []
        if (_this.options.series[e.seriesIndex].markLine !== undefined) {
          data = _this.options.series[e.seriesIndex].markLine.data
        } else {
          _this.options.series[e.seriesIndex].markLine = {
            silent: true,
            symbol: 'none',
            lineStyle: {
              type: 'solid'
            },
            data: []
          }
        }
        let res = null
        if (_this.radio === 0) {
          res = {
            xAxis: _this.options.xAxis.data[e.dataIndex],
            name: '',
            label: {
              show: false
            }
          }
        } else {
          res = {
            yAxis: e.data,
            name: '',
            label: {
              show: false
            }
          }
        }
        const markline = []
        if (data.length > 0) {
          let flag = true
          for (const d of data) {
            if (_this.radio === 0) {
              if (d.xAxis !== res.xAxis) {
                markline.push(d)
              } else {
                flag = false
              }
            } else {
              if (d.yAxis !== res.yAxis) {
                markline.push(d)
              } else {
                flag = false
              }
            }
          }
          if (flag) {
            markline.push(res)
          }
        } else {
          markline.push(res)
        }
        _this.options.series[e.seriesIndex].markLine.data = markline
        _this.chart.setOption(_this.options)
        _this.$emit('arqClick', e)
      })
    },
    onResize() {
      this.chart.resize()
    },
    eConsole(param) {
      console.log(param)
    },
    clearLine() {
      this.$confirm('确定清空画线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.options.series.length; i++) {
          if (this.options.series[i].markLine !== undefined) {
            this.options.series[i].markLine.data = []
          }
        }
        this.chart.setOption(this.options)
      })
    }
  }
}
</script>
