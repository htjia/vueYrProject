
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getList, updateList } from '@/api/ipqc/basic/grindThicknessStandard'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateTest = (rule, value, callback) => {
      const num = new RegExp('[0-9]')
      value = value + ''
      if (value.trim().length === 0) {
        callback(new Error('内容不可为空'))
      } else {
        if (!num.test(value)) {
          callback(new Error('检验片数必须为正整数'))
        } else if (parseInt(value) < 0) {
          callback(new Error('检验片数必须为正整数'))
        } else if (parseInt(value) > 20) {
          callback(new Error('检验片数不得超过20'))
        } else {
          callback()
        }
      }
    }
    return {
      listLoading: false,
      editDialogVisible: false,
      isDisable: '',
      content: '',
      programForm: {
        name: '',
        id: 0
      },
      rules: {
        name: [{ required: true, validator: validateTest, trigger: 'blur' }]
      },
      list: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 查询
    fetchData() {
      this.listLoading = true
      getList().then(res => {
        this.list = res.data
        this.listLoading = false
      })
    },
    handleEdit(row) {
      this.programForm = {
        name: row.num,
        id: row.id
      }
      this.editDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.programForm.id,
            num: this.programForm.name
          }
          updateList(params).then(res => {
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
    }
  }
}

