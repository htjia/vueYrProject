
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getClassList, findList, findDetail, update, findTableHead, findNorm } from '@/api/ipqc/workEnvironmentCheck'
import Chart from '@/components/Charts'
import Cookies from 'js-cookie'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      list: [],
      checkDate: new Date(),
      nowDate: new Date(),
      pickerOptionsStart: {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      },
      isActive: 0,
      isActivetab: '',
      dataNum: 0,
      monthNum: 0,
      yearNum: 0,
      dateList: {},
      startTime: '',
      endTime: '',
      classId: '',
      classList: [],
      tabList: {},
      setUpList: [],
      workList: [],
      drawList: [],
      isShowMenu: {
        'ipqc-update': false
      }
    }
  },
  mounted() {
    var _this = this
    setTimeout(function() {
      const roleInfo = sessionStorage.getItem('roleInfo')
      if (roleInfo !== undefined && roleInfo !== null) {
        const roleList = JSON.parse(roleInfo)
        for (const item of roleList) {
          if (item.path === 'qualityManage') {
            for (const items of item.children) {
              if (items.path === 'inputProQualityCtrl') {
                for (const citems of items.children) {
                  if (citems.path === 'workEnvironment') {
                    const menus = citems.funIds.split(',')
                    for (const menu of menus) {
                      _this.isShowMenu[menu] = true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }, 500)
    this.getClassList()
  },
  methods: {
    navClick(type) {
      if (type !== this.isActive) {
        this.list = []
        this.drawList = []
        this.isActive = type
        const d = new Date(this.checkDate)
        this.setDataNum(d.getFullYear(), d.getMonth() + 1)
      }
    },
    findLog() {
      Cookies.set('monthDay', new Date(this.checkDate).getTime())
      this.$router.push({ path: '/inputProQualityCtrl/workEnvironmentlog' })
    },
    getClassList() {
      getClassList().then(res => {
        this.classList = []
        const data = new Date()
        const year = data.getFullYear()
        const month = data.getMonth() + 1
        const day = data.getDate()
        const day1 = data.getDate() + 1
        for (let i = 0; i < res.data.length; i++) {
          const st1 = res.data[i].startTime.split(':')
          const st2 = res.data[i].endTime.split(':')
          const startTime = new Date(year + '/' + month + '/' + day + ' ' + res.data[i].startTime + ':00').getTime()
          let endTime = ''
          let torrom = ''
          if (parseInt(st1[0]) > parseInt(st2[0])) {
            torrom = new Date(year + '/' + month + '/' + (day - 1) + ' ' + '23:59:59').getTime()
            endTime = new Date(year + '/' + month + '/' + day1 + ' ' + res.data[i].endTime + ':00').getTime()
          } else if (parseInt(st1[0]) === parseInt(st2[0]) && parseInt(st1[1]) >= parseInt(st2[1])) {
            torrom = new Date(year + '/' + month + '/' + (day - 1) + ' ' + '23:59:59').getTime()
            endTime = new Date(year + '/' + month + '/' + day1 + ' ' + res.data[i].endTime + ':00').getTime()
          } else {
            endTime = new Date(year + '/' + month + '/' + day + ' ' + res.data[i].endTime + ':00').getTime()
          }
          this.classList.push({
            id: res.data[i].id,
            name: res.data[i].name,
            startTime: startTime,
            endTime: endTime,
            torrom: torrom,
            starth: res.data[i].startTime,
            endh: res.data[i].endTime
          })
          console.log(this.classList)
        }
        this.setDataNum(this.checkDate.getFullYear(), this.checkDate.getMonth() + 1)
      })
    },
    setDataNum(year, month) {
      const data = new Date(year, month, 0).getDate()
      this.dataNum = data
      this.monthNum = month
      this.yearNum = year
      this.dateList = {}
      const params = {
        month: this.formatDate(this.checkDate),
        category: this.isActive
      }
      findTableHead(params).then(res => {
        for (let i = 1; i <= this.dataNum; i++) {
          let flag = true
          let day = ''
          if (i < 10) {
            day = '0' + i
          } else {
            day = i + ''
          }
          let ms = 0
          if (this.monthNum > 9) {
            ms = this.monthNum
          } else {
            ms = '0' + this.monthNum
          }
          if (this.dateList[ms + '月' + day + '日'] === undefined) {
            this.dateList[ms + '月' + day + '日'] = []
          }
          for (let x = 0; x < res.data.length; x++) {
            if (this.isActive === 2) {
              if (parseInt(res.data[x].substring(3, 5)) === i) {
                this.dateList[ms + '月' + day + '日'].push({
                  data: parseInt(res.data[x].substring(3, 5)),
                  label: res.data[x].substring(7, res.data[x].length - 4) + res.data[x].substring(10, res.data[x].length)
                })
                flag = false
              }
            } else {
              if (parseInt(res.data[x].substring(3, 5)) === i) {
                this.dateList[ms + '月' + day + '日'].push({
                  data: parseInt(res.data[x].substring(3, 5)),
                  label: res.data[x].substring(7, res.data[x].length - 1)
                })
                flag = false
              }
            }
          }
          if (flag) {
            for (const item of this.classList) {
              this.dateList[ms + '月' + day + '日'].push({
                data: day,
                label: item.name
              })
            }
          }
        }
        this.fetchData()
      })
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      return y + '-' + m.substring(m.length - 2, m.length)
    },
    // 时间戳转yyyy-mm-dd
    formatDates(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    setDate() {
      this.nowDate = new Date().getTime()
      const data = new Date().getTime()
      for (const item of this.classList) {
        if (item.startTime <= data && item.endTime >= data) {
          if (item.torrom !== '') {
            const year = new Date().getFullYear()
            const month = new Date().getMonth() + 1
            const day = new Date().getDate()
            const today = new Date(year + '/' + month + '/' + day + ' ' + item.endh + ':00').getTime()
            if (today > this.nowDate) {
              this.nowDate = item.torrom
            }
          }
          this.startTime = item.starth
          this.endTime = item.endh
          this.classId = item.name
          break
        } else if (data < item.startTime && item.torrom !== '' && item.torrom < data) {
          this.nowDate = item.torrom
          this.startTime = item.starth
          this.endTime = item.endh
          this.classId = item.name
          break
        }
      }
    },
    // 查询
    fetchData() {
      this.listLoading = true
      findNorm().then(res => {
        this.workList = res.data
        const params = {
          month: this.formatDate(this.checkDate),
          category: this.isActive
        }
        findList(params).then(res => {
          this.list = []
          this.drawList = []
          for (const item of this.workList) {
            let flag = true
            for (const day of res.data) {
              if (item.workshopId === day.workshop && item.pointName === day.point) {
                flag = false
                const lis = []
                const keys = Object.keys(this.dateList)
                for (let i = 0; i < keys.length; i++) {
                  let flags = true
                  for (const item of day.detailList) {
                    if (keys[i] === item.checkDate) {
                      const obj = Object.keys(item)
                      for (const objs of obj) {
                        if (objs !== 'checkDate' && item[objs] === null) {
                          item[objs] = ''
                        }
                        if (objs !== 'checkDate' && this.isActive === 2 && item[objs] !== null && item[objs] !== '') {
                          item[objs] = parseFloat(item[objs] + '')
                        }
                      }
                      if (this.isActive === 2) {
                        lis.push({
                          checkDate: item.checkDate,
                          result0: item.result0,
                          result1: item.resultTwo0,
                          result2: item.result1,
                          result3: item.resultTwo1
                        })
                      } else {
                        lis.push({
                          checkDate: item.checkDate,
                          result0: item.result0,
                          result1: item.result1
                        })
                      }
                      flags = false
                      break
                    }
                  }
                  if (flags) {
                    const ns = {
                      checkDate: keys[i]
                    }
                    for (let x = 0; x < this.dateList[keys[i]].length; x++) {
                      ns['result' + x] = ''
                    }
                    lis.push(ns)
                  }
                }
                this.list.push({
                  workshop: day.workshop,
                  point: day.point,
                  lcl: day.lcl,
                  ucl: day.ucl,
                  detailList: lis
                })
                break
              }
            }
            if (flag) {
              const liss = []
              const keys = Object.keys(this.dateList)
              for (let i = 0; i < keys.length; i++) {
                const ns = {
                  checkDate: keys[i]
                }
                for (let x = 0; x < this.dateList[keys[i]].length; x++) {
                  ns['result' + x] = ''
                }
                liss.push(ns)
              }
              this.list.push({
                workshop: item.workshopId,
                point: item.pointName,
                lcl: '',
                ucl: '',
                detailList: liss
              })
            }
          }
          let str = ''
          let min = 0
          if (this.isActive === 0) {
            str = '  温度推移图（℃）'
            min = 18
          } else if (this.isActive === 1) {
            str = '  湿度推移图（%）'
            min = 30
          } else {
            str = '  洁净度推移图'
            min = 0
          }
          sessionStorage.setItem('workEnvironments', JSON.stringify(this.list))
          sessionStorage.setItem('workEnvironmentsisActive', this.isActive)
          for (const item of this.list) {
            const xList = []
            const keys = Object.keys(this.dateList)
            for (const key of keys) {
              for (const ite of this.dateList[key]) {
                if (this.isActive !== 2) {
                  xList.push(key + '(' + ite.label + ')')
                } else {
                  xList.push(key + ite.label)
                }
              }
            }
            const lineList = []
            let max = item.ucl
            for (const datat of item.detailList) {
              const keys1 = Object.keys(datat)
              for (const ks of keys1) {
                if (ks !== 'checkDate') {
                  if (parseFloat(datat[ks] + '') > max) {
                    max = parseFloat(datat[ks] + '')
                  }
                  lineList.push('' + parseFloat(datat[ks] + ''))
                }
              }
            }
            const markline = []
            if (item.lcl !== '' && this.isActive !== 2) {
              markline.push({ yAxis: item.lcl, name: 'LCL', lineStyle: { color: '#30A4FA' }})
            }
            if (item.ucl !== '') {
              markline.push({ yAxis: item.ucl, name: 'UCL', lineStyle: { color: '#E25D5D' }})
            }
            const option = {
              tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                  const act = sessionStorage.getItem('workEnvironmentsisActive')
                  let data = ''
                  if (params[0].data !== 'NaN') {
                    data = params[0].data
                  }
                  if (act === '0') {
                    if (data === '') {
                      return params[0].name + '<br>温度：无'
                    } else {
                      return params[0].name + '<br>温度：' + data + '℃'
                    }
                  } else if (act === '1') {
                    if (data === '') {
                      return params[0].name + '<br>湿度：无'
                    } else {
                      return params[0].name + '<br>湿度：' + data + '%'
                    }
                  } else {
                    if (data === '') {
                      return params[0].name + '<br>洁净度：无'
                    } else {
                      return params[0].name + '<br>洁净度：' + data
                    }
                  }
                }
              },
              grid: {
                left: 20,
                right: 80,
                bottom: '10%',
                top: 20,
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                  interval: 0
                },
                data: xList
              },
              dataZoom: [
                {
                  start: 0, // 默认为0
                  end: this.isActive !== 2 ? 20 : 9,
                  type: 'slider', // slider 表示有滑动块的，inside表示内置的
                  show: true, // 如果为false 则不显示
                  xAxisIndex: [0],
                  handleSize: 0, // 滑动条的 左右2个滑动条的大小
                  height: 15, // 组件高度
                  left: 40, // 左边的距离
                  right: 80, // 右边的距离
                  bottom: 15, // 右边的距离
                  fillerColor: '#d3d3d3', // 选中范围的填充颜色。
                  backgroundColor: '#f9f9f9', // 两边未选中的滑动条区域的颜色
                  showDataShadow: false, // 是否显示数据阴影 默认auto
                  showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
                  filterMode: 'filter'
                }
              ],
              yAxis: {
                type: 'value',
                min: min,
                max: max,
                axisLabel: {
                  formatter: '{value}'
                }
              },
              series: [
                {
                  name: item.workshop + item.point,
                  type: 'line',
                  lineStyle: {
                    color: '#009494'
                  },
                  symbolSize: 8,
                  itemStyle: {
                    normal: {
                      color: function(params) {
                        const linesession = sessionStorage.getItem('workEnvironments')
                        if (linesession !== undefined && linesession !== null) {
                          const value = JSON.parse(linesession)
                          let color = ''
                          for (const item of value) {
                            const str = item.workshop + item.point
                            if (params.seriesName === str) {
                              if (item.lcl !== '' && params.data !== '' && item.lcl > parseFloat(params.data)) {
                                color = '#F56C6C'
                              } else if (item.ucl !== '' && params.data !== '' && item.ucl < parseFloat(params.data)) {
                                color = '#F56C6C'
                              } else {
                                color = '#009494'
                              }
                              break
                            }
                          }
                          return color
                        } else {
                          return '#009494'
                        }
                      }
                    }
                  },
                  data: lineList,
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
                    data: markline
                  }
                }
              ]
            }
            this.drawList.push({
              title: item.workshop + item.point + str,
              option: option
            })
          }
          this.listLoading = false
        })
      })
    },
    // 关闭
    handleClose(formName) {
      // this.$refs[formName].resetFields()
    },
    addCheckLog() {
      this.setDate()
      this.findNorm()
      this.addDialogVisible = true
    },
    updateCheckLog() {
      this.setDate()
      this.findNorm()
      this.editDialogVisible = true
    },
    searchInfo() {
      const d = new Date(this.checkDate)
      this.setDataNum(d.getFullYear(), d.getMonth() + 1)
    },
    findNorm() {
      this.tabList = {}
      findNorm().then(res => {
        this.workList = res.data
        const params = {
          checkDate: this.formatDates(this.nowDate),
          category: this.isActive,
          team: this.classId
        }
        findDetail(params).then(res => {
          for (const items of this.workList) {
            for (const item of res.data) {
              if (items.pointId === item.pointId) {
                if (this.isActive !== 2) {
                  items.result = item.result
                } else {
                  items.result = item.result !== null ? (parseFloat(item.result + '') / 28.3).toFixed(0) + '' : ''
                  items.resultTwo = item.resultTwo !== null ? (parseFloat(item.resultTwo + '') / 28.3).toFixed(0) + '' : ''
                }
              }
            }
            if (this.tabList[items.workshopId] === undefined) {
              this.tabList[items.workshopId] = []
            }
            if (items.result === undefined || items.result === null) {
              items.result = ''
            }
            var data = {
              pointId: items.pointId,
              pointName: items.pointName,
              result: items.result,
              resultTwo: items.resultTwo === undefined ? '' : items.resultTwo,
              workshopId: items.workshopId
            }
            this.tabList[items.workshopId].push(data)
          }
          this.findTab(this.workList[0].workshopId)
          this.$set(this.tabList)
        })
      })
    },
    checkIsNum(row) {
      if (row.result !== '') {
        if (this.isActive === 0) {
          if (parseFloat(row.result + '') + '' !== row.result + '') {
            row.result = ''
            this.$message({
              type: 'error',
              message: '数字输入有误!'
            })
          } else if (parseFloat(row.result + '') > 100 || parseFloat(row.result + '') <= 0) {
            this.$message({
              type: 'error',
              message: '数字输入在0~100之间!'
            })
            row.result = parseFloat(row.result + '').toFixed(1) + ''
          } else if (parseFloat(row.result + '') !== parseFloat(parseFloat(row.result + '').toFixed(1))) {
            this.$message({
              type: 'error',
              message: '数字最多保留1位小数!'
            })
            row.result = parseFloat(row.result + '').toFixed(1) + ''
          }
        } else if (this.isActive === 1) {
          if (parseFloat(row.result + '') + '' !== row.result + '') {
            row.result = ''
            this.$message({
              type: 'error',
              message: '数字输入有误!'
            })
          } else if (parseFloat(row.result + '') > 100 || parseFloat(row.result + '') <= 0) {
            this.$message({
              type: 'error',
              message: '数字输入在0~100之间!'
            })
            row.result = parseFloat(row.result + '').toFixed(1) + ''
          } else if (parseFloat(row.result + '') !== parseFloat(parseFloat(row.result + '').toFixed(2))) {
            this.$message({
              type: 'error',
              message: '数字最多保留2位小数!'
            })
            row.result = parseFloat(row.result + '').toFixed(2) + ''
          }
        } else {
          const num = new RegExp('^-?\\d+$')
          if (!num.test(row.result + '')) {
            row.result = ''
            this.$message({
              type: 'error',
              message: '数字输入有误!'
            })
          }
        }
      }
      if (this.isActive === 2 && row.resultTwo !== '') {
        const num = new RegExp('^-?\\d+$')
        if (!num.test(row.resultTwo + '')) {
          row.resultTwo = ''
          this.$message({
            type: 'error',
            message: '数字输入有误!'
          })
        }
      }
    },
    save() {
      if (this.classId === '' || this.classId === null) {
        this.$message({
          type: 'error',
          message: '当前时间未配置班别!'
        })
        return
      }
      const list = []
      const keys = Object.keys(this.tabList)
      for (const key of keys) {
        if (key !== 'undefined') {
          for (const info of this.tabList[key]) {
            if (info.result !== '') {
              list.push({
                pointId: info.pointId,
                result: this.isActive !== 2 ? info.result : (parseFloat(info.result + '') * 28.3).toFixed(1),
                resultTwo: this.isActive !== 2 ? info.resultTwo : (parseFloat(info.resultTwo + '') * 28.3).toFixed(1)
              })
            }
          }
        }
      }
      const params = {
        category: this.isActive,
        checkDate: this.formatDates(this.nowDate) + ' ' + this.startTime + ':00',
        checker: sessionStorage.getItem('User-Id'),
        detailList: list,
        team: this.classId
      }
      update(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.addDialogVisible = false
          this.editDialogVisible = false
          this.fetchData()
        }
      })
    },
    findTab(key) {
      if (this.isActivetab !== key) {
        this.isActivetab = key
        // this.setUpList = []
        // for(const item of this.tabList[items.workshopId]){
        //   this.setUpList
        // }
      }
    },
    getNoAndCode() {
      for (const item of this.classList) {
        if (this.classId === item.name) {
          this.startTime = item.starth
          break
        }
      }
      this.findNorm()
    }
  }
}

