
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findBake, findUser, add, findPlatter } from '@/api/extensionManage/produceManage/roastProcess'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      list: [],
      userList: [],
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
      bakeOptions: [
        { name: 'BAKE-1' },
        { name: 'BAKE-2' },
        { name: 'BAKE-3' },
        { name: 'BAKE-4' }
      ],
      numbers: 0,
      userOptions: [],
      platterList: [
        { platterNo: '', id: '1' }, { platterNo: '', id: '2' }, { platterNo: '', id: '3' }, { platterNo: '', id: '4' }, { platterNo: '', id: '5' },
        { platterNo: '', id: '6' }, { platterNo: '', id: '7' }, { platterNo: '', id: '8' }, { platterNo: '', id: '9' }, { platterNo: '', id: '10' },
        { platterNo: '', id: '11' }, { platterNo: '', id: '12' }, { platterNo: '', id: '13' }, { platterNo: '', id: '14' }, { platterNo: '', id: '15' },
        { platterNo: '', id: '16' }, { platterNo: '', id: '17' }, { platterNo: '', id: '18' }, { platterNo: '', id: '19' }, { platterNo: '', id: '20' },
        { platterNo: '', id: '21' }, { platterNo: '', id: '22' }, { platterNo: '', id: '23' }, { platterNo: '', id: '24' }, { platterNo: '', id: '25' }
      ],
      searchKeys: {
        platterNo: '',
        bake: '',
        operator: ''
      },
      heatForm: {
        bakeNum: '',
        heatTime: 12,
        operator: ''
      },
      rules: {
        bakeNum: [{ required: true, message: '请选择BAKE炉号', trigger: 'blur' }],
        heatTime: [{ required: true, message: '请输入烘烤时间', trigger: 'blur' }],
        operator: [{ required: true, message: '请选择操作人', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
    this.findUserList()
  },
  methods: {
    clearSearch() {
      this.searchKeys.platterNo = ''
      this.searchKeys.bake = ''
      this.searchKeys.operator = ''
      this.beginDate = ''
      this.endDate = ''
    },
    findUserList() {
      findUser({}).then(res => {
        this.userList = res.data
      })
    },
    handleExport() {
      const startTime = this.beginDate === '' ? '' : this.formatDate(this.beginDate)
      const endTime = this.endDate === '' ? '' : this.formatDate(this.endDate)
      window.open(process.env.BASE_API + `/wyBake/export?platterNo=${this.searchKeys.platterNo}&bake=${this.searchKeys.bake}&operator=${this.searchKeys.operator}&startTime=${startTime}&endTime=${endTime}`)
    },
    inputBlur(row, index, e) {
      if (row.platterNo !== '') {
        const requestParams = {
          platterNo: row.platterNo
        }
        findPlatter(requestParams).then(res => {
          if (res.data === 0) {
            this.$message({
              type: 'error',
              message: '大盘编号非法!'
            })
            row.platterNo = ''
            this.numbers++
            if (this.numbers > 0) {
              this.numbers--
            }
          } else {
            this.numbers = 0
            var num = 0
            this.platterList.forEach((item) => {
              if (item.platterNo === row.platterNo) {
                num++
              }
            })
            if (num > 1) {
              this.$message({
                type: 'error',
                message: '大盘编号重复!'
              })
              row.platterNo = ''
              this.platterList.forEach((item) => {
                if (item.platterNo !== '') {
                  this.numbers++
                }
              })
              return false
            } else {
              this.$refs[row.id].blur()
              if (Object.keys(this.$refs).length - 1 === index) {
                index = -1
              }
              this.platterList.forEach((item) => {
                if (item.platterNo !== '') {
                  this.numbers++
                }
              })
              this.$refs[Object.keys(this.$refs)[index + 1]].focus()
            }
          }
        })
      } else {
        this.numbers = 0
        this.platterList.forEach((item) => {
          if (item.platterNo !== '') {
            this.numbers++
          }
        })
      }
    },
    deleteItem(row) {
      row.platterNo = ''
      this.numbers = 0
      this.platterList.map((item) => {
        if (item.platterNo !== '') {
          this.numbers++
        }
      })
    },
    // 上移
    handleUp(index) {
      if (index > 0) {
        const upDate = this.platterList[index - 1]
        this.platterList.splice(index - 1, 1)
        this.platterList.splice(index, 0, upDate)
      } else {
        this.$message({
          type: 'error',
          message: '已经是第一条，不可上移!'
        })
      }
    },
    // 下移
    handleDown(index) {
      if ((index + 1) === this.platterList.length) {
        this.$message({
          type: 'error',
          message: '已经是最后一条，不可下移!'
        })
      } else {
        const downDate = this.platterList[index + 1]
        this.platterList.splice(index + 1, 1)
        this.platterList.splice(index, 0, downDate)
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
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        platterNo: this.searchKeys.platterNo,
        bake: this.searchKeys.bake,
        operator: this.searchKeys.operator,
        startTime: this.beginDate === '' ? '' : this.formatDate(this.beginDate),
        endTime: this.endDate === '' ? '' : this.formatDate(this.endDate)
      }
      findBake(requestParams).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 添加
    handleAdd() {
      this.heatForm.siteType = ''
      this.heatForm.siteName = ''
      this.heatForm.siteStatus = ''
      this.platterList.forEach((item, index) => {
        item.platterNo = ''
      })
      this.addDialogVisible = true
      setTimeout(() => {
        this.$refs[Object.keys(this.$refs)[0]].focus()
      }, 100)
    },
    // 关闭
    handleClose(formName) {
      this.numbers = ''
      this.$refs[formName].resetFields()
    },
    getParams() {
      var pletterList = []
      this.platterList.forEach((item, index) => {
        if (item.platterNo !== '') {
          pletterList.push({
            location: index + 1,
            platterNo: item.platterNo
          })
        }
      })
      const params = {
        bake: this.heatForm.bakeNum,
        duration: this.heatForm.heatTime,
        operator: this.heatForm.operator,
        isOk: false,
        pletterList
      }
      return params
    },
    confirmSubmit() {
      var params = this.getParams()
      params.isOk = true
      add(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.addDialogVisible = false
          this.fetchData()
        }
      })
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.numbers === 0) {
            this.$message({
              type: 'error',
              message: '大盘实入数量不能为0!'
            })
            return false
          }
          const params = this.getParams()
          console.log(params)
          add(params).then(res => {
            if (res.code === 0) {
              if (res.data !== null) {
                this.$confirm(res.data, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  // 确定提交
                  this.confirmSubmit()
                }).catch(() => {
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
    }
  }
}

