
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { updateMachineStatus } from '@/api/extensionManage/wyBasicInfoManage/AlNiBasicInfo/AlNiCraft'
import { findCk, deleteCk, conversion, save, findSelect, customerList, findSingleList } from '@/api/pcChipCasting/applicationForDeposit'
import { findOutgoingRule, findPickWafer, findWaferCountByRule } from '@/api/chipManage/extensionStorageManage/outStorage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      rulesDialogVisible: false,
      detailDialogVisible: false,
      list: [],
      machineForm: {
        listStr: '',
        rules: '',
        version: '',
        types: '',
        djtype: '',
        customer: '',
        num: '',
        remark: ''
      },
      kcnum: 0,
      rules: {
        listStr: [{ required: true, message: '手动挑片不能为空', trigger: 'blur' }],
        rules: [{ required: true, message: '请选择挑片规则', trigger: 'blur' }],
        version: [{ required: true, message: '请输入版本', trigger: 'blur' }],
        types: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        djtype: [{ required: true, message: '请选择单据类型', trigger: 'blur' }],
        customer: [{ required: true, message: '请选择客户名称', trigger: 'blur' }],
        num: [{ required: true, message: '请输入挑片数量', trigger: 'blur' }]
      },
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
      ckNo: '',
      waferId: '',
      oddNum: '',
      ckList: [
        {
          id: 0,
          name: '出库单'
        },
        {
          id: 1,
          name: '备货单'
        }
      ],
      waferList: [],
      isCheck: false,
      isActive: 0,
      rowInfo: null,
      isDelete: true,
      isDelete1: true,
      djList: [],
      tpList: [],
      customersList: [],
      specialList: [],
      ruleName: '',
      version: '',
      contentList: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 单据信息/Wafer信息切换
    navClick(index) {
      this.isActive = index
    },
    findSingleList() {
      findSingleList().then(res => {
        this.djList = res.data
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    findSelect() {
      findSelect().then(res => {
        this.tpList = res.data
      })
    },
    clearAll() {
      this.beginDate = ''
      this.endDate = ''
      this.ckNo = ''
      this.waferId = ''
      this.oddNum = ''
      this.fetchData()
    },
    getNowFormatDate() {
      var today = new Date()
      return this.formatDate(today.getTime())
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
        startTime: this.formatDate(this.beginDate),
        endTime: this.formatDate(this.endDate),
        orderNo: this.oddNum,
        type: this.ckNo,
        timeType: 0,
        waferId: this.waferId
      }
      if (this.beginDate === '') {
        requestParams.startTime = ''
      }
      if (this.endDate === '') {
        requestParams.endTime = ''
      }
      if (this.ckNo === '') {
        requestParams.type = -1
      }
      findCk(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
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
    switchChange(row) {
      console.log(row)
      const param = {
        id: row.id,
        status: row.status ? 0 : 1
      }
      updateMachineStatus(param).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.fetchData()
      })
    },
    customerList() {
      customerList().then(res => {
        this.customersList = res.data
      })
    },
    // 添加
    handleAdd() {
      this.machineForm = {
        listStr: '',
        rules: '',
        version: '',
        types: 0,
        djtype: 1,
        customer: 16,
        num: '',
        remark: ''
      }
      this.kcnum = 0
      this.customerList()
      this.findSelect()
      this.findSingleList()
      this.isCheck = false
      this.addDialogVisible = true
    },
    setKC() {
      for (const item of this.tpList) {
        if (item.id === this.machineForm.rules) {
          this.findWaferCountByRuleFun(item.content)
          break
        }
      }
    },
    findWaferCountByRuleFun(content) {
      findWaferCountByRule({ ruleWhere: content }).then(res => {
        this.kcnum = res.data
      })
    },
    setCustomer() {
      if (this.machineForm.djtype === 1) {
        this.machineForm.customer = 16
      }
    },
    // 单击Run信息
    handleCurrentChange(row) {
      if (row === null) {
        return
      }
      this.rowInfo = row
      if (this.rowInfo.type === 1) {
        this.isDelete1 = false
      } else {
        this.isDelete1 = true
      }
      if (this.rowInfo.status === 0 || this.rowInfo.status === 1 || this.rowInfo.status === 3) {
        this.isDelete = false
      } else {
        this.isDelete = true
      }
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.kcnum = 0
    },
    // 挑片规则
    viewRules(row) {
      if (row.rules === '特殊挑片') {
        this.detailDialogVisible = true
        findPickWafer({ id: row.id }).then(res => {
          this.specialList = res.data
        })
      } else {
        this.rulesDialogVisible = true
        findOutgoingRule({ id: row.id }).then(res => {
          this.ruleName = res.data[0].name
          this.version = res.data[0].version
          this.contentList = res.data[0].contentList
        })
      }
    },
    getNum() {
      if (!this.isCheck || this.machineForm.listStr === '') {
        return
      }
      const str = this.machineForm.listStr.replace(/(\r\n|\n|\r)/gm, ',')
      const list = str.split(',')
      this.machineForm.num = list.filter(d => d.length > 0).length
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.kcnum < this.machineForm.num && !this.isCheck) {
            this.$message({
              type: 'error',
              message: '挑片数量不能大于库存数量!'
            })
            return
          }
          const params = {
            creator: sessionStorage.getItem('User-Id'),
            customer: this.machineForm.customer,
            orderType: this.machineForm.djtype,
            type: this.machineForm.types,
            pickNo: this.machineForm.num,
            ruleIds: '',
            waferIds: '',
            remark: this.machineForm.remark
          }
          if (!this.isCheck) {
            params.ruleIds = this.machineForm.rules
          } else {
            params.waferIds = this.machineForm.listStr.replace(/(\r\n|\n|\r)/gm, ',')
          }
          save(params).then(res => {
            if (res.code === 0) {
              if (res.data !== null && res.data.length > 0) {
                this.$message({
                  type: 'error',
                  message: res.data.join() + '查询不到！'
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.$refs[formName].resetFields()
                this.addDialogVisible = false
                this.fetchData()
              }
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
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete() {
      this.$confirm('此操作将永久删除当前单据信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: this.rowInfo.id,
          status: this.rowInfo.status
        }
        deleteCk(params).then(res => {
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
    // 转出库单
    conversion() {
      this.$confirm('转为出库单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: this.rowInfo.id
        }
        conversion(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.fetchData()
          }
        })
      })
    }
  }
}

