import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findTempList, add, update, remove, findMachineList } from '@/api/commonSet/labelManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      loading: false,
      list: [],
      labelName: '',
      pageSize: 14,
      pageNum: 1,
      totalPage: 0,
      deviceForm: {
        code: '',
        name: '',
        printId: '',
        fileId: '',
        id: ''
      },
      rules: {
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        printId: [{ required: true, message: '请选择打印机', trigger: 'blur' }]
      },
      machineOptions: [],
      fileUrl: process.env.BASE_API + '/attachment/upload',
      currentId: '',
      uploadParams: {}
    }
  },
  watch: {
  },
  created() {
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    findMachineList() {
      findMachineList().then(res => {
        this.machineOptions = res.data
      })
    },
    beforeUpload(file) {
      this.loading = true
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message({
          message: '文件大小不能超过 1MB!',
          type: 'error'
        })
        this.loading = false
      }
      return isLt2M
    },
    onSuccess(res, file, fileList) {
      this.loading = false
      if (res.code !== 0) {
        this.$message({
          type: 'error',
          message: res.message
        })
      } else {
        this.uploadParams = { dataId: this.dataId }
        this.deviceForm.fileId = res.data.id
        this.deviceForm.id = res.data.dataId
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      }
    },
    onError() {
      this.$message({
        type: 'error',
        message: '上传失败，请重试！'
      })
      this.loading = false
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
    // 点击查询
    queryClick() {
      this.pageNum = 1
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        name: this.labelName,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      findTempList(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        }
      })
    },
    // 添加
    handleAdd() {
      this.fileName = ''
      this.deviceForm = {
        code: '',
        name: '',
        printId: '',
        fileId: '',
        id: ''
      }
      this.findMachineList()
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.fileList = []
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.deviceForm.fileId !== '' && this.deviceForm.fileId !== undefined) {
            const params = {
              code: this.deviceForm.code,
              fileId: this.deviceForm.fileId,
              name: this.deviceForm.name,
              printId: this.deviceForm.printId,
              id: this.deviceForm.id
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
            this.$message({
              type: 'error',
              message: '文件上传失败!'
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改提交
    editsubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.deviceForm.fileId !== '' && this.deviceForm.fileId !== undefined) {
            const params = {
              code: this.deviceForm.code,
              fileId: this.deviceForm.fileId,
              name: this.deviceForm.name,
              printId: this.deviceForm.printId,
              id: this.deviceForm.id
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
            this.$message({
              type: 'error',
              message: '文件上传失败!'
            })
          }
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
    // 编辑
    handleEdit(row) {
      this.currentId = row.id
      this.deviceForm = {
        code: row.code,
        name: row.name,
        printId: row.printId,
        fileId: row.fileId,
        id: row.id
      }
      this.uploadParams = { dataId: row.id }
      this.findMachineList()
      this.editDialogVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        remove(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.editDialogVisible = false
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    clearCondition() {
      this.labelName = ''
      this.fetchData()
    },
    download(row) {
      window.open(process.env.BASE_API + `/attachment/downByDataId?id=${row.id}`, '_blank')
    }
  }
}
