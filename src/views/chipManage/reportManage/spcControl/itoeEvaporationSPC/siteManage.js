
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findMachineByProcess, findProgramByProcessId, xpSpcConfigITO, xpSpcConfigFind } from '@/api/chipManage/reportManage/spc'
import Chart from '@/components/Charts'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      listLoading: false,
      list: [],
      anotherLists: [],
      addDialogVisible: false,
      option1: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: 20,
          right: 95,
          bottom: '10%',
          top: 20,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '',
            type: 'line',
            data: [],
            lineStyle: {
              color: '#009494'
            },
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: function(params) {
                  const linesession = sessionStorage.getItem('linesession')
                  if (linesession !== undefined && linesession !== null) {
                    const value = JSON.parse(linesession)
                    if (value.usl < params.data || value.lsl > params.data) {
                      return '#F56C6C'
                    } else {
                      return '#009494'
                    }
                  } else {
                    return '#009494'
                  }
                }
              }
            },
            markLine: {
              symbol: 'none',
              lineStyle: {
                type: 'solid'
              },
              label: {
                formatter: function(param) {
                  return param.name + ':' + param.value
                }
              },
              data: []
            }
          }
        ]
      },
      option2: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: 20,
          right: 95,
          bottom: '10%',
          top: 20,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '',
            type: 'line',
            lineStyle: {
              color: '#009494'
            },
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: function(params) {
                  const linesession = sessionStorage.getItem('linesession')
                  if (linesession !== undefined && linesession !== null) {
                    const value = JSON.parse(linesession)
                    if (value.mrucl < params.data || value.mrlcl > params.data) {
                      return '#F56C6C'
                    } else {
                      return '#009494'
                    }
                  } else {
                    return '#009494'
                  }
                }
              }
            },
            data: [],
            markLine: {
              symbol: 'none',
              lineStyle: {
                type: 'solid'
              },
              label: {
                formatter: function(param) {
                  return param.name + ':' + param.value
                }
              },
              data: []
            }
          }
        ]
      },
      option3: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: 20,
          right: 95,
          bottom: '10%',
          top: 20,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '',
            type: 'line',
            data: [],
            lineStyle: {
              color: '#009494'
            },
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: function(params) {
                  const linesession = sessionStorage.getItem('linesession')
                  if (linesession !== undefined && linesession !== null) {
                    const value = JSON.parse(linesession)
                    if (value.usl < params.data || value.lsl > params.data) {
                      return '#F56C6C'
                    } else {
                      return '#009494'
                    }
                  } else {
                    return '#009494'
                  }
                }
              }
            },
            markLine: {
              symbol: 'none',
              lineStyle: {
                type: 'solid'
              },
              label: {
                formatter: function(param) {
                  return param.name + ':' + param.value
                }
              },
              data: []
            }
          }
        ]
      },
      option4: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: 20,
          right: 95,
          bottom: '10%',
          top: 20,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '',
            type: 'line',
            data: [],
            lineStyle: {
              color: '#009494'
            },
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: function(params) {
                  const linesession = sessionStorage.getItem('linesession')
                  if (linesession !== undefined && linesession !== null) {
                    const value = JSON.parse(linesession)
                    if (value.mrucl < params.data || value.mrlcl > params.data) {
                      return '#F56C6C'
                    } else {
                      return '#009494'
                    }
                  } else {
                    return '#009494'
                  }
                }
              }
            },
            markLine: {
              symbol: 'none',
              lineStyle: {
                type: 'solid'
              },
              label: {
                formatter: function(param) {
                  return param.name + ':' + param.value
                }
              },
              data: []
            }
          }
        ]
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
      machine: '',
      machineOptions: [],
      processList: [],
      process: '',
      letparma: null,
      processName: ''
    }
  },
  mounted() {
    this.findMachineList()
    this.findProgram()
  },
  methods: {
    findMachineList() {
      const params = {
        pageNum: 1,
        pageSize: 100000,
        processId: '147,148'
      }
      findMachineByProcess(params).then(res => {
        this.machineOptions = res.data
        this.machine = this.machineOptions[0].id
        this.fetchData()
      })
    },
    findProgram() {
      const params = {
        pageNum: 1,
        pageSize: 100000,
        processId: '147,148'
      }
      findProgramByProcessId(params).then(res => {
        this.processList = res.data
        this.process = this.processList[0].id
        this.fetchData()
      })
    },
    findprocessName() {
      for (const item of this.processList) {
        if (item.id === this.process) {
          this.processName = item.name
          break
        }
      }
    },
    importExcel() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/xpSpc/exportITO?machine=${this.machine}&programId=${this.process}&startTime=${startTime}&endTime=${endTime}`)
      this.addDialogVisible = false
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex > 10) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    addDate() {
      this.addDialogVisible = true
      // findWarehousCode().then(res => {
      //   this.codeNo = res.data.code
      //   this.modelTime = res.data.createTime
      // })
    },
    getNowFormatDate() {
      var today = new Date()
      return this.formatDate(today.getTime())
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 查询
    fetchData() {
      if (this.machine === '' || this.process === '') {
        return
      }
      this.listLoading = true
      const requestParams = {
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        machine: this.machine,
        programId: this.process
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      xpSpcConfigITO(requestParams).then(res => {
        this.anotherLists = res.data
        const x = []
        // const y = []
        const data1 = []
        const data2 = []
        const data3 = []
        const data4 = []
        let max1 = 0
        let max2 = 0
        let max3 = 0
        let max4 = 0
        for (const item of this.anotherLists) {
          x.push(item.run)
          data1.push(parseFloat(item.pdz))
          data2.push(parseFloat(item.tgd))
          data3.push(parseFloat(item.pdzmr))
          data4.push(parseFloat(item.tgdmr))
          if (max1 < parseFloat(item.pdz)) {
            max1 = parseFloat(item.pdz)
          }
          if (max2 < parseFloat(item.tgd)) {
            max2 = parseFloat(item.tgd)
          }
          if (max3 < parseFloat(item.pdzmr)) {
            max3 = parseFloat(item.pdzmr)
          }
          if (max4 < parseFloat(item.tgdmr)) {
            max4 = parseFloat(item.tgdmr)
          }
        }
        this.option1.xAxis.data = x
        this.option2.xAxis.data = x
        this.option3.xAxis.data = x
        this.option4.xAxis.data = x
        this.option1.yAxis.max = max1 + 10
        this.option2.yAxis.max = max3 + 10
        this.option3.yAxis.max = max2 + 10
        this.option4.yAxis.max = max4 + 10
        this.option1.series[0].data = data1
        this.option2.series[0].data = data3
        this.option3.series[0].data = data2
        this.option4.series[0].data = data4
        const params = {
          type: 0,
          programId: this.process
        }
        xpSpcConfigFind(params).then(res => {
          this.list = res.data
          if (res.data.length > 0) {
            sessionStorage.setItem('linesession', JSON.stringify(res.data[0]))
            this.option1.series[0].markLine.data = [
              { yAxis: res.data[0].cl, name: '中心线 CL', lineStyle: { color: '#01485B' }},
              { yAxis: res.data[0].ucl, name: '上限 UCL', lineStyle: { color: '#30A4FA' }},
              { yAxis: res.data[0].lcl, name: '下限 LCL', lineStyle: { color: '#30A4FA' }},
              { yAxis: res.data[0].usl, name: '上限 USL', lineStyle: { color: '#E25D5D' }},
              { yAxis: res.data[0].lsl, name: '下限 LSL', lineStyle: { color: '#E25D5D' }}
            ]
            if (this.option1.yAxis.max <= res.data[0].usl) {
              this.option1.yAxis.max = res.data[0].usl + 10
            }
            this.option2.series[0].markLine.data = [
              { yAxis: res.data[0].mrucl, name: 'MR-UCL', lineStyle: { color: '#E25D5D' }},
              { yAxis: res.data[0].mrcl, name: 'MR-CL', lineStyle: { color: '#E25D5D' }}
            ]
            if (this.option2.yAxis.max <= res.data[0].mrucl) {
              this.option2.yAxis.max = res.data[0].mrucl + 10
            }
            if (res.data.length > 1) {
              this.option3.series[0].markLine.data = [
                { yAxis: res.data[1].cl, name: '中心线 CL', lineStyle: { color: '#01485B' }},
                { yAxis: res.data[1].ucl, name: '上限 UCL', lineStyle: { color: '#30A4FA' }},
                { yAxis: res.data[1].lcl, name: '下限 LCL', lineStyle: { color: '#30A4FA' }},
                { yAxis: res.data[1].usl, name: '上限 USL', lineStyle: { color: '#E25D5D' }},
                { yAxis: res.data[1].lsl, name: '下限 LSL', lineStyle: { color: '#E25D5D' }}
              ]
              if (this.option3.yAxis.max <= res.data[1].usl) {
                this.option3.yAxis.max = res.data[1].usl + 10
              }
              this.option4.series[0].markLine.data = [
                { yAxis: res.data[1].mrucl, name: 'MR-UCL', lineStyle: { color: '#E25D5D' }},
                { yAxis: res.data[1].mrcl, name: 'MR-CL', lineStyle: { color: '#E25D5D' }}
              ]
              if (this.option4.yAxis.max <= res.data[1].mrucl) {
                this.option4.yAxis.max = res.data[1].mrucl + 10
              }
            }
          }
          this.listLoading = false
          this.findprocessName()
        })
      })
    },
    clearCondition() {
      this.beginDate = ''
      this.endDate = ''
      this.machine = this.machineOptions[0].id
      this.process = this.processList[0].id
      this.fetchData()
    }
  }
}

