import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getList, add, update, remove, addSiteDevice, getSiteDevice, removeSiteDevice } from '@/api/clientSet/clientSet'
import { deviceList } from '@/api/commonSet/collectDevice'
import { dataDestList } from '@/api/commonSet/dataDestination'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateName = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (value.trim().length === 0) {
        callback(new Error('请输入采集点名称'))
      } else {
        if (pattern.test(value)) {
          callback(new Error('采集点名称不能包含特殊字符'))
        } else {
          callback()
        }
      }
    }
    return {
      routers: [],
      routerValues: [],
      checkAll: false,
      checkedRouters: ['department', 'departmentDetail'],
      isIndeterminate: true,
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      permissionVisible: false,
      editEqptVisible: false,
      list: [],
      siteDeviceList: [],
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      name: '',
      clientForm: {
        collectionPointName: '',
        siteMode: '0',
        machineType: '',
        showType: 0,
        machineCode: '',
        showCode: 0,
        useMenu: '',
        showMenu: 0,
        batchNo: '',
        showBatch: 0,
        collectionPointIp: ''
      },
      rules: {
        collectionPointName: [{ required: true, validator: validateName, trigger: 'blur' }]
      },
      currentId: '',
      deviceList: [],
      dataDestList: [],
      checkedList: [],
      checkedRadio: '',
      searchkey: ''
    }
  },
  watch: {
  },
  created() {
    this.fetchData()
    this.getDeviceList()
  //  this.getDataDestList()
  },
  mounted() {
  },
  methods: {
    getSiteDeviceFun() {
      const requestParams = {
        pageSize: 1000,
        pageNum: 1,
        siteId: this.currentId
      }
      getSiteDevice(requestParams).then(res => {
        if (res.code === 0) {
          this.siteDeviceList = res.data.list
        }
      })
    },
    getDataDestList() {
      const requestParams = {
        pageSize: 10000,
        pageNum: 1,
        searchkey: ''
      }
      dataDestList(requestParams).then(res => {
        if (res.code === 0) {
          this.dataDestList = res.data.list
        }
      })
    },
    getDeviceList() {
      const requestParams = {
        pageSize: 10000,
        pageNum: 1,
        searchkey: ''
      }
      deviceList(requestParams).then(res => {
        this.deviceList = res.data.list
      })
    },
    handleEditEqpt(row) {
      this.currentId = row.id
      this.getSiteDeviceFun()
      this.checkedRadio = ''
      this.checkedList = []
      this.editEqptVisible = true
    },
    addDeviceDirection() {
      if (this.checkedRadio === '') {
        this.$message({
          type: 'error',
          message: '请选择设备!'
        })
        return false
      }
      // if (this.checkedList.length === 0) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择数据去向!'
      //   })
      //   return false
      // }
      const requestParams = {
        deviceId: this.checkedRadio,
        directId: this.checkedList.join(','),
        siteId: this.currentId
      }
      addSiteDevice(requestParams).then(res => {
        this.getSiteDeviceFun()
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
        searchkey: this.searchkey
      }
      getList(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        }
      })
    },
    // 添加
    handleAdd() {
      this.clientForm.collectionPointName = ''
      this.clientForm.siteMode = '1'
      this.clientForm.collectionPointIp = ''
      this.clientForm.machineCode = ''
      this.clientForm.showCode = 0
      this.clientForm.machineType = ''
      this.clientForm.showType = 0
      this.clientForm.useMenu = ''
      this.clientForm.showMenu = 0
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
            siteIp: this.clientForm.collectionPointIp,
            machineCode: this.clientForm.machineCode,
            showCode: this.clientForm.showCode,
            machineType: this.clientForm.machineType,
            showType: this.clientForm.showType,
            useMenu: this.clientForm.useMenu,
            showMenu: this.clientForm.showMenu,
            batchNo: this.clientForm.batchNo,
            showBatch: this.clientForm.showBatch,
            siteName: this.clientForm.collectionPointName,
            siteMode: this.clientForm.siteMode
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
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
          //  siteIp: this.clientForm.collectionPointIp,
            siteName: this.clientForm.collectionPointName,
            siteMode: this.clientForm.siteMode,
            machineCode: this.clientForm.machineCode,
            showCode: this.clientForm.showCode,
            machineType: this.clientForm.machineType,
            showType: this.clientForm.showType,
            useMenu: this.clientForm.useMenu,
            showMenu: this.clientForm.showMenu,
            batchNo: this.clientForm.batchNo,
            showBatch: this.clientForm.showBatch,
            id: this.currentId
          }
          update(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
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
      this.editDialogVisible = false
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      this.currentId = row.id
      // this.clientForm.collectionPointIp = row.siteIp
      this.clientForm.collectionPointName = row.siteName
      this.clientForm.siteMode = row.siteMode.toString()
      this.clientForm.machineCode = row.machineCode
      this.clientForm.showCode = row.showCode
      this.clientForm.machineType = row.machineType
      this.clientForm.showType = row.showType
      this.clientForm.useMenu = row.useMenu
      this.clientForm.showMenu = row.showMenu
      this.clientForm.showBatch = row.showBatch
      this.editDialogVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该配置, 是否继续?', '提示', {
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
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    handleDeleteSiteDevice(row) {
      this.$confirm('此操作将永久删除该配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        removeSiteDevice(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getSiteDeviceFun()
          }
        })
      }).catch(() => {
      })
    }
  }
}
