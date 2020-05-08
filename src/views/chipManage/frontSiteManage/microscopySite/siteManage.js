
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { findAlnMachine, remove, addAlnMachine, updateMachineStatus } from '@/api/extensionManage/wyBasicInfoManage/AlNiBasicInfo/AlNiCraft'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      activeTabIndex: 0,
      list: [],
      userOptions: [],
      machineForm: {
        code: '',
        name: '',
        remark: ''
      },
      rules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    tabClick(index) {
      this.activeTabIndex = index
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: 1,
        pageSize: 10000
      }
      findAlnMachine(params).then(res => {
        res.data.list.map((item) => {
          item.status = item.status === 0
        })
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
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
    // 添加
    handleAdd() {
      this.machineForm.code = ''
      this.machineForm.name = ''
      this.machineForm.remark = ''
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
            code: this.machineForm.code,
            name: this.machineForm.name,
            remark: this.machineForm.remark,
            status: 0
          }
          addAlnMachine(params).then(res => {
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
      this.$refs[formName].resetFields()
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm('此操作将永久删除当前机台信息, 是否继续?', '提示', {
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
      })
    }
  }
}

