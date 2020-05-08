
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getClassList, findList, findDetail, findNorm, update, findTableHead, findcj } from '@/api/ipqc/sevenSCheck'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
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
      dataNum: 0,
      monthNum: 0,
      yearNum: 0,
      isActive: 0,
      dateList: [],
      startTime: '',
      endTime: '',
      classId: '',
      tabList: {},
      classList: [],
      setUpList: [],
      isActivetab: '',
      dataSpan: {},
      firstResult: false,
      isShowMenu: {
        'ipqc-update': false
      },
      projectcjList: []
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
                  if (citems.path === 'sevenSCheck') {
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
    this.findcjs()
  },
  methods: {
    findcjs() {
      findcj().then(res => {
        this.projectcjList = res.data
        this.isActive = res.data[0].id
        this.getClassList()
      })
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
    searchInfo() {
      const d = new Date(this.checkDate)
      this.setDataNum(d.getFullYear(), d.getMonth() + 1)
    },
    setDataNum(year, month) {
      const data = new Date(year, month, 0).getDate()
      this.dataNum = data
      this.monthNum = month
      this.yearNum = year
      this.dateList = []
      const params = {
        month: this.formatDate(this.checkDate),
        category: this.isActive
      }
      findTableHead(params).then(res => {
        for (let i = 1; i <= this.dataNum; i++) {
          let flag = true
          for (let x = 0; x < res.data.length; x++) {
            if (parseInt(res.data[x].substring(3, 5)) === i) {
              this.dateList.push({
                data: parseInt(res.data[x].substring(3, 5)),
                label: res.data[x]
              })
              flag = false
            }
          }
          if (flag) {
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
            for (const item of this.classList) {
              this.dateList.push({
                data: day,
                label: ms + '月' + day + '日(' + item.name + ')'
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
          setTimeout(() => {
            this.list = []
            for (const item of this.workList) {
              let flag = true
              for (const day of res.data) {
                if (item.category === day.category && item.item === day.item) {
                  flag = false
                  const lis = []
                  let str = ''
                  let num = 0
                  for (const days of this.dateList) {
                    let flags = true
                    var str1 = days.label.substring(0, 6)
                    if (str1 !== str) {
                      str = str1
                      num = 0
                    } else {
                      num = num + 1
                    }
                    for (const detail of day.detailList) {
                      if (str1 === detail.checkDate) {
                        flags = false
                        lis.push({
                          checkDate: days.label,
                          result: detail['result' + num],
                          score: detail['score' + num],
                          remark: detail['remark' + num],
                          checkerName: detail['checkerName' + num]
                        })
                      }
                    }
                    if (flags) {
                      lis.push({
                        checkDate: days.label,
                        result: '',
                        score: '',
                        remark: '',
                        checkerName: ''
                      })
                    }
                  }
                  this.list.push({
                    category: day.category,
                    item: day.item,
                    norm: day.norm,
                    detailList: lis
                  })
                  break
                }
              }
              if (flag) {
                const liss = []
                for (const days of this.dateList) {
                  liss.push({
                    checkDate: days.label,
                    result: '',
                    score: '',
                    remark: '',
                    checkerName: ''
                  })
                }
                this.list.push({
                  category: item.category,
                  item: item.item,
                  norm: item.score,
                  detailList: liss
                })
              }
            }
            let total = 0
            const lises = []
            const lisess = []
            for (const days of this.dateList) {
              lises.push({ score: '', checkDate: days.label, result: 2 })
            }
            for (let y = 0; y < this.list.length; y++) {
              for (let m = 0; m < this.list[y].detailList.length; m++) {
                if (y === 0) {
                  lisess.push({ checkerName: this.list[y].detailList[m].checkerName, checkDate: this.list[y].detailList[m].checkDate, result: 2 })
                } else {
                  if (lisess[m].checkerName === null && this.list[y].detailList[m].checkerName !== null) {
                    lisess[m].checkerName = this.list[y].detailList[m].checkerName
                  }
                }
              }
            }
            this.dataSpan = {}
            for (let i = 0; i < this.list.length; i++) {
              total = total + this.list[i].norm
              if (this.dataSpan[this.list[i].category] === undefined) {
                this.dataSpan[this.list[i].category] = {
                  start: i,
                  num: 1
                }
              } else {
                this.dataSpan[this.list[i].category].num = this.dataSpan[this.list[i].category].num + 1
              }
              for (let x = 0; x < this.list[i].detailList.length; x++) {
                if (this.list[i].detailList[x].score !== '' && this.list[i].detailList[x].score !== null) {
                  if (lises[x].score === '') {
                    lises[x].score = this.list[i].detailList[x].score
                  } else {
                    lises[x].score = lises[x].score + this.list[i].detailList[x].score
                  }
                }
              }
            }
            this.list.push({
              category: '合计',
              norm: total,
              detailList: lises
            })
            this.list.push({
              category: '责任人',
              detailList: lisess
            })
            this.dataSpan['责任人'] = {
              start: this.list.length - 1,
              num: 1
            }
            this.dataSpan['合计'] = {
              start: this.list.length - 2,
              num: 1
            }
            this.listLoading = false
            console.log(this.list)
          }, 500)
        })
      })
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
              if (items.id === item.itemsId) {
                items.result = item.result
                items.remark = item.remark
                items.scores = item.score
              }
            }
            if (this.tabList[items.category] === undefined) {
              this.tabList[items.category] = []
            }
            if (items.result === undefined || items.result === null) {
              items.result = ''
            }
            if (items.remark === undefined || items.remark === null) {
              items.remark = ''
            }
            var data = {
              id: items.id,
              item: items.item,
              score: items.scores,
              allscore: items.score,
              category: items.category,
              result: items.result,
              remark: items.remark
            }
            this.tabList[items.category].push(data)
          }
          this.findTab(this.workList[0].category)
          this.$set(this.tabList)
          console.log(this.tabList)
        })
      })
    },
    findTab(key) {
      if (this.isActivetab !== key) {
        this.isActivetab = key
        this.firstResult = false
        // this.setUpList = []
        // for(const item of this.tabList[items.workshopId]){
        //   this.setUpList
        // }
      }
    },
    getScore(row) {
      if (row.result === 0) {
        row.score = row.allscore
      } else {
        row.score = 0
      }
    },
    setScore(row) {
      if (row.score !== '') {
        if (parseInt(row.score + '') + '' !== row.score + '') {
          row.score = ''
          this.$message({
            type: 'error',
            message: '数字输入不正确!'
          })
        } else if (parseInt(row.score + '') > row.allscore) {
          row.score = ''
          this.$message({
            type: 'error',
            message: '数字超过最大上限!'
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
                itemsId: info.id,
                remark: info.remark,
                result: info.result,
                score: info.score
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
    getNoAndCode() {
      for (const item of this.classList) {
        if (this.classId === item.name) {
          this.startTime = item.starth
          break
        }
      }
      this.findNorm()
    },
    renderHeader(h, { column }) {
      return h(
        'span',
        {
          style: 'padding-top: 10px;line-height: 30px;'
        },
        [
          h('span', column.label),
          h('el-checkbox', {
            props: {
              checked: false
            },
            style: 'margin-left: 15px;margin-right: 5px;',
            on: {
              change: ($event, column) => this.select($event, column)
            },
            'v-model': this.firstResult
          }),
          h('span', '一键全选√')
        ]
      )
    },
    select(event, column) {
      if (event) {
        for (const item of this.tabList[this.isActivetab]) {
          item.result = 0
          item.score = item.allscore
        }
      } else {
        for (const item of this.tabList[this.isActivetab]) {
          item.result = ''
          item.score = ''
        }
      }
    },
    navClick(type) {
      if (type !== this.isActive) {
        this.isActive = type
        this.searchInfo()
      }
    },
    tableRowClassColor({ row, column, rowIndex, columnIndex }) {
      if (columnIndex > 3) {
        if ((columnIndex - 3) % 2 === 1) {
          if (row.detailList[(columnIndex - 4) / 2] !== undefined && row.detailList[(columnIndex - 4) / 2].result === 1) {
            return {
              background: '#E35C5C !important',
              color: '#fff'
            }
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && this.dataSpan[row.category].num !== 1) {
        if (this.dataSpan[row.category].start === rowIndex) {
          return {
            rowspan: this.dataSpan[row.category].num,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (row.category === '责任人') {
        if (columnIndex === 0) {
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
        if (columnIndex > 2) {
          if (columnIndex % 2 === 0) {
            return [0, 0]
          } else {
            return [1, 2]
          }
        }
      }
      if (row.category === '合计') {
        if (columnIndex === 0) {
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    },
    exportAll() {
      window.open(process.env.BASE_API + `/zlCheckSevenController/export?month=${this.formatDate(this.checkDate)}&category=${this.isActive}`)
    }
  },
  beforeDestroy() {
    this.list = []
    this.dateList = []
  }
}

