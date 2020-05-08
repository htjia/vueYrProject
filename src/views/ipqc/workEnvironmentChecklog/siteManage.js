
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getClassList, findList, findTableHead, findNorm } from '@/api/ipqc/workEnvironmentCheck'
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
      drawList: []
    }
  },
  mounted() {
    this.getClassList()
    const monthDay = Cookies.get('monthDay')
    if (monthDay !== undefined && monthDay !== null) {
      this.checkDate = new Date(parseInt(monthDay))
    }
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
      Cookies.set('monthDay', this.checkDate)
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
          this.dataSpan = {}
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
                          if (this.isActive === 2) {
                            item[objs] = parseFloat(item[objs] + '')
                          } else {
                            item[objs] = parseInt(item[objs] + '')
                          }
                        }
                      }
                      if (this.isActive === 2) {
                        lis.push(item)
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
          for (let i = 0; i < this.list.length; i++) {
            if (this.dataSpan[this.list[i].workshop] === undefined) {
              this.dataSpan[this.list[i].workshop] = {
                start: i,
                num: 1
              }
            } else {
              this.dataSpan[this.list[i].workshop].num = this.dataSpan[this.list[i].workshop].num + 1
            }
          }
          this.listLoading = false
        })
      })
    },
    searchInfo() {
      const d = new Date(this.checkDate)
      this.setDataNum(d.getFullYear(), d.getMonth() + 1)
    },
    objectSpanMethods({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && this.dataSpan[row.workshop].num !== 1) {
        if (this.dataSpan[row.workshop].start === rowIndex) {
          return {
            rowspan: this.dataSpan[row.workshop].num,
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
    exportAll() {
      window.open(process.env.BASE_API + `/zlCheckEnvController/export?month=${this.formatDate(this.checkDate)}&category=${this.isActive}`)
    }
  }
}

