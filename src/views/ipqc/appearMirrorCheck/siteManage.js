
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getClassList, findList, findTableHead, getNumList, craftList, findDetail, update } from '@/api/ipqc/appearMirrorCheck'
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
      dateList: [],
      apperaList: [],
      apperaLists: [],
      startTime: '',
      endTime: '',
      classId: '',
      classList: [],
      setUpList: [],
      firstResult: false,
      checkNum: 5,
      isShowMenu: {
        'ipqc-update': false
      },
      daySpan: {}
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
                  if (citems.path === 'appearMirror') {
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
      this.dateList = []
      const params = {
        month: this.formatDate(this.checkDate)
      }
      findTableHead(params).then(res => {
        this.dateList = res.data
        this.fetchData()
      })
    },
    // 时间戳转yyyy-mm
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
    getNumList() {
      getNumList().then(res => {
        if (res.code === 0) {
          this.checkNum = res.data.num
          this.findDetail()
        }
      })
    },
    getList() {
      craftList().then(res => {
        this.apperaList = res.data
      })
    },
    findDetail() {
      const params = {
        team: this.classId,
        checkDate: this.formatDates(this.nowDate)
      }
      findDetail(params).then(res => {
        this.setUpList = []
        for (let i = 0; i < this.checkNum; i++) {
          if (res.data.length > i) {
            res.data[i].result = res.data[i].result + ''
            this.setUpList.push(res.data[i])
          } else {
            this.setUpList.push({
              normId: '',
              batchNo: '',
              num: '',
              result: '',
              remark: ''
            })
          }
        }
        this.setfi1()
      })
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
    searchInfo() {
      const d = new Date(this.checkDate)
      this.setDataNum(d.getFullYear(), d.getMonth() + 1)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        month: this.formatDate(this.checkDate)
      }
      findList(params).then(res => {
        this.list = []
        this.daySpan = {}
        for (let i = 1; i <= this.dataNum; i++) {
          const start = this.list.length
          let end = this.list.length
          let day = 0
          if (i > 9) {
            day = i
          } else {
            day = '0' + i
          }
          let ms = 0
          if (this.monthNum > 9) {
            ms = this.monthNum
          } else {
            ms = '0' + this.monthNum
          }
          const label = ms + '月' + day + '日'
          let flag = true
          for (const item of res.data) {
            if (item.checkDate === label) {
              flag = false
              this.list.push(item)
              end = this.list.length
            }
          }
          this.daySpan[label] = {
            start: start,
            end: end
          }
          if (flag) {
            this.list.push({
              checkDate: label
            })
          }
        }
        this.listLoading = false
      })
    },
    objectSpanMethods({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && this.daySpan[row.checkDate].start !== this.daySpan[row.checkDate].end) {
        if (this.daySpan[row.checkDate].start === rowIndex) {
          return {
            rowspan: this.daySpan[row.checkDate].end - this.daySpan[row.checkDate].start,
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
    // 关闭
    handleClose(formName) {
      // this.$refs[formName].resetFields()
    },
    addCheckLog() {
      this.getList()
      this.setDate()
      this.getNumList()
      this.firstResult = false
      this.addDialogVisible = true
    },
    updateCheckLog() {
      this.getList()
      this.setDate()
      this.getNumList()
      this.editDialogVisible = true
    },
    getNoAndCode() {
      for (const item of this.classList) {
        if (this.classId === item.name) {
          this.startTime = item.starth
          break
        }
      }
      this.firstResult = false
      this.getList()
      this.getNumList()
    },
    checkNums(row) {
      const num = new RegExp('^-?\\d+$')
      const value = row.num + ''
      if (value.trim().length !== 0 && !num.test(value)) {
        row.num = ''
        this.$message({
          type: 'error',
          message: '片数输入有误!'
        })
      }
    },
    setfi1() {
      this.apperaLists = []
      for (const item of this.apperaList) {
        var fi = {
          id: item.id,
          name: item.name,
          disabled: false
        }
        for (const row of this.setUpList) {
          if (row.normId === item.id) {
            fi.disabled = true
            break
          }
        }
        this.apperaLists.push(fi)
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
      for (const item of this.setUpList) {
        if (item.normId !== '' && item.batchNo !== '' && item.num !== '' && item.result !== '') {
          list.push(item)
        }
      }
      if (list.length !== this.setUpList.length) {
        this.$message({
          type: 'error',
          message: '请填写完整的镜检检验!'
        })
        return
      }
      const params = {
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
          h('span', '一键OK')
        ]
      )
    },
    select(event, column) {
      if (event) {
        for (const item of this.setUpList) {
          item.result = '0'
        }
      } else {
        for (const item of this.setUpList) {
          item.result = ''
        }
      }
    },
    exportAll() {
      window.open(process.env.BASE_API + `/zlCheckFacaeController/export?month=${this.formatDate(this.checkDate)}`)
    }
  }
}

