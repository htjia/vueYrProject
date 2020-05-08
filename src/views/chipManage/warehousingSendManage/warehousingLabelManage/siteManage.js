
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { xpWarehousLabel, customerList, deleteLabel, insert, update, imgfindById, findCommParams, findParamsById } from '@/api/chipManage/warehousingSendManage/warehousingLabelManage'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  directives: {
    'el-loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          /**
          * scrollHeight 获取元素内容高度(只读)
          * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
          * clientHeight 读取元素的可见高度(只读)
          * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
          * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
          */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value(1)
          } else if (this.scrollTop === 0) {
            binding.value(2)
          }
        })
      }
    }
  },
  data() {
    const valuecheck = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('变量名不能为空'))
      } else {
        callback()
      }
    }
    const valuecheck1 = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('SQL不能为空'))
      } else {
        callback()
      }
    }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      configDialogVisible: false,
      setDialogVisible: false,
      editNewDialogVisible: false,
      loading: false,
      list: [],
      userOptions: [],
      alread: '',
      alreadList: [],
      anotherLists: [],
      customerName: '',
      labelName: '',
      labelNames: '',
      customerLists: [],
      cuntomerNew: '',
      typeName: '',
      typeList: [
        {
          id: 0,
          name: '圆片'
        },
        {
          id: 1,
          name: '方片'
        }
      ],
      fileUrl: process.env.BASE_API + '/attachment/upload',
      dataId: '',
      uploadParams: {},
      imgName: '',
      fileNmae: '',
      imgId: '',
      fileId: '',
      bllist: [],
      selectList: [],
      machineForm: {
        newName: '',
        newSql: ''
      },
      isDisable: false,
      rules: {
        newName: [{ required: true, validator: valuecheck, trigger: 'blur' }],
        newSql: [{ required: true, validator: valuecheck1, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
    this.customerList()
  },
  methods: {
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
        this.dataId = res.data.dataId
        this.uploadParams = { dataId: this.dataId }
        if (res.data.suffix === 'btw') {
          this.fileNmae = res.data.path
          this.fileId = res.data.id
        } else {
          this.imgName = '/images/' + res.data.webPath
          this.imgId = res.data.id
        }
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
    imgfindById(id) {
      imgfindById({ id: id }).then(res => {
        this.imgName = '/images/' + res.data.webPath
      })
    },
    // 添加
    handleAdd() {
      this.isDisable = false
      this.uploadParams = {}
      this.dataId = ''
      this.labelNames = ''
      this.cuntomerNew = ''
      this.typeName = ''
      this.alread = ''
      this.imgName = ''
      this.fileNmae = ''
      this.imgId = ''
      this.fileId = ''
      this.bllist = []
      this.addDialogVisible = true
    },
    // 添加
    handleEdit(row) {
      this.isDisable = false
      this.dataId = row.id
      this.uploadParams = { dataId: this.dataId }
      this.labelNames = row.name
      this.cuntomerNew = parseInt(row.customer)
      this.typeName = row.sliceType
      this.alread = ''
      this.imgName = ''
      this.fileNmae = ''
      this.imgId = row.imageId
      this.fileId = row.fileId
      this.bllist = []
      this.editDialogVisible = true
      this.imgfindById(this.imgId)
      this.findParamsById(this.dataId)
    },
    findParamsById(id) {
      const params = {
        id: id
      }
      findParamsById(params).then(res => {
        for (const item of res.data) {
          this.bllist.push({
            param: item.param,
            sqlstr: item.sqlstr
          })
        }
      })
    },
    openAlready() {
      this.configDialogVisible = true
      findCommParams().then(res => {
        this.anotherLists = res.data
      })
    },
    handleSelectionChanges(data) {
      this.selectList = data
    },
    getTitle() {
      for (const info of this.selectList) {
        let flag = true
        for (const item of this.bllist) {
          if (info.param === item.param) {
            flag = false
            break
          }
        }
        if (flag) {
          this.bllist.push({
            param: info.param,
            sqlstr: info.sqlstr
          })
        }
      }
      this.configDialogVisible = false
    },
    openNew() {
      this.machineForm = {
        index: -1,
        newName: '',
        newSql: ''
      }
      this.setDialogVisible = true
    },
    sqlEdit(row, index) {
      this.machineForm = {
        index: index,
        newName: row.param,
        newSql: row.sqlstr
      }
      this.setDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    getSql(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.machineForm.index === -1) {
            this.bllist.push({
              param: this.machineForm.newName,
              sqlstr: this.machineForm.newSql
            })
          } else {
            this.bllist[this.machineForm.index] = {
              param: this.machineForm.newName,
              sqlstr: this.machineForm.newSql
            }
          }
          this.setDialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sqlDelete(index) {
      this.bllist.splice(index, 1)
    },
    // 添加提交
    submitForm() {
      if (this.labelNames === '') {
        this.$message({
          type: 'error',
          message: '请填写标签名称!'
        })
        return
      }
      if (this.cuntomerNew === '') {
        this.$message({
          type: 'error',
          message: '请选择客户!'
        })
        return
      }
      if (this.typeName === '') {
        this.$message({
          type: 'error',
          message: '请选择适用片型!'
        })
        return
      }
      if (this.imgId === '') {
        this.$message({
          type: 'error',
          message: '请上传图片!'
        })
        return
      }
      if (this.fileId === '') {
        this.$message({
          type: 'error',
          message: '请上传文件!'
        })
        return
      }
      if (this.bllist.length === 0) {
        this.$message({
          type: 'error',
          message: '请添加变量!'
        })
        return
      }
      this.isDisable = true
      const params = {
        creator: sessionStorage.getItem('User-Id'),
        customer: this.cuntomerNew,
        id: this.dataId,
        name: this.labelNames,
        params: this.bllist,
        sliceType: this.typeName,
        imageId: this.imgId,
        fileId: this.fileId
      }
      insert(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.addDialogVisible = false
          this.fetchData()
        }
      }, () => {
        this.isDisable = false
      })
    },
    // 添加提交
    editsubmitForm() {
      if (this.labelNames === '') {
        this.$message({
          type: 'error',
          message: '请填写标签名称!'
        })
        return
      }
      if (this.cuntomerNew === '') {
        this.$message({
          type: 'error',
          message: '请选择客户!'
        })
        return
      }
      if (this.typeName === '') {
        this.$message({
          type: 'error',
          message: '请选择适用片型!'
        })
        return
      }
      if (this.imgId === '') {
        this.$message({
          type: 'error',
          message: '请上传图片!'
        })
        return
      }
      if (this.fileId === '') {
        this.$message({
          type: 'error',
          message: '请上传文件!'
        })
        return
      }
      if (this.bllist.length === 0) {
        this.$message({
          type: 'error',
          message: '请添加变量!'
        })
        return
      }
      this.isDisable = true
      const params = {
        creator: sessionStorage.getItem('User-Id'),
        customer: this.cuntomerNew,
        id: this.dataId,
        name: this.labelNames,
        params: this.bllist,
        sliceType: this.typeName,
        imageId: this.imgId,
        fileId: this.fileId
      }
      update(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.editDialogVisible = false
          this.fetchData()
        }
      }, () => {
        this.isDisable = false
      })
    },
    // 遍历
    produceName() {
      let value = null
      for (const item of this.list) {
        if (this.alread === item.id) {
          value = item
          break
        }
      }
      this.findParamsById(this.alread)
      this.labelNames = value.name
      this.cuntomerNew = parseInt(value.customer)
      this.typeName = value.sliceType
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前标签信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteLabel(params).then(res => {
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
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        name: this.labelName,
        customer: this.customerName
      }
      xpWarehousLabel(params).then(res => {
        this.list = res.data
        this.listLoading = false
      })
    },
    customerList() {
      customerList().then(res => {
        this.customerLists = res.data
      })
    },
    clearCondition() {
      this.labelName = ''
      this.customerName = ''
      this.fetchData()
    },
    download(row) {
      window.open(process.env.BASE_API + `/attachment/downByDataId?id=${row.id}`, '_blank')
    }
  }
}

