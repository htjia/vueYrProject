import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { departQuery } from '@/api/alarmRules'
import { findNotice, addNotice, remove } from '@/api/message'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateFile = (rule, value, callback) => {
      if (this.$refs.upload.uploadFiles.length === 0) {
        callback(new Error('请选择要上传的文件'))
        this.$message({
          type: 'error',
          message: '请选择要上传的文件!'
        })
      } else {
        if (this.$refs.upload.uploadFiles[0].size / 1024 / 1024 > 3) {
          callback(new Error('文件大小不能大于3Mb'))
          this.$message({
            type: 'error',
            message: '文件大小不能大于3Mb!'
          })
        }
        callback()
      }
    }
    const validateRange = (rule, value, callback) => {
      if (this.$refs.tree.getCheckedNodes().length === 0) {
        callback(new Error('请选择发布范围'))
      } else {
        callback()
      }
    }
    const validateFileType = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入文件类型'))
      } else {
        if (value.trim().length > 10) {
          callback(new Error('文件类型长度不能大于10'))
        } else {
          callback()
        }
      }
    }
    return {
      routers: [],
      routerValues: [],
      searchkey: '',
      checkAll: false,
      isIndeterminate: true,
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      editSerialPortVisible: false,
      fileParsingVisible: false,
      internetAccessVisible: false,
      list: [],
      fileList: [],
      pageSize: 15,
      pageNum: 1,
      communication: '1',
      totalPage: 0,
      name: '',
      noticeForm: {
        name: '',
        content: '',
        issueRange: '',
        file: []
      },
      rules: {
        name: [{ required: true, message: '请输入公告名称', trigger: 'blur' }],
        content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
        issueRange: [{ required: true, validator: validateRange, trigger: 'blur' }],
        file: [{ required: true, validator: validateFile, trigger: 'change' }]
      },
      typeOptions: [
        {
          id: '0',
          name: '串口'
        },
        {
          id: '1',
          name: '文件解析'
        },
        {
          id: '2',
          name: '网口'
        }
      ],
      serialPortForm: {
        serialPort: '0',
        overTime: '3000',
        btl: '9600',
        check: '2',
        txfs: '0',
        sjw: '0',
        tzw: '0'
      },
      fileForm: {
        fileType: '.csv',
        action: '0'
      },
      internetForm: {
        ipAddress: '127.0.0.1',
        portNumber: '50001',
        timeInterval: '10000',
        iDeviceId: '0'
      },
      internetRules: {
        ipAddress: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
        portNumber: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
        timeInterval: [{ required: true, message: '请输入超时时间', trigger: 'blur' }],
        iDeviceId: [{ required: true, message: '请输入I设备ID', trigger: 'blur' }]
      },
      fileRules: {
        fileType: [{ required: true, validator: validateFileType, trigger: 'blur' }]
      },
      serialPortRules: {
        overTime: [{ required: true, message: '请输入超时时间', trigger: 'blur' }],
        serialPort: [{ required: true, message: '请选择串口', trigger: 'change' }],
        btl: [{ required: true, message: '请选择波特率', trigger: 'change' }],
        check: [{ required: true, message: '请选择校验规则', trigger: 'change' }]
      },
      serialPortOptions: [
        { id: '0', name: 'COM1' },
        { id: '1', name: 'COM2' },
        { id: '2', name: 'COM3' },
        { id: '3', name: 'COM4' },
        { id: '4', name: 'COM5' },
        { id: '5', name: 'COM6' },
        { id: '6', name: 'COM7' },
        { id: '7', name: 'COM8' },
        { id: '8', name: 'COM9' },
        { id: '9', name: 'COM10' }
      ],
      btlOptions: [
        { id: '110', name: '110' },
        { id: '300', name: '300' },
        { id: '600', name: '600' },
        { id: '1200', name: '1200' },
        { id: '2400', name: '2400' },
        { id: '4800', name: '4800' },
        { id: '9600', name: '9600' },
        { id: '14400', name: '14400' },
        { id: '19200', name: '19200' },
        { id: '28800', name: '28800' },
        { id: '33600', name: '33600' },
        { id: '38400', name: '38400' },
        { id: '56000', name: '56000' },
        { id: '57600', name: '57600' },
        { id: '115200', name: '115200' },
        { id: '128000', name: '128000' },
        { id: '256000', name: '256000' }
      ],
      checkOptions: [
        { id: '0', name: '无校验' },
        { id: '1', name: '奇校验' },
        { id: '2', name: '偶校验' },
        { id: '3', name: '标志校验' },
        { id: '4', name: '空格校验' }
      ],
      fileUrl: process.env.BASE_API + '/attachment/upload',
      fileName: '',
      treeList: [],
      selectedUser: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isEditDeleted: false,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
      currentId: '',
      hasFile: false,
      loading: false
    }
  },
  watch: {
  },
  created() {
    this.fetchData()
    this.getOrganization()
  },
  mounted() {
  },
  methods: {
    handleDelete(row) {
      const param = {
        id: row.id
      }
      this.$confirm(`是否确认删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
    },
    // 下载附件
    exportFill(fill) {
      window.open(process.env.BASE_API + `/attachment/down?id=${fill.id}`)
    },
    getOrganization() {
      departQuery().then(res => {
        this.treeList = res.data
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    onSuccess(res, file, fileList) {
      this.fileName = res.data.dataId
    },
    handleRemove(file, fileList) {
      console.log(fileList)
      this.hasFile = fileList.length > 0
      this.$refs.upload.uploadFiles = fileList
      this.isEditDeleted = true
      // this.$refs.noticeForm.validateField('file')
    },
    uploadChange(file, fileList) {
      this.hasFile = fileList.length > 0
      this.$refs.upload.uploadFiles = fileList
      this.$refs.noticeForm.validateField('file')
    },
    onExceed() {
      this.$message({
        type: 'error',
        message: '最多可以上 1 份附件!'
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
    handleSearch(data) {
      this.pageNum = 1
      this.searchkey = data
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const requestParams = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        title: this.searchkey
      }
      findNotice(requestParams).then(res => {
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
      this.noticeForm.name = ''
      this.noticeForm.content = ''
      this.addDialogVisible = true
      this.hasFile = false
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys([])
      }, 200)
    },
    // 关闭
    handleClose(formName) {
      this.fileList = []
      this.$refs[formName].resetFields()
    },
    getSelectedUserId(list) {
      list.map(item => {
        if (item.children.length === 0 && item.type === 2) {
          this.selectedUser.push(item.id)
        } else {
          this.getSelectedUserId(item.children)
        }
      })
    },
    // 添加提交
    submitForm(formName) {
      this.$refs.upload.submit()
      this.getSelectedUserId(this.$refs.tree.getCheckedNodes())
      console.log(this.selectedUser)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.hasFile) {
            this.$refs.upload.submit()
          }
          this.loading = true
          setTimeout(() => {
            const userIdsArr = Array.from(new Set(this.selectedUser))
            const params = {
              title: this.noticeForm.name,
              content: this.noticeForm.content,
              id: this.fileName,
              type: 0,
              userIds: userIdsArr.join(',')
            }
            addNotice(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.$refs.tree.setCheckedKeys([])
                this.loading = false
                this.$refs[formName].resetFields()
                this.addDialogVisible = false
                this.fetchData()
              }
            })
          }, 3000)
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
