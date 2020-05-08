
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findTree } from '@/api/background/deptManager'
import { productList } from '@/api/chipManage/abnormalManage/reworkManage'
import { processList } from '@/api/chipBasicInfoManage/machineInfo'
import { getLog, getDataList, getDetail, deletes } from '@/api/abnormalBill/abnormalBill'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      showDialog: false,
      isActive: 0,
      list: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      beginDate: '',
      endDate: '',
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.endDate
          if (endDateVal) {
            return time.getTime() > endDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      grade: '',
      billNo: '',
      model: '',
      batchNo: '',
      types: '',
      typeList: [
        {
          id: 0,
          name: '原材料异常'
        },
        {
          id: 1,
          name: '制程异常'
        },
        {
          id: 2,
          name: '成品异常'
        },
        {
          id: 3,
          name: '出货异常'
        },
        {
          id: 4,
          name: '其他'
        }
      ],
      applicationSector: '',
      responsibleDept: '',
      reviewStatus: '',
      reviewList: [
        {
          id: 0,
          name: '待审核'
        },
        {
          id: 1,
          name: '通过'
        },
        {
          id: 2,
          name: '不通过'
        }
      ],
      schedule: '',
      scheduleList: [
        {
          id: 0,
          name: '待递交'
        },
        {
          id: 1,
          name: '品保已审核'
        },
        {
          id: 2,
          name: '返工、降级、报废、其他'
        },
        {
          id: 3,
          name: '产品分析中'
        }
      ],
      status: '',
      gradeList: [
        {
          id: 0,
          name: '一般'
        },
        {
          id: 1,
          name: '重大'
        }
      ],
      statusList: [
        {
          id: 2,
          name: '待审核'
        },
        {
          id: 3,
          name: '原因分析中'
        },
        {
          id: 4,
          name: '分析结果审核'
        },
        {
          id: 5,
          name: '改善对策追踪中'
        },
        {
          id: 6,
          name: '结案'
        }
      ],
      process: '',
      processList: [],
      treelist: [],
      logList: [],
      productLists: [],
      rowInfo: null,
      isShowMenu: {
        'abnormalBill-auditor': false
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
              if (items.path === 'abnormalBill') {
                for (const citems of items.children) {
                  if (citems.path === 'abnormalBillManage') {
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
    this.findTree()
    this.productList()
    this.processListpage()
  },
  methods: {
    addNew() {
      const record = {
        creator: sessionStorage.getItem('User-Id'),
        batchNo: '',
        details: [],
        row: {}
      }
      sessionStorage.removeItem('errorRowInfo')
      sessionStorage.setItem('addAbnormalBill', JSON.stringify(record))
      this.$router.push({ path: '/abnormalBill/addAbnormalBill' })
    },
    processListpage() {
      const params = {
        pageNum: 1,
        pageSize: 100000
      }
      processList(params).then(res => {
        this.processList = res.data.list
      })
    },
    productList() {
      productList().then(res => {
        this.productLists = res.data
      })
    },
    findTree() {
      const params = {
        code: '',
        name: ''
      }
      findTree(params).then(res => {
        if (res.code === 0) {
          this.treelist = res.data
          for (const item of this.treelist) {
            if (item.name === '品保部') {
              sessionStorage.setItem('deptIds', item.id)
              break
            }
          }
          this.fetchData()
        }
      })
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
    // 时间戳转yyyy-mm-dd
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
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        grade: this.grade,
        process: this.process,
        billNo: this.billNo !== null ? this.billNo.trim() : '',
        model: this.model,
        batchNo: this.batchNo !== null ? this.batchNo.trim() : '',
        type: this.types,
        applicationSector: this.applicationSector,
        responsibleDept: this.responsibleDept,
        reviewStatus: this.reviewStatus,
        isPb: 0,
        schedule: this.schedule,
        status: this.status,
        ifJa: this.isActive === 0 ? '' : this.isActive === 1 ? 0 : 1,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      getDataList(params).then(res => {
        res.data.list.map(item => {
          let ts = 0
          if (item.resultDetails.temporaryStrategy === null || item.resultDetails.temporaryStrategy.review === 2) {
            ts = 0
          } else if (item.resultDetails.temporaryStrategy !== null && (item.resultDetails.temporaryStrategy.auditor === null || item.resultDetails.temporaryStrategy.review === 0)) {
            ts = 1
          } else {
            ts = 2
          }
          let ts1 = -1
          if (ts === 2) {
            if (item.resultDetails.temporaryTrace === null || item.resultDetails.temporaryTrace.review === 2) {
              ts1 = 0
            } else if (item.resultDetails.temporaryTrace !== null && (item.resultDetails.temporaryTrace.auditor === null || item.resultDetails.temporaryTrace.review === 0)) {
              ts1 = 1
            } else {
              ts1 = 2
            }
          }
          let ts2 = -1
          if (item.resultDetails.perpetualStrategy.length > 0) {
            for (let x = 0; x < item.resultDetails.perpetualStrategy.length; x++) {
              for (const itemz of this.treelist) {
                if (itemz.id === item.resultDetails.analyses[x].departmentId) {
                  item.resultDetails.perpetualStrategy[x].deptName = itemz.name
                  break
                }
              }
            }
          }
          if (item.resultDetails.perpetualStrategy.length > 0 && item.resultDetails.perpetualStrategy.auditor !== null) {
            let flag = true
            for (const items of item.resultDetails.perpetualStrategy) {
              if (items.review !== 1) {
                flag = false
                break
              }
            }
            if (flag) {
              if (item.resultDetails.perpetualTrace === null || item.resultDetails.perpetualTrace.creator === null || item.resultDetails.perpetualTrace.review === 2) {
                ts2 = 0
              } else if (item.resultDetails.perpetualTrace !== null && item.resultDetails.perpetualTrace.auditor === null) {
                ts2 = 1
              } else {
                ts2 = 2
              }
            } else {
              ts2 = 2
            }
          }
          let ts3 = 0
          if (item.resultDetails.analyses.length > 0) {
            for (let x = 0; x < item.resultDetails.analyses.length; x++) {
              for (const itemz of this.treelist) {
                if (itemz.id === item.resultDetails.analyses[x].departmentId) {
                  item.resultDetails.analyses[x].deptName = itemz.name
                  break
                }
              }
            }
            let flag = true
            for (const items of item.resultDetails.analyses) {
              if (items.review !== 1 || items.qcReview === 2) {
                flag = false
                break
              }
            }
            if (flag) {
              ts3 = 1
            } else {
              ts3 = 2
            }
          } else {
            ts3 = 2
          }
          item.showType = ts
          item.showType1 = ts1
          item.showType2 = ts2
          item.showType3 = ts3
        })
        this.list = res.data.list
        console.log(this.list)
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 重置
    clearSearch() {
      this.grade = ''
      this.billNo = ''
      this.model = ''
      this.batchNo = ''
      this.types = ''
      this.applicationSector = ''
      this.responsibleDept = ''
      this.reviewStatus = ''
      this.schedule = ''
      this.status = ''
      this.beginDate = ''
      this.endDate = ''
      this.batchNo = ''
      this.process = ''
      this.handleSearch()
    },
    tabClick(index) {
      this.isActive = index
      this.handleSearch()
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    viewDetailCard(row) {
      this.showDialog = true
      const params = {
        abnormalId: row.id
      }
      getLog(params).then(res => {
        if (res.code === 0) {
          this.logList = res.data
        }
      })
    },
    checkError(row) {
      this.rowInfo = row
      const params = {
        abnormalId: row.id
      }
      getDetail(params).then(res => {
        if (res.code === 0) {
          if (this.rowInfo.status === 2) {
            if (this.rowInfo.status > 1 && this.rowInfo.resultDetails.exceptionFinish !== null && this.rowInfo.resultDetails.exceptionFinish.auditor === null) {
              res.data.findType = 15
            } else if (this.rowInfo.showType3 === 1) {
              res.data.findType = 5
            } else {
              res.data.findType = 2
            }
          } else {
            if (this.rowInfo.status === 1) {
              res.data.findType = 1
            } else if (this.rowInfo.status > 1 && this.rowInfo.resultDetails.exceptionFinish !== null && this.rowInfo.resultDetails.exceptionFinish.auditor === null) {
              res.data.findType = 15
            } else if (this.rowInfo.status === 4 && this.rowInfo.showType < 2) {
              res.data.findType = 7
            } else if (this.rowInfo.status === 5 && this.rowInfo.showType1 < 2) {
              res.data.findType = 9
            } else if (this.rowInfo.status > 3 && this.rowInfo.showType2 === 1) {
              res.data.findType = 13
            } else if (this.rowInfo.status === 3 && this.rowInfo.showType3 === 1) {
              res.data.findType = 5
            }
          }
          res.data.rowInfo = this.rowInfo
          sessionStorage.setItem('errorRowInfo', JSON.stringify(res.data))
          this.$router.push({ path: '/abnormalBill/addAbnormalBill' })
        }
      })
    },
    setEdit(row) {
      this.rowInfo = row
      const params = {
        abnormalId: row.id
      }
      getDetail(params).then(res => {
        if (res.code === 0) {
          if (this.rowInfo.status === 0) {
            res.data.findType = 0
          } else if (this.rowInfo.resultDetails.exceptionFinish !== null) {
            res.data.findType = 14
          } else if ((this.rowInfo.status === 5 && (this.rowInfo.resultDetails.exceptionFinish === null || this.rowInfo.resultDetails.exceptionFinish.auditor === null)) || (this.rowInfo.status === 4 && this.rowInfo.resultDetails.exceptionFinish !== null && this.rowInfo.resultDetails.exceptionFinish.review === 2)) {
            if (this.rowInfo.showType1 === 0 && this.rowInfo.resultDetails.exceptionFinish === null) {
              res.data.findType = 8
            } else if (this.rowInfo.showType2 === 0 && this.rowInfo.resultDetails.exceptionFinish === null) {
              res.data.findType = 12
            } else {
              res.data.findType = 14
            }
          } else if (this.rowInfo.status === 4 && this.rowInfo.showType !== 2) {
            res.data.findType = 6
          } else if (this.rowInfo.status === 5 && this.rowInfo.showType1 !== 2) {
            res.data.findType = 8
          } else if (this.rowInfo.status > 3 && this.rowInfo.showType2 !== -1 && this.rowInfo.showType2 === 0) {
            res.data.findType = 12
          }
          res.data.rowInfo = this.rowInfo
          sessionStorage.setItem('errorRowInfo', JSON.stringify(res.data))
          this.$router.push({ path: '/abnormalBill/addAbnormalBill' })
        }
      })
    },
    findInfo(row) {
      this.rowInfo = row
      const params = {
        abnormalId: row.id
      }
      getDetail(params).then(res => {
        if (res.code === 0) {
          res.data.findType = -1
          res.data.findPB = 1
          res.data.rowInfo = this.rowInfo
          sessionStorage.setItem('errorRowInfo', JSON.stringify(res.data))
          this.$router.push({ path: '/abnormalBill/addAbnormalBill' })
        }
      })
    },
    importDBF() {
      let startTime = this.formatDate(this.beginDate)
      let endTime = this.formatDate(this.endDate)
      if (this.beginDate === '') {
        startTime = ''
      }
      if (this.endDate === '') {
        endTime = ''
      }
      if (this.isReal === null) {
        this.isReal = ''
      }
      window.open(process.env.BASE_API + `/xpProductExceptionAbnormalController/exportData?exportType=1&grade=${this.grade}&startTime=${startTime}&endTime=${endTime}&billNo=${this.billNo === null ? '' : this.billNo}&model=${this.model === null ? '' : this.model}&batchNo=${this.batchNo === null ? '' : this.batchNo}&type=${this.types === null ? '' : this.types}&applicationSector=${this.applicationSector === null ? '' : this.applicationSector}&responsibleDept=${this.responsibleDept === null ? '' : this.responsibleDept}&reviewStatus=${this.reviewStatus === null ? '' : this.reviewStatus}&schedule=${this.schedule === null ? '' : this.schedule}&status=${this.status === null ? '' : this.status}&isPb=0&ifJa=${this.isActive === 0 ? '' : this.isActive === 1 ? 0 : 1}`)
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('删除后将不再有此条记录, 确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deletes(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum = this.pageNum - 1
            }
            this.fetchData()
          }
        })
      })
    }
  }
}

