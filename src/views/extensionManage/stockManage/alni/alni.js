
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findMeasureAndCircle } from '@/api/extensionManage/wyBasicInfoManage/substrateInfo' // 尺寸类型
import { platterMocvdList, addPlatter, update, remove, findUseRecordList, abnormalDeal } from '@/api/extensionManage/stockManage/alNi'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateDppsName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入大盘片数'))
      } else {
        // if (reg.test(value)) {
        //   callback(new Error('大盘片数必须为正整数'))
        // }
        if (value === 0 || value < 0) {
          callback(new Error('大盘片数必须大于0'))
        } else {
          callback()
        }
      }
    }
    const validateEdsm = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入额定天数'))
      } else {
        if (value === 0 || value < 0) {
          callback(new Error('额定天数必须大于0'))
        } else {
          callback()
        }
      }
    }
    return {
      hiddenAbnormal: false,
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      selectTheadVisble: false,
      platterCircleVisble: false,
      platterUsageLogVisble: false,
      notBastic: false,
      tableKey: 1,
      list: [{}],
      measureList: [],
      recordList: [],
      platterCircleList: [],
      circleList: [],
      defaultFormThead: [],
      siteType: '',
      siteName: '',
      siteStatus: '',
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
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
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
        // shortcuts: [{
        //   text: '今天',
        //   onClick(picker) {
        //     picker.$emit('pick', new Date())
        //   }
        // }]
      },
      siteOptions: [
        {
          id: 0,
          name: '前段'
        },
        {
          id: 1,
          name: '后段'
        }
      ],
      siteSelectOptions: [
        {
          id: '',
          name: '全部'
        },
        {
          id: 0,
          name: '前段站点'
        },
        {
          id: 1,
          name: '后段站点'
        }
      ],
      siteStatusOptions: [
        {
          id: 0,
          name: '启用'
        },
        {
          id: 1,
          name: '停用'
        }
      ],
      userOptions: [
        {
          id: 0,
          name: '使用中'
        },
        {
          id: 1,
          name: '已报废'
        },
        {
          id: 2,
          name: '禁用'
        }
      ],
      mocvdForm: {
        platterNo: '',
        cjmc: '',
        edsm: '',
        measureId: '',
        ssjt: '',
        cjph: '',
        status: '',
        dpps: '',
        remark: '',
        clearRemark: ''
      },
      rules: {
        platterNo: [{ required: true, message: '请输入Platter_No', trigger: 'blur' }],
        cjmc: [{ required: true, message: '请输入厂家名称', trigger: 'blur' }],
        edsm: [{ required: true, validator: validateEdsm, trigger: 'blur' }],
        measureId: [{ required: true, message: '请选择大盘尺寸', trigger: 'blur' }],
        ssjt: [{ required: true, message: '请选择所属机台', trigger: 'blur' }],
        cjph: [{ required: true, message: '请输入厂家盘号', trigger: 'blur' }],
        status: [{ required: true, message: '请选择当前状态', trigger: 'blur' }],
        dpps: [{ required: true, validator: validateDppsName, trigger: 'blur' }]
      },
      searchKeys: {
        platterNo: '',
        manufacturer: '',
        status: ''
      },
      currentId: '',
      platterNo: '',
      currentRow: '',
      cumulativeUsage: '',
      surplusUsage: '',
      currentCircle: '',
      selectedCircleItem: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    circleStartInputChange(row, index) {
      if ((parseInt(row.cricleEnd) - parseInt(row.cricleStart)) < 0 || (parseInt(row.cricleEnd) - parseInt(row.cricleStart)) === 0) {
        this.$message({
          type: 'error',
          message: '结束值不能小于等于开始值!'
        })
        row.cricleStart = ''
        return
      }
      if (index !== 0) {
        if (parseInt(this.circleList[index].cricleStart) - parseInt(this.circleList[index - 1].cricleEnd) < 0 || parseInt(this.circleList[index].cricleStart) - parseInt(this.circleList[index - 1].cricleEnd) === 0) {
          this.$message({
            type: 'error',
            message: 'circle值不能有重叠部分!'
          })
          row.cricleStart = ''
          return
        }
      }
      this.mocvdForm.dpps = 0
      for (var i = 0; i < this.circleList.length; i++) {
        if (this.circleList[i].cricleEnd !== '' && this.circleList[i].cricleStart !== '') {
          this.mocvdForm.dpps += (Number(this.circleList[i].cricleEnd) - Number(this.circleList[i].cricleStart)) + 1
        }
      }
    },
    circleEndInputChange(row, index) {
      if ((parseInt(row.cricleEnd) - parseInt(row.cricleStart)) < 0 || (parseInt(row.cricleEnd) - parseInt(row.cricleStart)) === 0) {
        this.$message({
          type: 'error',
          message: '结束值不能小于等于开始值!'
        })
        row.cricleEnd = ''
        return
      }
      if (index !== this.circleList.length - 1) {
        if (parseInt(this.circleList[index].cricleEnd) - parseInt(this.circleList[index + 1].cricleStart) > 0 || parseInt(this.circleList[index].cricleEnd) - parseInt(this.circleList[index + 1].cricleStart) === 0) {
          this.$message({
            type: 'error',
            message: 'circle值不能有重叠部分!'
          })
          row.cricleEnd = ''
          return
        }
      }
      this.mocvdForm.dpps = 0
      for (var i = 0; i < this.circleList.length; i++) {
        console.log(this.circleList[i].cricleEnd)
        if (this.circleList[i].cricleEnd !== '' && this.circleList[i].cricleStart !== '') {
          this.mocvdForm.dpps += (Number(this.circleList[i].cricleEnd) - Number(this.circleList[i].cricleStart)) + 1
        }
      }
    },
    // 查看大盘使用详情
    viewPlatterUsageLog(row) {
      this.currentRow = row
      this.cumulativeUsage = (row.useCount - 0) + '/' + (row.ratedLife - 0)
      this.surplusUsage = (row.ratedLife - 0) - (row.useCount - 0) < 0 ? 0 : (row.ratedLife - 0) - (row.useCount - 0)
      this.platterNo = row.platterNo
      const params = {
        platterNo: row.platterNo,
        showAbnormal: this.showAbnormal
      }
      findUseRecordList(params).then(res => {
        res.data.map((item) => {
          item['shortGrowTime'] = item.growTime.substr(0, 10)
        })
        this.recordList = res.data
      })
      this.platterUsageLogVisble = true
    },
    // 只看异常
    handleAbnormal(data) {
      this.showAbnormal = data ? 'abnormal' : ''
      this.viewPlatterUsageLog(this.currentRow)
    },
    // 忽略异常
    handleOverlook(row) {
      const params = {
        id: row.id
      }
      abnormalDeal(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.viewPlatterUsageLog(this.currentRow)
      })
    },
    // 查看大盘使用详情关闭
    closePlatterUsageLog() {
      this.showAbnormal = ''
    },
    // 查看table circle 详情
    viewCircleDetail(row) {
      this.platterCircleVisble = true
      this.platterCircleList = row.circleList
    },
    circleCurrentChange(row) {
      this.selectedCircleItem = row
    },
    // 新增circle
    addCircle() {
      this.circleList.push(
        {
          cricleStart: '',
          cricleEnd: '',
          index: this.circleList.length
        },
      )
    },
    // 删除circle
    deleteCircle() {
      var deleteNum = ''
      if (!this.selectedCircleItem) {
        this.$message({
          type: 'error',
          message: '请在左侧选择要删除的circle!'
        })
      } else {
        this.circleList.forEach((item, index) => {
          if (item.index === this.selectedCircleItem.index) {
            deleteNum = index
          }
        })
        this.circleList.splice(deleteNum, 1)
        this.mocvdForm.dpps = 0
        for (var i = 0; i < this.circleList.length; i++) {
          console.log(this.circleList[i].cricleEnd)
          if (this.circleList[i].cricleEnd !== '' && this.circleList[i].cricleStart !== '') {
            this.mocvdForm.dpps += (Number(this.circleList[i].cricleEnd) - Number(this.circleList[i].cricleStart)) + 1
          }
        }
      }
    },
    // 查询衬底尺寸
    fetchMeasureList() {
      findMeasureAndCircle({ type: 1 }).then(res => {
        this.measureList = res.data
      })
    },
    // 大盘尺寸选择改变
    measureIdChange(id) {
      this.measureList.map((item) => {
        if (item.id === id) {
          this.circleList = [...item.circleList]
        }
      })
      this.mocvdForm.dpps = 0
      for (var i = 0; i < this.circleList.length; i++) {
        this.circleList[i].index = i
        if (this.circleList[i].cricleEnd !== '' && this.circleList[i].cricleStart !== '') {
          this.mocvdForm.dpps += (Number(this.circleList[i].cricleEnd) - Number(this.circleList[i].cricleStart)) + 1
        }
      }
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
    // 时间戳转yyyy-mm-dd
    formatDate(timeStamp) {
      var date = new Date(timeStamp)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    },
    // 重置
    clearSearch() {
      this.searchKeys.platterNo = ''
      this.searchKeys.manufacturer = ''
      this.searchKeys.status = ''
      this.beginDate = ''
      this.endDate = ''
      this.handleSearch()
    },
    // 导出
    exportExcel() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/wyPlatterAln/exportExcel?platterNo=${this.searchKeys.platterNo}&manufacturer=${this.searchKeys.manufacturer}&startTime=${startTime}&endTime=${endTime}&status=${this.searchKeys.status}`)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        platterNo: this.searchKeys.platterNo,
        manufacturer: this.searchKeys.manufacturer,
        status: this.searchKeys.status,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      platterMocvdList(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      this.fetchMeasureList()
      this.mocvdForm.platterNo = ''
      this.mocvdForm.cjmc = ''
      this.mocvdForm.edsm = ''
      this.mocvdForm.measureId = ''
      this.mocvdForm.cjph = ''
      this.mocvdForm.status = 0
      this.mocvdForm.dpps = ''
      this.mocvdForm.remark = ''
      this.mocvdForm.clearRemark = ''
      this.circleList = []
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
          if (this.circleList.length === 0) {
            this.$message({
              type: 'error',
              message: 'circle值不能为空!'
            })
            return false
          }
          var circleArr = []
          for (let i = 0; i < this.circleList.length; i++) {
            if (this.circleList[i].cricleStart === '') {
              this.$message({
                type: 'error',
                message: 'circle开始值不能为空!'
              })
              return false
            }
            if (this.circleList[i].cricleEnd === '') {
              this.$message({
                type: 'error',
                message: 'circle结束值不能为空!'
              })
              return false
            }
            if (this.circleList[i].cricleStart < 1) {
              this.$message({
                type: 'error',
                message: 'circle值必须大于0!'
              })
              return false
            }
            if (this.circleList[i].cricleEnd < 1) {
              this.$message({
                type: 'error',
                message: 'circle值必须大于0!'
              })
              return false
            }
            if (this.circleList[i].cricleStart - this.circleList[i].cricleEnd > -1) {
              this.$message({
                type: 'error',
                message: 'circle结束值必须大于开始值!'
              })
              return false
            }
            if (i !== 0) {
              if (this.circleList[i - 1].cricleEnd - this.circleList[i].cricleStart > -1) {
                this.$message({
                  type: 'error',
                  message: 'circle值不能有重叠部分!'
                })
                return false
              }
            }
            circleArr.push({
              cricle: i,
              cricleStart: this.circleList[i].cricleStart,
              cricleEnd: this.circleList[i].cricleEnd
            })
          }
          const params = {
            platterNo: this.mocvdForm.platterNo,
            manufacturer: this.mocvdForm.cjmc, // 厂家名称
            manufacturerPlatterNo: this.mocvdForm.cjph, // 厂家盘号
            ratedLife: this.mocvdForm.edsm, // 额定寿命
            status: this.mocvdForm.status, // 当前状态
            measureId: this.mocvdForm.measureId, // 大盘尺寸
            slice: this.mocvdForm.dpps, // 大盘片数
            remark: this.mocvdForm.remark, // 备注
            clearRemark: this.mocvdForm.clearRemark, // 备注
            circleList: circleArr
          }
          console.log(params)
          addPlatter(params).then(res => {
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
          console.log('error submit!!')
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
      this.fetchMeasureList()
      this.currentId = row.id
      this.mocvdForm.platterNo = row.platterNo
      this.mocvdForm.cjmc = row.manufacturer
      this.mocvdForm.cjph = row.manufacturerPlatterNo
      this.mocvdForm.edsm = row.ratedLife
      this.mocvdForm.status = row.status
      this.mocvdForm.measureId = row.measureId
      this.mocvdForm.dpps = row.slice
      this.mocvdForm.remark = row.remark
      this.mocvdForm.clearRemark = row.clearRemark
      this.circleList = row.circleList
      this.editDialogVisible = true
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var circleArr = []
          this.circleList.forEach((item, index) => {
            circleArr.push({
              cricle: index,
              cricleStart: item.cricleStart,
              cricleEnd: item.cricleEnd
            })
          })
          const params = {
            id: this.currentId,
            platterNo: this.mocvdForm.platterNo,
            manufacturer: this.mocvdForm.cjmc, // 厂家名称
            manufacturerPlatterNo: this.mocvdForm.cjph, // 厂家盘号
            ratedLife: this.mocvdForm.edsm, // 额定寿命
            status: this.mocvdForm.status, // 当前状态
            measureId: this.mocvdForm.measureId, // 大盘尺寸
            slice: this.mocvdForm.dpps, // 大盘片数
            remark: this.mocvdForm.remark, // 备注
            clearRemark: this.mocvdForm.clearRemark, // 备注
            circleList: circleArr
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
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该衬底信息, 是否继续?', '提示', {
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
            if (this.list.length === 1 && this.pageNum !== 1) {
              this.pageNum -= 1
            }
            this.fetchData()
          }
        })
      })
    }
  }
}

