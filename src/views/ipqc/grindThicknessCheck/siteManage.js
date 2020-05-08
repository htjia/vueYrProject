
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getClassList, findList, findDetail, findNorm, update, checkWafer } from '@/api/ipqc/grindThicknessCheck'
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
      startTime: '8:30',
      endTime: '20:30',
      classId: '',
      classList: [],
      setUpList: [],
      setUpList1: [],
      dataSpan: {},
      ymNum: 0,
      pgNum: 0,
      waferObj: {},
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
                  if (citems.path === 'grindThickness') {
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
    this.setDataNum(this.checkDate.getFullYear(), this.checkDate.getMonth() + 1)
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
      for (let i = 1; i <= this.dataNum; i++) {
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
        this.dateList.push({
          data: i,
          label: ms + '月' + day + '日'
        })
      }
      this.fetchData()
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
    checkWafer(row) {
      if (row.waferId === '') {
        row.result = ''
        return
      }
      let flag = 0
      for (const item of this.setUpList) {
        if (item.waferId === row.waferId) {
          flag = flag + 1
        }
      }
      if (flag > 1) {
        row.waferId = ''
        this.$message({
          type: 'error',
          message: 'WaferID重复，请重新输入!'
        })
        return
      }
      checkWafer({ waferNo: row.waferId }).then(res => {
        if (res.data === null) {
          row.waferId = ''
          this.$message({
            type: 'error',
            message: 'WaferID不正确，请重新输入!'
          })
          row.result = ''
        } else {
          if (res.data.polishingPly === null || res.data.polishingVal === null || res.data.grindingPly === null || res.data.grindingVal === null) {
            row.waferId = ''
            this.$message({
              type: 'error',
              message: '减薄或抛光参数配置不正确!'
            })
            return
          }
          let min = 0
          let max = 0
          if (row.category === 0) {
            min = res.data.polishingPly - res.data.polishingVal
            max = res.data.polishingPly + res.data.polishingVal
          } else {
            min = res.data.grindingPly - res.data.grindingVal
            max = res.data.grindingPly + res.data.grindingVal
          }
          if (row.pointOne !== '' && row.pointOne !== null) {
            if (parseFloat(row.pointOne + '') + '' !== row.pointOne + '') {
              this.$message({
                type: 'error',
                message: row.waferId + '的1点数字输入有误!'
              })
              row.pointOne = ''
            } else if (parseFloat(row.pointOne + '') <= 0 || parseFloat(row.pointOne + '') > 1000) {
              this.$message({
                type: 'error',
                message: row.waferId + '的1点数字输入在0~1000之间!'
              })
              row.pointOne = ''
            } else if (parseFloat(row.pointOne + '') !== parseFloat(parseFloat(row.pointOne + '').toFixed(2))) {
              this.$message({
                type: 'error',
                message: row.waferId + '的1点数字最多保留两位小数!'
              })
              row.pointOne = parseFloat(row.pointOne + '').toFixed(2) + ''
            }
          } else if (row.pointTwo !== '' && row.pointTwo !== null) {
            if (parseFloat(row.pointTwo + '') + '' !== row.pointTwo + '') {
              this.$message({
                type: 'error',
                message: row.waferId + '的2点数字输入有误!'
              })
              row.pointTwo = ''
            } else if (parseFloat(row.pointTwo + '') <= 0 || parseFloat(row.pointTwo + '') > 1000) {
              this.$message({
                type: 'error',
                message: row.waferId + '的2点数字输入在0~1000之间!'
              })
              row.pointTwo = ''
            } else if (parseFloat(row.pointTwo + '') !== parseFloat(parseFloat(row.pointTwo + '').toFixed(2))) {
              this.$message({
                type: 'error',
                message: row.waferId + '的2点数字最多保留两位小数!'
              })
              row.pointTwo = parseFloat(row.pointTwo + '').toFixed(2) + ''
            }
          } else if (row.pointThree !== '' && row.pointThree !== null) {
            if (parseFloat(row.pointThree + '') + '' !== row.pointThree + '') {
              this.$message({
                type: 'error',
                message: row.waferId + '的3点数字输入有误!'
              })
              row.pointThree = ''
            } else if (parseFloat(row.pointThree + '') <= 0 || parseFloat(row.pointThree + '') > 1000) {
              this.$message({
                type: 'error',
                message: row.waferId + '的3点数字输入在0~1000之间!'
              })
              row.pointThree = ''
            } else if (parseFloat(row.pointThree + '') !== parseFloat(parseFloat(row.pointThree + '').toFixed(2))) {
              this.$message({
                type: 'error',
                message: row.waferId + '的3点数字最多保留两位小数!'
              })
              row.pointThree = parseFloat(row.pointThree + '').toFixed(2) + ''
            }
          } else if (row.pointFour !== '' && row.pointFour !== null) {
            if (parseFloat(row.pointFour + '') + '' !== row.pointFour + '') {
              this.$message({
                type: 'error',
                message: row.waferId + '的4点数字输入有误!'
              })
              row.pointFour = ''
            } else if (parseFloat(row.pointFour + '') <= 0 || parseFloat(row.pointFour + '') > 1000) {
              this.$message({
                type: 'error',
                message: row.waferId + '的4点数字输入在0~1000之间!'
              })
              row.pointFour = ''
            } else if (parseFloat(row.pointFour + '') !== parseFloat(parseFloat(row.pointFour + '').toFixed(2))) {
              this.$message({
                type: 'error',
                message: row.waferId + '的4点数字最多保留两位小数!'
              })
              row.pointFour = parseFloat(row.pointFour + '').toFixed(2) + ''
            }
          } else if (row.pointFive !== '' && row.pointFive !== null) {
            if (parseFloat(row.pointFive + '') + '' !== row.pointFive + '') {
              this.$message({
                type: 'error',
                message: row.waferId + '的5点数字输入有误!'
              })
              row.pointFive = ''
            } else if (parseFloat(row.pointFive + '') <= 0 || parseFloat(row.pointFive + '') > 1000) {
              this.$message({
                type: 'error',
                message: row.waferId + '的5点数字输入在0~1000之间!'
              })
              row.pointFive = ''
            } else if (parseFloat(row.pointFive + '') !== parseFloat(parseFloat(row.pointFive + '').toFixed(2))) {
              this.$message({
                type: 'error',
                message: row.waferId + '的5点数字最多保留两位小数!'
              })
              row.pointFive = parseFloat(row.pointFive + '').toFixed(2) + ''
            }
          }
          // if (row.pointOne !== '' && row.pointTwo !== '' && row.pointThree !== '' && row.pointFour !== '' && row.pointFive !== '') {
          //   if (parseFloat(row.pointOne + '') < min || parseFloat(row.pointOne + '') > max) {
          //     row.result = '1'
          //   } else if (parseFloat(row.pointTwo + '') < min || parseFloat(row.pointTwo + '') > max) {
          //     row.result = '1'
          //   } else if (parseFloat(row.pointThree + '') < min || parseFloat(row.pointThree + '') > max) {
          //     row.result = '1'
          //   } else if (parseFloat(row.pointFour + '') < min || parseFloat(row.pointFour + '') > max) {
          //     row.result = '1'
          //   } else if (parseFloat(row.pointFive + '') < min || parseFloat(row.pointFive + '') > max) {
          //     row.result = '1'
          //   } else {
          //     row.result = '0'
          //   }
          // } else {
          //   row.result = ''
          // }
          if (row.pointOne === '' && row.pointTwo === '' && row.pointThree === '' && row.pointFour === '' && row.pointFive === '') {
            row.result = ''
          } else {
            if (row.pointOne !== '' && (parseFloat(row.pointOne + '') < min || parseFloat(row.pointOne + '') > max)) {
              row.result = '1'
            } else {
              row.result = '0'
            }
            if (row.pointTwo !== '' && (parseFloat(row.pointTwo + '') < min || parseFloat(row.pointTwo + '') > max)) {
              row.result = '1'
            } else if (row.result !== '1') {
              row.result = '0'
            }
            if (row.pointThree !== '' && (parseFloat(row.pointThree + '') < min || parseFloat(row.pointThree + '') > max)) {
              row.result = '1'
            } else if (row.result !== '1') {
              row.result = '0'
            }
            if (row.pointFour !== '' && (parseFloat(row.pointFour + '') < min || parseFloat(row.pointFour + '') > max)) {
              row.result = '1'
            } else if (row.result !== '1') {
              row.result = '0'
            }
            if (row.pointFive !== '' && (parseFloat(row.pointFive + '') < min || parseFloat(row.pointFive + '') > max)) {
              row.result = '1'
            } else if (row.result !== '1') {
              row.result = '0'
            }
          }
        }
      })
    },
    checkWafers(row) {
      if (row.waferId === '') {
        row.result = ''
        return
      }
      let flag = 0
      for (const item of this.setUpList1) {
        if (item.waferId === row.waferId) {
          flag = flag + 1
        }
      }
      if (flag > 1) {
        row.waferId = ''
        this.$message({
          type: 'error',
          message: 'WaferID重复，请重新输入!'
        })
        return
      }
      checkWafer({ waferNo: row.waferId }).then(res => {
        if (res.data === null) {
          row.waferId = ''
          this.$message({
            type: 'error',
            message: 'WaferID不正确，请重新输入!'
          })
          row.result = ''
        } else {
          if (res.data.polishingPly === null || res.data.polishingVal === null || res.data.grindingPly === null || res.data.grindingVal === null) {
            row.waferId = ''
            this.$message({
              type: 'error',
              message: '减薄或抛光参数配置不正确!'
            })
            return
          }
          let min = 0
          let max = 0
          if (row.category === 0) {
            min = res.data.polishingPly - res.data.polishingVal
            max = res.data.polishingPly + res.data.polishingVal
          } else {
            min = res.data.grindingPly - res.data.grindingVal
            max = res.data.grindingPly + res.data.grindingVal
          }
          if (row.pointOne !== '' && row.pointOne !== null) {
            if (parseFloat(row.pointOne + '') + '' !== row.pointOne + '') {
              this.$message({
                type: 'error',
                message: row.waferId + '的1点数字输入有误!'
              })
              row.pointOne = ''
            } else if (parseFloat(row.pointOne + '') <= 0 || parseFloat(row.pointOne + '') > 1000) {
              this.$message({
                type: 'error',
                message: row.waferId + '的1点数字输入在0~1000之间!'
              })
              row.pointOne = ''
            } else if (parseFloat(row.pointOne + '') !== parseFloat(parseFloat(row.pointOne + '').toFixed(2))) {
              this.$message({
                type: 'error',
                message: row.waferId + '的1点数字最多保留两位小数!'
              })
              row.pointOne = parseFloat(row.pointOne + '').toFixed(2) + ''
            }
          } else if (row.pointTwo !== '' && row.pointTwo !== null) {
            if (parseFloat(row.pointTwo + '') + '' !== row.pointTwo + '') {
              this.$message({
                type: 'error',
                message: row.waferId + '的2点数字输入有误!'
              })
              row.pointTwo = ''
            } else if (parseFloat(row.pointTwo + '') <= 0 || parseFloat(row.pointTwo + '') > 1000) {
              this.$message({
                type: 'error',
                message: row.waferId + '的2点数字输入在0~1000之间!'
              })
              row.pointTwo = ''
            } else if (parseFloat(row.pointTwo + '') !== parseFloat(parseFloat(row.pointTwo + '').toFixed(2))) {
              this.$message({
                type: 'error',
                message: row.waferId + '的2点数字最多保留两位小数!'
              })
              row.pointTwo = parseFloat(row.pointTwo + '').toFixed(2) + ''
            }
          } else if (row.pointThree !== '' && row.pointThree !== null) {
            if (parseFloat(row.pointThree + '') + '' !== row.pointThree + '') {
              this.$message({
                type: 'error',
                message: row.waferId + '的3点数字输入有误!'
              })
              row.pointThree = ''
            } else if (parseFloat(row.pointThree + '') <= 0 || parseFloat(row.pointThree + '') > 1000) {
              this.$message({
                type: 'error',
                message: row.waferId + '的3点数字输入在0~1000之间!'
              })
              row.pointThree = ''
            } else if (parseFloat(row.pointThree + '') !== parseFloat(parseFloat(row.pointThree + '').toFixed(2))) {
              this.$message({
                type: 'error',
                message: row.waferId + '的3点数字最多保留两位小数!'
              })
              row.pointThree = parseFloat(row.pointThree + '').toFixed(2) + ''
            }
          } else if (row.pointFour !== '' && row.pointFour !== null) {
            if (parseFloat(row.pointFour + '') + '' !== row.pointFour + '') {
              this.$message({
                type: 'error',
                message: row.waferId + '的4点数字输入有误!'
              })
              row.pointFour = ''
            } else if (parseFloat(row.pointFour + '') <= 0 || parseFloat(row.pointFour + '') > 1000) {
              this.$message({
                type: 'error',
                message: row.waferId + '的4点数字输入在0~1000之间!'
              })
              row.pointFour = ''
            } else if (parseFloat(row.pointFour + '') !== parseFloat(parseFloat(row.pointFour + '').toFixed(2))) {
              this.$message({
                type: 'error',
                message: row.waferId + '的4点数字最多保留两位小数!'
              })
              row.pointFour = parseFloat(row.pointFour + '').toFixed(2) + ''
            }
          } else if (row.pointFive !== '' && row.pointFive !== null) {
            if (parseFloat(row.pointFive + '') + '' !== row.pointFive + '') {
              this.$message({
                type: 'error',
                message: row.waferId + '的5点数字输入有误!'
              })
              row.pointFive = ''
            } else if (parseFloat(row.pointFive + '') <= 0 || parseFloat(row.pointFive + '') > 1000) {
              this.$message({
                type: 'error',
                message: row.waferId + '的5点数字输入在0~1000之间!'
              })
              row.pointFive = ''
            } else if (parseFloat(row.pointFive + '') !== parseFloat(parseFloat(row.pointFive + '').toFixed(2))) {
              this.$message({
                type: 'error',
                message: row.waferId + '的5点数字最多保留两位小数!'
              })
              row.pointFive = parseFloat(row.pointFive + '').toFixed(2) + ''
            }
          }
          // if (row.pointOne !== '' && row.pointTwo !== '' && row.pointThree !== '' && row.pointFour !== '' && row.pointFive !== '') {
          //   if (parseFloat(row.pointOne + '') < min || parseFloat(row.pointOne + '') > max) {
          //     row.result = '1'
          //   } else if (parseFloat(row.pointTwo + '') < min || parseFloat(row.pointTwo + '') > max) {
          //     row.result = '1'
          //   } else if (parseFloat(row.pointThree + '') < min || parseFloat(row.pointThree + '') > max) {
          //     row.result = '1'
          //   } else if (parseFloat(row.pointFour + '') < min || parseFloat(row.pointFour + '') > max) {
          //     row.result = '1'
          //   } else if (parseFloat(row.pointFive + '') < min || parseFloat(row.pointFive + '') > max) {
          //     row.result = '1'
          //   } else {
          //     row.result = '0'
          //   }
          // } else {
          //   row.result = ''
          // }
          if (row.pointOne === '' && row.pointTwo === '' && row.pointThree === '' && row.pointFour === '' && row.pointFive === '') {
            row.result = ''
          } else {
            if (row.pointOne !== '' && (parseFloat(row.pointOne + '') < min || parseFloat(row.pointOne + '') > max)) {
              row.result = '1'
            } else {
              row.result = '0'
            }
            if (row.pointTwo !== '' && (parseFloat(row.pointTwo + '') < min || parseFloat(row.pointTwo + '') > max)) {
              row.result = '1'
            } else if (row.result !== '1') {
              row.result = '0'
            }
            if (row.pointThree !== '' && (parseFloat(row.pointThree + '') < min || parseFloat(row.pointThree + '') > max)) {
              row.result = '1'
            } else if (row.result !== '1') {
              row.result = '0'
            }
            if (row.pointFour !== '' && (parseFloat(row.pointFour + '') < min || parseFloat(row.pointFour + '') > max)) {
              row.result = '1'
            } else if (row.result !== '1') {
              row.result = '0'
            }
            if (row.pointFive !== '' && (parseFloat(row.pointFive + '') < min || parseFloat(row.pointFive + '') > max)) {
              row.result = '1'
            } else if (row.result !== '1') {
              row.result = '0'
            }
          }
        }
      })
    },
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      return y + '-' + m.substring(m.length - 2, m.length)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        month: this.formatDate(this.checkDate)
      }
      findList(params).then(res => {
        this.list = []
        this.dataSpan = {}
        for (let x = 0; x < this.dateList.length; x++) {
          let flag = true
          for (let i = 0; i < res.data.length; i++) {
            if (this.dateList[x].label === res.data[i].checkDate) {
              this.list.push(res.data[i])
              flag = false
            }
          }
          if (flag) {
            this.list.push({
              checkDate: this.dateList[x].label,
              waferId: null,
              pointOne: null,
              pointTwo: null,
              pointThree: null,
              pointFour: null,
              pointFive: null,
              firstReslut: null,
              pollingResult: null,
              team: null,
              checkerName: null,
              waferIdP: null,
              pointOneP: null,
              pointTwoP: null,
              pointThreeP: null,
              pointFourP: null,
              pointFiveP: null,
              firstReslutP: null,
              pollingResultP: null,
              teamP: null,
              checkerNameP: null
            })
          }
        }
        for (let i = 0; i < this.list.length; i++) {
          if (this.dataSpan[this.list[i].checkDate] === undefined) {
            this.dataSpan[this.list[i].checkDate] = {
              start: i,
              num: 1
            }
          } else {
            this.dataSpan[this.list[i].checkDate].num = this.dataSpan[this.list[i].checkDate].num + 1
          }
        }
        this.listLoading = false
      })
    },
    objectSpanMethods({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && this.dataSpan[row.checkDate].num !== 1) {
        if (this.dataSpan[row.checkDate].start === rowIndex) {
          return {
            rowspan: this.dataSpan[row.checkDate].num,
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
    // 时间戳转yyyy-mm-dd
    formatDates(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    findDetail() {
      findNorm().then(res => {
        for (const item of res.data) {
          if (item.category === 0) {
            this.ymNum = item.num
          } else {
            this.pgNum = item.num
          }
        }
        const params = {
          team: this.classId,
          type: this.isActive,
          checkDate: this.formatDates(this.nowDate)
        }
        findDetail(params).then(res => {
          this.setUpList = []
          this.setUpList1 = []
          for (const item of res.data) {
            item.result = item.result + ''
            if (item.category === 0) {
              this.setUpList.push(item)
            } else {
              this.setUpList1.push(item)
            }
          }
          for (let i = 0; i < this.ymNum; i++) {
            if (this.setUpList.length - 1 < i) {
              this.setUpList.push({
                waferId: '',
                pointOne: '',
                pointTwo: '',
                pointThree: '',
                pointFour: '',
                pointFive: '',
                result: '',
                category: 0
              })
            }
          }
          for (let i = 0; i < this.pgNum; i++) {
            if (this.setUpList1.length - 1 < i) {
              this.setUpList1.push({
                waferId: '',
                pointOne: '',
                pointTwo: '',
                pointThree: '',
                pointFour: '',
                pointFive: '',
                result: '',
                category: 1
              })
            }
          }
        })
      })
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
      let str = ''
      for (const item of this.setUpList) {
        // if (item.waferId !== '' && item.result === '') {
        //   str = item.waferId
        //   break
        // }
        if (item.result === '') {
          if (item.waferId === '') {
            str = ''
          } else {
            str = item.waferId
            break
          }
        }
        // if (item.waferId !== '') {
        list.push(item)
        // }
      }
      // if (str === null) {
      //   this.$message({
      //     type: 'error',
      //     message: '减薄厚度输入不完整!'
      //   })
      //   return
      // }
      if (str !== '') {
        this.$message({
          type: 'error',
          message: '减薄厚度:' + str + '输入不完整!'
        })
        return
      }
      let str1 = ''
      for (const item of this.setUpList1) {
        if (item.result === '') {
          if (item.waferId === '') {
            str1 = ''
          } else {
            str1 = item.waferId
            break
          }
        }
        // if (item.waferId !== '') {
        list.push(item)
        // }
      }
      // if (str1 === null) {
      //   this.$message({
      //     type: 'error',
      //     message: '抛光厚度输入不完整!'
      //   })
      //   return
      // }
      if (str1 !== '') {
        this.$message({
          type: 'error',
          message: '抛光厚度:' + str1 + '输入不完整!'
        })
        return
      }
      const params = {
        checkDate: this.formatDates(this.nowDate) + ' ' + this.startTime + ':00',
        checker: sessionStorage.getItem('User-Id'),
        detailList: list,
        team: this.classId,
        type: this.isActive
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
      this.nowDate = new Date().getTime()
      this.isActive = 0
      this.waferObj = {}
      this.classId = this.classList[0].name
      this.startTime = this.classList[0].starth
      this.setDate()
      this.findDetail()
      this.addDialogVisible = true
    },
    updateCheckLog() {
      this.nowDate = new Date().getTime()
      this.isActive = 0
      this.waferObj = {}
      this.classId = this.classList[0].name
      this.startTime = this.classList[0].starth
      this.setDate()
      this.findDetail()
      this.editDialogVisible = true
    },
    getNoAndCode() {
      for (const item of this.classList) {
        if (this.classId === item.name) {
          this.startTime = item.starth
          break
        }
      }
      this.findDetail()
    },
    navClick(type) {
      if (type !== this.isActive) {
        this.isActive = type
        this.findDetail()
      }
    },
    exportAll() {
      window.open(process.env.BASE_API + `/zlCheckGrindController/export?month=${this.formatDate(this.checkDate)}`)
    }
  }
}

