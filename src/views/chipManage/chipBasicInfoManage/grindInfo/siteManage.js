import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryList, deletes, customerList, add, update, barCode, printLabel, getGrindingPlatterTypeList, printList } from '@/api/chipBasicInfoManage/grindInfo'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const valuecheck = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('盘号不能为空'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      printList: [{
        code: '',
        imgSrc: ''
      }],
      userOptions: [],
      machineForm: {
        code: '',
        type: ''
      },
      rules: {
        code: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        type: [{ required: true, message: '请选择盘类型', trigger: 'blur' }]
      },
      userLists: [],
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      currentId: 0,
      type: '',
      code: '',
      creator: '',
      panList: [
        {
          id: 0,
          name: '2寸片/10片式'
        },
        {
          id: 1,
          name: '2寸片/12片式'
        },
        {
          id: 2,
          name: '4寸片/4片式'
        },
        {
          id: 3,
          name: '4寸片/5片式'
        }
      ],
      imgSrc: ''
    }
  },
  mounted() {
    this.getGrindingPlatterTypeLists()
    this.fetchData()
    this.customerList()
  },
  methods: {
    getGrindingPlatterTypeLists() {
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      getGrindingPlatterTypeList(params).then(res => {
        this.panList = res.data.list
      })
    },
    // 查询
    customerList() {
      customerList().then(res => {
        this.userLists = res.data.list
      })
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearAll() {
      this.pageNum = 1
      this.type = ''
      this.code = ''
      this.creator = ''
      this.fetchData()
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
    printLabel() {
      if (this.machineForm.code === '') {
        this.$message({
          type: 'error',
          message: '请填写盘号!'
        })
        return
      }
      const params = {
        module: 'platterPrint',
        contents: [
          [
            { key: '芯片盘号打印', value: this.machineForm.code }
          ]
        ]
      }
      printLabel(params).then(res => {
        this.$message({
          type: 'success',
          message: '正在打印，请稍后!'
        })
      })
    },
    setimg() {
      if (this.machineForm.code === '') {
        this.$message({
          type: 'error',
          message: '请填写盘号!'
        })
        return
      }
      const params = [this.machineForm.code]
      barCode(params).then(res => {
        this.imgSrc = res.data[0]
      })
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        type: this.type,
        code: this.code,
        creator: this.creator
      }
      queryList(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 打印
    printCode() {
      this.listLoading = true
      const params = {
        type: this.type,
        code: this.code,
        creator: this.creator
      }
      printList(params).then(res => {
        this.listLoading = false
        this.printList = res.data
        setTimeout(() => {
          const head_str = '<html><head><title></title></head><body>'
          const foot_str = '</body></html>'
          const new_str = document.getElementById('printDivs').innerHTML
          const newWind = window.open('打印窗口', '_blank')
          newWind.document.write(head_str + new_str + foot_str)
          newWind.document.close()
          newWind.print()
          newWind.close()
        }, 1000)
      })
      // this.printList = []
      // for (const item of this.list) {
      //   const params = [item.code]
      //   barCode(params).then(res => {
      //     this.printList.push({
      //       code: item.code,
      //       imgSrc: res.data[0]
      //     })
      //   })
      // }
      // setTimeout(() => {
      //   const head_str = '<html><head><title></title></head><body>'
      //   const foot_str = '</body></html>'
      //   const new_str = document.getElementById('printDivs').innerHTML
      //   const newWind = window.open('打印窗口', '_blank')
      //   newWind.document.write(head_str + new_str + foot_str)
      //   newWind.document.close()
      //   newWind.print()
      //   newWind.close()
      // }, 1000)
    },
    // 添加
    handleAdd() {
      this.machineForm.code = ''
      this.machineForm.type = ''
      this.imgSrc = ''
      this.addDialogVisible = true
    },
    // 编辑
    handleEdit(row) {
      this.currentId = row.id
      this.machineForm.code = row.code
      this.machineForm.type = row.type
      this.imgSrc = ''
      this.editDialogVisible = true
      this.setimg()
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
            code: this.machineForm.code,
            type: this.machineForm.type,
            creator: sessionStorage.getItem('User-Id')
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
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加提交
    editsubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            code: this.machineForm.code,
            type: this.machineForm.type,
            creator: sessionStorage.getItem('User-Id')
          }
          update(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
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
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前信息, 是否继续?', '提示', {
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

