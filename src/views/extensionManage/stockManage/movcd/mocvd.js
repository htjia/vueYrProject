
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { machineList } from '@/api/extensionManage/wyBasicInfoManage/mocvdInfo' // 机台查询
import { findMeasureAndCircle } from '@/api/extensionManage/wyBasicInfoManage/substrateInfo' // 尺寸类型
import { platterMocvdList, addPlatter, update, remove, findUseRecordList, abnormalDeal, printLabel } from '@/api/extensionManage/stockManage/mocvd'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateDppsName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入大盘片数'))
      } else {
        if (value === 0 || value < 0) {
          callback(new Error('大盘片数必须大于0'))
        } else {
          callback()
        }
      }
    }
    const validateEdsm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入额定寿命'))
      } else {
        if (value === 0 || value < 0) {
          callback(new Error('额定寿命必须大于0'))
        } else {
          callback()
        }
      }
    }
    const validateSycs = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入使用次数'))
      } else {
        if (this.mocvdForm.edsm !== '') {
          if (parseInt(value) > parseInt(this.mocvdForm.edsm)) {
            callback(new Error('使用次数不能大于额定寿命！'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    const validatePlatterNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入Platter_No后6位字符'))
      } else if (value.length < 6) {
        callback(new Error('尾部必须为6位字符'))
      } else if (this.mocvdForm.alphabet === '') {
        callback(new Error('请选择生成Platter_No'))
      } else {
        callback()
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
      showAbnormal: '',
      notBastic: false,
      tableKey: 1,
      machineName: '',
      list: [{}],
      alphabetList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      machineList: [],
      measureList: [],
      recordList: [],
      abnormalPlace: [],
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
        alphabet: '',
        cjmc: '',
        edsm: '',
        sycs: 0,
        measureId: '',
        ssjt: '',
        cjph: '',
        status: '',
        dpps: '',
        abnormalPlace: [],
        remark: ''
      },
      rules: {
        platterNo: [{ required: true, validator: validatePlatterNo, trigger: 'blur' }],
        cjmc: [{ required: true, message: '请输入厂家名称', trigger: 'blur' }],
        edsm: [{ required: true, validator: validateEdsm, trigger: 'blur' }],
        sycs: [{ required: true, validator: validateSycs, trigger: 'blur' }],
        measureId: [{ required: true, message: '请选择大盘尺寸', trigger: 'blur' }],
        ssjt: [{ required: true, message: '请选择所属机台', trigger: 'blur' }],
        cjph: [{ required: true, message: '请输入厂家盘号', trigger: 'blur' }],
        status: [{ required: true, message: '请选择当前状态', trigger: 'blur' }],
        dpps: [{ required: true, validator: validateDppsName, trigger: 'blur' }]
      },
      searchKeys: {
        platterNo: '',
        manufacturer: '',
        machine: '',
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
    this.machineListFun()
  },
  methods: {
    platterNum() {
      if (this.mocvdForm.platterNo < 0) {
        this.mocvdForm.platterNo = 1
      }
      if (this.mocvdForm.platterNo > 999999) {
        this.mocvdForm.platterNo = this.mocvdForm.platterNo.substr(0, 6)
      }
    },
    alphabetChange() {
      this.$refs.mocvdForm.validateField('platterNo')
    },
    machineChange(data) {
      this.machineList.map(item => {
        if (item.id === data) {
          this.machineName = item.code + '-'
        }
      })
    },
    setAbnormalPlace() {
      this.abnormalPlace = []
      this.circleList.map(item => {
        for (var i = parseInt(item.cricleStart); i < parseInt(item.cricleEnd) + 1; i++) {
          this.abnormalPlace.push(i)
        }
      })
    },
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
      if (row.cricleEnd !== '') {
        this.setAbnormalPlace()
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
      if (row.cricleStart !== '') {
        this.setAbnormalPlace()
      }
    },
    // 大盘使用记录导出
    exportDialogExcel() {
      console.log(this.platterNo)
      console.log(this.showAbnormal ? 'abnormal' : '')
      window.open(process.env.BASE_API + `/wyPlatterMocvd/exportUseRecord?platterNo=${this.platterNo}&showAbnormal=${this.showAbnormal ? 'abnormal' : ''}`)
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
      console.log(row)
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
          index: Math.random()
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
        this.setAbnormalPlace()
      }
    },
    // 获取机台
    machineListFun() {
      machineList({}).then(res => {
        this.machineList = res.data
      })
    },
    // 查询衬底尺寸
    fetchMeasureList() {
      findMeasureAndCircle({ type: 0 }).then(res => {
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
      this.setAbnormalPlace()
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
      this.searchKeys.machine = ''
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
      window.open(process.env.BASE_API + `/wyPlatterMocvd/exportExcel?platterNo=${this.searchKeys.platterNo}&machine=${this.searchKeys.machine}&manufacturer=${this.searchKeys.manufacturer}&startTime=${startTime}&endTime=${endTime}&status=${this.searchKeys.status}`)
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        platterNo: this.searchKeys.platterNo,
        machine: this.searchKeys.machine,
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
      this.machineName = ''
      this.mocvdForm.platterNo = ''
      this.mocvdForm.alphabet = ''
      this.mocvdForm.cjmc = ''
      this.mocvdForm.edsm = ''
      this.mocvdForm.sycs = 0
      this.mocvdForm.measureId = ''
      this.mocvdForm.ssjt = ''
      this.mocvdForm.cjph = ''
      this.mocvdForm.status = 0
      this.mocvdForm.dpps = ''
      this.mocvdForm.remark = ''
      this.circleList = []
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.mocvdForm.abnormalPlace = []
    },
    // 添加提交
    submitForm(formName) {
      console.log(this.circleList)
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
              cricle: i + 1,
              cricleStart: this.circleList[i].cricleStart,
              cricleEnd: this.circleList[i].cricleEnd
            })
          }
          const params = {
            platterNo: this.machineName + this.mocvdForm.alphabet + '-' + this.mocvdForm.platterNo,
            machine: this.mocvdForm.ssjt, // 所属机台
            manufacturer: this.mocvdForm.cjmc, // 厂家名称
            manufacturerPlatterNo: this.mocvdForm.cjph, // 厂家盘号
            ratedLife: this.mocvdForm.edsm, // 额定寿命
            useCount: this.mocvdForm.sycs, // 使用次数
            status: this.mocvdForm.status, // 当前状态
            measureId: this.mocvdForm.measureId, // 大盘尺寸
            slice: this.mocvdForm.dpps, // 大盘片数
            remark: this.mocvdForm.remark, // 备注
            excepitonSlice: this.mocvdForm.abnormalPlace.join(','),
            circleList: circleArr
          }
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
    // 打印条码
    handlePrint(row) {
      console.log(row)
      const contents = [
        [
          {
            value: row.platterNo,
            key: 'platterNo'
          },
          {
            value: row.machineName,
            key: 'machine'
          },
          {
            value: row.manufacturer,
            key: 'factory'
          }
        ]
      ]
      const params = {
        module: 'wyPlatterMocvd',
        contents
      }
      printLabel(params).then(res => {
        this.$message({
          type: 'success',
          message: '条码正在打印中，请稍候！'
        })
      })
    },
    // 编辑
    handleEdit(row) {
      this.fetchMeasureList()
      this.currentId = row.id
      this.mocvdForm.platterNo = row.platterNo
      this.mocvdForm.alphabet = 'A'
      this.mocvdForm.abnormalPlace = row.excepitonSlice === '' ? [] : row.excepitonSlice.split(',').map(Number)
      this.mocvdForm.ssjt = row.machine
      this.mocvdForm.cjmc = row.manufacturer
      this.mocvdForm.cjph = row.manufacturerPlatterNo
      this.mocvdForm.edsm = row.ratedLife
      this.mocvdForm.status = row.status
      this.mocvdForm.measureId = row.measureId
      this.mocvdForm.dpps = row.slice
      this.mocvdForm.remark = row.remark
      this.mocvdForm.sycs = row.useCount
      this.circleList = row.circleList
      this.setAbnormalPlace()
      this.editDialogVisible = true
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var circleArr = []
          this.circleList.forEach((item, index) => {
            circleArr.push({
              cricle: index + 1,
              cricleStart: item.cricleStart,
              cricleEnd: item.cricleEnd
            })
          })
          const params = {
            id: this.currentId,
            platterNo: this.mocvdForm.platterNo,
            machine: this.mocvdForm.ssjt, // 所属机台
            manufacturer: this.mocvdForm.cjmc, // 厂家名称
            manufacturerPlatterNo: this.mocvdForm.cjph, // 厂家盘号
            ratedLife: this.mocvdForm.edsm, // 额定寿命
            status: this.mocvdForm.status, // 当前状态
            measureId: this.mocvdForm.measureId, // 大盘尺寸
            slice: this.mocvdForm.dpps, // 大盘片数
            remark: this.mocvdForm.remark, // 备注
            excepitonSlice: this.mocvdForm.abnormalPlace.join(','),
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
      this.$confirm('此操作将永久删除该大盘信息, 是否继续?', '提示', {
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

