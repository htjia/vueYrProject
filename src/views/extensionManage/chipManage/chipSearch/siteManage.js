
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { add, update, remove } from '@/api/processManagement/siteManage'
import { queryAll, settingQuery, pendingSlice } from '@/api/processManagement/chipManage'
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
      siteType: '',
      siteName: '',
      siteStatus: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      anotherpageSize: 12,
      anotherpageNum: 1,
      anothertotalPage: 0,
      beginDate: '',
      endDate: '',
      RunID: '',
      WaferID: '',
      examineType: '',
      checkType: '',
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
      examineSelectOptions: [
        {
          id: 1,
          name: '通过'
        },
        {
          id: 0,
          name: '不通过'
        },
        {
          id: 2,
          name: '未审核'
        }
      ],
      anotherlist: [],
      isActive: 0,
      currentId: '',
      checkSelectOptions: []
    }
  },
  mounted() {
    this.fetchData()
    this.settingQuery()
  },
  methods: {
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
    settingQuery() {
      const params = {
        pageSize: 9999999,
        pageNum: 1
      }
      settingQuery(params).then(res => {
        this.checkSelectOptions = res.data.list
      })
    },
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    handleCurrentChange(row) {
      if (row !== null) {
        this.anotherpageSize = 1
        this.anotherpageNum = 12
        this.selectbillNo = row.machineCode
        this.rowInfo = row
        this.queryOneDetail()
      }
    },
    queryOneDetail() {
      const params = {
        pageSize: this.anotherpageSize,
        pageNum: this.anotherpageNum,
        mCode: this.selectbillNo
      }
      pendingSlice(params).then(res => {
        this.anotherlist = res.data.list
        this.anothertotalPage = parseInt(res.data.total)
        this.listLoading = false
      }, res => {
        this.listLoading = false
      })
    },
    // 每页数量改变
    anothersizeChange(pageSize) {
      this.anotherpageSize = pageSize
      this.queryOneDetail()
    },
    // 当前页数改变
    anothercurrentChange(pageNum) {
      this.panotherageNum = pageNum
      this.queryOneDetail()
    },
    clearAll() {
      this.beginDate = ''
      this.endDate = ''
      this.RunID = ''
      this.WaferID = ''
      this.checkType = ''
      this.examineType = ''
      this.pageNum = 1
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        runId: this.RunID,
        waferId: this.WaferID,
        editionType: this.checkType,
        auditResult: this.examineType,
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate)
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      queryAll(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      this.siteForm.siteType = ''
      this.siteForm.siteName = ''
      this.siteForm.siteStatus = ''
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            type: this.siteForm.siteType,
            name: this.siteForm.siteName,
            status: this.siteForm.siteStatus
          }
          add(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.addDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      this.notBastic = row.isbastic === 1
      this.currentId = row.id
      this.siteForm.siteType = row.type
      this.siteForm.siteName = row.name
      this.siteForm.siteStatus = row.status
      this.editDialogVisible = true
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            type: this.siteForm.siteType,
            name: this.siteForm.siteName,
            status: this.siteForm.siteStatus
          }
          update(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.editDialogVisible = false
              this.$refs[formName].resetFields()
              this.fetchData()
            }
          })
        } else {
          return false
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该站点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id
        }
        remove(param).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          }
        })
      })
    },
    exportAll() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/wy-give-slice/export-all?runId=${this.RunID}&waferId=${this.WaferID}&versionId=${this.checkType}&reviewStatus=${this.examineType}&startTime=${startTime}&endTime=${endTime}`)
    }
  }
}

