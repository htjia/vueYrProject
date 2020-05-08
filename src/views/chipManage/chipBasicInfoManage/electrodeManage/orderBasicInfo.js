
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import {
  findElecMateList,
  saveElecMate,
  findMaterialSelect
} from '@/api/chipBasicInfoManage/electrodeManage'

export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      open: false,
      listLoading: false,
      addDialogVisible: false,
      name: '', // 客户名称
      activeTabIndex: 0,
      pageNum: 1,
      pageSize: 15,
      totalPage: 0,
      list: [],
      substrateForm: {
        name: '',
        code: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }]
      },
      selectList: []
    }
  },
  mounted() {
    findMaterialSelect({ materialType: 0 }).then(res => {
      this.selectList = res.data
      this.KHfindList()
    })
  },
  methods: {
    // 查询筛选条件
    handleSearch() {
      this.KHfindList()
    },
    close() {
      this.open = false
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.KHfindList()
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.KHfindList()
    },
    // 查询衬底厂家
    KHfindList() {
      findElecMateList().then(res => {
        this.list = []
        for (const item of res.data) {
          var data = item
          data.isEdit = false
          if (data.materialIds === null) {
            data.materialIds = ''
            data.materialNames = ''
            data.materialIdinfos = []
          } else {
            const split = data.materialIds.split(',')
            var lists = []
            for (const item of split) {
              lists.push(parseInt(item + ''))
            }
            data.materialIdinfos = lists
          }
          this.list.push(data)
        }
      })
    },
    setEdit(index) {
      if (this.list[index].isEdit) {
        if (this.list[index].materialIds === null) {
          this.list[index].materialIdinfos = []
        } else {
          const split = this.list[index].materialIds.split(',')
          var lists = []
          for (const item of split) {
            lists.push(parseInt(item + ''))
          }
          this.list[index].materialIdinfos = lists
        }
      }
      this.list[index].isEdit = !this.list[index].isEdit
    },
    save(row) {
      if (row.materialIdinfos === '') {
        this.$message({
          type: 'error',
          message: '请选择材料!'
        })
        return
      }
      const params = {
        electrodeId: row.electrodeId,
        materialIds: row.materialIdinfos.join()
      }
      saveElecMate(params).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.KHfindList()
      })
    },
    // 添加
    handleAdd() {
      this.open = false
      this.substrateForm.name = ''
      this.substrateForm.code = ''
      this.substrateForm.remark = ''
      this.addDialogVisible = true
      setTimeout(() => {
        this.$refs.name.focus()
      }, 100)
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}

