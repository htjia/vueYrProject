
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { matfindList, furnacefindAll, getRunMsg, reasonQuery, levelQuery, completeCheck, getAbnormalList, getBillNo, addAbnormalList, zlqueryList, findWafer, insertPLine } from '@/api/extensionManage/audit/warehousing'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      list: [],
      addDialogVisible: false,
      runId: '',
      machineValue: '',
      furnaceValue: '',
      machineOptions: [],
      furnaceOptions: [],
      checkType: 0,
      finishList: [
        {
          id: 0,
          name: '未检验'
        },
        {
          id: 1,
          name: '已检验'
        }
      ],
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      beginDate: this.getSevenFormatDate(),
      endDate: this.getNowFormatDates(),
      anotherList: [],
      allAnohterList: {},
      levelList: [],
      reasonList: [],
      userListOption: [],
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
      anotherLists: [],
      newCode: '',
      newSatue: '未确认',
      newRemark: '',
      makingDate: this.getNowFormatDate(),
      makinger: sessionStorage.getItem('Admin-Token'),
      confirmData: this.getNowFormatDate(),
      confirmer: '',
      wgList: [],
      submitList: [],
      saveType: 0,
      searchType: 0,
      rowInfo: {
        operation: 0,
        checkedStatus: 0,
        checkedNum: 0
      }
    }
  },
  mounted() {
    this.beginDate = this.getSevenFormatDate()
    this.endDate = this.getNowFormatDates()
    this.fetchData()
    this.reasonQuery()
    this.levelQuery()
    this.matfindList()
    this.furnacefindAll()
    this.zlqueryList()
  },
  methods: {
    zlqueryList() {
      const params = {
        pageNum: 1,
        pageSize: 10000000
      }
      zlqueryList(params).then(res => {
        this.wgList = res.data.list
      })
    },
    // 单击单据信息
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
      this.anotherList = []
      const params = {
        runId: row.runId
      }
      findWafer(params).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          var data = {
            waferId: res.data[i].waferId,
            supplier: res.data[i].supplier,
            laserMark: res.data[i].laserMark,
            oldVisualName: res.data[i].oldVisualName,
            oldReasonName: res.data[i].oldReasonName,
            amendResult: res.data[i].amendResult,
            amendReasonId: res.data[i].amendReasonId,
            spotCheckId: res.data[i].spotCheckId,
            creator: res.data[i].creator,
            sign: res.data[i].sign,
            status: res.data[i].status
          }
          this.anotherList.push(data)
        }
      })
    },
    getNowFormatDate() {
      var today = new Date()
      return this.formatDate(today.getTime())
    },
    getNowFormatDates() {
      var today = new Date()
      return today
    },
    getSevenFormatDate() {
      var today = new Date()
      var SevenDayAgo = today - 86400 * 6 * 1000
      return SevenDayAgo
    },
    tableRowClassColor({ row, rowIndex }) {
      if (row.sign === 1) {
        return 'set_yellow'
      }
      console.log(row.status)
      if (row.status === 0 || row.status === 1) {
        return 'set_pink'
      }
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    matfindList() {
      matfindList().then(res => {
        this.machineOptions = res.data
      })
    },
    furnacefindAll() {
      const params = {
        pageNum: 1,
        pageSize: 10000000
      }
      furnacefindAll(params).then(res => {
        this.furnaceOptions = res.data.list
      })
    },
    reasonQuery() {
      const params = {
        pageNum: 1,
        pageSize: 10000000,
        status: 0
      }
      reasonQuery(params).then(res => {
        this.reasonList = res.data.list
      })
    },
    levelQuery() {
      const params = {
        pageNum: 1,
        pageSize: 10000000,
        status: 0
      }
      levelQuery(params).then(res => {
        this.levelList = res.data.list
      })
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        completeStatus: this.checkType,
        machineId: this.machineValue,
        runId: this.runId,
        furnaceId: this.furnaceValue
      }
      this.allAnohterList = {}
      this.searchType = this.checkType
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      getRunMsg(requestParams).then(res => {
        this.list = []
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].index = i
          this.list.push(res.data[i])
        }
        this.listLoading = false
        this.anotherList = []
        this.rowInfo = {
          operation: 0,
          checkedStatus: 0
        }
        this.saveType = 0
        for (const item of this.list) {
          if (item.checkedNum > 0) {
            this.saveType = 1
            break
          }
        }
        if (this.list.length > 0) {
          this.$refs.listTabel.setCurrentRow(this.list[0])
          // this.handleCurrentChange(this.list[0])
        }
      })
    },
    handleSearch() {
      this.fetchData()
    },
    clearCondition() {
      this.runId = ''
      this.machineValue = ''
      this.furnaceValue = ''
      this.checkType = 0
      this.beginDate = this.getSevenFormatDate()
      this.endDate = this.getNowFormatDates()
      this.handleSearch()
    },
    backList() {
      if (this.rowInfo.runId === null || this.rowInfo.runId === undefined || this.rowInfo.runId === '') {
        this.$message({
          type: 'error',
          message: '请选择检验单!'
        })
        return
      }
      this.$confirm('是否确定将改单据退回产线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestParams = {
          runId: this.rowInfo.runId
        }
        insertPLine(requestParams).then(res => {
          this.$message({
            type: 'success',
            message: '退回成功!'
          })
          this.fetchData()
        })
      })
    },
    checkFinish() {
      if (this.rowInfo.runId === null || this.rowInfo.runId === undefined || this.rowInfo.runId === '') {
        this.$message({
          type: 'error',
          message: '请选择检验单!'
        })
        return
      }
      let num = 0
      const list = []
      for (const item of this.anotherList) {
        if (item.amendResult !== null) {
          num = num + 1
        }
        list.push(item)
      }
      this.rowInfo.checkedNum = num
      this.allAnohterList[this.rowInfo.runId] = list
      this.rowInfo.checkedStatus = 1
      this.saveType = 0
      for (const item of this.list) {
        if (item.checkedNum > 0) {
          this.saveType = 1
          break
        }
      }
      if (this.rowInfo.index + 1 < this.list.length) {
        this.$refs.listTabel.setCurrentRow(this.list[this.rowInfo.index + 1])
      }
    },
    getErrorList(type) {
      if (this.list.length === 0) {
        this.$message({
          type: 'error',
          message: '暂无异常单!'
        })
        return
      }
      const keys = Object.keys(this.allAnohterList)
      var list = []
      this.anotherLists = []
      for (const item of keys) {
        const anotherList = this.allAnohterList[item]
        const lists = []
        for (let i = 0; i < anotherList.length; i++) {
          if (anotherList[i].amendResult !== null) {
            var data = {
              waferId: anotherList[i].waferId,
              amendResult: anotherList[i].amendResult,
              amendReasonId: anotherList[i].amendReasonId,
              spotCheckId: anotherList[i].spotCheckId,
              creator: anotherList[i].creator
            }
            let newVisualName = ''
            let newReasonName = ''
            for (const level of this.levelList) {
              if (level.id === anotherList[i].amendResult) {
                newVisualName = level.name
                break
              }
            }
            for (const level of this.reasonList) {
              if (level.id === anotherList[i].amendReasonId) {
                newReasonName = level.name
                break
              }
            }
            var datas = {
              runId: item,
              waferId: anotherList[i].waferId,
              laserMark: anotherList[i].laserMark,
              oldVisualName: anotherList[i].oldVisualName,
              oldReasonName: anotherList[i].oldReasonName,
              newVisualName: newVisualName,
              newReasonName: newReasonName,
              spotCheckId: anotherList[i].spotCheckId,
              creator: anotherList[i].creator
            }
            this.anotherLists.push(datas)
            lists.push(data)
          }
        }
        list.push({
          runId: item,
          list: lists
        })
      }
      if (list.length === 0) {
        this.$message({
          type: 'error',
          message: '暂无已检验的单据,请先检验!'
        })
        return
      }
      this.submitList = list
      if (type === 0) {
        completeCheck(list).then(res => {
          if (res.code === 0) {
            getAbnormalList().then(res => {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.fetchData()
            })
          }
        })
      } else {
        this.addDialogVisible = true
        this.newCode = ''
        this.newSatue = '未确认'
        this.newRemark = ''
        this.makingDate = this.getNowFormatDate()
        this.makinger = sessionStorage.getItem('Admin-Token')
        this.confirmData = this.getNowFormatDate()
        this.confirmer = ''
        this.getBillNo()

        // getAbnormalList().then(res => {
        //   this.anotherLists = res.data
        // })
      }
    },
    getErrorLists() {
      getAbnormalList().then(res => {
        if (res.data.length === 0) {
          this.$message({
            type: 'error',
            message: '暂无需要提交异常的数据!'
          })
          return
        }
        this.anotherLists = res.data
        this.addDialogVisible = true
        this.newCode = ''
        this.newSatue = '未确认'
        this.newRemark = ''
        this.makingDate = this.getNowFormatDate()
        this.makinger = sessionStorage.getItem('Admin-Token')
        this.confirmData = this.getNowFormatDate()
        this.confirmer = ''
        this.getBillNo()
      })
    },
    getUpdateList() {
      var list = []
      const lists = []
      for (let i = 0; i < this.anotherList.length; i++) {
        if (this.anotherList[i].amendResult !== null) {
          var data = {
            waferId: this.anotherList[i].waferId,
            amendResult: this.anotherList[i].amendResult,
            amendReasonId: this.anotherList[i].amendReasonId,
            spotCheckId: this.anotherList[i].spotCheckId,
            creator: this.anotherList[i].creator
          }
          lists.push(data)
        }
      }
      list.push({
        runId: this.rowInfo.runId,
        list: lists
      })
      if (list.length === 0) {
        this.$message({
          type: 'error',
          message: '暂无需要修改的单据!'
        })
        return
      }
      completeCheck(list).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.fetchData()
        }
      })
    },
    getBillNo() {
      const params = {
        time: this.makingDate
      }
      getBillNo(params).then(res => {
        this.newCode = res.data
      })
    },
    saveError() {
      if (this.makingDate === '') {
        this.$message({
          type: 'error',
          message: '请选择制单日期!'
        })
        return
      }
      if (this.searchType === 0) {
        completeCheck(this.submitList).then(res => {
          if (res.code === 0) {
            getAbnormalList().then(res => {
              var list = []
              for (const li of res.data) {
                var data = {
                  runId: li.runId,
                  waferId: li.waferId,
                  visualAmendId: li.visualAmendId
                }
                list.push(data)
              }
              const params = {
                abnormal: {
                  billNo: this.newCode,
                  creator: sessionStorage.getItem('User-Id'),
                  remark: this.newRemark
                },
                list: list
              }
              addAbnormalList(params).then(res => {
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '操作成功!'
                  })
                  this.addDialogVisible = false
                  this.fetchData()
                }
              })
            })
          }
        })
      } else {
        var list = []
        for (const li of this.anotherLists) {
          var data = {
            runId: li.runId,
            waferId: li.waferId,
            visualAmendId: li.visualAmendId
          }
          list.push(data)
        }
        const params = {
          abnormal: {
            billNo: this.newCode,
            creator: sessionStorage.getItem('User-Id'),
            remark: this.newRemark
          },
          list: list
        }
        addAbnormalList(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.addDialogVisible = false
            this.fetchData()
          }
        })
      }
    },
    reportExcel() {
      if (this.makingDate === '') {
        this.$message({
          type: 'error',
          message: '请选择制单日期!'
        })
        return
      }
      completeCheck(this.submitList).then(res => {
        if (res.code === 0) {
          getAbnormalList().then(res => {
            var lists = {}
            for (const li of this.anotherLists) {
              // var data = {
              //   waferId: li.waferId
              // }
              // list.push(data)
              lists[li.runId] = 1
            }
            var ids = Object.keys(lists)
            var list = []
            for (const li of ids) {
              var data = {
                runId: li
              }
              list.push(data)
            }
            const params = {
              abnormal: {
                billNo: this.newCode,
                creator: sessionStorage.getItem('User-Id'),
                remark: this.newRemark
              },
              list: list
            }
            addAbnormalList(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                this.addDialogVisible = false
                window.open(process.env.BASE_API + '/zl-visual-amend/export-data', '_blank')
                this.fetchData()
              }
            })
          })
        }
      })
    }
  }
}

