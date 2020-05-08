
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryAll, add, userList, getlasermark } from '@/api/extensionManage/dataMaintain/dataMaintain'
const defaultFormThead = [
  {
    thName: '导入时间',
    thKey: 'name'
  },
  {
    thName: '镭刻号',
    thKey: 'status'
  }
]
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      selectTheadVisble: false,
      notBastic: false,
      list: [],
      defaultFormThead: [],
      formThead: defaultFormThead,
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
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
      userOptions: [],
      isActive: 0,
      rules: {
        waferId: [{ required: true, message: '请选择站点类型', trigger: 'blur' }],
        newsNo: [{ required: true, message: '请选择站点状态', trigger: 'blur' }]
      },
      currentId: '',
      userList: [],
      waferId: '',
      operName: '',
      rowInfo: {
        involveRange: '',
        newNo: '',
        oldNo: '',
        operateTime: '',
        operator: '',
        operatorName: '',
        remark: '',
        status: '',
        waferId: '',
        newsNo: ''
      },
      checkList: [],
      isDisabled: false
    }
  },
  mounted() {
    this.fetchData()
    this.userLists()
  },
  methods: {
    // 修改衬底
    editSubstrate() {
      // if (this.rowInfo.waferId === '') {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择需要修改的衬底!'
      //   })
      //   return
      // }
      this.editDialogVisible = true
      this.checkList = []
      this.rowInfo = {
        involveRange: '',
        newNo: '',
        oldNo: '',
        operateTime: '',
        operator: '',
        operatorName: '',
        remark: '',
        status: '',
        waferId: '',
        newsNo: ''
      }
      // if (this.rowInfo.involveRange.length > 0) {
      //   const lis = this.rowInfo.involveRange.split(',')
      //   for (let i = 0; i < lis.length; i++) {
      //     if (lis[i] === '0') {
      //       this.checkList.push('外延生产')
      //     } else if (lis[i] === '1') {
      //       this.checkList.push('外延仓库')
      //     } else if (lis[i] === '2') {
      //       this.checkList.push('外延品保')
      //     } else if (lis[i] === '3') {
      //       this.checkList.push('芯片生产')
      //     } else if (lis[i] === '4') {
      //       this.checkList.push('芯片品保')
      //     } else if (lis[i] === '5') {
      //       this.checkList.push('芯片仓库')
      //     }
      //   }
      // }
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearAll() {
      this.pageSize = 12
      this.runId = ''
      this.waferId = ''
      this.operName = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearch()
    },
    findNewNo() {
      if (this.rowInfo.waferId !== '') {
        const params = {
          waferId: this.rowInfo.waferId
        }
        getlasermark(params).then(res => {
          if (res.data !== null) {
            this.rowInfo.newNo = res.data
          }
        })
      }
    },
    userLists() {
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      userList(params).then(res => {
        this.userList = res.data.list
      })
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
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.formatDate(this.beginDate) + ' 00:00:00',
        endTime: this.formatDate(this.endDate) + ' 23:59:59',
        waferId: this.waferId,
        operatorName: this.operName
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      queryAll(requestParams).then(res => {
        this.rowInfo = {
          involveRange: '',
          newNo: '',
          oldNo: '',
          operateTime: '',
          operator: '',
          operatorName: '',
          remark: '',
          status: '',
          waferId: '',
          newsNo: ''
        }
        this.list = []
        for (const li of res.data.list) {
          li.involveRangeName = ''
          if (li.involveRange.length > 0) {
            const lis = li.involveRange.split(',')
            for (let i = 0; i < lis.length; i++) {
              if (i === 0) {
                if (lis[i] === '0') {
                  li.involveRangeName = '[外延生产]'
                } else if (lis[i] === '1') {
                  li.involveRangeName = '[外延仓库]'
                } else if (lis[i] === '2') {
                  li.involveRangeName = '[外延品保]'
                } else if (lis[i] === '3') {
                  li.involveRangeName = '[芯片生产]'
                } else if (lis[i] === '4') {
                  li.involveRangeName = '[芯片品保]'
                } else if (lis[i] === '5') {
                  li.involveRangeName = '[芯片仓库]'
                }
              } else {
                if (lis[i] === '0') {
                  li.involveRangeName = li.involveRangeName + ',' + '[外延生产]'
                } else if (lis[i] === '1') {
                  li.involveRangeName = li.involveRangeName + ',' + '[外延仓库]'
                } else if (lis[i] === '2') {
                  li.involveRangeName = li.involveRangeName + ',' + '[外延品保]'
                } else if (lis[i] === '3') {
                  li.involveRangeName = li.involveRangeName + ',' + '[芯片生产]'
                } else if (lis[i] === '4') {
                  li.involveRangeName = li.involveRangeName + ',' + '[芯片品保]'
                } else if (lis[i] === '5') {
                  li.involveRangeName = li.involveRangeName + ',' + '[芯片仓库]'
                }
              }
            }
          }
          this.list.push(li)
        }
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    handleCurrentChange(row) {
      this.rowInfo = {
        involveRange: '',
        newNo: '',
        oldNo: '',
        operateTime: '',
        operator: '',
        operatorName: '',
        remark: '',
        status: '',
        waferId: '',
        newsNo: ''
      }
      this.rowInfo.newsNo = ''
    },
    // 添加提交
    submitForm() {
      if (this.rowInfo.newsNo.length === 0) {
        this.$message({
          type: 'error',
          message: '请填写新镭刻号!'
        })
        return
      }
      if (this.rowInfo.newNo.length === 0) {
        this.$message({
          type: 'error',
          message: '请填写正确的WaferID!'
        })
        return
      }
      if (this.checkList.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择影响的表!'
        })
        return
      }
      if (this.rowInfo.newsNo === this.rowInfo.newNo) {
        this.$message({
          type: 'error',
          message: '新镭刻号与现镭刻号相同未做修改!'
        })
        return
      }
      this.isDisabled = true
      let str = ''
      for (let i = 0; i < this.checkList.length; i++) {
        if (i === 0) {
          if (this.checkList[i] === '外延生产') {
            str = '0'
          } else if (this.checkList[i] === '外延仓库') {
            str = '1'
          } else if (this.checkList[i] === '外延品保') {
            str = '2'
          } else if (this.checkList[i] === '芯片生产') {
            str = '3'
          } else if (this.checkList[i] === '芯片品保') {
            str = '4'
          } else if (this.checkList[i] === '芯片仓库') {
            str = '5'
          }
        } else {
          if (this.checkList[i] === '外延生产') {
            str = str + ',0'
          } else if (this.checkList[i] === '外延仓库') {
            str = str + ',1'
          } else if (this.checkList[i] === '外延品保') {
            str = str + ',2'
          } else if (this.checkList[i] === '芯片生产') {
            str = str + ',3'
          } else if (this.checkList[i] === '芯片品保') {
            str = str + ',4'
          } else if (this.checkList[i] === '芯片仓库') {
            str = str + ',5'
          }
        }
      }
      const params = {
        involveRange: str,
        newNo: this.rowInfo.newsNo,
        oldNo: this.rowInfo.newNo,
        operator: sessionStorage.getItem('User-Id'),
        remark: this.rowInfo.remark,
        waferId: this.rowInfo.waferId
      }
      add(params).then(res => {
        this.isDisabled = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.editDialogVisible = false
          this.fetchData()
        }
      }, res => {
        this.isDisabled = false
      })
    },
    // 取消
    resetForm() {
      this.editDialogVisible = false
    },
    exportAll() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/wy-data-maintain/export-data?waferId=${this.waferId}&operatorName=${this.operName}&startTime=${startTime}&endTime=${endTime}`)
    }
  }
}

