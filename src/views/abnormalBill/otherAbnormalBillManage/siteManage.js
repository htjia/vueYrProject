
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
      statusList: [
        {
          id: 0,
          name: '待处理'
        },
        {
          id: 1,
          name: '待确认'
        },
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
      },
      deptId: ''
    }
  },
  mounted() {
    var _this = this
    setTimeout(function() {
      const roleInfo = sessionStorage.getItem('roleInfo')
      const href = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
      if (roleInfo !== undefined && roleInfo !== null) {
        const roleList = JSON.parse(roleInfo)
        for (const item of roleList) {
          if (href === 'otherAbnormalBillManageck') {
            if (item.path === 'warehouseManage') {
              for (const items of item.children) {
                if (items.path === 'abnormalBillck') {
                  for (const citems of items.children) {
                    if (citems.path === 'otherAbnormalBillManageck') {
                      if (citems.funIds !== null) {
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
          } else if (href === 'otherAbnormalBillManagewy') {
            if (item.path === 'wyproductionManage') {
              for (const items of item.children) {
                if (items.path === 'abnormalBillwy') {
                  for (const citems of items.children) {
                    if (citems.path === 'otherAbnormalBillManagewy') {
                      if (citems.funIds !== null) {
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
          } else if (href === 'otherAbnormalBillManagesc') {
            if (item.path === 'productionManage') {
              for (const items of item.children) {
                if (items.path === 'abnormalBillsc') {
                  for (const citems of items.children) {
                    if (citems.path === 'otherAbnormalBillManagesc') {
                      if (citems.funIds !== null) {
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
          } else if (href === 'otherAbnormalBillManagexp') {
            if (item.path === 'xpproductionManage') {
              for (const items of item.children) {
                if (items.path === 'abnormalManage') {
                  for (const citems of items.children) {
                    if (citems.path === 'otherAbnormalBillManagexp') {
                      if (citems.funIds !== null) {
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
          } else if (href === 'otherAbnormalBillManagegy') {
            if (item.path === 'processManagement') {
              for (const items of item.children) {
                if (items.path === 'abnormalBillgy') {
                  for (const citems of items.children) {
                    if (citems.path === 'otherAbnormalBillManagegy') {
                      if (citems.funIds !== null) {
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
        }
      }
    }, 500)
    this.getInfo()
  },
  methods: {
    getInfo() {
      const params = {
        code: '',
        name: ''
      }
      findTree(params).then(res => {
        if (res.code === 0) {
          this.treelist = res.data
          const href = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
          for (const item of this.treelist) {
            if (href === 'otherAbnormalBillManagewy' && item.name === '外延部') {
              this.deptId = item.id
              sessionStorage.setItem('deptIds', item.id)
              break
            } else if (href === 'otherAbnormalBillManagexp' && item.name === '芯片部') {
              this.deptId = item.id
              sessionStorage.setItem('deptIds', item.id)
              break
            } else if (href === 'otherAbnormalBillManagegy' && item.name === '技术部') {
              this.deptId = item.id
              sessionStorage.setItem('deptIds', item.id)
              break
            } else if (href === 'otherAbnormalBillManagesc' && item.name === '生产管理部') {
              this.deptId = item.id
              sessionStorage.setItem('deptIds', item.id)
              break
            } else if (href === 'otherAbnormalBillManageck' && item.name === '厂务部') {
              this.deptId = item.id
              sessionStorage.setItem('deptIds', item.id)
              break
            }
          }
          this.fetchData()
          this.productList()
          this.processListpage()
        }
      })
    },
    addNew() {
      const href = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
      const record = {
        creator: sessionStorage.getItem('User-Id'),
        batchNo: '',
        details: [],
        row: {}
      }
      if (href === 'otherAbnormalBillManageck') {
        sessionStorage.removeItem('errorRowInfo')
        sessionStorage.setItem('addAbnormalBill', JSON.stringify(record))
        this.$router.push({ path: '/abnormalBillck/addAbnormalBillck' })
      } else if (href === 'otherAbnormalBillManagewy') {
        sessionStorage.removeItem('errorRowInfo')
        sessionStorage.setItem('addAbnormalBill', JSON.stringify(record))
        this.$router.push({ path: '/abnormalBillwy/addAbnormalBillwy' })
      } else if (href === 'otherAbnormalBillManagesc') {
        sessionStorage.removeItem('errorRowInfo')
        sessionStorage.setItem('addAbnormalBill', JSON.stringify(record))
        this.$router.push({ path: '/abnormalBillsc/addAbnormalBillsc' })
      } else if (href === 'otherAbnormalBillManagexp') {
        this.$router.push({ path: '/abnormalManage/productionAbnormalhidexp' })
      } else if (href === 'otherAbnormalBillManagegy') {
        sessionStorage.removeItem('errorRowInfo')
        sessionStorage.setItem('addAbnormalBill', JSON.stringify(record))
        this.$router.push({ path: '/abnormalBillgy/addAbnormalBillgy' })
      }
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
      const href = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
      for (const item of this.treelist) {
        if (href === 'otherAbnormalBillManagewy' && item.name === '外延部') {
          this.deptId = item.id
          break
        } else if (href === 'otherAbnormalBillManagexp' && item.name === '芯片部') {
          this.deptId = item.id
          break
        } else if (href === 'otherAbnormalBillManagegy' && item.name === '技术部') {
          this.deptId = item.id
          break
        } else if (href === 'otherAbnormalBillManagesc' && item.name === '生产管理部') {
          this.deptId = item.id
          break
        } else if (href === 'otherAbnormalBillManageck' && item.name === '厂务部') {
          this.deptId = item.id
          break
        }
      }
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        grade: this.grade,
        billNo: this.billNo !== null ? this.billNo.trim() : '',
        model: this.model,
        batchNo: this.batchNo !== null ? this.batchNo.trim() : '',
        process: this.process,
        type: this.types,
        applicationSector: this.isActive === 0 ? this.deptId : this.applicationSector,
        responsibleDept: this.isActive === 1 ? this.deptId : this.responsibleDept,
        reviewStatus: this.reviewStatus,
        schedule: this.schedule,
        status: this.status,
        ifZp: this.isActive === 0 ? '' : 0,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      getDataList(params).then(res => {
        res.data.list.map(item => {
          let ts3 = 0
          if (item.resultDetails.analyses.length > 0 && (item.resultDetails.analyses[0].creator === null || item.resultDetails.analyses[0].review === 2 || item.resultDetails.analyses[0].qcReview === 2)) {
            ts3 = 0
          } else if (item.resultDetails.analyses.length > 0 && (item.resultDetails.analyses[0].auditor === null || item.resultDetails.analyses[0].review === 0)) {
            ts3 = 1
          } else {
            ts3 = 2
          }
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
          if (item.resultDetails.perpetualStrategy.length > 0 && (item.resultDetails.perpetualStrategy[0].content === null || item.resultDetails.perpetualStrategy[0].review === 2)) {
            ts2 = 0
          } else if (item.resultDetails.perpetualStrategy.length > 0 && (item.resultDetails.perpetualStrategy[0].auditor === null || item.resultDetails.perpetualStrategy[0].review === 0)) {
            ts2 = 1
          } else {
            ts2 = 2
          }
          item.showType = ts
          item.showType1 = ts1
          item.showType2 = ts2
          item.showType3 = ts3
        })
        this.list = res.data.list
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
    setNew(row) {
      this.rowInfo = row
      const params = {
        abnormalId: row.id,
        nowDeptId: sessionStorage.getItem('deptId')
      }
      getDetail(params).then(res => {
        if (res.code === 0) {
          if (this.isActive === 0) {
            res.data.findType = 0
          } else {
            if (this.rowInfo.status > 3 && this.rowInfo.showType2 !== 2) {
              res.data.findType = 10
            } else {
              res.data.findType = 3
            }
          }
          res.data.rowInfo = this.rowInfo
          sessionStorage.setItem('errorRowInfo', JSON.stringify(res.data))
          const href = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
          if (href === 'otherAbnormalBillManageck') {
            this.$router.push({ path: '/abnormalBillck/addAbnormalBillck' })
          } else if (href === 'otherAbnormalBillManagewy') {
            this.$router.push({ path: '/abnormalBillwy/addAbnormalBillwy' })
          } else if (href === 'otherAbnormalBillManagesc') {
            this.$router.push({ path: '/abnormalBillsc/addAbnormalBillsc' })
          } else if (href === 'otherAbnormalBillManagexp') {
            this.$router.push({ path: '/abnormalManage/addAbnormalBillxp' })
          } else if (href === 'otherAbnormalBillManagegy') {
            this.$router.push({ path: '/abnormalBillgy/addAbnormalBillgy' })
          }
        }
      })
    },
    checkNew(row) {
      this.rowInfo = row
      const params = {
        abnormalId: row.id,
        nowDeptId: sessionStorage.getItem('deptId')
      }
      getDetail(params).then(res => {
        if (res.code === 0) {
          if (this.isActive === 0) {
            res.data.findType = 1
          } else {
            if (this.rowInfo.status === 3 || this.rowInfo.status === 2) {
              res.data.findType = 4
            } else if (this.rowInfo.status > 3 && this.rowInfo.showType2 > 0) {
              res.data.findType = 11
            } else {
              res.data.findType = 3
            }
          }
          res.data.rowInfo = this.rowInfo
          sessionStorage.setItem('errorRowInfo', JSON.stringify(res.data))
          const href = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
          if (href === 'otherAbnormalBillManageck') {
            this.$router.push({ path: '/abnormalBillck/addAbnormalBillck' })
          } else if (href === 'otherAbnormalBillManagewy') {
            this.$router.push({ path: '/abnormalBillwy/addAbnormalBillwy' })
          } else if (href === 'otherAbnormalBillManagesc') {
            this.$router.push({ path: '/abnormalBillsc/addAbnormalBillsc' })
          } else if (href === 'otherAbnormalBillManagexp') {
            this.$router.push({ path: '/abnormalManage/addAbnormalBillxp' })
          } else if (href === 'otherAbnormalBillManagegy') {
            this.$router.push({ path: '/abnormalBillgy/addAbnormalBillgy' })
          }
        }
      })
    },
    findInfo(row) {
      this.rowInfo = row
      const params = {
        abnormalId: row.id,
        nowDeptId: sessionStorage.getItem('deptId')
      }
      getDetail(params).then(res => {
        if (res.code === 0) {
          res.data.findType = -1
          res.data.rowInfo = this.rowInfo
          sessionStorage.setItem('errorRowInfo', JSON.stringify(res.data))
          const href = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
          if (href === 'otherAbnormalBillManageck') {
            this.$router.push({ path: '/abnormalBillck/addAbnormalBillck' })
          } else if (href === 'otherAbnormalBillManagewy') {
            this.$router.push({ path: '/abnormalBillwy/addAbnormalBillwy' })
          } else if (href === 'otherAbnormalBillManagesc') {
            this.$router.push({ path: '/abnormalBillsc/addAbnormalBillsc' })
          } else if (href === 'otherAbnormalBillManagexp') {
            this.$router.push({ path: '/abnormalManage/addAbnormalBillxp' })
          } else if (href === 'otherAbnormalBillManagegy') {
            this.$router.push({ path: '/abnormalBillgy/addAbnormalBillgy' })
          }
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
      window.open(process.env.BASE_API + `/xpProductExceptionAbnormalController/exportData?exportType=${this.isActive === 0 ? '0' : '2'}&grade=${this.grade}&startTime=${startTime}&endTime=${endTime}&billNo=${this.billNo === null ? '' : this.billNo}&model=${this.model === null ? '' : this.model}&batchNo=${this.batchNo === null ? '' : this.batchNo}&type=${this.types === null ? '' : this.types}&applicationSector=${this.isActive === 0 ? this.deptId : this.applicationSector}&responsibleDept=${this.isActive === 1 ? this.deptId : this.responsibleDept}&reviewStatus=${this.reviewStatus === null ? '' : this.reviewStatus}&schedule=${this.schedule === null ? '' : this.schedule}&status=${this.status === null ? '' : this.status}&ifZp=${this.isActive === 0 ? '' : 0}`)
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

