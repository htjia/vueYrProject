
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { queryList, addFP, updateFP, queryLists, addDetail, updateDetail, deleteDetail } from '@/api/chipBasicInfoManage/codeManage/appearanceClassification'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const valuecheck = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('代码不能为空'))
      } else {
        callback()
      }
    }
    const valuecheck2 = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('异常描述不能为空'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      fpaddDialogVisible: false,
      editDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      userOptions: [],
      machineForm: {
        code: '',
        classifyId: '',
        exceptionRemark: '',
        isDispose: ''
      },
      rules: {
        code: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        classifyId: [{ required: true, message: '请选择副品分类', trigger: 'blur' }],
        exceptionRemark: [{ required: true, validator: valuecheck2, trigger: 'blur' }],
        isDispose: [{ required: true, message: '请选择是否异常处理', trigger: 'blur' }]
      },
      fpList: [],
      letList: [],
      classifyCode: '',
      detailCode: '',
      pageSize: 12,
      pageNum: 1,
      totalPage: 0,
      disPostList: [
        {
          id: 0,
          name: '否'
        },
        {
          id: 1,
          name: '是'
        }
      ],
      currentId: 0
    }
  },
  mounted() {
    this.fetchData()
    this.queryList()
    this.letLists()
  },
  methods: {
    tabClick(index) {
      this.activeTabIndex = index
    },
    queryList() {
      queryList().then(res => {
        this.fpList = res.data.list
      })
    },
    saveNewFP(row) {
      if (row.code.trim() === '') {
        this.$message({
          type: 'error',
          message: '请填写副品名称!'
        })
        return
      }
      const code = row.code.trim()
      if (code.toLowerCase() === 'a') {
        this.$message({
          type: 'error',
          message: '副品名称不能为A或a!'
        })
        return
      }
      const param = {
        code: row.code,
        remark: row.remark
      }
      addFP(param).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.queryList()
      })
    },
    letLists() {
      const params = {
        pageNum: 1,
        pageSize: 1000000,
        isShow: 1
      }
      queryLists(params).then(res => {
        this.letList = res.data.list
      })
    },
    updateFP(row) {
      if (row.code === '') {
        this.$message({
          type: 'error',
          message: '请填写副品名称!'
        })
        return
      }
      const code = row.code.trim()
      if (code.toLowerCase() === 'a') {
        this.$message({
          type: 'error',
          message: '副品名称不能为A或a!'
        })
        return
      }
      const param = {
        id: row.id,
        code: row.code,
        remark: row.remark
      }
      updateFP(param).then(res => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.queryList()
        this.fetchData()
      })
    },
    handleFP() {
      this.fpaddDialogVisible = true
      this.queryList()
    },
    addConfig() {
      this.fpList.push({
        code: '',
        id: 0,
        remark: ''
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
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    clearAll() {
      this.pageNum = 1
      this.classifyCode = ''
      this.detailCode = ''
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        classifyCode: this.classifyCode,
        detailCode: this.detailCode,
        isShow: 1
      }
      queryLists(params).then(res => {
        this.list = []
        for (const item of res.data.list) {
          const start = this.list.length
          const end = this.list.length + item.details.length
          for (const items of item.details) {
            var data = {
              classifyId: items.classifyId,
              code: items.code,
              createTime: items.createTime,
              creator: items.creator,
              creatorName: items.creatorName,
              exceptionRemark: items.exceptionRemark,
              id: items.id,
              isDispose: items.isDispose,
              remark: item.remark,
              fpCode: item.code,
              isStart: start,
              isEnd: end
            }
            this.list.push(data)
          }
        }
        console.log(this.list)
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ((columnIndex === 0 || columnIndex === 3) && row.isEnd !== row.isStart) {
        if (rowIndex === row.isStart) {
          return {
            rowspan: row.isEnd - row.isStart,
            colspan: 1
          }
        } else if (rowIndex !== row.isStart) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 添加
    handleAdd() {
      this.machineForm = {
        code: '',
        classifyId: '',
        exceptionRemark: '',
        isDispose: ''
      }
      this.queryList()
      this.addDialogVisible = true
    },
    // 修改
    handleEdit(row) {
      this.currentId = row.id
      this.machineForm = {
        code: row.code,
        classifyId: row.classifyId,
        exceptionRemark: row.exceptionRemark,
        isDispose: row.isDispose
      }
      this.queryList()
      this.editDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.editDialogVisible = false
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            code: this.machineForm.code,
            classifyId: this.machineForm.classifyId,
            exceptionRemark: this.machineForm.exceptionRemark,
            isDispose: this.machineForm.isDispose,
            creator: sessionStorage.getItem('User-Id')
          }
          addDetail(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.addDialogVisible = false
              this.fetchData()
              this.letLists()
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
            classifyId: this.machineForm.classifyId,
            exceptionRemark: this.machineForm.exceptionRemark,
            isDispose: this.machineForm.isDispose,
            creator: sessionStorage.getItem('User-Id')
          }
          updateDetail(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
              this.fetchData()
              this.letLists()
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
      this.editDialogVisible = false
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前外观信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteDetail(params).then(res => {
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

