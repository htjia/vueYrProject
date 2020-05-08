
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getClassList, findList, findDetail, craftList, update, findTableHead } from '@/api/ipqc/craftParamCheck'
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
      startTime: '',
      endTime: '',
      classId: '',
      setUpList: [],
      classList: [],
      detailList: [],
      firstResult: true,
      pollingResult: true,
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
                  if (citems.path === 'consumePeriod') {
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
    this.fetchData()
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
        // this.setDataNum(this.checkDate.getFullYear(), this.checkDate.getMonth() + 1)
      })
    },
    searchInfo() {
      this.list = []
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
        category: 1
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
      // this.setDataNum(this.checkDate.getFullYear(), this.checkDate.getMonth() + 1)
      const d = new Date(this.checkDate)
      const data = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
      this.dataNum = data
      this.monthNum = d.getMonth() + 1
      this.yearNum = d.getFullYear()
      this.listLoading = true
      const params = {
        month: this.formatDate(this.checkDate),
        category: 1
      }
      findList(params).then(res => {
        this.dateList = []
        if (res.data.length > 0) {
          this.dateList = res.data[0].detailList
        }
        setTimeout(() => {
          this.list = res.data
          this.listLoading = false
        }, 500)
        // this.list = []
        // if (res.data.length > 15) {
        //   for (let i = 0; i < 15; i++) {
        //     this.list.push(res.data[i])
        //   }
        //   setTimeout(() => {
        //     for (let i = 15; i < res.data.length; i++) {
        //       this.list.push(res.data[i])
        //     }
        //   })
        // } else {
        //   this.list = res.data
        // }
        // for (const dayInfo of res.data) {
        //   const detialList = []
        //   for (const item of this.dateList) {
        //     let flag = true
        //     for (const detail of dayInfo.detailList) {
        //       const day = parseInt(detail.checkDate.substring(3, 5))
        //       if (item.data === day && item.label === detail.checkDate) {
        //         detialList.push(detail)
        //         flag = false
        //       }
        //     }
        //     if (flag) {
        //       detialList.push({
        //         checkDate: '',
        //         checkerName: '',
        //         firstResult: '',
        //         machine: '',
        //         pollingResult: '',
        //         remark: ''
        //       })
        //     }
        //   }
        //   var data = {
        //     name: dayInfo.name,
        //     detailList: detialList
        //   }
        //   this.list.push(data)
        // }
        this.listLoading = false
      })
    },
    // 关闭
    handleClose(formName) {
      // this.$refs[formName].resetFields()
    },
    addCheckLog() {
      this.setDate()
      this.findDetail()
      this.firstResult = false
      this.pollingResult = false
      this.addDialogVisible = true
    },
    findDetail() {
      const params = {
        checkDate: this.formatDates(this.nowDate),
        category: 1,
        team: this.classId
      }
      findDetail(params).then(res => {
        this.detailList = res.data
        this.craftList()
      })
    },
    // 查询
    craftList() {
      const params = {
        category: 1
      }
      craftList(params).then(res => {
        this.setUpList = []
        for (const item of res.data) {
          let flag = true
          for (const detail of this.detailList) {
            if (detail.normId === item.id) {
              flag = false
              this.setUpList.push({
                firstResult: detail.firstResult + '',
                machine: detail.machine,
                normId: item.id,
                name: item.name,
                pollingResult: detail.pollingResult + '',
                remark: detail.remark
              })
              break
            }
          }
          if (flag) {
            var data = {
              firstResult: '',
              machine: '',
              normId: item.id,
              name: item.name,
              pollingResult: '',
              remark: ''
            }
            this.setUpList.push(data)
          }
        }
      })
    },
    updateCheckLog() {
      this.setDate()
      this.findDetail()
      this.editDialogVisible = true
    },
    save() {
      if (this.classId === '' || this.classId === null) {
        this.$message({
          type: 'error',
          message: '当前时间未配置班别!'
        })
        return
      }
      const params = {
        category: 1,
        checkDate: this.formatDates(this.nowDate) + ' ' + this.startTime + ':00',
        checker: sessionStorage.getItem('User-Id'),
        detailList: this.setUpList,
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
    getNoAndCode() {
      for (const item of this.classList) {
        if (item.name === this.classId) {
          this.startTime = item.starth
          this.endTime = item.endh
          break
        }
      }
      this.findDetail()
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
          item.firstResult = '0'
        }
      } else {
        for (const item of this.setUpList) {
          item.firstResult = ''
        }
      }
    },
    renderHeader1(h, { column }) {
      return h(
        'span',
        {
          style: 'padding-top: 10px;line-height: 30px;'
        },
        [
          h('span', column.label),
          h('el-checkbox', {
            style: 'margin-left: 15px;margin-right: 5px;',
            props: {
              checked: false
            },
            on: {
              change: ($event, column) => this.select1($event, column)
            },
            'v-model': this.pollingResult
          }),
          h('span', '一键OK')
        ]
      )
    },
    select1(event, column) {
      if (event) {
        for (const item of this.setUpList) {
          item.pollingResult = '0'
        }
      } else {
        for (const item of this.setUpList) {
          item.pollingResult = ''
        }
      }
    },
    exportAll() {
      window.open(process.env.BASE_API + `/zlCheckCraftController/export?month=${this.formatDate(this.checkDate)}&category=1`)
    }
  },
  beforeDestroy() {
    this.list = []
    this.dateList = []
  }
}

